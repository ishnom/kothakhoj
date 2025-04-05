document.addEventListener("DOMContentLoaded", () => {
  // Import DataService (assuming it's in a separate file)
  // If DataService is not in a separate file, define it here.
  // Example:
  const DataService = {
    getFeaturedRooms: (count) => {
      // Replace with actual data fetching logic
      const rooms = [
        {
          id: "1",
          title: "Cozy Studio Apartment",
          price: 8000,
          location: "Downtown",
          type: "Apartment",
          furnishing: "Furnished",
          amenities: ["wifi", "kitchen", "tv"],
          images: ["images/kotha1.jpeg"],
          owner: { name: "Bimal thapa", avatar: "images/profile.jpg" },
          postedDate: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Spacious 2-Bedroom House",
          price: 15000,
          location: "Suburb",
          type: "House",
          furnishing: "Unfurnished",
          amenities: ["parking", "balcony", "attached-bathroom"],
          images: ["images/kotha2.jpeg"],
          owner: { name: "Bimal thapa", avatar: "images/profile.jpg" },
          postedDate: new Date().toISOString(),
        },
        {
          id: "3",
          title: "Modern Loft",
          price: 12000,
          location: "City Center",
          type: "Loft",
          furnishing: "Semi-furnished",
          amenities: ["wifi", "washing-machine", "hot-water"],
          images: ["images/kotha3.jpeg"],
          owner: { name: "David Lee", avatar: "images/profile.jpg" },
          postedDate: new Date().toISOString(),
        },
      ]
      return rooms.slice(0, Math.min(count, rooms.length))
    },
    getAllRooms: () => {
      // Replace with actual data fetching logic
      const rooms = [
        {
          id: "1",
          title: "Cozy Studio Apartment",
          price: 8000,
          location: "pulchowk",
          type: "Apartment",
          furnishing: "Furnished",
          amenities: ["wifi", "kitchen", "tv"],
          images: ["images/kotha1.jpeg"],
          owner: { name: "Bimal thapa", avatar: "images/profile.jpg" },
          postedDate: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Spacious 2-Bedroom House",
          price: 15000,
          location: "patan",
          type: "House",
          furnishing: "Unfurnished",
          amenities: ["parking", "balcony", "attached-bathroom"],
          images: ["images/kotha2.jpeg"],
          owner: { name: "Bimal thapa", avatar: "images/profile.jpg" },
          postedDate: new Date().toISOString(),
        },
        {
          id: "3",
          title: "Modern Loft",
          price: 12000,
          location: "pokhra",
          type: "Loft",
          furnishing: "Semi-furnished",
          amenities: ["wifi", "washing-machine", "hot-water"],
          images: ["images/kotha3.jpeg"],
          owner: { name: "Bimal thapa", avatar: "images/profile.jpg" },
          postedDate: new Date().toISOString(),
        },
        {
          id: "4",
          title: "Luxury Penthouse",
          price: 30000,
          location: "",
          type: "Penthouse",
          furnishing: "Furnished",
          amenities: ["wifi", "kitchen", "tv", "pool", "gym"],
          images: ["images/kotha1.jpeg"],
          owner: { name: "Ram Thakur", avatar: "images/profile.jpg" },
          postedDate: new Date().toISOString(),
        },
        {
          id: "5",
          title: "Charming Cottage",
          price: 900,
          location: "Countryside",
          type: "Cottage",
          furnishing: "Semi-furnished",
          amenities: ["garden", "parking", "fireplace"],
          images: ["image5.jpg"],
          owner: { name: "Michael Brown", avatar: "avatar5.jpg" },
          postedDate: new Date().toISOString(),
        },
      ]
      return rooms
    },
  }

  // Load Featured Rooms
  function loadFeaturedRooms(DataService) {
    const featuredRoomsContainer = document.getElementById("featured-rooms")
    if (!featuredRoomsContainer) return

    try {
      // Get all rooms from DataService
      const allRooms = DataService.getAllRooms()

      // Sort by newest first
      allRooms.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))

      // Use the first 3 rooms as featured rooms (most recent ones)
      const featuredRooms = allRooms.slice(0, 3)

      if (featuredRooms.length === 0) {
        featuredRoomsContainer.innerHTML = '<p class="empty-state">No rooms available at the moment</p>'
        return
      }

      let html = ""
      featuredRooms.forEach((room) => {
        // Format date
        const postedDate = new Date(room.postedDate)
        const formattedDate = formatDate(postedDate)

        // Check if room is saved
        const savedRooms = JSON.parse(localStorage.getItem("savedRooms") || "[]")
        const isSaved = savedRooms.includes(room.id)

        html += `
      <div class="room-card">
        <a href="room-details.html?id=${room.id}" class="room-link" data-room-id="${room.id}">
          <div class="room-image">
            <img src="${room.images[0]}" alt="${room.title}">
            <div class="room-type">${room.furnishing} ${room.type}</div>
            <div class="room-save ${isSaved ? "saved" : ""}" data-room-id="${room.id}" title="${isSaved ? "Remove from Saved" : "Save Room"}">
              <i class="${isSaved ? "fas" : "far"} fa-heart"></i>
            </div>
          </div>
          <div class="room-content">
            <div class="room-price">Rs. ${room.price}/month</div>
            <h3 class="room-title">${room.title}</h3>
            <div class="room-location">
              <i class="fas fa-map-marker-alt"></i> ${room.location}
            </div>
            <div class="room-features">
              ${room.amenities
                .slice(0, 3)
                .map(
                  (amenity) => `
                  <div class="room-feature">
                    <i class="fas fa-${getAmenityIcon(amenity)}"></i> ${formatAmenityName(amenity)}
                  </div>
                `,
                )
                .join("")}
            </div>
          </div>
        </a>
        <div class="room-footer">
          <div class="room-owner">
            <img src="${room.owner.avatar}" alt="${room.owner.name}">
            <span>${room.owner.name}</span>
          </div>
          <div class="room-contact">
            <a href="#" class="contact-icon auth-required" data-auth="true" data-action="whatsapp" title="Contact via WhatsApp">
              <i class="fab fa-whatsapp"></i>
            </a>
            <a href="#" class="contact-icon auth-required" data-auth="true" data-action="messenger" title="Contact via Messenger">
              <i class="fab fa-facebook-messenger"></i>
            </a>
          </div>
          <div class="room-date">${formattedDate}</div>
        </div>
      </div>
    `
      })

      featuredRoomsContainer.innerHTML = html

      // Initialize save buttons
      initSaveButtons()

      // Setup authentication check for contact buttons
      setupContactButtonsAuth()

      console.log("Featured rooms loaded successfully")
    } catch (error) {
      console.error("Error loading featured rooms:", error)
      featuredRoomsContainer.innerHTML = '<p class="empty-state">Error loading rooms. Please try again later.</p>'
    }
  }

  // Setup authentication check for contact buttons
  function setupContactButtonsAuth() {
    document.addEventListener("click", (e) => {
      // Check if clicked element is an auth-required button
      if (e.target.classList.contains("auth-required") || e.target.closest(".auth-required")) {
        const button = e.target.classList.contains("auth-required") ? e.target : e.target.closest(".auth-required")

        e.preventDefault()

        // Show login required modal
        showLoginRequiredModal(button.getAttribute("data-action"))
      }
    })
  }

  // Show login required modal
  function showLoginRequiredModal(action) {
    // Create modal
    const modal = document.createElement("div")
    modal.className = "modal"
    modal.id = "login-required-modal"
    modal.style.display = "block"

    const modalContent = document.createElement("div")
    modalContent.className = "modal-content"

    let actionText = "contact the owner"
    if (action === "call") actionText = "call the owner"
    if (action === "whatsapp") actionText = "message on WhatsApp"
    if (action === "messenger") actionText = "message on Messenger"

    modalContent.innerHTML = `
    <span class="close-modal">&times;</span>
    <div class="login-required-message">
      <i class="fas fa-lock"></i>
      <h3>Login Required</h3>
      <p>You need to login to ${actionText}.</p>
      <div class="login-buttons">
        <a href="login.html?redirect=${encodeURIComponent(window.location.href)}" class="btn btn-primary">Login</a>
        <a href="signup.html?redirect=${encodeURIComponent(window.location.href)}" class="btn btn-secondary">Sign Up</a>
      </div>
    </div>
  `

    modal.appendChild(modalContent)
    document.body.appendChild(modal)
    document.body.style.overflow = "hidden"

    // Close modal
    const closeModal = modal.querySelector(".close-modal")
    closeModal.addEventListener("click", () => {
      modal.remove()
      document.body.style.overflow = "auto"
    })

    // Close modal when clicking outside
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.remove()
        document.body.style.overflow = "auto"
      }
    })
  }

  loadFeaturedRooms(DataService)

  // Handle search form submission
  const searchForm = document.getElementById("search-form")
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const location = document.getElementById("location").value
      const price = document.getElementById("price").value
      const type = document.getElementById("type").value

      // Build query string
      const params = new URLSearchParams()
      if (location) params.set("location", location)
      if (price) params.set("price", price)
      if (type) params.set("type", type)

      // Redirect to listings page
      window.location.href = `listings.html${params.toString() ? "?" + params.toString() : ""}`
    })
  }

  // Testimonial slider
  const testimonialSlider = document.getElementById("testimonial-slider")
  const prevTestimonial = document.getElementById("prev-testimonial")
  const nextTestimonial = document.getElementById("next-testimonial")

  if (testimonialSlider && prevTestimonial && nextTestimonial) {
    const testimonials = testimonialSlider.querySelectorAll(".testimonial")
    let currentTestimonial = 0

    // Show only the current testimonial
    function showTestimonial(index) {
      testimonials.forEach((testimonial, i) => {
        testimonial.style.display = i === index ? "block" : "none"
      })
    }

    // Initialize
    showTestimonial(currentTestimonial)

    // Previous testimonial
    prevTestimonial.addEventListener("click", () => {
      currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length
      showTestimonial(currentTestimonial)
    })

    // Next testimonial
    nextTestimonial.addEventListener("click", () => {
      currentTestimonial = (currentTestimonial + 1) % testimonials.length
      showTestimonial(currentTestimonial)
    })

    // Auto-rotate testimonials
    setInterval(() => {
      currentTestimonial = (currentTestimonial + 1) % testimonials.length
      showTestimonial(currentTestimonial)
    }, 8000)
  }

  // Initialize save buttons
  function initSaveButtons() {
    const saveButtons = document.querySelectorAll(".room-save")

    saveButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault()
        e.stopPropagation()

        const roomId = this.getAttribute("data-room-id")
        const savedRooms = JSON.parse(localStorage.getItem("savedRooms") || "[]")

        if (this.classList.contains("saved")) {
          // Remove from saved
          const index = savedRooms.indexOf(roomId)
          if (index > -1) {
            savedRooms.splice(index, 1)
          }
          this.classList.remove("saved")
          this.setAttribute("title", "Save Room")
          this.querySelector("i").className = "far fa-heart"
        } else {
          // Add to saved
          if (!savedRooms.includes(roomId)) {
            savedRooms.push(roomId)
          }
          this.classList.add("saved")
          this.setAttribute("title", "Remove from Saved")
          this.querySelector("i").className = "fas fa-heart"
        }

        localStorage.setItem("savedRooms", JSON.stringify(savedRooms))
      })
    })
  }

  // Helper function to get amenity icon
  function getAmenityIcon(amenity) {
    const icons = {
      wifi: "wifi",
      "attached-bathroom": "bath",
      "hot-water": "hot-tub",
      kitchen: "utensils",
      tv: "tv",
      "washing-machine": "tshirt",
      balcony: "door-open",
      parking: "parking",
      "electricity-backup": "bolt",
      "water-filter": "filter",
    }

    return icons[amenity] || "check"
  }

  // Helper function to format amenity name
  function formatAmenityName(amenity) {
    return amenity
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Helper function to format date
  function formatDate(date) {
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`
    } else {
      const months = Math.floor(diffDays / 30)
      return `${months} ${months === 1 ? "month" : "months"} ago`
    }
  }
})

