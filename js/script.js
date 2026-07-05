// Attendre que le contenu du DOM soit chargé
document.addEventListener("DOMContentLoaded", function () {
  // --- Tâche 2: Simulation de connexion sur index.html ---
  const loginForm = document.getElementById("login-form"); //
  const errorMessage = document.getElementById("error-message"); //

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      // [cite: 48]
      // Empêcher le rechargement de la page [cite: 32]
      event.preventDefault();

      // Récupérer les valeurs des champs
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const errorDiv = document.getElementById("error-message");

      // Vérifier que les champs ne sont pas vides [cite: 49]
      if (email === "" || password === "") {
        errorMessage.innerText = "Veuillez remplir tous les champs.";
        errorMessage.style.display = "block";
        return;
      }

      // Simulation simple de connexion [cite: 52]
      if (email === "user@club.tn" && password === "1234") {
        // Sauvegarder l'état de connexion et l'email utilisateur [cite: 53]
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);

        // Rediriger vers home.html [cite: 53]
        window.location.href = "home.html";
      } else {
        // Afficher un message d'erreur [cite: 54]
        errorMessage.innerText = "Email ou mot de passe incorrect.";
        errorMessage.style.display = "block";
      }
    });
  }

  // --- Tâche 2b: Gestion du formulaire d'inscription ---
  const registerForm = document.getElementById("register-form");
  const successMessage = document.getElementById("success-message");
  const formErrorMessage = document.getElementById("error-message");

  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const nom = document.getElementById("nom").value.trim();
      const email = document.getElementById("email").value.trim();
      const telephone = document.getElementById("telephone").value.trim();
      const places = parseInt(document.getElementById("places").value, 10);
      const message = document.getElementById("message").value.trim();

      const errors = [];

      if (nom.length < 3) {
        errors.push("Le nom doit contenir au moins 3 caractères.");
      }

      if (!email.includes("@")) {
        errors.push("L'email doit contenir un @.");
      }

      if (!/^\d{8}$/.test(telephone)) {
        errors.push("Le téléphone doit être composé de exactement 8 chiffres.");
      }

      if (Number.isNaN(places) || places < 1 || places > 10) {
        errors.push("Le nombre de places doit être entre 1 et 10.");
      }

      if (errors.length > 0) {
        if (formErrorMessage) {
          formErrorMessage.className = "error";
          formErrorMessage.innerText = errors.join(" ");
          formErrorMessage.style.display = "block";
        }

        if (successMessage) {
          successMessage.style.display = "none";
        }
        return;
      }

      const inscription = {
        nom,
        email,
        telephone,
        places,
        message,
        date: new Date().toISOString(),
      };

      try {
        const stored = localStorage.getItem("inscriptions");
        const inscriptions = stored ? JSON.parse(stored) : [];
        inscriptions.push(inscription);
        localStorage.setItem("inscriptions", JSON.stringify(inscriptions));

        if (successMessage) {
          successMessage.className = "success";
          successMessage.innerText =
            "Inscription enregistrée avec succès ! Vous serez redirigé vers votre profil...";
          successMessage.style.display = "block";
        }

        if (formErrorMessage) {
          formErrorMessage.style.display = "none";
        }

        setTimeout(function () {
          window.location.href = "profile.html";
        }, 2000);
      } catch (error) {
        if (formErrorMessage) {
          formErrorMessage.className = "error";
          formErrorMessage.innerText =
            "Une erreur est survenue lors de l'inscription. Veuillez réessayer.";
          formErrorMessage.style.display = "block";
        }
      }
    });
  }

  // --- Gestion du formulaire d'adhésion (adhesion.html) ---
  const adhesionForm = document.getElementById("adhesion-form");

  if (adhesionForm) {
    adhesionForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const nom = document.getElementById("nom").value.trim();
      const email = document.getElementById("email").value.trim();
      const tel = document.getElementById("tel").value.trim();
      const message = document.getElementById("message").value.trim();

      const errors = [];

      if (nom.length < 3) {
        errors.push("Le nom doit contenir au moins 3 caractères.");
      }

      if (!email.includes("@")) {
        errors.push("L'email doit contenir un @.");
      }

      if (!/^\d{8}$/.test(tel)) {
        errors.push("Le téléphone doit être composé de exactement 8 chiffres.");
      }

      if (errors.length > 0) {
        alert(errors.join("\n"));
        return;
      }

      const adhesion = {
        nom,
        email,
        tel,
        message,
        date: new Date().toISOString(),
      };

      try {
        const stored = localStorage.getItem("inscriptions");
        const inscriptions = stored ? JSON.parse(stored) : [];
        inscriptions.push(adhesion);
        localStorage.setItem("inscriptions", JSON.stringify(inscriptions));

        alert(
          "Adhésion enregistrée avec succès ! Vous serez redirigé vers la page À propos...",
        );

        setTimeout(function () {
          window.location.href = "about.html";
        }, 1500);
      } catch (error) {
        alert(
          "Une erreur est survenue lors de l'adhésion. Veuillez réessayer.",
        );
      }
    });
  }

  // --- Tâche 3: Protection des autres pages ---
  // Vérifier si nous ne sommes PAS sur la page d'accueil (index.html) [cite: 67]
  const isLoginPage =
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/";

  if (!isLoginPage) {
    // Vérifier si l'utilisateur est connecté [cite: 67]
    if (localStorage.getItem("isLoggedIn") !== "true") {
      // Rediriger vers index.html si non connecté [cite: 68]
      window.location.href = "index.html";
    }
  }

  // --- Tâche 3: Chargement de la page profil ---
  const profileEmail = document.getElementById("user-email");
  const inscriptionsList = document.getElementById("inscriptions-list");

  if (profileEmail) {
    profileEmail.textContent =
      localStorage.getItem("userEmail") || "user@club.tn";
  }

  if (inscriptionsList) {
    displayInscriptionCards();
  }

  // Afficher les membres sur about.html
  const membersList = document.getElementById("members-list");
  if (membersList) {
    afficherMembres();
  }
});

