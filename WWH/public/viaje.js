document.addEventListener("DOMContentLoaded", () => {
    // ========================== DOM ELEMENTS ==========================
    const slider = document.getElementById("time-slider");
    const sliderValue = document.getElementById("slider-value");
    const tagsElement = document.getElementById("tags-list");
    const selectedTagsElement = document.getElementById("selected-tags-list");
    const mapList = document.getElementById("map-list");

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

    function updateSliderValue(value) {
        sliderValue.textContent = formatTimeFromMinutes(value);
    }

    slider.addEventListener("input", () => updateSliderValue(slider.value));
    updateSliderValue(slider.value);

    // ========================== DATA LOADING ==========================
    function loadTagsAndPieces(lang) {
        fetch("data/pieces.json")
            .then((res) => res.json())
            .then((data) => {
                // Cargar y renderizar los tags disponibles
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

                // Si los tags cambian por idioma, actualizamos los seleccionados
                updateSelectedTagsDisplay();
            })
            .catch((err) => console.error("Error loading pieces:", err));
    }

    // ========================== TAG SELECTION ==========================
    function selectTag(tag) {
        if (!selectedTags.includes(tag)) {
            selectedTags.push(tag);
            updateSelectedTagsDisplay();
            generateJourney(); // Regenerar la lista del viaje
        }
    }

    function deselectTag(tag) {
        selectedTags = selectedTags.filter((t) => t !== tag);
        updateSelectedTagsDisplay();
        generateJourney(); // Regenerar la lista del viaje
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

                // Ordenar las piezas por ID y seleccionar por tiempo disponible
                piecesData
                    .sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10))
                    .forEach((piece) => {
                        const pieceTime = convertTimeToMinutes(piece.duration);
                        const pieceTags = piece[`tags_${currentLanguage}`]?.split(", ") || [];

                        if (totalTime + pieceTime <= timeAvailable) {
                            journey.push({
                                ...piece,
                                accumulatedTime: totalTime + pieceTime,
                                hasSelectedTags: selectedTags.some((tag) => pieceTags.includes(tag)),
                            });
                            totalTime += pieceTime;
                        }
                    });

                // Renderizar la lista de piezas con títulos y tags en el idioma actual
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

                // Actualizar puntos en el canvas
                const journeyPoints = journey.map((piece) => piece.coordenada || [0, 0]);
                window.updateJourneyPoints(journeyPoints);
            })
            .catch((error) => console.error("Error generating journey:", error));
    }

    const generateButton = document.createElement("button");
    generateButton.textContent = "Generate your journey";
    generateButton.className = "start-button";
    generateButton.addEventListener("click", generateJourney);
    document.querySelector(".map .section-left").appendChild(generateButton);

    // ========================== EVENT LISTENERS ==========================
    document.addEventListener("languageChanged", (event) => {
        currentLanguage = event.detail.lang;
        loadTagsAndPieces(currentLanguage); // Cargar datos según idioma
        generateJourney(); // Regenerar la lista de journey en el idioma seleccionado
    });

    loadTagsAndPieces(currentLanguage);
});