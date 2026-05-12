export type DibsiftListing = {
  id: string;
  title: string;
  price: string;
  condition: string;
  location: string;
  missingInfoRisk: string;
  description: string;
  image: string;
  copiedAt: string;
};

export type DibsiftTopPick = {
  rank: number;
  listingId: string;
  title: string;
  score: string;
  verdict: string;
  suggestedOffer: string;
  maxPrice: string;
  pros: string[];
  cons: string[];
  risks: string[];
  questions: string[];
  message: string;
};

export const dibsiftGoal = "Find the best TV for the price. I probably want a 65-inch one.";

export const dibsiftListings: DibsiftListing[] = [
  {
    id: "listing-vizio-sound-system",
    title: "Vizio 65 Inch 4K 120 Hz TV with Vizio 5.1.2 Sound System",
    price: "$350",
    condition: "Used - Good",
    location: "San Jose, CA",
    missingInfoRisk: "Low: missing exact model numbers",
    description: "Comes with following: 1. 65 Inch 4K 120 Hz TV 2. Vizio 5.1.2 Sound System still in box.",
    image: "/images/dibsift/listing-vizio-sound-system.png",
    copiedAt: "2026-05-12 00:21:20",
  },
  {
    id: "listing-tv-stand-bundle",
    title: "Tv: 65 inch -$350 Tv stand: 67 inch long -$200",
    price: "$350",
    condition: "Used - like new",
    location: "Dublin, CA",
    missingInfoRisk: "Medium: sparse TV specs",
    description: "Pickup in Campbell!!!!!",
    image: "/images/dibsift/listing-tv-stand-bundle.png",
    copiedAt: "2026-05-12 00:21:20",
  },
  {
    id: "listing-samsung-moving-today",
    title: "65\" Samsung tv 4k 1 month old moving today",
    price: "$295",
    condition: "New",
    location: "Menlo Park, CA",
    missingInfoRisk: "Medium: model number not listed",
    description: "Brand: Samsung. Bought this a month ago and moving into furnished place.",
    image: "/images/dibsift/listing-samsung-moving-today.png",
    copiedAt: "2026-05-12 00:21:26",
  },
  {
    id: "listing-samsung-mountain-view",
    title: "65\" Samsung TV",
    price: "$350",
    condition: "Used - like new",
    location: "Mountain View, CA",
    missingInfoRisk: "Low: recent purchase, missing model number",
    description: "Bought in June 2024. In perfect condition. Selling because I am moving.",
    image: "/images/dibsift/listing-samsung-mountain-view.png",
    copiedAt: "2026-05-12 00:21:26",
  },
];

export const dibsiftAnalysis = {
  model: "gemini-2.5-flash",
  createdAt: "2026-05-12T07:24:00.000Z",
  summary:
    "The Vizio bundle is the best total value if both the TV and unopened sound system test cleanly. The $295 Samsung is the best price play, but the missing model number makes it a verify-before-pickup deal. The newer Mountain View Samsung is a strong backup if the seller can confirm the model and screen condition.",
  topItems: [
    {
      rank: 1,
      listingId: "listing-vizio-sound-system",
      title: "Vizio 65 Inch 4K 120 Hz TV with Vizio 5.1.2 Sound System",
      score: "8.7/10",
      verdict: "Best overall package for the money.",
      suggestedOffer: "Offer $325-$350 if both the TV and sound system can be tested.",
      maxPrice: "$350",
      pros: [
        "Includes a 65-inch 4K 120 Hz TV plus a Vizio 5.1.2 sound system.",
        "The unopened sound system meaningfully improves total value.",
        "Good fit for a buyer who wants a complete living room setup.",
      ],
      cons: [
        "Exact TV and soundbar model numbers are not listed.",
        "Used - Good leaves some condition uncertainty.",
      ],
      risks: ["The bundle only stays compelling if the TV has no panel defects and the sound system is complete."],
      questions: [
        "Can you share the model numbers for the TV and sound system?",
        "Can I test the TV for dead pixels, backlight issues, and all HDMI ports?",
        "Is the sound system unopened with all parts included?",
      ],
      message:
        "Hi! I am interested in the Vizio TV and sound system bundle. Could you send the model numbers and confirm I can test the TV before pickup? I can move quickly if everything checks out.",
    },
    {
      rank: 2,
      listingId: "listing-samsung-moving-today",
      title: "65\" Samsung tv 4k 1 month old moving today",
      score: "8.2/10",
      verdict: "Best price, worth pursuing quickly.",
      suggestedOffer: "Offer $275-$295 because the seller is moving today.",
      maxPrice: "$295",
      pros: [
        "Lowest price in the saved set.",
        "Listed as new and only one month old.",
        "Moving-today urgency may make the seller flexible.",
      ],
      cons: [
        "No model number or refresh-rate details are listed.",
        "The listing photo does not clearly show the TV condition.",
      ],
      risks: ["A low price and urgent move are attractive, but the buyer should verify ownership, model, and screen condition."],
      questions: [
        "What is the exact Samsung model number?",
        "Do you have the receipt or original box?",
        "Can I turn it on and inspect the screen before paying?",
      ],
      message:
        "Hi! I am interested in the 65-inch Samsung TV. Since you are moving today, could you share the model number and let me test the screen before pickup? I can come prepared if it looks good.",
    },
    {
      rank: 3,
      listingId: "listing-samsung-mountain-view",
      title: "65\" Samsung TV",
      score: "7.8/10",
      verdict: "Strong backup with recent purchase history.",
      suggestedOffer: "Offer $320-$350 after confirming the model number.",
      maxPrice: "$350",
      pros: [
        "Samsung brand and like-new condition are promising.",
        "Bought in June 2024, so it may be a recent model.",
        "Mountain View pickup is convenient if the seller responds quickly.",
      ],
      cons: [
        "The listing does not include model number or refresh rate.",
        "At $350, it needs better specs than the $295 Samsung to justify the premium.",
      ],
      risks: ["Without a model number, this could be an entry-level Samsung panel priced like a better model."],
      questions: [
        "What is the exact model number from the back of the TV?",
        "Is the screen free of scratches, dead pixels, and discoloration?",
        "Are the remote and stand included?",
      ],
      message:
        "Hi! I am interested in your 65-inch Samsung TV. Could you send the model number and confirm the screen is free of dead pixels or scratches? I can pick up in Mountain View if it checks out.",
    },
  ] satisfies DibsiftTopPick[],
};
