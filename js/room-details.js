// Import DataService (assuming it's in a separate file)
import DataService from "./data-service.js"

document.addEventListener("DOMContentLoaded", () => {
  // Get room ID from URL
  const urlParams = new URLSearchParams(window.location.search)
  const roomId = urlParams.get("id")

  if (!roomId) {
    // No room ID provided, redirect to listings
    window.location.href = "listings.html"
    return
  }

  // Get room details
  const room = DataService.getRoomById(roomId)

  if (!room) {
    // Room not found
    showError("Room not found")
    return
  }

  // Update page title and breadcrumb
  document.title = `${room.title} - KoshaKhoj`
  document.getElementById("room-title-breadcrumb").textContent = room.title

  // Render room details
  renderRoomDetails(room)

  // Load similar rooms
  loadSimilarRooms(room)

  // Add this new function call
  initRoomNavigation(room)

  // Initialize gallery modal
  initGalleryModal(room)
})

// Render room details
function renderRoomDetails(room) {
  const roomDetailsContainer = document.getElementById("room-details")

  // Format date
  const postedDate = new Date(room.postedDate)
  const formattedDate = formatDate(postedDate)

  // Check if room is saved
  const savedRooms = JSON.parse(localStorage.getItem("savedRooms") || "[]")
  const isSaved = savedRooms.includes(room.id)

  // Generate amenities HTML
  const amenitiesHtml = room.amenities
    .map((amenity) => {
      return `
            <div class="amenity-item">
                <i class="fas fa-${getAmenityIcon(amenity)}"></i>
                ${formatAmenityName(amenity)}
            </div>
        `
    })
    .join("")

  // Generate thumbnails HTML
  const thumbnailsHtml = room.images
    .map((image, index) => {
      return `
            <div class="room-thumbnail ${index === 0 ? "active" : ""}" data-index="${index}">
                <img src="${image}" alt="${room.title} - Image ${index + 1}">
            </div>
        `
    })
    .join("")

  // Generate HTML
  const html = `
        <div class="room-details-container">
            <div class="room-details-main">
                <div class="room-gallery">
                    <img src="${room.images[0]}" alt="${room.title}" class="room-main-image" id="main-image">
                    <div class="room-thumbnails">
                        ${thumbnailsHtml}
                    </div>
                </div>
                
                <div class="room-info-main">
                    <div class="room-info-header">
                        <h2 class="room-info-title">${room.title}</h2>
                        <div class="room-info-location">
                            <i class="fas fa-map-marker-alt"></i> ${room.location}
                        </div>
                    </div>
                    
                    <div class="room-info-meta">
                        <div class="room-info-meta-item">
                            <i class="fas fa-home"></i> ${formatAmenityName(room.type)} Room
                        </div>
                        <div class="room-info-meta-item">
                            <i class="fas fa-couch"></i> ${formatAmenityName(room.furnishing)}
                        </div>
                        <div class="room-info-meta-item">
                            <i class="fas fa-calendar-alt"></i> Posted ${formattedDate}
                        </div>
                    </div>
                    
                    <div class="room-info-price">
                        Rs. ${room.price}/month
                        ${room.deposit ? `<span class="deposit-info">(Deposit: Rs. ${room.deposit})</span>` : ""}
                    </div>
                    
                    <div class="room-info-description">
                        <h3>Description</h3>
                        <p>${room.description}</p>
                    </div>
                    
                    <div class="room-info-amenities">
                        <h3>Amenities</h3>
                        <div class="amenities-list">
                            ${amenitiesHtml}
                        </div>
                    </div>
                    
                    ${
                      room.rules
                        ? `
                    <div class="room-info-rules">
                        <h3>House Rules</h3>
                        <p>${room.rules}</p>
                    </div>
                    `
                        : ""
                    }
                    
                    <div class="room-info-map">
                        <h3>Location</h3>
                        <div class="map-container">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.2080248847!2d85.30964021506156!3d27.71524798279048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb18fcb77fd4f7%3A0x58099b8d37782dd0!2sThamel%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1625124512345!5m2!1sen!2snp" 
                                width="100%" 
                                height="300" 
                                style="border:0;" 
                                allowfullscreen="" 
                                loading="lazy">
                            </iframe>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="room-sidebar">
                <div class="owner-card">
                    <h3>Contact Owner</h3>
                    <div class="owner-info">
                        <div class="owner-avatar">
                            <img src="${room.owner.avatar}" alt="${room.owner.name}">
                        </div>
                        <div class="owner-details">
                            <h4>${room.owner.name}</h4>
                            <p class="owner-type">${formatAmenityName(room.owner.type)}</p>
                        </div>
                    </div>
                    
                    <div class="contact-options">
                        <a href="tel:${room.owner.phone}" class="btn btn-primary contact-btn">
                            <i class="fas fa-phone"></i> Call Owner
                        </a>
                        
                        ${
                          room.owner.whatsapp
                            ? `
                        <a href="https://wa.me/${room.owner.whatsapp}" target="_blank" class="btn btn-success contact-btn">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </a>
                        `
                            : ""
                        }
                        
                        <a href="mailto:${room.owner.email}" class="btn btn-secondary contact-btn">
                            <i class="fas fa-envelope"></i> Email
                        </a>
                        
                        <p class="contact-note">Mention that you found this on KoshaKhoj</p>
                    </div>
                </div>
                
                <div class="action-card">
                    <div class="action-buttons">
                        <button class="btn btn-outline action-btn ${isSaved ? "saved" : ""}" id="save-room" data-room-id="${room.id}">
                            <i class="${isSaved ? "fas" : "far"} fa-heart"></i> ${isSaved ? "Saved" : "Save Room"}
                        </button>
                        
                        <button class="btn btn-outline action-btn" id="share-room">
                            <i class="fas fa-share-alt"></i> Share
                        </button>
                        
                        <button class="btn btn-outline action-btn" id="report-room">
                            <i class="fas fa-flag"></i> Report Listing
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `

  roomDetailsContainer.innerHTML = html

  // Initialize thumbnails
  initThumbnails()

  // Initialize save button
  initSaveButton()

  // Initialize share button
  initShareButton(room)

  // Initialize report button
  initReportButton(room)
}

