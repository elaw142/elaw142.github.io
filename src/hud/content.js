export const sections = [
  {
    id: "about",
    shortLabel: "ABOUT",
    faceName: "DESIGNATION",
    side: "right",
    name: "Elliot Lawrence",
    title: "Computer Science Graduate - Full Stack Developer",
    bio: [
      "I'm an AWS cloud support associate apprentice, splitting my time between structured study and real customer cases.",
      "I like building reliable web experiences and untangling infrastructure issues across the stack. Every project is a chance to sharpen my skills and ship dependable outcomes.",
    ],
    meta: [
      ["ORIGIN", "Auckland, New Zealand"],
      ["CURRENT DEPLOYMENT", "AWS Cloud Support Associate Apprentice"],
      ["EDUCATION", "BSc Computer Science, University of Auckland, 2024"],
    ],
  },
  {
    id: "projects",
    shortLabel: "WORK",
    faceName: "RECORDED WORKS",
    side: "left",
    projects: [
      {
        code: "PROJECT_ID_001",
        name: "One Dose Web App",
        description:
          "E-commerce journey for an Australian start-up simplifying pool chemical maintenance.",
        tags: ["Shopify", "E-commerce", "Front End"],
      },
      {
        code: "PROJECT_ID_002",
        name: "Prose",
        description:
          "Insurance SaaS proposal tooling with a notion-like editor and production pilot planned for Q2 2026.",
        tags: ["React", "Vite", "Product Design"],
      },
      {
        code: "PROJECT_ID_003",
        name: "Roam Wars",
        description:
          "Location game blending territory control with activity tracking and GIS-backed gameplay.",
        tags: ["React", "Postgres GIS", "Strava"],
      },
      {
        code: "PROJECT_ID_004",
        name: "Trippa",
        description:
          "Award-winning React Native, .NET, and Azure carpooling app with messaging and secure authentication.",
        tags: ["React Native", ".NET", "Azure"],
        repo: "https://github.com/elaw142/Trippa",
      },
      {
        code: "PROJECT_ID_005",
        name: "Verbatim",
        description: "Word of the Day app from the public GitHub archive.",
        tags: ["Swift", "Mobile", "Vocabulary"],
        repo: "https://github.com/elaw142/Verbatim",
      },
    ],
  },
  {
    id: "experience",
    shortLabel: "EXP",
    faceName: "SERVICE RECORD",
    side: "right",
    records: [
      {
        range: "CURRENT",
        role: "Cloud Support Associate Apprentice",
        org: "Amazon Web Services",
        description:
          "18-month programme combining certification study with customer case work across core AWS services.",
      },
      {
        range: "PREVIOUS",
        role: "React Developer",
        org: "Sparefish Limited",
        description:
          "Built pixel-perfect e-commerce interfaces from UI-UX designs with Shopify integrations.",
      },
      {
        range: "PREVIOUS",
        role: "Co-Founder",
        org: "Prose",
        description:
          "Designed and developed an insurance SaaS product using Figma, React, Vite, Tailwind, and Shadcn.",
      },
      {
        range: "INTERNSHIP",
        role: "Intern",
        org: "Amazon Web Services",
        description:
          "Completed AWS course work and worked with a team to resolve customer issues using AWS services.",
      },
    ],
  },
  {
    id: "contact",
    shortLabel: "CONTACT",
    faceName: "TRANSMISSION",
    side: "left",
    signal: ["SIGNAL DETECTED.", "AWAITING RESPONSE VECTOR."],
    links: [
      {
        label: "EMAIL",
        text: "elliotmaclawrence@gmail.com",
        href: "mailto:elliotmaclawrence@gmail.com",
      },
      {
        label: "GITHUB",
        text: "github.com/elaw142",
        href: "https://github.com/elaw142",
      },
      {
        label: "SITE",
        text: "elaw142.github.io",
        href: "https://elaw142.github.io/",
      },
    ],
    status:
      "Open to full stack, cloud support, and product engineering conversations.",
  },
];
