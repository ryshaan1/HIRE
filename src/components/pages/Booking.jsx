import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getShared, setShared, subscribeToSync, broadcastAction } from "../../utils/storage.js";
import { initialProperties } from "../../data/properties.js";
import { formatPriceInfo, getCurrencyForCountry, getVenueRules } from "../../utils/pricing.js";
import ImagePlaceholder from "../common/ImagePlaceholder.jsx";
import { createBooking } from "../../services/api.js";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [property, setProperty] = useState(function() {
    const list = getShared("hire_properties", initialProperties);
    return list.find(function(p) { return String(p.id) === String(id); }) || list[0];
  });
  const [checkIn, setCheckIn] = useState(todayStr);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guests, setGuests] = useState(2);
  const [step, setStep] = useState(1);
  const [rulesAgreed, setRulesAgreed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(function() {
    const unsubscribe = subscribeToSync(function() {
      const list = getShared("hire_properties", initialProperties);
      const found = list.find(function(p) { return String(p.id) === String(id); });
      if (found) setProperty(found);
    });

    return unsubscribe;
  }, [id]);

  if (!property) return <div className="p-4 text-center">Loading venue details...</div>;

  if (property.status === "banned") {
    return (
      <div className="card p-5 text-center my-5 bg-white border border-danger shadow-sm" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div className="text-danger fs-1 mb-2">🚫</div>
        <h5 className="fw-bold text-danger">Bookings Suspended</h5>
        <p className="text-muted small mb-3">
          <strong>{property.name}</strong> has been banned by platform administration due to: <em>{property.banReason || "Policy Violation"}</em>. Bookings and reservations are closed.
        </p>
        <Link to="/search" className="btn btn-sm btn-teal d-inline-block mx-auto">Browse Available Venues</Link>
      </div>
    );
  }

  const priceInfo = formatPriceInfo(property);
  const effPriceUSD = priceInfo.hasDiscount ? priceInfo.discountedPrice : priceInfo.price;
  const isRestaurant = property.type && property.type.includes("Restaurant");

  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const calculatedDays = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  const countUnits = calculatedDays > 0 ? calculatedDays : 1;

  const unitLabel = priceInfo.unit.includes("day")
    ? `${countUnits} day${countUnits > 1 ? "s" : ""}`
    : isRestaurant
    ? `${guests} guest${guests > 1 ? "s" : ""}`
    : `${countUnits} night${countUnits > 1 ? "s" : ""}`;

  const multiplier = isRestaurant ? guests : countUnits;
  const baseTotalUSD = effPriceUSD * multiplier;
  const taxesUSD = Math.round(baseTotalUSD * 0.12);
  const grandTotalUSD = baseTotalUSD + taxesUSD;

  const curr = getCurrencyForCountry(property.country);
  const localGrandTotal = Math.round(grandTotalUSD * curr.rate);
  const localBaseTotal = Math.round(baseTotalUSD * curr.rate);
  const localTaxes = Math.round(taxesUSD * curr.rate);

  const rules = (property.rules && property.rules.paymentMethod)
    ? property.rules
    : getVenueRules(property);

  const advancePercent = Number(rules.advancePercent) || 50;
  const advancePayableLocal = Math.round(localGrandTotal * (advancePercent / 100));
  const advancePayableUSD = Math.round(grandTotalUSD * (advancePercent / 100));
  const balanceDueLocal = localGrandTotal - advancePayableLocal;
  const balanceDueUSD = grandTotalUSD - advancePayableUSD;

  const isCriticUser = currentUser && currentUser.role === "critic";

  function checkOverlapConflict(newStart, newEnd) {
    if (!currentUser) return null;
    const allBookings = getShared("hire_bookings", []);
    const userActiveBookings = allBookings.filter(function(b) {
      if (b.userEmail !== currentUser.email) return false;
      if (b.status === "Cancelled" || b.status === "Rejected" || b.status === "Cancelled by Manager") return false;
      return String(b.propertyId) !== String(property.id);
    });

    for (let i = 0; i < userActiveBookings.length; i++) {
      const existing = userActiveBookings[i];
      if (newStart < existing.checkOut && newEnd > existing.checkIn) {
        return existing;
      }
    }
    return null;
  }

  function handleProceedToRules(e) {
    e.preventDefault();
    if (!checkIn || checkIn < todayStr) {
      setErrorMsg("Check-in date cannot be in the past. Please select today or a future date.");
      return;
    }
    if (!checkOut || checkOut <= checkIn) {
      setErrorMsg("Departure date must be strictly after arrival date.");
      return;
    }

    const conflict = checkOverlapConflict(checkIn, checkOut);
    if (conflict) {
      setErrorMsg(`Booking Conflict: You already have an active reservation at "${conflict.propertyName}" from ${conflict.checkIn} to ${conflict.checkOut}. Concurrent bookings across multiple locations for overlapping dates are prohibited.`);
      return;
    }

    setErrorMsg("");

    if (isCriticUser) {
      submitBookingRequest();
    } else {
      setStep(2);
    }
  }

  function submitBookingRequest() {
    const conflict = checkOverlapConflict(checkIn, checkOut);
    if (conflict) {
      setErrorMsg(`Booking Conflict: You already have an active reservation at "${conflict.propertyName}" from ${conflict.checkIn} to ${conflict.checkOut}.`);
      return;
    }

    const bookingId = Date.now();
    const newBooking = {
      id: bookingId,
      propertyId: property.id,
      propertyName: property.name,
      propertyCity: property.city,
      propertyCountry: property.country,
      userEmail: currentUser.email,
      userName: isCriticUser ? (currentUser.name || "Verified Guest") : (currentUser.name || currentUser.email),
      isCritic: Boolean(isCriticUser),
      checkIn: checkIn,
      checkOut: checkOut,
      guests: guests,
      unitCount: multiplier,
      rateUnit: priceInfo.unit,
      currencyCode: curr.code,
      currencySymbol: curr.symbol,
      localTotal: localGrandTotal,
      usdTotal: grandTotalUSD,
      advancePaid: advancePayableLocal,
      advancePaidUSD: advancePayableUSD,
      balanceDue: balanceDueLocal,
      balanceDueUSD: balanceDueUSD,
      paymentMethod: rules.paymentMethod,
      advancePercent: advancePercent,
      status: "Pending Approval",
      managerDirectives: "",
      rescheduleProposal: null,
      foodEaten: isRestaurant ? `${guests} Guest Dinner Menu` : "Continental Stay Buffet",
      createdAt: new Date().toISOString()
    };

    const nextBookings = [newBooking, ...getShared("hire_bookings", [])];
    setShared("hire_bookings", nextBookings);
    broadcastAction("BOOKING_CREATED", newBooking);
    setConfirmedBooking(newBooking);

    try {
      createBooking({
        customerName: newBooking.userName,
        customerEmail: currentUser.email,
        hotelId: String(property.id),
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfGuests: guests,
        totalPrice: localGrandTotal,
        status: "Pending Approval"
      });
    } catch (err) {}
  }

  function handleRulesConfirm(e) {
    e.preventDefault();
    if (!rulesAgreed) {
      setErrorMsg("You must read and agree to all venue rules, advance payment terms, and anti-abuse policies.");
      return;
    }
    setErrorMsg("");
    submitBookingRequest();
  }

  if (confirmedBooking) {
    return (
      <div className="hire-booking-confirmation py-4" style={{ maxWidth: "680px", margin: "0 auto" }}>
        <div className="card shadow border rounded bg-white p-4">
          <div className="text-center mb-4">
            <div className="badge bg-success-subtle text-success fs-6 px-3 py-2 rounded-pill mb-2">
              Booking Request Submitted to Venue Manager
            </div>
            <h4 className="fw-bold text-navy mb-1">Commercial Reservation Receipt</h4>
            <p className="text-muted small">Reference #{String(confirmedBooking.id).slice(-8)} &bull; {new Date(confirmedBooking.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="border rounded p-3 mb-3 bg-light">
            <div className="row g-2 small">
              <div className="col-6"><strong>Venue:</strong> {confirmedBooking.propertyName}</div>
              <div className="col-6"><strong>Location:</strong> {confirmedBooking.propertyCity}, {confirmedBooking.propertyCountry}</div>
              <div className="col-6"><strong>Check-In:</strong> {confirmedBooking.checkIn}</div>
              <div className="col-6"><strong>Check-Out:</strong> {confirmedBooking.checkOut}</div>
              <div className="col-6"><strong>Headcount:</strong> {confirmedBooking.guests} Guests ({confirmedBooking.unitCount} {confirmedBooking.rateUnit})</div>
              <div className="col-6"><strong>Guest Name:</strong> {confirmedBooking.userName}</div>
            </div>
          </div>

          <div className="card border mb-3">
            <div className="card-header bg-white py-2 fw-semibold text-navy small">Itemized Billing Breakdown</div>
            <div className="card-body p-3">
              <div className="d-flex justify-content-between small mb-2">
                <span className="text-secondary">Base Rate ({unitLabel}):</span>
                <span className="fw-semibold">{curr.symbol} {localBaseTotal.toLocaleString()} (~${baseTotalUSD} USD)</span>
              </div>
              <div className="d-flex justify-content-between small mb-2">
                <span className="text-secondary">Local Tourism & Occupancy Tax (12%):</span>
                <span className="fw-semibold">{curr.symbol} {localTaxes.toLocaleString()} (~${taxesUSD} USD)</span>
              </div>
              <hr className="my-2" />
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-bold text-navy">Total Billable Amount:</span>
                <span className="fw-bold text-teal fs-6">{curr.symbol} {localGrandTotal.toLocaleString()} (~${grandTotalUSD} USD)</span>
              </div>
              <div className="d-flex justify-content-between small text-muted mb-1">
                <span>Advance Required ({advancePercent}%):</span>
                <span>{curr.symbol} {advancePayableLocal.toLocaleString()} (~${advancePayableUSD} USD)</span>
              </div>
              <div className="d-flex justify-content-between small text-muted">
                <span>Balance Due at Check-in:</span>
                <span>{curr.symbol} {balanceDueLocal.toLocaleString()} (~${balanceDueUSD} USD)</span>
              </div>
            </div>
          </div>

          <div className="alert alert-info py-2 px-3 small mb-4">
            <strong>Current Request Status:</strong> <span className="badge bg-warning text-dark ms-1">Pending Approval</span>
            <div className="mt-1">
              Your request has been forwarded directly to the venue manager. The manager can approve, cancel, or propose a reschedule. Track live updates on your dashboard.
            </div>
          </div>

          <div className="d-flex gap-2">
            <Link to="/user-dashboard" className="btn btn-teal flex-grow-1 fw-semibold py-2">
              View My Bookings & Live Status
            </Link>
            <Link to="/search" className="btn btn-outline-secondary px-3 py-2">
              Browse More
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hire-booking py-4" style={{ maxWidth: "780px", margin: "0 auto" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to={`/property/${property.id}`} className="text-muted small text-decoration-none">&larr; Back to venue</Link>
        <span className="small text-muted">{step === 1 ? "Step 1 of 2: Dates & Headcount" : "Step 2 of 2: Rules & Agreement"}</span>
      </div>

      <div className="card shadow-sm border rounded bg-white p-4">
        <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
          <div style={{ width: "110px", height: "75px" }}>
            <ImagePlaceholder height="75px" src={Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : property.image} />
          </div>
          <div>
            <span className="badge bg-teal mb-1">{property.type}</span>
            <h5 className="fw-bold text-navy mb-0">{property.name}</h5>
            <span className="text-muted small">{property.city}, {property.country} &bull; {priceInfo.displayPrice} {priceInfo.unitDisplay}</span>
          </div>
        </div>

        {errorMsg && <div className="alert alert-danger py-2 px-3 small mb-3">{errorMsg}</div>}

        {step === 1 ? (
          <form onSubmit={handleProceedToRules}>
            <h6 className="fw-bold text-navy mb-3">Reservation Dates & Headcount</h6>
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <label className="form-label small text-muted">Check-In / Arrival Date</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  min={todayStr}
                  value={checkIn}
                  onChange={function(e) { setCheckIn(e.target.value); }}
                  required
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label small text-muted">Check-Out / Departure Date</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  min={checkIn || todayStr}
                  value={checkOut}
                  onChange={function(e) { setCheckOut(e.target.value); }}
                  required
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label small text-muted">{isRestaurant ? "Dining Table Guests" : "Room Guests"}</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  className="form-control form-control-sm"
                  value={guests}
                  onChange={function(e) { setGuests(Math.max(1, Number(e.target.value))); }}
                  required
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label small text-muted">Settlement Currency</label>
                <div className="form-control form-control-sm bg-light text-muted">
                  {curr.code} ({curr.symbol}) &bull; Equivalent to USD in calculations
                </div>
              </div>
            </div>

            <div className="card bg-light border p-3 rounded mb-4">
              <div className="d-flex justify-content-between small mb-1">
                <span className="text-secondary">Base Rate ({unitLabel}):</span>
                <span className="fw-semibold">{curr.symbol} {localBaseTotal.toLocaleString()} (~${baseTotalUSD} USD)</span>
              </div>
              <div className="d-flex justify-content-between small mb-1">
                <span className="text-secondary">Taxes & Fees (12%):</span>
                <span className="fw-semibold">{curr.symbol} {localTaxes.toLocaleString()} (~${taxesUSD} USD)</span>
              </div>
              <hr className="my-2" />
              <div className="d-flex justify-content-between">
                <span className="fw-bold text-navy">Estimated Grand Total:</span>
                <span className="fw-bold text-teal">{curr.symbol} {localGrandTotal.toLocaleString()} (~${grandTotalUSD} USD)</span>
              </div>
            </div>

            <button type="submit" className="btn btn-teal w-100 py-2 fw-semibold">
              {isCriticUser ? "Submit Critic Reservation Request" : "Proceed to Venue Rules & Policy Agreement"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRulesConfirm}>
            <div className="alert alert-warning py-2 px-3 small mb-3">
              <strong>Mandatory Compliance Notice:</strong> Review the venue payment policies, advance schedules, and anti-abuse cancellation rules below before confirming your reservation.
            </div>

            <div className="card border p-3 rounded mb-3 bg-light">
              <h6 className="fw-bold text-navy mb-2">Venue Rules & Payment Terms</h6>
              <div className="small text-secondary mb-2">
                <div className="mb-2"><strong>1. Payment Methods:</strong> {rules.paymentMethod}</div>
                <div className="mb-2"><strong>2. Accepted Currencies:</strong> {rules.acceptedCurrencies} (Settlement in alternative currencies includes a {rules.currencySurcharge || "3.5% fee"}).</div>
                <div className="mb-2"><strong>3. Advance Payment:</strong> {advancePercent}% in advance required ({curr.symbol} {advancePayableLocal.toLocaleString()} / ~${advancePayableUSD} USD). Remaining balance due at check-in.</div>
                <div className="mb-2"><strong>4. Cancellation & Abuse Protocol:</strong> {rules.cancellationPolicy} Repeated bookings and cancellations across venues will trigger immediate user account suspension and forfeiture of advance deposits.</div>
              </div>
              {rules.customRules && rules.customRules.length > 0 && (
                <div className="mt-2 pt-2 border-top">
                  <strong className="small text-dark d-block mb-1">Special Venue Directives:</strong>
                  <ul className="small text-muted mb-0 ps-3">
                    {rules.customRules.map(function(r, idx) {
                      return <li key={idx}>{r}</li>;
                    })}
                  </ul>
                </div>
              )}
            </div>

            <div className="form-check mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="agreeRulesCheck"
                checked={rulesAgreed}
                onChange={function(e) { setRulesAgreed(e.target.checked); }}
              />
              <label className="form-check-label small text-dark" htmlFor="agreeRulesCheck">
                I have read, understood, and agree to abide by all venue rules, advance payment terms, and anti-abuse policies.
              </label>
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary px-3 py-2"
                onClick={function() { setStep(1); }}
              >
                Back to Dates
              </button>
              <button
                type="submit"
                className="btn btn-teal flex-grow-1 py-2 fw-semibold"
                disabled={!rulesAgreed}
              >
                Confirm &amp; Submit Booking Request to Manager
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
