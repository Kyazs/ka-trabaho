export interface TesdaCourse {
  code: string;
  name: string;
  level: string; // e.g., "NC I", "NC II", "NC III", "Micro-credential"
  duration: string; // e.g., "280 Hours (Approx. 2 months)"
  description: string;
  entryReq: string; // Education requirement
  skillsAcquired: string[];
}

export interface JobRole {
  title: string;
  averageSalary: string;
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
}

export const PHILIPPINES_REGIONS: RegionInfo[] = [
  {
    code: "NCR",
    name: "NCR (National Capital Region)",
    provinces: ["Metro Manila - North (Caloocan, Valenzuela)", "Metro Manila - East (Quezon City, Marikina)", "Metro Manila - South (Makati, Taguig, Pasay)", "Metro Manila - West (Manila, Pasig)"],
    topSectors: ["ict", "tourism", "wellness"]
  },
  {
    code: "R3",
    name: "Region III (Central Luzon)",
    provinces: ["Pampanga", "Bulacan", "Bataan", "Zambales", "Tarlac", "Nueva Ecija", "Aurora"],
    topSectors: ["construction", "agriculture", "tourism"]
  },
  {
    code: "R4A",
    name: "Region IV-A (Calabarzon)",
    provinces: ["Cavite", "Laguna", "Batangas", "Rizal", "Quezon"],
    topSectors: ["ict", "construction", "tourism"]
  },
  {
    code: "R6",
    name: "Region VI (Western Visayas)",
    provinces: ["Iloilo", "Negros Occidental", "Aklan", "Capiz", "Antique", "Guimaras"],
    topSectors: ["tourism", "agriculture", "wellness"]
  },
  {
    code: "R7",
    name: "Region VII (Central Visayas)",
    provinces: ["Cebu", "Bohol", "Negros Oriental", "Siquijor"],
    topSectors: ["ict", "tourism", "construction"]
  },
  {
    code: "R11",
    name: "Region XI (Davao Region)",
    provinces: ["Davao del Sur", "Davao del Norte", "Davao de Oro", "Davao Oriental", "Davao Occidental"],
    topSectors: ["agriculture", "tourism", "ict"]
  },
  {
    code: "R9",
    name: "Region IX (Zamboanga Peninsula)",
    provinces: ["Zamboanga del Sur (Zamboanga City, Pagadian)", "Zamboanga del Norte (Dipolog, Dapitan)", "Zamboanga Sibugay (Ipil)", "Zamboanga City"],
    topSectors: ["tourism", "agriculture", "construction"]
  }
];

