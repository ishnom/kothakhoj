// Add DataService initialization at the beginning of the file
document.addEventListener("DOMContentLoaded", async () => {
  // Import and initialize DataService
  try {
    const module = await import("./data-service.js")
    const DataService = module.default
    DataService.init()
    window.DataService = DataService // Make it globally available for other scripts
  } catch (error) {
    console.error("Error initializing DataService:", error)
  }

  // Mobile Menu Toggle
  const menuToggle = document.querySelector(".menu-toggle")
  const nav = document.querySelector("nav")

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("active")

      // Toggle icon
      const icon = menuToggle.querySelector("i")
      if (nav.classList.contains("active")) {
        icon.classList.remove("fa-bars")
        icon.classList.add("fa-times")
      } else {
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
      }
    })
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", (event) => {
    if (nav && nav.classList.contains("active") && !nav.contains(event.target) && !menuToggle.contains(event.target)) {
      nav.classList.remove("active")
      const icon = menuToggle.querySelector("i")
      icon.classList.remove("fa-times")
      icon.classList.add("fa-bars")
    }
  })

  // FAQ Accordion
  const faqItems = document.querySelectorAll(".faq-item")

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question")

    question.addEventListener("click", () => {
      // Close other open items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains("active")) {
          otherItem.classList.remove("active")
        }
      })

      // Toggle current item
      item.classList.toggle("active")
    })
  })

  // Room Save Functionality
  const saveButtons = document.querySelectorAll(".room-save")

  saveButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()
      e.stopPropagation()

      const roomId = this.dataset.roomId
      const savedRooms = JSON.parse(localStorage.getItem("savedRooms") || "[]")

      if (this.classList.contains("saved")) {
        // Remove from saved
        const index = savedRooms.indexOf(roomId)
        if (index > -1) {
          savedRooms.splice(index, 1)
        }
        this.classList.remove("saved")
        this.setAttribute("title", "Save Room")
      } else {
        // Add to saved
        if (!savedRooms.includes(roomId)) {
          savedRooms.push(roomId)
        }
        this.classList.add("saved")
        this.setAttribute("title", "Remove from Saved")
      }

      localStorage.setItem("savedRooms", JSON.stringify(savedRooms))

      // Update saved rooms list if it exists on the page
      updateSavedRoomsList()
    })

    // Check if room is already saved
    const roomId = button.dataset.roomId
    const savedRooms = JSON.parse(localStorage.getItem("savedRooms") || "[]")

    if (savedRooms.includes(roomId)) {
      button.classList.add("saved")
      button.setAttribute("title", "Remove from Saved")
    }
  })

  // Update saved rooms list
  function updateSavedRoomsList() {
    const savedRoomsList = document.getElementById("saved-rooms-list")
    if (!savedRoomsList) return

    const savedRooms = JSON.parse(localStorage.getItem("savedRooms") || "[]")

    if (savedRooms.length === 0) {
      savedRoomsList.innerHTML = '<p class="empty-state">No saved rooms yet</p>'
      return
    }

    // In a real application, you would fetch the saved rooms data from the server
    // For this demo, we'll use the mock data
    const savedRoomsData = mockRooms.filter((room) => savedRooms.includes(room.id))

    let html = ""
    savedRoomsData.forEach((room) => {
      html += `
                <div class="saved-room-item">
                    <a href="room-details.html?id=${room.id}" class="saved-room-link">
                        <div class="saved-room-image">
                            <img src="${room.images[0]}" alt="${room.title}">
                        </div>
                        <div class="saved-room-info">
                            <h4>${room.title}</h4>
                            <p>Rs. ${room.price}/month</p>
                        </div>
                    </a>
                    <button class="btn-icon remove-saved" data-room-id="${room.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `
    })

    savedRoomsList.innerHTML = html

    // Add event listeners to remove buttons
    const removeButtons = savedRoomsList.querySelectorAll(".remove-saved")
    removeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const roomId = this.dataset.roomId
        const savedRooms = JSON.parse(localStorage.getItem("savedRooms") || "[]")
        const index = savedRooms.indexOf(roomId)

        if (index > -1) {
          savedRooms.splice(index, 1)
          localStorage.setItem("savedRooms", JSON.stringify(savedRooms))

          // Update the saved button on the room card if it exists
          const saveButton = document.querySelector(`.room-save[data-room-id="${roomId}"]`)
          if (saveButton) {
            saveButton.classList.remove("saved")
            saveButton.setAttribute("title", "Save Room")
          }

          // Update the saved rooms list
          updateSavedRoomsList()
        }
      })
    })
  }

  // Call the function to initialize the saved rooms list
  updateSavedRoomsList()

  // Modal Functionality
  const modals = document.querySelectorAll(".modal")
  const modalTriggers = document.querySelectorAll("[data-modal]")
  const closeButtons = document.querySelectorAll(".close-modal")

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      const modalId = this.dataset.modal
      const modal = document.getElementById(modalId)

      if (modal) {
        modal.style.display = "block"
        document.body.style.overflow = "hidden"
      }
    })
  })

  closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modal = this.closest(".modal")
      modal.style.display = "none"
      document.body.style.overflow = "auto"
    })
  })

  window.addEventListener("click", (event) => {
    modals.forEach((modal) => {
      if (event.target === modal) {
        modal.style.display = "none"
        document.body.style.overflow = "auto"
      }
    })
  })

  // Mock Data for Rooms
  window.mockRooms = [
    {
      id: "1",
      title: "Cozy Furnished Room in Thamel",
      type: "private",
      furnishing: "furnished",
      price: 12000,
      location: "Thamel",
      address: "Near Thamel Chowk, House #123",
      description:
        "A comfortable furnished room in the heart of Thamel. Perfect for tourists and digital nomads. The room includes a comfortable bed, desk, chair, and wardrobe. High-speed WiFi available.",
      amenities: ["wifi", "attached-bathroom", "hot-water", "kitchen"],
      images: ["images/room-1-1.jpg", "images/room-1-2.jpg", "images/room-1-3.jpg", "images/room-1-4.jpg"],
      owner: {
        name: "Rajesh Sharma",
        type: "owner",
        phone: "9801234567",
        whatsapp: "9801234567",
        email: "rajesh@example.com",
        avatar: "images/owner-1.jpg",
      },
      postedDate: "2023-06-15",
      rules: "No smoking, no loud music after 10 PM, no pets allowed.",
    },
    {
      id: "2",
      title: "Spacious Room with Balcony in Baluwatar",
      type: "private",
      furnishing: "semi-furnished",
      price: 15000,
      location: "Baluwatar",
      address: "Baluwatar Height, House #45",
      description:
        "A spacious room with a private balcony offering a beautiful view of the city. The room comes with basic furniture including a bed and wardrobe. Shared kitchen and living room.",
      amenities: ["wifi", "balcony", "parking", "kitchen", "washing-machine"],
      images: ["images/room-2-1.jpg", "images/room-2-2.jpg", "images/room-2-3.jpg"],
      owner: {
        name: "Sunita Thapa",
        type: "owner",
        phone: "9807654321",
        whatsapp: "9807654321",
        email: "sunita@example.com",
        avatar: "images/owner-2.jpg",
      },
      postedDate: "2023-06-18",
      rules: "No smoking inside the room, quiet hours after 11 PM.",
    },
    {
      id: "3",
      title: "Budget Friendly Shared Room in Patan",
      type: "shared",
      furnishing: "furnished",
      price: 7000,
      location: "Patan",
      address: "Near Patan Durbar Square, House #78",
      description:
        "Affordable shared room in a historic part of Patan. The room is shared with one other person. Includes a single bed, small desk, and shared wardrobe. Walking distance to Patan Durbar Square.",
      amenities: ["wifi", "hot-water", "kitchen"],
      images: ["images/room-3-1.jpg", "images/room-3-2.jpg", "images/room-3-3.jpg"],
      owner: {
        name: "Bikash Maharjan",
        type: "owner",
        phone: "9812345678",
        whatsapp: "9812345678",
        email: "bikash@example.com",
        avatar: "images/owner-3.jpg",
      },
      postedDate: "2023-06-20",
      rules: "Respect roommate privacy, keep common areas clean, no overnight guests.",
    },
    {
      id: "4",
      title: "Modern Apartment in Lazimpat",
      type: "apartment",
      furnishing: "furnished",
      price: 35000,
      location: "Lazimpat",
      address: "Lazimpat Road, Building #12, Apartment 3B",
      description:
        "Fully furnished modern apartment in Lazimpat. Features one bedroom, living room, kitchen, and bathroom. All utilities included. Perfect for professionals or small families.",
      amenities: ["wifi", "attached-bathroom", "hot-water", "kitchen", "tv", "washing-machine", "balcony", "parking"],
      images: [
        "images/room-4-1.jpg",
        "images/room-4-2.jpg",
        "images/room-4-3.jpg",
        "images/room-4-4.jpg",
        "images/room-4-5.jpg",
      ],
      owner: {
        name: "Anita Gurung",
        type: "owner",
        phone: "9845678901",
        whatsapp: "9845678901",
        email: "anita@example.com",
        avatar: "images/owner-4.jpg",
      },
      postedDate: "2023-06-22",
      rules: "No smoking, no pets, maximum 2 people.",
    },
    {
      id: "5",
      title: "Unfurnished Room near Tribhuvan University",
      type: "private",
      furnishing: "unfurnished",
      price: 8000,
      location: "Kirtipur",
      address: "Near Tribhuvan University Gate, House #56",
      description:
        "Unfurnished room ideal for students. Located just a 5-minute walk from Tribhuvan University. Spacious room with good natural light. Shared bathroom and kitchen.",
      amenities: ["wifi", "kitchen", "water-filter"],
      images: ["images/room-5-1.jpg", "images/room-5-2.jpg"],
      owner: {
        name: "Ram Shrestha",
        type: "owner",
        phone: "9823456789",
        email: "ram@example.com",
        avatar: "images/owner-5.jpg",
      },
      postedDate: "2023-06-25",
      rules: "Suitable for students, no loud parties, keep common areas clean.",
    },
    {
      id: "6",
      title: "Traditional Newari House Room in Bhaktapur",
      type: "private",
      furnishing: "semi-furnished",
      price: 10000,
      location: "Bhaktapur",
      address: "Near Bhaktapur Durbar Square, House #34",
      description:
        "Experience living in a traditional Newari house in historic Bhaktapur. The room comes with a traditional bed and small wardrobe. Shared bathroom and kitchen. Perfect for those who want to experience Nepali culture.",
      amenities: ["wifi", "hot-water", "kitchen"],
      images: ["images/room-6-1.jpg", "images/room-6-2.jpg", "images/room-6-3.jpg"],
      owner: {
        name: "Sarita Prajapati",
        type: "owner",
        phone: "9834567890",
        whatsapp: "9834567890",
        email: "sarita@example.com",
        avatar: "images/owner-6.jpg",
      },
      postedDate: "2023-06-28",
      rules: "Respect the traditional house, no smoking inside, quiet hours after 10 PM.",
    },
  ]

  // For placeholder images
  for (let i = 1; i <= 6; i++) {
    for (let j = 1; j <= 5; j++) {
      if (!mockRooms[i - 1].images[j - 1]) continue
      mockRooms[i - 1].images[j - 1] = `https://source.unsplash.com/random/600x400?room,nepal,${i}${j}`
    }
    if (mockRooms[i - 1].owner && mockRooms[i - 1].owner.avatar) {
      mockRooms[i - 1].owner.avatar = `https://source.unsplash.com/random/100x100?portrait,${i}`
    }
  }
})

