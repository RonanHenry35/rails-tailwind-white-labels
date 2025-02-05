import { Controller } from "@hotwired/stimulus";
import { Html5Qrcode } from "html5-qrcode"

export default class extends Controller {
  /**
   * Instance du Html5Qrcode
   */
  #qrCodeReader = new Html5Qrcode("qrcode-view");

  /**
   * Targets du controller.
   */
  static targets = ["file", "value"];

  /**
   * Méthode appelée lorsque le controller est connecté au DOM.
   */
  connect() {
    this.fileTarget.addEventListener("change", this.#handleFileChanged);
  }

  /**
   * Déclenchement de la sélection d'une image.
   */
  selectFile = async () => {
    // On s'assure que le scan par caméra n'est pas actif en même temps
    await this.#stopCameraScan();

    this.#updateValue(null);
    this.fileTarget.click();
  };

  /**
   * Démarrage du scan par caméra. Sur téléphone, la caméra à l'arrière est choisie (facingMode: environment).
   */
  startCameraScan = () => {
    this.#updateValue(null);

    const config = {
      fps: 10,
      qrbox: {
        width: 250,
        height: 250,
      },
    };

    this.#qrCodeReader.start({ facingMode: "environment" }, config, this.#handleCameraQrCode)
      .then(() => {
        // Scroll automatique une fois que la caméra est prête à scanner
        this.element.scrollIntoView({ behavior: "smooth", block: "center" });
      })
      .catch((error) => {
        // Traitement si le scan par caméra n'a pas pu être démarré
      });
  };

  /**
   * Déclenchement du scan de l'image sélectionnée et décodage du QR code.
   * @param {Event} e événement change de l'input contenant l'image sélectionnée
   */
  #handleFileChanged = (e) => {
    // Vérification qu'une image a été sélectionnée
    if (e.target.files.length === 0) return;

    this.#qrCodeReader.scanFile(e.target.files[0], true)
      .then((decodedText) => {
        this.#updateValue(decodedText);
      })
      .catch((error) => {
        // Traitement si aucun QR code n'a été décodé
        this.#updateValue(null);
      });
  };

  /**
   * Arrêt du scan par caméra s'il est actif.
   */
  #stopCameraScan = () => new Promise(async (resolve) => {
    if (this.#qrCodeReader.isScanning) {
      await this.#qrCodeReader.stop();
    }

    resolve();
  });

  /**
   * Callback appelé lorsqu'un QR code a été scanné avec succès par la caméra.
   * @param {String} decodedText la valeur du QR code
   * @param {Object} decodedResult un objet contenant des infos à propos du QR code scanné
   */
  #handleCameraQrCode = (decodedText, _decodedResult) => {
    this.#updateValue(decodedText);
  }

  /**
   * Mise à jour de la valeur et de son rendu dans l'UI.
   */
  #updateValue = (newValue) => {
    // Nettoyage du canvas et de l'input fichier si aucune valeur
    if (!newValue) {
      this.#qrCodeReader.clear();
      this.fileTarget.value = "";
    }

    // Mise à jour dans l'UI et scroll automatique
    this.valueTarget.textContent = newValue || "";
    this.element.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
