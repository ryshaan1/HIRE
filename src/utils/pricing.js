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

export const SUPPORTED_CONVERTER_CURRENCIES = [
  { code: "INR", symbol: "₹", name: "Indian Rupee (INR)", rate: 83.5 },
  { code: "EUR", symbol: "€", name: "Euro (EUR)", rate: 0.92 },
  { code: "GBP", symbol: "£", name: "British Pound (GBP)", rate: 0.78 },
  { code: "USD", symbol: "$", name: "US Dollar (USD)", rate: 1.0 },
  { code: "AED", symbol: "AED", name: "UAE Dirham (AED)", rate: 3.67 },
  { code: "JPY", symbol: "¥", name: "Japanese Yen (JPY)", rate: 153.0 },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar (CAD)", rate: 1.38 },
  { code: "AUD", symbol: "A$", name: "Australian Dollar (AUD)", rate: 1.52 },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc (CHF)", rate: 0.88 },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan (CNY)", rate: 7.23 },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar (SGD)", rate: 1.32 },
  { code: "RUB", symbol: "₽", name: "Russian Ruble (RUB)", rate: 96.5 }
];

export function getSelectedCurrency() {
  if (typeof window === "undefined") return { code: "INR", symbol: "₹", rate: 83.5 };
  try {
    const saved = localStorage.getItem("hire_selected_currency");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.code) return parsed;
    }
  } catch (e) {}
  return { code: "INR", symbol: "₹", rate: 83.5 };
}

export function setSelectedCurrency(currencyObj) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("hire_selected_currency", JSON.stringify(currencyObj));
    window.dispatchEvent(new Event("hire_currency_changed"));
  } catch (e) {}
}

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

export function formatPriceDisplay(amountUSD, country, customCurrency = null) {
  const numUSD = Number(amountUSD) || 0;
  const localCurr = getCurrencyForCountry(country);
  const localVal = Math.round(numUSD * localCurr.rate);
  const target = customCurrency || getSelectedCurrency();

  let targetCurr = target;
  if (targetCurr.code === localCurr.code) {
    targetCurr = targetCurr.code === "INR"
      ? { code: "EUR", symbol: "€", rate: 0.92 }
      : { code: "INR", symbol: "₹", rate: 83.5 };
  }

  const targetVal = Math.round(numUSD * targetCurr.rate);

  if (localCurr.code === "USD") {
    return `$${numUSD.toLocaleString()} USD [${targetCurr.symbol} ${targetVal.toLocaleString()} ${targetCurr.code}]`;
  }

  return `${localCurr.symbol} ${localVal.toLocaleString()} ($${numUSD.toLocaleString()} USD) [${targetCurr.symbol} ${targetVal.toLocaleString()} ${targetCurr.code}]`;
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

export function formatPriceInfo(property, customCurrency = null) {
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
  const displayPrice = formatPriceDisplay(discountedPrice, property.country, customCurrency);
  const originalDisplayPrice = formatPriceDisplay(basePrice, property.country, customCurrency);

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
    secondaryDisplayPrice: property.secondaryPrice ? formatPriceDisplay(property.secondaryPrice, property.country, customCurrency) : null,
    secondaryLabel: property.secondaryPriceLabel || (property.secondaryPrice ? "Package" : null)
  };
}

