export type MessageTone = "traditional" | "modern" | "minimal" | "generic" | "poetic";

export interface PresetMessageItem {
  id: string;
  category: string;
  categoryIcon: string;
  title: string;
  text: string;
  tone: MessageTone;
}

export const PRESET_MESSAGE_TONES: { id: MessageTone; label: string; icon: string; description: string }[] = [
  { id: "traditional", label: "Traditional", icon: "🛕", description: "Cultural, formal & heritage blessings" },
  { id: "modern", label: "Modern", icon: "✨", description: "Fresh, stylish & contemporary wording" },
  { id: "minimal", label: "Minimal", icon: "🍃", description: "Short, clean & direct statement" },
  { id: "generic", label: "Generic / Warm", icon: "💐", description: "Universal, warm & welcoming" },
  { id: "poetic", label: "Poetic", icon: "📜", description: "Emotional, heartfelt & lyrical" },
];

export const PRESET_MESSAGE_CATEGORIES = [
  { id: "all", label: "All Presets", icon: "✨" },
  { id: "wedding", label: "💍 Wedding & Ceremony", icon: "💍" },
  { id: "birthday", label: "🎂 Birthday & Milestone", icon: "🎂" },
  { id: "housewarming", label: "🏡 Housewarming", icon: "🏡" },
  { id: "blessings", label: "💐 Blessings & Gratitude", icon: "💐" },
  { id: "business", label: "💼 Business & Store", icon: "💼" },
  { id: "flyer", label: "🏷️ Pamphlet & Offer", icon: "🏷️" },
  { id: "babyshower", label: "👶 Baby Shower & Naming", icon: "👶" },
  { id: "anniversary", label: "🎉 Anniversary & Romance", icon: "🎉" },
  { id: "portfolio", label: "🎨 Portfolio & Showcase", icon: "🎨" },
  { id: "graduation", label: "🎓 Graduation & Success", icon: "🎓" },
  { id: "party", label: "🎊 Party & Celebration", icon: "🎊" },
];

