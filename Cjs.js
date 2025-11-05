document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return; // arrêter si cette page n’a pas de formulaire de contact

  // Fonction d’aide pour afficher une erreur
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

  // Fonction d’aide pour effacer une erreur
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

    // Validation des champs
    if (!firstname.value.trim()) { showError(firstname, "Le prénom est obligatoire"); isValid = false; }
    if (!lastname.value.trim()) { showError(lastname, "Le nom est obligatoire"); isValid = false; }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) { showError(email, "L’adresse e-mail est obligatoire"); isValid = false; }
    else if (!emailRegex.test(email.value.trim())) { showError(email, "Entrez une adresse e-mail valide"); isValid = false; }

    if (!phone.value.trim()) { showError(phone, "Le numéro de téléphone est obligatoire"); isValid = false; }
    else if (!/^\+?[\d\s().-]{7,20}$/.test(phone.value.trim())) { 
      showError(phone, "Entrez un numéro de téléphone valide"); 
      isValid = false; 
    }

    if (!message.value.trim()) {
  showError(message, "Le message ne peut pas être vide.");
  isValid = false;
} else if (message.value.trim().length < 8) {
  showError(message, "Le message doit contenir au moins 8 caractères.");
  isValid = false;
}


    // Soumission si tout est valide
    if (isValid) {
      alert(`Merci ${firstname.value} ! Votre message à propos de "${subject}" a été envoyé.`);
      form.reset();
      [firstname, lastname, email, phone, message].forEach(input => input.classList.remove("valid"));
    }
  });
});
