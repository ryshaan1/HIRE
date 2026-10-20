import { hotelFaqs, innFaqs, restaurantFaqs } from "./defaultFaqs.js";

export const initialProperties = [
  {
    "id": 1,
    "name": "The Grand Oberoi Palace",
    "type": "Hotel",
    "city": "South Lukasboro",
    "country": "Bulgaria",
    "price": 137,
    "priceUnit": "/ night",
    "priceunit": "INR",
    "rating": 0,
    "reviewCount": 0,
    "status": "verified",
    "managerEmail": "Tatum_Von@example.net",
    "image": "",
    "images": [],
    "password": "thegrandoberoipalace@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at The Grand Oberoi Palace located in South Lukasboro, Bulgaria.",
    "faqs": []
  },
  {
    "id": 2,
    "name": "Woodland Cozy Inn",
    "type": "Inn",
    "city": "Port Lacy",
    "country": "Cook Islands",
    "price": 86,
    "priceUnit": "/ night",
    "priceunit": "EUR",
    "rating": 0,
    "reviewCount": 0,
    "status": "active",
    "managerEmail": "Gage_Morar@example.org",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Woodland Cozy Inn located in Port Lacy, Cook Islands.",
    "faqs": []
  },
  {
    "id": 3,
    "name": "Spice Symphony Fine Dining",
    "type": "Restaurant",
    "city": "Bodeville",
    "country": "Iraq",
    "price": 52,
    "priceUnit": "/ meal",
    "priceunit": "GBP",
    "rating": 0,
    "reviewCount": 0,
    "status": "warned",
    "managerEmail": "Lucy52@example.com",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": false,
        "underRepair": false
      }
    ],
    "cuisine": "Multi-Cuisine",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Spice Symphony Fine Dining located in Bodeville, Iraq.",
    "faqs": []
  },
  {
    "id": 4,
    "name": "Heritage Bay Hotel & Suites",
    "type": "Hotel",
    "city": "West Brown",
    "country": "Yemen",
    "price": 188,
    "priceUnit": "/ night",
    "priceunit": "AED",
    "rating": 0,
    "reviewCount": 0,
    "status": "active",
    "managerEmail": "Polly_Jast@example.org",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Heritage Bay Hotel & Suites located in West Brown, Yemen.",
    "faqs": []
  },
  {
    "id": 5,
    "name": "Marriott Coastal Haven",
    "type": "Resort",
    "city": "Severn",
    "country": "Saint Pierre and Miquelon",
    "price": 205,
    "priceUnit": "/ night",
    "priceunit": "USD",
    "rating": 0,
    "reviewCount": 0,
    "status": "flagged",
    "managerEmail": "Adeline_Kshlerin@example.org",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Marriott Coastal Haven located in Severn, Saint Pierre and Miquelon.",
    "faqs": []
  },
  {
    "id": 6,
    "name": "The Royal Dawat Bistro",
    "type": "Restaurant",
    "city": "Fort Nellie",
    "country": "El Salvador",
    "price": 79,
    "priceUnit": "/ meal",
    "priceunit": "INR",
    "rating": 0,
    "reviewCount": 0,
    "status": "pending review",
    "managerEmail": "Margot.Miller@example.com",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": false,
        "underRepair": false
      }
    ],
    "cuisine": "Multi-Cuisine",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at The Royal Dawat Bistro located in Fort Nellie, El Salvador.",
    "faqs": []
  },
  {
    "id": 7,
    "name": "The Ritz Carlton Downtown",
    "type": "Hotel",
    "city": "Dietrichtown",
    "country": "Norway",
    "price": 239,
    "priceUnit": "/ night",
    "priceunit": "EUR",
    "rating": 0,
    "reviewCount": 0,
    "status": "active",
    "managerEmail": "Mitchell.Raynor@example.org",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at The Ritz Carlton Downtown located in Dietrichtown, Norway.",
    "faqs": []
  },
  {
    "id": 8,
    "name": "Whispering Pines Lodge & Inn",
    "type": "Inn",
    "city": "Glendale",
    "country": "Holy See (Vatican City State)",
    "price": 164,
    "priceUnit": "/ night",
    "priceunit": "GBP",
    "rating": 0,
    "reviewCount": 0,
    "status": "active",
    "managerEmail": "Merl.Torphy3@example.org",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Whispering Pines Lodge & Inn located in Glendale, Holy See (Vatican City State).",
    "faqs": []
  },
  {
    "id": 9,
    "name": "Taj Exotica Horizon",
    "type": "Hotel",
    "city": "Stromanhaven",
    "country": "Djibouti",
    "price": 273,
    "priceUnit": "/ night",
    "priceunit": "AED",
    "rating": 0,
    "reviewCount": 0,
    "status": "verified",
    "managerEmail": "Tavares.Wilkinson@example.org",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Taj Exotica Horizon located in Stromanhaven, Djibouti.",
    "faqs": []
  },
  {
    "id": 10,
    "name": "Seaside Harbor Country Inn",
    "type": "Inn",
    "city": "Hectorstead",
    "country": "Liechtenstein",
    "price": 80,
    "priceUnit": "/ night",
    "priceunit": "USD",
    "rating": 0,
    "reviewCount": 0,
    "status": "active",
    "managerEmail": "Natasha.Lehner66@example.org",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Seaside Harbor Country Inn located in Hectorstead, Liechtenstein.",
    "faqs": []
  },
  {
    "id": 11,
    "name": "Ocean Pearl Seafood Grille",
    "type": "Restaurant",
    "city": "Strosinberg",
    "country": "Tokelau",
    "price": 49,
    "priceUnit": "/ meal",
    "priceunit": "INR",
    "rating": 0,
    "reviewCount": 0,
    "status": "warned",
    "managerEmail": "Nick97@example.com",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": false,
        "underRepair": false
      }
    ],
    "cuisine": "Multi-Cuisine",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Ocean Pearl Seafood Grille located in Strosinberg, Tokelau.",
    "faqs": []
  },
  {
    "id": 12,
    "name": "Hyatt Regency Gardenia",
    "type": "Hotel",
    "city": "Port Leeboro",
    "country": "Cayman Islands",
    "price": 324,
    "priceUnit": "/ night",
    "priceunit": "EUR",
    "rating": 0,
    "reviewCount": 0,
    "status": "active",
    "managerEmail": "Shana41@example.net",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Hyatt Regency Gardenia located in Port Leeboro, Cayman Islands.",
    "faqs": []
  },
  {
    "id": 13,
    "name": "The Imperial Luxury Suites",
    "type": "Resort",
    "city": "Kohlercester",
    "country": "Lesotho",
    "price": 341,
    "priceUnit": "/ night",
    "priceunit": "GBP",
    "rating": 0,
    "reviewCount": 0,
    "status": "flagged",
    "managerEmail": "Guy_Schmitt43@example.com",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at The Imperial Luxury Suites located in Kohlercester, Lesotho.",
    "faqs": []
  },
  {
    "id": 14,
    "name": "Bella Italia Woodfire Ristorante",
    "type": "Restaurant",
    "city": "Port Donny",
    "country": "Georgia",
    "price": 76,
    "priceUnit": "/ meal",
    "priceunit": "AED",
    "rating": 0,
    "reviewCount": 0,
    "status": "pending review",
    "managerEmail": "Jessie30@example.net",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": false,
        "underRepair": false
      }
    ],
    "cuisine": "Multi-Cuisine",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Bella Italia Woodfire Ristorante located in Port Donny, Georgia.",
    "faqs": []
  },
  {
    "id": 15,
    "name": "Radisson Blu Sky Resort",
    "type": "Hotel",
    "city": "North Lillianaberg",
    "country": "Martinique",
    "price": 375,
    "priceUnit": "/ night",
    "priceunit": "USD",
    "rating": 0,
    "reviewCount": 0,
    "status": "active",
    "managerEmail": "Narciso11@example.org",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Radisson Blu Sky Resort located in North Lillianaberg, Martinique.",
    "faqs": []
  },
  {
    "id": 16,
    "name": "Mountain View Rustic Inn",
    "type": "Inn",
    "city": "Bloomington",
    "country": "China",
    "price": 158,
    "priceUnit": "/ night",
    "priceunit": "INR",
    "rating": 0,
    "reviewCount": 0,
    "status": "active",
    "managerEmail": "Ollie.Paucek6@example.org",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Mountain View Rustic Inn located in Bloomington, China.",
    "faqs": []
  },
  {
    "id": 17,
    "name": "JW Orchid Boutique Hotel",
    "type": "Hotel",
    "city": "Lake Annetta",
    "country": "French Polynesia",
    "price": 129,
    "priceUnit": "/ night",
    "priceunit": "EUR",
    "rating": 0,
    "reviewCount": 0,
    "status": "verified",
    "managerEmail": "Marques_Beer-Steuber@example.net",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at JW Orchid Boutique Hotel located in Lake Annetta, French Polynesia.",
    "faqs": []
  },
  {
    "id": 18,
    "name": "Silver Birch Travellers Inn",
    "type": "Inn",
    "city": "Alexandreview",
    "country": "Bosnia and Herzegovina",
    "price": 74,
    "priceUnit": "/ night",
    "priceunit": "GBP",
    "rating": 0,
    "reviewCount": 0,
    "status": "active",
    "managerEmail": "Carmella44@example.net",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Silver Birch Travellers Inn located in Alexandreview, Bosnia and Herzegovina.",
    "faqs": []
  },
  {
    "id": 19,
    "name": "Golden Dragon Oriental Kitchen",
    "type": "Restaurant",
    "city": "Provo",
    "country": "Zambia",
    "price": 46,
    "priceUnit": "/ meal",
    "priceunit": "AED",
    "rating": 0,
    "reviewCount": 0,
    "status": "warned",
    "managerEmail": "Chaya_Gibson87@example.com",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": false,
        "underRepair": false
      }
    ],
    "cuisine": "Multi-Cuisine",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Golden Dragon Oriental Kitchen located in Provo, Zambia.",
    "faqs": []
  },
  {
    "id": 20,
    "name": "Trident Sapphire Resort",
    "type": "Hotel",
    "city": "Port Xavier",
    "country": "Tuvalu",
    "price": 180,
    "priceUnit": "/ night",
    "priceunit": "USD",
    "rating": 0,
    "reviewCount": 0,
    "status": "active",
    "managerEmail": "Brenna3@example.org",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Trident Sapphire Resort located in Port Xavier, Tuvalu.",
    "faqs": []
  },
  {
    "id": 21,
    "name": "The Leela Riverside Palace",
    "type": "Resort",
    "city": "Lake Mavis",
    "country": "French Polynesia",
    "price": 197,
    "priceUnit": "/ night",
    "priceunit": "INR",
    "rating": 0,
    "reviewCount": 0,
    "status": "flagged",
    "managerEmail": "Justice.McKenzie@example.net",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at The Leela Riverside Palace located in Lake Mavis, French Polynesia.",
    "faqs": []
  },
  {
    "id": 22,
    "name": "Saffron Lounge & Bar",
    "type": "Restaurant",
    "city": "East Arlene",
    "country": "Faroe Islands",
    "price": 73,
    "priceUnit": "/ meal",
    "priceunit": "EUR",
    "rating": 0,
    "reviewCount": 0,
    "status": "pending review",
    "managerEmail": "Sherman66@example.com",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": false,
        "underRepair": false
      }
    ],
    "cuisine": "Multi-Cuisine",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Saffron Lounge & Bar located in East Arlene, Faroe Islands.",
    "faqs": []
  },
  {
    "id": 23,
    "name": "Novotel Panorama Tower",
    "type": "Hotel",
    "city": "Doylefield",
    "country": "Chile",
    "price": 231,
    "priceUnit": "/ night",
    "priceunit": "GBP",
    "rating": 0,
    "reviewCount": 0,
    "status": "active",
    "managerEmail": "Derrick62@example.net",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Novotel Panorama Tower located in Doylefield, Chile.",
    "faqs": []
  },
  {
    "id": 24,
    "name": "Green Valley Orchard Inn",
    "type": "Inn",
    "city": "Zulaufchester",
    "country": "Aruba",
    "price": 152,
    "priceUnit": "/ night",
    "priceunit": "AED",
    "rating": 0,
    "reviewCount": 0,
    "status": "active",
    "managerEmail": "Billy58@example.org",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Green Valley Orchard Inn located in Zulaufchester, Aruba.",
    "faqs": []
  },
  {
    "id": 25,
    "name": "Sheraton Crown Palace",
    "type": "Hotel",
    "city": "Port Mylesside",
    "country": "Estonia",
    "price": 265,
    "priceUnit": "/ night",
    "priceunit": "USD",
    "rating": 0,
    "reviewCount": 0,
    "status": "verified",
    "managerEmail": "Connie_Kunde95@example.net",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Sheraton Crown Palace located in Port Mylesside, Estonia.",
    "faqs": []
  },
  {
    "id": 26,
    "name": "Old Oak Heritage Inn",
    "type": "Inn",
    "city": "Robynshire",
    "country": "Montserrat",
    "price": 68,
    "priceUnit": "/ night",
    "priceunit": "INR",
    "rating": 0,
    "reviewCount": 0,
    "status": "active",
    "managerEmail": "Oswald.Ernser93@example.com",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Old Oak Heritage Inn located in Robynshire, Montserrat.",
    "faqs": []
  },
  {
    "id": 27,
    "name": "Urban Tadka Gourmet Diner",
    "type": "Restaurant",
    "city": "Levifield",
    "country": "Malawi",
    "price": 43,
    "priceUnit": "/ meal",
    "priceunit": "EUR",
    "rating": 0,
    "reviewCount": 0,
    "status": "warned",
    "managerEmail": "Will86@example.net",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": false,
        "underRepair": false
      }
    ],
    "cuisine": "Multi-Cuisine",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Urban Tadka Gourmet Diner located in Levifield, Malawi.",
    "faqs": []
  },
  {
    "id": 28,
    "name": "Hilton Serenity Hotel",
    "type": "Hotel",
    "city": "Bethborough",
    "country": "Kazakhstan",
    "price": 316,
    "priceUnit": "/ night",
    "priceunit": "GBP",
    "rating": 0,
    "reviewCount": 0,
    "status": "active",
    "managerEmail": "Sandy_Turner77@example.com",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Hilton Serenity Hotel located in Bethborough, Kazakhstan.",
    "faqs": []
  },
  {
    "id": 29,
    "name": "Fortune Landmark Suites",
    "type": "Resort",
    "city": "Lamontport",
    "country": "Tajikistan",
    "price": 333,
    "priceUnit": "/ night",
    "priceunit": "AED",
    "rating": 0,
    "reviewCount": 0,
    "status": "flagged",
    "managerEmail": "Alice.Shanahan1@example.com",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Fortune Landmark Suites located in Lamontport, Tajikistan.",
    "faqs": []
  },
  {
    "id": 30,
    "name": "Olive & Basil Mediterranean",
    "type": "Restaurant",
    "city": "New Bennieport",
    "country": "Kiribati",
    "price": 70,
    "priceUnit": "/ meal",
    "priceunit": "USD",
    "rating": 0,
    "reviewCount": 0,
    "status": "pending review",
    "managerEmail": "Lilian_Rutherford@example.org",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": false,
        "underRepair": false
      }
    ],
    "cuisine": "Multi-Cuisine",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Olive & Basil Mediterranean located in New Bennieport, Kiribati.",
    "faqs": []
  },
  {
    "id": 31,
    "name": "Vivanta Emerald Retreat",
    "type": "Hotel",
    "city": "Fort Amarichester",
    "country": "Zambia",
    "price": 367,
    "priceUnit": "/ night",
    "priceunit": "INR",
    "rating": 0,
    "reviewCount": 0,
    "status": "active",
    "managerEmail": "Elody49@example.com",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Vivanta Emerald Retreat located in Fort Amarichester, Zambia.",
    "faqs": []
  },
  {
    "id": 32,
    "name": "Canyon Creek Country Inn",
    "type": "Inn",
    "city": "Gutkowskiton",
    "country": "Gibraltar",
    "price": 146,
    "priceUnit": "/ night",
    "priceunit": "EUR",
    "rating": 0,
    "reviewCount": 0,
    "status": "active",
    "managerEmail": "Gillian_Block70@example.net",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Canyon Creek Country Inn located in Gutkowskiton, Gibraltar.",
    "faqs": []
  },
  {
    "id": 33,
    "name": "The Grand Chancellor",
    "type": "Hotel",
    "city": "New Precious",
    "country": "New Zealand",
    "price": 121,
    "priceUnit": "/ night",
    "priceunit": "GBP",
    "rating": 0,
    "reviewCount": 0,
    "status": "verified",
    "managerEmail": "Creola_Boehm-Franecki@example.net",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at The Grand Chancellor located in New Precious, New Zealand.",
    "faqs": []
  },
  {
    "id": 34,
    "name": "Lakeside Breeze Inn",
    "type": "Inn",
    "city": "South Paytonbury",
    "country": "Lesotho",
    "price": 62,
    "priceUnit": "/ night",
    "priceunit": "AED",
    "rating": 0,
    "reviewCount": 0,
    "status": "active",
    "managerEmail": "Carleton_Powlowski23@example.net",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Lakeside Breeze Inn located in South Paytonbury, Lesotho.",
    "faqs": []
  },
  {
    "id": 35,
    "name": "The Copper Kettle Brassiere",
    "type": "Restaurant",
    "city": "Stoltenbergchester",
    "country": "Armenia",
    "price": 40,
    "priceUnit": "/ meal",
    "priceunit": "USD",
    "rating": 0,
    "reviewCount": 0,
    "status": "warned",
    "managerEmail": "Lucie20@example.com",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": false,
        "underRepair": false
      }
    ],
    "cuisine": "Multi-Cuisine",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at The Copper Kettle Brassiere located in Stoltenbergchester, Armenia.",
    "faqs": []
  },
  {
    "id": 36,
    "name": "St. Regis Sapphire Pavilion",
    "type": "Hotel",
    "city": "Medford",
    "country": "Moldova",
    "price": 172,
    "priceUnit": "/ night",
    "priceunit": "INR",
    "rating": 0,
    "reviewCount": 0,
    "status": "active",
    "managerEmail": "Petra15@example.com",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at St. Regis Sapphire Pavilion located in Medford, Moldova.",
    "faqs": []
  },
  {
    "id": 37,
    "name": "The Grand Oberoi Palace",
    "type": "Resort",
    "city": "East Ida",
    "country": "Peru",
    "price": 189,
    "priceUnit": "/ night",
    "priceunit": "EUR",
    "rating": 0,
    "reviewCount": 0,
    "status": "flagged",
    "managerEmail": "Barbara32@example.org",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at The Grand Oberoi Palace located in East Ida, Peru.",
    "faqs": []
  },
  {
    "id": 38,
    "name": "Smokehouse BBQ & Grille",
    "type": "Restaurant",
    "city": "Terrillboro",
    "country": "French Guiana",
    "price": 67,
    "priceUnit": "/ meal",
    "priceunit": "GBP",
    "rating": 0,
    "reviewCount": 0,
    "status": "pending review",
    "managerEmail": "Grover19@example.org",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": false,
        "underRepair": false
      }
    ],
    "cuisine": "Multi-Cuisine",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Smokehouse BBQ & Grille located in Terrillboro, French Guiana.",
    "faqs": []
  },
  {
    "id": 39,
    "name": "Heritage Bay Hotel & Suites",
    "type": "Hotel",
    "city": "North Laurel",
    "country": "Turkey",
    "price": 223,
    "priceUnit": "/ night",
    "priceunit": "AED",
    "rating": 0,
    "reviewCount": 0,
    "status": "active",
    "managerEmail": "Buck54@example.net",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Heritage Bay Hotel & Suites located in North Laurel, Turkey.",
    "faqs": []
  },
  {
    "id": 40,
    "name": "Sunlit Meadow Travelers Inn",
    "type": "Inn",
    "city": "Bentonville",
    "country": "Israel",
    "price": 140,
    "priceUnit": "/ night",
    "priceunit": "USD",
    "rating": 0,
    "reviewCount": 0,
    "status": "active",
    "managerEmail": "Sierra_Murray@example.org",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Sunlit Meadow Travelers Inn located in Bentonville, Israel.",
    "faqs": []
  },
  {
    "id": 41,
    "name": "Marriott Coastal Haven",
    "type": "Hotel",
    "city": "Rosinaborough",
    "country": "Romania",
    "price": 257,
    "priceUnit": "/ night",
    "priceunit": "INR",
    "rating": 0,
    "reviewCount": 0,
    "status": "verified",
    "managerEmail": "Hermann.Walker@example.com",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Marriott Coastal Haven located in Rosinaborough, Romania.",
    "faqs": []
  },
  {
    "id": 42,
    "name": "Pine Haven Quaint Inn",
    "type": "Inn",
    "city": "Irondequoit",
    "country": "Monaco",
    "price": 166,
    "priceUnit": "/ night",
    "priceunit": "EUR",
    "rating": 0,
    "reviewCount": 0,
    "status": "active",
    "managerEmail": "Myrtice2@example.com",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Pine Haven Quaint Inn located in Irondequoit, Monaco.",
    "faqs": []
  },
  {
    "id": 43,
    "name": "Zen Teppanyaki Lounge",
    "type": "Restaurant",
    "city": "Beerview",
    "country": "Barbados",
    "price": 37,
    "priceUnit": "/ meal",
    "priceunit": "GBP",
    "rating": 0,
    "reviewCount": 0,
    "status": "warned",
    "managerEmail": "Jacques86@example.org",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": false,
        "underRepair": false
      }
    ],
    "cuisine": "Multi-Cuisine",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Zen Teppanyaki Lounge located in Beerview, Barbados.",
    "faqs": []
  },
  {
    "id": 44,
    "name": "The Ritz Carlton Downtown",
    "type": "Hotel",
    "city": "East Cassidy",
    "country": "Sweden",
    "price": 308,
    "priceUnit": "/ night",
    "priceunit": "AED",
    "rating": 0,
    "reviewCount": 0,
    "status": "active",
    "managerEmail": "Elyse_Fisher20@example.net",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at The Ritz Carlton Downtown located in East Cassidy, Sweden.",
    "faqs": []
  },
  {
    "id": 45,
    "name": "Taj Exotica Horizon",
    "type": "Resort",
    "city": "Dessieside",
    "country": "Pakistan",
    "price": 325,
    "priceUnit": "/ night",
    "priceunit": "USD",
    "rating": 0,
    "reviewCount": 0,
    "status": "flagged",
    "managerEmail": "Brandt.Auer26@example.com",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Taj Exotica Horizon located in Dessieside, Pakistan.",
    "faqs": []
  },
  {
    "id": 46,
    "name": "Ambrosia Continental Kitchen",
    "type": "Restaurant",
    "city": "Lake Forrestcester",
    "country": "Mali",
    "price": 64,
    "priceUnit": "/ meal",
    "priceunit": "INR",
    "rating": 0,
    "reviewCount": 0,
    "status": "pending review",
    "managerEmail": "Jacquelyn.Rolfson@example.net",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": false,
        "underRepair": false
      }
    ],
    "cuisine": "Multi-Cuisine",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Ambrosia Continental Kitchen located in Lake Forrestcester, Mali.",
    "faqs": []
  },
  {
    "id": 47,
    "name": "Hyatt Regency Gardenia",
    "type": "Hotel",
    "city": "Lake Yasmeen",
    "country": "Bosnia and Herzegovina",
    "price": 359,
    "priceUnit": "/ night",
    "priceunit": "EUR",
    "rating": 0,
    "reviewCount": 0,
    "status": "active",
    "managerEmail": "Quentin.Weimann46@example.com",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Hyatt Regency Gardenia located in Lake Yasmeen, Bosnia and Herzegovina.",
    "faqs": []
  },
  {
    "id": 48,
    "name": "Riverstone Country Lodge",
    "type": "Inn",
    "city": "Danielacester",
    "country": "Virgin Islands U.S.",
    "price": 134,
    "priceUnit": "/ night",
    "priceunit": "GBP",
    "rating": 0,
    "reviewCount": 0,
    "status": "active",
    "managerEmail": "Perry_Mayer1@example.org",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Riverstone Country Lodge located in Danielacester, Virgin Islands U.S..",
    "faqs": []
  },
  {
    "id": 49,
    "name": "The Imperial Luxury Suites",
    "type": "Hotel",
    "city": "New Stephan",
    "country": "Costa Rica",
    "price": 393,
    "priceUnit": "/ night",
    "priceunit": "AED",
    "rating": 0,
    "reviewCount": 0,
    "status": "verified",
    "managerEmail": "Keely19@example.org",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at The Imperial Luxury Suites located in New Stephan, Costa Rica.",
    "faqs": []
  },
  {
    "id": 50,
    "name": "Highland Mist Guest Inn",
    "type": "Inn",
    "city": "Jeromeworth",
    "country": "Tanzania",
    "price": 160,
    "priceUnit": "/ night",
    "priceunit": "USD",
    "rating": 0,
    "reviewCount": 0,
    "status": "active",
    "managerEmail": "Ryley_Braun@example.com",
    "image": "",
    "images": [],
    "password": "freewifi@123",
    "amenities": [
      {
        "name": "Free WiFi",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Pool",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Gym",
        "available": false,
        "underRepair": false
      },
      {
        "name": "Restaurant",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Parking",
        "available": true,
        "underRepair": false
      },
      {
        "name": "Room Service",
        "available": true,
        "underRepair": false
      }
    ],
    "cuisine": "International",
    "openTime": "07:00 AM",
    "closeTime": "11:00 PM",
    "minStay": 1,
    "description": "Experience exceptional hospitality, exquisite dining, and world-class comfort at Highland Mist Guest Inn located in Jeromeworth, Tanzania.",
    "faqs": []
  }
];

initialProperties.forEach(p => {
  if (p.type === 'Restaurant') p.faqs = restaurantFaqs;
  else if (p.type === 'Inn') p.faqs = innFaqs;
  else p.faqs = hotelFaqs;
});