export const PRESET_MESSAGES: PresetMessageItem[] = [
  {
    "id": "msg-wedding-traditional-1",
    "category": "wedding",
    "categoryIcon": "\ud83d\udc8d",
    "title": "Traditional Wedding Message",
    "text": "With the grace of Almighty and blessings of our ancestors, we invite you to the wedding of...",
    "tone": "traditional"
  },
  {
    "id": "msg-wedding-traditional-2",
    "category": "wedding",
    "categoryIcon": "\ud83d\udc8d",
    "title": "Traditional Wedding Message",
    "text": "We request the honor of your presence at the marriage of our beloved children...",
    "tone": "traditional"
  },
  {
    "id": "msg-wedding-modern-3",
    "category": "wedding",
    "categoryIcon": "\ud83d\udc8d",
    "title": "Modern Wedding Message",
    "text": "We are getting married! Join us for a night of love, music, and dance.",
    "tone": "modern"
  },
  {
    "id": "msg-wedding-modern-4",
    "category": "wedding",
    "categoryIcon": "\ud83d\udc8d",
    "title": "Modern Wedding Message",
    "text": "Decided on forever! Come celebrate our big day with us.",
    "tone": "modern"
  },
  {
    "id": "msg-wedding-minimal-5",
    "category": "wedding",
    "categoryIcon": "\ud83d\udc8d",
    "title": "Minimal Wedding Message",
    "text": "Save the date for our wedding!",
    "tone": "minimal"
  },
  {
    "id": "msg-wedding-minimal-6",
    "category": "wedding",
    "categoryIcon": "\ud83d\udc8d",
    "title": "Minimal Wedding Message",
    "text": "Join us as we say \"I Do\".",
    "tone": "minimal"
  },
  {
    "id": "msg-wedding-generic-7",
    "category": "wedding",
    "categoryIcon": "\ud83d\udc8d",
    "title": "Generic Wedding Message",
    "text": "You are cordially invited to celebrate our wedding day.",
    "tone": "generic"
  },
  {
    "id": "msg-wedding-generic-8",
    "category": "wedding",
    "categoryIcon": "\ud83d\udc8d",
    "title": "Generic Wedding Message",
    "text": "Join us for the wedding ceremony of...",
    "tone": "generic"
  },
  {
    "id": "msg-wedding-poetic-9",
    "category": "wedding",
    "categoryIcon": "\ud83d\udc8d",
    "title": "Poetic Wedding Message",
    "text": "Two hearts, one journey. Join us as we begin our life together.",
    "tone": "poetic"
  },
  {
    "id": "msg-wedding-poetic-10",
    "category": "wedding",
    "categoryIcon": "\ud83d\udc8d",
    "title": "Poetic Wedding Message",
    "text": "A love story that reached its forever. Be part of our celebration.",
    "tone": "poetic"
  },
  {
    "id": "msg-birthday-traditional-11",
    "category": "birthday",
    "categoryIcon": "\ud83c\udf82",
    "title": "Traditional Birthday Message",
    "text": "Seeking your blessings as we celebrate the milestone birthday of...",
    "tone": "traditional"
  },
  {
    "id": "msg-birthday-traditional-12",
    "category": "birthday",
    "categoryIcon": "\ud83c\udf82",
    "title": "Traditional Birthday Message",
    "text": "Join us for a special prayer and celebration on the birthday of...",
    "tone": "traditional"
  },
  {
    "id": "msg-birthday-modern-13",
    "category": "birthday",
    "categoryIcon": "\ud83c\udf82",
    "title": "Modern Birthday Message",
    "text": "Level up! Join us for a birthday bash to remember.",
    "tone": "modern"
  },
  {
    "id": "msg-birthday-modern-14",
    "category": "birthday",
    "categoryIcon": "\ud83c\udf82",
    "title": "Modern Birthday Message",
    "text": "Another year older, another reason to party!",
    "tone": "modern"
  },
  {
    "id": "msg-birthday-minimal-15",
    "category": "birthday",
    "categoryIcon": "\ud83c\udf82",
    "title": "Minimal Birthday Message",
    "text": "It's my birthday! Let's celebrate.",
    "tone": "minimal"
  },
  {
    "id": "msg-birthday-minimal-16",
    "category": "birthday",
    "categoryIcon": "\ud83c\udf82",
    "title": "Minimal Birthday Message",
    "text": "Birthday bash alert!",
    "tone": "minimal"
  },
  {
    "id": "msg-birthday-generic-17",
    "category": "birthday",
    "categoryIcon": "\ud83c\udf82",
    "title": "Generic Birthday Message",
    "text": "Join us in celebrating the birthday of...",
    "tone": "generic"
  },
  {
    "id": "msg-birthday-generic-18",
    "category": "birthday",
    "categoryIcon": "\ud83c\udf82",
    "title": "Generic Birthday Message",
    "text": "Come share the joy as we celebrate a special birthday.",
    "tone": "generic"
  },
  {
    "id": "msg-birthday-poetic-19",
    "category": "birthday",
    "categoryIcon": "\ud83c\udf82",
    "title": "Poetic Birthday Message",
    "text": "Celebrating a life well-lived and a year yet to come.",
    "tone": "poetic"
  },
  {
    "id": "msg-birthday-poetic-20",
    "category": "birthday",
    "categoryIcon": "\ud83c\udf82",
    "title": "Poetic Birthday Message",
    "text": "A journey around the sun, celebrated with the ones we love.",
    "tone": "poetic"
  },
  {
    "id": "msg-housewarming-traditional-21",
    "category": "housewarming",
    "categoryIcon": "\ud83c\udfe1",
    "title": "Traditional Housewarming Message",
    "text": "We invite you to the housewarming ceremony of our new home.",
    "tone": "traditional"
  },
  {
    "id": "msg-housewarming-traditional-22",
    "category": "housewarming",
    "categoryIcon": "\ud83c\udfe1",
    "title": "Traditional Housewarming Message",
    "text": "With the blessings of God, we step into our new house. Please join us.",
    "tone": "traditional"
  },
  {
    "id": "msg-housewarming-modern-23",
    "category": "housewarming",
    "categoryIcon": "\ud83c\udfe1",
    "title": "Modern Housewarming Message",
    "text": "New house, new memories! Come over for a housewarming party.",
    "tone": "modern"
  },
  {
    "id": "msg-housewarming-modern-24",
    "category": "housewarming",
    "categoryIcon": "\ud83c\udfe1",
    "title": "Modern Housewarming Message",
    "text": "We moved! Let's celebrate our new nest.",
    "tone": "modern"
  },
  {
    "id": "msg-housewarming-minimal-25",
    "category": "housewarming",
    "categoryIcon": "\ud83c\udfe1",
    "title": "Minimal Housewarming Message",
    "text": "Housewarming at our new place. See you there!",
    "tone": "minimal"
  },
  {
    "id": "msg-housewarming-minimal-26",
    "category": "housewarming",
    "categoryIcon": "\ud83c\udfe1",
    "title": "Minimal Housewarming Message",
    "text": "New home, come visit!",
    "tone": "minimal"
  },
  {
    "id": "msg-housewarming-generic-27",
    "category": "housewarming",
    "categoryIcon": "\ud83c\udfe1",
    "title": "Generic Housewarming Message",
    "text": "Join us as we celebrate our new home.",
    "tone": "generic"
  },
  {
    "id": "msg-housewarming-generic-28",
    "category": "housewarming",
    "categoryIcon": "\ud83c\udfe1",
    "title": "Generic Housewarming Message",
    "text": "A house is made of walls, a home is made of love. Join us.",
    "tone": "generic"
  },
  {
    "id": "msg-housewarming-poetic-29",
    "category": "housewarming",
    "categoryIcon": "\ud83c\udfe1",
    "title": "Poetic Housewarming Message",
    "text": "Opening our doors to love, laughter, and new beginnings.",
    "tone": "poetic"
  },
  {
    "id": "msg-housewarming-poetic-30",
    "category": "housewarming",
    "categoryIcon": "\ud83c\udfe1",
    "title": "Poetic Housewarming Message",
    "text": "May our new hearth be warm and our home be filled with friends.",
    "tone": "poetic"
  },
  {
    "id": "msg-blessings-traditional-31",
    "category": "blessings",
    "categoryIcon": "\ud83d\udc90",
    "title": "Traditional Blessings Message",
    "text": "Celebrate our blessings with us in a traditional way.",
    "tone": "traditional"
  },
  {
    "id": "msg-blessings-traditional-32",
    "category": "blessings",
    "categoryIcon": "\ud83d\udc90",
    "title": "Traditional Blessings Message",
    "text": "Join us for our blessings celebration.",
    "tone": "traditional"
  },
  {
    "id": "msg-blessings-modern-33",
    "category": "blessings",
    "categoryIcon": "\ud83d\udc90",
    "title": "Modern Blessings Message",
    "text": "Celebrate our blessings with us in a modern way.",
    "tone": "modern"
  },
  {
    "id": "msg-blessings-modern-34",
    "category": "blessings",
    "categoryIcon": "\ud83d\udc90",
    "title": "Modern Blessings Message",
    "text": "Join us for our blessings celebration.",
    "tone": "modern"
  },
  {
    "id": "msg-blessings-minimal-35",
    "category": "blessings",
    "categoryIcon": "\ud83d\udc90",
    "title": "Minimal Blessings Message",
    "text": "Celebrate our blessings with us in a minimal way.",
    "tone": "minimal"
  },
  {
    "id": "msg-blessings-minimal-36",
    "category": "blessings",
    "categoryIcon": "\ud83d\udc90",
    "title": "Minimal Blessings Message",
    "text": "Join us for our blessings celebration.",
    "tone": "minimal"
  },
  {
    "id": "msg-blessings-generic-37",
    "category": "blessings",
    "categoryIcon": "\ud83d\udc90",
    "title": "Generic Blessings Message",
    "text": "Celebrate our blessings with us in a generic way.",
    "tone": "generic"
  },
  {
    "id": "msg-blessings-generic-38",
    "category": "blessings",
    "categoryIcon": "\ud83d\udc90",
    "title": "Generic Blessings Message",
    "text": "Join us for our blessings celebration.",
    "tone": "generic"
  },
  {
    "id": "msg-blessings-poetic-39",
    "category": "blessings",
    "categoryIcon": "\ud83d\udc90",
    "title": "Poetic Blessings Message",
    "text": "Celebrate our blessings with us in a poetic way.",
    "tone": "poetic"
  },
  {
    "id": "msg-blessings-poetic-40",
    "category": "blessings",
    "categoryIcon": "\ud83d\udc90",
    "title": "Poetic Blessings Message",
    "text": "Join us for our blessings celebration.",
    "tone": "poetic"
  },
  {
    "id": "msg-business-traditional-41",
    "category": "business",
    "categoryIcon": "\ud83d\udcbc",
    "title": "Traditional Business Message",
    "text": "Celebrate our business with us in a traditional way.",
    "tone": "traditional"
  },
  {
    "id": "msg-business-traditional-42",
    "category": "business",
    "categoryIcon": "\ud83d\udcbc",
    "title": "Traditional Business Message",
    "text": "Join us for our business celebration.",
    "tone": "traditional"
  },
  {
    "id": "msg-business-modern-43",
    "category": "business",
    "categoryIcon": "\ud83d\udcbc",
    "title": "Modern Business Message",
    "text": "Celebrate our business with us in a modern way.",
    "tone": "modern"
  },
  {
    "id": "msg-business-modern-44",
    "category": "business",
    "categoryIcon": "\ud83d\udcbc",
    "title": "Modern Business Message",
    "text": "Join us for our business celebration.",
    "tone": "modern"
  },
  {
    "id": "msg-business-minimal-45",
    "category": "business",
    "categoryIcon": "\ud83d\udcbc",
    "title": "Minimal Business Message",
    "text": "Celebrate our business with us in a minimal way.",
    "tone": "minimal"
  },
  {
    "id": "msg-business-minimal-46",
    "category": "business",
    "categoryIcon": "\ud83d\udcbc",
    "title": "Minimal Business Message",
    "text": "Join us for our business celebration.",
    "tone": "minimal"
  },
  {
    "id": "msg-business-generic-47",
    "category": "business",
    "categoryIcon": "\ud83d\udcbc",
    "title": "Generic Business Message",
    "text": "Celebrate our business with us in a generic way.",
    "tone": "generic"
  },
  {
    "id": "msg-business-generic-48",
    "category": "business",
    "categoryIcon": "\ud83d\udcbc",
    "title": "Generic Business Message",
    "text": "Join us for our business celebration.",
    "tone": "generic"
  },
  {
    "id": "msg-business-poetic-49",
    "category": "business",
    "categoryIcon": "\ud83d\udcbc",
    "title": "Poetic Business Message",
    "text": "Celebrate our business with us in a poetic way.",
    "tone": "poetic"
  },
  {
    "id": "msg-business-poetic-50",
    "category": "business",
    "categoryIcon": "\ud83d\udcbc",
    "title": "Poetic Business Message",
    "text": "Join us for our business celebration.",
    "tone": "poetic"
  },
  {
    "id": "msg-flyer-traditional-51",
    "category": "flyer",
    "categoryIcon": "\ud83c\udff7\ufe0f",
    "title": "Traditional Flyer Message",
    "text": "Celebrate our flyer with us in a traditional way.",
    "tone": "traditional"
  },
  {
    "id": "msg-flyer-traditional-52",
    "category": "flyer",
    "categoryIcon": "\ud83c\udff7\ufe0f",
    "title": "Traditional Flyer Message",
    "text": "Join us for our flyer celebration.",
    "tone": "traditional"
  },
  {
    "id": "msg-flyer-modern-53",
    "category": "flyer",
    "categoryIcon": "\ud83c\udff7\ufe0f",
    "title": "Modern Flyer Message",
    "text": "Celebrate our flyer with us in a modern way.",
    "tone": "modern"
  },
  {
    "id": "msg-flyer-modern-54",
    "category": "flyer",
    "categoryIcon": "\ud83c\udff7\ufe0f",
    "title": "Modern Flyer Message",
    "text": "Join us for our flyer celebration.",
    "tone": "modern"
  },
  {
    "id": "msg-flyer-minimal-55",
    "category": "flyer",
    "categoryIcon": "\ud83c\udff7\ufe0f",
    "title": "Minimal Flyer Message",
    "text": "Celebrate our flyer with us in a minimal way.",
    "tone": "minimal"
  },
  {
    "id": "msg-flyer-minimal-56",
    "category": "flyer",
    "categoryIcon": "\ud83c\udff7\ufe0f",
    "title": "Minimal Flyer Message",
    "text": "Join us for our flyer celebration.",
    "tone": "minimal"
  },
  {
    "id": "msg-flyer-generic-57",
    "category": "flyer",
    "categoryIcon": "\ud83c\udff7\ufe0f",
    "title": "Generic Flyer Message",
    "text": "Celebrate our flyer with us in a generic way.",
    "tone": "generic"
  },
  {
    "id": "msg-flyer-generic-58",
    "category": "flyer",
    "categoryIcon": "\ud83c\udff7\ufe0f",
    "title": "Generic Flyer Message",
    "text": "Join us for our flyer celebration.",
    "tone": "generic"
  },
  {
    "id": "msg-flyer-poetic-59",
    "category": "flyer",
    "categoryIcon": "\ud83c\udff7\ufe0f",
    "title": "Poetic Flyer Message",
    "text": "Celebrate our flyer with us in a poetic way.",
    "tone": "poetic"
  },
  {
    "id": "msg-flyer-poetic-60",
    "category": "flyer",
    "categoryIcon": "\ud83c\udff7\ufe0f",
    "title": "Poetic Flyer Message",
    "text": "Join us for our flyer celebration.",
    "tone": "poetic"
  },
  {
    "id": "msg-babyshower-traditional-61",
    "category": "babyshower",
    "categoryIcon": "\ud83d\udc76",
    "title": "Traditional Babyshower Message",
    "text": "Celebrate our babyshower with us in a traditional way.",
    "tone": "traditional"
  },
  {
    "id": "msg-babyshower-traditional-62",
    "category": "babyshower",
    "categoryIcon": "\ud83d\udc76",
    "title": "Traditional Babyshower Message",
    "text": "Join us for our babyshower celebration.",
    "tone": "traditional"
  },
  {
    "id": "msg-babyshower-modern-63",
    "category": "babyshower",
    "categoryIcon": "\ud83d\udc76",
    "title": "Modern Babyshower Message",
    "text": "Celebrate our babyshower with us in a modern way.",
    "tone": "modern"
  },
  {
    "id": "msg-babyshower-modern-64",
    "category": "babyshower",
    "categoryIcon": "\ud83d\udc76",
    "title": "Modern Babyshower Message",
    "text": "Join us for our babyshower celebration.",
    "tone": "modern"
  },
  {
    "id": "msg-babyshower-minimal-65",
    "category": "babyshower",
    "categoryIcon": "\ud83d\udc76",
    "title": "Minimal Babyshower Message",
    "text": "Celebrate our babyshower with us in a minimal way.",
    "tone": "minimal"
  },
  {
    "id": "msg-babyshower-minimal-66",
    "category": "babyshower",
    "categoryIcon": "\ud83d\udc76",
    "title": "Minimal Babyshower Message",
    "text": "Join us for our babyshower celebration.",
    "tone": "minimal"
  },
  {
    "id": "msg-babyshower-generic-67",
    "category": "babyshower",
    "categoryIcon": "\ud83d\udc76",
    "title": "Generic Babyshower Message",
    "text": "Celebrate our babyshower with us in a generic way.",
    "tone": "generic"
  },
  {
    "id": "msg-babyshower-generic-68",
    "category": "babyshower",
    "categoryIcon": "\ud83d\udc76",
    "title": "Generic Babyshower Message",
    "text": "Join us for our babyshower celebration.",
    "tone": "generic"
  },
  {
    "id": "msg-babyshower-poetic-69",
    "category": "babyshower",
    "categoryIcon": "\ud83d\udc76",
    "title": "Poetic Babyshower Message",
    "text": "Celebrate our babyshower with us in a poetic way.",
    "tone": "poetic"
  },
  {
    "id": "msg-babyshower-poetic-70",
    "category": "babyshower",
    "categoryIcon": "\ud83d\udc76",
    "title": "Poetic Babyshower Message",
    "text": "Join us for our babyshower celebration.",
    "tone": "poetic"
  },
  {
    "id": "msg-anniversary-traditional-71",
    "category": "anniversary",
    "categoryIcon": "\ud83c\udf89",
    "title": "Traditional Anniversary Message",
    "text": "Celebrate our anniversary with us in a traditional way.",
    "tone": "traditional"
  },
  {
    "id": "msg-anniversary-traditional-72",
    "category": "anniversary",
    "categoryIcon": "\ud83c\udf89",
    "title": "Traditional Anniversary Message",
    "text": "Join us for our anniversary celebration.",
    "tone": "traditional"
  },
  {
    "id": "msg-anniversary-modern-73",
    "category": "anniversary",
    "categoryIcon": "\ud83c\udf89",
    "title": "Modern Anniversary Message",
    "text": "Celebrate our anniversary with us in a modern way.",
    "tone": "modern"
  },
  {
    "id": "msg-anniversary-modern-74",
    "category": "anniversary",
    "categoryIcon": "\ud83c\udf89",
    "title": "Modern Anniversary Message",
    "text": "Join us for our anniversary celebration.",
    "tone": "modern"
  },
  {
    "id": "msg-anniversary-minimal-75",
    "category": "anniversary",
    "categoryIcon": "\ud83c\udf89",
    "title": "Minimal Anniversary Message",
    "text": "Celebrate our anniversary with us in a minimal way.",
    "tone": "minimal"
  },
  {
    "id": "msg-anniversary-minimal-76",
    "category": "anniversary",
    "categoryIcon": "\ud83c\udf89",
    "title": "Minimal Anniversary Message",
    "text": "Join us for our anniversary celebration.",
    "tone": "minimal"
  },
  {
    "id": "msg-anniversary-generic-77",
    "category": "anniversary",
    "categoryIcon": "\ud83c\udf89",
    "title": "Generic Anniversary Message",
    "text": "Celebrate our anniversary with us in a generic way.",
    "tone": "generic"
  },
  {
    "id": "msg-anniversary-generic-78",
    "category": "anniversary",
    "categoryIcon": "\ud83c\udf89",
    "title": "Generic Anniversary Message",
    "text": "Join us for our anniversary celebration.",
    "tone": "generic"
  },
  {
    "id": "msg-anniversary-poetic-79",
    "category": "anniversary",
    "categoryIcon": "\ud83c\udf89",
    "title": "Poetic Anniversary Message",
    "text": "Celebrate our anniversary with us in a poetic way.",
    "tone": "poetic"
  },
  {
    "id": "msg-anniversary-poetic-80",
    "category": "anniversary",
    "categoryIcon": "\ud83c\udf89",
    "title": "Poetic Anniversary Message",
    "text": "Join us for our anniversary celebration.",
    "tone": "poetic"
  },
  {
    "id": "msg-portfolio-traditional-81",
    "category": "portfolio",
    "categoryIcon": "\ud83c\udfa8",
    "title": "Traditional Portfolio Message",
    "text": "Celebrate our portfolio with us in a traditional way.",
    "tone": "traditional"
  },
  {
    "id": "msg-portfolio-traditional-82",
    "category": "portfolio",
    "categoryIcon": "\ud83c\udfa8",
    "title": "Traditional Portfolio Message",
    "text": "Join us for our portfolio celebration.",
    "tone": "traditional"
  },
  {
    "id": "msg-portfolio-modern-83",
    "category": "portfolio",
    "categoryIcon": "\ud83c\udfa8",
    "title": "Modern Portfolio Message",
    "text": "Celebrate our portfolio with us in a modern way.",
    "tone": "modern"
  },
  {
    "id": "msg-portfolio-modern-84",
    "category": "portfolio",
    "categoryIcon": "\ud83c\udfa8",
    "title": "Modern Portfolio Message",
    "text": "Join us for our portfolio celebration.",
    "tone": "modern"
  },
  {
    "id": "msg-portfolio-minimal-85",
    "category": "portfolio",
    "categoryIcon": "\ud83c\udfa8",
    "title": "Minimal Portfolio Message",
    "text": "Celebrate our portfolio with us in a minimal way.",
    "tone": "minimal"
  },
  {
    "id": "msg-portfolio-minimal-86",
    "category": "portfolio",
    "categoryIcon": "\ud83c\udfa8",
    "title": "Minimal Portfolio Message",
    "text": "Join us for our portfolio celebration.",
    "tone": "minimal"
  },
  {
    "id": "msg-portfolio-generic-87",
    "category": "portfolio",
    "categoryIcon": "\ud83c\udfa8",
    "title": "Generic Portfolio Message",
    "text": "Celebrate our portfolio with us in a generic way.",
    "tone": "generic"
  },
  {
    "id": "msg-portfolio-generic-88",
    "category": "portfolio",
    "categoryIcon": "\ud83c\udfa8",
    "title": "Generic Portfolio Message",
    "text": "Join us for our portfolio celebration.",
    "tone": "generic"
  },
  {
    "id": "msg-portfolio-poetic-89",
    "category": "portfolio",
    "categoryIcon": "\ud83c\udfa8",
    "title": "Poetic Portfolio Message",
    "text": "Celebrate our portfolio with us in a poetic way.",
    "tone": "poetic"
  },
  {
    "id": "msg-portfolio-poetic-90",
    "category": "portfolio",
    "categoryIcon": "\ud83c\udfa8",
    "title": "Poetic Portfolio Message",
    "text": "Join us for our portfolio celebration.",
    "tone": "poetic"
  },
  {
    "id": "msg-graduation-traditional-91",
    "category": "graduation",
    "categoryIcon": "\ud83c\udf93",
    "title": "Traditional Graduation Message",
    "text": "Celebrate our graduation with us in a traditional way.",
    "tone": "traditional"
  },
  {
    "id": "msg-graduation-traditional-92",
    "category": "graduation",
    "categoryIcon": "\ud83c\udf93",
    "title": "Traditional Graduation Message",
    "text": "Join us for our graduation celebration.",
    "tone": "traditional"
  },
  {
    "id": "msg-graduation-modern-93",
    "category": "graduation",
    "categoryIcon": "\ud83c\udf93",
    "title": "Modern Graduation Message",
    "text": "Celebrate our graduation with us in a modern way.",
    "tone": "modern"
  },
  {
    "id": "msg-graduation-modern-94",
    "category": "graduation",
    "categoryIcon": "\ud83c\udf93",
    "title": "Modern Graduation Message",
    "text": "Join us for our graduation celebration.",
    "tone": "modern"
  },
  {
    "id": "msg-graduation-minimal-95",
    "category": "graduation",
    "categoryIcon": "\ud83c\udf93",
    "title": "Minimal Graduation Message",
    "text": "Celebrate our graduation with us in a minimal way.",
    "tone": "minimal"
  },
  {
    "id": "msg-graduation-minimal-96",
    "category": "graduation",
    "categoryIcon": "\ud83c\udf93",
    "title": "Minimal Graduation Message",
    "text": "Join us for our graduation celebration.",
    "tone": "minimal"
  },
  {
    "id": "msg-graduation-generic-97",
    "category": "graduation",
    "categoryIcon": "\ud83c\udf93",
    "title": "Generic Graduation Message",
    "text": "Celebrate our graduation with us in a generic way.",
    "tone": "generic"
  },
  {
    "id": "msg-graduation-generic-98",
    "category": "graduation",
    "categoryIcon": "\ud83c\udf93",
    "title": "Generic Graduation Message",
    "text": "Join us for our graduation celebration.",
    "tone": "generic"
  },
  {
    "id": "msg-graduation-poetic-99",
    "category": "graduation",
    "categoryIcon": "\ud83c\udf93",
    "title": "Poetic Graduation Message",
    "text": "Celebrate our graduation with us in a poetic way.",
    "tone": "poetic"
  },
  {
    "id": "msg-graduation-poetic-100",
    "category": "graduation",
    "categoryIcon": "\ud83c\udf93",
    "title": "Poetic Graduation Message",
    "text": "Join us for our graduation celebration.",
    "tone": "poetic"
  },
  {
    "id": "msg-party-traditional-101",
    "category": "party",
    "categoryIcon": "\ud83c\udf8a",
    "title": "Traditional Party Message",
    "text": "Celebrate our party with us in a traditional way.",
    "tone": "traditional"
  },
  {
    "id": "msg-party-traditional-102",
    "category": "party",
    "categoryIcon": "\ud83c\udf8a",
    "title": "Traditional Party Message",
    "text": "Join us for our party celebration.",
    "tone": "traditional"
  },
  {
    "id": "msg-party-modern-103",
    "category": "party",
    "categoryIcon": "\ud83c\udf8a",
    "title": "Modern Party Message",
    "text": "Celebrate our party with us in a modern way.",
    "tone": "modern"
  },
  {
    "id": "msg-party-modern-104",
    "category": "party",
    "categoryIcon": "\ud83c\udf8a",
    "title": "Modern Party Message",
    "text": "Join us for our party celebration.",
    "tone": "modern"
  },
  {
    "id": "msg-party-minimal-105",
    "category": "party",
    "categoryIcon": "\ud83c\udf8a",
    "title": "Minimal Party Message",
    "text": "Celebrate our party with us in a minimal way.",
    "tone": "minimal"
  },
  {
    "id": "msg-party-minimal-106",
    "category": "party",
    "categoryIcon": "\ud83c\udf8a",
    "title": "Minimal Party Message",
    "text": "Join us for our party celebration.",
    "tone": "minimal"
  },
  {
    "id": "msg-party-generic-107",
    "category": "party",
    "categoryIcon": "\ud83c\udf8a",
    "title": "Generic Party Message",
    "text": "Celebrate our party with us in a generic way.",
    "tone": "generic"
  },
  {
    "id": "msg-party-generic-108",
    "category": "party",
    "categoryIcon": "\ud83c\udf8a",
    "title": "Generic Party Message",
    "text": "Join us for our party celebration.",
    "tone": "generic"
  },
  {
    "id": "msg-party-poetic-109",
    "category": "party",
    "categoryIcon": "\ud83c\udf8a",
    "title": "Poetic Party Message",
    "text": "Celebrate our party with us in a poetic way.",
    "tone": "poetic"
  },
  {
    "id": "msg-party-poetic-110",
    "category": "party",
    "categoryIcon": "\ud83c\udf8a",
    "title": "Poetic Party Message",
    "text": "Join us for our party celebration.",
    "tone": "poetic"
  }
];

