document.addEventListener("DOMContentLoaded", () => {
  // Import DataService dynamically
  import("./data-service.js")
    .then((module) => {
      const DataService = module.default
      DataService.init()
      initListings(DataService)
    })
    .catch((error) => {
      console.error("Error importing DataService:", error)
      showError("Failed to load data. Please try again later.")
    })

  function initListings(DataService) {
    // Elements
    const roomsContainer = document.getElementById("rooms-container")
    const resultsCount = document.getElementById("results-count")
    const paginationContainer = document.getElementById("pagination")
    const gridViewBtn = document.getElementById("grid-view")
    const listViewBtn = document.getElementById("list-view")
    const sortBySelect = document.getElementById("sort-by")
    const searchForm = document.getElementById("search-form")
    const filterForm = document.getElementById("filter-form")
    const priceRangeInput = document.getElementById("price-range")
    const priceValueDisplay = document.getElementById("price-value")

    // State
    const state = {
      rooms: [],
      filteredRooms: [],
      currentPage: 1,
      roomsPerPage: 9,
      view: "grid", // 'grid' or 'list'
      sortBy: "newest",
      filters: {
        location: "",
        priceMin: 0,
        priceMax: 30000,
        roomTypes: [],
        furnishing: [],
        amenities: [],
      },
    }

    // Initialize
    function init() {
      // Load rooms from data service
      state.rooms = DataService.getAllRooms()
      console.log(`Loaded ${state.rooms.length} rooms in listings page`)

      // Sort rooms by newest first by default
      state.rooms.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))

      state.filteredRooms = [...state.rooms]

      // Check if we're coming from a room submission
      const fromSubmission = new URLSearchParams(window.location.search).get("fromSubmission")
      if (fromSubmission === "true") {
        // Show a success toast/notification
        showNotification("Your room has been successfully added to listings!", "success")
      }

      // Set up event listeners
      setupEventListeners()

      // Apply URL parameters if any
      applyUrlParams()

      // Render rooms
      renderRooms()

      // Setup authentication check for contact buttons
      setupContactButtonsAuth()
    }

    // Add this function to show notifications
    function showNotification(message, type = "info") {
      const notification = document.createElement("div")
      notification.className = `notification ${type}`
      notification.innerHTML = `
        <div class="notification-content">
          <i class="fas ${type === "success" ? "fa-check-circle" : "fa-info-circle"}"></i>
          <p>${message}</p>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
      `

      document.body.appendChild(notification)

      // Add styles for the notification
      const style = document.createElement("style")
      style.textContent = `
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 15px 20px;
          background-color: ${type === "success" ? "rgba(46, 204, 113, 0.9)" : "rgba(52, 152, 219, 0.9)"};
          color: white;
          border-radius: var(--border-radius-md);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-width: 300px;
          max-width: 500px;
          animation: slideIn 0.3s ease-out forwards;
        }
        
        .notification-content {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .notification-content i {
          font-size: 1.5rem;
        }
        
        .notification-content p {
          margin: 0;
        }
        
        .notification-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 5px;
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `
      document.head.appendChild(style)

      const contactStyle = document.createElement("style")
      contactStyle.textContent = `
        .room-contact {
          display: flex;
          gap: 10px;
        }
        
        .contact-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          color: white;
          transition: transform 0.2s;
        }
        
        .contact-icon:hover {
          transform: scale(1.1);
        }
        
        .contact-icon i {
          font-size: 16px;
        }
        
        .contact-icon[data-action="whatsapp"] {
          background-color: #25D366;
        }
        
        .contact-icon[data-action="messenger"] {
          background-color: #0084FF;
        }
        
        .room-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-sm) var(--spacing-md);
          border-top: 1px solid rgba(255, 59, 59, 0.1);
        }
      `
      document.head.appendChild(contactStyle)

      // Add close button functionality
      const closeBtn = notification.querySelector(".notification-close")
      closeBtn.addEventListener("click", () => {
        notification.style.animation = "slideOut 0.3s ease-out forwards"
        setTimeout(() => {
          notification.remove()
        }, 300)
      })

      // Auto-remove after 5 seconds
      setTimeout(() => {
        notification.style.animation = "slideOut 0.3s ease-out forwards"
        setTimeout(() => {
          notification.remove()
        }, 300)
      }, 5000)
    }

    // Set up event listeners
    function setupEventListeners() {
      // View toggle
      gridViewBtn.addEventListener("click", () => {
        setView("grid")
      })

      listViewBtn.addEventListener("click", () => {
        setView("list")
      })

      // Sort change
      sortBySelect.addEventListener("change", () => {
        state.sortBy = sortBySelect.value
        sortRooms()
        renderRooms()
      })

      // Search form
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault()
        applySearchFilters()
      })

      // Filter form
      filterForm.addEventListener("submit", (e) => {
        e.preventDefault()
        applyDetailedFilters()
      })

      // Reset filters
      filterForm.querySelector('button[type="reset"]').addEventListener("click", () => {
        resetFilters()
      })

      // Price range slider
      priceRangeInput.addEventListener("input", () => {
        const value = priceRangeInput.value
        priceValueDisplay.textContent = value === "30000" ? "Rs. 30,000+" : `Rs. ${value}`
        state.filters.priceMax = Number.parseInt(value)
      })
    }

    // Apply URL parameters
    function applyUrlParams() {
      const urlParams = new URLSearchParams(window.location.search)

      // Location
      if (urlParams.has("location")) {
        const location = urlParams.get("location")
        document.getElementById("location").value = location
        state.filters.location = location
      }

      // Price
      if (urlParams.has("price")) {
        const price = urlParams.get("price")
        document.getElementById("price").value = price

        // Parse price range
        if (price) {
          const [min, max] = price.split("-").map((p) => Number.parseInt(p) || 0)
          state.filters.priceMin = min
          state.filters.priceMax = max || 30000

          // Update price slider if in range
          if (state.filters.priceMax <= 30000) {
            priceRangeInput.value = state.filters.priceMax
            priceValueDisplay.textContent = `Rs. ${state.filters.priceMax}`
          }
        }
      }

      // Type
      if (urlParams.has("type")) {
        const type = urlParams.get("type")
        document.getElementById("type").value = type

        // Check corresponding checkbox
        const typeCheckbox = document.querySelector(`input[name="room-type"][value="${type}"]`)
        if (typeCheckbox) {
          typeCheckbox.checked = true
          state.filters.roomTypes.push(type)
        }
      }

      // Apply filters
      filterRooms()
    }

    // Set view (grid or list)
    function setView(view) {
      state.view = view

      // Update UI
      if (view === "grid") {
        roomsContainer.className = "room-grid"
        gridViewBtn.classList.add("active")
        listViewBtn.classList.remove("active")
      } else {
        roomsContainer.className = "room-list"
        listViewBtn.classList.add("active")
        gridViewBtn.classList.remove("active")
      }

      // Re-render rooms
      renderRooms()
    }

    // Apply search filters
    function applySearchFilters() {
      // Get values from search form
      const location = document.getElementById("location").value
      const price = document.getElementById("price").value
      const type = document.getElementById("type").value

      // Update state
      state.filters.location = location

      // Parse price range
      if (price) {
        const [min, max] = price.split("-").map((p) => Number.parseInt(p) || 0)
        state.filters.priceMin = min
        state.filters.priceMax = max || 30000

        // Update price slider if in range
        if (state.filters.priceMax <= 30000) {
          priceRangeInput.value = state.filters.priceMax
          priceValueDisplay.textContent = `Rs. ${state.filters.priceMax}`
        }
      } else {
        state.filters.priceMin = 0
        state.filters.priceMax = 30000
        priceRangeInput.value = 30000
        priceValueDisplay.textContent = "Rs. 30,000+"
      }

      // Update room types
      if (type) {
        state.filters.roomTypes = [type]

        // Check corresponding checkbox
        const typeCheckboxes = document.querySelectorAll('input[name="room-type"]')
        typeCheckboxes.forEach((checkbox) => {
          checkbox.checked = checkbox.value === type
        })
      } else {
        state.filters.roomTypes = []
      }

      // Reset to first page
      state.currentPage = 1

      // Apply filters
      filterRooms()

      // Update URL
      updateUrl()
    }

    // Apply detailed filters
    function applyDetailedFilters() {
      // Get price range
      state.filters.priceMax = Number.parseInt(priceRangeInput.value)

      // Get room types
      const roomTypeCheckboxes = document.querySelectorAll('input[name="room-type"]:checked')
      state.filters.roomTypes = Array.from(roomTypeCheckboxes).map((cb) => cb.value)

      // Get furnishing
      const furnishingCheckboxes = document.querySelectorAll('input[name="furnishing"]:checked')
      state.filters.furnishing = Array.from(furnishingCheckboxes).map((cb) => cb.value)

      // Get amenities
      const amenitiesCheckboxes = document.querySelectorAll('input[name="amenities"]:checked')
      state.filters.amenities = Array.from(amenitiesCheckboxes).map((cb) => cb.value)

      // Reset to first page
      state.currentPage = 1

      // Apply filters
      filterRooms()

      // Update URL
      updateUrl()
    }

    // Reset all filters
    function resetFilters() {
      // Reset state
      state.filters = {
        location: "",
        priceMin: 0,
        priceMax: 30000,
        roomTypes: [],
        furnishing: [],
        amenities: [],
      }

      // Reset UI
      document.getElementById("location").value = ""
      document.getElementById("price").value = ""
      document.getElementById("type").value = ""
      priceRangeInput.value = 30000
      priceValueDisplay.textContent = "Rs. 30,000+"

      // Uncheck all checkboxes
      const checkboxes = filterForm.querySelectorAll('input[type="checkbox"]')
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false
      })

      // Reset to first page
      state.currentPage = 1

      // Apply filters
      filterRooms()

      // Update URL
      updateUrl()
    }

    // Filter rooms based on current filters
    function filterRooms() {
      let filtered = [...state.rooms]

      // Filter by location
      if (state.filters.location) {
        filtered = filtered.filter((room) => room.location === state.filters.location)
      }

      // Filter by price range
      filtered = filtered.filter(
        (room) =>
          room.price >= state.filters.priceMin &&
          (state.filters.priceMax === 30000 ? true : room.price <= state.filters.priceMax),
      )

      // Filter by room types
      if (state.filters.roomTypes.length > 0) {
        filtered = filtered.filter((room) => state.filters.roomTypes.includes(room.type))
      }

      // Filter by furnishing
      if (state.filters.furnishing.length > 0) {
        filtered = filtered.filter((room) => state.filters.furnishing.includes(room.furnishing))
      }

      // Filter by amenities
      if (state.filters.amenities.length > 0) {
        filtered = filtered.filter((room) =>
          state.filters.amenities.every((amenity) => room.amenities.includes(amenity)),
        )
      }

      // Update state
      state.filteredRooms = filtered

      // Sort rooms
      sortRooms()

      // Render rooms
      renderRooms()
    }

    // Sort rooms based on current sort option
    function sortRooms() {
      switch (state.sortBy) {
        case "price-low":
          state.filteredRooms.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          state.filteredRooms.sort((a, b) => b.price - a.price)
          break
        case "newest":
        default:
          state.filteredRooms.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
          break
      }
    }

    // Render rooms
    function renderRooms() {
      // Update results count
      resultsCount.textContent = state.filteredRooms.length

      // Calculate pagination
      const totalPages = Math.ceil(state.filteredRooms.length / state.roomsPerPage)
      const startIndex = (state.currentPage - 1) * state.roomsPerPage
      const endIndex = Math.min(startIndex + state.roomsPerPage, state.filteredRooms.length)
      const currentRooms = state.filteredRooms.slice(startIndex, endIndex)

      // Clear container
      roomsContainer.innerHTML = ""

      // Check if no results
      if (currentRooms.length === 0) {
        roomsContainer.innerHTML = `
          <div class="no-results">
            <i class="fas fa-search"></i>
            <h3>No rooms found</h3>
            <p>Try adjusting your filters or search criteria</p>
            <button class="btn btn-primary" id="reset-filters-btn">Reset Filters</button>
          </div>
        `

        // Add event listener to the reset filters button
        const resetFiltersBtn = document.getElementById("reset-filters-btn")
        if (resetFiltersBtn) {
          resetFiltersBtn.addEventListener("click", resetFilters)
        }

        paginationContainer.innerHTML = ""
        return
      }

      // Render rooms
      currentRooms.forEach((room) => {
        const roomElement = createRoomElement(room)
        roomsContainer.appendChild(roomElement)
      })

      // Render pagination
      renderPagination(totalPages)

      // Initialize save buttons
      initSaveButtons()
    }

    // Create room element
    function createRoomElement(room) {
      const roomElement = document.createElement("div")
      roomElement.className = state.view === "grid" ? "room-card" : "room-card list-view"

      // Format date
      const postedDate = new Date(room.postedDate)
      const formattedDate = formatDate(postedDate)

      // Format amenities
      const amenities = room.amenities
        .slice(0, 3)
        .map((amenity) => {
          return `
            <div class="room-feature">
              <i class="fas fa-${getAmenityIcon(amenity)}"></i> ${formatAmenityName(amenity)}
            </div>
          `
        })
        .join("")

      // Check if room is saved
      const savedRooms = JSON.parse(localStorage.getItem("savedRooms") || "[]")
      const isSaved = savedRooms.includes(room.id)

      roomElement.innerHTML = `
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
              ${amenities}
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
      `

      // Add click event listener to ensure correct room ID is passed
      const roomLink = roomElement.querySelector(".room-link")
      if (roomLink) {
        roomLink.addEventListener("click", (e) => {
          // Store the room ID in session storage
          sessionStorage.setItem("lastClickedRoomId", room.id)
          console.log("Clicked on room:", room.title, "ID:", room.id, "- Stored in session storage")
          
          // Let the default navigation happen (the href will take us to room-details.html)
        })
      }

      return roomElement
    }

    // Render pagination
    function renderPagination(totalPages) {
      if (totalPages <= 1) {
        paginationContainer.innerHTML = ""
        return
      }

      let paginationHtml = ""

      // Previous button
      paginationHtml += `
        <div class="pagination-item ${state.currentPage === 1 ? "disabled" : ""}" data-page="${state.currentPage - 1}">
          <i class="fas fa-chevron-left"></i>
        </div>
      `

      // Page numbers
      const maxPages = 5
      let startPage = Math.max(1, state.currentPage - Math.floor(maxPages / 2))
      const endPage = Math.min(totalPages, startPage + maxPages - 1)

      if (endPage - startPage + 1 < maxPages) {
        startPage = Math.max(1, endPage - maxPages + 1)
      }

      for (let i = startPage; i <= endPage; i++) {
        paginationHtml += `
          <div class="pagination-item ${i === state.currentPage ? "active" : ""}" data-page="${i}">
            ${i}
          </div>
        `
      }

      // Next button
      paginationHtml += `
        <div class="pagination-item ${state.currentPage === totalPages ? "disabled" : ""}" data-page="${state.currentPage + 1}">
          <i class="fas fa-chevron-right"></i>
        </div>
      `

      paginationContainer.innerHTML = paginationHtml

      // Add event listeners
      const paginationItems = paginationContainer.querySelectorAll(".pagination-item:not(.disabled)")
      paginationItems.forEach((item) => {
        item.addEventListener("click", () => {
          const page = Number.parseInt(item.getAttribute("data-page"))
          if (page !== state.currentPage) {
            state.currentPage = page
            renderRooms()

            // Scroll to top of listings
            document.querySelector(".listings-header").scrollIntoView({ behavior: "smooth" })
          }
        })
      })
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

          // Update saved rooms list
          updateSavedRoomsList()
        })
      })
    }

    // Update saved rooms list
    function updateSavedRoomsList() {
      const savedRoomsList = document.getElementById("saved-rooms-list")
      if (!savedRoomsList) return

      const savedRoomIds = JSON.parse(localStorage.getItem("savedRooms") || "[]")

      if (savedRoomIds.length === 0) {
        savedRoomsList.innerHTML = '<p class="empty-state">No saved rooms yet</p>'
        return
      }

      // Get saved rooms data
      const savedRooms = state.rooms.filter((room) => savedRoomIds.includes(room.id))

      let html = ""
      savedRooms.forEach((room) => {
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
          const roomId = this.getAttribute("data-room-id")
          const savedRooms = JSON.parse(localStorage.getItem("savedRooms") || "[]")
          const index = savedRooms.indexOf(roomId)

          if (index > -1) {
            savedRooms.splice(index, 1)
            localStorage.setItem("savedRooms", JSON.stringify(savedRooms))

            // Update save button on room card
            const saveButton = document.querySelector(`.room-save[data-room-id="${roomId}"]`)
            if (saveButton) {
              saveButton.classList.remove("saved")
              saveButton.setAttribute("title", "Save Room")
              saveButton.querySelector("i").className = "far fa-heart"
            }

            // Update saved rooms list
            updateSavedRoomsList()
          }
        })
      })
    }

    // Update URL with current filters
    function updateUrl() {
      const params = new URLSearchParams()

      if (state.filters.location) {
        params.set("location", state.filters.location)
      }

      if (state.filters.priceMin > 0 || state.filters.priceMax < 30000) {
        params.set("price", `${state.filters.priceMin}-${state.filters.priceMax}`)
      }

      if (state.filters.roomTypes.length === 1) {
        params.set("type", state.filters.roomTypes[0])
      }

      // Update URL without reloading page
      const newUrl = `${window.location.pathname}${params.toString() ? "?" + params.toString() : ""}`
      window.history.pushState({}, "", newUrl)
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

    // Show error message
    function showError(message) {
      roomsContainer.innerHTML = `
        <div class="error-container">
          <i class="fas fa-exclamation-circle"></i>
          <h3>Error</h3>
          <p>${message}</p>
          <button class="btn btn-primary" onclick="location.reload()">Try Again</button>
        </div>
      `
    }

    // Initialize
    init()
  }
})
