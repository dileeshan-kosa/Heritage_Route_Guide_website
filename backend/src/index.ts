import fastify from "fastify";
import cors from "@fastify/cors";
import bcrypt from "bcryptjs";
import db from "./db.js";
import { INITIAL_TOWNS } from "./seed-data.js";

const server = fastify({ logger: true });

// Register CORS
server.register(cors, {
  origin: "*", // Adjust in production
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

// Seed database if empty
try {
  const townCount = db.prepare("SELECT count(*) as count FROM towns").get() as { count: number };
  if (townCount && townCount.count === 0) {
    console.log("Seeding database with initial towns and places data...");
    const insertTown = db.prepare(`
      INSERT INTO towns (id, name, sinhalaName, description, order_num, coordinates_x, coordinates_y, lat, lng)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertPlace = db.prepare(`
      INSERT INTO places (town_id, type, name, details, contact)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const transaction = db.transaction(() => {
      for (const town of INITIAL_TOWNS) {
        insertTown.run(
          town.id,
          town.name,
          town.sinhalaName || null,
          town.description,
          town.order_num,
          town.coordinates.x,
          town.coordinates.y,
          town.lat,
          town.lng
        );
        
        const categories = ["police", "fuel", "hotels", "hospitals", "history"] as const;
        for (const cat of categories) {
          const items = town[cat];
          if (items) {
            const placeType = cat === "hotels" ? "hotel" : cat === "history" ? "history" : cat === "hospitals" ? "hospital" : cat === "police" ? "police" : "fuel";
            for (const item of items) {
              insertPlace.run(
                town.id,
                placeType,
                (item as any).name || (item as any).title,
                (item as any).details || (item as any).description || null,
                (item as any).contact || null
              );
            }
          }
        }
      }
    });
    transaction();
    console.log("Database seeding completed.");
  }
} catch (err) {
  console.error("Error during database seeding:", err);
}

// Health check
server.get("/health", async () => {
  return { status: "OK" };
});

// GET /api/towns
server.get("/api/towns", async (request, reply) => {
  try {
    const towns = db.prepare("SELECT * FROM towns ORDER BY order_num ASC").all() as any[];
    const formattedTowns = towns.map((town) => {
      const places = db.prepare("SELECT * FROM places WHERE town_id = ?").all(town.id) as any[];
      
      const formatPlaces = (type: string) =>
        places
          .filter((p) => p.type === type)
          .map((p) => ({
            id: p.id,
            name: p.name,
            details: p.details || undefined,
            contact: p.contact || undefined,
          }));

      return {
        id: town.id,
        name: town.name,
        sinhalaName: town.sinhalaName || undefined,
        description: town.description,
        order: town.order_num,
        coordinates: { x: town.coordinates_x, y: town.coordinates_y },
        lat: town.lat,
        lng: town.lng,
        hospitals: formatPlaces("hospital"),
        police: formatPlaces("police"),
        fuel: formatPlaces("fuel"),
        hotels: formatPlaces("hotel"),
        history: formatPlaces("history").map(h => ({ title: h.name, description: h.details || "", id: h.id })),
      };
    });
    return formattedTowns;
  } catch (error) {
    server.log.error(error);
    return reply.status(500).send({ error: "Failed to fetch town data" });
  }
});

// POST /api/places
server.post("/api/places", async (request, reply) => {
  const { town_id, type, name, details, contact } = request.body as any;
  if (!town_id || !type || !name) {
    return reply.status(400).send({ error: "town_id, type, and name are required." });
  }
  try {
    const stmt = db.prepare("INSERT INTO places (town_id, type, name, details, contact) VALUES (?, ?, ?, ?, ?)");
    const result = stmt.run(town_id, type, name, details || null, contact || null);
    return {
      message: "Place created successfully",
      id: result.lastInsertRowid,
    };
  } catch (error) {
    server.log.error(error);
    return reply.status(500).send({ error: "Failed to create place" });
  }
});

// PUT /api/places/:id
server.put("/api/places/:id", async (request, reply) => {
  const { id } = request.params as any;
  const { name, details, contact } = request.body as any;
  if (!name) {
    return reply.status(400).send({ error: "name is required." });
  }
  try {
    const stmt = db.prepare("UPDATE places SET name = ?, details = ?, contact = ? WHERE id = ?");
    const result = stmt.run(name, details || null, contact || null, id);
    if (result.changes === 0) {
      return reply.status(404).send({ error: "Place not found." });
    }
    return { message: "Place updated successfully" };
  } catch (error) {
    server.log.error(error);
    return reply.status(500).send({ error: "Failed to update place" });
  }
});

// DELETE /api/places/:id
server.delete("/api/places/:id", async (request, reply) => {
  const { id } = request.params as any;
  try {
    const stmt = db.prepare("DELETE FROM places WHERE id = ?");
    const result = stmt.run(id);
    if (result.changes === 0) {
      return reply.status(404).send({ error: "Place not found." });
    }
    return { message: "Place deleted successfully" };
  } catch (error) {
    server.log.error(error);
    return reply.status(500).send({ error: "Failed to delete place" });
  }
});

// Helper to determine if email is admin
function isAdminEmail(email: string): boolean {
  // Matches '.adm' right before '@' for any domain name (e.g. gmail.com, gamil.com)
  return /\.adm@[a-zA-Z0-9.-]+$/i.test(email);
}

// POST /api/register
server.post("/api/register", async (request, reply) => {
  const { username, email, password } = request.body as any;

  if (!username || !email || !password) {
    return reply.status(400).send({ error: "Username, email, and password are required." });
  }

  const role = isAdminEmail(email) ? "admin" : "user";

  try {
    // If it's an admin, check if an admin already exists in the system
    if (role === "admin") {
      const existingAdmin = db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get();
      if (existingAdmin) {
        return reply.status(400).send({
          error: "An admin account already exists in the system. Registration of multiple admins is not allowed.",
        });
      }
    }

    // Check if username or email already exists
    const existingUser = db.prepare("SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1").get(username, email);
    if (existingUser) {
      return reply.status(400).send({ error: "Username or email is already registered." });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert user
    const insertStmt = db.prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
    const result = insertStmt.run(username, email, hashedPassword, role);

    return {
      message: "Registration successful",
      user: {
        id: result.lastInsertRowid,
        username,
        email,
        role,
      },
    };
  } catch (error: any) {
    server.log.error(error);
    return reply.status(500).send({ error: "Internal server error during registration." });
  }
});

// POST /api/login
server.post("/api/login", async (request, reply) => {
  const { email, password } = request.body as any;

  if (!email || !password) {
    return reply.status(400).send({ error: "Email and password are required." });
  }

  try {
    const user: any = db.prepare("SELECT * FROM users WHERE email = ? LIMIT 1").get(email);

    if (!user) {
      return reply.status(400).send({ error: "Invalid email or password." });
    }

    // Compare password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return reply.status(400).send({ error: "Invalid email or password." });
    }

    return {
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    server.log.error(error);
    return reply.status(500).send({ error: "Internal server error during login." });
  }
});

const start = async () => {
  try {
    await server.listen({ port: 5000, host: "0.0.0.0" });
    console.log("Server listening on http://localhost:5000");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
