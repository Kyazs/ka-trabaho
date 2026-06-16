/**
 * TESDA Data — Enhanced & Accuracy-Corrected
 * Last reviewed: June 2026
 *
 * Key corrections from original:
 * 1. Caregiving NC II duration: corrected from 960 hrs → 786 hrs (TESDA official)
 * 2. SMAW NC I duration: corrected from 224 hrs → 268 hrs (matches TESDA-PTC Urdaneta)
 * 3. SMAW NC II entryReq: added bilingual object (was a bare string)
 * 4. Salary ranges updated to 2025–2026 benchmarks (PSA OWS 2024, Aniday, degrees.ph)
 * 5. Technical Support salary raised to ₱20,000–₱28,000 (entry-level BPO PH 2025)
 * 6. R9 provinces cleaned: removed duplicate "Zamboanga City" standalone entry
 * 7. FAQ: corrected UAQTE reference — it covers TVET, not tertiary education per se
 * 8. Added PESFA/TWSP scholarship detail and ₱350/day Tsuper Iskolar note
 * 9. Added 3 new courses: Housekeeping NC II, Plumbing NC II, Contact Center Services NC II
 * 10. Added 2 new sectors: Automotive & Transport, Creative Digital Media
 * 11. Added new FAQ items (assessment fees, NCII vs COC, overseas pathway)
 * 12. Region topSectors updated to reflect ICT growth in R10 and R11
 */

export interface TesdaCourse {
  code: string;
  name: string;
  level: string; // e.g., "NC I", "NC II", "NC III", "COC", "Micro-credential"
  duration: string; // e.g., "268 Hours (Approx. 2 months)"
  description: string;
  entryReq: { fil: string; en: string };
  skillsAcquired: string[];
  assessmentFee?: string; // TESDA Circular 2024 fee reference
  overseasPathway?: string; // Countries/roles for overseas deployment
}

export interface JobRole {
  title: string;
  averageSalary: string;
  overseasSalary?: string; // Overseas salary range where applicable
  demandLevel: "High" | "Very High" | "Emerging";
  description: string;
  mappedCourses: string[]; // TESDA course codes
}

export interface Sector {
  id: string;
  name: string;
  iconName: string; // Lucide icon reference
  description: string;
  jobs: JobRole[];
  courses: TesdaCourse[];
}

export interface RegionInfo {
  code: string;
  name: string;
  provinces: string[];
  topSectors: string[]; // Sector IDs
  islandGroup: "Luzon" | "Visayas" | "Mindanao";
}

// ─────────────────────────────────────────────
// REGIONS
// ─────────────────────────────────────────────

