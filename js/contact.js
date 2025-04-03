// Contact form handling
document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contact-form")
  
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        // Get form values
        const name = document.getElementById("name").value
        const email = document.getElementById("email").value
        const phone = document.getElementById("phone").value
        const subject = document.getElementById("subject").value
        const message = document.getElementById("message").value
  
        // Simple validation
        if (!name || !email || !subject || !message) {
          alert("Please fill in all required fields.")
          return
        }
  
        // In a real application, you would send this data to a server
        // For now, we'll just show a success message
        alert("Thank you for your message! We will get back to you soon.")
  
        // Reset the form
        contactForm.reset()
      })
    }
  
    // Make sure FAQ functionality works
    const faqItems = document.querySelectorAll(".faq-item")
  
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question")
  
      if (question) {
        question.addEventListener("click", () => {
          // Toggle active class on the clicked item
          item.classList.toggle("active")
  
          // Close other items
          faqItems.forEach((otherItem) => {
            if (otherItem !== item && otherItem.classList.contains("active")) {
              otherItem.classList.remove("active")
            }
          })
        })
      }
    })
  
    // Open the first FAQ item by default
    if (faqItems.length > 0) {
      faqItems[0].classList.add("active")
    }
  })
  
  