// Helper to normalize event type / category key
export function normalizeCategory(pageType: string): string {
  const type = (pageType || "").toLowerCase();
  if (type.includes("wedding") || type.includes("engagement") || type.includes("proposal")) return "wedding";
  if (type.includes("birthday")) return "birthday";
  if (type.includes("housewarming")) return "housewarming";
  if (type.includes("business") || type.includes("corporate") || type.includes("workshop")) return "business";
  if (type.includes("flyer") || type.includes("pamphlet")) return "flyer";
  if (type.includes("baby") || type.includes("shower") || type.includes("naming") || type.includes("ceremony")) return "babyshower";
  if (type.includes("anniversary")) return "anniversary";
  if (type.includes("portfolio")) return "portfolio";
  if (type.includes("blessings") || type.includes("memorial") || type.includes("farewell")) return "blessings";
  if (type.includes("graduation")) return "graduation";
  if (type.includes("reunion") || type.includes("party") || type.includes("festival")) return "party";
  return "wedding";
}

// RAG-like structure search & filtering helper function
export function getSuggestedMessagesForPageType(
  pageType: string,
  tone: MessageTone = "traditional"
): PresetMessageItem[] {
  const categoryKey = normalizeCategory(pageType);

  // 1. First priority: Exact match on Category AND Tone
  const exactMatches = PRESET_MESSAGES.filter(
    m => m.category === categoryKey && m.tone === tone
  );
  if (exactMatches.length > 0) return exactMatches;

  // 2. Second priority: Match Category (any tone)
  const categoryMatches = PRESET_MESSAGES.filter(
    m => m.category === categoryKey
  );
  if (categoryMatches.length > 0) return categoryMatches;

  // 3. Third priority: Match Tone across all categories
  const toneMatches = PRESET_MESSAGES.filter(
    m => m.tone === tone
  );
  if (toneMatches.length > 0) return toneMatches;

  // 4. Fallback: Return all preset messages
  return PRESET_MESSAGES;
}

// Get single suggested message candidate based on pageType, tone, and seed
export function getSingleSuggestedMessage(
  pageType: string,
  tone: MessageTone,
  refreshSeed: number
): PresetMessageItem {
  const candidates = getSuggestedMessagesForPageType(pageType, tone);
  const index = Math.abs(refreshSeed) % candidates.length;
  return candidates[index] || PRESET_MESSAGES[0];
}


export const STUDIO_FONTS = [
  { id: "Playfair Display, serif", label: "Playfair Display (Serif Elegance)", fontClass: "font-serif" },
  { id: "Plus Jakarta Sans, sans-serif", label: "Plus Jakarta Sans (Modern Clean)", fontClass: "font-sans" },
  { id: "Cinzel, serif", label: "Cinzel (Royal Classical)", fontClass: "font-serif" },
  { id: "Caveat, cursive", label: "Caveat (Handwritten Warmth)", fontClass: "font-sans" },
  { id: "Dancing Script, cursive", label: "Dancing Script (Sweet Calligraphy)", fontClass: "font-serif" },
  { id: "Montserrat, sans-serif", label: "Montserrat (Bold Statement)", fontClass: "font-sans" },
  { id: "Cormorant Garamond, serif", label: "Cormorant Garamond (Fine Luxury)", fontClass: "font-serif" },
  { id: "Outfit, sans-serif", label: "Outfit (Minimalist Tech)", fontClass: "font-sans" },
];

export const STUDIO_ANIMATIONS = [
  { id: "none", label: "None (Static)" },
  { id: "fade-in", label: "✨ Soft Fade In" },
  { id: "slide-up", label: "⬆️ Slide Up" },
  { id: "slide-left", label: "⬅️ Slide In Left" },
  { id: "zoom-in", label: "🔍 Zoom In" },
  { id: "bounce-in", label: "🎈 Bounce In" },
  { id: "pulse", label: "💓 Soft Pulse" },
  { id: "rotate-in", label: "🔄 Rotate In" },
];

export interface StudioTemplate {
  id: string;
  name: string;
  category: string[];
  primary: string;
  secondary: string;
  highlight: string;
  fonts: {
    title: string;
    recipient: string;
    messages: string;
  };
  animations: {
    title: string;
    details: string;
    photos: string;
  };
}