// Initialize thumbnails
function initThumbnails() {
  const mainImage = document.getElementById("main-image")
  const thumbnails = document.querySelectorAll(".room-thumbnail")

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", function () {
      // Update active thumbnail
      thumbnails.forEach((t) => t.classList.remove("active"))
      this.classList.add("active")

      // Update main image
      const index = this.getAttribute("data-index")
      mainImage.src = this.querySelector("img").src
    })
  })

  // Open gallery modal when clicking main image
  mainImage.addEventListener("click", () => {
    document.getElementById("gallery-modal").style.display = "block"
    document.body.style.overflow = "hidden"
  })
}

// Initialize gallery modal
function initGalleryModal(room) {
  const modal = document.getElementById("gallery-modal")
  const closeModal = modal.querySelector(".close-modal")
  const mainImage = document.getElementById("gallery-main-image")
  const thumbnailsContainer = document.getElementById("gallery-thumbnails")
  const prevButton = document.getElementById("gallery-prev")
  const nextButton = document.getElementById("gallery-next")
  const currentCounter = document.getElementById("gallery-current")
  const totalCounter = document.getElementById("gallery-total")

  let currentIndex = 0

  // Generate thumbnails
  let thumbnailsHtml = ""
  room.images.forEach((image, index) => {
    thumbnailsHtml += `
            <div class="gallery-thumbnail ${index === 0 ? "active" : ""}" data-index="${index}">
                <img src="${image}" alt="${room.title} - Image ${index + 1}">
            </div>
        `
  })
  thumbnailsContainer.innerHTML = thumbnailsHtml

  // Set initial image
  mainImage.src = room.images[0]
  currentCounter.textContent = "1"
  totalCounter.textContent = room.images.length

  // Close modal
  closeModal.addEventListener("click", () => {
    modal.style.display = "none"
    document.body.style.overflow = "auto"
  })

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none"
      document.body.style.overflow = "auto"
    }
  })

  // Previous image
  prevButton.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + room.images.length) % room.images.length
    updateGallery()
  })

  // Next image
  nextButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % room.images.length
    updateGallery()
  })

  // Thumbnail click
  const thumbnails = thumbnailsContainer.querySelectorAll(".gallery-thumbnail")
  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", function () {
      currentIndex = Number.parseInt(this.getAttribute("data-index"))
      updateGallery()
    })
  })

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (modal.style.display === "block") {
      if (e.key === "ArrowLeft") {
        currentIndex = (currentIndex - 1 + room.images.length) % room.images.length
        updateGallery()
      } else if (e.key === "ArrowRight") {
        currentIndex = (currentIndex + 1) % room.images.length
        updateGallery()
      } else if (e.key === "Escape") {
        modal.style.display = "none"
        document.body.style.overflow = "auto"
      }
    }
  })

  // Update gallery
  function updateGallery() {
    mainImage.src = room.images[currentIndex]
    currentCounter.textContent = (currentIndex + 1).toString()

    thumbnails.forEach((thumbnail) => {
      thumbnail.classList.remove("active")
    })
    thumbnails[currentIndex].classList.add("active")

    // Scroll thumbnail into view
    thumbnails[currentIndex].scrollIntoView({ behavior: "smooth", inline: "center" })
  }
}

