document.addEventListener("DOMContentLoaded", () => {
  // Obtener parámetros de la URL
  const params = new URLSearchParams(window.location.search);
  const pieceId = params.get("id");
  const lang = params.get("lang") || "en";

  // Elementos de la página
  const pieceTitle = document.getElementById("piece-title");
  const pieceDate = document.getElementById("piece-date");
  const pieceDescription = document.getElementById("piece-description");
  const pieceMultimedia = document.getElementById("piece-multimedia");
  const pieceComments = document.getElementById("piece-comments");
  const newComment = document.getElementById("new-comment");
  const addCommentBtn = document.getElementById("add-comment-btn");
  const pieceImage = document.getElementById("piece-image"); // Imagen de la pieza

  // Cargar datos desde el JSON
  fetch("data/pieces.json")
      .then((response) => response.json())
      .then((data) => {
          const piece = data.find((item) => item.id === pieceId);

          if (piece) {
              // Cargar los datos de la pieza
              const titleKey = `title_${lang}`;
              const descriptionKey = `description_${lang}`;

              pieceTitle.textContent = piece[titleKey] || "No title available";
              pieceDate.textContent = piece.fecha || "No date available";
              pieceDescription.textContent =
                  piece[descriptionKey] || "No description available";

              // Cargar multimedia (video de YouTube)
              if (piece.video && piece.video !== "nan") {
                  // Manejar URLs de enlace corto y extraer el ID del video
                  const youtubeId = piece.video.split("/").pop().split("?")[0];
                  pieceMultimedia.innerHTML = `
                      <iframe 
                          width="560" 
                          height="315" 
                          src="https://www.youtube.com/embed/${youtubeId}" 
                          frameborder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowfullscreen>
                      </iframe>`;
              } else {
                  pieceMultimedia.textContent = "No multimedia available.";
              }

              // Cargar imagen de la pieza
              pieceImage.src = `assets/galeria/${piece.id}.png`;
              pieceImage.alt = piece[titleKey] || "Piece Image";

              // Cargar comentarios
              const comments = JSON.parse(piece.comments || "[]");
              pieceComments.innerHTML = comments
                  .map((comment) => `<li>${comment}</li>`)
                  .join("");

              // Agregar nuevo comentario
              addCommentBtn.addEventListener("click", () => {
                  const comment = newComment.value.trim();
                  if (comment) {
                      comments.push(comment);
                      pieceComments.innerHTML += `<li>${comment}</li>`;
                      newComment.value = "";

                      // Simular guardar comentarios (esto requiere un backend real para persistencia)
                      console.log("Comentarios actualizados:", comments);
                  }
              });
          } else {
              pieceTitle.textContent = "Piece not found";
              pieceDescription.textContent = "No information available.";
          }
      })
      .catch((error) => {
          console.error("Error al cargar la pieza:", error);
          pieceTitle.textContent = "Error loading piece";
      });
});