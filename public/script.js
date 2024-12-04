document.addEventListener("DOMContentLoaded", () => {
    // Traducciones para los diferentes idiomas
    const translations = {
      en: {
        language: "Select your language",
        welcome: "Welcome",
        welcomeText:
          "Here begins your journey through the exhibition 'Poetry is an Invasion'. Tell us a little more about your interests before starting so we can help you find the best pieces for you.",
        time: "How much time do you have?",
        tags: "Choose your tags",
        pieces: "Pieces in the gallery",
        buttonText: "Start your journey >>",
      },
      es: {
        language: "Selecciona tu idioma",
        welcome: "Bienvenido",
        welcomeText:
          "Aquí comienza tu recorrido por la exposición 'La poesía es una invasión'. Cuéntanos un poco más sobre tus intereses antes de empezar para que podamos ayudarte a encontrar las mejores piezas para ti.",
        time: "¿Cuánto tiempo tienes?",
        tags: "Elige tus etiquetas",
        pieces: "Piezas en la galería",
        buttonText: "Empieza tu recorrido >>",
      },
      fr: {
        language: "Sélectionnez votre langue",
        welcome: "Bienvenue",
        welcomeText:
          "Ici commence votre voyage à travers l'exposition 'La poésie est une invasion'. Dites-nous en un peu plus sur vos intérêts avant de commencer afin que nous puissions vous aider à trouver les meilleures pièces pour vous.",
        time: "Combien de temps avez-vous?",
        tags: "Choisissez vos tags",
        pieces: "Pièces dans la galerie",
        buttonText: "Commencez votre parcours >>",
      },
    };
  
    // Elementos de la página que se actualizarán dinámicamente
    const languageTitle = document.getElementById("language-title");
    const welcomeTitle = document.getElementById("welcome-title");
    const welcomeText = document.getElementById("welcome-text");
    const timeTitle = document.getElementById("time-title");
    const tagsTitle = document.getElementById("tags-title");
    const piecesTitle = document.getElementById("pieces-title");
    const startButton = document.querySelector(".start-button button");
    const tagsElement = document.getElementById("tags-list");
    const piecesElement = document.getElementById("pieces-list");
  
    // Agrega eventos a los botones de idioma
    const languageButtons = document.querySelectorAll(".language-options button");
    languageButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const lang = button.getAttribute("data-lang");
        updateLanguage(lang);
      });
    });
  
    // Función para actualizar el idioma
    function updateLanguage(lang) {
      // Actualiza los textos de la página según el idioma seleccionado
      languageTitle.textContent = translations[lang].language;
      welcomeTitle.textContent = translations[lang].welcome;
      welcomeText.textContent = translations[lang].welcomeText;
      timeTitle.textContent = translations[lang].time;
      tagsTitle.textContent = translations[lang].tags;
      piecesTitle.textContent = translations[lang].pieces;
      startButton.textContent = translations[lang].buttonText;
  
      // Cargar etiquetas y títulos de las piezas en el idioma seleccionado
      fetch("data/pieces.json")
        .then((res) => res.json())
        .then((data) => {
          // Actualiza las etiquetas
          const tags = data
            .flatMap((item) => {
              const tagsKey = `tags_${lang}`;
              return item[tagsKey] ? item[tagsKey].split(", ") : [];
            })
            .join(", ");
          tagsElement.textContent = tags.length > 0 ? tags : "No tags available";
  
          // Actualiza los títulos de las piezas con enlaces
          const pieces = data
            .map((piece) => {
              const titleKey = `title_${lang}`;
              const title = piece[titleKey] || "No title available";
              return `<li><a href="piece.html?id=${piece.id}&lang=${lang}" target="_blank">${title}</a></li>`;
            })
            .join("");
          piecesElement.innerHTML = pieces;
        })
        .catch((error) => {
          console.error("Error al cargar las piezas:", error);
          tagsElement.textContent = "Error loading tags";
          piecesElement.innerHTML = "<li>Error loading pieces</li>";
        });
    }
  
    // Inicializar con idioma predeterminado (inglés)
    updateLanguage("en");
  });