// Initialize save button
function initSaveButton() {
  const saveButton = document.getElementById("save-room")

  saveButton.addEventListener("click", function () {
    const roomId = this.getAttribute("data-room-id")
    const savedRooms = JSON.parse(localStorage.getItem("savedRooms") || "[]")

    if (this.classList.contains("saved")) {
      // Remove from saved
      const index = savedRooms.indexOf(roomId)
      if (index > -1) {
        savedRooms.splice(index, 1)
      }
      this.classList.remove("saved")
      this.innerHTML = '<i class="far fa-heart"></i> Save Room'
    } else {
      // Add to saved
      if (!savedRooms.includes(roomId)) {
        savedRooms.push(roomId)
      }
      this.classList.add("saved")
      this.innerHTML = '<i class="fas fa-heart"></i> Saved'
    }

    localStorage.setItem("savedRooms", JSON.stringify(savedRooms))
  })
}

// Initialize share button
function initShareButton(room) {
  const shareButton = document.getElementById("share-room")

  shareButton.addEventListener("click", () => {
    if (navigator.share) {
      navigator
        .share({
          title: room.title,
          text: `Check out this room: ${room.title}`,
          url: window.location.href,
        })
        .catch((error) => {
          console.error("Error sharing:", error)
          showShareFallback(room)
        })
    } else {
      showShareFallback(room)
    }
  })
}

