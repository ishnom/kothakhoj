document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("kothakhoj_user") !== null

  // Login form handling
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const remember = document.getElementById("remember").checked

      // In a real app, you would validate credentials with a server
      // For demo purposes, we'll use a simple check
      if (email && password) {
        // Create user object
        const user = {
          email: email,
          name: email.split("@")[0], // Extract name from email for demo
          isOwner: email.includes("owner"), // Simple check for demo
          timestamp: new Date().toISOString(),
        }

        // Store in localStorage
        localStorage.setItem("kothakhoj_user", JSON.stringify(user))

        // Show success message
        showNotification("Login successful! Redirecting to dashboard...", "success")

        // Check if there's a redirect parameter in the URL
        const urlParams = new URLSearchParams(window.location.search)
        const redirectPage = urlParams.get("redirect")

        // Redirect to dashboard or specified page after delay
        setTimeout(() => {
          if (redirectPage) {
            window.location.href = redirectPage
          } else {
            window.location.href = "dashboard.html"
          }
        }, 1500)
      } else {
        showNotification("Invalid email or password", "error")
      }
    })
  }

  // Signup form handling
  const signupForm = document.getElementById("signup-form")
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const firstName = document.getElementById("first-name").value
      const lastName = document.getElementById("last-name").value
      const email = document.getElementById("email").value
      const phone = document.getElementById("phone").value
      const password = document.getElementById("password").value
      const confirmPassword = document.getElementById("confirm-password").value
      const userType = document.querySelector('input[name="user-type"]:checked').value
      const termsAccepted = document.getElementById("terms").checked

      // Validate form
      if (!termsAccepted) {
        showNotification("You must accept the Terms of Service and Privacy Policy", "error")
        return
      }

      if (password !== confirmPassword) {
        showNotification("Passwords do not match", "error")
        return
      }

      // In a real app, you would send this data to a server
      // For demo purposes, we'll store in localStorage
      if (firstName && lastName && email && phone && password) {
        // Create user object
        const user = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
          name: `${firstName} ${lastName}`,
          isOwner: userType === "owner",
          timestamp: new Date().toISOString(),
        }

        // Store in localStorage
        localStorage.setItem("kothakhoj_user", JSON.stringify(user))

        // Show success message
        showNotification("Account created successfully! Redirecting to dashboard...", "success")

        // Check if there's a redirect parameter in the URL
        const urlParams = new URLSearchParams(window.location.search)
        const redirectPage = urlParams.get("redirect")

        // Redirect to dashboard or specified page after delay
        setTimeout(() => {
          if (redirectPage) {
            window.location.href = redirectPage
          } else {
            window.location.href = "dashboard.html"
          }
        }, 1500)
      } else {
        showNotification("Please fill in all required fields", "error")
      }
    })
  }

  // Check authentication for protected pages
  function checkAuth() {
    // Pages that require authentication
    const protectedPages = ["post-room.html", "dashboard.html"]

    // Get current page
    const currentPage = window.location.pathname.split("/").pop()

    // Check if current page is protected
    if (protectedPages.includes(currentPage) && !isLoggedIn) {
      // Redirect to login page
      window.location.href = `login.html?redirect=${currentPage}`
      return false
    }

    return true
  }

  // Run auth check
  checkAuth()

  // Update navigation based on auth status
  updateNavigation()

  // Function to update navigation based on auth status
  function updateNavigation() {
    const navButtons = document.querySelector(".nav-buttons")
    if (!navButtons) return

    // Get user data if logged in
    const userData = isLoggedIn ? JSON.parse(localStorage.getItem("kothakhoj_user")) : null

    if (isLoggedIn && userData) {
      // Replace login/signup buttons with user dropdown
      navButtons.innerHTML = `
        <div class="user-dropdown">
          <button class="user-button">
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=ff3b3b&color=fff" alt="User" class="user-avatar">
            <span class="user-name">${userData.name}</span>
            <i class="fas fa-chevron-down"></i>
          </button>
          <div class="dropdown-menu">
            <a href="dashboard.html"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
            <a href="dashboard.html?tab=profile"><i class="fas fa-user"></i> My Profile</a>
            <a href="dashboard.html?tab=listings"><i class="fas fa-list"></i> My Listings</a>
            <a href="dashboard.html?tab=messages"><i class="fas fa-envelope"></i> Messages</a>
            <div class="dropdown-divider"></div>
            <a href="#" id="logout-button"><i class="fas fa-sign-out-alt"></i> Logout</a>
          </div>
        </div>
        <a href="post-room.html" class="btn btn-primary">Post a Room</a>
        <button id="theme-toggle" class="btn-icon">
          <i class="fas fa-moon"></i>
        </button>
      `

      // Add logout functionality
      document.getElementById("logout-button").addEventListener("click", (e) => {
        e.preventDefault()
        logout()
      })

      // Add dropdown toggle functionality
      const userButton = document.querySelector(".user-button")
      const dropdownMenu = document.querySelector(".dropdown-menu")

      if (userButton && dropdownMenu) {
        userButton.addEventListener("click", () => {
          dropdownMenu.classList.toggle("show")
        })

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
          if (!userButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove("show")
          }
        })
      }
    } else {
      // Show login/signup buttons for non-authenticated users
      navButtons.innerHTML = `
        <a href="login.html" class="btn btn-secondary">Login</a>
        <a href="signup.html" class="btn btn-primary">Sign Up</a>
        <button id="theme-toggle" class="btn-icon">
          <i class="fas fa-moon"></i>
        </button>
      `
    }

    // Reinitialize theme toggle
    initThemeToggle()
  }

  // Function to handle logout
  function logout() {
    // Remove user data from localStorage
    localStorage.removeItem("kothakhoj_user")

    // Show success message
    showNotification("Logged out successfully", "success")

    // Redirect to home page
    setTimeout(() => {
      window.location.href = "index.html"
    }, 1000)
  }

  // Function to show notifications
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

    // Add styles if they don't exist
    if (!document.getElementById("notification-styles")) {
      const style = document.createElement("style")
      style.id = "notification-styles"
      style.textContent = `
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 15px 20px;
          background-color: ${type === "success" ? "rgba(46, 204, 113, 0.9)" : type === "error" ? "rgba(231, 76, 60, 0.9)" : "rgba(52, 152, 219, 0.9)"};
          color: white;
          border-radius: 8px;
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
        
        .user-dropdown {
          position: relative;
          margin-right: 10px;
        }
        
        .user-button {
          display: flex;
          align-items: center;
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px 10px;
          border-radius: 20px;
          transition: background-color 0.3s;
        }
        
        .user-button:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .dark .user-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin-right: 8px;
        }
        
        .user-name {
          margin-right: 5px;
          font-weight: 500;
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          min-width: 200px;
          z-index: 1000;
          display: none;
          overflow: hidden;
        }
        
        .dark .dropdown-menu {
          background-color: #2d3748;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .dropdown-menu.show {
          display: block;
        }
        
        .dropdown-menu a {
          display: flex;
          align-items: center;
          padding: 10px 15px;
          color: #333;
          text-decoration: none;
          transition: background-color 0.3s;
        }
        
        .dark .dropdown-menu a {
          color: #e2e8f0;
        }
        
        .dropdown-menu a:hover {
          background-color: #f8f9fa;
        }
        
        .dark .dropdown-menu a:hover {
          background-color: #4a5568;
        }
        
        .dropdown-menu a i {
          margin-right: 10px;
          width: 16px;
          text-align: center;
        }
        
        .dropdown-divider {
          height: 1px;
          background-color: #e9ecef;
          margin: 5px 0;
        }
        
        .dark .dropdown-divider {
          background-color: #4a5568;
        }
      `
      document.head.appendChild(style)
    }

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
      if (document.body.contains(notification)) {
        notification.style.animation = "slideOut 0.3s ease-out forwards"
        setTimeout(() => {
          if (document.body.contains(notification)) {
            notification.remove()
          }
        }, 300)
      }
    }, 5000)
  }

  // Function to initialize theme toggle
  function initThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle")
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        const themeContainer = document.querySelector(".theme-container")
        themeContainer.classList.toggle("dark")

        // Update icon
        const themeIcon = themeToggle.querySelector("i")
        if (themeContainer.classList.contains("dark")) {
          themeIcon.classList.remove("fa-moon")
          themeIcon.classList.add("fa-sun")
          localStorage.setItem("theme", "dark")
        } else {
          themeIcon.classList.remove("fa-sun")
          themeIcon.classList.add("fa-moon")
          localStorage.setItem("theme", "light")
        }
      })

      // Set initial theme based on localStorage
      const savedTheme = localStorage.getItem("theme")
      const themeContainer = document.querySelector(".theme-container")
      const themeIcon = themeToggle.querySelector("i")

      if (savedTheme === "dark") {
        themeContainer.classList.add("dark")
        themeIcon.classList.remove("fa-moon")
        themeIcon.classList.add("fa-sun")
      }
    }
  }
})

