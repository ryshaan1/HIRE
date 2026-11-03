import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getShared, setShared, subscribeToSync, broadcastAction } from "../../utils/storage.js";
import { initialProperties } from "../../data/properties.js";
import { formatPriceInfo, getCurrencyForCountry, getVenueRules, getSelectedCurrency } from "../../utils/pricing.js";
import { getVenueCulture } from "../../utils/culture.js";
import ImagePlaceholder from "../common/ImagePlaceholder.jsx";
import { createBooking } from "../../services/api.js";

function detectCardBrand(number) {
  const cleaned = String(number || "").replace(/[\s-]/g, "");
  if (!cleaned) return "Card";
  if (/^4/.test(cleaned)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(cleaned)) return "Mastercard";
  if (/^3[47]/.test(cleaned)) return "American Express";
  if (/^(6011|65)/.test(cleaned)) return "Discover";
  if (/^(60|65|81|82)/.test(cleaned)) return "RuPay";
  if (/^35/.test(cleaned)) return "JCB";
  return "Credit/Debit Card";
}

function formatCardNumber(value) {
  const v = String(value || "").replace(/\D/g, "").slice(0, 16);
  const parts = [];
  for (let i = 0; i < v.length; i += 4) {
    parts.push(v.slice(i, i + 4));
  }
  return parts.join(" ");
}

