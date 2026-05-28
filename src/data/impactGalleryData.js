/**
 * Impact Gallery Data
 * ─────────────────────────────────────────────────────────────────────────────
 * Each entry defines one interactive reveal card.
 * To add a new card, append a new object to this array.
 *
 * Fields:
 *   id          — unique identifier (string)
 *   baseImage   — image visible by default (path relative to /public)
 *   revealImage — image revealed under the cursor spotlight
 *   title       — bold headline
 *   subtitle    — smaller accent label above the title
 *   description — supporting paragraph text
 *   stat        — highlighted impact number / fact
 *   statLabel   — label for the stat
 *   tags        — array of topic tags
 *   accentColor — HSL tailored spotlight tint (rgba string)
 */
const impactGalleryData = [
  {
    id: "education",
    baseImage: "/impact-gallery/gallery_education_base_1779805934541.png",
    revealImage: "/impact-gallery/gallery_education_reveal_1779805956148.png",
    title: "Lighting the Path to Knowledge",
    subtitle: "Education Initiative",
    description:
      "Every child deserves a classroom, a mentor, and a future. Our education programs have placed thousands of rural children in structured learning environments — from primary schooling to vocational training.",
    stat: "12,400+",
    statLabel: "Children Educated",
    tags: ["Education", "Rural Outreach", "Youth"],
    accentColor: "rgba(245, 158, 11, 0.18)",
  },
  {
    id: "water",
    baseImage: "/impact-gallery/gallery_water_base_1779805977777.png",
    revealImage: "/impact-gallery/gallery_water_reveal_1779805998080.png",
    title: "When Water Flows, Life Follows",
    subtitle: "Clean Water Mission",
    description:
      "Clean water transforms entire communities. We have installed hand pumps, purification units, and rainwater harvesting systems across 80+ villages — ending the daily walk for survival.",
    stat: "80+",
    statLabel: "Villages Reached",
    tags: ["Water", "Sustainability", "Infrastructure"],
    accentColor: "rgba(56, 189, 248, 0.18)",
  },
  {
    id: "health",
    baseImage: "/impact-gallery/gallery_health_base_1779806022982.png",
    revealImage: "/impact-gallery/gallery_health_reveal_1779806043463.png",
    title: "Healing Where It Matters Most",
    subtitle: "Healthcare Access",
    description:
      "Our mobile medical camps and rural clinics have made primary healthcare accessible to the most remote communities — offering free checkups, medicines, and specialist consultations.",
    stat: "38,000+",
    statLabel: "Patients Treated",
    tags: ["Healthcare", "Medical Camps", "Wellness"],
    accentColor: "rgba(52, 211, 153, 0.18)",
  },
  {
    id: "community",
    baseImage: "/impact-gallery/gallery_community_base_1779806066469.png",
    revealImage: "/impact-gallery/gallery_community_reveal_1779806091741.png",
    title: "Communities Built on Trust",
    subtitle: "Rural Development",
    description:
      "Sustainable change starts at the grassroots. We empower villages through infrastructure development, local governance support, and cultural programs that bring communities together.",
    stat: "200+",
    statLabel: "Communities Impacted",
    tags: ["Community", "Development", "Culture"],
    accentColor: "rgba(176, 122, 63, 0.18)",
  },
  {
    id: "women",
    baseImage: "/impact-gallery/gallery_women_base_1779806111914.png",
    revealImage: "/impact-gallery/gallery_women_reveal_1779806136343.png",
    title: "Empowering Women, Uplifting Families",
    subtitle: "Women's Empowerment",
    description:
      "When women thrive, families flourish. Our self-help group network provides skills training, micro-financing, and mentorship — transforming vulnerable women into confident community leaders.",
    stat: "5,200+",
    statLabel: "Women Empowered",
    tags: ["Women", "Empowerment", "Livelihood"],
    accentColor: "rgba(232, 121, 249, 0.18)",
  },
];

export default impactGalleryData;
