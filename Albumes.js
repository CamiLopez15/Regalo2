// LIBROOOO DE LUGARES
let currentPage = 1;
const totalPages = 5; // Cambia esto según la cantidad de páginas en tu libro

class FlipBook {
  constructor(bookElem) {
    this.elems = {
      book: bookElem,
      leaves: bookElem.querySelectorAll(".leaf"),
      buttons: {
        next: document.getElementById("nextPage"),
        prev: document.getElementById("prevPage")
      }
    };
    this.setupEvents();
    this.currentPagePosition = 0;
    this.turnPage(0); // Iniciar en la primera página
  }

  setPagePosition(page, position, index) {
    var transform = "";
    transform = "translate3d(0,0," + ((position < 0 ? 1 : -1) * Math.abs(index)) + "px)";

    if (position < 0) {
      transform += "rotate3d(0,1,0,-180deg)";
      page.classList.add("turned");
    } else {
      page.classList.remove("turned");
    }

    if (page.style.transform !== transform) {
      page.style.transform = transform;
    }
  }

  turnPage(delta) {
    this.currentPagePosition += delta;

    // Asegurarse de que no sobrepase los límites
    if (this.currentPagePosition < 0) {
      this.currentPagePosition = 0;
      return;
    }
    if (this.currentPagePosition > this.elems.leaves.length) {
      this.currentPagePosition = this.elems.leaves.length;
      return;
    }

    this.elems.leaves.forEach((page, index) => {
      var pageNumber = index;
      this.setPagePosition(page, pageNumber - this.currentPagePosition, index);
    });

    // Habilitar o deshabilitar botones según la página
    if (this.currentPagePosition === 0) {
      this.elems.buttons.prev.setAttribute("disabled", "disabled");
    } else if (this.currentPagePosition === this.elems.leaves.length) {
      this.elems.buttons.next.setAttribute("disabled", "disabled");
    } else {
      this.elems.buttons.next.removeAttribute("disabled");
      this.elems.buttons.prev.removeAttribute("disabled");
    }
  }

  setupEvents() {
    document.getElementById("nextPage").addEventListener("click", () => {
      this.turnPage(1);
      stopAllAudio(); // Detener todos los audios al pasar página
    });

    document.getElementById("prevPage").addEventListener("click", () => {
      this.turnPage(-1);
      stopAllAudio(); // Detener todos los audios al retroceder página
    });
  }
}

// Iniciar el libro de hojas
var flipBook = new FlipBook(document.getElementById("flipbook"));

document.addEventListener("DOMContentLoaded", function () {
    const audios = document.querySelectorAll("audio");

    // Función para detener todos los audios menos el que se está reproduciendo
    function stopAllAudio(except) {
        audios.forEach(audio => {
            if (audio !== except) {
                audio.pause();
                audio.currentTime = 0;  // Reiniciar el audio
            }
        });
    }

    // Escuchar el evento "play" en cada audio
    audios.forEach(audio => {
        audio.addEventListener("play", function () {
            stopAllAudio(this);  // Detener todos los demás audios cuando uno se reproduce
        });
    });

    // Detener todos los audios cuando se navega entre páginas
    document.getElementById("nextPage").addEventListener("click", function () {
        stopAllAudio();  // Detener todos los audios al pasar página
    });

    document.getElementById("prevPage").addEventListener("click", function () {
        stopAllAudio();  // Detener todos los audios al retroceder página
    });
});