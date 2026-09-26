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

export const propertiesA = [
  {
    id: 1, name: "The Grand Harbour Hotel", type: "Hotel", city: "Mumbai", country: "India",
    price: 180, priceUnit: "/ night", secondaryPrice: 1100, secondaryPriceLabel: "Weekly Luxury Suite",
    rating: 4.7, reviewCount: 32,
    amenities: [
      { name: "Free WiFi", available: true, underRepair: false }, { name: "Pool", available: true, underRepair: false },
      { name: "Gym", available: true, underRepair: true }, { name: "Restaurant", available: true, underRepair: false },
      { name: "Parking", available: true, underRepair: false }, { name: "Room Service", available: true, underRepair: false },
      { name: "Spa", available: true, underRepair: false }
    ],
    cuisine: "Indian", openTime: "06:00 AM", closeTime: "11:30 PM", minStay: 1,
    description: "A waterfront luxury oasis overlooking Mumbai's bustling harbour. Features ocean-view suites and service.",
    status: "active", discount: 15, seasonalOffer: { name: "Monsoon Special", startDate: "2026-06-01", endDate: "2026-08-31", percent: 15 },
    faqs: hotelFaqs, images: [], managerEmail: "manager@hire.com", branches: 3
  },
  {
    id: 2, name: "Serenity Inn & Spa", type: "Inn", city: "Goa", country: "India",
    price: 30, priceUnit: "/ night", secondaryPrice: 150, secondaryPriceLabel: "Weekly Retreat Pass",
    rating: 4.5, reviewCount: 24,
    amenities: baseAmenities, cuisine: "Indian", openTime: "07:00 AM", closeTime: "11:00 PM", minStay: 2,
    description: "Tucked amidst palm groves, offering serene yoga pavilions and Ayurvedic wellness rituals.",
    status: "active", discount: 10, seasonalOffer: null, faqs: innFaqs, images: [], managerEmail: "manager2@hire.com", branches: 1
  },
  {
    id: 3, name: "The Spice Pavilion", type: "Restaurant", city: "Dubai", country: "United Arab Emirates",
    price: 40, priceUnit: "starting", secondaryPrice: 400, secondaryPriceLabel: "Grand Buffet Feast",
    rating: 4.8, reviewCount: 45,
    amenities: baseAmenities, cuisine: "Middle Eastern", openTime: "11:00 AM", closeTime: "01:00 AM", minStay: 1,
    description: "Fine dining haven serving spiced lamb ouzi and saffron infused delicacies with skyline vistas.",
    status: "active", discount: 0, seasonalOffer: null, faqs: restaurantFaqs, images: [], managerEmail: "manager3@hire.com", branches: 2
  },
  {
    id: 4, name: "Marina Skyline Hotel", type: "Hotel", city: "Singapore", country: "Singapore",
    price: 240, priceUnit: "/ night", secondaryPrice: 1450, secondaryPriceLabel: "Weekly Executive Pass",
    rating: 4.9, reviewCount: 58,
    amenities: baseAmenities, cuisine: "Asian", openTime: "06:00 AM", closeTime: "12:00 AM", minStay: 1,
    description: "Iconic architectural marvel towering above the bay with sky-gardens and rooftop infinity pool.",
    status: "active", discount: 20, seasonalOffer: null, faqs: hotelFaqs, images: [], managerEmail: "manager4@hire.com", branches: 1
  },
  {
    id: 5, name: "Shinjuku Garden Ryokan", type: "Inn", city: "Tokyo", country: "Japan",
    price: 130, priceUnit: "/ day", secondaryPrice: 750, secondaryPriceLabel: "Weekly Onsen Stay",
    rating: 4.6, reviewCount: 29,
    amenities: baseAmenities, cuisine: "Japanese", openTime: "07:00 AM", closeTime: "10:30 PM", minStay: 2,
    description: "Authentic tatami suites with onsen cedar baths and serene bonsai courtyards in central Tokyo.",
    status: "active", discount: 0, seasonalOffer: null, faqs: innFaqs, images: [], managerEmail: "manager5@hire.com", branches: 1
  },
  {
    id: 6, name: "Le Petit Bistro Seine", type: "Restaurant", city: "Paris", country: "France",
    price: 35, priceUnit: "/ dish", secondaryPrice: 95, secondaryPriceLabel: "3-Course Prix Fixe",
    rating: 4.4, reviewCount: 19,
    amenities: baseAmenities, cuisine: "French", openTime: "12:00 PM", closeTime: "11:00 PM", minStay: 1,
    description: "Charming riverside bistro offering artisanal wines and timeless Parisian culinary classics.",
    status: "active", discount: 5, seasonalOffer: null, faqs: restaurantFaqs, images: [], managerEmail: "manager6@hire.com", branches: 1
  },
  {
    id: 7, name: "Trastevere Historic Inn", type: "Inn", city: "Rome", country: "Italy",
    price: 110, priceUnit: "/ day", secondaryPrice: 650, secondaryPriceLabel: "Weekly Explorer Pass",
    rating: 4.6, reviewCount: 22,
    amenities: baseAmenities, cuisine: "Italian", openTime: "07:30 AM", closeTime: "10:00 PM", minStay: 2,
    description: "Cobblestone quarter heritage lodging featuring warm terracotta terraces and rustic Italian charm.",
    status: "active", discount: 0, seasonalOffer: null, faqs: innFaqs, images: [], managerEmail: "manager7@hire.com", branches: 1
  },
  {
    id: 8, name: "Mayfair Grand Residency", type: "Hotel", city: "London", country: "United Kingdom",
    price: 260, priceUnit: "/ night", secondaryPrice: 1600, secondaryPriceLabel: "Weekly Penthouse",
    rating: 4.7, reviewCount: 41,
    amenities: baseAmenities, cuisine: "European", openTime: "06:30 AM", closeTime: "11:30 PM", minStay: 1,
    description: "Classic British elegance in prestigious Mayfair, complete with white-glove concierge.",
    status: "active", discount: 10, seasonalOffer: null, faqs: hotelFaqs, images: [], managerEmail: "manager8@hire.com", branches: 1
  }
];
