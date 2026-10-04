import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getShared, setShared, subscribeToSync, broadcastAction } from "../../utils/storage.js";
import { initialProperties } from "../../data/properties.js";
import { formatPriceInfo } from "../../utils/pricing.js";
import ImagePlaceholder from "../common/ImagePlaceholder.jsx";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [property, setProperty] = useState(function() {
    const list = getShared("hire_properties", initialProperties);
    return list.find(function(p) { return String(p.id) === String(id); }) || list[0];
  });
  const [checkIn, setCheckIn] = useState("2026-10-10");
  const [checkOut, setCheckOut] = useState("2026-10-13");
  const [guests, setGuests] = useState(2);
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
  const effPrice = priceInfo.hasDiscount ? priceInfo.discountedPrice : priceInfo.price;
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
  const baseTotal = effPrice * multiplier;
  const taxes = Math.round(baseTotal * 0.12);
  const grandTotal = baseTotal + taxes + 25;

  function handleConfirm(e) {
    e.preventDefault();
    if (!checkIn || !checkOut || new Date(checkOut) <= new Date(checkIn)) {
      setErrorMsg("Departure date must be strictly after arrival date.");
      return;
    }
    setErrorMsg("");
    const newBooking = {
      id: Date.now(),
      propertyId: property.id,
      propertyName: property.name,
      userEmail: currentUser.email,
      userName: currentUser.name || currentUser.email,
      checkIn: checkIn,
      checkOut: checkOut,
      guests: guests,
      unitCount: multiplier,
      rateUnit: priceInfo.unit,
      total: grandTotal,
      status: "Pending",
      createdAt: new Date().toISOString()
    };
    const nextBookings = [newBooking, ...getShared("hire_bookings", [])];
    setShared("hire_bookings", nextBookings);
    broadcastAction("BOOKING_CREATED", newBooking);
    setConfirmedBooking(newBooking);
  }

  return (
    <div className="hire-booking py-4" style={{ maxWidth: "780px", margin: "0 auto" }}>
      <Link to={`/property/${property.id}`} className="text-muted small text-decoration-none mb-3 d-inline-block">&larr; Back to property</Link>
      <h4 className="fw-bold text-navy mb-4">Complete your reservation</h4>

      {confirmedBooking ? (
        <div className="card shadow-sm border p-4 rounded bg-white text-center">
          <div className="badge bg-success-subtle text-success p-2 mb-2 d-inline-block">Booking Request Received</div>
          <h5 className="fw-bold text-navy mb-2">Reservation #{String(confirmedBooking.id).slice(-6)}</h5>
          <p className="text-muted small mb-4">Saved with status <span className="badge bg-warning text-dark">Pending</span> for manager confirmation.</p>
          <div className="border rounded p-3 bg-light text-start small mb-4">
            <div><strong>Dates:</strong> {confirmedBooking.checkIn} to {confirmedBooking.checkOut} ({unitLabel})</div>
            <div><strong>Party:</strong> {confirmedBooking.guests} Guests | <strong>Total:</strong> ${confirmedBooking.total}</div>
          </div>
          <button type="button" className="btn btn-teal btn-sm px-4" onClick={function() { navigate("/search"); }}>Browse More</button>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-12 col-md-7">
            <form onSubmit={handleConfirm} className="card shadow-sm border p-3 rounded bg-white">
              <h6 className="fw-bold text-navy mb-3">{isRestaurant ? "Dining Schedule" : "Trip Schedule"}</h6>
              {errorMsg && <div className="alert alert-danger py-2 px-3 small mb-3">{errorMsg}</div>}
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small text-muted">{isRestaurant ? "Reservation Date" : "Check-in"}</label>
                  <input type="date" className="form-control form-control-sm" value={checkIn} onChange={function(e) { setCheckIn(e.target.value); }} required />
                </div>
                <div className="col-6">
                  <label className="form-label small text-muted">{isRestaurant ? "End Date" : "Check-out"}</label>
                  <input type="date" className="form-control form-control-sm" value={checkOut} onChange={function(e) { setCheckOut(e.target.value); }} required />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label small text-muted">Guests / Covers</label>
                <select className="form-select form-select-sm" value={guests} onChange={function(e) { setGuests(Number(e.target.value)); }}>
                  {[1, 2, 3, 4, 5, 6, 8, 10].map(function(num) { return <option key={num} value={num}>{num} {num === 1 ? "Guest" : "Guests"}</option>; })}
                </select>
              </div>
              <button type="submit" className="btn btn-teal w-100 py-2 fw-semibold">Confirm Booking &bull; ${grandTotal}</button>
            </form>
          </div>
          <div className="col-12 col-md-5">
            <div className="card shadow-sm border p-3 rounded bg-white">
              <ImagePlaceholder height="120px" src={property.images && property.images[0]} />
              <h6 className="fw-bold text-navy mt-3 mb-1">{property.name}</h6>
              <p className="text-muted small mb-2">{property.city}, {property.country}</p>
              <hr className="my-2" />
              <div className="d-flex justify-content-between small text-secondary py-1">
                <span>${effPrice} &times; {unitLabel}</span>
                <span>${baseTotal}</span>
              </div>
              <div className="d-flex justify-content-between small text-secondary py-1">
                <span>Taxes &amp; Service (12%)</span>
                <span>${taxes}</span>
              </div>
              <div className="d-flex justify-content-between small text-secondary py-1">
                <span>Platform Reservation Fee</span>
                <span>$25</span>
              </div>
              <hr className="my-2" />
              <div className="d-flex justify-content-between fw-bold text-navy pt-1">
                <span>Total Due</span>
                <span className="text-teal fs-5">${grandTotal}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
