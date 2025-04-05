// Data Service for KothaKhoj
const DataService = {
  // Initialize the service
  init() {
    console.log("DataService initialized")
    // Load mock data if no data exists
    if (!localStorage.getItem("rooms")) {
      this.loadMockData()
    }
  },

  // Load mock data for development
  loadMockData() {
    const mockRooms = [
      {
        id: "1",
        title: " Studio Apartment in Thamel",
        price: 15000,
        location: "Thamel",
        type: "studio",
        furnishing: "furnished",
        amenities: ["wifi", "attached-bathroom", "hot-water", "kitchen"],
        images: ["images/kotha1.jpeg", "images/kotha1.jpeg", "images/kotha1.jpeg"],
        description:
          "A beautiful studio apartment located in the heart of Thamel. Perfect for students or young professionals. The apartment comes with all basic amenities including WiFi, attached bathroom, hot water, and a small kitchen area.",
        rules: "No pets, no smoking, no loud music after 10 PM.",
        owner: {
          name: "Bimal Thapa",
          avatar: "images/profile.jpg",
          phone: "9801234567",
          email: "Bimal@gmail.com",
          whatsapp: "9801234567",
          messenger: "Bimal Thapa",
          type: "owner",
        },
        postedDate: "2023-12-15",
        verified: true,
      },
      {
        id: "2",
        title: "Spacious 2-Bedroom Apartment in Baluwatar",
        price: 25000,
        location: "Baluwatar",
        type: "apartment",
        furnishing: "semi-furnished",
        amenities: ["wifi", "attached-bathroom", "hot-water", "kitchen", "parking", "balcony"],
        images: ["images/rooms/room2-1.jpg", "images/rooms/room2-2.jpg", "images/rooms/room2-3.jpg"],
        description:
          "A spacious 2-bedroom apartment in the quiet neighborhood of Baluwatar. The apartment features a large living room, two bedrooms, a kitchen, and a balcony with a beautiful view. Parking space available.",
        rules: "Families preferred. No loud parties.",
        deposit: 50000,
        owner: {
          name: "Jane Smith",
          avatar: "images/avatars/avatar2.jpg",
          phone: "9807654321",
          email: "jane@example.com",
          whatsapp: "9807654321",
          messenger: "jane.smith.456",
          type: "agent",
        },
        postedDate: "2023-12-10",
        verified: true,
      },
      {
        id: "3",
        title: "Modern Loft near Patan Durbar Square",
        price: 20000,
        location: "Patan",
        type: "loft",
        furnishing: "furnished",
        amenities: ["wifi", "attached-bathroom", "hot-water", "kitchen", "tv", "washing-machine"],
        images: ["images/rooms/room3-1.jpg", "images/rooms/room3-2.jpg", "images/rooms/room3-3.jpg"],
        description:
          "A modern loft-style apartment near the historic Patan Durbar Square. The apartment features high ceilings, large windows, and a contemporary design. Fully furnished with all modern amenities.",
        rules: "No pets. Security deposit required.",
        deposit: 40000,
        owner: {
          name: "David Lee",
          avatar: "images/avatars/avatar3.jpg",
          phone: "9812345678",
          email: "david@example.com",
          whatsapp: "9812345678",
          messenger: "david.lee.789",
          type: "owner",
        },
        postedDate: "2023-12-05",
        verified: true,
      },
      {
        id: "4",
        title: "Budget Single Room in Lazimpat",
        price: 8000,
        location: "Lazimpat",
        type: "single",
        furnishing: "unfurnished",
        amenities: ["wifi", "shared-bathroom"],
        images: ["images/rooms/room4-1.jpg", "images/rooms/room4-2.jpg"],
        description:
          "An affordable single room in Lazimpat area. Shared bathroom and kitchen facilities. Ideal for students or individuals on a budget.",
        rules: "No overnight guests. Quiet hours from 10 PM to 6 AM.",
        deposit: 16000,
        owner: {
          name: "Sarah Green",
          avatar: "images/avatars/avatar4.jpg",
          phone: "9809876543",
          email: "sarah@example.com",
          messenger: "sarah.green.101",
          type: "owner",
        },
        postedDate: "2023-12-01",
        verified: false,
      },
      {
        id: "5",
        title: "Luxury Penthouse with City View",
        price: 50000,
        location: "Jhamsikhel",
        type: "penthouse",
        furnishing: "fully-furnished",
        amenities: [
          "wifi",
          "attached-bathroom",
          "hot-water",
          "kitchen",
          "tv",
          "washing-machine",
          "balcony",
          "parking",
          "electricity-backup",
          "water-filter",
        ],
        images: [
          "images/kotha1.jpeg",
          "images/kotha1.jpeg",
          "images/kotha1.jpeg",
          "images/kotha1.jpeg",
        ],
        description:
          "A luxurious penthouse apartment with panoramic views of the city. The apartment features 3 bedrooms, a large living area, modern kitchen, and a spacious balcony. Fully furnished with high-end appliances and furniture.",
        rules: "No pets. Background check required. Minimum 6-month lease.",
        deposit: 100000,
        owner: {
          name: "Michael Brown",
          avatar: "images/profile.jpg",
          phone: "9801122334",
          email: "michael@example.com",
          whatsapp: "9801122334",
          messenger: "michael.brown.202",
          type: "agent",
        },
        postedDate: "2023-11-25",
        verified: true,
      },
      {
        id: "6",
        title: "Shared Room for Students near Tribhuvan University",
        price: 5000,
        location: "Kirtipur",
        type: "shared",
        furnishing: "semi-furnished",
        amenities: ["wifi", "shared-bathroom", "kitchen"],
        images: ["images/rooms/room6-1.jpg", "images/rooms/room6-2.jpg"],
        description:
          "A shared room for students near Tribhuvan University. The room accommodates 2 people with separate beds, study tables, and wardrobes. Shared bathroom and kitchen facilities.",
        rules: "Students only. No alcohol, no smoking.",
        deposit: 10000,
        owner: {
          name: "Robert Taylor",
          avatar: "images/avatars/avatar6.jpg",
          phone: "9805544332",
          email: "robert@example.com",
          messenger: "robert.taylor.303",
          type: "owner",
        },
        postedDate: "2023-11-20",
        verified: true,
      },
      {
        id: "7",
        title: "Family House with Garden in Bhaktapur",
        price: 35000,
        location: "Bhaktapur",
        type: "house",
        furnishing: "unfurnished",
        amenities: ["parking", "garden", "electricity-backup"],
        images: ["images/rooms/room7-1.jpg", "images/rooms/room7-2.jpg", "images/rooms/room7-3.jpg"],
        description:
          "A spacious family house in the historic city of Bhaktapur. The house features 3 bedrooms, a living room, kitchen, and a beautiful garden. Ideal for families looking for a peaceful environment.",
        rules: "Families only. No commercial activities.",
        deposit: 70000,
        owner: {
          name: "Linda Davis",
          avatar: "images/avatars/avatar7.jpg",
          phone: "9809988776",
          email: "linda@example.com",
          whatsapp: "9809988776",
          messenger: "linda.davis.404",
          type: "owner",
        },
        postedDate: "2023-11-15",
        verified: true,
      },
      {
        id: "8",
        title: "Modern Studio in Bouddha",
        price: 18000,
        location: "Bouddha",
        type: "studio",
        furnishing: "furnished",
        amenities: ["wifi", "attached-bathroom", "hot-water", "kitchen", "tv"],
        images: ["images/rooms/room8-1.jpg", "images/rooms/room8-2.jpg"],
        description:
          "A modern studio apartment in the vibrant area of Bouddha. The apartment is fully furnished with a comfortable bed, sofa, TV, and a small kitchen area. Located near the famous Bouddhanath Stupa.",
        rules: "No pets. Quiet hours from 10 PM to 6 AM.",
        deposit: 36000,
        owner: {
          name: "William Wilson",
          avatar: "images/avatars/avatar8.jpg",
          phone: "9801234987",
          email: "william@example.com",
          messenger: "william.wilson.505",
          type: "agent",
        },
        postedDate: "2023-11-10",
        verified: false,
      },
      {
        id: "9",
        title: "Cozy Room in Shared Apartment",
        price: 10000,
        location: "Kupondole",
        type: "single",
        furnishing: "furnished",
        amenities: ["wifi", "shared-bathroom", "kitchen", "washing-machine"],
        images: ["images/rooms/room9-1.jpg", "images/rooms/room9-2.jpg"],
        description:
          "A cozy private room in a shared apartment in Kupondole. The room comes with a comfortable bed, wardrobe, and study table. Shared bathroom, kitchen, and living area with 2 other roommates.",
        rules: "No overnight guests. Shared cleaning responsibilities.",
        deposit: 20000,
        owner: {
          name: "Karen Martinez",
          avatar: "images/avatars/avatar9.jpg",
          phone: "9807654123",
          email: "karen@example.com",
          whatsapp: "9807654123",
          messenger: "karen.martinez.606",
          type: "owner",
        },
        postedDate: "2023-11-05",
        verified: true,
      },
      {
        id: "10",
        title: "Executive Suite with Office Space",
        price: 28000,
        location: "Business District",
        type: "suite",
        furnishing: "fully-furnished",
        amenities: [
          "wifi",
          "attached-bathroom",
          "hot-water",
          "kitchen",
          "tv",
          "washing-machine",
          "parking",
          "electricity-backup",
        ],
        images: ["images/rooms/room10-1.jpg", "images/rooms/room10-2.jpg", "images/rooms/room10-3.jpg"],
        description:
          "An executive suite perfect for professionals who need a dedicated workspace. Features a separate office area, bedroom, modern bathroom, and a fully equipped kitchen. Located in the heart of the business district with easy access to major offices.",
        rules: "No loud parties. Professional use only.",
        deposit: 56000,
        owner: {
          name: "Karen Martinez",
          avatar: "images/avatars/avatar9.jpg",
          phone: "9807654123",
          email: "karen@example.com",
          whatsapp: "9807654123",
          messenger: "karen.martinez.606",
          type: "agent",
        },
        postedDate: "2023-10-25",
        verified: true,
      },
      {
        id: "11",
        title: "Rustic Cottage in Godavari",
        price: 30000,
        location: "Godavari",
        type: "cottage",
        furnishing: "semi-furnished",
        amenities: ["parking", "garden", "kitchen", "hot-water"],
        images: ["images/rooms/room10-1.jpg", "images/rooms/room10-2.jpg", "images/rooms/room10-3.jpg"],
        description:
          "A charming rustic cottage in the serene area of Godavari. The cottage features 2 bedrooms, a living room, kitchen, and a beautiful garden. Perfect for those seeking peace and tranquility away from the city noise.",
        rules: "No loud parties. Respect the natural environment.",
        deposit: 60000,
        owner: {
          name: "Thomas Johnson",
          avatar: "images/avatars/avatar10.jpg",
          phone: "9812345670",
          email: "thomas@example.com",
          whatsapp: "9812345670",
          messenger: "thomas.johnson.707",
          type: "owner",
        },
        postedDate: "2023-10-15",
        verified: true,
      },
    ]

    // Store mock data in localStorage
    localStorage.setItem("rooms", JSON.stringify(mockRooms))
    console.log("Mock data loaded")
  },

  // Get all rooms
  getAllRooms() {
    try {
      const rooms = JSON.parse(localStorage.getItem("rooms") || "[]")
      console.log(`Retrieved ${rooms.length} rooms from storage`)
      return rooms
    } catch (error) {
      console.error("Error getting all rooms:", error)
      return []
    }
  },

  // Get featured rooms (newest and verified)
  getFeaturedRooms(count = 3) {
    try {
      const rooms = this.getAllRooms()
      // Sort by date (newest first) and filter verified rooms
      const featuredRooms = rooms
        .filter((room) => room.verified)
        .sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
        .slice(0, count)

      return featuredRooms
    } catch (error) {
      console.error("Error getting featured rooms:", error)
      return []
    }
  },

  // Get room by ID
  getRoomById(id) {
    try {
      const rooms = this.getAllRooms()
      const room = rooms.find((room) => room.id === id) || null

      if (!room) {
        console.error(`Room with ID ${id} not found`)
        return null
      }

      console.log(`Found room: ${room.title} with ID: ${id}`)
      return room
    } catch (error) {
      console.error(`Error getting room with ID ${id}:`, error)
      return null
    }
  },

  // Get adjacent rooms (previous and next)
  getAdjacentRooms(id) {
    try {
      const rooms = this.getAllRooms()

      // Sort rooms by newest first (same as on listings page)
      rooms.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))

      const currentIndex = rooms.findIndex((room) => room.id === id)

      if (currentIndex === -1) {
        console.error(`Room with ID ${id} not found when getting adjacent rooms`)
        return { prevRoom: null, nextRoom: null }
      }

      // Previous is the next newest room (higher index)
      const prevRoom = currentIndex < rooms.length - 1 ? rooms[currentIndex + 1] : null
      // Next is the previous newest room (lower index)
      const nextRoom = currentIndex > 0 ? rooms[currentIndex - 1] : null

      console.log(`Adjacent rooms for ${id}: prev=${prevRoom?.id}, next=${nextRoom?.id}`)
      return { prevRoom, nextRoom }
    } catch (error) {
      console.error(`Error getting adjacent rooms for ID ${id}:`, error)
      return { prevRoom: null, nextRoom: null }
    }
  },

  // Filter rooms based on criteria
  filterRooms(filters) {
    try {
      let rooms = this.getAllRooms()

      // Filter by location
      if (filters.location) {
        rooms = rooms.filter((room) => room.location === filters.location)
      }

      // Filter by price range
      if (filters.priceMin !== undefined) {
        rooms = rooms.filter((room) => room.price >= filters.priceMin)
      }

      if (filters.priceMax !== undefined && filters.priceMax !== 0) {
        rooms = rooms.filter((room) => room.price <= filters.priceMax)
      }

      // Filter by room types
      if (filters.roomTypes && filters.roomTypes.length > 0) {
        rooms = rooms.filter((room) => filters.roomTypes.includes(room.type))
      }

      // Filter by furnishing
      if (filters.furnishing && filters.furnishing.length > 0) {
        rooms = rooms.filter((room) => filters.furnishing.includes(room.furnishing))
      }

      // Filter by amenities
      if (filters.amenities && filters.amenities.length > 0) {
        rooms = rooms.filter((room) => filters.amenities.every((amenity) => room.amenities.includes(amenity)))
      }

      return rooms
    } catch (error) {
      console.error("Error filtering rooms:", error)
      return []
    }
  },

  // Get saved rooms
  getSavedRooms() {
    try {
      const savedRoomIds = JSON.parse(localStorage.getItem("savedRooms") || "[]")
      const allRooms = this.getAllRooms()

      return allRooms.filter((room) => savedRoomIds.includes(room.id))
    } catch (error) {
      console.error("Error getting saved rooms:", error)
      return []
    }
  },

  // Add a new room
  addRoom(roomData) {
    try {
      const rooms = this.getAllRooms()

      // Generate a new ID
      const newId = (Math.max(...rooms.map((room) => Number.parseInt(room.id)), 0) + 1).toString()

      // Add ID and posted date
      const newRoom = {
        ...roomData,
        id: newId,
        postedDate: new Date().toISOString().split("T")[0],
        verified: false,
      }

      // Add to rooms array
      rooms.push(newRoom)

      // Save to localStorage
      localStorage.setItem("rooms", JSON.stringify(rooms))

      return newRoom
    } catch (error) {
      console.error("Error adding room:", error)
      return null
    }
  },

  // Update a room
  updateRoom(id, roomData) {
    try {
      const rooms = this.getAllRooms()
      const index = rooms.findIndex((room) => room.id === id)

      if (index === -1) {
        return null
      }

      // Update room data
      rooms[index] = {
        ...rooms[index],
        ...roomData,
      }

      // Save to localStorage
      localStorage.setItem("rooms", JSON.stringify(rooms))

      return rooms[index]
    } catch (error) {
      console.error(`Error updating room with ID ${id}:`, error)
      return null
    }
  },

  // Delete a room
  deleteRoom(id) {
    try {
      const rooms = this.getAllRooms()
      const filteredRooms = rooms.filter((room) => room.id !== id)

      // Save to localStorage
      localStorage.setItem("rooms", JSON.stringify(filteredRooms))

      return true
    } catch (error) {
      console.error(`Error deleting room with ID ${id}:`, error)
      return false
    }
  },

  // Check if user is logged in
  isLoggedIn() {
    return localStorage.getItem("currentUser") !== null
  },

  // Get current user
  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "null")
    } catch (error) {
      console.error("Error getting current user:", error)
      return null
    }
  },

  // Login user
  loginUser(email, password) {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const user = users.find((u) => u.email === email && u.password === password)

      if (user) {
        // Store current user (without password)
        const { password, ...userWithoutPassword } = user
        localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))
        return userWithoutPassword
      }

      return null
    } catch (error) {
      console.error("Error logging in user:", error)
      return null
    }
  },

  // Register user
  registerUser(userData) {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      // Check if email already exists
      if (users.some((user) => user.email === userData.email)) {
        return { success: false, message: "Email already registered" }
      }

      // Add new user
      users.push({
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      })

      // Save to localStorage
      localStorage.setItem("users", JSON.stringify(users))

      return { success: true, message: "Registration successful" }
    } catch (error) {
      console.error("Error registering user:", error)
      return { success: false, message: "Registration failed" }
    }
  },

  // Logout user
  logoutUser() {
    localStorage.removeItem("currentUser")
  },
}

// Export the DataService
export default DataService

