document.addEventListener("DOMContentLoaded", () => {
    // ========================== TRANSLATIONS ==========================
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
            generateButton: "Generate your journey",
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
            generateButton: "Genera tu viaje",
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
            generateButton: "Générez votre parcours",
        },
    };

    // ========================== DOM ELEMENTS ==========================
    const languageTitle = document.getElementById("language-title");
    const welcomeTitle = document.getElementById("welcome-title");
    const welcomeText = document.getElementById("welcome-text");
    const timeTitle = document.getElementById("time-title");
    const tagsTitle = document.getElementById("tags-title");
    const piecesTitle = document.getElementById("pieces-title");
    const mapText = document.getElementById("map-text");
    const mapList = document.getElementById("map-list");
    const startButton = document.querySelector(".start-button button");
    const tagsElement = document.getElementById("tags-list");
    const selectedTagsElement = document.getElementById("selected-tags-list");
    const piecesElement = document.getElementById("pieces-list");
    const languageLinks = document.querySelectorAll(".language-options a");
    const slider = document.getElementById("time-slider");
    const sliderValue = document.getElementById("slider-value");

    let currentLanguage = "en";
    let selectedTags = [];

    // ========================== TIME FUNCTIONS ==========================
    function convertTimeToMinutes(time) {
        const [hours, minutes, seconds] = time.split(":").map(Number);
        return hours * 60 + minutes + seconds / 60;
    }

    function formatTimeFromMinutes(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }

    function formatSliderValue(value) {
        const hours = Math.floor(value / 60);
        const minutes = value % 60;
        return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
    }

    function updateSliderValue(value) {
        sliderValue.textContent = formatSliderValue(value);
        const position = ((value - slider.min) / (slider.max - slider.min)) * slider.offsetWidth;
        sliderValue.style.left = `${position - 12}px`;
    }

    slider.addEventListener("input", () => updateSliderValue(slider.value));
    updateSliderValue(slider.value);

  // ========================== LANGUAGE SWITCHING ==========================
function updateLanguage(lang) {
    if (currentLanguage === lang) return; // Evitar recargar si ya está en el idioma seleccionado

    currentLanguage = lang;

    // Actualizar textos en el idioma seleccionado
    languageTitle.textContent = translations[lang].language;
    welcomeTitle.textContent = translations[lang].welcome;
    welcomeText.textContent = translations[lang].welcomeText;
    timeTitle.textContent = translations[lang].time;
    tagsTitle.textContent = translations[lang].tags;
    piecesTitle.textContent = translations[lang].pieces;
    mapText.textContent = translations[lang].map;

    // Actualizar visualmente los enlaces de idioma
    languageLinks.forEach((link) => {
        if (link.getAttribute("data-lang") === lang) {
            link.classList.add("active"); // Agregar clase activa
            link.setAttribute("aria-current", "true"); // Accesibilidad
        } else {
            link.classList.remove("active"); // Eliminar clase activa de los demás
            link.removeAttribute("aria-current");
        }
    });

    // Recargar las etiquetas y piezas en el idioma seleccionado
    loadTagsAndPieces(lang);
    updateSelectedTagsDisplay();
}

// ========================== EVENT LISTENERS ==========================
languageLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault(); // Evitar el comportamiento predeterminado
        const selectedLang = link.getAttribute("data-lang");
        updateLanguage(selectedLang); // Cambiar idioma
    });
});

// ========================== LANGUAGE BUTTONS ==========================
languageLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const selectedLang = link.getAttribute("data-lang");
        updateLanguage(selectedLang);
    });
});

    // ========================== DATA LOADING ==========================
    function loadTagsAndPieces(lang) {
        fetch("data/pieces.json")
            .then((res) => res.json())
            .then((data) => {
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

                document.querySelectorAll(".tag-link").forEach((tagElement) => {
                    tagElement.addEventListener("click", () => selectTag(tagElement.textContent));
                });

                piecesElement.innerHTML = data
                    .map(
                        (piece) =>
                            `<li><a href="piece.html?id=${piece.id}&lang=${lang}" target="_blank">${piece[`title_${lang}`]}</a></li>`
                    )
                    .join("");
            })
            .catch((err) => console.error("Error loading pieces:", err));
    }

    // ========================== TAG SELECTION ==========================
    function selectTag(tag) {
        if (!selectedTags.includes(tag)) {
            selectedTags.push(tag);
            updateSelectedTagsDisplay();
            loadTagsAndPieces(currentLanguage);
        }
    }

    function deselectTag(tag) {
        selectedTags = selectedTags.filter((t) => t !== tag);
        updateSelectedTagsDisplay();
        loadTagsAndPieces(currentLanguage);
    }

    function updateSelectedTagsDisplay() {
        selectedTagsElement.innerHTML = selectedTags
            .map((tag) => `<li class="selected-tag">${tag}</li>`)
            .join("");

        document.querySelectorAll(".selected-tag").forEach((tagElement) => {
            tagElement.addEventListener("click", () => deselectTag(tagElement.textContent));
        });
    }

    // ========================== GENERATE JOURNEY ==========================
    function generateJourney() {
        const timeAvailable = parseInt(slider.value, 10);

        fetch("data/pieces.json")
            .then((res) => res.json())
            .then((piecesData) => {
                let totalTime = 0;
                const journey = [];
                const taggedPieces = piecesData.filter((piece) => {
                    const pieceTags = piece[`tags_${currentLanguage}`]?.split(", ") || [];
                    return selectedTags.some((tag) => pieceTags.includes(tag));
                });

                const remainingPieces = piecesData.filter((piece) => !taggedPieces.includes(piece));
                const combinedPieces = [...taggedPieces, ...remainingPieces];

                combinedPieces.forEach((piece) => {
                    const pieceTime = convertTimeToMinutes(piece.duration);

                    if (totalTime + pieceTime <= timeAvailable) {
                        totalTime += pieceTime;
                        journey.push({ ...piece, accumulatedTime: totalTime });
                    }
                });

                mapList.innerHTML = journey
                    .map(
                        (item, index) => `
                        <li>
                            <a href="piece.html?id=${item.id}&lang=${currentLanguage}" target="_blank">
                                ${index + 1}. ${item[`title_${currentLanguage}`]}
                            </a> - Accumulated Time: ${formatTimeFromMinutes(item.accumulatedTime)}
                            <div style="display: inline-flex; gap: 5px;">
                                ${item[`tags_${currentLanguage}`]
                                    ?.split(", ")
                                    .filter((tag) => selectedTags.includes(tag))
                                    .map(
                                        (tag) => `
                                        <span style="background-color: black; color: white; padding: 2px 5px; border-radius: 3px;">
                                            ${tag}
                                        </span>`
                                    )
                                    .join("")}
                            </div>
                        </li>`
                    )
                    .join("");

                const journeyPoints = journey.map((piece) => piece.coordenada || [0, 0]);
                window.updateJourneyPoints(journeyPoints); // Enviar puntos al sketch de p5.js
            })
            .catch((error) => console.error("Error generating journey:", error));
    }

    const generateButton = document.createElement("button");
    generateButton.textContent = translations[currentLanguage].generateButton;
    generateButton.className = "start-button";
    generateButton.addEventListener("click", generateJourney);
    document.querySelector(".map .section-left").appendChild(generateButton);

    loadTagsAndPieces(currentLanguage);
});