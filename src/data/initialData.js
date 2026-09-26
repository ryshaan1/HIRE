export const defaultUsers = [
  {
    name: "Master Admin Usman",
    email: "admin@hire.com",
    role: "admin",
    isBanned: false
  },
  {
    name: "Grand Harbour Manager",
    email: "manager@hire.com",
    role: "manager",
    propertyId: 1,
    isBanned: false
  },
  {
    name: "Senior Food Critic Devansh",
    email: "critic@hire.com",
    role: "critic",
    licenceNumber: "CRIT-8842",
    isApproved: true,
    isBanned: false
  },
  {
    name: "John Traveler",
    email: "customer@hire.com",
    role: "customer",
    isBanned: false
  }
];

export const defaultReviews = [
  {
    id: 1,
    propertyId: 1,
    userName: "Devansh Sheth",
    userEmail: "critic@hire.com",
    isCritic: true,
    rating: 4.8,
    criteria: { cost: 4, location: 5, offers: 5, food: 5, hygiene: 5, services: 5, amenities: 5 },
    title: "Unmatched Waterfront Grandeur",
    comment: "The coastal cuisine and personalized service are standard-setting. A true jewel in Mumbai.",
    date: "2026-09-18"
  },
  {
    id: 2,
    propertyId: 1,
    userName: "Ryshaan Shah",
    userEmail: "critic2@hire.com",
    isCritic: true,
    rating: 4.6,
    criteria: { cost: 4, location: 5, offers: 4, food: 5, hygiene: 5, services: 5, amenities: 4 },
    title: "Exemplary Seaside Hospitality",
    comment: "Stunning Arabian Sea vistas paired with world-class Mughlai dining and impeccable housekeeping.",
    date: "2026-09-28"
  },
  {
    id: 3,
    propertyId: 2,
    userName: "Devansh Sheth",
    userEmail: "critic@hire.com",
    isCritic: true,
    rating: 4.5,
    criteria: { cost: 5, location: 4, offers: 4, food: 4, hygiene: 5, services: 5, amenities: 4 },
    title: "Peaceful Palm Sanctuary",
    comment: "Idyllic yoga atmosphere and genuine Goan warmth. The Ayurvedic spa therapies are deeply rejuvenating.",
    date: "2026-09-22"
  }
];

export const defaultReports = [
  {
    id: 1,
    propertyId: 10,
    propertyName: "South Beach Ocean Grill",
    reporterEmail: "customer@hire.com",
    reason: "Hygiene concerns",
    notes: "Kitchen sanitation and dining tables needed urgent attention during weekend rush.",
    date: "2026-09-25",
    status: "Pending"
  }
];
