import { useState, useRef, useEffect, useCallback } from "react";
import { processAndCompressImage } from "../../utils/imageCompressor.js";

export default function PhotoUploader({ photos = [], onPhotosChange, disabled = false, maxPhotos = 4 }) {
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleAddImageBlob = useCallback(async function(blob, sourceLabel = "photo") {
    if (photos.length >= maxPhotos) {
      setErrorMsg(`Maximum ${maxPhotos} photos allowed. Please remove an existing photo first.`);
      return;
    }
    setIsProcessing(true);
    setErrorMsg("");
    try {
      const compressed = await processAndCompressImage(blob);
      onPhotosChange([...photos, compressed]);
      setSuccessMsg(`Added ${sourceLabel} successfully! Saved and synchronized.`);
      setTimeout(function() { setSuccessMsg(""); }, 4000);
    } catch (err) {
      setErrorMsg(err.message || "Failed to process image.");
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [photos, maxPhotos, onPhotosChange]);

  function handleFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Only image files (PNG, JPG, WebP) are supported.");
      return;
    }
    handleAddImageBlob(file, file.name || "uploaded image");
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleAddImageBlob(file, file.name || "dropped image");
    } else {
      setErrorMsg("Please drop a valid image file.");
    }
  }

  // Listen to global paste on the manager page
  useEffect(function() {
    function handlePasteEvent(e) {
      if (disabled || photos.length >= maxPhotos) return;
      const items = (e.clipboardData || window.clipboardData)?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            e.preventDefault();
            handleAddImageBlob(blob, "pasted image from clipboard");
            break;
          }
        }
      }
    }

    window.addEventListener("paste", handlePasteEvent);
    return function() {
      window.removeEventListener("paste", handlePasteEvent);
    };
  }, [photos, disabled, maxPhotos, handleAddImageBlob]);

  async function handleClipboardPasteClick() {
    if (disabled) return;
    if (photos.length >= maxPhotos) {
      setErrorMsg(`Maximum ${maxPhotos} photos allowed. Please remove one to paste another.`);
      return;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const clipboardItems = await navigator.clipboard.read();
        for (const item of clipboardItems) {
          const imageType = item.types.find(function(t) { return t.startsWith("image/"); });
          if (imageType) {
            const blob = await item.getType(imageType);
            handleAddImageBlob(blob, "clipboard image");
            return;
          }
        }
      }
    } catch {
      // Browser permission prompt or unsupported API
    }

    // Friendly prompt fallback
    setSuccessMsg("Please press Ctrl+V on your keyboard now to paste your copied image!");
    setTimeout(function() { setSuccessMsg(""); }, 4000);
  }

  function removePhoto(indexToRemove) {
    const next = photos.filter(function(_, idx) {
      return idx !== indexToRemove;
    });
    setErrorMsg("");
    onPhotosChange(next);
  }

  return (
    <div className="card shadow-sm border p-3 mb-4 rounded bg-white" tabIndex={0}>
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <h6 className="fw-bold text-navy mb-0">Venue Photos (Max {maxPhotos})</h6>
        <span className="badge bg-light text-muted border">
          {photos.length} / {maxPhotos} uploaded
        </span>
      </div>
      <p className="text-muted small mb-3">
        Choose an image file from your PC, drag &amp; drop it below, or copy an image and press <kbd>Ctrl+V</kbd> to paste directly.
      </p>

      {errorMsg && (
        <div className="alert alert-warning py-2 px-3 small mb-3">
          ⚠️ {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="alert alert-success py-2 px-3 small mb-3">
          ✓ {successMsg}
        </div>
      )}
      {isProcessing && (
        <div className="alert alert-info py-2 px-3 small mb-3 d-flex align-items-center gap-2">
          <div className="spinner-border spinner-border-sm" role="status"></div>
          <span>Optimizing and compressing image for instant cross-tab sync...</span>
        </div>
      )}

      {/* Drag & Drop Zone and Buttons */}
      <div
        className={`border-2 border-dashed rounded p-3 mb-3 text-center transition ${
          isDragging ? "border-teal bg-teal-subtle" : "border-secondary-subtle bg-light"
        } ${disabled ? "opacity-50" : ""}`}
        onDragOver={function(e) { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={function() { setIsDragging(false); }}
        onDrop={handleDrop}
        style={{ cursor: disabled ? "not-allowed" : "pointer" }}
        onClick={function() { if (!disabled && fileInputRef.current && photos.length < maxPhotos) fileInputRef.current.click(); }}
      >
        <div className="mb-2 fs-3 text-muted">📷</div>
        <p className="small fw-semibold text-navy mb-1">
          {photos.length >= maxPhotos
            ? `Photo upload limit reached (${maxPhotos} photos max)`
            : "Click to browse from PC or drag & drop photo here"}
        </p>
        <span className="text-muted small d-block mb-3">Supports JPG, PNG, WebP (Automatically optimized for fast loading)</span>

        <div className="d-flex justify-content-center gap-2 flex-wrap" onClick={function(e) { e.stopPropagation(); }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="d-none"
            disabled={disabled || photos.length >= maxPhotos}
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="btn btn-sm btn-outline-teal"
            disabled={disabled || photos.length >= maxPhotos}
            onClick={function() { if (fileInputRef.current) fileInputRef.current.click(); }}
          >
            📁 Choose File from PC
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            disabled={disabled || photos.length >= maxPhotos}
            onClick={handleClipboardPasteClick}
            title="Paste directly from clipboard (Ctrl+V)"
          >
            📋 Paste from Clipboard (Ctrl+V)
          </button>
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div className="row g-2">
        {photos.map(function(src, idx) {
          return (
            <div className="col-6 col-sm-6" key={idx}>
              <div className="position-relative border rounded p-2 bg-light shadow-sm">
                <div style={{ height: "130px", overflow: "hidden" }} className="rounded mb-2">
                  <img
                    src={src}
                    alt={`Venue photo ${idx + 1}`}
                    className="w-100 h-100 object-fit-cover rounded"
                  />
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="badge bg-teal" style={{ fontSize: "0.7rem" }}>
                    {idx === 0 ? "Cover Photo (Cards)" : `Gallery Photo ${idx + 1}`}
                  </span>
                  {!disabled && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger py-0 px-2"
                      onClick={function() { removePhoto(idx); }}
                      title="Remove this photo"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {photos.length === 0 && (
          <div className="col-12">
            <div className="p-3 border rounded text-center text-muted small bg-light">
              No photos uploaded yet. Public cards and admin table will display &quot;No image found&quot;.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