export function getVenueRules(property) {
  if (!property) {
    return {
      paymentMethod: "Cash at Check-in & Credit/Debit Card",
      advancePercent: 50,
      acceptedCurrencies: "USD",
      currencySurcharge: "3.5% foreign currency exchange fee applies",
      cancellationPolicy: "Cancellations allowed up to 48 hours prior to check-in.",
      customRules: ["Valid government ID required at check-in"]
    };
  }

  if (property.rules && property.rules.paymentMethod) {
    return property.rules;
  }

  const idNum = Number(property.id) || 1;
  const pType = String(property.type || "Hotel").toLowerCase();
  const curr = getCurrencyForCountry(property.country);
  const currsList = curr.code === "USD" ? "USD, EUR" : `${curr.code}, USD, EUR`;

  if (pType.includes("restaurant")) {
    const paymentOptions = [
      "Table Deposit via Credit Card & Cash/Card for Meal Settlement",
      "Major Credit/Debit Cards & Contactless Mobile NFC (Cashless Dining)",
      "Cash Settlement & All Major International Cards (Visa/Mastercard/Amex)",
      "Split Bill Accepted (Up to 4 Cards per Party) & Local UPI/Cash"
    ];
    const advanceOptions = [20, 25, 30, 0];
    const cancelOptions = [
      "Dinner table reservation held for 20 minutes past booking time. Cancellation permitted up to 4 hours in advance with full table deposit refund. Repeated no-shows blocked from future bookings.",
      "Tasting menu seatings require 6 hours cancellation notice. Late cancellations incur a deposit retention fee to cover fresh ingredient preparations.",
      "Complimentary cancellation up to 2 hours before dining time. No-shows without notification will forfeit reservation priority on the platform."
    ];
    const houseRulesOptions = [
      [
        "Smart casual dress code observed; athletic wear and beach flip-flops discouraged",
        "Please notify service team in advance regarding severe nut, seafood, or gluten allergies",
        "Private vintage wine corkage fee of $30 applies per 750ml bottle",
        "Children welcome; high chairs and customized kids menus available upon request"
      ],
      [
        "Seating allocated for 1 hour 45 minutes for optimal dining service pacing",
        "Chef's tasting menu requires full table participation for synchronized service",
        "Celebration cakes brought from outside subject to $15 service plating fee",
        "Valet parking validation provided at the host stand upon departure"
      ]
    ];
    const surcharges = ["2.5% foreign currency settlement fee", "3.0% international card surcharge", "Zero surcharge on local card payments", "3.5% multi-currency processing tax"];

    return {
      paymentMethod: paymentOptions[idNum % paymentOptions.length],
      advancePercent: advanceOptions[idNum % advanceOptions.length],
      acceptedCurrencies: currsList,
      currencySurcharge: surcharges[idNum % surcharges.length],
      cancellationPolicy: cancelOptions[idNum % cancelOptions.length],
      customRules: houseRulesOptions[idNum % houseRulesOptions.length]
    };
  }

  if (pType.includes("inn")) {
    const paymentOptions = [
      "Cash on Arrival & Direct Bank Debit / UPI",
      "Cash at Check-in & Credit Card Pre-Authorization",
      "Major Credit/Debit Cards, Cash, & Digital Wallets",
      "Full Online Prepayment or Cash upon Key Handover"
    ];
    const advanceOptions = [25, 30, 35, 40];
    const cancelOptions = [
      "Small boutique inn policy: 7 days written notice required for 100% refund. Under 7 days, 35% re-booking fee applies. Repeated frivolous cancellations are penalized.",
      "Free cancellation up to 48 hours before check-in. In case of same-day cancellation, deposit is converted into a 1-year stay voucher.",
      "Flexible inn policy: Cancel up to 24 hours prior without fee. Early departures are billed for 50% of the remaining reserved nights."
    ];
    const houseRulesOptions = [
      [
        "Complimentary homemade artisanal breakfast served in the hearth room from 07:30 AM to 09:30 AM",
        "Late check-in past 08:30 PM requires prior coordination for keypad access codes",
        "Historic timber premises: strictly no smoking, vaping, or open candle flames inside",
        "Secure bicycle and outdoor hiking gear storage available in the private courtyard"
      ],
      [
        "Quiet residential hours observed from 09:30 PM to 07:00 AM for neighborhood tranquility",
        "Locally roasted coffee, herbal teas, and fresh fruit available 24/7 in the guest lounge",
        "Shoes-off policy inside upstairs guest suites; warm artisanal slippers provided at entrance",
        "Well-behaved companion pets permitted in ground floor garden terrace suites with prior registration"
      ]
    ];
    const surcharges = ["3.0% foreign currency fee", "2.8% international conversion tax", "3.5% foreign currency exchange fee", "Zero exchange surcharge on cash settlement"];

    return {
      paymentMethod: paymentOptions[idNum % paymentOptions.length],
      advancePercent: advanceOptions[idNum % advanceOptions.length],
      acceptedCurrencies: currsList,
      currencySurcharge: surcharges[idNum % surcharges.length],
      cancellationPolicy: cancelOptions[idNum % cancelOptions.length],
      customRules: houseRulesOptions[idNum % houseRulesOptions.length]
    };
  }

  if (pType.includes("banquet")) {
    const paymentOptions = [
      "Bank Wire Transfer, Corporate Cheque & 50% Advance Card/Cash",
      "Major Credit Cards & Certified Bank Escrow Transfer",
      "50% Cash/Card Booking Advance & Remaining 50% Post-Event Settlement"
    ];
    const advanceOptions = [50, 60, 40];
    const cancelOptions = [
      "Event hall booking requires 14 days cancellation notice for 80% refund. Cancellations within 14 days forfeit deposit due to exclusive date booking reservations.",
      "Banquet reservation cancellation permitted up to 30 days prior for full refund less 10% administrative processing fee.",
      "Date rescheduling allowed once free of charge if requested at least 10 days prior to event date."
    ];
    const houseRulesOptions = [
      [
        "External vendor, catering, and floral setup access granted from 09:00 AM on event day",
        "Sound decibel restrictions strictly enforced after 11:00 PM in accordance with municipal ordinances",
        "Refundable security damage deposit of $250 inspected and returned within 48 hours post event",
        "Pyrotechnics, fire hazards, and confetti cannons strictly prohibited on ballroom floor"
      ]
    ];
    return {
      paymentMethod: paymentOptions[idNum % paymentOptions.length],
      advancePercent: advanceOptions[idNum % advanceOptions.length],
      acceptedCurrencies: currsList,
      currencySurcharge: "3.5% international wire processing fee",
      cancellationPolicy: cancelOptions[idNum % cancelOptions.length],
      customRules: houseRulesOptions[idNum % houseRulesOptions.length]
    };
  }

  const paymentOptions = [
    "Cash at Check-in & Major Credit/Debit Cards (Visa/Mastercard/Amex)",
    "Credit / Debit Card Only (Cashless Front Desk for Guest Security)",
    "Major Cards, Digital Escrow, & Contactless Apple/Google Pay",
    "Cash on Arrival & International Credit Cards (Pre-authorization Required)",
    "All Major Credit Cards, Bank Wire, & Cash at Concierge"
  ];
  const advanceOptions = [30, 40, 50, 60];
  const cancelOptions = [
    "Complimentary cancellation up to 48 hours prior to check-in. Late cancellation incurs 1-night room fee. Repeated booking and cancellations across venues trigger immediate account lock.",
    "Free cancellation until 72 hours before arrival date. Within 72 hours, 50% advance deposit is non-refundable. Platform monitors frequent cancel abuse.",
    "Flexible stay policy: 100% refund if cancelled 24 hours prior. Unnotified no-shows result in full booking forfeiture and user trust rating deduction.",
    "Non-refundable promotional rate. Date modifications permitted up to 72 hours in advance subject to room category availability."
  ];
  const houseRulesOptions = [
    [
      "Valid passport or national government photo ID required for all staying guests upon check-in",
      "Quiet hours observed strictly from 10:00 PM to 07:00 AM in guest corridors and suites",
      "Rooftop infinity pool and wellness spa accessible daily from 06:00 AM to 10:30 PM",
      "Smart casual dress code maintained in evening dining salons and executive club lounge"
    ],
    [
      "Government photo ID and credit card pre-authorization required upon front desk registration",
      "Standard check-in begins at 2:00 PM; check-out strictly by 11:30 AM to allow sanitization",
      "Valet parking complimentary for registered hotel guests with vehicle registration plate",
      "Strict non-smoking policy enforced across all interior rooms and balcony suites ($150 sanitization fee)"
    ],
    [
      "All guests must present matching ID with booking reservation reference voucher",
      "Executive lounge access reserved exclusively for club floor, junior suite, and presidential suite reservations",
      "Pet friendly in designated ground-level garden terrace rooms with prior concierge registration",
      "Commercial photography or filming requires prior written authorization from general management"
    ]
  ];
  const surcharges = [
    "3.5% foreign currency exchange fee applies",
    "2.5% cross-border multi-currency processing tax",
    "3.8% international conversion fee on non-local billing",
    "Zero exchange surcharge on major international card settlements"
  ];

  return {
    paymentMethod: paymentOptions[idNum % paymentOptions.length],
    advancePercent: advanceOptions[idNum % advanceOptions.length],
    acceptedCurrencies: currsList,
    currencySurcharge: surcharges[idNum % surcharges.length],
    cancellationPolicy: cancelOptions[idNum % cancelOptions.length],
    customRules: houseRulesOptions[idNum % houseRulesOptions.length]
  };
}