// Show share fallback
function showShareFallback(room) {
  // Create modal
  const modal = document.createElement("div")
  modal.className = "modal"
  modal.id = "share-modal"
  modal.style.display = "block"

  const modalContent = document.createElement("div")
  modalContent.className = "modal-content"

  modalContent.innerHTML = `
        <span class="close-modal">&times;</span>
        <h2>Share this Room</h2>
        <div class="share-options">
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank" class="share-option">
                <i class="fab fa-facebook"></i>
                <span>Facebook</span>
            </a>
            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this room: ${room.title}`)}&url=${encodeURIComponent(window.location.href)}" target="_blank" class="share-option">
                <i class="fab fa-twitter"></i>
                <span>Twitter</span>
            </a>
            <a href="https://wa.me/?text=${encodeURIComponent(`Check out this room: ${room.title} ${window.location.href}`)}" target="_blank" class="share-option">
                <i class="fab fa-whatsapp"></i>
                <span>WhatsApp</span>
            </a>
            <a href="mailto:?subject=${encodeURIComponent(`Room Listing: ${room.title}`)}&body=${encodeURIComponent(`Check out this room: ${room.title} ${window.location.href}`)}" class="share-option">
                <i class="fas fa-envelope"></i>
                <span>Email</span>
            </a>
        </div>
        <div class="share-link">
            <input type="text" value="${window.location.href}" id="share-url" readonly>
            <button class="btn btn-primary" id="copy-link">Copy Link</button>
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

  // Copy link
  const copyButton = document.getElementById("copy-link")
  const shareUrl = document.getElementById("share-url")

  copyButton.addEventListener("click", function () {
    shareUrl.select()
    document.execCommand("copy")

    // Show copied message
    const originalText = this.textContent
    this.textContent = "Copied!"
    setTimeout(() => {
      this.textContent = originalText
    }, 2000)
  })

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.remove()
      document.body.style.overflow = "auto"
    }
  })
}

