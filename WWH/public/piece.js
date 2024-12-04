document.addEventListener("DOMContentLoaded", () => {
    // Traducciones para los encabezados
    const translations = {
      en: {
        introduction: "Introduction",
        multimedia: "Multimedia",
        comments: "Comments",
      },
      es: {
        introduction: "Introducción",
        multimedia: "Multimedia",
        comments: "Comentarios",
      },
      fr: {
        introduction: "Introduction",
        multimedia: "Multimédia",
        comments: "Commentaires",
      },
    };
  
    // Obtener parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang") || "en";
    const pieceId = params.get("id");
  
    // Elementos de la página
    const pieceTitle = document.getElementById("piece-title");
    const pieceDate = document.getElementById("piece-date");
    const pieceDescription = document.getElementById("piece-description");
    const pieceMultimedia = document.getElementById("piece-multimedia");
    const pieceComments = document.getElementById("piece-comments");
    const introductionTitle = document.getElementById("introduction-title");
    const multimediaTitle = document.getElementById("multimedia-title");
    const commentsTitle = document.getElementById("comments-title");
    const newComment = document.getElementById("new-comment");
    const addCommentBtn = document.getElementById("add-comment-btn");
  
    // Actualizar textos de los encabezados según el idioma
    introductionTitle.textContent = translations[lang].introduction;
    multimediaTitle.textContent = translations[lang].multimedia;
    commentsTitle.textContent = translations[lang].comments;
  
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
  
          // Cargar multimedia (video o juego)
          if (piece.video && piece.video !== "nan") {
            pieceMultimedia.innerHTML = `<video controls><source src="media/${piece.video}" type="video/mp4">Your browser does not support the video tag.</video>`;
          } else if (piece.game && piece.game !== "nan") {
            pieceMultimedia.innerHTML = `<a href="${piece.game}" target="_blank">Play Game</a>`;
          } else {
            pieceMultimedia.textContent = "No multimedia available.";
          }
  
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