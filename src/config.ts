export const SITE = {
  website: "https://bitterness-inc.vercel.app/",
  author: "Yariv Zur",
  profile: "https://twitter.com/vlvl",
  desc: "כתיבה אישית מאת יריב צור - טלוויזיה, ספורט, טכנולוגיה ומה שביניהם",
  title: "Bitterness Inc.",
  ogImage: "og-image.png",
  lightAndDarkMode: true,
  postPerIndex: 6,
  postPerPage: 20,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true,
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "",
  },
  dynamicOgImage: false,
  // Default to auto-detect RTL from content
  dir: "auto" as const,
  lang: "he", // Default language is Hebrew
  timezone: "Asia/Jerusalem",
} as const;

export const SOCIALS = [
  {
    name: "Twitter",
    href: "https://twitter.com/vlvl",
    linkTitle: `Follow on Twitter`,
    active: true,
  },
  {
    name: "Github",
    href: "https://github.com/yarivzur",
    linkTitle: `View GitHub profile`,
    active: true,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/vl_vl/",
    linkTitle: `Follow on Instagram`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/yarivzur/",
    linkTitle: `Connect on LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:yarivzur@gmail.com",
    linkTitle: `Send an email`,
    active: false,
  },
] as const;