export const PHILIPPINES_REGIONS: RegionInfo[] = [
  {
    code: "NCR",
    name: "NCR (National Capital Region)",
    provinces: [
      "Metro Manila – North (Caloocan, Valenzuela, Malabon, Navotas)",
      "Metro Manila – East (Quezon City, Marikina, Pasig, San Juan, Mandaluyong)",
      "Metro Manila – South (Makati, Taguig, Pasay, Las Piñas, Muntinlupa, Parañaque)",
      "Metro Manila – West (Manila, Pateros)"
    ],
    topSectors: ["ict", "tourism", "wellness", "creative"],
    islandGroup: "Luzon"
  },
  {
    code: "CAR",
    name: "CAR (Cordillera Administrative Region)",
    provinces: ["Benguet", "Ifugao", "Mountain Province", "Abra", "Kalinga", "Apayao"],
    topSectors: ["agriculture", "tourism", "construction"],
    islandGroup: "Luzon"
  },
  {
    code: "R1",
    name: "Region I (Ilocos Region)",
    provinces: ["Ilocos Norte", "Ilocos Sur", "La Union", "Pangasinan"],
    topSectors: ["agriculture", "tourism", "construction"],
    islandGroup: "Luzon"
  },
  {
    code: "R2",
    name: "Region II (Cagayan Valley)",
    provinces: ["Cagayan", "Isabela", "Nueva Vizcaya", "Quirino", "Batanes"],
    topSectors: ["agriculture", "construction", "tourism"],
    islandGroup: "Luzon"
  },
  {
    code: "R3",
    name: "Region III (Central Luzon)",
    provinces: ["Pampanga", "Bulacan", "Bataan", "Zambales", "Tarlac", "Nueva Ecija", "Aurora"],
    topSectors: ["construction", "agriculture", "automotive"],
    islandGroup: "Luzon"
  },
  {
    code: "R4A",
    name: "Region IV-A (Calabarzon)",
    provinces: ["Cavite", "Laguna", "Batangas", "Rizal", "Quezon"],
    topSectors: ["ict", "construction", "automotive"],
    islandGroup: "Luzon"
  },
  {
    code: "R4B",
    name: "Region IV-B (Mimaropa)",
    provinces: ["Oriental Mindoro", "Occidental Mindoro", "Marinduque", "Romblon", "Palawan"],
    topSectors: ["tourism", "agriculture", "wellness"],
    islandGroup: "Luzon"
  },
  {
    code: "R5",
    name: "Region V (Bicol Region)",
    provinces: ["Albay", "Camarines Sur", "Camarines Norte", "Catanduanes", "Masbate", "Sorsogon"],
    topSectors: ["agriculture", "tourism", "construction"],
    islandGroup: "Luzon"
  },
  {
    code: "R6",
    name: "Region VI (Western Visayas)",
    provinces: ["Iloilo", "Negros Occidental", "Aklan", "Capiz", "Antique", "Guimaras"],
    topSectors: ["tourism", "ict", "agriculture"],
    islandGroup: "Visayas"
  },
  {
    code: "R7",
    name: "Region VII (Central Visayas)",
    provinces: ["Cebu", "Bohol", "Negros Oriental", "Siquijor"],
    topSectors: ["ict", "tourism", "construction"],
    islandGroup: "Visayas"
  },
  {
    code: "R8",
    name: "Region VIII (Eastern Visayas)",
    provinces: ["Leyte", "Southern Leyte", "Samar", "Eastern Samar", "Northern Samar", "Biliran"],
    topSectors: ["agriculture", "construction", "tourism"],
    islandGroup: "Visayas"
  },
  {
    code: "R9",
    name: "Region IX (Zamboanga Peninsula)",
    provinces: [
      "Zamboanga del Sur (Zamboanga City, Pagadian)",
      "Zamboanga del Norte (Dipolog, Dapitan)",
      "Zamboanga Sibugay (Ipil)"
    ],
    topSectors: ["tourism", "agriculture", "construction"],
    islandGroup: "Mindanao"
  },
  {
    code: "R10",
    name: "Region X (Northern Mindanao)",
    provinces: ["Misamis Oriental", "Misamis Occidental", "Bukidnon", "Camiguin", "Lanao del Norte"],
    topSectors: ["ict", "agriculture", "tourism"],
    islandGroup: "Mindanao"
  },
  {
    code: "R11",
    name: "Region XI (Davao Region)",
    provinces: ["Davao del Sur", "Davao del Norte", "Davao de Oro", "Davao Oriental", "Davao Occidental"],
    topSectors: ["agriculture", "ict", "tourism"],
    islandGroup: "Mindanao"
  },
  {
    code: "R12",
    name: "Region XII (Soccsksargen)",
    provinces: ["South Cotabato", "North Cotabato", "Sultan Kudarat", "Sarangani", "General Santos City"],
    topSectors: ["agriculture", "construction", "tourism"],
    islandGroup: "Mindanao"
  },
  {
    code: "R13",
    name: "Region XIII (Caraga)",
    provinces: ["Agusan del Norte", "Agusan del Sur", "Surigao del Norte", "Surigao del Sur", "Dinagat Islands"],
    topSectors: ["agriculture", "construction", "tourism"],
    islandGroup: "Mindanao"
  },
  {
    code: "BARMM",
    name: "BARMM (Bangsamoro Autonomous Region in Muslim Mindanao)",
    provinces: ["Maguindanao del Norte", "Maguindanao del Sur", "Lanao del Sur", "Sulu", "Tawi-Tawi", "Basilan", "Cotabato City (Special Geographic Area)"],
    topSectors: ["agriculture", "construction", "tourism"],
    islandGroup: "Mindanao"
  }
];

// ─────────────────────────────────────────────
// SECTORS
// ─────────────────────────────────────────────

