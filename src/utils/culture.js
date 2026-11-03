export const COUNTRY_CULTURE_REGISTRY = {
  "Bulgaria": {
    regionName: "Balkan Rose Valley & Thracian Heartland",
    handcrafts: "Kazanlak rose-oil wood flasks, Kalofer needle-lace, traditional Bulgarian Troyan ceramics, and hand-loomed Rhodope wool kilims.",
    artworks: "Thracian gold repoussé exhibits, Revival-era carved wooden ceilings, and orthodox iconographic tempera frescoes.",
    nearbyAttractions: [
      "Historic Old Town Lukasboro Heritage Quarter (5 mins)",
      "Thracian Valley Rose Distilleries & Botique Apiaries (15 mins)",
      "Ancient Fortress & Balkan Panorama Lookout (25 mins)"
    ],
    signatureExperience: "Evening folklore storytelling with artisanal Banitsa pastry baking and Bulgarian rose-petal cordial tasting."
  },
  "Liechtenstein": {
    regionName: "Upper Rhine Valley & Alpine Principality",
    handcrafts: "Artisanal Alpine chronometer woodcraft, etched crystal glasswork, hand-stitched leather hiking gear, and rustic pine carvings.",
    artworks: "Vaduz Castle renaissance tapestries, contemporary Alpine metal sculptures, and princely collection fine art prints.",
    nearbyAttractions: [
      "Prince's Castle Cliffside Vineyard Walk (10 mins)",
      "High Alpine Panorama Ski & Meadow Trail (20 mins)",
      "Artisanal Stamp Museum & Alpine Clock Guild (12 mins)"
    ],
    signatureExperience: "Alpine sunset wine-degustation paired with local handcrafted mountain cheeses and herbal fondues."
  },
  "Tokelau": {
    regionName: "Polynesian Coral Atoll & Pacific Sanctuary",
    handcrafts: "Hand-woven pandanus laufala mats, carved Kanava wood canoes, black-lip mother-of-pearl jewelry, and traditional fish hooks.",
    artworks: "Polynesian tapa bark cloth tapestries, ocean voyaging star-charts, and ancestral basalt monolith engravings.",
    nearbyAttractions: [
      "Pristine Turquoise Lagoon & Sea Turtle Sanctuary (3 mins)",
      "Traditional Fale Artisan Weaving Pavilion (8 mins)",
      "Outer Barrier Reef Sunset Outrigger Tour (15 mins)"
    ],
    signatureExperience: "Traditional evening Fatele dance celebration with fresh coconut-crusted seafood baked in earth imu pits."
  },
  "India": {
    regionName: "Royal Heritage & Artisanal Silk Corridor",
    handcrafts: "Hand-knotted Kashmiri pashmina silks, carved walnut woodcraft, Jaipur blue pottery, and beaten brass filigree lanterns.",
    artworks: "Mughal miniature paintings, intricate Rajasthani Jharokha stone jaali arches, and hand-painted Pichwai tapestries.",
    nearbyAttractions: [
      "Historic Royal Fort & Palace Terraces (10 mins)",
      "Heritage Spice & Silk Bazaars (15 mins)",
      "Sunset Lakeside Ghats & Artisanal Pottery Colony (20 mins)"
    ],
    signatureExperience: "Courtyard sitar and tabla musical soiree featuring royal clay-oven kababs and saffron-infused saffron Kahwa tea."
  },
  "China": {
    regionName: "Ancient Silk Road & Imperial Porcelain Basin",
    handcrafts: "Jingdezhen blue-and-white porcelain, hand-spun Suzhou silk embroidery, Yixing purple clay teaware, and jade filigree carving.",
    artworks: "Traditional Shan-shui ink wash scroll paintings, Ming dynasty wooden screens, and imperial lacquer calligraphy plaques.",
    nearbyAttractions: [
      "Ancient Canal Town & Moon Bridges (10 mins)",
      "Terraced Mountain Tea Plantation & Pagoda (20 mins)",
      "Imperial Heritage Garden & Dragon Pavilion (15 mins)"
    ],
    signatureExperience: "Master tea ceremony showcasing vintage Gongfu Pu-erh paired with artisanal hand-pressed lotus pastries."
  },
  "United Kingdom": {
    regionName: "Cotswolds & Historic Manor Countryside",
    handcrafts: "Hand-thrown Cornish stoneware, bespoke Harris Tweed weaving, Sheffield forged silver cutlery, and English lavender oil craft.",
    artworks: "Georgian watercolor landscapes, bespoke stained glass rondels, and antique botanical copper engravings.",
    nearbyAttractions: [
      "Historic Roman Aqueduct & Cobblestone High Street (8 mins)",
      "Manor Botanical Gardens & Ancient Oak Woods (14 mins)",
      "Local Artisanal Cider Mills & Thatch Cottage Trail (18 mins)"
    ],
    signatureExperience: "Traditional high-tea service featuring warm scones with clotted cream and elderflower gin cordial."
  },
  "Norway": {
    regionName: "Nordic Fjord & Viking Artisan Shore",
    handcrafts: "Traditional Selbu rose knitwear, carved birch bark vessels, hand-forged Damascus steel hunting blades, and Sami silver tin thread work.",
    artworks: "Fjord landscape oil canvases, Viking knotwork wood carvings, and contemporary Nordic blown glass installations.",
    nearbyAttractions: [
      "Glacier Fjord Lookout & Kayak Departure Pier (5 mins)",
      "Historic Stave Church & Folk Architecture Reserve (18 mins)",
      "Coastal Waterfall & Troll Mountain Pass (25 mins)"
    ],
    signatureExperience: "Fireside Nordic culinary tasting with cured Arctic char, cloudberry preserves, and spiced gløgg."
  },
  "El Salvador": {
    regionName: "Volcanic Cordillera & Maya Pipil Coast",
    handcrafts: "Hand-painted La Palma copinol wood miniatures, artisanal Ilobasco clay figurines, and indigo dyed organic cotton textiles.",
    artworks: "Pre-Columbian Mayan ceramic replicas, volcanic stone reliefs, and vibrant Latin American mural canvases.",
    nearbyAttractions: [
      "Balsam Coast Black Sand Surf Sanctuary (10 mins)",
      "Volcano Crater Rim & Cloud Forest Canopy (22 mins)",
      "Colonial Flower Route Artisanal Weaving Villages (30 mins)"
    ],
    signatureExperience: "Handmade pupusa gastronomy masterclass cooked on volcanic clay comals with freshly harvested mountain coffee."
  }
};