// Initialize report button
function initReportButton(room) {
  const reportButton = document.getElementById("report-room")

  reportButton.addEventListener("click", () => {
    // Create modal
    const modal = document.createElement("div")
    modal.className = "modal"
    modal.id = "report-modal"
    modal.style.display = "block"

    const modalContent = document.createElement("div")
    modalContent.className = "modal-content"

    modalContent.innerHTML = `
            <span class="close-modal">&times;</span>
            <h2>Report Listing</h2>
            <p>Please let us know why you're reporting this listing:</p>
            <form id="report-form">
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="radio" name="report-reason" value="inaccurate" required>
                        Inaccurate information
                    </label>
                    <label class="checkbox-label">
                        <input type="radio" name="report-reason" value="spam">
                        Spam or misleading
                    </label>
                    <label class="checkbox-label">
                        <input type="radio" name="report-reason" value="duplicate">
                        Duplicate listing
                    </label>
                    <label class="checkbox-label">
                        <input type="radio" name="report-reason" value="unavailable">
                        Room no longer available
                    </label>
                    <label class="checkbox-label">
                        <input type="radio" name="report-reason" value="other">
                        Other
                    </label>
                </div>
                
                <div class="form-group">
                    <label for="report-details">Additional Details</label>
                    <textarea id="report-details" name="report-details" rows="4" placeholder="Please provide any additional details..."></textarea>
                </div>
                
                <button type="submit" class="btn btn-primary">Submit Report</button>
            </form>
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

    // Handle form submission
    const reportForm = document.getElementById("report-form")
    reportForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form data
      const formData = new FormData(reportForm)
      const reason = formData.get("report-reason")
      const details = formData.get("report-details")

      // In a real app, you would send this data to your server
      console.log("Report submitted:", { roomId: room.id, reason, details })

      // Show success message
      modalContent.innerHTML = `
                <span class="close-modal">&times;</span>
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <h3>Report Submitted</h3>
                    <p>Thank you for your feedback. We'll review this listing and take appropriate action.</p>
                    <button class="btn btn-primary" id="close-report">Close</button>
                </div>
            `

      // Close button
      document.getElementById("close-report").addEventListener("click", () => {
        modal.remove()
        document.body.style.overflow = "auto"
      })

      // Update close modal event
      modal.querySelector(".close-modal").addEventListener("click", () => {
        modal.remove()
        document.body.style.overflow = "auto"
      })
    })

    // Close modal when clicking outside
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.remove()
        document.body.style.overflow = "auto"
      }
    })
  })
}

// Load similar rooms
function loadSimilarRooms(currentRoom) {
  const similarRoomsContainer = document.getElementById("similar-rooms")

  // Get all rooms
  const allRooms = DataService.getAllRooms()

  // Filter similar rooms (same location or type, but not the current room)
  let similarRooms = allRooms.filter(
    (room) => room.id !== currentRoom.id && (room.location === currentRoom.location || room.type === currentRoom.type),
  )

  // If not enough similar rooms, get random rooms
  if (similarRooms.length < 3) {
    const randomRooms = allRooms
      .filter((room) => room.id !== currentRoom.id && !similarRooms.some((r) => r.id === room.id))
      .sort(() => 0.5 - Math.random())
      .slice(0, 3 - similarRooms.length)

    similarRooms = [...similarRooms, ...randomRooms]
  }

  // Limit to 3 rooms
  similarRooms = similarRooms.slice(0, 3)

  if (similarRooms.length === 0) {
    similarRoomsContainer.innerHTML = '<p class="empty-state">No similar rooms available</p>'
    return
  }

  let html = ""
  similarRooms.forEach((room) => {
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
                    </div>
                </a>
            </div>
        `
  })

  similarRoomsContainer.innerHTML = html

  // Initialize save buttons
  const saveButtons = similarRoomsContainer.querySelectorAll(".room-save")
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

// Add this new function after loadSimilarRooms function
// Initialize room navigation
function initRoomNavigation(currentRoom) {
  // Get adjacent rooms
  const { prevRoom, nextRoom } = DataService.getAdjacentRooms(currentRoom.id)

  // Create navigation HTML
  const navigationHtml = `
        <div class="room-navigation">
            ${
              prevRoom
                ? `
                <a href="room-details.html?id=${prevRoom.id}" class="room-nav-btn prev-room">
                    <i class="fas fa-chevron-left"></i>
                    <div class="nav-preview">
                        <div class="nav-preview-image">
                            <img src="${prevRoom.images[0]}" alt="${prevRoom.title}">
                        </div>
                        <div class="nav-preview-info">
                            <span class="nav-direction">Previous Room</span>
                            <span class="nav-title">${prevRoom.title}</span>
                        </div>
                    </div>
                </a>
            `
                : `
                <div class="room-nav-btn disabled">
                    <i class="fas fa-chevron-left"></i>
                </div>
            `
            }
            
            <a href="listings.html" class="room-nav-btn back-to-list">
                <i class="fas fa-th-large"></i>
                <span>All Rooms</span>
            </a>
            
            ${
              nextRoom
                ? `
                <a href="room-details.html?id=${nextRoom.id}" class="room-nav-btn next-room">
                    <div class="nav-preview">
                        <div class="nav-preview-info">
                            <span class="nav-direction">Next Room</span>
                            <span class="nav-title">${nextRoom.title}</span>
                        </div>
                        <div class="nav-preview-image">
                            <img src="${nextRoom.images[0]}" alt="${nextRoom.title}">
                        </div>
                    </div>
                    <i class="fas fa-chevron-right"></i>
                </a>
            `
                : `
                <div class="room-nav-btn disabled">
                    <i class="fas fa-chevron-right"></i>
                </div>
            `
            }
        </div>
    `

  // Add navigation to the page
  const roomDetailsContainer = document.getElementById("room-details")
  roomDetailsContainer.insertAdjacentHTML("afterbegin", navigationHtml)

  // Add keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && prevRoom) {
      window.location.href = `room-details.html?id=${prevRoom.id}`
    } else if (e.key === "ArrowRight" && nextRoom) {
      window.location.href = `room-details.html?id=${nextRoom.id}`
    }
  })
}

// Show error
function showError(message) {
  const roomDetailsContainer = document.getElementById("room-details")

  roomDetailsContainer.innerHTML = `
        <div class="error-container">
            <i class="fas fa-exclamation-circle"></i>
            <h3>Error</h3>
            <p>${message}</p>
            <a href="listings.html" class="btn btn-primary">Browse Rooms</a>
        </div>
    `
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

