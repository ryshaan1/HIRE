/**
 * Process and compress an image file or blob using HTML5 Canvas.
 * Compresses to a responsive JPEG (~40KB-70KB) to ensure it stays well within
 * browser localStorage quota and broadcasts instantaneously across localhost tabs.
 */
export function processAndCompressImage(fileOrBlob, maxWidth = 960, maxHeight = 640, quality = 0.82) {
  return new Promise(function(resolve, reject) {
    if (!fileOrBlob) {
      reject(new Error("No image file provided"));
      return;
    }
    const reader = new FileReader();
    reader.onerror = function() { reject(new Error("Failed to read image file")); };
    reader.onload = function(event) {
      const img = new Image();
      img.onerror = function() { reject(new Error("Failed to decode image")); };
      img.onload = function() {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to web-friendly lightweight JPEG
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(fileOrBlob);
  });
}
