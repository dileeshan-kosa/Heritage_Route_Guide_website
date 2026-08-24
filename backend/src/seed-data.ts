export const INITIAL_TOWNS = [
  {
    id: "kurunegala",
    name: "Kurunegala",
    sinhalaName: "කුරුණෑගල",
    order_num: 1,
    coordinates: { x: 20, y: 88 },
    lat: 7.4818,
    lng: 80.3609,
    description: "The capital of the North Western Province and the starting point of our journey. Surrounded by massive rock outcrops, Kurunegala is a vibrant historical city.",
    police: [
      { name: "Kurunegala Police Station", details: "Main town, start of route" }
    ],
    fuel: [
      { name: "Lanka IOC Fuel Station", details: "Located in the town center" },
      { name: "Ceypetco Fuel Station", details: "Multiple outlets available for refueling" }
    ],
    hotels: [
      { name: "Hotel Blue Sky", details: "Convenient stay with modern amenities" },
      { name: "Premium Cottages B&B", details: "Cozy bed and breakfast experience" },
      { name: "Ranketha Hideout Resorts", details: "Peaceful environment near Kurunegala lake" }
    ],
    history: [
      {
        name: "Athugala Rock (Elephant Rock) & Athugala Viharaya",
        details: "Athugala is the most famous of the large rock outcrops surrounding the city of Kurunegala. Its elephant-like shape gives it the name 'Athugala' ('Athu' means elephant and 'gala' means rock in Sinhala). A large white 88-foot Samadhi Buddha statue sits atop the rock, offering breathtaking panoramic views over the town and lake."
      }
    ]
  },
  {
    id: "wariyapola",
    name: "Wariyapola",
    sinhalaName: "වාරියපොල",
    order_num: 2,
    coordinates: { x: 30, y: 76 },
    lat: 7.6049,
    lng: 80.2241,
    description: "A major junction town along the A10 highway, rich in national history and folklore.",
    hospitals: [
      { name: "Wariyapola District/Divisional Hospital", contact: "0372 267 261" }
    ],
    police: [
      { name: "Wariyapola Police Station", details: "Located directly along the A10 highway" }
    ],
    fuel: [
      { name: "Ceypetco & Lanka IOC Stations", details: "Several stations located around the main town junction" }
    ],
    hotels: [
      { name: "Freedom Hotel", details: "Popular local stop for meals and lodging" },
      { name: "Heritage Grand Eco Resort (by ARUCNA)", details: "Environmentally friendly resort offering high-quality accommodation" }
    ],
    history: [
      {
        name: "Wariyapola Sri Sumangala Thero & Mythical Aviation",
        details: "Wariyapola is famously known for Wariyapola Sri Sumangala Thero, who bravely took down the Union Jack and re-hoisted the Sinhalese lion flag before the 1815 convention that handed control of the island to the British. Additionally, the town's name translates to 'place for plane landing,' and local legend associates it with the landing sites of Ravana's mythical flying chariot, the Dandu Monara Yanthraya."
      }
    ]
  },
  {
    id: "padeniya",
    name: "Padeniya",
    sinhalaName: "පාදෙණිය",
    order_num: 3,
    coordinates: { x: 38, y: 66 },
    lat: 7.6361,
    lng: 80.1982,
    description: "The crucial junction where travelers branch off from the Chilaw-Anuradhapura road. Padeniya is home to one of Sri Lanka's architectural gems.",
    fuel: [
      { name: "Padeniya Junction Fuel Station", details: "A critical refueling point at the junction before proceeding to the north" }
    ],
    history: [
      {
        name: "Padeniya Purana Rajamaha Viharaya",
        details: "An ancient temple built on an uneven rock surface, decorated with beautifully carved wooden pillars and a unique lion frieze. Locals date its origins to around the 15th century. Its image house and library building are considered outstanding examples of traditional Sri Lankan vernacular wood architecture."
      }
    ]
  },
  {
    id: "galgamuwa",
    name: "Galgamuwa",
    sinhalaName: "ගල්ගමුව",
    order_num: 4,
    coordinates: { x: 45, y: 54 },
    lat: 7.8797,
    lng: 80.2721,
    description: "A tranquil town in the dry zone, famous for its scenic lakes and agricultural lands.",
    hospitals: [
      { name: "Galgamuwa Base Hospital", details: "Located in Mahagalgamuwa, serving the Galgamuwa Divisional Secretariat area in the North Western Province." }
    ],
    police: [
      { name: "Galgamuwa Police Station", details: "Located in Mahagalgamuwa" }
    ],
    fuel: [
      { name: "Galgamuwa Town Fuel Station", details: "Located in the town center along the highway" }
    ]
  },
  {
    id: "ambanpola",
    name: "Ambanpola",
    sinhalaName: "අඹන්පොල",
    order_num: 5,
    coordinates: { x: 50, y: 44 },
    lat: 7.7944,
    lng: 80.2281,
    description: "A serene rural stopover en route, offering beautiful vistas and cozy lakeside stays.",
    hospitals: [
      { name: "Ambanpola Ayurvedic Hospital", details: "A public Ayurvedic hospital located on Danikithawa Road." }
    ],
    police: [
      { name: "Ambanpola Police Station", details: "Serves the Ambanpola and surrounding agrarian areas" }
    ],
    fuel: [
      { name: "Ambanpola Fuel Station", details: "Smaller fuel station located near the town center" }
    ],
    hotels: [
      { name: "The Loft by the Lake (Embogama)", details: "A premium lakeside B&B featuring kayaking, cycling, and highly praised local hosts." }
    ]
  },
  {
    id: "mahagalkadawala",
    name: "Mahagalkadawala",
    sinhalaName: "මහගල්කඩවල",
    order_num: 6,
    coordinates: { x: 58, y: 35 },
    lat: 8.0050,
    lng: 80.2500,
    description: "A small, scenic crossing area between the North Western and North Central boundaries.",
    fuel: [
      { name: "Mahagalkadawala Fuel Station", details: "Convenient roadside refueling station en route" }
    ]
  },
  {
    id: "tambuttegama",
    name: "Tambuttegama",
    sinhalaName: "තඹුත්තේගම",
    order_num: 7,
    coordinates: { x: 66, y: 26 },
    lat: 8.1139,
    lng: 80.3014,
    description: "A bustling commercial town and agricultural hub in the North Central Province.",
    hospitals: [
      { name: "Tambuttegama Base Hospital", details: "The primary base hospital serving Galgamuwa, Rajanganaya, Thalawa, Giribawa, Nochchiyagama, and Galnewa secretariats. Equipped with Paediatric, Medical, Surgical, Anaesthetic, and Nephrology units." }
    ],
    police: [
      { name: "Tambuttegama Police Station", details: "Located along the A28 highway within the Anuradhapura District" }
    ],
    fuel: [
      { name: "Tambuttegama Ceypetco Station", details: "A very popular and major refueling stop for long journeys before entering Anuradhapura" }
    ],
    hotels: [
      { name: "Nimsara Holiday Resort", details: "Comfortable and hospitable lodging ideal for family travelers" }
    ]
  },
  {
    id: "talawa",
    name: "Talawa",
    sinhalaName: "තලාව",
    order_num: 8,
    coordinates: { x: 75, y: 17 },
    lat: 8.2384,
    lng: 80.3168,
    description: "The final intermediate town along the A28 before reaching the sacred capital.",
    hospitals: [
      { name: "General Hospital Anuradhapura (Nearby Access)", details: "For medical emergencies, Talawa residents and travelers rely directly on the fully equipped General Hospital in Anuradhapura." }
    ],
    police: [
      { name: "Talawa Police Station", details: "Located directly in Talawa town along the A28" }
    ],
    fuel: [
      { name: "Talawa Fuel Station", details: "Located close to the town center for a quick final refuel" }
    ]
  },
  {
    id: "anuradhapura",
    name: "Anuradhapura",
    sinhalaName: "අනුරාධපුරය",
    order_num: 9,
    coordinates: { x: 88, y: 8 },
    lat: 8.3114,
    lng: 80.4037,
    description: "The Sacred Capital. Our journey's end. One of the ancient capitals of Sri Lanka, famous for its well-preserved ruins of ancient Sri Lankan civilization.",
    hospitals: [
      { name: "General Hospital Anuradhapura", details: "The main, fully equipped government general hospital for the North Central Province." }
    ],
    police: [
      { name: "Anuradhapura Police Station", details: "Main station servicing the city and sacred zones" }
    ],
    fuel: [
      { name: "Anuradhapura Fuel Hubs", details: "Multiple Ceypetco and Lanka IOC stations located across the city" }
    ],
    hotels: [
      { name: "Heritage Hotel Anuradhapura", details: "A luxurious 4-star hotel close to the sacred ruins" },
      { name: "Monaara Leisure", details: "Serene boutique resort with beautiful surroundings" },
      { name: "Hotel Alakamanda", details: "Upscale resort offering deluxe rooms and beautiful gardens" },
      { name: "Grand Refuge Holiday Resort", details: "A cozy and comfortable stay perfect for visiting historical places" }
    ],
    history: [
      {
        name: "Sacred City of Anuradhapura (Atamasthana)",
        details: "Established around the 5th century BC and declared a UNESCO World Heritage Site in 1982, Anuradhapura is the crown jewel of Sri Lanka's history. It rose to prominence when Buddhism was introduced to the island in the 3rd century BC under King Devanampiya Tissa, who built the first stupa (Thuparamaya) and planted the sacred Jaya Sri Maha Bodhi sapling. King Devanampiya Tissa also built the Tissa Wewa irrigation reservoir. Later, King Dutugemunu built the massive Ruwanwelisaya stupa, Mirisavetiya temple, and the Lohapasada. The city features the Atamasthana (8 places of deep veneration)."
      }
    ]
  }
];