export function getVenueCulture(property) {
  if (!property) {
    return {
      regionName: "Local Cultural Heritage Zone",
      handcrafts: "Regional artisanal textiles, ceramic handicrafts, and traditional folk handworks.",
      artworks: "Heritage regional art exhibitions and architectural woodcraft.",
      nearbyAttractions: [
        "Old Heritage Town Quarter (10 mins)",
        "Artisanal Market & Craft Workshops (15 mins)",
        "Scenic Mountain or Waterfront Vista (20 mins)"
      ],
      signatureExperience: "Authentic local culinary showcase featuring native ingredients and traditional music."
    };
  }

  const country = String(property.country || "").trim();
  if (COUNTRY_CULTURE_REGISTRY[country]) {
    return COUNTRY_CULTURE_REGISTRY[country];
  }

  const keys = Object.keys(COUNTRY_CULTURE_REGISTRY);
  for (let i = 0; i < keys.length; i++) {
    if (country.toLowerCase().includes(keys[i].toLowerCase())) {
      return COUNTRY_CULTURE_REGISTRY[keys[i]];
    }
  }

  const idNum = Number(property.id) || 1;
  const craftOptions = [
    "Locally forged bronze filigree, hand-loomed flax linens, and artisanal terracotta pottery.",
    "Hand-blown art glassware, native hardwood marquetry, and botanical scented soapcraft.",
    "Embroidered silk tapestries, hand-chiseled stone statuettes, and heritage copper tableware.",
    "Intricate wicker basketry, hand-pressed botanical paper art, and artisanal leather goods."
  ];

  const artOptions = [
    "Regional oil landscape galleries and historic architectural bas-reliefs.",
    "Contemporary indigenous sculpture garden and antique hand-painted ceramic murals.",
    "Heritage guild watercolor paintings and carved timber lintels reflecting folklore.",
    "Bespoke mosaic stone medallions and gilded ironwork reflecting local maritime heritage."
  ];

  const spotOptions = [
    [
      `Historic ${property.city} Old Town Square & Clocktower (5 mins)`,
      "Local Farmers Market & Artisanal Craft Pavilion (12 mins)",
      "Panoramic Valley Lookout & Heritage Walking Path (20 mins)"
    ],
    [
      `Colonial Harbor Promenade & Marine Artisan Pier (8 mins)`,
      "Historic Botanical Arboretum & Sculpture Walk (15 mins)",
      "Ancient Castle Ruins & Sunset Coastal Trail (22 mins)"
    ],
    [
      `Regional Cultural Arts Center & Folk Music Hall (7 mins)`,
      "Old Guildhall Artisanal Workshops (14 mins)",
      "Scenic Riverbend Reserve & Heritage Vineyard (25 mins)"
    ]
  ];

  return {
    regionName: `${property.city} Heritage & Local Artisanship District`,
    handcrafts: craftOptions[idNum % craftOptions.length],
    artworks: artOptions[idNum % artOptions.length],
    nearbyAttractions: spotOptions[idNum % spotOptions.length],
    signatureExperience: `Traditional ${property.city} welcome reception featuring regional culinary delicacies, local folk melodies, and complimentary heritage walking guides.`
  };
}