export const SECTORS_DATA: Sector[] = [
  // ── 1. ICT ──────────────────────────────────
  {
    id: "ict",
    name: "IT-BPM & Web Technology",
    iconName: "Laptop",
    description: "Digital jobs in tech support, website creation, coding, and hardware maintenance. Very popular with youth seeking online-friendly or BPO work in NCR, Cebu, and Iloilo.",
    courses: [
      {
        code: "ICT-CSS2",
        name: "Computer Systems Servicing NC II",
        level: "NC II",
        duration: "280 Hours (Approx. 2 months)",
        description: "Covers installing, configuring, diagnosing, and repairing computer hardware, networks, and operating systems.",
        entryReq: {
          fil: "Nakapagtapos ng Junior High School (o lumang HS Curriculum / ALS graduate)",
          en: "Completed Junior High School (or old HS Curriculum / ALS graduate)"
        },
        skillsAcquired: [
          "PC Assembly & Hardware Diagnosis",
          "Operating System Installation (Windows/Linux)",
          "LAN Cabling & Network Configuration",
          "Software Troubleshooting & Virus Removal"
        ],
        assessmentFee: "Approx. ₱500–₱800 (varies by assessment center)"
      },
      {
        code: "ICT-WD3",
        name: "Web Development NC III",
        level: "NC III",
        duration: "320 Hours (Approx. 2.5 months)",
        description: "Advanced training in creating responsive websites, writing frontend code (HTML/CSS/JS), and deploying web platforms.",
        entryReq: {
          fil: "May CSS NC II o kumpletuhin ang basic computer literacy screening",
          en: "Has CSS NC II or completes basic computer literacy screening"
        },
        skillsAcquired: [
          "HTML5 & CSS3 Layout Design",
          "JavaScript & DOM Interactivity",
          "Basic Database Integration (MySQL)",
          "Deploying & Testing on Live Host Environments"
        ]
      },
      {
        code: "ICT-ANIM3",
        name: "3D Animation NC III",
        level: "NC III",
        duration: "340 Hours (Approx. 3 months)",
        description: "Teaches key skills to create key drawings, secondary 3D frame creations, modeling, and cleanups for video game and media companies.",
        entryReq: {
          fil: "Nakapagtapos ng Elementarya, may basic drawing talent",
          en: "Completed Elementary, with basic drawing talent"
        },
        skillsAcquired: [
          "3D Object Modeling (Blender / Maya basics)",
          "Character Movement & Rigging",
          "Keyframe Animation",
          "Post-Production Digital Editing"
        ]
      },
      {
        code: "ICT-CCS2",
        name: "Contact Center Services NC II",
        level: "NC II",
        duration: "162 Hours (Approx. 1 month)",
        description: "Prepares trainees for BPO and call center work — the largest single source of TVET-linked employment in the Philippines. Covers inbound/outbound calls, live chat, and basic CRM tools.",
        entryReq: {
          fil: "High School o SHS graduate; marunong mag-English nang may malinaw na diction",
          en: "High School or SHS graduate; able to communicate in English with clear diction"
        },
        skillsAcquired: [
          "Inbound Customer Service Scripting",
          "Outbound Telemarketing Fundamentals",
          "Basic CRM & Ticketing System Navigation",
          "Email & Chat Support Etiquette"
        ],
        overseasPathway: "Overseas BPO hubs in Singapore, UAE, and remote work opportunities"
      },
      {
        code: "ICT-MC-CYBER",
        name: "Cybersecurity Fundamentals (Micro-credential)",
        level: "Micro-credential",
        duration: "40 Hours (Approx. 1 week)",
        description: "Short course targeting computer security basic defenses, local group policy configurations, and safe online operations.",
        entryReq: {
          fil: "Basic na pag-unawa sa computer",
          en: "Basic computer understanding"
        },
        skillsAcquired: [
          "Threat Detection Basics",
          "Software Patching & Update Management",
          "Vulnerability Assessment Concepts",
          "Securing Personal & Office Databases"
        ]
      }
    ],
    jobs: [
      {
        title: "Technical Support / Help Desk Representative (BPO)",
        averageSalary: "₱20,000 – ₱28,000 / month",
        overseasSalary: "₱60,000 – ₱110,000 / month equivalent (Singapore, UAE BPO)",
        demandLevel: "Very High",
        description: "Assists customers with tech glitches, network setup, and account support — highly in demand in BPO hubs in NCR, Cebu, Iloilo, Davao, and Clark.",
        mappedCourses: ["ICT-CSS2", "ICT-CCS2", "ICT-MC-CYBER"]
      },
      {
        title: "Computer Repair & Network Technician",
        averageSalary: "₱15,000 – ₱22,000 / month",
        demandLevel: "High",
        description: "Repairs PCs, sets up office internet routers, and runs IT cable networks for retail establishments or corporate offices.",
        mappedCourses: ["ICT-CSS2"]
      },
      {
        title: "Junior Web Developer / WordPress Specialist",
        averageSalary: "₱22,000 – ₱40,000 / month",
        overseasSalary: "₱50,000 – ₱120,000 / month equivalent (remote freelance)",
        demandLevel: "Emerging",
        description: "Builds and edits business websites, runs e-commerce catalog setups, or works as a freelance virtual assistant via platforms like Upwork and Fiverr.",
        mappedCourses: ["ICT-WD3"]
      },
      {
        title: "BPO Customer Service / Chat Support Agent",
        averageSalary: "₱18,000 – ₱26,000 / month",
        demandLevel: "Very High",
        description: "Entry-level BPO agent handling voice, email, or chat accounts for local and international companies. Night differential pay often adds ₱3,000–₱5,000/month.",
        mappedCourses: ["ICT-CCS2"]
      }
    ]
  },

  // ── 2. TOURISM ──────────────────────────────
  {
    id: "tourism",
    name: "Tourism, Hospitality & Culinary",
    iconName: "Utensils",
    description: "Service sector jobs in restaurants, cafes, hotels, and tourist attractions across the country's travel hotspots — Cebu, Boracay, Palawan, Siargao, and Metro Manila.",
    courses: [
      {
        code: "TOU-BAR2",
        name: "Barista NC II",
        level: "NC II",
        duration: "119 Hours (Approx. 1 month)",
        description: "Learn to operate espresso machines, brew high-quality coffees, style latte art, and deliver exemplary customer service in café environments.",
        entryReq: {
          fil: "Kayang makipag-usap sa simple English at Filipino",
          en: "Able to communicate in basic English and Filipino"
        },
        skillsAcquired: [
          "Espresso Machine Operation & Maintenance",
          "Coffee Bean Selection & Grinding",
          "Milk Texturing & Latte Art",
          "Beverage Preparation, Costing & Storage"
        ]
      },
      {
        code: "TOU-FBS2",
        name: "Food and Beverage Services NC II",
        level: "NC II",
        duration: "356 Hours (Approx. 2.5 months)",
        description: "Comprehensive skills for dining room setup, table waiting, taking guest orders, food handling, and billing in restaurants, resorts, and cruise lines.",
        entryReq: {
          fil: "Nakapagtapos ng Elementarya/Elementary ALS; pleasant communication style",
          en: "Completed Elementary / Elementary ALS; pleasant communication style"
        },
        skillsAcquired: [
          "Restaurant Table Setup & Mise en Place",
          "Order Taking & Table Service Protocols",
          "Wine & Beverage Service",
          "Prompt Complaint Handling"
        ],
        overseasPathway: "Cruise ships, hotels in Middle East, Hong Kong, Singapore"
      },
      {
        code: "TOU-BPP2",
        name: "Bread and Pastry Production NC II",
        level: "NC II",
        duration: "141 Hours (Approx. 1 month)",
        description: "Baking foundations: breads, cookies, cakes, pastries, fillings, and proper food storage for commercial and home-based production.",
        entryReq: {
          fil: "Marunong magbasa at magsulat sa English at Filipino",
          en: "Able to read and write in English and Filipino"
        },
        skillsAcquired: [
          "Baking Temperature & Measurement Accuracy",
          "Dough Kneading & Proofing Techniques",
          "Pastry Decorating & Finishing",
          "Food Preservation, Packaging & Hygiene"
        ]
      },
      {
        code: "TOU-CK2",
        name: "Cookery NC II",
        level: "NC II",
        duration: "316 Hours (Approx. 2.5 months)",
        description: "Become a professional kitchen prep and hot cook. Learn menu planning, hot food prep, stocks, sauces, meat cooking, and kitchen hygiene.",
        entryReq: {
          fil: "Nakapagtapos ng Elementarya o katumbas (ALS)",
          en: "Completed Elementary or its equivalent (ALS)"
        },
        skillsAcquired: [
          "Culinary Knife Skills & Mise en Place",
          "Stocks, Sauces & Soups",
          "Standard Meat, Seafood & Vegetable Cookery",
          "Kitchen Workstation Sanitation (HACCP basics)"
        ],
        overseasPathway: "Hotel kitchens in UAE, Qatar, Singapore, cruise lines"
      },
      {
        code: "TOU-HK2",
        name: "Housekeeping NC II",
        level: "NC II",
        duration: "196 Hours (Approx. 1.5 months)",
        description: "Trains candidates to maintain guest rooms, public areas, and linen operations in hotels and resorts to international cleanliness standards.",
        entryReq: {
          fil: "Nakakaintindi ng basic English; marunong magbasa at magsulat",
          en: "Understands basic English; able to read and write"
        },
        skillsAcquired: [
          "Guest Room Cleaning & Turndown Procedures",
          "Linen & Laundry Management",
          "Chemical Safety & MSDS Handling",
          "Lost & Found and Guest Property Protocols"
        ],
        overseasPathway: "Hotels in Middle East, cruise ships, Singapore resorts"
      }
    ],
    jobs: [
      {
        title: "Specialty Café Barista",
        averageSalary: "₱13,000 – ₱18,000 / month",
        demandLevel: "Very High",
        description: "Brews espresso drinks and specialty beverages, manages café registers — booming as café culture grows in cities and regional hubs.",
        mappedCourses: ["TOU-BAR2"]
      },
      {
        title: "Hotel & Resort Food Server / Steward",
        averageSalary: "₱14,000 – ₱20,000 / month",
        overseasSalary: "₱40,000 – ₱80,000 / month equivalent (cruise ships, Middle East hotels)",
        demandLevel: "High",
        description: "Waitstaff at major hotels, resorts, or cruise ships, typically receiving service charge on top of base salary.",
        mappedCourses: ["TOU-FBS2"]
      },
      {
        title: "Bakehouse Assistant / Pastry Cook",
        averageSalary: "₱12,500 – ₱18,500 / month",
        demandLevel: "High",
        description: "Prepares desserts for cake shops, bakes bread inventories in commercial bakeries, or powers home-based baking micro-enterprises.",
        mappedCourses: ["TOU-BPP2"]
      },
      {
        title: "Prep Cook / Kitchen Assistant",
        averageSalary: "₱14,000 – ₱22,000 / month",
        overseasSalary: "₱50,000 – ₱90,000 / month equivalent (Middle East, Singapore)",
        demandLevel: "High",
        description: "Prepares ingredients, mans fast food lines, or works as a junior cook in restaurant kitchens. High overseas demand via POEA-deployed routes.",
        mappedCourses: ["TOU-CK2"]
      },
      {
        title: "Hotel Housekeeper / Room Attendant",
        averageSalary: "₱13,000 – ₱18,000 / month",
        overseasSalary: "₱45,000 – ₱75,000 / month equivalent (Saudi Arabia, Qatar, UAE)",
        demandLevel: "Very High",
        description: "Maintains guest rooms to hotel brand standards; one of the most-deployed categories for overseas Filipino workers in hospitality.",
        mappedCourses: ["TOU-HK2"]
      }
    ]
  },

  // ── 3. CONSTRUCTION ─────────────────────────
  {
    id: "construction",
    name: "Welding, Electrical & Technical Trades",
    iconName: "Hammer",
    description: "In-demand blueprint, technical, and skilled labor jobs feeding the massive private and public infrastructure boom (BBB Program, renewable energy projects) across all regions.",
    courses: [
      {
        code: "CON-SMAW1",
        name: "Shielded Metal Arc Welding (SMAW) NC I",
        level: "NC I",
        // CORRECTION: Official TESDA training duration is 268 hrs, not 224 hrs
        duration: "268 Hours (Approx. 2 months)",
        description: "Basic industrial entry training covering manual stick welding, safety protocols, plate preparations, and joint selections for flat and horizontal positions.",
        entryReq: {
          fil: "Nakapagtapos ng Elementarya; physically fit",
          en: "Completed Elementary; physically fit"
        },
        skillsAcquired: [
          "Basic Welding Machine Setup & Maintenance",
          "Flat & Horizontal Welding Positions",
          "PPE & Welding Safety Gear Setup",
          "Structural Metal Cutting & Grinding"
        ],
        assessmentFee: "Approx. ₱2,697 (TESDA Circular #072 s.2021, verify current rates)"
      },
      {
        code: "CON-SMAW2",
        name: "Shielded Metal Arc Welding (SMAW) NC II",
        level: "NC II",
        duration: "268 Hours (Approx. 2 months)",
        description: "Advanced stick welding skills focusing on pipe and groove welds, carbon steel welding, and structural joints in multiple positions.",
        entryReq: {
          fil: "May SMAW NC I o beripikadong katumbas na karanasan",
          en: "Has SMAW NC I or verified equivalent industry experience"
        },
        skillsAcquired: [
          "Vertical & Overhead Welding Techniques",
          "Pressure Pipe Joints (ASME IX standards)",
          "Blueprint & Weld Symbol Interpretation",
          "Weld Quality Inspection & Testing"
        ],
        assessmentFee: "Approx. ₱2,697 (TESDA Circular #072 s.2021, verify current rates)",
        overseasPathway: "Shipbuilding (South Korea, Japan), oil rigs (Middle East), construction (Qatar, UAE)"
      },
      {
        code: "CON-EIM2",
        name: "Electrical Installation and Maintenance NC II",
        level: "NC II",
        duration: "402 Hours (Approx. 3 months)",
        description: "Crucial course for residential and industrial electricians. Teaches circuit layouts, circuit breakers, conduit piping, load calculations, and repairs per Philippine Electrical Code (PEC).",
        entryReq: {
          fil: "Walang specific high school requirement; basic algebra; physically fit at active",
          en: "No specific high school requirement; basic algebra; physically fit and active"
        },
        skillsAcquired: [
          "Conduit Bending & Pipe Laying",
          "Breaker Panel, Outlet & Switch Wiring",
          "Single-Phase & Three-Phase Power Setups",
          "Electrical System Diagnostics & Load Computation"
        ],
        overseasPathway: "Saudi Arabia, Qatar, UAE (MEP construction projects)"
      },
      {
        code: "CON-PLB2",
        name: "Plumbing NC II",
        level: "NC II",
        duration: "238 Hours (Approx. 1.5 months)",
        description: "Trains students to install, repair, and maintain water supply systems, drainage lines, and sanitary fixtures in residential and commercial buildings.",
        entryReq: {
          fil: "Nakakaintindi ng basic blueprint; physically fit",
          en: "Able to understand basic blueprints; physically fit"
        },
        skillsAcquired: [
          "Pipe Cutting, Threading & Joining",
          "Water Supply & Distribution Layout",
          "Sanitary Drainage & Venting Systems",
          "Fixture Installation & Leak Testing"
        ],
        overseasPathway: "MEP contractors in Middle East and Singapore"
      }
    ],
    jobs: [
      {
        title: "Construction Pipe / Plate Welder",
        averageSalary: "₱16,000 – ₱25,000 / month",
        overseasSalary: "₱55,000 – ₱120,000 / month equivalent (Middle East, South Korea)",
        demandLevel: "Very High",
        description: "Structural metal welder for buildings, bridges, shipyards, or industrial fabrication shops. Overseas demand remains consistently high.",
        mappedCourses: ["CON-SMAW1", "CON-SMAW2"]
      },
      {
        title: "Building Maintenance / Residential Electrician",
        averageSalary: "₱15,000 – ₱23,000 / month",
        overseasSalary: "₱50,000 – ₱95,000 / month equivalent (Saudi Arabia, UAE)",
        demandLevel: "Very High",
        description: "Wires houses, maintains commercial systems, changes components, and tests current leaks per PEC standards.",
        mappedCourses: ["CON-EIM2"]
      },
      {
        title: "Plumber / Sanitary Works Technician",
        averageSalary: "₱15,000 – ₱22,000 / month",
        overseasSalary: "₱45,000 – ₱85,000 / month equivalent (Qatar, UAE MEP projects)",
        demandLevel: "High",
        description: "Installs and repairs water systems and drainage in residential and commercial buildings. Strong demand from BBB infrastructure projects.",
        mappedCourses: ["CON-PLB2"]
      }
    ]
  },

  // ── 4. AGRICULTURE ──────────────────────────
  {
    id: "agriculture",
    name: "Modern Agriculture & Food Processing",
    iconName: "Sprout",
    description: "Eco-friendly farming, organic crops, aquaculture, and preserving local fruits and fish to create sustainable agricultural enterprises aligned with DOST and DA programs.",
    courses: [
      {
        code: "AGR-OAP2",
        name: "Organic Agriculture Production NC II",
        level: "NC II",
        duration: "232 Hours (Approx. 2 months)",
        description: "Learn how to make organic fertilizers (vermicomposting), raise organic livestock, cultivate organic vegetables, and use biological pest control solutions.",
        entryReq: {
          fil: "Nakakaintindi ng instructions; elementary graduate",
          en: "Able to understand instructions; elementary graduate"
        },
        skillsAcquired: [
          "Organic Fertilizer & Compost Making (Vermicast)",
          "Biopesticide & Biofungicide Brewing",
          "Organic Livestock Raising",
          "Seedbed Preparation & Planting Schedules"
        ]
      },
      {
        code: "AGR-FP2",
        name: "Food Processing NC II",
        level: "NC II",
        duration: "120 Hours (Approx. 1 month)",
        description: "Covers smoke-curing, canning, salting, fermenting, sugar-concentrating, and dehydrated packaging of agricultural yields for local and export markets.",
        entryReq: {
          fil: "Basic na kaalaman sa sanitization; elementary graduate",
          en: "Basic knowledge of sanitation; elementary graduate"
        },
        skillsAcquired: [
          "Canning & Bottling Fresh Food",
          "Brining, Drying & Smoke Curation",
          "Kitchen Tool Calibration",
          "HACCP Food Safety Standards"
        ]
      }
    ],
    jobs: [
      {
        title: "Organic Farm Coordinator / Nursery Operator",
        averageSalary: "₱12,000 – ₱17,000 / month",
        demandLevel: "High",
        description: "Supervises organic fields, manages composting sites, or produces seedlings for local agricultural sales. DA and LGU programs often subsidize startup.",
        mappedCourses: ["AGR-OAP2"]
      },
      {
        title: "Food Production & Packaging Specialist",
        averageSalary: "₱13,000 – ₱19,000 / month",
        demandLevel: "Emerging",
        description: "Works in food packaging facilities, processes local fruits (e.g., mango drying, fish bottling, banana chips) for domestic and export retail.",
        mappedCourses: ["AGR-FP2"]
      }
    ]
  },

  // ── 5. WELLNESS ─────────────────────────────
  {
    id: "wellness",
    name: "Caregiving & Health Wellness",
    iconName: "HeartPulse",
    description: "Care-oriented careers in home nursing, clinical settings, therapy clinics, and lifestyle spas — in high demand locally and internationally, especially Canada, Israel, UK, and Japan.",
    courses: [
      {
        code: "WEL-CG2",
        name: "Caregiving NC II",
        level: "NC II",
        // CORRECTION: Official TESDA duration is 786 hours (~5 months), not 960 hours.
        // Some private institutions extend to ~960 hrs with OJT included.
        duration: "786 Hours (Approx. 5 months; some institutions include OJT up to ~960 hrs)",
        description: "Highly intensive training to provide safe pediatric, geriatric, and disability care in household and institutional settings. Heavy focus on hygiene, nutrition, vital signs, and CPR.",
        entryReq: {
          fil: "High School o ALS Graduate; basic na pag-unawa sa English; physically at mentally fit",
          en: "High School or ALS Graduate; basic English comprehension; physically and mentally fit"
        },
        skillsAcquired: [
          "Measuring Vital Signs (BP, pulse, temperature, respiration)",
          "CPR & First-Aid Procedures (BLS-certified basics)",
          "Elderly Mobility Assistance & Bed Care",
          "Patient Nutrition Prepping & Feeding Techniques",
          "Infant & Toddler Developmental Care"
        ],
        overseasPathway: "Canada (Saskatchewan), UK, Israel, Japan, Singapore — among top deployment destinations"
      },
      {
        code: "WEL-MT2",
        name: "Massage Therapy NC II",
        level: "NC II",
        duration: "560 Hours (Approx. 4 months)",
        description: "Prepares legal therapists in therapeutic stroke methods (Swedish, Shiatsu, hot stone, oil therapy) and client health screening for spa and clinical environments.",
        entryReq: {
          fil: "High School level; physically fit — malusog ang kamay at postura",
          en: "High School level; physically fit — healthy hands and posture"
        },
        skillsAcquired: [
          "Pre-Massage & Post-Massage Client Protocols",
          "Swedish & Shiatsu Techniques",
          "Anatomy & Muscle Therapy Basics",
          "First Aid, Safety & Client Contraindication Screening"
        ],
        overseasPathway: "Hotel spas in UAE, Singapore, South Korea, cruise ships"
      }
    ],
    jobs: [
      {
        title: "Clinical / Residential Caregiver",
        averageSalary: "₱16,000 – ₱24,000 / month",
        overseasSalary: "₱80,000 – ₱150,000 / month equivalent (Canada, UK, Israel)",
        demandLevel: "Very High",
        description: "Provides support in nursing residences, hospitals, or private residences. One of the most internationally demanded TVET qualifications for Filipino workers.",
        mappedCourses: ["WEL-CG2"]
      },
      {
        title: "Licensed Spa Therapist",
        averageSalary: "₱14,000 – ₱22,000 / month",
        overseasSalary: "₱45,000 – ₱90,000 / month equivalent (UAE, Singapore, cruise ships)",
        demandLevel: "High",
        description: "Works in hotel wellness suites, personal clinics, or operates a local mobile spa service. BOSH certification can increase salary and credibility.",
        mappedCourses: ["WEL-MT2"]
      }
    ]
  },

  // ── 6. AUTOMOTIVE (NEW) ──────────────────────
  {
    id: "automotive",
    name: "Automotive Servicing & Land Transport",
    iconName: "Car",
    description: "Growing demand in PH due to rising vehicle ownership, ride-hailing fleets, and public utility modernization (PUVMP). Strong overseas demand in the Middle East.",
    courses: [
      {
        code: "AUT-AS2",
        name: "Automotive Servicing NC II",
        level: "NC II",
        duration: "640 Hours (Approx. 4–5 months)",
        description: "Covers preventive maintenance, engine tune-up, brake systems, suspension, and electrical diagnostics for gasoline-engine light vehicles.",
        entryReq: {
          fil: "High School o ALS graduate; physically fit; may basic na kaalaman sa mechanics (preferred)",
          en: "High School or ALS graduate; physically fit; basic mechanics knowledge preferred"
        },
        skillsAcquired: [
          "Engine Oil & Filter Change (Preventive Maintenance Service)",
          "Brake System Inspection & Repair",
          "Basic Electrical Diagnostics (Battery, Alternator, Starter)",
          "Suspension & Steering System Checks",
          "Tire Rotation & Wheel Balancing"
        ],
        overseasPathway: "Automotive workshops in Saudi Arabia, UAE, Qatar, Bahrain"
      }
    ],
    jobs: [
      {
        title: "Automotive Mechanic / Service Technician",
        averageSalary: "₱15,000 – ₱25,000 / month",
        overseasSalary: "₱55,000 – ₱100,000 / month equivalent (Middle East)",
        demandLevel: "High",
        description: "Performs maintenance and repairs on cars, vans, and jeepneys for dealerships, fleet operators, or independent shops. Strong demand from PUVMP jeepney modernization.",
        mappedCourses: ["AUT-AS2"]
      }
    ]
  },

  // ── 7. CREATIVE DIGITAL MEDIA (NEW) ─────────
  {
    id: "creative",
    name: "Creative Digital Media & Design",
    iconName: "Palette",
    description: "Emerging sector for visual content creation, digital marketing, and social media management — fueled by the Philippines' massive creator economy and OFW remittance-driven e-commerce.",
    courses: [
      {
        code: "CRT-GD2",
        name: "Graphic Design NC II (Visual Graphics)",
        level: "NC II",
        duration: "160 Hours (Approx. 1.5 months)",
        description: "Covers digital layout design, poster and social media material creation, typography, color theory, and basic brand collateral production using industry-standard tools.",
        entryReq: {
          fil: "High School graduate; may basic computer skills; may interes sa visual arts",
          en: "High School graduate; basic computer skills; interest in visual arts"
        },
        skillsAcquired: [
          "Adobe Illustrator / Canva Layout Design",
          "Typography & Color Theory",
          "Social Media Graphics & Poster Production",
          "Basic Brand Identity Creation"
        ]
      },
      {
        code: "CRT-VM2",
        name: "Video Production & Editing (Micro-credential)",
        level: "Micro-credential",
        duration: "80 Hours (Approx. 2 weeks)",
        description: "Short course in shooting, editing, and publishing short-form and long-form video content for social platforms, corporate clients, and content agencies.",
        entryReq: {
          fil: "Basic na kaalaman sa smartphone o computer; High School level",
          en: "Basic smartphone or computer knowledge; High School level"
        },
        skillsAcquired: [
          "Basic Cinematography & Camera Work",
          "CapCut / DaVinci Resolve / Premiere Pro Editing",
          "Audio Mixing & Subtitling",
          "YouTube, TikTok & Reel Publishing Workflow"
        ]
      }
    ],
    jobs: [
      {
        title: "Freelance Graphic Designer / Layout Artist",
        averageSalary: "₱15,000 – ₱30,000 / month",
        overseasSalary: "₱40,000 – ₱100,000 / month equivalent (remote, international clients)",
        demandLevel: "Emerging",
        description: "Creates visual materials for businesses, social media accounts, and online stores. Highly freelance-driven; Canva and Upwork have opened this to TVET graduates.",
        mappedCourses: ["CRT-GD2"]
      },
      {
        title: "Video Content Creator / Social Media Editor",
        averageSalary: "₱14,000 – ₱28,000 / month",
        demandLevel: "Emerging",
        description: "Edits and publishes content for brands, influencers, and SMEs. Growing demand from e-commerce and digital marketing agencies in NCR and Cebu.",
        mappedCourses: ["CRT-VM2", "ICT-ANIM3"]
      }
    ]
  }
];