export const STUDIO_TEMPLATES: StudioTemplate[] = [
  {
    "id": "blank-page",
    "name": "Custom Blank Page",
    "category": ["all"],
    "primary": "#1c1917",
    "secondary": "#ffffff",
    "highlight": "#ef4444",
    "fonts": {
      "title": "Plus Jakarta Sans, sans-serif",
      "recipient": "Plus Jakarta Sans, sans-serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "none",
      "details": "none",
      "photos": "none"
    }
  },
  {
    "id": "wedding-romantic-1",
    "name": "Romantic Wedding Invitation",
    "category": [
      "wedding",
      "all"
    ],
    "primary": "#065f46",
    "secondary": "#ecfdf5",
    "highlight": "#059669",
    "fonts": {
      "title": "Cinzel, serif",
      "recipient": "Montserrat, sans-serif",
      "messages": "Outfit, sans-serif"
    },
    "animations": {
      "title": "slide-up",
      "details": "slide-left",
      "photos": "zoom-in"
    }
  },
  {
    "id": "wedding-romantic-2",
    "name": "Romantic Wedding Invitation",
    "category": [
      "wedding",
      "all"
    ],
    "primary": "#9f1239",
    "secondary": "#fff1f2",
    "highlight": "#f43f5e",
    "fonts": {
      "title": "Dancing Script, cursive",
      "recipient": "Caveat, cursive",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "slide-left",
      "details": "zoom-in",
      "photos": "bounce-in"
    }
  },
  {
    "id": "wedding-minimalist-1",
    "name": "Minimalist Wedding Invitation",
    "category": [
      "wedding",
      "all"
    ],
    "primary": "#0f172a",
    "secondary": "#f8fafc",
    "highlight": "#f59e0b",
    "fonts": {
      "title": "Montserrat, sans-serif",
      "recipient": "Outfit, sans-serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "zoom-in",
      "details": "bounce-in",
      "photos": "pulse"
    }
  },
  {
    "id": "wedding-minimalist-2",
    "name": "Minimalist Wedding Invitation",
    "category": [
      "wedding",
      "all"
    ],
    "primary": "#b45309",
    "secondary": "#fefce8",
    "highlight": "#dc2626",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Cormorant Garamond, serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "bounce-in",
      "details": "pulse",
      "photos": "rotate-in"
    }
  },
  {
    "id": "wedding-vintage-1",
    "name": "Vintage Wedding Invitation",
    "category": [
      "wedding",
      "all"
    ],
    "primary": "#1e3a8a",
    "secondary": "#eff6ff",
    "highlight": "#3b82f6",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Plus Jakarta Sans, sans-serif",
      "messages": "Cormorant Garamond, serif"
    },
    "animations": {
      "title": "pulse",
      "details": "rotate-in",
      "photos": "fade-in"
    }
  },
  {
    "id": "wedding-vintage-2",
    "name": "Vintage Wedding Invitation",
    "category": [
      "wedding",
      "all"
    ],
    "primary": "#312e81",
    "secondary": "#e0e7ff",
    "highlight": "#6366f1",
    "fonts": {
      "title": "Cinzel, serif",
      "recipient": "Montserrat, sans-serif",
      "messages": "Outfit, sans-serif"
    },
    "animations": {
      "title": "rotate-in",
      "details": "fade-in",
      "photos": "slide-up"
    }
  },
  {
    "id": "wedding-rustic-1",
    "name": "Rustic Wedding Invitation",
    "category": [
      "wedding",
      "all"
    ],
    "primary": "#581c87",
    "secondary": "#f3e8ff",
    "highlight": "#a855f7",
    "fonts": {
      "title": "Dancing Script, cursive",
      "recipient": "Caveat, cursive",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "fade-in",
      "details": "slide-up",
      "photos": "slide-left"
    }
  },
  {
    "id": "wedding-rustic-2",
    "name": "Rustic Wedding Invitation",
    "category": [
      "wedding",
      "all"
    ],
    "primary": "#701a75",
    "secondary": "#fdf4ff",
    "highlight": "#d946ef",
    "fonts": {
      "title": "Montserrat, sans-serif",
      "recipient": "Outfit, sans-serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "slide-up",
      "details": "slide-left",
      "photos": "zoom-in"
    }
  },
  {
    "id": "wedding-elegant-1",
    "name": "Elegant Wedding Invitation",
    "category": [
      "wedding",
      "all"
    ],
    "primary": "#be123c",
    "secondary": "#fff1f2",
    "highlight": "#fb7185",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Cormorant Garamond, serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "slide-left",
      "details": "zoom-in",
      "photos": "bounce-in"
    }
  },
  {
    "id": "wedding-elegant-2",
    "name": "Elegant Wedding Invitation",
    "category": [
      "wedding",
      "all"
    ],
    "primary": "#881337",
    "secondary": "#fffbe1",
    "highlight": "#d97706",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Plus Jakarta Sans, sans-serif",
      "messages": "Cormorant Garamond, serif"
    },
    "animations": {
      "title": "zoom-in",
      "details": "bounce-in",
      "photos": "pulse"
    }
  },
  {
    "id": "wedding-traditional-1",
    "name": "Traditional Wedding Invitation",
    "category": [
      "wedding",
      "all"
    ],
    "primary": "#065f46",
    "secondary": "#ecfdf5",
    "highlight": "#059669",
    "fonts": {
      "title": "Cinzel, serif",
      "recipient": "Montserrat, sans-serif",
      "messages": "Outfit, sans-serif"
    },
    "animations": {
      "title": "bounce-in",
      "details": "pulse",
      "photos": "rotate-in"
    }
  },
  {
    "id": "wedding-traditional-2",
    "name": "Traditional Wedding Invitation",
    "category": [
      "wedding",
      "all"
    ],
    "primary": "#9f1239",
    "secondary": "#fff1f2",
    "highlight": "#f43f5e",
    "fonts": {
      "title": "Dancing Script, cursive",
      "recipient": "Caveat, cursive",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "pulse",
      "details": "rotate-in",
      "photos": "fade-in"
    }
  },
  {
    "id": "wedding-modern-1",
    "name": "Modern Wedding Invitation",
    "category": [
      "wedding",
      "all"
    ],
    "primary": "#0f172a",
    "secondary": "#f8fafc",
    "highlight": "#f59e0b",
    "fonts": {
      "title": "Montserrat, sans-serif",
      "recipient": "Outfit, sans-serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "rotate-in",
      "details": "fade-in",
      "photos": "slide-up"
    }
  },
  {
    "id": "wedding-modern-2",
    "name": "Modern Wedding Invitation",
    "category": [
      "wedding",
      "all"
    ],
    "primary": "#b45309",
    "secondary": "#fefce8",
    "highlight": "#dc2626",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Cormorant Garamond, serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "fade-in",
      "details": "slide-up",
      "photos": "slide-left"
    }
  },
  {
    "id": "wedding-floral-1",
    "name": "Floral Wedding Invitation",
    "category": [
      "wedding",
      "all"
    ],
    "primary": "#1e3a8a",
    "secondary": "#eff6ff",
    "highlight": "#3b82f6",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Plus Jakarta Sans, sans-serif",
      "messages": "Cormorant Garamond, serif"
    },
    "animations": {
      "title": "slide-up",
      "details": "slide-left",
      "photos": "zoom-in"
    }
  },
  {
    "id": "wedding-floral-2",
    "name": "Floral Wedding Invitation",
    "category": [
      "wedding",
      "all"
    ],
    "primary": "#312e81",
    "secondary": "#e0e7ff",
    "highlight": "#6366f1",
    "fonts": {
      "title": "Cinzel, serif",
      "recipient": "Montserrat, sans-serif",
      "messages": "Outfit, sans-serif"
    },
    "animations": {
      "title": "slide-left",
      "details": "zoom-in",
      "photos": "bounce-in"
    }
  },
  {
    "id": "wedding-golden-1",
    "name": "Golden Wedding Invitation",
    "category": [
      "wedding",
      "all"
    ],
    "primary": "#581c87",
    "secondary": "#f3e8ff",
    "highlight": "#a855f7",
    "fonts": {
      "title": "Dancing Script, cursive",
      "recipient": "Caveat, cursive",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "zoom-in",
      "details": "bounce-in",
      "photos": "pulse"
    }
  },
  {
    "id": "wedding-golden-2",
    "name": "Golden Wedding Invitation",
    "category": [
      "wedding",
      "all"
    ],
    "primary": "#701a75",
    "secondary": "#fdf4ff",
    "highlight": "#d946ef",
    "fonts": {
      "title": "Montserrat, sans-serif",
      "recipient": "Outfit, sans-serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "bounce-in",
      "details": "pulse",
      "photos": "rotate-in"
    }
  },
  {
    "id": "wedding-classic-1",
    "name": "Classic Wedding Invitation",
    "category": [
      "wedding",
      "all"
    ],
    "primary": "#be123c",
    "secondary": "#fff1f2",
    "highlight": "#fb7185",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Cormorant Garamond, serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "pulse",
      "details": "rotate-in",
      "photos": "fade-in"
    }
  },
  {
    "id": "wedding-classic-2",
    "name": "Classic Wedding Invitation",
    "category": [
      "wedding",
      "all"
    ],
    "primary": "#881337",
    "secondary": "#fffbe1",
    "highlight": "#d97706",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Plus Jakarta Sans, sans-serif",
      "messages": "Cormorant Garamond, serif"
    },
    "animations": {
      "title": "rotate-in",
      "details": "fade-in",
      "photos": "slide-up"
    }
  },
  {
    "id": "engagement-gold-ring-1",
    "name": "Gold Ring Engagement Invitation",
    "category": [
      "engagement",
      "all"
    ],
    "primary": "#065f46",
    "secondary": "#ecfdf5",
    "highlight": "#059669",
    "fonts": {
      "title": "Cinzel, serif",
      "recipient": "Montserrat, sans-serif",
      "messages": "Outfit, sans-serif"
    },
    "animations": {
      "title": "fade-in",
      "details": "slide-up",
      "photos": "slide-left"
    }
  },
  {
    "id": "engagement-gold-ring-2",
    "name": "Gold Ring Engagement Invitation",
    "category": [
      "engagement",
      "all"
    ],
    "primary": "#9f1239",
    "secondary": "#fff1f2",
    "highlight": "#f43f5e",
    "fonts": {
      "title": "Dancing Script, cursive",
      "recipient": "Caveat, cursive",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "slide-up",
      "details": "slide-left",
      "photos": "zoom-in"
    }
  },
  {
    "id": "engagement-chalkboard-1",
    "name": "Chalkboard Engagement Invitation",
    "category": [
      "engagement",
      "all"
    ],
    "primary": "#0f172a",
    "secondary": "#f8fafc",
    "highlight": "#f59e0b",
    "fonts": {
      "title": "Montserrat, sans-serif",
      "recipient": "Outfit, sans-serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "slide-left",
      "details": "zoom-in",
      "photos": "bounce-in"
    }
  },
  {
    "id": "engagement-chalkboard-2",
    "name": "Chalkboard Engagement Invitation",
    "category": [
      "engagement",
      "all"
    ],
    "primary": "#b45309",
    "secondary": "#fefce8",
    "highlight": "#dc2626",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Cormorant Garamond, serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "zoom-in",
      "details": "bounce-in",
      "photos": "pulse"
    }
  },
  {
    "id": "engagement-whimsical-1",
    "name": "Whimsical Engagement Invitation",
    "category": [
      "engagement",
      "all"
    ],
    "primary": "#1e3a8a",
    "secondary": "#eff6ff",
    "highlight": "#3b82f6",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Plus Jakarta Sans, sans-serif",
      "messages": "Cormorant Garamond, serif"
    },
    "animations": {
      "title": "bounce-in",
      "details": "pulse",
      "photos": "rotate-in"
    }
  },
  {
    "id": "engagement-whimsical-2",
    "name": "Whimsical Engagement Invitation",
    "category": [
      "engagement",
      "all"
    ],
    "primary": "#312e81",
    "secondary": "#e0e7ff",
    "highlight": "#6366f1",
    "fonts": {
      "title": "Cinzel, serif",
      "recipient": "Montserrat, sans-serif",
      "messages": "Outfit, sans-serif"
    },
    "animations": {
      "title": "pulse",
      "details": "rotate-in",
      "photos": "fade-in"
    }
  },
  {
    "id": "engagement-sparkling-1",
    "name": "Sparkling Engagement Invitation",
    "category": [
      "engagement",
      "all"
    ],
    "primary": "#581c87",
    "secondary": "#f3e8ff",
    "highlight": "#a855f7",
    "fonts": {
      "title": "Dancing Script, cursive",
      "recipient": "Caveat, cursive",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "rotate-in",
      "details": "fade-in",
      "photos": "slide-up"
    }
  },
  {
    "id": "engagement-sparkling-2",
    "name": "Sparkling Engagement Invitation",
    "category": [
      "engagement",
      "all"
    ],
    "primary": "#701a75",
    "secondary": "#fdf4ff",
    "highlight": "#d946ef",
    "fonts": {
      "title": "Montserrat, sans-serif",
      "recipient": "Outfit, sans-serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "fade-in",
      "details": "slide-up",
      "photos": "slide-left"
    }
  },
  {
    "id": "engagement-classic-1",
    "name": "Classic Engagement Invitation",
    "category": [
      "engagement",
      "all"
    ],
    "primary": "#be123c",
    "secondary": "#fff1f2",
    "highlight": "#fb7185",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Cormorant Garamond, serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "slide-up",
      "details": "slide-left",
      "photos": "zoom-in"
    }
  },
  {
    "id": "engagement-classic-2",
    "name": "Classic Engagement Invitation",
    "category": [
      "engagement",
      "all"
    ],
    "primary": "#881337",
    "secondary": "#fffbe1",
    "highlight": "#d97706",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Plus Jakarta Sans, sans-serif",
      "messages": "Cormorant Garamond, serif"
    },
    "animations": {
      "title": "slide-left",
      "details": "zoom-in",
      "photos": "bounce-in"
    }
  },
  {
    "id": "housewarming-home-sweet-home-1",
    "name": "Home Sweet Home Housewarming Invitation",
    "category": [
      "housewarming",
      "all"
    ],
    "primary": "#065f46",
    "secondary": "#ecfdf5",
    "highlight": "#059669",
    "fonts": {
      "title": "Cinzel, serif",
      "recipient": "Montserrat, sans-serif",
      "messages": "Outfit, sans-serif"
    },
    "animations": {
      "title": "zoom-in",
      "details": "bounce-in",
      "photos": "pulse"
    }
  },
  {
    "id": "housewarming-home-sweet-home-2",
    "name": "Home Sweet Home Housewarming Invitation",
    "category": [
      "housewarming",
      "all"
    ],
    "primary": "#9f1239",
    "secondary": "#fff1f2",
    "highlight": "#f43f5e",
    "fonts": {
      "title": "Dancing Script, cursive",
      "recipient": "Caveat, cursive",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "bounce-in",
      "details": "pulse",
      "photos": "rotate-in"
    }
  },
  {
    "id": "housewarming-green-wreath-1",
    "name": "Green Wreath Housewarming Invitation",
    "category": [
      "housewarming",
      "all"
    ],
    "primary": "#0f172a",
    "secondary": "#f8fafc",
    "highlight": "#f59e0b",
    "fonts": {
      "title": "Montserrat, sans-serif",
      "recipient": "Outfit, sans-serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "pulse",
      "details": "rotate-in",
      "photos": "fade-in"
    }
  },
  {
    "id": "housewarming-green-wreath-2",
    "name": "Green Wreath Housewarming Invitation",
    "category": [
      "housewarming",
      "all"
    ],
    "primary": "#b45309",
    "secondary": "#fefce8",
    "highlight": "#dc2626",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Cormorant Garamond, serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "rotate-in",
      "details": "fade-in",
      "photos": "slide-up"
    }
  },
  {
    "id": "housewarming-modern-1",
    "name": "Modern Housewarming Invitation",
    "category": [
      "housewarming",
      "all"
    ],
    "primary": "#1e3a8a",
    "secondary": "#eff6ff",
    "highlight": "#3b82f6",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Plus Jakarta Sans, sans-serif",
      "messages": "Cormorant Garamond, serif"
    },
    "animations": {
      "title": "fade-in",
      "details": "slide-up",
      "photos": "slide-left"
    }
  },
  {
    "id": "housewarming-modern-2",
    "name": "Modern Housewarming Invitation",
    "category": [
      "housewarming",
      "all"
    ],
    "primary": "#312e81",
    "secondary": "#e0e7ff",
    "highlight": "#6366f1",
    "fonts": {
      "title": "Cinzel, serif",
      "recipient": "Montserrat, sans-serif",
      "messages": "Outfit, sans-serif"
    },
    "animations": {
      "title": "slide-up",
      "details": "slide-left",
      "photos": "zoom-in"
    }
  },
  {
    "id": "housewarming-cozy-1",
    "name": "Cozy Housewarming Invitation",
    "category": [
      "housewarming",
      "all"
    ],
    "primary": "#581c87",
    "secondary": "#f3e8ff",
    "highlight": "#a855f7",
    "fonts": {
      "title": "Dancing Script, cursive",
      "recipient": "Caveat, cursive",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "slide-left",
      "details": "zoom-in",
      "photos": "bounce-in"
    }
  },
  {
    "id": "housewarming-cozy-2",
    "name": "Cozy Housewarming Invitation",
    "category": [
      "housewarming",
      "all"
    ],
    "primary": "#701a75",
    "secondary": "#fdf4ff",
    "highlight": "#d946ef",
    "fonts": {
      "title": "Montserrat, sans-serif",
      "recipient": "Outfit, sans-serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "zoom-in",
      "details": "bounce-in",
      "photos": "pulse"
    }
  },
  {
    "id": "housewarming-new-beginnings-1",
    "name": "New Beginnings Housewarming Invitation",
    "category": [
      "housewarming",
      "all"
    ],
    "primary": "#be123c",
    "secondary": "#fff1f2",
    "highlight": "#fb7185",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Cormorant Garamond, serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "bounce-in",
      "details": "pulse",
      "photos": "rotate-in"
    }
  },
  {
    "id": "housewarming-new-beginnings-2",
    "name": "New Beginnings Housewarming Invitation",
    "category": [
      "housewarming",
      "all"
    ],
    "primary": "#881337",
    "secondary": "#fffbe1",
    "highlight": "#d97706",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Plus Jakarta Sans, sans-serif",
      "messages": "Cormorant Garamond, serif"
    },
    "animations": {
      "title": "pulse",
      "details": "rotate-in",
      "photos": "fade-in"
    }
  },
  {
    "id": "birthday-luxury-50th-1",
    "name": "Luxury 50th Birthday Invitation",
    "category": [
      "birthday",
      "all"
    ],
    "primary": "#065f46",
    "secondary": "#ecfdf5",
    "highlight": "#059669",
    "fonts": {
      "title": "Cinzel, serif",
      "recipient": "Montserrat, sans-serif",
      "messages": "Outfit, sans-serif"
    },
    "animations": {
      "title": "rotate-in",
      "details": "fade-in",
      "photos": "slide-up"
    }
  },
  {
    "id": "birthday-luxury-50th-2",
    "name": "Luxury 50th Birthday Invitation",
    "category": [
      "birthday",
      "all"
    ],
    "primary": "#9f1239",
    "secondary": "#fff1f2",
    "highlight": "#f43f5e",
    "fonts": {
      "title": "Dancing Script, cursive",
      "recipient": "Caveat, cursive",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "fade-in",
      "details": "slide-up",
      "photos": "slide-left"
    }
  },
  {
    "id": "birthday-galaxy-1",
    "name": "Galaxy Birthday Invitation",
    "category": [
      "birthday",
      "all"
    ],
    "primary": "#0f172a",
    "secondary": "#f8fafc",
    "highlight": "#f59e0b",
    "fonts": {
      "title": "Montserrat, sans-serif",
      "recipient": "Outfit, sans-serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "slide-up",
      "details": "slide-left",
      "photos": "zoom-in"
    }
  },
  {
    "id": "birthday-galaxy-2",
    "name": "Galaxy Birthday Invitation",
    "category": [
      "birthday",
      "all"
    ],
    "primary": "#b45309",
    "secondary": "#fefce8",
    "highlight": "#dc2626",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Cormorant Garamond, serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "slide-left",
      "details": "zoom-in",
      "photos": "bounce-in"
    }
  },
  {
    "id": "birthday-hipster-retro-1",
    "name": "Hipster Retro Birthday Invitation",
    "category": [
      "birthday",
      "all"
    ],
    "primary": "#1e3a8a",
    "secondary": "#eff6ff",
    "highlight": "#3b82f6",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Plus Jakarta Sans, sans-serif",
      "messages": "Cormorant Garamond, serif"
    },
    "animations": {
      "title": "zoom-in",
      "details": "bounce-in",
      "photos": "pulse"
    }
  },
  {
    "id": "birthday-hipster-retro-2",
    "name": "Hipster Retro Birthday Invitation",
    "category": [
      "birthday",
      "all"
    ],
    "primary": "#312e81",
    "secondary": "#e0e7ff",
    "highlight": "#6366f1",
    "fonts": {
      "title": "Cinzel, serif",
      "recipient": "Montserrat, sans-serif",
      "messages": "Outfit, sans-serif"
    },
    "animations": {
      "title": "bounce-in",
      "details": "pulse",
      "photos": "rotate-in"
    }
  },
  {
    "id": "birthday-cartoon-animals-1",
    "name": "Cartoon Animals Birthday Invitation",
    "category": [
      "birthday",
      "all"
    ],
    "primary": "#581c87",
    "secondary": "#f3e8ff",
    "highlight": "#a855f7",
    "fonts": {
      "title": "Dancing Script, cursive",
      "recipient": "Caveat, cursive",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "pulse",
      "details": "rotate-in",
      "photos": "fade-in"
    }
  },
  {
    "id": "birthday-cartoon-animals-2",
    "name": "Cartoon Animals Birthday Invitation",
    "category": [
      "birthday",
      "all"
    ],
    "primary": "#701a75",
    "secondary": "#fdf4ff",
    "highlight": "#d946ef",
    "fonts": {
      "title": "Montserrat, sans-serif",
      "recipient": "Outfit, sans-serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "rotate-in",
      "details": "fade-in",
      "photos": "slide-up"
    }
  },
  {
    "id": "birthday-rainbow-unicorn-1",
    "name": "Rainbow Unicorn Birthday Invitation",
    "category": [
      "birthday",
      "all"
    ],
    "primary": "#be123c",
    "secondary": "#fff1f2",
    "highlight": "#fb7185",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Cormorant Garamond, serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "fade-in",
      "details": "slide-up",
      "photos": "slide-left"
    }
  },
  {
    "id": "birthday-rainbow-unicorn-2",
    "name": "Rainbow Unicorn Birthday Invitation",
    "category": [
      "birthday",
      "all"
    ],
    "primary": "#881337",
    "secondary": "#fffbe1",
    "highlight": "#d97706",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Plus Jakarta Sans, sans-serif",
      "messages": "Cormorant Garamond, serif"
    },
    "animations": {
      "title": "slide-up",
      "details": "slide-left",
      "photos": "zoom-in"
    }
  },
  {
    "id": "birthday-space-rocket-1",
    "name": "Space Rocket Birthday Invitation",
    "category": [
      "birthday",
      "all"
    ],
    "primary": "#065f46",
    "secondary": "#ecfdf5",
    "highlight": "#059669",
    "fonts": {
      "title": "Cinzel, serif",
      "recipient": "Montserrat, sans-serif",
      "messages": "Outfit, sans-serif"
    },
    "animations": {
      "title": "slide-left",
      "details": "zoom-in",
      "photos": "bounce-in"
    }
  },
  {
    "id": "birthday-space-rocket-2",
    "name": "Space Rocket Birthday Invitation",
    "category": [
      "birthday",
      "all"
    ],
    "primary": "#9f1239",
    "secondary": "#fff1f2",
    "highlight": "#f43f5e",
    "fonts": {
      "title": "Dancing Script, cursive",
      "recipient": "Caveat, cursive",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "zoom-in",
      "details": "bounce-in",
      "photos": "pulse"
    }
  },
  {
    "id": "birthday-balloon-bash-1",
    "name": "Balloon Bash Birthday Invitation",
    "category": [
      "birthday",
      "all"
    ],
    "primary": "#0f172a",
    "secondary": "#f8fafc",
    "highlight": "#f59e0b",
    "fonts": {
      "title": "Montserrat, sans-serif",
      "recipient": "Outfit, sans-serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "bounce-in",
      "details": "pulse",
      "photos": "rotate-in"
    }
  },
  {
    "id": "birthday-balloon-bash-2",
    "name": "Balloon Bash Birthday Invitation",
    "category": [
      "birthday",
      "all"
    ],
    "primary": "#b45309",
    "secondary": "#fefce8",
    "highlight": "#dc2626",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Cormorant Garamond, serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "pulse",
      "details": "rotate-in",
      "photos": "fade-in"
    }
  },
  {
    "id": "baby-shower-baby-feet-1",
    "name": "Baby Feet Baby Shower Invitation",
    "category": [
      "baby-shower",
      "all"
    ],
    "primary": "#1e3a8a",
    "secondary": "#eff6ff",
    "highlight": "#3b82f6",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Plus Jakarta Sans, sans-serif",
      "messages": "Cormorant Garamond, serif"
    },
    "animations": {
      "title": "rotate-in",
      "details": "fade-in",
      "photos": "slide-up"
    }
  },
  {
    "id": "baby-shower-baby-feet-2",
    "name": "Baby Feet Baby Shower Invitation",
    "category": [
      "baby-shower",
      "all"
    ],
    "primary": "#312e81",
    "secondary": "#e0e7ff",
    "highlight": "#6366f1",
    "fonts": {
      "title": "Cinzel, serif",
      "recipient": "Montserrat, sans-serif",
      "messages": "Outfit, sans-serif"
    },
    "animations": {
      "title": "fade-in",
      "details": "slide-up",
      "photos": "slide-left"
    }
  },
  {
    "id": "baby-shower-safari-animal-1",
    "name": "Safari Animal Baby Shower Invitation",
    "category": [
      "baby-shower",
      "all"
    ],
    "primary": "#581c87",
    "secondary": "#f3e8ff",
    "highlight": "#a855f7",
    "fonts": {
      "title": "Dancing Script, cursive",
      "recipient": "Caveat, cursive",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "slide-up",
      "details": "slide-left",
      "photos": "zoom-in"
    }
  },
  {
    "id": "baby-shower-safari-animal-2",
    "name": "Safari Animal Baby Shower Invitation",
    "category": [
      "baby-shower",
      "all"
    ],
    "primary": "#701a75",
    "secondary": "#fdf4ff",
    "highlight": "#d946ef",
    "fonts": {
      "title": "Montserrat, sans-serif",
      "recipient": "Outfit, sans-serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "slide-left",
      "details": "zoom-in",
      "photos": "bounce-in"
    }
  },
  {
    "id": "baby-shower-gender-neutral-1",
    "name": "Gender-Neutral Baby Shower Invitation",
    "category": [
      "baby-shower",
      "all"
    ],
    "primary": "#be123c",
    "secondary": "#fff1f2",
    "highlight": "#fb7185",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Cormorant Garamond, serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "zoom-in",
      "details": "bounce-in",
      "photos": "pulse"
    }
  },
  {
    "id": "baby-shower-gender-neutral-2",
    "name": "Gender-Neutral Baby Shower Invitation",
    "category": [
      "baby-shower",
      "all"
    ],
    "primary": "#881337",
    "secondary": "#fffbe1",
    "highlight": "#d97706",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Plus Jakarta Sans, sans-serif",
      "messages": "Cormorant Garamond, serif"
    },
    "animations": {
      "title": "bounce-in",
      "details": "pulse",
      "photos": "rotate-in"
    }
  },
  {
    "id": "baby-shower-blue-balloon-1",
    "name": "Blue Balloon Baby Shower Invitation",
    "category": [
      "baby-shower",
      "all"
    ],
    "primary": "#065f46",
    "secondary": "#ecfdf5",
    "highlight": "#059669",
    "fonts": {
      "title": "Cinzel, serif",
      "recipient": "Montserrat, sans-serif",
      "messages": "Outfit, sans-serif"
    },
    "animations": {
      "title": "pulse",
      "details": "rotate-in",
      "photos": "fade-in"
    }
  },
  {
    "id": "baby-shower-blue-balloon-2",
    "name": "Blue Balloon Baby Shower Invitation",
    "category": [
      "baby-shower",
      "all"
    ],
    "primary": "#9f1239",
    "secondary": "#fff1f2",
    "highlight": "#f43f5e",
    "fonts": {
      "title": "Dancing Script, cursive",
      "recipient": "Caveat, cursive",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "rotate-in",
      "details": "fade-in",
      "photos": "slide-up"
    }
  },
  {
    "id": "baby-shower-pink-floral-1",
    "name": "Pink Floral Baby Shower Invitation",
    "category": [
      "baby-shower",
      "all"
    ],
    "primary": "#0f172a",
    "secondary": "#f8fafc",
    "highlight": "#f59e0b",
    "fonts": {
      "title": "Montserrat, sans-serif",
      "recipient": "Outfit, sans-serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "fade-in",
      "details": "slide-up",
      "photos": "slide-left"
    }
  },
  {
    "id": "baby-shower-pink-floral-2",
    "name": "Pink Floral Baby Shower Invitation",
    "category": [
      "baby-shower",
      "all"
    ],
    "primary": "#b45309",
    "secondary": "#fefce8",
    "highlight": "#dc2626",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Cormorant Garamond, serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "slide-up",
      "details": "slide-left",
      "photos": "zoom-in"
    }
  },
  {
    "id": "anniversary-golden-1",
    "name": "Golden Anniversary Invitation",
    "category": [
      "anniversary",
      "all"
    ],
    "primary": "#1e3a8a",
    "secondary": "#eff6ff",
    "highlight": "#3b82f6",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Plus Jakarta Sans, sans-serif",
      "messages": "Cormorant Garamond, serif"
    },
    "animations": {
      "title": "slide-left",
      "details": "zoom-in",
      "photos": "bounce-in"
    }
  },
  {
    "id": "anniversary-golden-2",
    "name": "Golden Anniversary Invitation",
    "category": [
      "anniversary",
      "all"
    ],
    "primary": "#312e81",
    "secondary": "#e0e7ff",
    "highlight": "#6366f1",
    "fonts": {
      "title": "Cinzel, serif",
      "recipient": "Montserrat, sans-serif",
      "messages": "Outfit, sans-serif"
    },
    "animations": {
      "title": "zoom-in",
      "details": "bounce-in",
      "photos": "pulse"
    }
  },
  {
    "id": "anniversary-diamond-1",
    "name": "Diamond Anniversary Invitation",
    "category": [
      "anniversary",
      "all"
    ],
    "primary": "#581c87",
    "secondary": "#f3e8ff",
    "highlight": "#a855f7",
    "fonts": {
      "title": "Dancing Script, cursive",
      "recipient": "Caveat, cursive",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "bounce-in",
      "details": "pulse",
      "photos": "rotate-in"
    }
  },
  {
    "id": "anniversary-diamond-2",
    "name": "Diamond Anniversary Invitation",
    "category": [
      "anniversary",
      "all"
    ],
    "primary": "#701a75",
    "secondary": "#fdf4ff",
    "highlight": "#d946ef",
    "fonts": {
      "title": "Montserrat, sans-serif",
      "recipient": "Outfit, sans-serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "pulse",
      "details": "rotate-in",
      "photos": "fade-in"
    }
  },
  {
    "id": "anniversary-silly-1",
    "name": "Silly Anniversary Invitation",
    "category": [
      "anniversary",
      "all"
    ],
    "primary": "#be123c",
    "secondary": "#fff1f2",
    "highlight": "#fb7185",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Cormorant Garamond, serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "rotate-in",
      "details": "fade-in",
      "photos": "slide-up"
    }
  },
  {
    "id": "anniversary-silly-2",
    "name": "Silly Anniversary Invitation",
    "category": [
      "anniversary",
      "all"
    ],
    "primary": "#881337",
    "secondary": "#fffbe1",
    "highlight": "#d97706",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Plus Jakarta Sans, sans-serif",
      "messages": "Cormorant Garamond, serif"
    },
    "animations": {
      "title": "fade-in",
      "details": "slide-up",
      "photos": "slide-left"
    }
  },
  {
    "id": "anniversary-romantic-1",
    "name": "Romantic Anniversary Invitation",
    "category": [
      "anniversary",
      "all"
    ],
    "primary": "#065f46",
    "secondary": "#ecfdf5",
    "highlight": "#059669",
    "fonts": {
      "title": "Cinzel, serif",
      "recipient": "Montserrat, sans-serif",
      "messages": "Outfit, sans-serif"
    },
    "animations": {
      "title": "slide-up",
      "details": "slide-left",
      "photos": "zoom-in"
    }
  },
  {
    "id": "anniversary-romantic-2",
    "name": "Romantic Anniversary Invitation",
    "category": [
      "anniversary",
      "all"
    ],
    "primary": "#9f1239",
    "secondary": "#fff1f2",
    "highlight": "#f43f5e",
    "fonts": {
      "title": "Dancing Script, cursive",
      "recipient": "Caveat, cursive",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "slide-left",
      "details": "zoom-in",
      "photos": "bounce-in"
    }
  },
  {
    "id": "anniversary-milestone-1",
    "name": "Milestone Anniversary Invitation",
    "category": [
      "anniversary",
      "all"
    ],
    "primary": "#0f172a",
    "secondary": "#f8fafc",
    "highlight": "#f59e0b",
    "fonts": {
      "title": "Montserrat, sans-serif",
      "recipient": "Outfit, sans-serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "zoom-in",
      "details": "bounce-in",
      "photos": "pulse"
    }
  },
  {
    "id": "anniversary-milestone-2",
    "name": "Milestone Anniversary Invitation",
    "category": [
      "anniversary",
      "all"
    ],
    "primary": "#b45309",
    "secondary": "#fefce8",
    "highlight": "#dc2626",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Cormorant Garamond, serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "bounce-in",
      "details": "pulse",
      "photos": "rotate-in"
    }
  },
  {
    "id": "party-diwali-festival-1",
    "name": "Diwali Festival Party Invitation",
    "category": [
      "party",
      "all"
    ],
    "primary": "#1e3a8a",
    "secondary": "#eff6ff",
    "highlight": "#3b82f6",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Plus Jakarta Sans, sans-serif",
      "messages": "Cormorant Garamond, serif"
    },
    "animations": {
      "title": "pulse",
      "details": "rotate-in",
      "photos": "fade-in"
    }
  },
  {
    "id": "party-diwali-festival-2",
    "name": "Diwali Festival Party Invitation",
    "category": [
      "party",
      "all"
    ],
    "primary": "#312e81",
    "secondary": "#e0e7ff",
    "highlight": "#6366f1",
    "fonts": {
      "title": "Cinzel, serif",
      "recipient": "Montserrat, sans-serif",
      "messages": "Outfit, sans-serif"
    },
    "animations": {
      "title": "rotate-in",
      "details": "fade-in",
      "photos": "slide-up"
    }
  },
  {
    "id": "party-christmas-snowflake-1",
    "name": "Christmas Snowflake Party Invitation",
    "category": [
      "party",
      "all"
    ],
    "primary": "#581c87",
    "secondary": "#f3e8ff",
    "highlight": "#a855f7",
    "fonts": {
      "title": "Dancing Script, cursive",
      "recipient": "Caveat, cursive",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "fade-in",
      "details": "slide-up",
      "photos": "slide-left"
    }
  },
  {
    "id": "party-christmas-snowflake-2",
    "name": "Christmas Snowflake Party Invitation",
    "category": [
      "party",
      "all"
    ],
    "primary": "#701a75",
    "secondary": "#fdf4ff",
    "highlight": "#d946ef",
    "fonts": {
      "title": "Montserrat, sans-serif",
      "recipient": "Outfit, sans-serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "slide-up",
      "details": "slide-left",
      "photos": "zoom-in"
    }
  },
  {
    "id": "party-pool-party-1",
    "name": "Pool Party Party Invitation",
    "category": [
      "party",
      "all"
    ],
    "primary": "#be123c",
    "secondary": "#fff1f2",
    "highlight": "#fb7185",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Cormorant Garamond, serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "slide-left",
      "details": "zoom-in",
      "photos": "bounce-in"
    }
  },
  {
    "id": "party-pool-party-2",
    "name": "Pool Party Party Invitation",
    "category": [
      "party",
      "all"
    ],
    "primary": "#881337",
    "secondary": "#fffbe1",
    "highlight": "#d97706",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Plus Jakarta Sans, sans-serif",
      "messages": "Cormorant Garamond, serif"
    },
    "animations": {
      "title": "zoom-in",
      "details": "bounce-in",
      "photos": "pulse"
    }
  },
  {
    "id": "party-garden-tea-1",
    "name": "Garden Tea Party Invitation",
    "category": [
      "party",
      "all"
    ],
    "primary": "#065f46",
    "secondary": "#ecfdf5",
    "highlight": "#059669",
    "fonts": {
      "title": "Cinzel, serif",
      "recipient": "Montserrat, sans-serif",
      "messages": "Outfit, sans-serif"
    },
    "animations": {
      "title": "bounce-in",
      "details": "pulse",
      "photos": "rotate-in"
    }
  },
  {
    "id": "party-garden-tea-2",
    "name": "Garden Tea Party Invitation",
    "category": [
      "party",
      "all"
    ],
    "primary": "#9f1239",
    "secondary": "#fff1f2",
    "highlight": "#f43f5e",
    "fonts": {
      "title": "Dancing Script, cursive",
      "recipient": "Caveat, cursive",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "pulse",
      "details": "rotate-in",
      "photos": "fade-in"
    }
  },
  {
    "id": "party-neon-night-1",
    "name": "Neon Night Party Invitation",
    "category": [
      "party",
      "all"
    ],
    "primary": "#0f172a",
    "secondary": "#f8fafc",
    "highlight": "#f59e0b",
    "fonts": {
      "title": "Montserrat, sans-serif",
      "recipient": "Outfit, sans-serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "rotate-in",
      "details": "fade-in",
      "photos": "slide-up"
    }
  },
  {
    "id": "party-neon-night-2",
    "name": "Neon Night Party Invitation",
    "category": [
      "party",
      "all"
    ],
    "primary": "#b45309",
    "secondary": "#fefce8",
    "highlight": "#dc2626",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Cormorant Garamond, serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "fade-in",
      "details": "slide-up",
      "photos": "slide-left"
    }
  },
  {
    "id": "corporate-modern-conference-1",
    "name": "Modern Conference Corporate Invitation",
    "category": [
      "corporate",
      "all"
    ],
    "primary": "#1e3a8a",
    "secondary": "#eff6ff",
    "highlight": "#3b82f6",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Plus Jakarta Sans, sans-serif",
      "messages": "Cormorant Garamond, serif"
    },
    "animations": {
      "title": "slide-up",
      "details": "slide-left",
      "photos": "zoom-in"
    }
  },
  {
    "id": "corporate-modern-conference-2",
    "name": "Modern Conference Corporate Invitation",
    "category": [
      "corporate",
      "all"
    ],
    "primary": "#312e81",
    "secondary": "#e0e7ff",
    "highlight": "#6366f1",
    "fonts": {
      "title": "Cinzel, serif",
      "recipient": "Montserrat, sans-serif",
      "messages": "Outfit, sans-serif"
    },
    "animations": {
      "title": "slide-left",
      "details": "zoom-in",
      "photos": "bounce-in"
    }
  },
  {
    "id": "corporate-tech-meetup-1",
    "name": "Tech Meetup Corporate Invitation",
    "category": [
      "corporate",
      "all"
    ],
    "primary": "#581c87",
    "secondary": "#f3e8ff",
    "highlight": "#a855f7",
    "fonts": {
      "title": "Dancing Script, cursive",
      "recipient": "Caveat, cursive",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "zoom-in",
      "details": "bounce-in",
      "photos": "pulse"
    }
  },
  {
    "id": "corporate-tech-meetup-2",
    "name": "Tech Meetup Corporate Invitation",
    "category": [
      "corporate",
      "all"
    ],
    "primary": "#701a75",
    "secondary": "#fdf4ff",
    "highlight": "#d946ef",
    "fonts": {
      "title": "Montserrat, sans-serif",
      "recipient": "Outfit, sans-serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "bounce-in",
      "details": "pulse",
      "photos": "rotate-in"
    }
  },
  {
    "id": "corporate-workshop-1",
    "name": "Workshop Corporate Invitation",
    "category": [
      "corporate",
      "all"
    ],
    "primary": "#be123c",
    "secondary": "#fff1f2",
    "highlight": "#fb7185",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Cormorant Garamond, serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "pulse",
      "details": "rotate-in",
      "photos": "fade-in"
    }
  },
  {
    "id": "corporate-workshop-2",
    "name": "Workshop Corporate Invitation",
    "category": [
      "corporate",
      "all"
    ],
    "primary": "#881337",
    "secondary": "#fffbe1",
    "highlight": "#d97706",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Plus Jakarta Sans, sans-serif",
      "messages": "Cormorant Garamond, serif"
    },
    "animations": {
      "title": "rotate-in",
      "details": "fade-in",
      "photos": "slide-up"
    }
  },
  {
    "id": "corporate-seminar-1",
    "name": "Seminar Corporate Invitation",
    "category": [
      "corporate",
      "all"
    ],
    "primary": "#065f46",
    "secondary": "#ecfdf5",
    "highlight": "#059669",
    "fonts": {
      "title": "Cinzel, serif",
      "recipient": "Montserrat, sans-serif",
      "messages": "Outfit, sans-serif"
    },
    "animations": {
      "title": "fade-in",
      "details": "slide-up",
      "photos": "slide-left"
    }
  },
  {
    "id": "corporate-seminar-2",
    "name": "Seminar Corporate Invitation",
    "category": [
      "corporate",
      "all"
    ],
    "primary": "#9f1239",
    "secondary": "#fff1f2",
    "highlight": "#f43f5e",
    "fonts": {
      "title": "Dancing Script, cursive",
      "recipient": "Caveat, cursive",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "slide-up",
      "details": "slide-left",
      "photos": "zoom-in"
    }
  },
  {
    "id": "corporate-networking-1",
    "name": "Networking Corporate Invitation",
    "category": [
      "corporate",
      "all"
    ],
    "primary": "#0f172a",
    "secondary": "#f8fafc",
    "highlight": "#f59e0b",
    "fonts": {
      "title": "Montserrat, sans-serif",
      "recipient": "Outfit, sans-serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "slide-left",
      "details": "zoom-in",
      "photos": "bounce-in"
    }
  },
  {
    "id": "corporate-networking-2",
    "name": "Networking Corporate Invitation",
    "category": [
      "corporate",
      "all"
    ],
    "primary": "#b45309",
    "secondary": "#fefce8",
    "highlight": "#dc2626",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Cormorant Garamond, serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "zoom-in",
      "details": "bounce-in",
      "photos": "pulse"
    }
  },
  {
    "id": "graduation-cap-&-gown-1",
    "name": "Cap & Gown Graduation Invitation",
    "category": [
      "graduation",
      "all"
    ],
    "primary": "#1e3a8a",
    "secondary": "#eff6ff",
    "highlight": "#3b82f6",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Plus Jakarta Sans, sans-serif",
      "messages": "Cormorant Garamond, serif"
    },
    "animations": {
      "title": "bounce-in",
      "details": "pulse",
      "photos": "rotate-in"
    }
  },
  {
    "id": "graduation-cap-&-gown-2",
    "name": "Cap & Gown Graduation Invitation",
    "category": [
      "graduation",
      "all"
    ],
    "primary": "#312e81",
    "secondary": "#e0e7ff",
    "highlight": "#6366f1",
    "fonts": {
      "title": "Cinzel, serif",
      "recipient": "Montserrat, sans-serif",
      "messages": "Outfit, sans-serif"
    },
    "animations": {
      "title": "pulse",
      "details": "rotate-in",
      "photos": "fade-in"
    }
  },
  {
    "id": "graduation-success-1",
    "name": "Success Graduation Invitation",
    "category": [
      "graduation",
      "all"
    ],
    "primary": "#581c87",
    "secondary": "#f3e8ff",
    "highlight": "#a855f7",
    "fonts": {
      "title": "Dancing Script, cursive",
      "recipient": "Caveat, cursive",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "rotate-in",
      "details": "fade-in",
      "photos": "slide-up"
    }
  },
  {
    "id": "graduation-success-2",
    "name": "Success Graduation Invitation",
    "category": [
      "graduation",
      "all"
    ],
    "primary": "#701a75",
    "secondary": "#fdf4ff",
    "highlight": "#d946ef",
    "fonts": {
      "title": "Montserrat, sans-serif",
      "recipient": "Outfit, sans-serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "fade-in",
      "details": "slide-up",
      "photos": "slide-left"
    }
  },
  {
    "id": "graduation-future-1",
    "name": "Future Graduation Invitation",
    "category": [
      "graduation",
      "all"
    ],
    "primary": "#be123c",
    "secondary": "#fff1f2",
    "highlight": "#fb7185",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Cormorant Garamond, serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "slide-up",
      "details": "slide-left",
      "photos": "zoom-in"
    }
  },
  {
    "id": "graduation-future-2",
    "name": "Future Graduation Invitation",
    "category": [
      "graduation",
      "all"
    ],
    "primary": "#881337",
    "secondary": "#fffbe1",
    "highlight": "#d97706",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Plus Jakarta Sans, sans-serif",
      "messages": "Cormorant Garamond, serif"
    },
    "animations": {
      "title": "slide-left",
      "details": "zoom-in",
      "photos": "bounce-in"
    }
  },
  {
    "id": "graduation-class-of-2024-1",
    "name": "Class of 2024 Graduation Invitation",
    "category": [
      "graduation",
      "all"
    ],
    "primary": "#065f46",
    "secondary": "#ecfdf5",
    "highlight": "#059669",
    "fonts": {
      "title": "Cinzel, serif",
      "recipient": "Montserrat, sans-serif",
      "messages": "Outfit, sans-serif"
    },
    "animations": {
      "title": "zoom-in",
      "details": "bounce-in",
      "photos": "pulse"
    }
  },
  {
    "id": "graduation-class-of-2024-2",
    "name": "Class of 2024 Graduation Invitation",
    "category": [
      "graduation",
      "all"
    ],
    "primary": "#9f1239",
    "secondary": "#fff1f2",
    "highlight": "#f43f5e",
    "fonts": {
      "title": "Dancing Script, cursive",
      "recipient": "Caveat, cursive",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "bounce-in",
      "details": "pulse",
      "photos": "rotate-in"
    }
  },
  {
    "id": "portfolio-showcase-1",
    "name": "Showcase Portfolio",
    "category": [
      "portfolio",
      "all"
    ],
    "primary": "#0f172a",
    "secondary": "#f8fafc",
    "highlight": "#f59e0b",
    "fonts": {
      "title": "Montserrat, sans-serif",
      "recipient": "Outfit, sans-serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "pulse",
      "details": "rotate-in",
      "photos": "fade-in"
    }
  },
  {
    "id": "portfolio-showcase-2",
    "name": "Showcase Portfolio",
    "category": [
      "portfolio",
      "all"
    ],
    "primary": "#b45309",
    "secondary": "#fefce8",
    "highlight": "#dc2626",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Cormorant Garamond, serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "rotate-in",
      "details": "fade-in",
      "photos": "slide-up"
    }
  },
  {
    "id": "portfolio-visual-artist-1",
    "name": "Visual Artist Portfolio",
    "category": [
      "portfolio",
      "all"
    ],
    "primary": "#1e3a8a",
    "secondary": "#eff6ff",
    "highlight": "#3b82f6",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Plus Jakarta Sans, sans-serif",
      "messages": "Cormorant Garamond, serif"
    },
    "animations": {
      "title": "fade-in",
      "details": "slide-up",
      "photos": "slide-left"
    }
  },
  {
    "id": "portfolio-visual-artist-2",
    "name": "Visual Artist Portfolio",
    "category": [
      "portfolio",
      "all"
    ],
    "primary": "#312e81",
    "secondary": "#e0e7ff",
    "highlight": "#6366f1",
    "fonts": {
      "title": "Cinzel, serif",
      "recipient": "Montserrat, sans-serif",
      "messages": "Outfit, sans-serif"
    },
    "animations": {
      "title": "slide-up",
      "details": "slide-left",
      "photos": "zoom-in"
    }
  },
  {
    "id": "portfolio-minimalist-1",
    "name": "Minimalist Portfolio",
    "category": [
      "portfolio",
      "all"
    ],
    "primary": "#581c87",
    "secondary": "#f3e8ff",
    "highlight": "#a855f7",
    "fonts": {
      "title": "Dancing Script, cursive",
      "recipient": "Caveat, cursive",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "slide-left",
      "details": "zoom-in",
      "photos": "bounce-in"
    }
  },
  {
    "id": "portfolio-minimalist-2",
    "name": "Minimalist Portfolio",
    "category": [
      "portfolio",
      "all"
    ],
    "primary": "#701a75",
    "secondary": "#fdf4ff",
    "highlight": "#d946ef",
    "fonts": {
      "title": "Montserrat, sans-serif",
      "recipient": "Outfit, sans-serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "zoom-in",
      "details": "bounce-in",
      "photos": "pulse"
    }
  },
  {
    "id": "portfolio-creative-1",
    "name": "Creative Portfolio",
    "category": [
      "portfolio",
      "all"
    ],
    "primary": "#be123c",
    "secondary": "#fff1f2",
    "highlight": "#fb7185",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Cormorant Garamond, serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "bounce-in",
      "details": "pulse",
      "photos": "rotate-in"
    }
  },
  {
    "id": "portfolio-creative-2",
    "name": "Creative Portfolio",
    "category": [
      "portfolio",
      "all"
    ],
    "primary": "#881337",
    "secondary": "#fffbe1",
    "highlight": "#d97706",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Plus Jakarta Sans, sans-serif",
      "messages": "Cormorant Garamond, serif"
    },
    "animations": {
      "title": "pulse",
      "details": "rotate-in",
      "photos": "fade-in"
    }
  },
  {
    "id": "flyer-product-launch-1",
    "name": "Product Launch Flyer",
    "category": [
      "flyer",
      "all"
    ],
    "primary": "#065f46",
    "secondary": "#ecfdf5",
    "highlight": "#059669",
    "fonts": {
      "title": "Cinzel, serif",
      "recipient": "Montserrat, sans-serif",
      "messages": "Outfit, sans-serif"
    },
    "animations": {
      "title": "rotate-in",
      "details": "fade-in",
      "photos": "slide-up"
    }
  },
  {
    "id": "flyer-product-launch-2",
    "name": "Product Launch Flyer",
    "category": [
      "flyer",
      "all"
    ],
    "primary": "#9f1239",
    "secondary": "#fff1f2",
    "highlight": "#f43f5e",
    "fonts": {
      "title": "Dancing Script, cursive",
      "recipient": "Caveat, cursive",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "fade-in",
      "details": "slide-up",
      "photos": "slide-left"
    }
  },
  {
    "id": "flyer-special-offer-1",
    "name": "Special Offer Flyer",
    "category": [
      "flyer",
      "all"
    ],
    "primary": "#0f172a",
    "secondary": "#f8fafc",
    "highlight": "#f59e0b",
    "fonts": {
      "title": "Montserrat, sans-serif",
      "recipient": "Outfit, sans-serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "slide-up",
      "details": "slide-left",
      "photos": "zoom-in"
    }
  },
  {
    "id": "flyer-special-offer-2",
    "name": "Special Offer Flyer",
    "category": [
      "flyer",
      "all"
    ],
    "primary": "#b45309",
    "secondary": "#fefce8",
    "highlight": "#dc2626",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Cormorant Garamond, serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "slide-left",
      "details": "zoom-in",
      "photos": "bounce-in"
    }
  },
  {
    "id": "flyer-workshop-1",
    "name": "Workshop Flyer",
    "category": [
      "flyer",
      "all"
    ],
    "primary": "#1e3a8a",
    "secondary": "#eff6ff",
    "highlight": "#3b82f6",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Plus Jakarta Sans, sans-serif",
      "messages": "Cormorant Garamond, serif"
    },
    "animations": {
      "title": "zoom-in",
      "details": "bounce-in",
      "photos": "pulse"
    }
  },
  {
    "id": "flyer-workshop-2",
    "name": "Workshop Flyer",
    "category": [
      "flyer",
      "all"
    ],
    "primary": "#312e81",
    "secondary": "#e0e7ff",
    "highlight": "#6366f1",
    "fonts": {
      "title": "Cinzel, serif",
      "recipient": "Montserrat, sans-serif",
      "messages": "Outfit, sans-serif"
    },
    "animations": {
      "title": "bounce-in",
      "details": "pulse",
      "photos": "rotate-in"
    }
  },
  {
    "id": "flyer-grand-opening-1",
    "name": "Grand Opening Flyer",
    "category": [
      "flyer",
      "all"
    ],
    "primary": "#581c87",
    "secondary": "#f3e8ff",
    "highlight": "#a855f7",
    "fonts": {
      "title": "Dancing Script, cursive",
      "recipient": "Caveat, cursive",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "pulse",
      "details": "rotate-in",
      "photos": "fade-in"
    }
  },
  {
    "id": "flyer-grand-opening-2",
    "name": "Grand Opening Flyer",
    "category": [
      "flyer",
      "all"
    ],
    "primary": "#701a75",
    "secondary": "#fdf4ff",
    "highlight": "#d946ef",
    "fonts": {
      "title": "Montserrat, sans-serif",
      "recipient": "Outfit, sans-serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "rotate-in",
      "details": "fade-in",
      "photos": "slide-up"
    }
  },
  {
    "id": "business-card-minimalist-1",
    "name": "Minimalist Business Card",
    "category": [
      "business-card",
      "all"
    ],
    "primary": "#be123c",
    "secondary": "#fff1f2",
    "highlight": "#fb7185",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Cormorant Garamond, serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "fade-in",
      "details": "slide-up",
      "photos": "slide-left"
    }
  },
  {
    "id": "business-card-minimalist-2",
    "name": "Minimalist Business Card",
    "category": [
      "business-card",
      "all"
    ],
    "primary": "#881337",
    "secondary": "#fffbe1",
    "highlight": "#d97706",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Plus Jakarta Sans, sans-serif",
      "messages": "Cormorant Garamond, serif"
    },
    "animations": {
      "title": "slide-up",
      "details": "slide-left",
      "photos": "zoom-in"
    }
  },
  {
    "id": "business-card-modern-1",
    "name": "Modern Business Card",
    "category": [
      "business-card",
      "all"
    ],
    "primary": "#065f46",
    "secondary": "#ecfdf5",
    "highlight": "#059669",
    "fonts": {
      "title": "Cinzel, serif",
      "recipient": "Montserrat, sans-serif",
      "messages": "Outfit, sans-serif"
    },
    "animations": {
      "title": "slide-left",
      "details": "zoom-in",
      "photos": "bounce-in"
    }
  },
  {
    "id": "business-card-modern-2",
    "name": "Modern Business Card",
    "category": [
      "business-card",
      "all"
    ],
    "primary": "#9f1239",
    "secondary": "#fff1f2",
    "highlight": "#f43f5e",
    "fonts": {
      "title": "Dancing Script, cursive",
      "recipient": "Caveat, cursive",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "zoom-in",
      "details": "bounce-in",
      "photos": "pulse"
    }
  },
  {
    "id": "business-card-professional-1",
    "name": "Professional Business Card",
    "category": [
      "business-card",
      "all"
    ],
    "primary": "#0f172a",
    "secondary": "#f8fafc",
    "highlight": "#f59e0b",
    "fonts": {
      "title": "Montserrat, sans-serif",
      "recipient": "Outfit, sans-serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "bounce-in",
      "details": "pulse",
      "photos": "rotate-in"
    }
  },
  {
    "id": "business-card-professional-2",
    "name": "Professional Business Card",
    "category": [
      "business-card",
      "all"
    ],
    "primary": "#b45309",
    "secondary": "#fefce8",
    "highlight": "#dc2626",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Cormorant Garamond, serif",
      "messages": "Plus Jakarta Sans, sans-serif"
    },
    "animations": {
      "title": "pulse",
      "details": "rotate-in",
      "photos": "fade-in"
    }
  },
  {
    "id": "business-card-creative-1",
    "name": "Creative Business Card",
    "category": [
      "business-card",
      "all"
    ],
    "primary": "#1e3a8a",
    "secondary": "#eff6ff",
    "highlight": "#3b82f6",
    "fonts": {
      "title": "Playfair Display, serif",
      "recipient": "Plus Jakarta Sans, sans-serif",
      "messages": "Cormorant Garamond, serif"
    },
    "animations": {
      "title": "rotate-in",
      "details": "fade-in",
      "photos": "slide-up"
    }
  },
  {
    "id": "business-card-creative-2",
    "name": "Creative Business Card",
    "category": [
      "business-card",
      "all"
    ],
    "primary": "#312e81",
    "secondary": "#e0e7ff",
    "highlight": "#6366f1",
    "fonts": {
      "title": "Cinzel, serif",
      "recipient": "Montserrat, sans-serif",
      "messages": "Outfit, sans-serif"
    },
    "animations": {
      "title": "fade-in",
      "details": "slide-up",
      "photos": "slide-left"
    }
  }
];