/**
 * Display inscription cards dynamically
 * Retrieves inscriptions from localStorage and generates HTML cards
 */
function displayInscriptionCards() {
  const inscriptionsList = document.getElementById("inscriptions-list");
  if (!inscriptionsList) return;

  const storedInscriptions = localStorage.getItem("inscriptions");
  const inscriptions = storedInscriptions ? JSON.parse(storedInscriptions) : [];

  if (inscriptions.length === 0) {
    inscriptionsList.innerHTML =
      '<div class="no-inscriptions">Aucune inscription enregistrée.</div>';
  } else {
    inscriptionsList.innerHTML = inscriptions
      .map((inscription, index) => {
        return `
          <article class="card-inscription">
            <div class="card-header">
              <h4>${inscription.nom}</h4>
              <span class="card-index">#${index + 1}</span>
            </div>
            <div class="card-body">
              <div class="card-field">
                <strong>Email :</strong>
                <span>${inscription.email}</span>
              </div>
              <div class="card-field">
                <strong>Téléphone :</strong>
                <span>${inscription.telephone}</span>
              </div>
              <div class="card-field">
                <strong>Places :</strong>
                <span>${inscription.places}</span>
              </div>
              <div class="card-field">
                <strong>Message :</strong>
                <span>${inscription.message || "-"}</span>
              </div>
              <div class="card-field">
                <strong>Date :</strong>
                <span>${new Date(inscription.date).toLocaleString()}</span>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }
}

// Optionnel: Fonction de déconnexion à appeler sur un bouton "Quitter"
function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("inscriptions");
  window.location.href = "index.html";
}

const evenements = [
  {
    id: 1,
    titre: "Soirée Gnawa Traditionnelle",
    date: "15 mars 2026",
    lieu: "Médina de Tunis",
    image: "images/event1.jpg",
    description:
      "Une soirée musicale dédiée à la tradition Gnawa, mêlant rythmes spirituels et instruments authentiques.",
    places: "45 places disponibles",
  },
  {
    id: 2,
    titre: "Regards Croisés sur la Médina",
    date: "15 mars 2026",
    lieu: "Palais Kheireddine",
    image: "images/event2.jpg",
    description:
      "Exposition de peintures contemporaines inspirées par l'architecture de Tunis.",
    places: "30 places disponibles",
  },
  {
    id: 3,
    titre: "Illuminaions d'El Halfaouine",
    date: "05 avril 2026",
    lieu: "Palais du Théâtre, Place Halfaouine",
    image: "images/event3.jpg",
    description:
      "Assistez à une représentation exceptionnelle de la troupe nationale dans le cadre historique de la Médina.",
    places: "100 places disponibles",
  },
  {
    id: 4,
    titre: "Festival International du Sahara",
    date: "27 décembre 2026",
    lieu: "Douz",
    image: "images/event4.jpg",
    description:
      "Célébrez les traditions du sud tunisien à travers des spectacles équestres, des musiques folkloriques et des activités culturelles.",
    places: "Illimitées",
  },
  {
    id: 5,
    titre: "Festival International de Bizerte",
    date: "Août 2026",
    lieu: "Amphithéâtre de Bizerte (Fort d'Espagne)",
    image: "images/event5.jpg",
    description:
      "Un rendez-vous incontournable pour les amateurs de musique et d'arts de la scène dans le cadre majestueux de Bizerte.",
    places: "500 places disponibles",
  },
];

function genererCartes() {
  const grille = document.querySelector(".grid-evenements");
  if (grille) {
    grille.innerHTML = ""; // Vider le contenu statique [cite: 134]

    evenements.forEach((ev) => {
      // Parcourir le tableau [cite: 93, 135]
      const carte = `
                <article class="card-event">
                    <img src="${ev.image}" alt="${ev.titre}" />
                    <h3>${ev.titre}</h3>
                    <p>Date : ${ev.date} | Lieu : ${ev.lieu}</p>
                    <p>${ev.description}</p>
                    <a href="event-details.html?id=${ev.id}" class="btn btn-primary">Voir détails</a>
                </article>
                <br />
            `;
      grille.innerHTML += carte; // Ajouter à la grille [cite: 136, 137]
    });
  }
}

// Appeler la fonction si nous sommes sur home.html
if (document.querySelector(".grid-evenements")) {
  genererCartes();
}

function afficherDetails() {
  // Récupérer l'ID depuis l'URL (ex: ?id=1) [cite: 96, 97, 148]
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));

  if (id) {
    // Chercher l'événement correspondant [cite: 99, 149]
    const ev = evenements.find((e) => e.id === id);

    if (ev) {
      // Remplir dynamiquement les éléments par leur ID [cite: 150, 152]
      if (document.getElementById("event-titre"))
        document.getElementById("event-titre").textContent = ev.titre;

      if (document.getElementById("event-image"))
        document.getElementById("event-image").src = ev.image;

      if (document.getElementById("event-infos"))
        document.getElementById("event-infos").innerHTML =
          `<strong>Date :</strong> ${ev.date} | <strong>Lieu :</strong> ${ev.lieu} | <strong>${ev.places}</strong>`;

      if (document.getElementById("event-description"))
        document.getElementById("event-description").textContent =
          ev.description;
    }
  }
}

// Appeler la fonction si nous sommes sur la page détails
if (window.location.pathname.includes("event-details.html")) {
  afficherDetails();
}

/**
 * Display member cards dynamically on about.html
 * Retrieves inscriptions from localStorage and generates professional member cards
 */
function afficherMembres() {
  const membersList = document.getElementById("members-list");
  if (!membersList) return;

  const storedInscriptions = localStorage.getItem("inscriptions");
  const inscriptions = storedInscriptions ? JSON.parse(storedInscriptions) : [];

  if (inscriptions.length === 0) {
    membersList.innerHTML =
      '<div class="no-members">Aucun membre enregistré pour le moment.</div>';
  } else {
    membersList.innerHTML = inscriptions
      .map((inscription, index) => {
        const dateAdhesion = new Date(inscription.date).toLocaleDateString(
          "fr-FR",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        );
        return `
          <article class="card-member">
            <div class="card-member-header">
              <div class="member-icon">👤</div>
              <h3>${inscription.nom}</h3>
            </div>
            <div class="card-member-body">
              <p class="member-bio">${inscription.message || "Biographie non fournie"}</p>
              <p class="member-date"><strong>Adhésion :</strong> ${dateAdhesion}</p>
              <div class="card-member-actions">
                <button class="btn btn-edit" onclick="modifierMembre(${index})">Modifier</button>
                <button class="btn btn-delete" onclick="supprimerMembre(${index})">Supprimer</button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }
}

/**
 * Delete a member from inscriptions
 * Shows confirmation before deleting and updates localStorage
 * @param {number} index - Index of the member to delete
 */
function supprimerMembre(index) {
  if (
    confirm(
      "Êtes-vous sûr de vouloir supprimer ce membre ? Cette action est irréversible.",
    )
  ) {
    const storedInscriptions = localStorage.getItem("inscriptions");
    const inscriptions = storedInscriptions
      ? JSON.parse(storedInscriptions)
      : [];

    if (index >= 0 && index < inscriptions.length) {
      inscriptions.splice(index, 1);
      localStorage.setItem("inscriptions", JSON.stringify(inscriptions));
      afficherMembres();
    }
  }
}

/**
 * Edit a member's information
 * Allows modifying the name and message of a member
 * @param {number} index - Index of the member to edit
 */
function modifierMembre(index) {
  const storedInscriptions = localStorage.getItem("inscriptions");
  const inscriptions = storedInscriptions ? JSON.parse(storedInscriptions) : [];

  if (index >= 0 && index < inscriptions.length) {
    const membre = inscriptions[index];

    const nouveauNom = prompt("Modifier le nom du membre :", membre.nom);
    if (nouveauNom === null) return;

    if (nouveauNom.trim().length < 3) {
      alert("Le nom doit contenir au moins 3 caractères.");
      return;
    }

    const nouveauMessage = prompt(
      "Modifier le message/biographie :",
      membre.message || "",
    );
    if (nouveauMessage === null) return;

    membre.nom = nouveauNom.trim();
    membre.message = nouveauMessage.trim();

    localStorage.setItem("inscriptions", JSON.stringify(inscriptions));
    afficherMembres();
    alert("Modifications enregistrées avec succès !");
  }
}

// Appeler la fonction si nous sommes sur about.html
// --- Gestion du Menu Burger ---
const menuToggle = document.getElementById("menu-toggle");
const menuMobile = document.querySelector(".menu-mobile");

if (menuToggle) {
  menuToggle.addEventListener("change", function () {
    if (this.checked) {
      menuMobile.style.display = "flex"; // Affiche le menu
      menuMobile.removeAttribute("hidden"); // Retire l'attribut hidden
    } else {
      menuMobile.style.display = "none"; // Cache le menu
    }
  });
}

// Fermer le menu si on clique sur un lien (optionnel mais pratique)
const mobileLinks = document.querySelectorAll(".menu-mobile a");
mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.checked = false;
    menuMobile.style.display = "none";
  });
});