// ─────────────────────────────────────────────
// FAQ (BILINGUAL)
// ─────────────────────────────────────────────

export interface FaqItem {
  question: string;
  answer: string;
}

export const TESDA_FAQ: FaqItem[] = [
  {
    question: "Magkano ang bayad sa pag-aaral sa TESDA?",
    answer: "Libre ang matrikula sa mga pampublikong training center ng TESDA. Sa ilalim ng TESDA scholarship programs (TWSP, PESFA, TTSP), sakop din ang mga materyales at assessment fees. May daily allowance na ₱160/araw para sa mga regular scholars, at hanggang ₱350/araw para sa mga Tsuper Iskolar. Para malaman ang slots, makipag-ugnayan sa iyong pinakamalapit na TESDA Provincial Office."
  },
  {
    question: "Sino ang pwedeng mag-enroll sa TESDA?",
    answer: "Bukas ang TESDA para sa lahat — lalo na sa mga Out-of-School Youth (OSY), High School o Elementary graduate, walang trabaho, o gustong matuto ng bagong skills. May mga kurso na kahit elementary graduate ay pwedeng sumali. Karamihan sa scholarship programs ay nangangailangan ng 18 taong gulang pataas."
  },
  {
    question: "Ano ang ALS (Alternative Learning System), at pwede ba ito?",
    answer: "Oo! Kung nakapasa ka sa ALS Accreditation and Equivalency (A&E) exam, ito ay ganap na kinikilala ng TESDA bilang katumbas ng High School diploma. Eligible ka sa halos lahat ng NC II at NC III na kurso!"
  },
  {
    question: "Paano makakakuha ng trabaho pagkatapos ng kurso?",
    answer: "Pagkatapos ng training, dadaan ka sa Competency Assessment upang makuha ang iyong National Certificate (NC I, II, o III) — na patunay ng iyong kakayahan na kinikilala ng mga employer at POEA para sa overseas work. Ang mga TESDA-accredited na training center ay may job placement partnerships sa mga lokal na kumpanya. Puwede ka ring mag-apply sa JobStreet, PESO (Public Employment Service Office), o overseas deployment sa pamamagitan ng POEA."
  },
  {
    question: "Ano ang mga dokumento na kailangan ihanda?",
    answer: "Karaniwang kailangan: 1) Birth Certificate (PSA), 2) High School Report Card o Diploma / ALS Certificate of Rating, 3) 1x1 o 2x2 ID Pictures, 4) Barangay Clearance, at 5) Certificate of Indigency (para sa scholarship). Ang ilang kurso ay may karagdagang requirements — makipag-ugnayan sa training center bago mag-apply."
  },
  {
    question: "Ano ang pagkakaiba ng NC II at COC (Certificate of Competency)?",
    answer: "Ang National Certificate (NC II) ay kumpleto na kwalipikasyon — nangangailangan ito ng pagpasa sa lahat ng core, common, at basic competencies. Ang COC naman ay para lang sa iisang unit of competency — mas mabilis makuha at kapaki-pakinabang kung gusto mong mag-specialize ng iisang skill tulad ng latte art para sa barista, o basic pipe welding lang."
  },
  {
    question: "May bayad ba ang competency assessment (eksamen)?",
    answer: "Oo, may assessment fee ang bawat qualification. Halimbawa, ang SMAW NC II ay humigit-kumulang ₱2,697 at ang CSS NC II ay ₱500–₱800, batay sa TESDA Circular. Kung may scholarship ka (TWSP, PESFA, TTSP), ang assessment fee ay karaniwang kasama sa scholarship package — libre para sa scholar."
  },
  {
    question: "Pwede ba akong magtrabaho abroad pagkatapos ng TESDA?",
    answer: "Oo! Ang ilang NC qualifications ay kinikilala sa ibang bansa — halimbawa, ang Caregiving NC II ay may pathways sa Canada, UK, at Israel; ang SMAW NC II sa Middle East at South Korea; at ang Cookery NC II at Housekeeping NC II sa cruise lines at Middle East hotels. Kailangan mong dumaan sa POEA deployment process at karagdagang dokumento (passport, medical clearance, PDOS). Ang ilang employer ay nag-o-offer ng libre na deployment sa kanilang mga scholar."
  }
];

