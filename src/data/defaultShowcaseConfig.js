/**
 * Default Impact Showcase Configuration
 * -----------------------------------------------------------------------------
 * This acts as the default fallback config in case the database key
 * IMPACT_SHOWCASE_CONFIG is not yet present or is unset.
 */
export const defaultShowcaseConfig = {
  hero: {
    enabled: true,
    eyebrow: "K.V.G. Shanmuka Sai Charitable Trust",
    titlePart1: "Impact",
    titlePart2: "Showcase",
    description: "Hover over each image to reveal the transformation behind it. Real stories. Real lives changed. Seen through our eyes.",
    scrollLabel: "Scroll to explore"
  },
  stats: {
    enabled: true,
    items: [
      { id: "1", value: "12,400+", label: "Children Educated", prefix: "" },
      { id: "2", value: "38,000+", label: "Patients Treated", prefix: "" },
      { id: "3", value: "80+", label: "Villages Transformed", prefix: "" },
      { id: "4", value: "5,200+", label: "Women Empowered", prefix: "" }
    ]
  },
  galleryTitle: {
    enabled: true,
    eyebrow: "Interactive Gallery",
    title: "Stories Beneath the Surface",
    description: "Move your cursor across each image. What lies beneath is the transformation your support has made possible — hidden in plain sight, waiting to be revealed."
  },
  cards: [
    {
      id: "education",
      enabled: true,
      baseImage: "/impact-gallery/gallery_education_base_1779805934541.png",
      revealImage: "/impact-gallery/gallery_education_reveal_1779805956148.png",
      title: "Lighting the Path to Knowledge",
      subtitle: "Education Initiative",
      description: "Every child deserves a classroom, a mentor, and a future. Our education programs have placed thousands of rural children in structured learning environments — from primary schooling to vocational training.",
      stat: "12,400+",
      statLabel: "Children Educated",
      tags: ["Education", "Rural Outreach", "Youth"],
      accentColor: "rgba(245, 158, 11, 0.18)"
    },
    {
      id: "water",
      enabled: true,
      baseImage: "/impact-gallery/gallery_water_base_1779805977777.png",
      revealImage: "/impact-gallery/gallery_water_reveal_1779805998080.png",
      title: "When Water Flows, Life Follows",
      subtitle: "Clean Water Mission",
      description: "Clean water transforms entire communities. We have installed hand pumps, purification units, and rainwater harvesting systems across 80+ villages — ending the daily walk for survival.",
      stat: "80+",
      statLabel: "Villages Reached",
      tags: ["Water", "Sustainability", "Infrastructure"],
      accentColor: "rgba(56, 189, 248, 0.18)"
    },
    {
      id: "health",
      enabled: true,
      baseImage: "/impact-gallery/gallery_health_base_1779806022982.png",
      revealImage: "/impact-gallery/gallery_health_reveal_1779806043463.png",
      title: "Healing Where It Matters Most",
      subtitle: "Healthcare Access",
      description: "Our mobile medical camps and rural clinics have made primary healthcare accessible to the most remote communities — offering free checkups, medicines, and specialist consultations.",
      stat: "38,000+",
      statLabel: "Patients Treated",
      tags: ["Healthcare", "Medical Camps", "Wellness"],
      accentColor: "rgba(52, 211, 153, 0.18)"
    },
    {
      id: "community",
      enabled: true,
      baseImage: "/impact-gallery/gallery_community_base_1779806066469.png",
      revealImage: "/impact-gallery/gallery_community_reveal_1779806091741.png",
      title: "Communities Built on Trust",
      subtitle: "Rural Development",
      description: "Sustainable change starts at the grassroots. We empower villages through infrastructure development, local governance support, and cultural programs that bring communities together.",
      stat: "200+",
      statLabel: "Communities Impacted",
      tags: ["Community", "Development", "Culture"],
      accentColor: "rgba(176, 122, 63, 0.18)"
    },
    {
      id: "women",
      enabled: true,
      baseImage: "/impact-gallery/gallery_women_base_1779806111914.png",
      revealImage: "/impact-gallery/gallery_women_reveal_1779806136343.png",
      title: "Empowering Women, Uplifting Families",
      subtitle: "Women's Empowerment",
      description: "When women thrive, families flourish. Our self-help group network provides skills training, micro-financing, and mentorship — transforming vulnerable women into confident community leaders.",
      stat: "5,200+",
      statLabel: "Women Empowered",
      tags: ["Women", "Empowerment", "Livelihood"],
      accentColor: "rgba(232, 121, 249, 0.18)"
    }
  ],
  footerCta: {
    enabled: true,
    subtitle: "Be Part of the Transformation",
    title: "Your Trust Powers Their Tomorrow",
    description: "Every metric achieved and every story revealed is the direct result of collective kindness. Help us continue our mission of bringing hope, clean water, and education to those who need it most.",
    btnText: "Empower a Life Today",
    btnLink: "/donation"
  }
};

export default defaultShowcaseConfig;
