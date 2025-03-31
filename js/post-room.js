document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("koshakhoj_user") !== null

  // If not logged in, redirect to login page
  if (!isLoggedIn) {
    window.location.href = "login.html?redirect=post-room.html"
    return
  }

  // Get user data
  const userData = JSON.parse(localStorage.getItem("koshakhoj_user"))

  // Pre-fill owner information if available
  if (userData) {
    const ownerNameField = document.getElementById("owner-name")
    const emailField = document.getElementById("email")
    const phoneField = document.getElementById("phone-number")
    const whatsappField = document.getElementById("whatsapp-number")
    const ownerTypeField = document.getElementById("owner-type")

    if (ownerNameField && userData.name) {
      ownerNameField.value = userData.name
    }

    if (emailField && userData.email) {
      emailField.value = userData.email
    }

    if (phoneField && userData.phone) {
      phoneField.value = userData.phone
    }

    if (whatsappField && userData.phone) {
      whatsappField.value = userData.phone
    }

    if (ownerTypeField && userData.isOwner) {
      ownerTypeField.value = "owner"
    }
  }

  // Initialize DataService
  import("./data-service.js").then((module) => {
    const DataService = module.default
    DataService.init()
  })

  // Form state management
  const formState = {
    currentStep: 1,
    formData: {
      basicDetails: {},
      roomFeatures: {},
      photos: [],
      contactInfo: {},
    },
    totalSteps: 4,
  }

  // Initialize form elements
  const formSteps = document.querySelectorAll(".form-step")
  const progressSteps = document.querySelectorAll(".progress-step")
  const nextButtons = document.querySelectorAll(".next-step")
  const prevButtons = document.querySelectorAll(".prev-step")
  const form = document.getElementById("post-room-form")

  // Update progress bar
  function updateProgress() {
    progressSteps.forEach((step, index) => {
      if (index + 1 === formState.currentStep) {
        step.classList.add("active")
      } else if (index + 1 < formState.currentStep) {
        step.classList.add("completed")
        step.classList.remove("active")
      } else {
        step.classList.remove("active", "completed")
      }
    })
  }

  // Show current step
  function showStep(step) {
    // Validate current step before moving to next (except when going backwards)
    if (step > formState.currentStep && !validateStep(formState.currentStep)) {
      return false
    }

    formSteps.forEach((formStep) => {
      formStep.classList.remove("active")
    })
    formSteps[step - 1].classList.add("active")
    formState.currentStep = step
    updateProgress()

    // Save form data for the current step
    const formData = new FormData(form)
    const stepData = {}
    formData.forEach((value, key) => {
      stepData[key] = value
    })
    formState.formData[`step${formState.currentStep}`] = stepData

    // Scroll to top of form with smooth animation
    form.scrollIntoView({ behavior: "smooth", block: "start" })

    return true
  }

  // Validate current step
  function validateStep(step) {
    const currentFormStep = formSteps[step - 1]
    const fields = currentFormStep.querySelectorAll("input[required], select[required], textarea[required]")
    let isValid = true

    // Clear all existing error messages first
    const existingErrors = currentFormStep.querySelectorAll(".error-message")
    existingErrors.forEach((error) => error.remove())

    // Remove error classes from all fields
    fields.forEach((field) => field.classList.remove("error"))

    // Validate each required field
    fields.forEach((field) => {
      // Check if field is empty
      if (!field.value.trim()) {
        isValid = false
        field.classList.add("error")

        // Add error message
        const errorDiv = document.createElement("div")
        errorDiv.className = "error-message"
        errorDiv.textContent = "This field is required"
        field.parentElement.appendChild(errorDiv)
      }
    })

    // Additional validation for specific fields in step 1
    if (step === 1) {
      // Validate room title length
      const roomTitle = document.getElementById("room-title")
      if (roomTitle && roomTitle.value.trim().length < 10) {
        isValid = false
        roomTitle.classList.add("error")

        if (!roomTitle.parentElement.querySelector(".error-message")) {
          const errorDiv = document.createElement("div")
          errorDiv.className = "error-message"
          errorDiv.textContent = "Room title must be at least 10 characters"
          roomTitle.parentElement.appendChild(errorDiv)
        }
      }

      // Validate rent amount is a positive number
      const rentAmount = document.getElementById("rent-amount")
      if (rentAmount && (isNaN(rentAmount.value) || Number(rentAmount.value) <= 0)) {
        isValid = false
        rentAmount.classList.add("error")

        if (!rentAmount.parentElement.querySelector(".error-message")) {
          const errorDiv = document.createElement("div")
          errorDiv.className = "error-message"
          errorDiv.textContent = "Please enter a valid rent amount"
          rentAmount.parentElement.appendChild(errorDiv)
        }
      }
    }

    // Additional validation for step 2 (Room Features)
    if (step === 2) {
      const locationArea = document.getElementById("location-area")
      const otherLocation = document.getElementById("other-location")

      if (locationArea && locationArea.value === "other" && otherLocation) {
        if (!otherLocation.value.trim()) {
          isValid = false
          otherLocation.classList.add("error")

          const errorDiv = document.createElement("div")
          errorDiv.className = "error-message"
          errorDiv.textContent = "Please specify the location"
          otherLocation.parentElement.appendChild(errorDiv)
        }
      }
    }

    // Additional validation for step 3 (Photos)
    if (step === 3) {
      // At least one photo is required
      if (formState.formData.photos.length === 0) {
        isValid = false
        const photoUploadArea = document.getElementById("photo-upload-area")

        if (photoUploadArea && !photoUploadArea.querySelector(".error-message")) {
          const errorDiv = document.createElement("div")
          errorDiv.className = "error-message"
          errorDiv.textContent = "Please upload at least one photo"
          photoUploadArea.appendChild(errorDiv)
        }
      }
    }

    // Additional validation for step 4 (Contact Info)
    if (step === 4) {
      // Validate phone number format (Nepal)
      const phoneNumber = document.getElementById("phone-number")
      if (phoneNumber && phoneNumber.value) {
        const phoneRegex = /^(97|98)\d{8}$/
        if (!phoneRegex.test(phoneNumber.value)) {
          isValid = false
          phoneNumber.classList.add("error")

          if (!phoneNumber.parentElement.querySelector(".error-message")) {
            const errorDiv = document.createElement("div")
            errorDiv.className = "error-message"
            errorDiv.textContent = "Please enter a valid phone number (e.g., 9812345678)"
            phoneNumber.parentElement.appendChild(errorDiv)
          }
        }
      }

      // Validate email format
      const email = document.getElementById("email")
      if (email && email.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email.value)) {
          isValid = false
          email.classList.add("error")

          if (!email.parentElement.querySelector(".error-message")) {
            const errorDiv = document.createElement("div")
            errorDiv.className = "error-message"
            errorDiv.textContent = "Please enter a valid email address"
            email.parentElement.appendChild(errorDiv)
          }
        }
      }

      // Validate terms checkbox
      const termsCheckbox = document.querySelector('input[name="terms"]')
      if (termsCheckbox && !termsCheckbox.checked) {
        isValid = false
        termsCheckbox.classList.add("error")

        if (!termsCheckbox.parentElement.querySelector(".error-message")) {
          const errorDiv = document.createElement("div")
          errorDiv.className = "error-message"
          errorDiv.textContent = "You must agree to the terms and conditions"
          termsCheckbox.parentElement.appendChild(errorDiv)
        }
      }
    }

    // If validation fails, scroll to the first error
    if (!isValid) {
      const firstError = currentFormStep.querySelector(".error-message")
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }

    return isValid
  }

  // Handle next button click
  nextButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (formState.currentStep < formState.totalSteps) {
        const nextStep = formState.currentStep + 1
        if (showStep(nextStep)) {
          // Update URL with step number without page reload
          const url = new URL(window.location)
          url.searchParams.set("step", nextStep)
          window.history.pushState({}, "", url)
        }
      }
    })
  })

  // Handle previous button click
  prevButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (formState.currentStep > 1) {
        const prevStep = formState.currentStep - 1
        showStep(prevStep)
        // Update URL with step number without page reload
        const url = new URL(window.location)
        url.searchParams.set("step", prevStep)
        window.history.pushState({}, "", url)
      }
    })
  })

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    if (validateStep(formState.currentStep)) {
      // Collect all form data
      const formData = new FormData(form)
      const roomData = {
        title: formData.get("room-title"),
        type: formData.get("room-type"),
        furnishing: formData.get("furnishing"),
        price: formData.get("rent-amount"),
        deposit: formData.get("deposit-amount"),
        description: formData.get("room-description"),
        location:
          formData.get("location-area") === "other" ? formData.get("other-location") : formData.get("location-area"),
        address: formData.get("full-address"),
        amenities: formData.getAll("amenities"),
        rules: formData.get("house-rules"),
        ownerName: formData.get("owner-name"),
        ownerType: formData.get("owner-type"),
        phone: formData.get("phone-number"),
        whatsapp: formData.get("whatsapp-number"),
        email: formData.get("email"),
        images: formState.formData.photos.map((photo) => photo.dataUrl),
      }

      try {
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]')
        const originalText = submitButton.textContent // Declare originalText here
        submitButton.disabled = true
        submitButton.textContent = "Submitting..."

        // Import DataService dynamically
        const module = await import("./data-service.js")
        const DataService = module.default

        // Initialize DataService if not already initialized
        if (typeof DataService.init === "function") {
          DataService.init()
        }

        // Save room data
        const newRoom = DataService.addRoom(roomData)

        // Clear form state from localStorage
        localStorage.removeItem("roomPostFormState")

        // Show success message
        const successMessage = document.createElement("div")
        successMessage.className = "success-message"
        successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <h3>Room listing submitted successfully!</h3>
        <p>Your room has been added to our listings.</p>
        <div class="success-actions">
          <a href="listings.html" class="btn btn-primary">View All Listings</a>
          <a href="room-details.html?id=${newRoom.id}" class="btn btn-secondary">View Your Listing</a>
        </div>
      `

        // Clear form and show success
        form.innerHTML = ""
        form.appendChild(successMessage)

        // Add additional styling for success message
        const successStyle = document.createElement("style")
        successStyle.textContent = `
        .success-message {
          text-align: center;
          padding: 2rem;
          background-color: rgba(46, 204, 113, 0.1);
          border-radius: var(--border-radius-md);
          border: 1px solid var(--success-color);
          margin: 2rem 0;
          animation: fadeIn 0.5s ease-out;
        }
        
        .success-message i {
          font-size: 4rem;
          color: var(--success-color);
          margin-bottom: 1rem;
          display: block;
        }
        
        .success-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `
        document.head.appendChild(successStyle)

        // Scroll to success message
        successMessage.scrollIntoView({ behavior: "smooth" })

        // Automatically redirect to the room details page after 5 seconds
        setTimeout(() => {
          window.location.href = `room-details.html?id=${newRoom.id}`
        }, 5000)
      } catch (error) {
        console.error("Error submitting form:", error)

        // Handle error
        const errorMessage = document.createElement("div")
        errorMessage.className = "error-message form-error"
        errorMessage.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <p>An error occurred: ${error.message}. Please try again.</p>
      `
        form.prepend(errorMessage)

        // Remove error after delay
        setTimeout(() => {
          errorMessage.remove()
        }, 5000)

        // Re-enable submit button
        const submitButton = form.querySelector('button[type="submit"]')
        if (submitButton) {
          submitButton.disabled = false
          submitButton.textContent = originalText
        }
      }
    }
  })

  // Replace the photo upload handling code with this improved version

  // Initialize photo upload
  const photoUploadArea = document.getElementById("photo-upload-area")
  const photoInput = document.getElementById("photo-upload")
  const photoPreview = document.getElementById("photo-preview")
  const maxPhotos = 10

  // Make sure the photo array is initialized
  if (!formState.formData.photos) {
    formState.formData.photos = []
  }

  // Handle click on upload area to trigger file input
  photoUploadArea.addEventListener("click", (e) => {
    // Don't trigger if clicking on an error message or other child element
    if (e.target === photoUploadArea || e.target.closest(".photo-upload-area")) {
      photoInput.click()
    }
  })

  // Handle drag and drop
  ;["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    photoUploadArea.addEventListener(eventName, preventDefaults, false)
  })

  function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
  }
  ;["dragenter", "dragover"].forEach((eventName) => {
    photoUploadArea.addEventListener(eventName, highlight, false)
  })
  ;["dragleave", "drop"].forEach((eventName) => {
    photoUploadArea.addEventListener(eventName, unhighlight, false)
  })

  function highlight() {
    photoUploadArea.classList.add("highlight")
  }

  function unhighlight() {
    photoUploadArea.classList.remove("highlight")
  }

  photoUploadArea.addEventListener("drop", handleDrop, false)

  function handleDrop(e) {
    const dt = e.dataTransfer
    const files = dt.files
    handleFiles(files)
  }

  photoInput.addEventListener("change", function () {
    console.log("File input change detected", this.files)
    handleFiles(this.files)
  })

  function handleFiles(files) {
    if (!files || files.length === 0) {
      console.log("No files selected")
      return
    }

    console.log("Processing files:", files.length)
    const currentPhotos = formState.formData.photos.length
    const remainingSlots = maxPhotos - currentPhotos

    if (remainingSlots <= 0) {
      showError("Maximum number of photos reached (10)")
      return
    }

    const allowedFiles = Array.from(files).slice(0, remainingSlots)

    allowedFiles.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        showError("Please upload only image files")
        return
      }

      console.log("Reading file:", file.name)
      const reader = new FileReader()

      reader.onload = (e) => {
        console.log("File read complete")
        const dataUrl = e.target.result
        addPhotoPreview(dataUrl, file.name)
      }

      reader.onerror = (e) => {
        console.error("Error reading file:", e)
        showError("Error reading file: " + file.name)
      }

      reader.readAsDataURL(file)
    })
  }

  function addPhotoPreview(dataUrl, fileName) {
    console.log("Adding photo preview for:", fileName)
    const photoItem = document.createElement("div")
    photoItem.className = "photo-item"

    const img = document.createElement("img")
    img.src = dataUrl
    img.alt = "Room photo"

    const removeBtn = document.createElement("button")
    removeBtn.className = "remove-photo"
    removeBtn.innerHTML = '<i class="fas fa-times"></i>'
    removeBtn.onclick = (e) => {
      e.preventDefault()
      photoItem.remove()
      const index = formState.formData.photos.findIndex((photo) => photo.dataUrl === dataUrl)
      if (index > -1) {
        formState.formData.photos.splice(index, 1)
      }

      // Update main photo label if needed
      updateMainPhotoLabel()
    }

    photoItem.appendChild(img)
    photoItem.appendChild(removeBtn)

    // Add main photo label if this is the first photo
    if (formState.formData.photos.length === 0) {
      const mainLabel = document.createElement("div")
      mainLabel.className = "main-photo"
      mainLabel.textContent = "Main Photo"
      photoItem.appendChild(mainLabel)
    }

    photoPreview.appendChild(photoItem)

    // Store photo data
    formState.formData.photos.push({
      dataUrl: dataUrl,
      fileName: fileName,
    })

    console.log("Photo added, total photos:", formState.formData.photos.length)
  }

  function updateMainPhotoLabel() {
    // Remove all main photo labels
    const mainLabels = photoPreview.querySelectorAll(".main-photo")
    mainLabels.forEach((label) => label.remove())

    // Add main photo label to first photo if any exist
    if (formState.formData.photos.length > 0) {
      const firstPhotoItem = photoPreview.querySelector(".photo-item")
      if (firstPhotoItem) {
        const mainLabel = document.createElement("div")
        mainLabel.className = "main-photo"
        mainLabel.textContent = "Main Photo"
        firstPhotoItem.appendChild(mainLabel)
      }
    }
  }

  function showError(message) {
    console.error("Error:", message)
    const errorDiv = document.createElement("div")
    errorDiv.className = "error-message photo-error"
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`
    photoUploadArea.appendChild(errorDiv)

    setTimeout(() => {
      errorDiv.remove()
    }, 3000)
  }

  // Add some CSS to improve the photo upload area
  const photoUploadStyle = document.createElement("style")
  photoUploadStyle.textContent = `
  .photo-upload-area {
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
  }
  
  .photo-upload-area:hover {
    background-color: rgba(255, 59, 59, 0.05);
  }
  
  .photo-upload-area.highlight {
    background-color: rgba(255, 59, 59, 0.1);
    border-color: var(--primary-color);
  }
  
  .photo-preview {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
    margin-top: 15px;
  }
  
  .photo-item {
    position: relative;
    height: 100px;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid rgba(255, 59, 59, 0.2);
    transition: transform 0.2s ease;
  }
  
  .photo-item:hover {
    transform: scale(1.05);
  }
  
  .photo-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .remove-photo {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 20px;
    height: 20px;
    background-color: rgba(255, 59, 59, 0.8);
    color: white;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 10px;
    transition: transform 0.2s ease;
  }
  
  .remove-photo:hover {
    transform: scale(1.1);
  }
  
  .main-photo {
    position: absolute;
    bottom: 5px;
    left: 5px;
    background-color: var(--primary-color);
    color: white;
    font-size: 10px;
    padding: 2px 5px;
    border-radius: 2px;
  }
`
  document.head.appendChild(photoUploadStyle)

  // Handle "other" location field
  const locationSelect = document.getElementById("location-area")
  const otherLocationGroup = document.getElementById("other-location-group")

  locationSelect.addEventListener("change", function () {
    if (this.value === "other") {
      otherLocationGroup.style.display = "block"
      document.getElementById("other-location").setAttribute("required", "required")
    } else {
      otherLocationGroup.style.display = "none"
      document.getElementById("other-location").removeAttribute("required")
    }
  })

  // Initialize preview listing button
  const previewButton = document.getElementById("preview-listing")
  const previewModal = document.getElementById("preview-modal")
  const listingPreview = document.getElementById("listing-preview")
  const closeModal = previewModal.querySelector(".close-modal")
  const editButton = document.getElementById("edit-listing")
  const confirmButton = document.getElementById("confirm-listing")

  previewButton.addEventListener("click", () => {
    if (validateStep(formState.currentStep)) {
      // Collect all form data
      const formData = new FormData(form)

      // Generate preview HTML
      const previewHtml = generatePreview(formData)
      listingPreview.innerHTML = previewHtml

      // Show modal
      previewModal.style.display = "block"
      document.body.style.overflow = "hidden"
    }
  })

  closeModal.addEventListener("click", () => {
    previewModal.style.display = "none"
    document.body.style.overflow = "auto"
  })

  editButton.addEventListener("click", () => {
    previewModal.style.display = "none"
    document.body.style.overflow = "auto"
  })

  confirmButton.addEventListener("click", () => {
    previewModal.style.display = "none"
    document.body.style.overflow = "auto"

    // Submit the form with redirect parameter
    const submitButton = form.querySelector('button[type="submit"]')
    if (submitButton) {
      // Add a hidden input to indicate we want to redirect after submission
      const redirectInput = document.createElement("input")
      redirectInput.type = "hidden"
      redirectInput.name = "redirect"
      redirectInput.value = "true"
      form.appendChild(redirectInput)

      // Submit the form
      submitButton.click()
    }
  })

  function generatePreview(formData) {
    // Get amenities as array
    const amenities = formData.getAll("amenities")

    // Format amenities for display
    const amenitiesList = amenities
      .map((amenity) => {
        const formatted = amenity
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
        return `<div class="preview-amenity"><i class="fas fa-check"></i> ${formatted}</div>`
      })
      .join("")

    // Get main photo if available
    let mainPhotoHtml = '<div class="preview-no-photo">No photos uploaded</div>'
    if (formState.formData.photos.length > 0) {
      mainPhotoHtml = `<img src="${formState.formData.photos[0].dataUrl}" alt="Room Photo">`
    }

    // Generate preview HTML
    return `
          <div class="preview-container">
              <div class="preview-header">
                  <h2>${formData.get("room-title")}</h2>
                  <div class="preview-location">
                      <i class="fas fa-map-marker-alt"></i> 
                      ${formData.get("location-area") === "other" ? formData.get("other-location") : formData.get("location-area")}
                  </div>
                  <div class="preview-price">Rs. ${formData.get("rent-amount")}/month</div>
              </div>
              
              <div class="preview-main">
                  <div class="preview-photo">
                      ${mainPhotoHtml}
                  </div>
                  
                  <div class="preview-details">
                      <div class="preview-section">
                          <h3>Room Details</h3>
                          <div class="preview-detail-item">
                              <span>Type:</span> ${formData.get("room-type")}
                          </div>
                          <div class="preview-detail-item">
                              <span>Furnishing:</span> ${formData.get("furnishing")}
                          </div>
                          <div class="preview-detail-item">
                              <span>Security Deposit:</span> Rs. ${formData.get("deposit-amount") || "None"}
                          </div>
                      </div>
                      
                      <div class="preview-section">
                          <h3>Description</h3>
                          <p>${formData.get("room-description")}</p>
                      </div>
                      
                      <div class="preview-section">
                          <h3>Amenities</h3>
                          <div class="preview-amenities">
                              ${amenitiesList || "No amenities specified"}
                          </div>
                      </div>
                      
                      ${
                        formData.get("house-rules")
                          ? `
                      <div class="preview-section">
                          <h3>House Rules</h3>
                          <p>${formData.get("house-rules")}</p>
                      </div>
                      `
                          : ""
                      }
                  </div>
              </div>
              
              <div class="preview-footer">
                  <div class="preview-section">
                      <h3>Contact Information</h3>
                      <div class="preview-contact">
                          <div class="preview-contact-item">
                              <i class="fas fa-user"></i> ${formData.get("owner-name")} (${formData.get("owner-type")})
                          </div>
                          <div class="preview-contact-item">
                              <i class="fas fa-phone"></i> ${formData.get("phone-number")}
                          </div>
                          ${
                            formData.get("whatsapp-number")
                              ? `
                          <div class="preview-contact-item">
                              <i class="fab fa-whatsapp"></i> ${formData.get("whatsapp-number")}
                          </div>
                          `
                              : ""
                          }
                          <div class="preview-contact-item">
                              <i class="fas fa-envelope"></i> ${formData.get("email")}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      `
  }

  // Initialize form
  showStep(1)

  // Add this new function to handle form data persistence
  function saveFormState() {
    const formData = {
      currentStep: formState.currentStep,
      formData: formState.formData,
      photos: formState.formData.photos,
    }
    localStorage.setItem("roomPostFormState", JSON.stringify(formData))
  }

  // Add this new function to restore form data
  function restoreFormState() {
    const savedState = localStorage.getItem("roomPostFormState")
    if (savedState) {
      const parsedState = JSON.parse(savedState)
      formState.currentStep = parsedState.currentStep
      formState.formData = parsedState.formData

      // Restore form values
      Object.values(parsedState.formData).forEach((stepData) => {
        Object.entries(stepData).forEach(([key, value]) => {
          const field = form.querySelector(`[name="${key}"]`)
          if (field) {
            if (field.type === "checkbox") {
              field.checked = value
            } else {
              field.value = value
            }
          }
        })
      })

      // Restore photos if any
      if (parsedState.photos && parsedState.photos.length > 0) {
        parsedState.photos.forEach((photo) => {
          addPhotoPreview(photo.dataUrl, photo.fileName)
        })
      }

      showStep(parsedState.currentStep)
    }
  }

  // Add event listeners for form state persistence
  window.addEventListener("beforeunload", saveFormState)
  document.addEventListener("DOMContentLoaded", restoreFormState)

  // Handle browser back/forward buttons
  window.addEventListener("popstate", () => {
    const url = new URL(window.location)
    const step = Number.parseInt(url.searchParams.get("step")) || 1
    showStep(step)
  })

  // Add error styling to CSS
  const style = document.createElement("style")
  style.textContent = `
  .error {
    border-color: var(--error-color) !important;
  }

  .error-message {
    color: var(--error-color);
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .error-message::before {
    content: "⚠️";
  }

  .form-step {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  .form-step.active {
    opacity: 1;
  }

  .progress-step {
    transition: all 0.3s ease-in-out;
  }

  .progress-step.active {
    transform: scale(1.1);
  }
`
  document.head.appendChild(style)
})

