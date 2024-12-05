document.addEventListener("DOMContentLoaded", () => {
    // Traducciones para los diferentes idiomas
    const translations = {
        en: {
            language: "Select your language",
            welcome: "Welcome",
            welcomeText: "Here begins your journey through the exhibition 'Poetry is an Invasion'. Tell us a little more about your interests before starting so we can help you find the best pieces for you.",
            time: "How much time do you have?",
            tags: "Choose your tags",
            pieces: "Pieces in the gallery",
            map: "This is your personalized tour based on your previous selections.",
            buttonText: "Start your journey >>",
        },
        es: {
            language: "Selecciona tu idioma",
            welcome: "Bienvenido",
            welcomeText: "Aquí comienza tu recorrido por la exposición 'La poesía es una invasión'. Cuéntanos un poco más sobre tus intereses antes de empezar para que podamos ayudarte a encontrar las mejores piezas para ti.",
            time: "¿Cuánto tiempo tienes?",
            tags: "Elige tus etiquetas",
            pieces: "Piezas en la galería",
            map: "Este es tu recorrido personalizado según tus selecciones anteriores.",
            buttonText: "Empieza tu recorrido >>",
        },
        fr: {
            language: "Sélectionnez votre langue",
            welcome: "Bienvenue",
            welcomeText: "Ici commence votre voyage à travers l'exposition 'La poésie est une invasion'. Dites-nous en un peu plus sur vos intérêts avant de commencer afin que nous puissions vous aider à trouver les meilleures pièces pour vous.",
            time: "Combien de temps avez-vous?",
            tags: "Choisissez vos tags",
            pieces: "Pièces dans la galerie",
            map: "Il s'agit de votre visite personnalisée basée sur vos sélections précédentes.",
            buttonText: "Commencez votre parcours >>",
        },
    };

    // Elementos de la página
    const languageTitle = document.getElementById("language-title");
    const welcomeTitle = document.getElementById("welcome-title");
    const welcomeText = document.getElementById("welcome-text");
    const timeTitle = document.getElementById("time-title");
    const tagsTitle = document.getElementById("tags-title");
    const piecesTitle = document.getElementById("pieces-title");
    const mapText = document.getElementById("map-text");
    const startButton = document.querySelector(".start-button button");
    const tagsElement = document.getElementById("tags-list");
    const selectedTagsElement = document.getElementById("selected-tags-list");
    const piecesElement = document.getElementById("pieces-list");
    const languageLinks = document.querySelectorAll(".language-options a");
    const slider = document.getElementById("time-slider");
    const sliderValue = document.getElementById("slider-value");

    let currentLanguage = "en"; // Idioma actual
    let selectedTags = []; // Tags seleccionados

    // Función para convertir el valor del slider a la escala personalizada
    function formatSliderValue(value) {
        const hours = Math.floor(value / 60);
        const minutes = value % 60;

        if (hours === 0) {
            return `${minutes}m`;
        } else if (minutes === 0) {
            return `${hours}h`;
        } else {
            return `${hours}h ${minutes}m`;
        }
    }

    // Actualizar el valor dinámico del slider
    function updateSliderValue(value) {
        sliderValue.textContent = formatSliderValue(value);

        const sliderWidth = slider.offsetWidth;
        const thumbWidth = 24; // Ancho del triángulo
        const max = slider.max - slider.min;
        const position = ((value - slider.min) / max) * sliderWidth;

        sliderValue.style.left = `${position - thumbWidth / 2}px`;
    }

    // Inicializar el slider con el valor por defecto
    updateSliderValue(slider.value);

    // Evento para actualizar el valor del slider dinámicamente
    slider.addEventListener("input", () => {
        updateSliderValue(slider.value);
    });

    // Actualizar el idioma de la página
    function updateLanguage(lang) {
        currentLanguage = lang;

        languageTitle.textContent = translations[lang].language;
        welcomeTitle.textContent = translations[lang].welcome;
        welcomeText.textContent = translations[lang].welcomeText;
        timeTitle.textContent = translations[lang].time;
        tagsTitle.textContent = translations[lang].tags;
        piecesTitle.textContent = translations[lang].pieces;
        mapText.textContent = translations[lang].map;
        startButton.textContent = translations[lang].buttonText;

        languageLinks.forEach((link) => {
            if (link.getAttribute("data-lang") === lang) {
                link.classList.add("active");
                link.removeAttribute("href");
            } else {
                link.classList.remove("active");
                link.setAttribute("href", "#");
            }
        });

        // Recargar las etiquetas y piezas en el idioma seleccionado
        loadTagsAndPieces(lang);
        updateSelectedTagsDisplay();
    }

    // Cargar etiquetas y piezas desde el JSON
    function loadTagsAndPieces(lang) {
        fetch("data/pieces.json")
            .then((res) => res.json())
            .then((data) => {
                // Actualizar etiquetas
                const tags = Array.from(
                    new Set(
                        data.flatMap((item) => {
                            const tagsKey = `tags_${lang}`;
                            return item[tagsKey] ? item[tagsKey].split(", ") : [];
                        })
                    )
                );

                tagsElement.innerHTML = tags
                    .filter((tag) => !selectedTags.includes(tag))
                    .map((tag) => `<span class="tag-link">${tag}</span>`)
                    .join("");

                // Hacer clic en los tags
                document.querySelectorAll(".tag-link").forEach((tagElement) => {
                    tagElement.addEventListener("click", () => {
                        const tag = tagElement.textContent;
                        selectTag(tag);
                    });
                });

                // Actualizar piezas
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

    // Seleccionar un tag
    function selectTag(tag) {
        if (!selectedTags.includes(tag)) {
            selectedTags.push(tag);
            updateSelectedTagsDisplay();
            loadTagsAndPieces(currentLanguage);
        }
    }

    // Deseleccionar un tag
    function deselectTag(tag) {
        selectedTags = selectedTags.filter((t) => t !== tag);
        updateSelectedTagsDisplay();
        loadTagsAndPieces(currentLanguage);
    }

    // Actualizar la visualización de los tags seleccionados
    function updateSelectedTagsDisplay() {
        selectedTagsElement.innerHTML = selectedTags
            .map((tag) => `<li class="selected-tag">${tag}</li>`)
            .join("");

        document.querySelectorAll(".selected-tag").forEach((tagElement) => {
            tagElement.addEventListener("click", () => {
                const tag = tagElement.textContent;
                deselectTag(tag);
            });
        });
    }

    // Inicializar la página
    languageLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const lang = link.getAttribute("data-lang");
            updateLanguage(lang);
        });
    });

    updateLanguage("en"); // Idioma predeterminado
});