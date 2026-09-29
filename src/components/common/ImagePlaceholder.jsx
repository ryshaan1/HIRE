export default function ImagePlaceholder({ height = "180px", text = "No image found", className = "", src }) {
  if (src) {
    return (
      <img
        src={src}
        alt={text}
        className={`img-fluid object-fit-cover rounded ${className}`}
        style={{ width: "100%", height }}
      />
    );
  }

  return (
    <div
      className={`d-flex align-items-center justify-content-center bg-light text-secondary rounded border ${className}`}
      style={{
        width: "100%",
        height,
        backgroundColor: "#eef2f5",
        fontSize: "0.85rem",
        fontWeight: "500",
        letterSpacing: "0.3px",
        userSelect: "none"
      }}
    >
      <span>{text}</span>
    </div>
  );
}