export const SECTORS_DATA: Sector[] = [
  {
    id: "ict",
    name: "IT-BPM & Web Technology",
    iconName: "Laptop",
    description: "Digital jobs in tech support, website creation, coding, and hardware maintenance. Very popular with youth seeking online-friendly work.",
    courses: [
      {
        code: "ICT-CSS2",
        name: "Computer Systems Servicing NC II",
        level: "NC II",
        duration: "280 Hours (Approx. 2 months)",
        description: "Covers installing, configuring, diagnosing, and repairing computer hardware, networks, and operating systems.",
        entryReq: "Nakapagtapos ng Junior High School (o lumang HS Curriculum / ALS graduate)",
        skillsAcquired: ["PC Assembly & Hardware Diagnosis", "Operating System Installation (Windows/Linux)", "LAN Cabling & Configuration", "Software Troubleshooting"]
      },
      {
        code: "ICT-WD3",
        name: "Web Development NC III",
        level: "NC III",
        duration: "320 Hours (Approx. 2.5 months)",
        description: "Advanced training in creating responsive websites, writing frontend code (HTML/CSS/JS), and deploying web platforms.",
        entryReq: "May CSS NC II o kumpletuhin ang basic computer literacy screen",
        skillsAcquired: ["HTML5 & CSS3 layout design", "JavaScript interactivity", "Database integration basics", "Deploying & testing host environments"]
      },
      {
        code: "ICT-ANIM3",
        name: "3D Animation NC III",
        level: "NC III",
        duration: "340 Hours (Approx. 3 months)",
        description: "Teaches key skills to create key drawings, secondary 3D frame creations, modeling, and cleanups for video game and media companies.",
        entryReq: "Nakapagtapos ng Elementarya, may basic drawing talent",
        skillsAcquired: ["3D object modeling", "Character movement rendering", "Keyframe layouting", "Post-production digital editing"]
      },
      {
        code: "ICT-MC-CYBER",
        name: "Cybersecurity Fundamentals",
        level: "Micro-credential",
        duration: "40 Hours (Approx. 1 week)",
        description: "Short course targeting computer security basic defenses, local group policy configurations, and safe online operations.",
        entryReq: "Basic na pag-unawa sa computer",
        skillsAcquired: ["Threat detection basics", "Software patching", "Vulnerability assessment", "Securing personal databases"]
      }
    ],
    jobs: [
      {
        title: "Technical Support / Help Desk Representative",
        averageSalary: "₱18,000 - ₱26,000 / month",
        demandLevel: "Very High",
        description: "Assists customers with tech glitches, networks setup, and account support — highly in demand by BPO (Call Center) hubs in NCR, Cebu, and Iloilo.",
        mappedCourses: ["ICT-CSS2", "ICT-MC-CYBER"]
      },
      {
        title: "Computer Repair & Network Technician",
        averageSalary: "₱15,000 - ₱22,000 / month",
        demandLevel: "High",
        description: "Repairs PCs, sets up office internet routers, and runs IT cable networks for retail establishments or corporate offices.",
        mappedCourses: ["ICT-CSS2"]
      },
      {
        title: "Junior Web Developer / WordPress Assistant",
        averageSalary: "₱22,000 - ₱35,000 / month",
        demandLevel: "Emerging",
        description: "Builds and edits business websites, runs e-commerce catalog setups, or works as a freelance virtual assistant.",
        mappedCourses: ["ICT-WD3"]
      }
    ]
  },
  {
    id: "tourism",
    name: "Tourism, Hospitality & Culinary",
    iconName: "Utensils",
    description: "Service sector jobs in restaurants, cafes, hotels, and tourist attractions across the country's travel hotspots.",
    courses: [
      {
        code: "TOU-BAR2",
        name: "Barista NC II",
        level: "NC II",
        duration: "119 Hours (Approx. 1 month)",
        description: "Learn how to operate espresso machines, brew high-quality coffees, style latte art, and offer exemplary consumer service.",
        entryReq: "Kayang makipag-usap sa simple English at Filipino",
        skillsAcquired: ["Espresso machine operation", "Coffee beans selection & grinding", "Milk texturing & latte art", "Beverage preparation & storage"]
      },
      {
        code: "TOU-FBS2",
        name: "Food and Beverage Services NC II",
        level: "NC II",
        duration: "356 Hours (Approx. 2.5 months)",
        description: "Comprehensive skills for dining room setup, table waiting, taking guest orders, food handling, and billing in restaurants and resorts.",
        entryReq: "Nakapagtapos ng Elementarya/Elementary ALS, pleasant communication style",
        skillsAcquired: ["Restaurant table setups", "Order taking & table service", "Wine/beverage service protocols", "Prompt complaint handling"]
      },
      {
        code: "TOU-BPP2",
        name: "Bread and Pastry Production NC II",
        level: "NC II",
        duration: "141 Hours (Approx. 1.2 months)",
        description: "Baking foundations. Train in baking delicious breads, cookies, cakes, pastries, fillings, and proper storage.",
        entryReq: "Marunong magbasa at magsulat sa English at Filipino",
        skillsAcquired: ["Baking temperature and measurements", "Dough kneading & proofing", "Pastry decorating", "Food preservation & hygiene"]
      },
      {
        code: "TOU-CK2",
        name: "Cookery NC II",
        level: "NC II",
        duration: "316 Hours (Approx. 2.5 months)",
        description: "Become a professional kitchen prep and hot cook. Learn menu layouting, hot food prep, stocks, sauces, meat cooking, and hygiene.",
        entryReq: "Nakapagtapos ng Elementarya o katumbas (ALS)",
        skillsAcquired: ["Culinary knife skills", "Sauces & stock recipes", "Standard meat & vegetable cookery", "Kitchen workstation sanitation"]
      }
    ],
    jobs: [
      {
        title: "Specialty Café Barista",
        averageSalary: "₱13,000 - ₱18,000 / month",
        demandLevel: "Very High",
        description: "Brews espresso drinks, specialty beverages and manages cafe registers — booming in cities as well as regional hubs.",
        mappedCourses: ["TOU-BAR2"]
      },
      {
        title: "Hotel & Resort Food Server / Steward",
        averageSalary: "₱14,000 - ₱20,000 / month",
        demandLevel: "High",
        description: "Waitstaff at major hotels, resorts, cruise ships or restaurants, receiving standard service charges along with salary.",
        mappedCourses: ["TOU-FBS2"]
      },
      {
        title: "Bakehouse Assistant / Pastry Cook",
        averageSalary: "₱12,500 - ₱18,500 / month",
        demandLevel: "High",
        description: "Prepares desserts for cake shops, bakes bread inventories in commercial bakeries, or powers home-based baking businesses.",
        mappedCourses: ["TOU-BPP2"]
      },
      {
        title: "Prep Cook / Kitchen Assistant",
        averageSalary: "₱14,000 - ₱22,000 / month",
        demandLevel: "High",
        description: "Prepares ingredients, mans fast food lines, or works as a junior cook in restaurant kitchens.",
        mappedCourses: ["TOU-CK2"]
      }
    ]
  },
  {
    id: "construction",
    name: "Welding, Electrical & Technical Trades",
    iconName: "Hammer",
    description: "In-demand blueprint, technical, and labor jobs feeding the massive private and public infrastructure boom across the regions.",
    courses: [
      {
        code: "CON-SMAW1",
        name: "Shielded Metal Arc Welding (SMAW) NC I",
        level: "NC I",
        duration: "224 Hours (Approx. 1.8 months)",
        description: "Basic industrial entry training covering manual stick welding, safety protocols, plate preparations, and joint selections.",
        entryReq: "Nakapagtapos ng Elementarya, physically fit",
        skillsAcquired: ["Basic machine maintenance", "Flat & horizontal welding positions", "Safety gear setup", "Structural metal cutting"]
      },
      {
        code: "CON-SMAW2",
        name: "Shielded Metal Arc Welding (SMAW) NC II",
        level: "NC II",
        duration: "268 Hours (Approx. 2 months)",
        description: "Advanced stick welding skills focusing on pipe and groove welds, carbon steel welding, and structural joints.",
        entryReq: "May SMAW NC I o beripikadong katumbas na karanasan",
        skillsAcquired: ["Vertical & overhead welding techniques", "Pressure pipe joints", "Blueprint weld symbol interpretations", "Weld quality inspection"]
      },
      {
        code: "CON-EIM2",
        name: "Electrical Installation and Maintenance NC II",
        level: "NC II",
        duration: "402 Hours (Approx. 3 months)",
        description: "Crucial course for residential and industrial electricians. Teaches circuit layouts, circuit breakers, conduit piping, and repairs.",
        entryReq: "Walang specific high school requirement, basic algebra, fit at active",
        skillsAcquired: ["Conduit bending & pipe laying", "Breaker and outlet wiring", "Single-phase power setups", "Electrical system diagnostics"]
      }
    ],
    jobs: [
      {
        title: "Construction Pipe / Plate Welder",
        averageSalary: "₱16,000 - ₱25,000 / month",
        demandLevel: "Very High",
        description: "Structural metal welder building buildings, bridges, shipyards, or working inside industrial fabrication shops.",
        mappedCourses: ["CON-SMAW1", "CON-SMAW2"]
      },
      {
        title: "Building Maintenance / Residential Electrician",
        averageSalary: "₱15,000 - ₱23,000 / month",
        demandLevel: "Very High",
        description: "Wiring houses, maintaining commercial systems, changing components, and testing current leaks.",
        mappedCourses: ["CON-EIM2"]
      }
    ]
  },
  {
    id: "agriculture",
    name: "Modern Agriculture & Food Processing",
    iconName: "Sprout",
    description: "Eco-friendly farming, organic crops, and preserving local fruits and fish to create sustainable agricultural enterprises.",
    courses: [
      {
        code: "AGR-OAP2",
        name: "Organic Agriculture Production NC II",
        level: "NC II",
        duration: "232 Hours (Approx. 2 months)",
        description: "Learn how to make organic fertilizers (vermicomposting), raise organic chickens, cultivate organic vegetables, and use biologic insect solutions.",
        entryReq: "Nakakaintindi ng instructions; elementary graduate",
        skillsAcquired: ["Organic fertilizer and compost making", "Biopesticide brewing", "Organic livestock raising", "Seed bed preparation"]
      },
      {
        code: "AGR-FP2",
        name: "Food Processing NC II",
        level: "NC II",
        duration: "120 Hours (Approx. 1 month)",
        description: "Covers smoke-curing, canning, salting, fermenting, sugar-concentrating, and dehydrated packaging of agricultural yields.",
        entryReq: "Basic na kaalaman sa sanitization, Elementary graduate",
        skillsAcquired: ["Canning & bottling fresh food", "Brining, drying & smoke curation", "Kitchen tool calibration", "HACCP Safety Standards"]
      }
    ],
    jobs: [
      {
        title: "Organic Farm Coordinator / Nursery Operator",
        averageSalary: "₱12,000 - ₱17,000 / month",
        demandLevel: "High",
        description: "Supervises organic fields, manages composting sites, or produces seedlings for local agricultural sales.",
        mappedCourses: ["AGR-OAP2"]
      },
      {
        title: "Food Production & Packaging Specialist",
        averageSalary: "₱13,000 - ₱19,000 / month",
        demandLevel: "Emerging",
        description: "Works in food packaging laboratories, processes local fruits (e.g., mango drying, fish bottling) for export.",
        mappedCourses: ["AGR-FP2"]
      }
    ]
  },
  {
    id: "wellness",
    name: "Caregiving & Health Wellness",
    iconName: "HeartPulse",
    description: "Care-oriented careers in home nursing, clinical clinics, therapy clinics, and lifestyle spas in high demand locally and internationally.",
    courses: [
      {
        code: "WEL-CG2",
        name: "Caregiving NC II",
        level: "NC II",
        duration: "960 Hours (Approx. 6 months)",
        description: "Intense, highly premium training to provide safe pediatric, geriatric, and disabled household care. Heavy focus on hygiene, nutrition, vitals, and CPR.",
        entryReq: "High School / ALS Graduate; basic na pag-unawa sa English",
        skillsAcquired: ["Measuring vital signs (blood pressure, pulse)", "CPR & first-aid procedures", "Elderly mobility and bed assistance", "Patient nutrition prepping"]
      },
      {
        code: "WEL-MT2",
        name: "Massage Therapy NC II",
        level: "NC II",
        duration: "560 Hours (Approx. 4 months)",
        description: "Prepares legal therapists in stroke methods ( Swedish, Shiatsu, oil therapy) and client health screening.",
        entryReq: "High School level, fit hands at posture",
        skillsAcquired: ["Pre-massage and post-massage protocols", "Swedish & Shiatsu techniques", "Anatomy & muscle therapy", "First aid & safety"]
      }
    ],
    jobs: [
      {
        title: "Clinical / Residential Caregiver",
        averageSalary: "₱16,000 - ₱24,000 / month",
        demandLevel: "Very High",
        description: "Provides support in nursing residences, hospitals, or private residences. High pathways for international employment.",
        mappedCourses: ["WEL-CG2"]
      },
      {
        title: "Licensed Spa Therapist",
        averageSalary: "₱14,000 - ₱22,000 / month",
        demandLevel: "High",
        description: "Works in hotel wellness suites, personal clinics, or operates local mobile spa home services.",
        mappedCourses: ["WEL-MT2"]
      }
    ]
  }
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const TESDA_FAQ: FaqItem[] = [
  {
    question: "Magkano ang bayad sa pag-aaral sa TESDA?",
    answer: "Libre at walang bayad ang matrikula sa mga pampublikong training center ng TESDA sa ilalim ng UAQTE (Universal Access to Quality Tertiary Education Act). Marami ring scholarship program na nagbibigay ng libreng gamit at daily allowance (₱160 bawat araw)!"
  },
  {
    question: "Sino ang pwedeng mag-enroll sa TESDA?",
    answer: "Bukas ang TESDA para sa lahat, lalo na sa mga Out-of-School Youth (OSY), High School o Elementary graduate, walang trabaho, o gustong matuto ng bagong skills. May mga kurso na kahit elementary graduate ay pwedeng sumali!"
  },
  {
    question: "Ano ang ALS (Alternative Learning System), at pwede ba ito?",
    answer: "Oo! Kung kinuha mo at nakapasa ka sa ALS, ito ay ganap na kinikilala ng TESDA bilang katumbas ng High School diploma. Eligible ka sa lahat ng kurso!"
  },
  {
    question: "Paano makakakuha ng trabaho pagkatapos ng kurso?",
    answer: "Pagkatapos ng training, dadaan ka sa Competency Assessment upang makuha ang iyong National Certificate (NC I or NC II) na patunay ng iyong kakayahan. Malaki ang tulong nito sa mga employer, at may job placement partnership ang mga TESDA school sa mga lokal na kumpanya."
  },
  {
    question: "Ano ang mga dokumento na kailangan ihanda?",
    answer: "Karaniwang kailangan: 1) Birth Certificate (PSA), 2) High School Report Card o Diploma / ALS Certificate, 3) 1x1 o 2x2 ID Pictures, 4) Barangay Clearance, at 5) Certificate of Indigency (para sa scholarship)."
  }
];

export const TESDA_FAQ_EN: FaqItem[] = [
  {
    question: "How much does it cost to study at TESDA?",
    answer: "Tuition is completely free at public TESDA training centers under the UAQTE (Universal Access to Quality Tertiary Education Act). Many scholarship programs also provide free supplies and a daily allowance (₱160 per day)!"
  },
  {
    question: "Who can enroll in TESDA?",
    answer: "TESDA is open to everyone, especially Out-of-School Youth (OSY), high school or elementary graduates, the unemployed, or anyone wanting to learn new skills. Some courses accept even elementary graduates!"
  },
  {
    question: "What is ALS (Alternative Learning System), and is it accepted?",
    answer: "Yes! If you completed and passed ALS, it is fully recognized by TESDA as equivalent to a High School diploma. You are eligible for all courses!"
  },
  {
    question: "How can I get a job after completing a course?",
    answer: "After training, you will take a Competency Assessment to earn your National Certificate (NC I or NC II) as proof of your skills. This is a big help with employers, and TESDA schools have job placement partnerships with local companies."
  },
  {
    question: "What documents do I need to prepare?",
    answer: "Typically required: 1) Birth Certificate (PSA), 2) High School Report Card or Diploma / ALS Certificate, 3) 1x1 or 2x2 ID Pictures, 4) Barangay Clearance, and 5) Certificate of Indigency (for scholarship)."
  }
];
