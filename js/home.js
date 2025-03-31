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
          location: "Pulchowk",
          type: "Apartment",
          furnishing: "Furnished",
          amenities: ["wifi", "kitchen", "tv"],
          images: ["images/room.jpg"],
          owner: { name: "Hari bdr", avatar: "images/female.jpeg" },
          postedDate: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Spacious 2-Bedroom House",
          price: 15000,
          location: "Anamnagar",
          type: "House",
          furnishing: "Unfurnished",
          amenities: ["parking", "balcony", "attached-bathroom"],
          images: ["images/room.jpg"],
          owner: { name: "Bekhaman Maharjan", avatar: "images/female.jpeg" },
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
          images: ["images/room.jpg"],
          owner: { name: "Durga Parsai", avatar: "images/female.jpeg" },
          postedDate: new Date().toISOString(),
        },
      ]
      return rooms.slice(0, Math.min(count, rooms.length))
    },
  }

  // Load Featured Rooms
  const featuredRoomsContainer = document.getElementById("featured-rooms")

  if (featuredRoomsContainer) {
    // Get featured rooms from data service
    const featuredRooms = DataService.getFeaturedRooms(3)

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
                    <a href="room-details.html?id=${room.id}">
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
                        <div class="room-date">${formattedDate}</div>
                    </div>
                </div>
            `
    })

    featuredRoomsContainer.innerHTML = html

    // Initialize save buttons
    initSaveButtons()
  }

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