function formatExpiryDate(value) {
  const v = String(value || "").replace(/\D/g, "").slice(0, 4);
  if (v.length >= 3) {
    return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
  }
  return v;
}

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
  const [roomType, setRoomType] = useState("Deluxe Suite");
  const [foodPreorder, setFoodPreorder] = useState("Order à la carte at venue as per mood");
  const [step, setStep] = useState(1);
  const [rulesAgreed, setRulesAgreed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState(currentUser ? currentUser.name || "" : "");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

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

  const priceInfo = formatPriceInfo(property, getSelectedCurrency());
  const effPriceUSD = priceInfo.hasDiscount ? priceInfo.discountedPrice : priceInfo.price;
  const isRestaurant = property.type && property.type.includes("Restaurant");
  const isInn = property.type && property.type.includes("Inn");

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

  const culture = getVenueCulture(property);

  const rawAdvancePercent = Number(rules.advancePercent);
  const effectiveAdvancePercent = isNaN(rawAdvancePercent) ? 50 : rawAdvancePercent;

  let advancePayableUSD = 0;
  let isStartingFee = false;
  if (effectiveAdvancePercent > 0) {
    advancePayableUSD = Math.max(15, Math.round(grandTotalUSD * (effectiveAdvancePercent / 100)));
  } else {
    advancePayableUSD = Math.min(25, grandTotalUSD);
    isStartingFee = true;
  }
  const advancePayableLocal = Math.round(advancePayableUSD * curr.rate);
  const balanceDueUSD = Math.max(0, grandTotalUSD - advancePayableUSD);
  const balanceDueLocal = Math.round(balanceDueUSD * curr.rate);

  const isCriticUser = currentUser && currentUser.role === "critic";
  const detectedBrand = detectCardBrand(cardNumber);

  function checkOverlapConflict(newStart, newEnd) {
    if (!currentUser) return null;
    const allBookings = getShared("hire_bookings", []);
    const userActiveBookings = allBookings.filter(function(b) {
      if (b.userEmail !== currentUser.email) return false;
      if (b.status === "Cancelled" || b.status === "Rejected" || b.status === "Cancelled by Manager" || b.status === "Refunded") return false;
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
      finalizeBooking({ brand: "Critic Escrow Voucher", last4: "8888" });
    } else {
      setStep(2);
    }
  }

  function handleRulesConfirm(e) {
    e.preventDefault();
    if (!rulesAgreed) {
      setErrorMsg("You must read and agree to all venue rules, advance deposit policies, and anti-abuse terms.");
      return;
    }
    setErrorMsg("");
    setStep(3);
  }

  function handleProcessPayment(e) {
    e.preventDefault();
    const cleanCard = cardNumber.replace(/\D/g, "");
    if (cleanCard.length < 13 || cleanCard.length > 19) {
      setErrorMsg("Please enter a valid card number (13 to 19 digits).");
      return;
    }
    if (!cardHolder.trim()) {
      setErrorMsg("Please enter the name on the card.");
      return;
    }
    if (!cardExpiry || cardExpiry.length < 5) {
      setErrorMsg("Please enter a valid expiry date (MM/YY).");
      return;
    }
    if (!cardCvv || cardCvv.length < 3) {
      setErrorMsg("Please enter a valid 3 or 4 digit CVV security code.");
      return;
    }

    setErrorMsg("");
    setIsProcessingPayment(true);

    setTimeout(function() {
      setIsProcessingPayment(false);
      finalizeBooking({
        brand: detectedBrand,
        last4: cleanCard.slice(-4)
      });
    }, 1200);
  }

  function finalizeBooking(paymentCardInfo) {
    const bookingId = Date.now();
    const cleanCardLast4 = paymentCardInfo.last4 || "4242";
    const brandName = paymentCardInfo.brand || "Credit Card";

    const newBooking = {
      id: bookingId,
      propertyId: property.id,
      propertyName: property.name,
      propertyCity: property.city,
      propertyCountry: property.country,
      userEmail: currentUser ? currentUser.email : "guest@hire.com",
      userName: isCriticUser ? (currentUser.name || "Verified Critic") : (currentUser ? currentUser.name : cardHolder || "Guest"),
      isCritic: Boolean(isCriticUser),
      checkIn: checkIn,
      checkOut: checkOut,
      guests: guests,
      roomType: roomType,
      foodPreorder: foodPreorder,
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
      paymentMethod: isCriticUser ? "Critic Official Ledger" : `Card Deposit (${brandName} ••••${cleanCardLast4})`,
      cardBrand: brandName,
      cardLast4: cleanCardLast4,
      advancePercent: effectiveAdvancePercent,
      isStartingFee: isStartingFee,
      status: "Payment Received",
      managerDirectives: "",
      rescheduleProposal: null,
      foodEaten: foodPreorder,
      createdAt: new Date().toISOString()
    };

    const nextBookings = [newBooking, ...getShared("hire_bookings", [])];
    setShared("hire_bookings", nextBookings);
    broadcastAction("BOOKING_CREATED", newBooking);
    setConfirmedBooking(newBooking);

    try {
      createBooking({
        customerName: newBooking.userName,
        customerEmail: newBooking.userEmail,
        hotelId: String(property.id),
        hotelName: property.name,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfGuests: guests,
        totalPrice: localGrandTotal,
        currency: curr.code,
        roomType: roomType,
        foodPreorder: foodPreorder,
        advancePaid: advancePayableLocal,
        advancePaidUSD: advancePayableUSD,
        balanceDue: balanceDueLocal,
        balanceDueUSD: balanceDueUSD,
        cardBrand: brandName,
        cardLast4: cleanCardLast4,
        paymentMethod: newBooking.paymentMethod,
        status: "Payment Received"
      });
    } catch (err) {}
  }

  if (confirmedBooking) {
    return (
      <div className="hire-booking-confirmation py-4" style={{ maxWidth: "680px", margin: "0 auto" }}>
        <div className="card shadow border rounded bg-white p-4">
          <div className="text-center mb-4">
            <div className="badge bg-success-subtle text-success fs-6 px-3 py-2 rounded-pill mb-2">
              ✓ Pre-booking Advance Payment Received
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
              <div className="col-6"><strong>Selected Room/Table:</strong> {confirmedBooking.roomType}</div>
              <div className="col-6"><strong>Food Pre-order:</strong> {confirmedBooking.foodPreorder}</div>
              <div className="col-6"><strong>Headcount:</strong> {confirmedBooking.guests} Guests</div>
              <div className="col-6"><strong>Payment Instrument:</strong> {confirmedBooking.paymentMethod}</div>
            </div>
          </div>

          <div className="card border mb-3">
            <div className="card-header bg-white py-2 fw-semibold text-navy small">Itemized Billing Breakdown</div>
            <div className="card-body p-3">
              <div className="d-flex justify-content-between small mb-2">
                <span className="text-secondary">Base Rate ({unitLabel}):</span>
                <span className="fw-semibold">{curr.symbol} {localBaseTotal.toLocaleString()} (${baseTotalUSD} USD)</span>
              </div>
              <div className="d-flex justify-content-between small mb-2">
                <span className="text-secondary">Local Tourism &amp; Occupancy Tax (12%):</span>
                <span className="fw-semibold">{curr.symbol} {localTaxes.toLocaleString()} (${taxesUSD} USD)</span>
              </div>
              <hr className="my-2" />
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-bold text-navy">Total Billable Amount:</span>
                <span className="fw-bold text-teal fs-6">{curr.symbol} {localGrandTotal.toLocaleString()} (${grandTotalUSD} USD)</span>
              </div>
              <div className="d-flex justify-content-between small text-success mb-1 fw-semibold">
                <span>Advance Fee Paid Now:</span>
                <span>{curr.symbol} {advancePayableLocal.toLocaleString()} (${advancePayableUSD} USD)</span>
              </div>
              <div className="d-flex justify-content-between small text-muted">
                <span>Remaining Balance Due at Check-in:</span>
                <span>{curr.symbol} {balanceDueLocal.toLocaleString()} (${balanceDueUSD} USD)</span>
              </div>
            </div>
          </div>

          <div className="alert alert-info py-2 px-3 small mb-4">
            <strong>Check-in Directives:</strong> Please present valid identification upon arrival. Final payment settlement and any additional dining services will be finalized at the venue desk.
          </div>

          <div className="d-flex gap-2 justify-content-center">
            <Link to="/user-dashboard" className="btn btn-teal px-4 fw-semibold">
              Go to My Bookings Dashboard
            </Link>
            <Link to="/search" className="btn btn-outline-secondary px-3">
              Explore More Venues
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hire-booking py-4" style={{ maxWidth: "780px", margin: "0 auto" }}>
      <div className="mb-3">
        <Link to={`/property/${property.id}`} className="text-muted small text-decoration-none">
          &larr; Back to venue details
        </Link>
      </div>

      <div className="card shadow-sm border rounded bg-white p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
          <div>
            <h4 className="fw-bold text-navy mb-0">Book Reservation</h4>
            <span className="text-muted small">{property.name} &bull; {property.city}, {property.country}</span>
          </div>
          <div className="text-end">
            <span className="fs-5 fw-bold text-teal">{priceInfo.displayPrice}</span>
            <span className="small text-muted">{priceInfo.unitDisplay}</span>
          </div>
        </div>

        <div className="d-flex p-1 bg-light rounded mb-4 gap-1 text-center small">
          <div className={`flex-grow-1 py-1 rounded fw-semibold ${step === 1 ? "bg-teal text-white shadow-sm" : "text-muted"}`}>
            1. Options &amp; Pre-order
          </div>
          <div className={`flex-grow-1 py-1 rounded fw-semibold ${step === 2 ? "bg-teal text-white shadow-sm" : "text-muted"}`}>
            2. Rules &amp; Policies
          </div>
          <div className={`flex-grow-1 py-1 rounded fw-semibold ${step === 3 ? "bg-teal text-white shadow-sm" : "text-muted"}`}>
            3. Mock Payment Gateway
          </div>
        </div>

        {errorMsg && <div className="alert alert-danger py-2 px-3 small mb-3">{errorMsg}</div>}

        {step === 1 && (
          <form onSubmit={handleProceedToRules}>
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
                <label className="form-label small text-muted">Number of Guests</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  className="form-control form-control-sm"
                  value={guests}
                  onChange={function(e) { setGuests(Math.max(1, parseInt(e.target.value, 10) || 1)); }}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small text-muted">
                  {isRestaurant ? "Seating & Table Selection" : "Room / Suite Category"}
                </label>
                <select
                  className="form-select form-select-sm"
                  value={roomType}
                  onChange={function(e) { setRoomType(e.target.value); }}
                >
                  {isRestaurant ? (
                    <>
                      <option value="Chef's Counter Experience">Chef's Counter Experience</option>
                      <option value="Panoramic Window Seating">Panoramic Window Seating</option>
                      <option value="Private Alcove Booth">Private Alcove Booth</option>
                      <option value="Outdoor Garden Terrace Table">Outdoor Garden Terrace Table</option>
                    </>
                  ) : isInn ? (
                    <>
                      <option value="Historic Hearthside Cottage Suite">Historic Hearthside Cottage Suite</option>
                      <option value="Garden Terrace Loft Room">Garden Terrace Loft Room</option>
                      <option value="Artisanal Timber Classic Room">Artisanal Timber Classic Room</option>
                    </>
                  ) : (
                    <>
                      <option value="Deluxe King Suite">Deluxe King Suite</option>
                      <option value="Executive Ocean/City View Suite">Executive Ocean/City View Suite</option>
                      <option value="Presidential Luxury Penthouse">Presidential Luxury Penthouse</option>
                      <option value="Standard Classic Double Room">Standard Classic Double Room</option>
                    </>
                  )}
                </select>
              </div>

              <div className="col-12">
                <label className="form-label small text-muted">
                  Dining &amp; Food Pre-order <span className="text-secondary">(Optional — can order later at venue as per mood)</span>
                </label>
                <select
                  className="form-select form-select-sm"
                  value={foodPreorder}
                  onChange={function(e) { setFoodPreorder(e.target.value); }}
                >
                  <option value="Order à la carte at venue as per mood">Order à la carte at venue later (as per mood)</option>
                  <option value="Pre-order Artisanal Breakfast Basket (+ $15 USD / guest)">Pre-order Artisanal Breakfast Basket (+ $15 USD / guest)</option>
                  <option value="Pre-order 3-Course Regional Welcome Dinner (+ $35 USD / guest)">Pre-order 3-Course Regional Welcome Dinner (+ $35 USD / guest)</option>
                  <option value="Pre-order Chef's Seasonal Tasting Menu (+ $50 USD / guest)">Pre-order Chef's Seasonal Tasting Menu (+ $50 USD / guest)</option>
                </select>
              </div>
            </div>

            <div className="card bg-light border p-3 rounded mb-4">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="fs-5">🎨</span>
                <span className="fw-bold text-navy small">Local Culture &amp; Heritage Highlight</span>
              </div>
              <div className="small text-secondary mb-1">
                <strong>Regional Craft:</strong> {culture.handcrafts}
              </div>
              <div className="small text-muted">
                <strong>Nearby Tourism:</strong> {culture.nearbyAttractions.join(" • ")}
              </div>
            </div>

            <div className="card border p-3 rounded mb-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted">Calculated Stay Duration:</span>
                <span className="fw-semibold small">{unitLabel}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted">Base Rate + Taxes:</span>
                <span className="fw-semibold small">{curr.symbol} {localGrandTotal.toLocaleString()} (${grandTotalUSD} USD)</span>
              </div>
              <div className="d-flex justify-content-between align-items-center border-top pt-2">
                <span className="fw-bold text-navy small">Advance Deposit Due Now:</span>
                <span className="fw-bold text-teal">{curr.symbol} {advancePayableLocal.toLocaleString()} (${advancePayableUSD} USD)</span>
              </div>
            </div>

            <button type="submit" className="btn btn-teal w-100 py-2 fw-semibold">
              {isCriticUser ? "Submit Critic Reservation Request" : "Proceed to Venue Rules & Policies &rarr;"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleRulesConfirm}>
            <div className="card bg-light border p-3 rounded mb-3">
              <h6 className="fw-bold text-navy mb-2">Mandatory Venue Rules &amp; Advance Directives</h6>
              <div className="small text-secondary mb-3">
                <div className="mb-2"><strong>Accepted Payment Modes:</strong> {rules.paymentMethod}</div>
                <div className="mb-2"><strong>Advance Payment Requirement:</strong> {rules.advancePercent}% deposit required</div>
                <div className="mb-2"><strong>Accepted Currencies:</strong> {rules.acceptedCurrencies}</div>
                <div className="mb-2"><strong>Foreign Currency Surcharge:</strong> {rules.currencySurcharge}</div>
                <div className="mb-2"><strong>Cancellation &amp; Abuse Terms:</strong> {rules.cancellationPolicy}</div>
              </div>
              {rules.customRules && rules.customRules.length > 0 && (
                <div>
                  <strong className="small text-dark d-block mb-1">House Directives:</strong>
                  <ul className="small text-muted mb-0 ps-3">
                    {rules.customRules.map(function(r, idx) {
                      return <li key={idx} className="mb-1">{r}</li>;
                    })}
                  </ul>
                </div>
              )}
            </div>

            <div className="form-check mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="rulesAgreeCheck"
                checked={rulesAgreed}
                onChange={function(e) { setRulesAgreed(e.target.checked); }}
              />
              <label className="form-check-label small" htmlFor="rulesAgreeCheck">
                I have read and agree to all venue rules, advance deposit policies, anti-abuse terms, and understand that final settlement will be calculated at the property.
              </label>
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={function() { setStep(1); }}
              >
                &larr; Back
              </button>
              <button
                type="submit"
                className="btn btn-teal flex-grow-1 py-2 fw-semibold"
              >
                Confirm Booking &amp; Proceed to Payment Gateway &rarr;
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleProcessPayment}>
            <div className="card border p-3 rounded mb-3 bg-light">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted">Reservation Total:</span>
                <span className="fw-semibold small">{curr.symbol} {localGrandTotal.toLocaleString()} (${grandTotalUSD} USD)</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="fw-bold text-navy small">Pre-Booking Advance Amount:</span>
                <span className="fw-bold text-teal fs-6">{curr.symbol} {advancePayableLocal.toLocaleString()} (${advancePayableUSD} USD)</span>
              </div>
              <div className="d-flex justify-content-between align-items-center small text-muted">
                <span>Remaining Balance Due at Venue:</span>
                <span>{curr.symbol} {balanceDueLocal.toLocaleString()} (${balanceDueUSD} USD)</span>
              </div>
            </div>

            <div className="alert alert-warning py-2 px-3 small mb-4 border border-warning shadow-sm">
              <strong>Notice:</strong> This is a secure pre-booking advance deposit fee. Advance payment verification will be completed at check-in, and your final bill balance will be settled directly at the venue desk.
            </div>

            <div className="card p-3 border rounded mb-4 bg-white shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold text-navy mb-0">Mock Payment Gateway</h6>
                <span className="badge bg-teal">{detectedBrand}</span>
              </div>

              <div className="d-flex gap-1 mb-3">
                {["Visa", "Mastercard", "American Express", "Discover", "RuPay", "JCB"].map(function(b) {
                  return (
                    <span
                      key={b}
                      className={`badge border small py-1 px-2 ${
                        detectedBrand === b ? "bg-primary text-white" : "bg-light text-muted"
                      }`}
                      style={{ fontSize: "0.68rem" }}
                    >
                      {b}
                    </span>
                  );
                })}
              </div>

              <div className="mb-3">
                <label className="form-label small text-muted">Card Number</label>
                <div className="input-group input-group-sm">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="4111 2222 3333 4444"
                    maxLength="19"
                    value={cardNumber}
                    onChange={function(e) { setCardNumber(formatCardNumber(e.target.value)); }}
                    required
                  />
                  <span className="input-group-text bg-white small text-muted">
                    {detectedBrand}
                  </span>
                </div>
                <div className="form-text small" style={{ fontSize: "0.72rem" }}>
                  Card brand is auto-detected as you type.
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small text-muted">Cardholder Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="e.g. John Doe"
                  value={cardHolder}
                  onChange={function(e) { setCardHolder(e.target.value); }}
                  required
                />
              </div>

              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small text-muted">Expiry Date</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="MM/YY"
                    maxLength="5"
                    value={cardExpiry}
                    onChange={function(e) { setCardExpiry(formatExpiryDate(e.target.value)); }}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted">CVV Security Code</label>
                  <input
                    type="password"
                    className="form-control form-control-sm"
                    placeholder="3 or 4 digits"
                    maxLength="4"
                    value={cardCvv}
                    onChange={function(e) { setCardCvv(e.target.value.replace(/\D/g, "")); }}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={function() { setStep(2); }}
                disabled={isProcessingPayment}
              >
                &larr; Back to Rules
              </button>
              <button
                type="submit"
                className="btn btn-teal flex-grow-1 py-2 fw-semibold"
                disabled={isProcessingPayment}
              >
                {isProcessingPayment
                  ? "Securing Authorization & Completing Pre-Booking..."
                  : `Pay ${curr.symbol} ${advancePayableLocal.toLocaleString()} (${advancePayableUSD} USD) & Confirm Booking`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
