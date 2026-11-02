import { useState } from "react";
import { getVenueRules } from "../../utils/pricing.js";

export default function VenueRulesEditor({ property, onSaveRules }) {
  const defaultRules = getVenueRules(property);
  const initial = (property && property.rules && property.rules.paymentMethod) ? property.rules : defaultRules;
  const [paymentMethod, setPaymentMethod] = useState(initial.paymentMethod || defaultRules.paymentMethod);
  const [advancePercent, setAdvancePercent] = useState(initial.advancePercent || 50);
  const [acceptedCurrencies, setAcceptedCurrencies] = useState(initial.acceptedCurrencies || defaultRules.acceptedCurrencies);
  const [currencySurcharge, setCurrencySurcharge] = useState(initial.currencySurcharge || defaultRules.currencySurcharge);
  const [cancellationPolicy, setCancellationPolicy] = useState(initial.cancellationPolicy || defaultRules.cancellationPolicy);
  const [customRules, setCustomRules] = useState(initial.customRules || defaultRules.customRules);
  const [newRuleText, setNewRuleText] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  function handleAddCustomRule(e) {
    e.preventDefault();
    if (!newRuleText.trim()) return;
    setCustomRules([...customRules, newRuleText.trim()]);
    setNewRuleText("");
  }

  function handleRemoveRule(index) {
    setCustomRules(customRules.filter(function(_, idx) { return idx !== index; }));
  }

  function handleSave(e) {
    e.preventDefault();
    const updatedRules = {
      paymentMethod,
      advancePercent: Number(advancePercent),
      acceptedCurrencies,
      currencySurcharge,
      cancellationPolicy,
      customRules
    };
    onSaveRules(updatedRules);
    setSaveSuccess(true);
    setTimeout(function() { setSaveSuccess(false); }, 3000);
  }

  return (
    <div className="card shadow-sm border rounded bg-white p-4 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold text-navy mb-0">Venue Booking Rules &amp; Payment Policies</h5>
        {saveSuccess && <span className="badge bg-success">Rules Saved Successfully!</span>}
      </div>
      <p className="small text-muted mb-4">
        Customize payment methods, advance deposit percentages, accepted currencies, and house rules. Guests must review and accept these rules before confirming reservations.
      </p>

      <form onSubmit={handleSave}>
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-6">
            <label className="form-label small text-muted">Accepted Payment Modes</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={paymentMethod}
              onChange={function(e) { setPaymentMethod(e.target.value); }}
              placeholder="e.g. Credit / Debit Card Only or Cash at Check-in"
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label small text-muted">Advance Deposit Requirement (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="5"
              className="form-control form-control-sm"
              value={advancePercent}
              onChange={function(e) { setAdvancePercent(e.target.value); }}
              placeholder="e.g. 50"
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label small text-muted">Settlement Currencies</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={acceptedCurrencies}
              onChange={function(e) { setAcceptedCurrencies(e.target.value); }}
              placeholder="e.g. Local Currency (BGN, INR, EUR) & USD"
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label small text-muted">Foreign Currency Surcharge</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={currencySurcharge}
              onChange={function(e) { setCurrencySurcharge(e.target.value); }}
              placeholder="e.g. 3.5% foreign currency exchange fee applies"
            />
          </div>

          <div className="col-12">
            <label className="form-label small text-muted">Cancellation &amp; Abuse Policy</label>
            <textarea
              className="form-control form-control-sm"
              rows="2"
              value={cancellationPolicy}
              onChange={function(e) { setCancellationPolicy(e.target.value); }}
            ></textarea>
            <span className="small text-muted" style={{ fontSize: "0.75rem" }}>
              Warns users against repeated booking and cancellation abuse.
            </span>
          </div>
        </div>

        <div className="card bg-light border p-3 rounded mb-4">
          <h6 className="fw-bold text-navy mb-2">Special House Rules &amp; Directives</h6>
          <div className="d-flex flex-column gap-2 mb-3">
            {customRules.map(function(rule, idx) {
              return (
                <div key={idx} className="d-flex justify-content-between align-items-center bg-white p-2 rounded border small">
                  <span>&bull; {rule}</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger py-0 px-2"
                    onClick={function() { handleRemoveRule(idx); }}
                  >
                    &times;
                  </button>
                </div>
              );
            })}
          </div>

          <div className="input-group input-group-sm">
            <input
              type="text"
              className="form-control"
              placeholder="Add another venue rule (e.g. No outside catering, Swimming pool dress code)..."
              value={newRuleText}
              onChange={function(e) { setNewRuleText(e.target.value); }}
            />
            <button
              type="button"
              className="btn btn-outline-teal"
              onClick={handleAddCustomRule}
            >
              + Add Rule
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-teal px-4 py-2 fw-semibold">
          Save Venue Rules &amp; Policies
        </button>
      </form>
    </div>
  );
}
