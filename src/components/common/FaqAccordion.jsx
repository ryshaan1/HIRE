import { useState } from "react";

export default function FaqAccordion({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(0);

  function toggleIndex(idx) {
    setOpenIndex(openIndex === idx ? null : idx);
  }

  if (!faqs || faqs.length === 0) {
    return (
      <div className="alert alert-light border text-muted small p-3">
        No frequently asked questions available for this property.
      </div>
    );
  }

  return (
    <div className="accordion" id="propertyFaqAccordion">
      {faqs.map(function(item, idx) {
        const isOpen = openIndex === idx;
        return (
          <div className="accordion-item border mb-2 rounded" key={item.id || idx}>
            <h2 className="accordion-header">
              <button
                className={`accordion-button small fw-semibold ${isOpen ? "" : "collapsed"}`}
                type="button"
                onClick={function() { toggleIndex(idx); }}
                style={{
                  backgroundColor: isOpen ? "#f0fdfa" : "#ffffff",
                  color: isOpen ? "#0f8f84" : "#1e293b",
                  boxShadow: "none"
                }}
              >
                {item.question}
              </button>
            </h2>
            {isOpen && (
              <div className="accordion-collapse collapse show">
                <div className="accordion-body small text-secondary py-3">
                  {item.answer}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
