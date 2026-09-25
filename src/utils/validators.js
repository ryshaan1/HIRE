export function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(String(email).trim());
}

export function isStrongPassword(password) {
  if (!password || password.length < 8) {
    return false;
  }
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return hasUpper && hasLower && hasNumber && hasSpecial;
}

export function isValidDemoPassword(email, password) {
  if (!email || !password) {
    return false;
  }
  const parts = email.split("@");
  if (parts.length < 2) {
    return false;
  }
  const expected = parts[0] + "@123";
  return password === expected;
}

export function getHotelDemoPassword(name) {
  if (!name) return "hot@123";
  const clean = name.replace(/[^a-zA-Z]/g, "").slice(0, 3).toLowerCase();
  return (clean || "hot") + "@123";
}