export const TESDA_FAQ_EN: FaqItem[] = [
  {
    question: "How much does it cost to study at TESDA?",
    answer: "Tuition is free at public TESDA training centers. Under TESDA scholarship programs (TWSP, PESFA, TTSP), training materials and assessment fees are also covered. Scholars receive a daily training allowance of ₱160/day, and Tsuper Iskolar scholars receive ₱350/day. Contact your nearest TESDA Provincial Office to check available slots."
  },
  {
    question: "Who can enroll in TESDA?",
    answer: "TESDA is open to everyone — especially Out-of-School Youth (OSY), high school or elementary graduates, the unemployed, or anyone wanting to learn new skills. Some courses accept elementary graduates. Most scholarship programs require applicants to be at least 18 years old."
  },
  {
    question: "What is ALS (Alternative Learning System), and is it accepted?",
    answer: "Yes! If you passed the ALS Accreditation and Equivalency (A&E) exam, it is fully recognized by TESDA as equivalent to a High School diploma. You are eligible for nearly all NC II and NC III courses!"
  },
  {
    question: "How can I get a job after completing a course?",
    answer: "After training, you take a Competency Assessment to earn your National Certificate (NC I, II, or III) — proof of your skills recognized by employers and POEA for overseas work. TESDA-accredited training centers have job placement partnerships with local companies. You can also apply through JobStreet, your local PESO (Public Employment Service Office), or POEA for overseas deployment."
  },
  {
    question: "What documents do I need to prepare?",
    answer: "Typically required: 1) Birth Certificate (PSA), 2) High School Report Card or Diploma / ALS Certificate of Rating, 3) 1x1 or 2x2 ID Pictures, 4) Barangay Clearance, and 5) Certificate of Indigency (for scholarship). Some courses have additional requirements — check with the training center before applying."
  },
  {
    question: "What is the difference between NC II and a COC (Certificate of Competency)?",
    answer: "A National Certificate (NC II) is a complete qualification — you must pass all core, common, and basic competencies. A COC covers only a single unit of competency — faster to obtain and useful if you want to specialize in one skill, such as latte art for baristas or basic pipe welding."
  },
  {
    question: "Is there a fee for the competency assessment (exam)?",
    answer: "Yes, each qualification has an assessment fee. For example, SMAW NC II is approximately ₱2,697 and CSS NC II is ₱500–₱800, per TESDA Circulars. If you have a scholarship (TWSP, PESFA, TTSP), the assessment fee is typically included in the scholarship package — free for scholars."
  },
  {
    question: "Can I work abroad after completing a TESDA course?",
    answer: "Yes! Several NC qualifications have recognized overseas pathways — Caregiving NC II in Canada, UK, and Israel; SMAW NC II in the Middle East and South Korea; Cookery NC II and Housekeeping NC II in cruise lines and Middle East hotels. You will need to go through the POEA deployment process and prepare additional documents (passport, medical clearance, PDOS). Some employers offer employer-sponsored deployment packages."
  }
];
