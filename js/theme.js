document.addEventListener("DOMContentLoaded", () => {
  // Get theme toggle button
  const themeToggle = document.getElementById("theme-toggle")

  // Get theme container
  const themeContainer = document.querySelector(".theme-container")

  // Check if theme preference exists in localStorage
  const savedTheme = localStorage.getItem("theme")

  // Apply saved theme or default to white
  if (savedTheme === "dark") {
    themeContainer.classList.add("dark")
    document.querySelector("footer").classList.add("dark-footer")
    document.querySelector("footer").classList.remove("light-footer")
    if (themeToggle) {
      const themeIcon = themeToggle.querySelector("i")
      if (themeIcon) {
        themeIcon.classList.remove("fa-moon")
        themeIcon.classList.add("fa-sun")
      }
    }
  } else {
    themeContainer.classList.remove("dark")
    document.querySelector("footer").classList.add("light-footer")
    document.querySelector("footer").classList.remove("dark-footer")
    if (themeToggle) {
      const themeIcon = themeToggle.querySelector("i")
      if (themeIcon) {
        themeIcon.classList.remove("fa-sun")
        themeIcon.classList.add("fa-moon")
      }
    }
  }

  // Add click event listener to theme toggle button
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      // Toggle dark class on theme container
      themeContainer.classList.toggle("dark")

      // Update icon
      const themeIcon = themeToggle.querySelector("i")
      if (themeIcon) {
        if (themeContainer.classList.contains("dark")) {
          themeIcon.classList.remove("fa-moon")
          themeIcon.classList.add("fa-sun")
          localStorage.setItem("theme", "dark")
          document.querySelector("footer").classList.add("dark-footer")
          document.querySelector("footer").classList.remove("light-footer")
          console.log("Theme set to dark (black)")
        } else {
          themeIcon.classList.remove("fa-sun")
          themeIcon.classList.add("fa-moon")
          localStorage.setItem("theme", "white")
          document.querySelector("footer").classList.add("light-footer")
          document.querySelector("footer").classList.remove("dark-footer")
          console.log("Theme set to white")
        }
      }
    })
  }

  // Log for debugging
  console.log("Theme initialized. Current theme:", savedTheme || "white")
})

