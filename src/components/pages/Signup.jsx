import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getShared, setShared } from "../../utils/storage.js";
import { isValidEmail } from "../../utils/validators.js";
import { hotelFaqs } from "../../data/defaultFaqs.js";

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [hotelName, setHotelName] = useState("");
  const [hotelType, setHotelType] = useState("Hotel");
  const [hotelCity, setHotelCity] = useState("");
  const [hotelCountry, setHotelCountry] = useState("");
  const [licenceNumber, setLicenceNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !isValidEmail(email)) { setErrorMsg("Please provide valid name and email."); return; }
    if (role === "customer" && (!password || password.length < 6)) { setErrorMsg("Password must be at least 6 characters."); return; }
    if (role === "manager" && !hotelName.trim()) { setErrorMsg("Please enter hotel name."); return; }
    if (role === "critic" && !licenceNumber.trim()) { setErrorMsg("Please enter licence number."); return; }
    setErrorMsg("");

    let newPropId = null;
    const finalPass = password || (role === "manager" ? (hotelName.trim().toLowerCase().replace(/[^a-z0-9]/g, '') + "@123") : password);

    if (role === "manager") {
      newPropId = Date.now();
      const newProp = {
        id: newPropId, name: hotelName.trim(), type: hotelType, city: hotelCity.trim() || "City", country: hotelCountry.trim() || "Country",
        price: 120, rating: 0, reviewCount: 0, amenities: [{ name: "Free WiFi", available: true, underRepair: false }],
        cuisine: "International", openTime: "07:00 AM", closeTime: "11:00 PM", minStay: 1,
        description: `Submitted by manager ${name}.`, status: "pending_admission", discount: 0, seasonalOffer: null,
        faqs: hotelFaqs, images: [], managerEmail: email.trim().toLowerCase(), branches: 1,
        password: finalPass
      };
      setShared("hire_properties", [...getShared("hire_properties", []), newProp]);
    }

    const res = await signup({
      name: name.trim(), email: email.trim(), password: finalPass,
      role: role, propertyId: newPropId, licenceNumber: licenceNumber.trim()
    });

    if (!res.success) { setErrorMsg(res.message); return; }
    if (role === "manager") {
      setSuccessMsg("Hotel submitted for admission! Admin will review.");
      setTimeout(function() { navigate("/role-select"); }, 2500);
    } else if (role === "critic") {
      setSuccessMsg("Critic registered! Pending admin legal verification.");
      setTimeout(function() { navigate("/critic"); }, 2500);
    } else {
      navigate("/");
    }
  }

  return (
    <div className="hire-signup py-4 d-flex justify-content-center">
      <div className="card shadow-sm border p-4 rounded bg-white" style={{ maxWidth: "480px", width: "100%" }}>
        <div className="text-center mb-3">
          <h4 className="fw-bold text-navy mb-1">Create HIRE Account</h4>
          <p className="text-muted small">Sign up as Guest, Manager, or Licensed Critic</p>
        </div>
        {errorMsg && <div className="alert alert-danger py-2 px-3 small mb-2">{errorMsg}</div>}
        {successMsg && <div className="alert alert-success py-2 px-3 small mb-2">{successMsg}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row g-2 mb-2">
            <div className="col-6"><input type="text" className="form-control form-control-sm" placeholder="Full name" value={name} onChange={function(e) { setName(e.target.value); }} required /></div>
            <div className="col-6"><input type="email" className="form-control form-control-sm" placeholder="Enter your email" value={email} onChange={function(e) { setEmail(e.target.value); }} required /></div>
          </div>
          <div className="d-flex gap-2 mb-3">
            {["customer", "manager", "critic"].map(function(r) {
              return (
                <button key={r} type="button" className={`btn btn-sm flex-grow-1 text-capitalize ${role === r ? "btn-teal" : "btn-outline-secondary"}`} onClick={function() { setRole(r); }}>{r}</button>
              );
            })}
          </div>
          {role === "manager" && (
            <div className="p-2 bg-light rounded border mb-2">
              <span className="small fw-bold text-navy d-block mb-1">Register Venue for Admission</span>
              <input type="text" className="form-control form-control-sm mb-2" placeholder="Hotel Name" value={hotelName} onChange={function(e) { setHotelName(e.target.value); }} required />
              <div className="row g-1">
                <div className="col-4"><select className="form-select form-select-sm" value={hotelType} onChange={function(e) { setHotelType(e.target.value); }}><option value="Hotel">Hotel</option><option value="Inn">Inn</option><option value="Restaurant">Restaurant</option></select></div>
                <div className="col-4"><input type="text" className="form-control form-control-sm" placeholder="City" value={hotelCity} onChange={function(e) { setHotelCity(e.target.value); }} required /></div>
                <div className="col-4"><input type="text" className="form-control form-control-sm" placeholder="Country" value={hotelCountry} onChange={function(e) { setHotelCountry(e.target.value); }} required /></div>
              </div>
            </div>
          )}
          {role === "critic" && (
            <div className="p-2 bg-light rounded border mb-2">
              <span className="small fw-bold text-navy d-block mb-1">Licence Details</span>
              <input type="text" className="form-control form-control-sm" placeholder="Licence Number (e.g. CRIT-5491)" value={licenceNumber} onChange={function(e) { setLicenceNumber(e.target.value); }} required />
            </div>
          )}
          <div className="mb-3">
            <input type="password" className="form-control form-control-sm" placeholder={role === "manager" ? "Password (hotel@123 or venue password)" : "Password (min 6 characters)"} value={password} onChange={function(e) { setPassword(e.target.value); }} />
          </div>
          <button type="submit" className="btn btn-teal w-100 py-2 fw-semibold mb-2">Create Account</button>
          <div className="text-center"><Link to="/login" className="small text-teal text-decoration-none">Already registered? Sign in</Link></div>
        </form>
      </div>
    </div>
  );
}
