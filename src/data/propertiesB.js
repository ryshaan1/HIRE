import { hotelFaqs, innFaqs, restaurantFaqs } from "./defaultFaqs.js";

const baseAmenities = [
  { name: "Free WiFi", available: true, underRepair: false },
  { name: "Pool", available: true, underRepair: false },
  { name: "Gym", available: true, underRepair: false },
  { name: "Restaurant", available: true, underRepair: false },
  { name: "Parking", available: true, underRepair: false },
  { name: "Room Service", available: true, underRepair: false },
  { name: "Spa", available: false, underRepair: false }
];

export const propertiesB = [
  {
    id: 9, name: "Manhattan Heights Hotel", type: "Hotel", city: "New York", country: "United States",
    price: 310, priceUnit: "/ night", secondaryPrice: 1950, secondaryPriceLabel: "Weekly Corporate Suite",
    rating: 4.8, reviewCount: 52,
    amenities: baseAmenities, cuisine: "American", openTime: "06:00 AM", closeTime: "12:00 AM", minStay: 1,
    description: "Midtown Manhattan luxury tower offering floor-to-ceiling skyline views and bespoke member lounges.",
    status: "active", discount: 0, seasonalOffer: null, faqs: hotelFaqs, images: [], managerEmail: "manager9@hire.com", branches: 4
  },
  {
    id: 10, name: "South Beach Ocean Grill", type: "Restaurant", city: "Miami", country: "United States",
    price: 45, priceUnit: "/ dish", secondaryPrice: 120, secondaryPriceLabel: "Seafood Platter Tower",
    rating: 4.3, reviewCount: 18,
    amenities: baseAmenities, cuisine: "Seafood", openTime: "11:30 AM", closeTime: "01:30 AM", minStay: 1,
    description: "Vibrant oceanfront dining with pastel neon glows, fresh catches, and tropical mixology.",
    status: "flagged", flagReason: "Hygiene concerns", discount: 0, seasonalOffer: null, faqs: restaurantFaqs, images: [], managerEmail: "manager10@hire.com", branches: 1
  },
  {
    id: 11, name: "Copacabana Palace Inn", type: "Inn", city: "Rio de Janeiro", country: "Brazil",
    price: 85, priceUnit: "/ night", secondaryPrice: 500, secondaryPriceLabel: "Carnival Week Pass",
    rating: 4.5, reviewCount: 16,
    amenities: baseAmenities, cuisine: "Latin American", openTime: "07:00 AM", closeTime: "11:00 PM", minStay: 1,
    description: "Sunlit boutique inn two blocks from the famous golden sands, filled with samba spirit.",
    status: "active", discount: 10, seasonalOffer: null, faqs: innFaqs, images: [], managerEmail: "manager11@hire.com", branches: 1
  },
  {
    id: 12, name: "Table Mountain View Lodge", type: "Hotel", city: "Cape Town", country: "South Africa",
    price: 140, priceUnit: "/ night", secondaryPrice: 850, secondaryPriceLabel: "Weekly Safari Stay",
    rating: 4.7, reviewCount: 26,
    amenities: baseAmenities, cuisine: "African", openTime: "06:30 AM", closeTime: "11:00 PM", minStay: 2,
    description: "Spectacular plateau panoramas, private wine cellars, and tranquil botanical gardens.",
    status: "active", discount: 0, seasonalOffer: null, faqs: hotelFaqs, images: [], managerEmail: "manager12@hire.com", branches: 1
  },
  {
    id: 13, name: "Medina Riad & Suites", type: "Inn", city: "Marrakech", country: "Morocco",
    price: 90, priceUnit: "/ day", secondaryPrice: 550, secondaryPriceLabel: "Weekly Riad Experience",
    rating: 4.6, reviewCount: 21,
    amenities: baseAmenities, cuisine: "Middle Eastern", openTime: "07:00 AM", closeTime: "10:30 PM", minStay: 1,
    description: "Traditional Moroccan courtyards with mosaic zellij fountains, orange trees, and rooftop stargazing.",
    status: "active", discount: 15, seasonalOffer: null, faqs: innFaqs, images: [], managerEmail: "manager13@hire.com", branches: 1
  },
  {
    id: 14, name: "Harbourfront Coastal Dining", type: "Restaurant", city: "Sydney", country: "Australia",
    price: 55, priceUnit: "starting", secondaryPrice: 180, secondaryPriceLabel: "Seafood Degustation Menu",
    rating: 4.8, reviewCount: 37,
    amenities: baseAmenities, cuisine: "Seafood", openTime: "12:00 PM", closeTime: "11:00 PM", minStay: 1,
    description: "Award-winning waterside restaurant gazing directly at the Sydney Opera House sails.",
    status: "active", discount: 0, seasonalOffer: null, faqs: restaurantFaqs, images: [], managerEmail: "manager14@hire.com", branches: 2
  },
  {
    id: 15, name: "Ubud Sanctuary Villas", type: "Hotel", city: "Bali", country: "Indonesia",
    price: 125, priceUnit: "/ day", secondaryPrice: 790, secondaryPriceLabel: "Weekly Wellness Retreat",
    rating: 4.9, reviewCount: 64,
    amenities: baseAmenities, cuisine: "Asian", openTime: "06:00 AM", closeTime: "11:00 PM", minStay: 2,
    description: "Infinity jungle pools overlooking cascading emerald rice terraces and sacred river valleys.",
    status: "active", discount: 25, seasonalOffer: null, faqs: hotelFaqs, images: [], managerEmail: "manager15@hire.com", branches: 1
  },
  {
    id: 16, name: "Bosphorus Spice Table", type: "Restaurant", city: "Istanbul", country: "Turkey",
    price: 38, priceUnit: "/ dish", secondaryPrice: 115, secondaryPriceLabel: "Ottoman Feast Platter",
    rating: 4.7, reviewCount: 30,
    amenities: baseAmenities, cuisine: "Turkish", openTime: "11:30 AM", closeTime: "12:00 AM", minStay: 1,
    description: "Panoramic strait vistas where East meets West, celebrated for coal-roasted kebabs and herbal teas.",
    status: "active", discount: 0, seasonalOffer: null, faqs: restaurantFaqs, images: [], managerEmail: "manager16@hire.com", branches: 1
  }
];
