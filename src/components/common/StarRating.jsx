export default function StarRating({ rating = 0, max = 5, onChange, interactive = false }) {
  const stars = Array.from({ length: max }, function(_, i) { return i + 1; });

  function handleClick(val) {
    if (interactive && onChange) {
      onChange(val);
    }
  }

  return (
    <div className="d-inline-flex align-items-center gap-1">
      {stars.map(function(num) {
        const isFilled = num <= Math.round(rating);
        return (
          <span
            key={num}
            onClick={function() { handleClick(num); }}
            style={{
              cursor: interactive ? "pointer" : "default",
              color: isFilled ? "#f59e0b" : "#cbd5e1",
              fontSize: interactive ? "1.4rem" : "0.95rem",
              lineHeight: 1
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
