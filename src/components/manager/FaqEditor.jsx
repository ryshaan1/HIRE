import { useState } from "react";

export default function FaqEditor({ faqs = [], onChange }) {
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [limitMsg, setLimitMsg] = useState("");

  function handleAdd(e) {
    e.preventDefault();
    if (faqs.length >= 6) {
      setLimitMsg("Limit reached: Maximum 6 FAQs allowed per property.");
      setTimeout(function() { setLimitMsg(""); }, 3500);
      return;
    }
    if (!newQuestion.trim() || !newAnswer.trim()) {
      return;
    }
    const newItem = {
      id: Date.now(),
      question: newQuestion.trim(),
      answer: newAnswer.trim()
    };
    onChange([...faqs, newItem]);
    setNewQuestion("");
    setNewAnswer("");
    setLimitMsg("");
  }

  function handleUpdate(id, field, value) {
    const nextList = faqs.map(function(item) {
      return item.id === id ? { ...item, [field]: value } : item;
    });
    onChange(nextList);
  }

  function handleDelete(id) {
    const nextList = faqs.filter(function(item) {
      return item.id !== id;
    });
    onChange(nextList);
    setLimitMsg("");
  }

  return (
    <div className="card shadow-sm border p-3 mb-4 rounded bg-white">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <h6 className="fw-bold text-navy mb-0">Frequently Asked Questions (FAQs)</h6>
        <span className="badge bg-light text-dark border">{faqs.length} / 6 Max</span>
      </div>
      <p className="text-muted small mb-3">Review, edit, add, or remove property FAQs displayed in the guest accordion.</p>

      {limitMsg && <div className="alert alert-warning py-2 px-3 small mb-3">{limitMsg}</div>}

      <div className="mb-4">
        {faqs.map(function(item, idx) {
          return (
            <div key={item.id || idx} className="border rounded p-2 mb-2 bg-light">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small fw-bold text-teal">FAQ #{idx + 1}</span>
                <button type="button" className="btn btn-outline-danger btn-sm py-0 px-2" onClick={function() { handleDelete(item.id); }}>Delete</button>
              </div>
              <input type="text" className="form-control form-control-sm mb-1 fw-semibold" value={item.question} onChange={function(e) { handleUpdate(item.id, "question", e.target.value); }} />
              <textarea className="form-control form-control-sm small" rows="2" value={item.answer} onChange={function(e) { handleUpdate(item.id, "answer", e.target.value); }}></textarea>
            </div>
          );
        })}
      </div>

      <div className="border-top pt-3">
        <span className="small fw-bold text-navy d-block mb-2">Add New FAQ</span>
        <div className="mb-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Question title..."
            value={newQuestion}
            onChange={function(e) { setNewQuestion(e.target.value); }}
            disabled={faqs.length >= 6}
            onKeyDown={function(e) { if (e.key === "Enter") { e.preventDefault(); handleAdd(e); } }}
          />
        </div>
        <div className="mb-2">
          <textarea
            className="form-control form-control-sm"
            rows="2"
            placeholder="Detailed answer for guests..."
            value={newAnswer}
            onChange={function(e) { setNewAnswer(e.target.value); }}
            disabled={faqs.length >= 6}
          ></textarea>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-outline-teal"
          disabled={faqs.length >= 6}
          onClick={handleAdd}
        >
          {faqs.length >= 6 ? "FAQ Limit Reached (6/6)" : "+ Add FAQ"}
        </button>
      </div>
    </div>
  );
}
