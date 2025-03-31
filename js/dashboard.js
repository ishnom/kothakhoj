document.addEventListener("DOMContentLoaded", async () => {
  // Import DataService
  let DataService // Declare DataService here
  try {
    const module = await import("./data-service.js")
    DataService = module.default
    DataService.init()
    window.DataService = DataService // Make it globally available
  } catch (error) {
    console.error("Error initializing DataService:", error)
  }

  // Tab Navigation
  const tabLinks = document.querySelectorAll(".dashboard-nav a")
  const tabContents = document.querySelectorAll(".dashboard-tab")
  const tabLinkButtons = document.querySelectorAll("[data-tab-link]")

  // Function to activate a tab
  function activateTab(tabId) {
    // Remove active class from all tabs and links
    tabContents.forEach((tab) => tab.classList.remove("active"))
    tabLinks.forEach((link) => link.classList.remove("active"))

    // Add active class to selected tab and link
    document.getElementById(`${tabId}-tab`).classList.add("active")
    document.querySelector(`.dashboard-nav a[data-tab="${tabId}"]`).classList.add("active")

    // Update URL without page reload
    const url = new URL(window.location)
    url.searchParams.set("tab", tabId)
    window.history.pushState({}, "", url)
  }

  // Set up tab click events
  tabLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const tabId = link.getAttribute("data-tab")
      activateTab(tabId)
    })
  })

  // Set up tab link buttons
  tabLinkButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      const tabId = button.getAttribute("data-tab-link")
      activateTab(tabId)
    })
  })

  // Check URL for tab parameter
  const urlParams = new URLSearchParams(window.location.search)
  const tabParam = urlParams.get("tab")
  if (tabParam && document.getElementById(`${tabParam}-tab`)) {
    activateTab(tabParam)
  }

  // Load user data
  // Update the loadUserData function to use the logged-in user's data from localStorage
  function loadUserData() {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem("kothakhoj_user"))

    if (!userData) {
      // Redirect to login if no user data found
      window.location.href = "login.html?redirect=dashboard.html"
      return
    }

    // Create a complete user object by combining stored data with defaults
    const user = {
      id: userData.email, // Use email as ID
      name: userData.name || `${userData.firstName} ${userData.lastName}`,
      type: userData.isOwner ? "Property Owner" : "Room Seeker",
      email: userData.email,
      phone: userData.phone || "",
      whatsapp: userData.whatsapp || userData.phone || "",
      location: userData.location || "Kathmandu, Nepal",
      address: userData.address || "",
      avatar:
        userData.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || userData.firstName)}&background=ff3b3b&color=fff`,
      joinedDate: formatJoinDate(userData.timestamp),
      bio: userData.bio || `I'm a ${userData.isOwner ? "property owner" : "room seeker"} in Kathmandu.`,
    }

    // Update UI with user data
    document.querySelectorAll(".user-name").forEach((el) => (el.textContent = user.name))
    document.querySelectorAll(".user-type").forEach((el) => (el.textContent = user.type))
    document.querySelectorAll(".user-avatar").forEach((el) => {
      if (el.tagName.toLowerCase() === "img") {
        el.src = user.avatar
      }
    })

    // Update profile details
    const profileFields = document.querySelectorAll(".profile-field")
    if (profileFields.length > 0) {
      document.querySelector(".profile-field:nth-child(1) .field-value").textContent = user.name
      document.querySelector(".profile-field:nth-child(2) .field-value").textContent = user.email
      document.querySelector(".profile-field:nth-child(3) .field-value").textContent = user.phone || "Not provided"
      document.querySelector(".profile-field:nth-child(4) .field-value").textContent = user.whatsapp || "Not provided"
      document.querySelector(".profile-field:nth-child(5) .field-value").textContent = user.location
      document.querySelector(".profile-field:nth-child(6) .field-value").textContent = user.address || "Not provided"

      const profileBio = document.querySelector(".profile-bio")
      if (profileBio) {
        profileBio.textContent = user.bio
      }
    }

    // Update profile form fields
    document.getElementById("edit-name").value = user.name
    document.getElementById("edit-email").value = user.email
    document.getElementById("edit-phone").value = user.phone || ""
    document.getElementById("edit-whatsapp").value = user.whatsapp || ""

    const editLocation = document.getElementById("edit-location")
    if (editLocation) {
      editLocation.value = user.location
    }

    const editAddress = document.getElementById("edit-address")
    if (editAddress) {
      editAddress.value = user.address || ""
    }

    document.getElementById("edit-bio").value = user.bio

    // Set user type radio button
    const userTypeRadios = document.querySelectorAll('input[name="user-type"]')
    userTypeRadios.forEach((radio) => {
      if ((radio.value === "owner" && userData.isOwner) || (radio.value === "tenant" && !userData.isOwner)) {
        radio.checked = true
      }
    })

    // Show/hide owner-specific sections based on user type
    const ownerSections = document.querySelectorAll(".owner-only")
    ownerSections.forEach((section) => {
      section.style.display = userData.isOwner ? "block" : "none"
    })

    const seekerSections = document.querySelectorAll(".seeker-only")
    seekerSections.forEach((section) => {
      section.style.display = !userData.isOwner ? "block" : "none"
    })

    // Update dashboard title based on user type
    const dashboardTitle = document.querySelector(".dashboard-welcome h2")
    if (dashboardTitle) {
      dashboardTitle.textContent = userData.isOwner ? "Property Owner Dashboard" : "Room Seeker Dashboard"
    }

    return user
  }

  // Helper function to format join date
  function formatJoinDate(timestamp) {
    if (!timestamp) return "New User"

    const date = new Date(timestamp)
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    return `${months[date.getMonth()]} ${date.getFullYear()}`
  }

  // Load user's listings
  // Update loadUserListings to show different content for owners vs seekers
  async function loadUserListings() {
    try {
      // Get user data
      const userData = JSON.parse(localStorage.getItem("kothakhoj_user"))

      if (!userData) return

      // If user is a property owner, show their listings
      if (userData.isOwner) {
        // In a real app, you would filter by user ID
        // For now, we'll just use all rooms from DataService
        const allRooms = DataService.getAllRooms()

        // Sort by newest first
        const userListings = allRooms.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))

        // Render recent listings (first 4)
        renderRecentListings(userListings.slice(0, 4))

        // Render all listings
        renderAllListings(userListings)

        // Update stats
        const listingsStatElement = document.querySelector(".stat-card:nth-child(1) .stat-info h3")
        if (listingsStatElement) {
          listingsStatElement.textContent = userListings.length
        }

        // Show owner-specific sections
        document.querySelectorAll(".owner-only").forEach((section) => {
          section.style.display = "block"
        })

        // Hide seeker-specific sections
        document.querySelectorAll(".seeker-only").forEach((section) => {
          section.style.display = "none"
        })
      } else {
        // For room seekers, hide owner-specific sections
        document.querySelectorAll(".owner-only").forEach((section) => {
          section.style.display = "none"
        })

        // Show seeker-specific sections
        document.querySelectorAll(".seeker-only").forEach((section) => {
          section.style.display = "block"
        })

        // Update stats for room seekers
        const viewedRoomsElement = document.querySelector(".stat-card:nth-child(1) .stat-info h3")
        if (viewedRoomsElement) {
          viewedRoomsElement.textContent = "0"
        }

        const contactedOwnersElement = document.querySelector(".stat-card:nth-child(2) .stat-info h3")
        if (contactedOwnersElement) {
          contactedOwnersElement.textContent = "0"
        }
      }
    } catch (error) {
      console.error("Error loading listings:", error)
      showError("recent-listings", "Failed to load your listings. Please try again later.")
      showError("my-listings", "Failed to load your listings. Please try again later.")
    }
  }

  // Render recent listings
  function renderRecentListings(listings) {
    const container = document.getElementById("recent-listings")

    if (!listings || listings.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-home"></i>
          <h3>No Listings Yet</h3>
          <p>You haven't posted any rooms yet. Get started by posting your first room.</p>
          <a href="post-room.html" class="btn btn-primary">Post a Room</a>
        </div>
      `
      return
    }

    let html = ""

    listings.forEach((listing) => {
      // Format date
      const postedDate = new Date(listing.postedDate)
      const formattedDate = formatDate(postedDate)

      html += `
        <div class="listing-card" data-id="${listing.id}">
          <div class="listing-image">
            <img src="${listing.images[0]}" alt="${listing.title}">
            <div class="listing-status status-active">Active</div>
          </div>
          <div class="listing-content">
            <div class="listing-price">Rs. ${listing.price}/month</div>
            <h3 class="listing-title">${listing.title}</h3>
            <div class="listing-location">
              <i class="fas fa-map-marker-alt"></i> ${listing.location}
            </div>
            <div class="listing-stats">
              <div class="listing-stat">
                <i class="fas fa-eye"></i> 32 views
              </div>
              <div class="listing-stat">
                <i class="fas fa-comment"></i> 3 inquiries
              </div>
            </div>
            <div class="listing-actions">
              <a href="room-details.html?id=${listing.id}" class="btn btn-primary listing-action-btn">View</a>
              <button class="btn btn-secondary listing-action-btn edit-listing-btn" data-id="${listing.id}">Edit</button>
            </div>
          </div>
        </div>
      `
    })

    container.innerHTML = html

    // Add event listeners to edit buttons
    container.querySelectorAll(".edit-listing-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const listingId = btn.getAttribute("data-id")
        openEditListingModal(listingId)
      })
    })
  }

  // Render all listings
  function renderAllListings(listings) {
    const container = document.getElementById("my-listings")

    if (!listings || listings.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-home"></i>
          <h3>No Listings Yet</h3>
          <p>You haven't posted any rooms yet. Get started by posting your first room.</p>
          <a href="post-room.html" class="btn btn-primary">Post a Room</a>
        </div>
      `
      return
    }

    let html = ""

    listings.forEach((listing) => {
      // Format date
      const postedDate = new Date(listing.postedDate)
      const formattedDate = formatDate(postedDate)

      html += `
        <div class="listing-card" data-id="${listing.id}">
          <div class="listing-image">
            <img src="${listing.images[0]}" alt="${listing.title}">
            <div class="listing-status status-active">Active</div>
          </div>
          <div class="listing-content">
            <div class="listing-price">Rs. ${listing.price}/month</div>
            <h3 class="listing-title">${listing.title}</h3>
            <div class="listing-location">
              <i class="fas fa-map-marker-alt"></i> ${listing.location}
            </div>
            <div class="listing-stats">
              <div class="listing-stat">
                <i class="fas fa-eye"></i> 32 views
              </div>
              <div class="listing-stat">
                <i class="fas fa-comment"></i> 3 inquiries
              </div>
              <div class="listing-stat">
                <i class="fas fa-calendar-alt"></i> ${formattedDate}
              </div>
            </div>
            <div class="listing-actions">
              <a href="room-details.html?id=${listing.id}" class="btn btn-primary listing-action-btn">View</a>
              <button class="btn btn-secondary listing-action-btn edit-listing-btn" data-id="${listing.id}">Edit</button>
              <button class="btn btn-outline danger listing-action-btn delete-listing-btn" data-id="${listing.id}">Delete</button>
            </div>
          </div>
        </div>
      `
    })

    container.innerHTML = html

    // Add event listeners to edit buttons
    container.querySelectorAll(".edit-listing-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const listingId = btn.getAttribute("data-id")
        openEditListingModal(listingId)
      })
    })

    // Add event listeners to delete buttons
    container.querySelectorAll(".delete-listing-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const listingId = btn.getAttribute("data-id")
        confirmDeleteListing(listingId)
      })
    })
  }

  // Load saved rooms
  function loadSavedRooms() {
    try {
      const savedRoomIds = JSON.parse(localStorage.getItem("savedRooms") || "[]")
      const allRooms = DataService.getAllRooms()
      const savedRooms = allRooms.filter((room) => savedRoomIds.includes(room.id))

      renderSavedRooms(savedRooms)

      // Update stats
      document.querySelector(".stat-card:nth-child(4) .stat-info h3").textContent = savedRooms.length
    } catch (error) {
      console.error("Error loading saved rooms:", error)
      showError("saved-rooms-container", "Failed to load your saved rooms. Please try again later.")
    }
  }

  // Render saved rooms
  function renderSavedRooms(rooms) {
    const container = document.getElementById("saved-rooms-container")

    if (!rooms || rooms.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-bookmark"></i>
          <h3>No Saved Rooms</h3>
          <p>You haven't saved any rooms yet. Browse listings and save rooms you're interested in.</p>
          <a href="listings.html" class="btn btn-primary">Browse Rooms</a>
        </div>
      `
      return
    }

    let html = ""

    rooms.forEach((room) => {
      html += `
        <div class="room-card">
          <a href="room-details.html?id=${room.id}">
            <div class="room-image">
              <img src="${room.images[0]}" alt="${room.title}">
              <div class="room-type">${room.furnishing} ${room.type}</div>
              <div class="room-save saved" data-room-id="${room.id}" title="Remove from Saved">
                <i class="fas fa-heart"></i>
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

    container.innerHTML = html

    // Add event listeners to save buttons
    container.querySelectorAll(".room-save").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault()
        e.stopPropagation()

        const roomId = this.getAttribute("data-room-id")
        const savedRooms = JSON.parse(localStorage.getItem("savedRooms") || "[]")
        const index = savedRooms.indexOf(roomId)

        if (index > -1) {
          savedRooms.splice(index, 1)
          localStorage.setItem("savedRooms", JSON.stringify(savedRooms))

          // Remove the card from the UI
          this.closest(".room-card").remove()

          // Update stats
          const statsElement = document.querySelector(".stat-card:nth-child(4) .stat-info h3")
          statsElement.textContent = Number.parseInt(statsElement.textContent) - 1

          // Check if there are no more saved rooms
          if (savedRooms.length === 0) {
            loadSavedRooms() // This will show the empty state
          }
        }
      })
    })
  }

  // Show error message
  function showError(containerId, message) {
    const container = document.getElementById(containerId)
    container.innerHTML = `
      <div class="error-state">
        <i class="fas fa-exclamation-circle"></i>
        <h3>Error</h3>
        <p>${message}</p>
        <button class="btn btn-primary retry-btn">Retry</button>
      </div>
    `

    // Add retry functionality
    container.querySelector(".retry-btn").addEventListener("click", () => {
      container.innerHTML = `
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Loading...</p>
        </div>
      `

      // Reload the data
      if (containerId === "recent-listings" || containerId === "my-listings") {
        loadUserListings()
      } else if (containerId === "saved-rooms-container") {
        loadSavedRooms()
      }
    })
  }

  // Format date helper
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

  // Edit Profile Modal
  const editProfileBtn = document.getElementById("edit-profile-btn")
  const editProfileModal = document.getElementById("edit-profile-modal")
  const cancelEditBtn = document.getElementById("cancel-edit")
  const closeModalBtns = document.querySelectorAll(".close-modal")
  const editProfileForm = document.getElementById("edit-profile-form")

  // Open edit profile modal
  editProfileBtn.addEventListener("click", () => {
    editProfileModal.style.display = "block"
    document.body.style.overflow = "hidden"
  })

  // Close modals
  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".modal").forEach((modal) => {
        modal.style.display = "none"
      })
      document.body.style.overflow = "auto"
    })
  })

  // Cancel edit profile
  cancelEditBtn.addEventListener("click", () => {
    editProfileModal.style.display = "none"
    document.body.style.overflow = "auto"
  })

  // Submit edit profile form
  // Update the edit profile form submission to save changes to localStorage
  editProfileForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get current user data
    const currentUserData = JSON.parse(localStorage.getItem("kothakhoj_user"))

    // Get form data
    const formData = new FormData(editProfileForm)

    // Update user data
    const updatedUserData = {
      ...currentUserData,
      name: formData.get("name"),
      firstName: formData.get("name").split(" ")[0],
      lastName: formData.get("name").split(" ").slice(1).join(" "),
      email: formData.get("email"),
      phone: formData.get("phone"),
      whatsapp: formData.get("whatsapp"),
      location: formData.get("location") || currentUserData.location,
      address: formData.get("address") || currentUserData.address,
      bio: formData.get("bio"),
      isOwner: formData.get("user-type") === "owner",
    }

    // Save updated data to localStorage
    localStorage.setItem("kothakhoj_user", JSON.stringify(updatedUserData))

    // Update UI
    document.querySelectorAll(".user-name").forEach((el) => (el.textContent = updatedUserData.name))
    document
      .querySelectorAll(".user-type")
      .forEach((el) => (el.textContent = updatedUserData.isOwner ? "Property Owner" : "Room Seeker"))

    // Update profile details
    document.querySelector(".profile-field:nth-child(1) .field-value").textContent = updatedUserData.name
    document.querySelector(".profile-field:nth-child(2) .field-value").textContent = updatedUserData.email
    document.querySelector(".profile-field:nth-child(3) .field-value").textContent =
      updatedUserData.phone || "Not provided"
    document.querySelector(".profile-field:nth-child(4) .field-value").textContent =
      updatedUserData.whatsapp || "Not provided"
    document.querySelector(".profile-field:nth-child(5) .field-value").textContent = updatedUserData.location
    document.querySelector(".profile-field:nth-child(6) .field-value").textContent =
      updatedUserData.address || "Not provided"
    document.querySelector(".profile-bio").textContent = updatedUserData.bio

    // Show success message
    showNotification("Profile updated successfully!", "success")

    // Close modal
    editProfileModal.style.display = "none"
    document.body.style.overflow = "auto"

    // Reload dashboard to reflect changes in all sections
    setTimeout(() => {
      loadUserData()
    }, 500)
  })

  // Edit Listing Modal
  const editListingModal = document.getElementById("edit-listing-modal")
  const cancelEditListingBtn = document.getElementById("cancel-edit-listing")
  const editListingForm = document.getElementById("edit-listing-form")

  // Open edit listing modal
  function openEditListingModal(listingId) {
    // Get listing data
    const listing = DataService.getRoomById(listingId)

    if (!listing) {
      showNotification("Listing not found", "error")
      return
    }

    // Populate form
    document.getElementById("edit-listing-title").value = listing.title
    document.getElementById("edit-listing-price").value = listing.price
    document.getElementById("edit-listing-type").value = listing.type
    document.getElementById("edit-listing-furnishing").value = listing.furnishing
    document.getElementById("edit-listing-description").value = listing.description

    // Set amenities checkboxes
    document.querySelectorAll('input[name="amenities"]').forEach((checkbox) => {
      checkbox.checked = listing.amenities.includes(checkbox.value)
    })

    // Set listing ID as data attribute
    editListingForm.setAttribute("data-listing-id", listingId)

    // Show modal
    editListingModal.style.display = "block"
    document.body.style.overflow = "hidden"
  }

  // Cancel edit listing
  cancelEditListingBtn.addEventListener("click", () => {
    editListingModal.style.display = "none"
    document.body.style.overflow = "auto"
  })

  // Submit edit listing form
  editListingForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // In a real app, you would send this data to your server
    const formData = new FormData(editListingForm)
    const listingId = editListingForm.getAttribute("data-listing-id")

    const listingData = {
      id: listingId,
      title: formData.get("title"),
      price: formData.get("price"),
      type: formData.get("type"),
      furnishing: formData.get("furnishing"),
      description: formData.get("description"),
      amenities: formData.getAll("amenities"),
      status: formData.get("status"),
    }

    console.log("Listing updated:", listingData)

    // Show success message
    showNotification("Listing updated successfully!", "success")

    // Close modal
    editListingModal.style.display = "none"
    document.body.style.overflow = "auto"

    // Reload listings
    loadUserListings()
  })

  // Confirm delete listing
  function confirmDeleteListing(listingId) {
    if (confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      // In a real app, you would send a delete request to your server
      console.log("Deleting listing:", listingId)

      // Show success message
      showNotification("Listing deleted successfully!", "success")

      // Reload listings
      loadUserListings()
    }
  }

  // Show notification
  function showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas ${type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : "fa-info-circle"}"></i>
        <p>${message}</p>
      </div>
      <button class="notification-close"><i class="fas fa-times"></i></button>
    `

    // Add notification to the DOM
    document.body.appendChild(notification)

    // Add styles
    const style = document.createElement("style")
    style.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${type === "success" ? "rgba(46, 204, 113, 0.9)" : type === "error" ? "rgba(231, 76, 60, 0.9)" : "rgba(52, 152, 219, 0.9)"};
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

  // Logout functionality
  const logoutButtons = document.querySelectorAll("#logout-button, #sidebar-logout")
  logoutButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault()

      if (confirm("Are you sure you want to logout?")) {
        // In a real app, you would clear session data and redirect to login page
        console.log("Logging out...")

        // Redirect to home page
        window.location.href = "index.html"
      }
    })
  })

  // Add this helper function for safely displaying text content
  function createTruncatedMessage(text) {
    const div = document.createElement("div")
    div.className = "truncate-2-lines"
    div.textContent = text
    return div.outerHTML
  }

  // Message sending functionality
  const sendMessageBtn = document.querySelector(".send-message")
  const messageInput = document.querySelector(".message-input textarea")

  if (sendMessageBtn && messageInput) {
    sendMessageBtn.addEventListener("click", () => {
      const message = messageInput.value.trim()

      if (message) {
        // Add message to UI
        const messageBody = document.querySelector(".message-body")
        const now = new Date()
        const hours = now.getHours().toString().padStart(2, "0")
        const minutes = now.getMinutes().toString().padStart(2, "0")
        const timeString = `${hours}:${minutes}`

        const messageBubble = document.createElement("div")
        messageBubble.className = "message-bubble sent"
        messageBubble.innerHTML = `
          <div class="message-text">
            <p>${message}</p>
          </div>
          <div class="message-time">${timeString}</div>
        `

        messageBody.appendChild(messageBubble)

        // Clear input
        messageInput.value = ""

        // Scroll to bottom
        messageBody.scrollTop = messageBody.scrollHeight

        // In a real app, you would send this message to your server
        console.log("Message sent:", message)
      }
    })

    // Send message on Enter key (but allow Shift+Enter for new line)
    messageInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        sendMessageBtn.click()
      }
    })
  }

  // Message preview functionality
  const messagePreviews = document.querySelectorAll(".message-preview")

  messagePreviews.forEach((preview) => {
    preview.addEventListener("click", () => {
      // Remove active class from all previews
      messagePreviews.forEach((p) => p.classList.remove("active"))

      // Add active class to clicked preview
      preview.classList.add("active")

      // Remove unread class (mark as read)
      preview.classList.remove("unread")

      // In a real app, you would load the conversation from your server
      console.log("Loading conversation for:", preview.querySelector("h4").textContent)
    })
  })

  // Settings form submission
  const settingsForms = document.querySelectorAll(".settings-form")

  settingsForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault()

      // In a real app, you would send this data to your server
      const formData = new FormData(form)
      const formValues = {}

      formData.forEach((value, key) => {
        formValues[key] = value
      })

      console.log("Settings updated:", formValues)

      // Show success message
      showNotification("Settings updated successfully!", "success")
    })
  })

  // Danger zone buttons
  const dangerButtons = document.querySelectorAll(".danger-zone .btn")

  dangerButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.previousElementSibling.querySelector("h4").textContent

      if (confirm(`Are you sure you want to ${action.toLowerCase()}? This action may have serious consequences.`)) {
        // In a real app, you would send this request to your server
        console.log(`${action} requested`)

        // Show success message
        showNotification(`${action} request submitted`, "info")
      }
    })
  })

  // Initialize the dashboard
  function initDashboard() {
    loadUserData()
    loadUserListings()
    loadSavedRooms()
  }

  // Call initialization function
  initDashboard()
})

