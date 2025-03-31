// Data Service - Handles storage and retrieval of room listings
const DataService = {
  // Storage keys
  ROOMS_KEY: "kothakhoj_rooms",
  NEXT_ID_KEY: "kothakhoj_next_id",

  // Initialize data store
  init() {
    if (!localStorage.getItem(this.ROOMS_KEY)) {
      localStorage.setItem(this.ROOMS_KEY, JSON.stringify([]))
    }

    if (!localStorage.getItem(this.NEXT_ID_KEY)) {
      localStorage.setItem(this.NEXT_ID_KEY, "1")
    }

    // If no rooms exist, add sample data
    const rooms = this.getAllRooms()
    if (rooms.length === 0) {
      this.addSampleData()
    }
  },

  // Get all rooms
  getAllRooms() {
    return JSON.parse(localStorage.getItem(this.ROOMS_KEY) || "[]")
  },

  // Get room by ID
  getRoomById(id) {
    const rooms = this.getAllRooms()
    return rooms.find((room) => room.id === id)
  },

  // Get next and previous rooms
  getAdjacentRooms(roomId) {
    const rooms = this.getAllRooms()

    // Sort rooms by newest first (same as default listing page)
    const sortedRooms = [...rooms].sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))

    // Find current room index
    const currentIndex = sortedRooms.findIndex((room) => room.id === roomId)

    if (currentIndex === -1) {
      return { prevRoom: null, nextRoom: null }
    }

    // Get next and previous room
    const prevRoom = currentIndex < sortedRooms.length - 1 ? sortedRooms[currentIndex + 1] : null
    const nextRoom = currentIndex > 0 ? sortedRooms[currentIndex - 1] : null

    return { prevRoom, nextRoom }
  },

  // Add a new room
  addRoom(roomData) {
    const rooms = this.getAllRooms()
    const nextId = this.getNextId()

    // Create new room object with proper formatting
    const newRoom = {
      id: nextId,
      title: roomData.title,
      type: roomData.type,
      furnishing: roomData.furnishing,
      price: Number.parseInt(roomData.price),
      deposit: roomData.deposit ? Number.parseInt(roomData.deposit) : null,
      description: roomData.description,
      location: roomData.location,
      address: roomData.address,
      amenities: roomData.amenities || [],
      images: roomData.images || [],
      owner: {
        name: roomData.ownerName,
        type: roomData.ownerType,
        phone: roomData.phone,
        whatsapp: roomData.whatsapp || null,
        email: roomData.email,
        avatar: "https://source.unsplash.com/random/100x100?portrait," + Math.floor(Math.random() * 20), // Random avatar
      },
      rules: roomData.rules || "",
      postedDate: new Date().toISOString(),
      featured: Math.random() < 0.3, // 30% chance to be featured
    }

    // Add to rooms array
    rooms.push(newRoom)

    // Save to localStorage
    localStorage.setItem(this.ROOMS_KEY, JSON.stringify(rooms))

    // Increment next ID
    this.incrementNextId()

    console.log("Room added successfully:", newRoom)
    return newRoom
  },

  // Get next available ID
  getNextId() {
    return localStorage.getItem(this.NEXT_ID_KEY) || "1"
  },

  // Increment next ID
  incrementNextId() {
    const nextId = Number.parseInt(this.getNextId())
    localStorage.setItem(this.NEXT_ID_KEY, (nextId + 1).toString())
  },

  // Search rooms by criteria
  searchRooms(criteria = {}) {
    let rooms = this.getAllRooms()

    // Filter by location
    if (criteria.location && criteria.location !== "") {
      rooms = rooms.filter((room) => room.location.toLowerCase() === criteria.location.toLowerCase())
    }

    // Filter by price range
    if (criteria.priceMin && criteria.priceMin !== "") {
      const minPrice = Number.parseInt(criteria.priceMin)
      rooms = rooms.filter((room) => room.price >= minPrice)
    }

    if (criteria.priceMax && criteria.priceMax !== "") {
      const maxPrice = Number.parseInt(criteria.priceMax)
      rooms = rooms.filter((room) => room.price <= maxPrice)
    }

    // Filter by room type
    if (criteria.type && criteria.type !== "") {
      rooms = rooms.filter((room) => room.type === criteria.type)
    }

    // Filter by furnishing
    if (criteria.furnishing && criteria.furnishing !== "") {
      rooms = rooms.filter((room) => room.furnishing === criteria.furnishing)
    }

    // Filter by amenities
    if (criteria.amenities && criteria.amenities.length > 0) {
      rooms = rooms.filter((room) => {
        return criteria.amenities.every((amenity) => room.amenities.includes(amenity))
      })
    }

    // Sort results
    if (criteria.sortBy) {
      switch (criteria.sortBy) {
        case "price-low":
          rooms.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          rooms.sort((a, b) => b.price - a.price)
          break
        case "newest":
        default:
          rooms.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
          break
      }
    } else {
      // Default sort by newest
      rooms.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
    }

    return rooms
  },

  // Get featured rooms
  getFeaturedRooms(limit = 3) {
    const rooms = this.getAllRooms()
    // First try to get rooms marked as featured
    let featuredRooms = rooms.filter((room) => room.featured)

    // If not enough featured rooms, get the newest ones
    if (featuredRooms.length < limit) {
      const sortedRooms = [...rooms].sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
      const additionalRooms = sortedRooms
        .filter((room) => !featuredRooms.some((fr) => fr.id === room.id))
        .slice(0, limit - featuredRooms.length)

      featuredRooms = [...featuredRooms, ...additionalRooms]
    }

    return featuredRooms.slice(0, limit)
  },

  // Add sample data
  addSampleData() {
    const sampleRooms = [
      {
        title: "Cozy Furnished Room in Thamel",
        type: "private",
        furnishing: "furnished",
        price: 12000,
        deposit: 24000,
        description:
          "A comfortable furnished room in the heart of Thamel. Perfect for tourists and digital nomads. The room includes a comfortable bed, desk, chair, and wardrobe. High-speed WiFi available.",
        location: "thamel",
        address: "Near Thamel Chowk, House #123",
        amenities: ["wifi", "attached-bathroom", "hot-water", "kitchen"],
        images: [
          "https://source.unsplash.com/random/600x400?room,nepal,11",
          "https://source.unsplash.com/random/600x400?room,nepal,12",
          "https://source.unsplash.com/random/600x400?room,nepal,13",
        ],
        owner: {
          name: "Rajesh Sharma",
          type: "owner",
          phone: "9801234567",
          whatsapp: "9801234567",
          email: "rajesh@example.com",
          avatar: "https://source.unsplash.com/random/100x100?portrait,1",
        },
        rules: "No smoking, no loud music after 10 PM, no pets allowed.",
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        featured: true,
      },
      {
        title: "Spacious Room with Balcony in Baluwatar",
        type: "private",
        furnishing: "semi-furnished",
        price: 15000,
        deposit: 30000,
        description:
          "A spacious room with a private balcony offering a beautiful view of the city. The room comes with basic furniture including a bed and wardrobe. Shared kitchen and living room.",
        location: "baluwatar",
        address: "Baluwatar Height, House #45",
        amenities: ["wifi", "balcony", "parking", "kitchen", "washing-machine"],
        images: [
          "https://source.unsplash.com/random/600x400?room,nepal,21",
          "https://source.unsplash.com/random/600x400?room,nepal,22",
        ],
        owner: {
          name: "Sunita Thapa",
          type: "owner",
          phone: "9807654321",
          whatsapp: "9807654321",
          email: "sunita@example.com",
          avatar: "https://source.unsplash.com/random/100x100?portrait,2",
        },
        rules: "No smoking inside the room, quiet hours after 11 PM.",
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        featured: true,
      },
      {
        title: "Budget Friendly Shared Room in Patan",
        type: "shared",
        furnishing: "furnished",
        price: 7000,
        deposit: 14000,
        description:
          "Affordable shared room in a historic part of Patan. The room is shared with one other person. Includes a single bed, small desk, and shared wardrobe. Walking distance to Patan Durbar Square.",
        location: "patan",
        address: "Near Patan Durbar Square, House #78",
        amenities: ["wifi", "hot-water", "kitchen"],
        images: [
          "https://source.unsplash.com/random/600x400?room,nepal,31",
          "https://source.unsplash.com/random/600x400?room,nepal,32",
          "https://source.unsplash.com/random/600x400?room,nepal,33",
        ],
        owner: {
          name: "Bikash Maharjan",
          type: "owner",
          phone: "9812345678",
          whatsapp: "9812345678",
          email: "bikash@example.com",
          avatar: "https://source.unsplash.com/random/100x100?portrait,3",
        },
        rules: "Respect roommate privacy, keep common areas clean, no overnight guests.",
        postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        featured: false,
      },
      {
        title: "Modern Apartment in Lazimpat",
        type: "apartment",
        furnishing: "furnished",
        price: 35000,
        deposit: 70000,
        description:
          "Fully furnished modern apartment in Lazimpat. Features one bedroom, living room, kitchen, and bathroom. All utilities included. Perfect for professionals or small families.",
        location: "lazimpat",
        address: "Lazimpat Road, Building #12, Apartment 3B",
        amenities: ["wifi", "attached-bathroom", "hot-water", "kitchen", "tv", "washing-machine", "balcony", "parking"],
        images: [
          "https://source.unsplash.com/random/600x400?room,nepal,41",
          "https://source.unsplash.com/random/600x400?room,nepal,42",
        ],
        owner: {
          name: "Anita Gurung",
          type: "owner",
          phone: "9845678901",
          whatsapp: "9845678901",
          email: "anita@example.com",
          avatar: "https://source.unsplash.com/random/100x100?portrait,4",
        },
        rules: "No smoking, no pets, maximum 2 people.",
        postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        featured: true,
      },
    ]

    // Add sample rooms
    let nextId = 1
    const rooms = sampleRooms.map((room) => {
      return {
        ...room,
        id: (nextId++).toString(),
      }
    })

    localStorage.setItem(this.ROOMS_KEY, JSON.stringify(rooms))
    localStorage.setItem(this.NEXT_ID_KEY, nextId.toString())
  },
}

export default DataService