// Fonction pour afficher les membres sur la page À propos
function afficherMembres() {
    const membersList = document.getElementById("members-list");
    if (membersList) {
        const stored = localStorage.getItem("inscriptions");
        const inscriptions = stored ? JSON.parse(stored) : [];

        if (inscriptions.length === 0) {
            membersList.innerHTML = "<p>Aucun membre pour le moment.</p>";
        } else {
            // AJOUT DE "index" ici pour identifier chaque membre
            membersList.innerHTML = inscriptions.map((membre, index) => `
                <div class="member-card">
                    <div class="member-icon">👤</div>
                    <h4>${membre.nom}</h4>
                    <p class="member-role">Membre Adhérent</p>
                    
                    <div class="member-preferences">
                        ${membre.preferences ? membre.preferences.map(p => `<span class="badge">${p}</span>`).join('') : ''}
                    </div>

                    <span class="member-date">Inscrit le ${new Date(membre.date).toLocaleDateString()}</span>
                    
                    <div class="member-actions">
                        <button onclick="modifierMembre(${index})" class="btn-modifier">Modifier</button>
                        <button onclick="supprimerMembre(${index})" class="btn-supprimer">Supprimer</button>
                    </div>
                </div>
            `).join("");
        }
    }
}

// Appeler la fonction au chargement

// Fonction pour supprimer un membre
function supprimerMembre(index) {
    if (confirm("Voulez-vous vraiment supprimer ce membre ?")) {
        let inscriptions = JSON.parse(localStorage.getItem("inscriptions")) || [];
        inscriptions.splice(index, 1); // Supprime l'élément à la position index
        localStorage.setItem("inscriptions", JSON.stringify(inscriptions));
        afficherMembres(); // Recharge la liste
    }
}

// Fonction pour modifier un membre (version simple avec prompt)
function modifierMembre(index) {
    let inscriptions = JSON.parse(localStorage.getItem("inscriptions")) || [];
    let nouveauNom = prompt("Modifier le nom :", inscriptions[index].nom);
    
    if (nouveauNom !== null && nouveauNom.trim() !== "") {
        inscriptions[index].nom = nouveauNom;
        localStorage.setItem("inscriptions", JSON.stringify(inscriptions));
        afficherMembres(); // Recharge la liste
    }
}
document.addEventListener("DOMContentLoaded", afficherMembres);