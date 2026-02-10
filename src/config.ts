export const SITE = {
  website: "https://bitterness-inc.vercel.app/",
  author: "Yariv Zur",
  profile: "https://twitter.com/vlvl",
  desc: "הבלוג הזה הוא ארכיון, אליו קיבצתי המון דברים שכתבתי לאורך השנים. היה בלוג ישן ב- tripod, היה עוד אתר wordpress במקום אחר. בקיצור, בלגן. יש פה דברים שנכתבו במסגרת כתיבה עיתונאית בעיתון תל-אביב עליו השלום, מגזין בלייזר עליו השלום ואפילו מוסף קפטן אינטרנט של הארץ. במבט לאחור - הרבה מהטקסטים עושים לי קרינג׳. אבל היי - זה מי שהייתי בגיל 20-30. קרינג׳. אם יש מישהו שמשהו שכתוב כאן עושה לו רע, אפשר לשלוח לי מייל ואוריד את הטקסט הפוגעני. קריאה נעימה.",
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
