// Pricing utilities and categories for Hotels, Inns, and Restaurants

export const RATE_CATEGORIES = [
  { id: "/ night", label: "Per Night (/ night)", shortLabel: "/ night", category: "stay", desc: "Nightly accommodation stay" },
  { id: "/ day", label: "Per Day (/ day)", shortLabel: "/ day", category: "stay", desc: "Day pass or daytime retreat" },
  { id: "/ dish", label: "Average Per Dish (/ dish)", shortLabel: "/ dish", category: "restaurant", desc: "Average price per à la carte dish" },
  { id: "starting", label: "Starting Price (starting)", shortLabel: "starting", category: "restaurant", desc: "Starting entry rate or course price" },
  { id: "/ person", label: "Per Person (/ person)", shortLabel: "/ person", category: "both", desc: "Buffet or fixed per-head pricing" },
  { id: "/ weekly", label: "Weekly Rate (/ weekly)", shortLabel: "/ weekly", category: "stay", desc: "Discounted 7-day extended package" }
];

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
      secondaryLabel: null
    };
  }

  const basePrice = Number(property.price) || 0;
  const hasDiscount = Boolean(property.discount && property.discount > 0);
  const discountedPrice = hasDiscount
    ? Math.round(basePrice * (1 - property.discount / 100))
    : basePrice;

  const unit = getPropertyPriceUnit(property);
  const unitDisplay = unit.startsWith("/") ? unit : ` ${unit}`;

  return {
    price: basePrice,
    discountedPrice,
    hasDiscount,
    unit,
    unitDisplay,
    secondaryPrice: property.secondaryPrice ? Number(property.secondaryPrice) : null,
    secondaryLabel: property.secondaryPriceLabel || (property.secondaryPrice ? "Package" : null)
  };
}
