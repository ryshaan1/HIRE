export const RATE_CATEGORIES = [
  { id: "/ night", label: "Per Night (/ night)", shortLabel: "/ night", category: "stay", desc: "Nightly accommodation stay" },
  { id: "/ day", label: "Per Day (/ day)", shortLabel: "/ day", category: "stay", desc: "Day pass or daytime retreat" },
  { id: "/ dish", label: "Average Per Dish (/ dish)", shortLabel: "/ dish", category: "restaurant", desc: "Average price per à la carte dish" },
  { id: "starting", label: "Starting Price (starting)", shortLabel: "starting", category: "restaurant", desc: "Starting entry rate or course price" },
  { id: "/ person", label: "Per Person (/ person)", shortLabel: "/ person", category: "both", desc: "Buffet or fixed per-head pricing" },
  { id: "/ weekly", label: "Weekly Rate (/ weekly)", shortLabel: "/ weekly", category: "stay", desc: "Discounted 7-day extended package" }
];

export const COUNTRY_CURRENCY_MAP = {
  "Bulgaria": { code: "BGN", symbol: "BGN", rate: 1.82 },
  "Liechtenstein": { code: "CHF", symbol: "CHF", rate: 0.88 },
  "Switzerland": { code: "CHF", symbol: "CHF", rate: 0.88 },
  "Tokelau": { code: "NZD", symbol: "NZ$", rate: 1.68 },
  "Cook Islands": { code: "NZD", symbol: "NZ$", rate: 1.68 },
  "India": { code: "INR", symbol: "₹", rate: 83.5 },
  "United Kingdom": { code: "GBP", symbol: "£", rate: 0.78 },
  "UK": { code: "GBP", symbol: "£", rate: 0.78 },
  "Norway": { code: "NOK", symbol: "NOK", rate: 11.0 },
  "China": { code: "CNY", symbol: "¥", rate: 7.23 },
  "Iraq": { code: "IQD", symbol: "IQD", rate: 1310 },
  "Yemen": { code: "YER", symbol: "YER", rate: 250 },
  "Georgia": { code: "GEL", symbol: "GEL", rate: 2.74 },
  "Bosnia and Herzegovina": { code: "BAM", symbol: "KM", rate: 1.82 },
  "Zambia": { code: "ZMW", symbol: "ZMW", rate: 26.5 },
  "Russia": { code: "RUB", symbol: "₽", rate: 96.5 },
  "Japan": { code: "JPY", symbol: "¥", rate: 153 },
  "United Arab Emirates": { code: "AED", symbol: "AED", rate: 3.67 },
  "UAE": { code: "AED", symbol: "AED", rate: 3.67 },
  "Australia": { code: "AUD", symbol: "A$", rate: 1.52 },
  "Canada": { code: "CAD", symbol: "C$", rate: 1.38 },
  "Singapore": { code: "SGD", symbol: "S$", rate: 1.32 },
  "Germany": { code: "EUR", symbol: "€", rate: 0.92 },
  "France": { code: "EUR", symbol: "€", rate: 0.92 },
  "Italy": { code: "EUR", symbol: "€", rate: 0.92 },
  "Spain": { code: "EUR", symbol: "€", rate: 0.92 },
  "Holy See (Vatican City State)": { code: "EUR", symbol: "€", rate: 0.92 },
  "Martinique": { code: "EUR", symbol: "€", rate: 0.92 },
  "French Polynesia": { code: "XPF", symbol: "CFP", rate: 110 },
  "Lesotho": { code: "LSL", symbol: "LSL", rate: 18.2 },
  "Cayman Islands": { code: "KYD", symbol: "CI$", rate: 0.83 },
  "Djibouti": { code: "DJF", symbol: "DJF", rate: 178 },
  "Saint Pierre and Miquelon": { code: "EUR", symbol: "€", rate: 0.92 },
  "El Salvador": { code: "USD", symbol: "$", rate: 1.0 },
  "United States": { code: "USD", symbol: "$", rate: 1.0 },
  "USA": { code: "USD", symbol: "$", rate: 1.0 }
};

export function getCurrencyForCountry(country) {
  if (!country) return { code: "USD", symbol: "$", rate: 1.0 };
  const trimmed = String(country).trim();
  if (COUNTRY_CURRENCY_MAP[trimmed]) return COUNTRY_CURRENCY_MAP[trimmed];
  const keys = Object.keys(COUNTRY_CURRENCY_MAP);
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (trimmed.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(trimmed.toLowerCase())) {
      return COUNTRY_CURRENCY_MAP[k];
    }
  }
  return { code: "USD", symbol: "$", rate: 1.0 };
}

export function formatPriceDisplay(amountUSD, country) {
  const numUSD = Number(amountUSD) || 0;
  const curr = getCurrencyForCountry(country);
  const localVal = Math.round(numUSD * curr.rate);
  if (curr.code === "USD") {
    return `$${numUSD.toLocaleString()} USD`;
  }
  return `${curr.symbol} ${localVal.toLocaleString()} (~$${numUSD.toLocaleString()} USD)`;
}

export function getPropertyPriceUnit(property) {
  if (!property) return "/ night";
  if (property.priceUnit) return property.priceUnit;

  const type = String(property.type || "");
  if (type.includes("Restaurant")) {
    return "/ dish";
  }
  if (type.includes("Inn")) {
    return "/ night";
  }
  return "/ night";
}

export function formatPriceInfo(property) {
  if (!property) {
    return {
      price: 0,
      discountedPrice: 0,
      hasDiscount: false,
      unit: "/ night",
      unitDisplay: "/ night",
      secondaryPrice: null,
      secondaryLabel: null,
      currency: { code: "USD", symbol: "$", rate: 1.0 },
      displayPrice: "$0 USD",
      originalDisplayPrice: "$0 USD"
    };
  }

  const basePrice = Number(property.price) || 0;
  const hasDiscount = Boolean(property.discount && property.discount > 0);
  const discountedPrice = hasDiscount
    ? Math.round(basePrice * (1 - property.discount / 100))
    : basePrice;

  const unit = getPropertyPriceUnit(property);
  const unitDisplay = unit.startsWith("/") ? unit : ` ${unit}`;
  const currency = getCurrencyForCountry(property.country);
  const displayPrice = formatPriceDisplay(discountedPrice, property.country);
  const originalDisplayPrice = formatPriceDisplay(basePrice, property.country);

  return {
    price: basePrice,
    discountedPrice,
    hasDiscount,
    unit,
    unitDisplay,
    currency,
    displayPrice,
    originalDisplayPrice,
    secondaryPrice: property.secondaryPrice ? Number(property.secondaryPrice) : null,
    secondaryLabel: property.secondaryPriceLabel || (property.secondaryPrice ? "Package" : null)
  };
}
