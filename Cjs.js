document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return; // stop if this page has no contact form

  // Helper to show error
  function showError(input, message) {
    let error = input.nextElementSibling;
    if (!error || !error.classList.contains("error-message")) {
      error = document.createElement("div");
      error.className = "error-message";
      input.parentNode.appendChild(error);
    }
    error.textContent = message;
    input.classList.add("invalid");
    input.classList.remove("valid");
  }

  // Helper to clear error
  function clearError(input) {
    let error = input.nextElementSibling;
    if (error && error.classList.contains("error-message")) {
      error.textContent = "";
    }
    input.classList.remove("invalid");
    input.classList.add("valid");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const firstname = document.getElementById("firstname");
    const lastname = document.getElementById("lastname");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const message = document.getElementById("message");
    const subject = form.querySelector('input[name="subject"]:checked').value;

    let isValid = true;
    [firstname, lastname, email, phone, message].forEach(clearError);

    // Validate inputs
    if (!firstname.value.trim()) { showError(firstname, "First name is required"); isValid = false; }
    if (!lastname.value.trim()) { showError(lastname, "Last name is required"); isValid = false; }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) { showError(email, "Email is required"); isValid = false; }
    else if (!emailRegex.test(email.value.trim())) { showError(email, "Enter a valid email"); isValid = false; }

    if (!phone.value.trim()) { showError(phone, "Phone is required"); isValid = false; }
 else if (!/^\+?[\d\s().-]{7,20}$/.test(phone.value.trim())) { 
  showError(phone, "Enter a valid phone number"); 
  isValid = false; 
}


    if (!message.value.trim()) { showError(message, "Message cannot be empty"); isValid = false; }

    // Submit if valid
    if (isValid) {
      alert(`Thank you ${firstname.value}! Your message about "${subject}" has been sent.`);
      form.reset();
      [firstname, lastname, email, phone, message].forEach(input => input.classList.remove("valid"));
    }
  });
});
