document.addEventListener("DOMContentLoaded", () => {
  // Import DataService or declare it
  // Assuming DataService is defined in a separate file, you would import it like this:
  // import DataService from './dataService.js';
  // Or, if it's a global variable, ensure it's declared before this script runs.
  // For demonstration purposes, let's create a mock DataService:
  const DataService = {
    getAllRooms: () => {
      // Replace this with your actual data fetching logic
      return [
        {
          id: "1",
          title: "Cozy Room in City Center",
          price: 15000,
          location: "City Center",
          type: "single",
          furnishing: "furnished",
          amenities: ["wifi", "attached-bathroom"],
          images: ["image1.jpg"],
          owner: { name: "Durga parsai", avatar: "avatar1.jpg" },
          postedDate: "2024-01-01",
        },
        {
          id: "2",
          title: "Spacious Apartment with Balcony",
          price: 25000,
          location: "Anamnagar",
          type: "apartment",
          furnishing: "unfurnished",
          amenities: ["wifi", "balcony", "parking"],
          images: ["image2.jpg"],
          owner: { name: "Hari bdr", avatar: "avatar2.jpg" },
          postedDate: "2024-01-05",
        },
        {
          id: "3",
          title: "Modern Studio with Kitchen",
          price: 18000,
          location: "pulchowk",
          type: "studio",
          furnishing: "semi-furnished",
          amenities: ["kitchen", "tv", "washing-machine"],
          images: ["image3.jpg"],
          owner: { name: "krishna parsad", avatar: "avatar3.jpg" },
          postedDate: "2024-01-10",
        },
        {
          id: "4",
          title: "Luxury Penthouse with City View",
          price: 30000,
          location: "koteswor",
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
          images: ["image4.jpg"],
          owner: { name: "Indra kumar", avatar: "avatar4.jpg" },
          postedDate: "2024-01-15",
        },
        {
          id: "5",
          title: "Budget-Friendly Room near University",
          price: 12000,
          location: "New Baneswor",
          type: "single",
          furnishing: "furnished",
          amenities: ["wifi", "attached-bathroom"],
          images: ["image5.jpg"],
          owner: { name: "Sikha BK", avatar: "avatar5.jpg" },
          postedDate: "2024-01-20",
        },
        {
          id: "6",
          title: "Quiet Room in Residential Area",
          price: 16000,
          location: "Maitidevi",
          type: "single",
          furnishing: "unfurnished",
          amenities: ["wifi", "parking"],
          images: ["image6.jpg"],
          owner: { name: "Fattha Bahadur", avatar: "avatar6.jpg" },
          postedDate: "2024-01-25",
        },
        {
          id: "7",
          title: "Comfortable Apartment with Garden",
          price: 22000,
          location: "Baneswor Chowk",
          type: "apartment",
          furnishing: "semi-furnished",
          amenities: ["wifi", "balcony", "parking", "garden"],
          images: ["image7.jpg"],
          owner: { name: "Rima karki", avatar: "avatar7.jpg" },
          postedDate: "2024-01-30",
        },
        {
          id: "8",
          title: "Stylish Studio in Arts District",
          price: 19000,
          location: "kalanki",
          type: "studio",
          furnishing: "fully-furnished",
          amenities: ["kitchen", "tv", "washing-machine", "balcony"],
          images: ["image8.jpg"],
          owner: { name: "Madan Basnet", avatar: "avatar8.jpg" },
          postedDate: "2024-02-05",
        },
        {
          id: "9",
          title: "Affordable Room near Public Transport",
          price: 13000,
          location: "Ekanta Kuna",
          type: "single",
          furnishing: "furnished",
          amenities: ["wifi", "attached-bathroom"],
          images: ["image9.jpg"],
          owner: { name: "Ridima Dulal", avatar: "avatar9.jpg" },
          postedDate: "2024-02-10",
        },
        {
          id: "10",
          title: "Executive Suite with Office Space",
          price: 28000,
          location: "Jamal",
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
          images: ["image10.jpg"],
          owner: { name: "Samyek Lal", avatar: "avatar10.jpg" },
          postedDate: "2024-02-15",
        },
      ]
    },
  }

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
      filtered = filtered.filter((room) => state.filters.amenities.every((amenity) => room.amenities.includes(amenity)))
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
                    <button class="btn btn-primary" onclick="resetFilters()">Reset Filters</button>
                </div>
            `
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
                        ${amenities}
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
        `

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

  // Initialize
  init()
})

