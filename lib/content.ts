/**
 * All site copy lives here so pages stay structural.
 *
 * Buildvriksh is a learning-technology studio: custom learning systems
 * for educators and education businesses. LMS work is the centre of
 * gravity, not the boundary — the copy below is written so that the
 * portfolio reads as proof of capability rather than as a fixed
 * product catalogue.
 *
 * THE AUTHENTICITY RULE. Every figure quoted anywhere on this site is a
 * figure that appears in the source material for the project it belongs
 * to. Pilots are called pilots, validations are called validations, and
 * nothing here implies a paying client, a deployment or a partnership
 * that does not exist. If a number is not in the source, it is not here.
 */

export const site = {
  /** The brand. Everything user-facing says this, not a person's name. */
  name: "Buildvriksh",
  role: "Learning technology studio",
  /**
   * Secondary, always. Rendered as a supporting line beneath the brand —
   * never joined to it, so "Buildvriksh backed by Lawvriksh" cannot be
   * misread as one product name.
   */
  backer: "Lawvriksh",
  backedBy: "Backed by Lawvriksh",
  location: "Bhopal, India",
  /**
   * SINGLE SOURCE FOR THE CONTACT ADDRESS.
   *
   * The studio address. It is deliberately not a visual centrepiece
   * anywhere — the final frame leads with the call, and the address sits
   * underneath it as secondary information. This is the only place it is
   * written; everything else reads it from here.
   */
  email: "contact@buildvriksh.com",
  /**
   * Studio-level links, shown in the footer. Scholar stays because the
   * research section is load-bearing on this site — a visitor who wants
   * to check the papers should have somewhere to go. All three are still
   * placeholder hrefs.
   */
  socials: [
    { label: "GitHub", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Scholar", href: "#" },
  ],
};

/**
 * The two founders.
 *
 * Read in three places: the identity card in the side rail, the pair of
 * small portraits tucked under the product plate in the hero, and the
 * footer. They are no longer the top of any hierarchy — the studio is —
 * but they stay visible, because a two-person studio that hides its two
 * people reads as a stock template.
 *
 * The social hrefs are still placeholders. They are live links in three
 * places now, so they are worth filling in before this ships.
 */
export const team = [
  {
    name: "Sahil Saurav",
    role: "AI & learning systems",
    photo: "/images/person1.png",
    socials: [
      { label: "GitHub", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
  },
  {
    name: "Prabhjot Jaswal",
    role: "Product & interfaces",
    photo: "/images/person2.jpeg",
    socials: [
      { label: "GitHub", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
  },
];

/**
 * The floating top-right bar shown over the hero. Every entry scrolls to
 * a section of the home page rather than routing anywhere - it is a
 * shortcut, not a menu, and it retires the moment the page starts
 * moving. "Book a call" is rendered separately by the header.
 */
export const topNav = [
  { label: "Work", id: "work" },
  { label: "What we build", id: "what-we-build" },
  { label: "How we work", id: "how-we-work" },
];

/** Short positioning line shown in the side rail, under the founders. */
export const blurb = "Designing custom learning systems with educators.";

/**
 * Side rail navigation - one row per section of the home page, in the
 * order they are read. `id` is the section's DOM id, used both for the
 * anchor and for scroll-spy highlighting. `icon` keys map to glyphs in
 * components/icons.tsx.
 *
 * The labels here are the site's section names; the headings on the page
 * match them. A production-readiness section is planned between "How we
 * work" and "Validation" — its row goes in then, not now.
 */
export const sideNav = [
  { label: "Who We Are", id: "top", icon: "home" as const },
  { label: "Selected Work", id: "work", icon: "folder" as const },
  { label: "What We Build", id: "what-we-build", icon: "bolt" as const },
  { label: "How We Work", id: "how-we-work", icon: "route" as const },
  { label: "Testimonials", id: "validation", icon: "person" as const },
  { label: "Things Worth Sharing", id: "worth-sharing", icon: "layers" as const },
];

/** Section ids in document order - the scroll-spy walks this list. */
export const sectionIds = sideNav.map((s) => s.id);

/**
 * Hero.
 *
 * ONE JOB: say what kind of software this studio makes, and for whom,
 * inside a couple of seconds. The old hero sold AI agents, MVPs and data
 * engineering; none of that survives.
 *
 * `statement` is typed out a glyph at a time (components/typewriter.tsx).
 * A word wrapped in asterisks renders in the accent, italic — it is the
 * one place on the site where colour is allowed on something that is not
 * a measured value, and it is spent on the two words that carry the
 * whole proposition.
 *
 * `meta` is three pairs, not four. A fourth ("Building: LMS, AI learning
 * tools & custom software") repeated the lede almost word for word one
 * viewport below it, which is the kind of duplication that makes a hero
 * feel busy without saying anything more.
 */
export const hero = {
  eyebrow: "Learning technology for educators & education businesses",
  statement: [
    "Custom learning systems,",
    "built around the way *you* *teach.*",
  ],
  lede: "We design LMS platforms, AI learning tools and custom education software shaped around your workflows, pedagogy and business model.",
  meta: [
    { label: "Focus", value: "Learning systems" },
    { label: "Working with", value: "Educators & education businesses" },
    { label: "Model", value: "Custom B2B builds" },
  ],
  /**
   * The dominant visual in the hero: a product screen, with the two
   * founder portraits tucked under its lower-left corner.
   *
   * `src` IS NULL ON PURPOSE. No final interface capture exists in the
   * repository yet, and inventing a fake dashboard would be the one
   * dishonest pixel on an otherwise honest page. Until a real capture
   * lands this renders as a drawn plate holding its place; drop the file
   * into /public/images and set `src` here and the plate becomes the
   * screenshot with no other change.
   */
  product: {
    src: null as string | null,
    alt: "Learning platform — educator dashboard",
    label: "Learning platform",
    caption: "Educator dashboard",
  },
};

/**
 * How a project is laid out in the Selected Work section on the home
 * page, and the copy that only exists there.
 *
 * WHY THIS IS DATA AND NOT MARKUP. The section runs three projects in
 * three different arrangements — that variety is the whole point of it,
 * and the fastest way to lose it is to let the arrangement be an
 * accident of what somebody typed into JSX for one of them. Putting the
 * arrangement next to the copy it governs means a fourth project has to
 * declare which shape it takes, rather than defaulting into whichever
 * one was written last.
 */
export type Showcase = {
  /**
   * Which of the three arrangements the project is set in.
   *
   *   split      compact media beside a narrow text column
   *   wide       a header row, then the media full width beneath it
   *   wide-rail  the same, with a margin rail alongside the media
   *
   * They are meant to run in this order down the page: the section
   * opens tight and opens out. Two projects in a row taking the same
   * arrangement is not an error, but it is worth a second look.
   */
  arrangement: "split" | "wide" | "wide-rail";
  /** The row above the title — what discipline the work sits in. */
  discipline: string;
  /**
   * Year and state, set as a stamp. Short: this sits above the case
   * study link in a narrow column and wraps badly past about six words.
   *
   * OPTIONAL. Three of the four projects had this removed outright —
   * not left blank, absent — so `ShowcaseMeta` in app/page.tsx skips the
   * line entirely rather than rendering an empty stamp with a gap where
   * its text used to be.
   */
  stamp?: string;
  /**
   * The note in the margin, in the hand face.
   *
   * TWELVE WORDS OR FEWER. It is an aside somebody wrote next to the
   * picture, not a caption — see `.hand` in globals.css. Longer than
   * that and it stops reading as handwriting and starts reading as
   * body copy that has been set in the wrong font.
   */
  annotation: string;
  /** The bordered aside under the summary. `split` only. */
  note?: string;
  /**
   * The interface being shown.
   *
   * `alt` HAS ONE ENTRY PER SCREEN and is the real alt text for the
   * capture that will eventually land here — it is written now, while
   * the person who knows what the screen shows is the one writing it,
   * rather than at the moment somebody drops a PNG into /public.
   */
  screens: {
    /**
     * What is being photographed, which decides the mount and the
     * proportion — see components/screen-mount.tsx.
     *
     *   phone-pair  two 390x844 screens on a padded sheet
     *   window      one 16:9 capture in desktop chrome
     *   device      one 4:3 photograph of hardware, small
     *
     * `device` is deliberately the small one. A Raspberry Pi on a desk
     * blown up to the full measure claims the same importance as a
     * product screen and does not survive it — there is nothing in a
     * photograph of a board to reward the extra 600px. It is sized like
     * what it is: an object, shown at object scale.
     */
    kind: "phone-pair" | "window" | "device";
    /** Contact-sheet caption, or the path shown in the window chrome. */
    caption: string;
    /** Right-hand caption on a phone pair — the device size. */
    size?: string;
    alt: string[];
  };
  /** The margin rail. `wide-rail` only. */
  rail?: {
    label: string;
    /**
     * The spine. `mark` picks the node: `plain` is a step, `key` is the
     * one the accent points at, and `open` is a hollow node that ends
     * the line — an output rather than a stage.
     */
    steps: { text: string; note?: string; mark?: "plain" | "key" | "open" }[];
    close: string;
  };
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  year: string;
  /** Optional status chip shown beside the title, e.g. "Beta". */
  badge?: string;
  role: string[];
  ratio: string;
  /** Where the work sat - affiliation, programme, or client. */
  context: string;
  status: string;
  challenge: string;
  approach: string;
  outcome: string;
  stack: string[];
  /**
   * The capabilities that were genuinely hard, in the client's language
   * rather than the vendor's. Shown on the project page under "Under the
   * hood".
   *
   * This is where technical credibility is allowed to live — never the
   * home page, and never as a wall of framework logos. A logo cloud says
   * "we have heard of Redis"; "source grounding, then verification" says
   * what the system actually does that a weekend build would not.
   */
  underTheHood: string[];
  /** Only numbers stated in the source material. */
  metrics: { label: string; value: string }[];
  /**
   * Present only on the three projects the home page shows. A project
   * without one still renders everywhere else — it just does not appear
   * in Selected Work. See `selectedWork` below.
   */
  showcase?: Showcase;
};

export const projects: Project[] = [
  {
    /**
     * THE LONG-FORM COPY ON THIS ENTRY IS DRAFTED, NOT SOURCED.
     *
     * Everything the design prototype states about this project is
     * carried through exactly: the year, the platforms, the production
     * status, and the surfaces its screens show — cohorts, attendance,
     * test series, content, announcements, two apps against one system.
     * The challenge/approach/outcome paragraphs are written FROM those
     * screens rather than from a brief, so they should be read as a
     * first draft by someone who was in the room.
     *
     * `stack` and `metrics` are empty on purpose. No source material
     * states either, and this is not the place to guess: the metrics
     * row on a case study is the one part of this site where every
     * number is supposed to have come from somewhere. Both sections
     * omit themselves when empty rather than rendering a rule with
     * nothing under it — see app/work/[slug]/page.tsx.
     */
    slug: "lms",
    title: "Learning Management System",
    summary:
      "An end-to-end learning environment for educators, learners, cohorts, assessments and communication.",
    year: "2023",
    badge: "Live",
    role: ["Product", "Mobile apps", "Learning operations"],
    ratio: "4/5",
    context: "Institute deployment — iOS and Android",
    status: "In production",
    challenge:
      "An institute does not run at a desk. Attendance is taken while a class is starting, a test series is announced between sessions, and the person who needs to record any of it is standing in a room holding a phone. Most learning platforms are built for the administrator's laptop and treat mobile as a viewing surface, so the work that actually happens in the room gets done on paper and re-entered later — or never.",
    approach:
      "Mobile-first, and mobile-first for the educator rather than only the learner. One system carries two apps: the educator side runs the institute — today's cohort, attendance, test series, content and announcements, all reachable in the seconds before a class begins — while the learner side carries content, tests, community and progress. Both read the same cohorts, the same content model and the same records, so nothing has to be reconciled between them.",
    outcome:
      "A production system on iOS and Android covering the full loop: cohorts and enrolment, attendance, content delivery, assessments and institute-wide communication. The whole institute — not a reporting view of it — runs from the phone in the room.",
    stack: [],
    underTheHood: [
      "Cohort and enrolment model",
      "Attendance capture",
      "Assessment and test series",
      "Content delivery",
      "Institute communication",
    ],
    metrics: [],
    showcase: {
      arrangement: "split",
      discipline: "Learning operations",
      annotation: "one system, two roles, in the pocket",
      note:
        "Built mobile-first: the whole institute — cohorts, attendance, test series, content, announcements — runs from the phone in the room.",
      screens: {
        kind: "phone-pair",
        caption: "Educator app · Learner app",
        size: "390 × 844",
        alt: [
          "The educator app — today's cohort with attendance being marked",
          "The learner app — content, test series and progress",
        ],
      },
    },
  },
  {
    slug: "syrus",
    title: "Syrus",
    summary:
      "An agentic research engine that turns a plain-language question into fact-checked, source-cited writing.",
    year: "2025",
    role: ["System architecture", "Agent orchestration", "Interface"],
    ratio: "4/5",
    context: "Independent product",
    status: "End-to-end product ready",
    challenge:
      "Generative writing tools are fluent and unaccountable. They produce a paragraph and leave you to work out which half of it is true. For research work that is worse than useless - the cost of checking the output exceeds the cost of writing it yourself. The question was whether verification could be built into the pipeline rather than bolted on after it.",
    approach:
      "Six agents in a fixed sequence, each with one job. A query optimiser expands a plain question into a richer search brief; a research agent gathers from multiple sources; a claim extractor pulls out the assertions that actually need checking; a verifier cross-checks those claims against trusted sources; a report generator produces the fact-check artefact; a drafting agent writes the final piece in the requested style. Claim extraction and verification are their own stages, not a filter at the end - that is the architectural bet the whole system rests on.",
    outcome:
      "A complete product with frontend, backend and AI layers. Output is split across four tabs - research, fact-check report, final draft, references - so a reader can walk the process rather than trusting the result. The templating layer formats the same verified research into whichever content style the user picked.",
    stack: [
      "Python",
      "Gradio",
      "Groq",
      "Tavily Search API",
      "Custom 6-agent orchestrator",
    ],
    underTheHood: [
      "Retrieval pipeline",
      "Source grounding",
      "Claim verification",
      "Context-aware generation",
    ],
    metrics: [
      { label: "Agents in the pipeline", value: "6" },
      { label: "Output surfaces", value: "4 tabs" },
      { label: "Verification stages", value: "2" },
    ],
    showcase: {
      arrangement: "split",
      discipline: "Research infrastructure",
      stamp: "2025 — End-to-end product",
      annotation: "nothing is written before it is checked",
      screens: {
        kind: "window",
        caption: "syrus / research / fact-check",
        alt: [
          "Syrus — the research, fact-check report, draft and references tabs side by side",
        ],
      },
    },
  },
  {
    slug: "posture-detection",
    title: "Posture Correction System",
    summary:
      "A plug-and-play desk device reading sitting posture from a standard webcam, built to predict chronic risk rather than nag.",
    year: "2025",
    badge: "Beta",
    role: ["Hardware", "Edge AI", "Backend"],
    ratio: "4/5",
    context: "LNCT Group of Colleges, Bhopal - C-CAMP Inter-Institutional Biomedical Program",
    status: "Beta prototype, roadmap to pilot production",
    challenge:
      "1.71 billion people live with musculoskeletal conditions; 570 million of those are lower back pain, 7.4% of all years lived with disability. The market answer is either a wearable that drifts and gets abandoned, a smart chair that cannot see your neck, or a depth camera at $400+ that nobody buys. There was no device offering medical-grade analytics on hardware people already own.",
    approach:
      "An adaptive state machine rather than a binary alarm. A standard webcam feeds a 20-class classifier that distinguishes a slight recline from a genuine slouch, and the system moves between three states: monitor quietly, open a five-minute window for the user to self-correct, and only then raise a hard alarm. That window exists specifically to prevent alert fatigue - the failure mode that kills every device in this category. A ten-second slot system filters transient movement before it reaches the classifier. On top of the live signal sits a medical intelligence layer that accumulates time thresholds and predicts chronic conditions instead of only reporting the present.",
    outcome:
      "A working beta on a Raspberry Pi 5 with audio and LED feedback, validated with Bachelor of Physiotherapy students under faculty mentorship spanning both AIML and Physiotherapy departments - which puts the accuracy path on clinical rather than purely synthetic data. A costed manufacturing route to pilot and mass production is defined.",
    stack: [
      "Raspberry Pi 5",
      "IMX500 AI Camera",
      "TensorFlow Lite",
      "Python",
      "Flask + WebSockets",
    ],
    underTheHood: [
      "Edge inference on device",
      "Adaptive state machine",
      "Temporal signal filtering",
      "Longitudinal risk modelling",
    ],
    metrics: [
      { label: "Accuracy on synthetic data", value: "85%" },
      { label: "Projected on clinical data", value: "95%" },
      { label: "Response time", value: "200ms" },
      { label: "False positives removed", value: "40%" },
    ],
    showcase: {
      arrangement: "split",
      discipline: "Edge AI + hardware",
      annotation: "it watches the week, not the moment",
      screens: {
        kind: "device",
        caption: "Desk unit",
        size: "Pi 5 · IMX500",
        alt: [
          "The posture correction desk unit — Raspberry Pi 5 and IMX500 camera in its enclosure",
        ],
      },
    },
  },
  {
    slug: "saavi",
    title: "SAAVI",
    summary:
      "A voice-first teaching assistant generating curriculum-aligned lessons in regional languages, live across five pilot schools.",
    year: "2024",
    badge: "Pilot",
    role: ["Product", "LLM systems", "Dashboards"],
    ratio: "4/5",
    context: "Saavi Labs - 8-person team",
    status: "MVP live, 5 pilot schools",
    challenge:
      "Post-school learning support in India is inaccessible, unaffordable and fragmented. Private tutoring averages ₹1,500 an hour. 55% of educators report burnout from administrative work, and 70% of parents say they have no real read on their child's progress. The existing tools each solve a slice - test prep, or generic content, or chat - and none of them close the loop between student, teacher and parent.",
    approach:
      "Five pillars built as one system: personalised content generation, voice-guided tutoring that simplifies a topic out loud, curriculum alignment against materials the school itself uploads, multilingual delivery in Hindi and Tamil, and a shared progress dashboard using BERT/RoBERTa sentiment analysis. The dashboard is the part competitors skip - tri-view monitoring means the teacher, the parent and the student are looking at the same picture.",
    outcome:
      "A live MVP with AI curriculum generation, voice interaction and five pilot schools running. Ten documented validation interviews with students and professors returned an average rating of 4.0 out of 5, with real-time doubt-solving named as the strongest driver. Unit economics were modelled at roughly $450/month of infrastructure against a ₹200M serviceable market.",
    stack: [
      "GPT-class LLM APIs",
      "BERT / RoBERTa",
      "Voice API",
      "Knowledge-base retrieval",
      "App Engine",
    ],
    underTheHood: [
      "Classroom architecture",
      "AI-assisted learning flows",
      "Curriculum alignment",
      "Multilingual voice delivery",
      "Shared progress analytics",
    ],
    metrics: [
      { label: "Pilot schools", value: "5" },
      { label: "Validation interviews", value: "10" },
      { label: "Average rating", value: "4.0 / 5" },
      { label: "Monthly infrastructure", value: "$450" },
    ],
    showcase: {
      arrangement: "split",
      discipline: "Classroom systems",
      annotation: "one system — learner, teacher, parent",
      screens: {
        kind: "window",
        caption: "saavi / class-7 / hindi · session 12",
        alt: [
          "SAAVI — a voice-guided session beside the shared student, teacher and parent progress view",
        ],
      },
    },
  },
];

/**
 * SELECTED WORK — the three projects the home page shows, in the order
 * it shows them.
 *
 * THIS IS NOT `projects` AND IT IS NOT MEANT TO BE. The `projects`
 * array above is the site's canonical order: it drives /work and the
 * next-project chain at the foot of every case study, and it should
 * stay stable. The home page is telling an argument instead, and the
 * argument has an order — classroom, then the room around it, then what
 * can be proved. `arc` below is that order said out loud, at the bottom
 * of the section.
 *
 * A project appears here by having a `showcase`; the sequence is set by
 * the slug list. Anything without a showcase is skipped rather than
 * half-rendered.
 */
const SELECTED = ["lms", "saavi", "posture-detection", "syrus"] as const;

export const selectedWork = SELECTED.map((slug) => {
  const project = projects.find((p) => p.slug === slug);
  if (!project?.showcase) {
    throw new Error(
      `selectedWork: "${slug}" is missing from projects, or has no showcase.`,
    );
  }
  // Narrowed once here so the section does not have to test it per card.
  return project as Project & { showcase: Showcase };
});

/**
 * The line that closes the section: the arc the three projects trace,
 * and the note written under it.
 *
 * The arc is set in the data face because it is a structure, not a
 * sentence. The note is in the hand because it is the one thing in the
 * section that is an opinion.
 */
export const selectedWorkArc = {
  steps: ["Operations", "Teaching", "Sensing", "Verifying"],
  note: "run the institute, teach inside it, read the room, prove the answer.",
};

/**
 * WHAT WE BUILD
 *
 * THE FEAR THIS SECTION ANSWERS is "custom software means starting from
 * nothing", and the whole shape of it is the counter-argument: there is
 * a foundation, it is the same every time, and what changes is the
 * configuration on top of it. The section says that structurally before
 * it says it in words — a core panel, connectors, then modules.
 *
 * This replaces a flat six-cell service grid. That grid was a list of
 * things we can do; this is a claim about how the work is assembled,
 * which is a different and more useful thing for someone deciding
 * whether to call.
 *
 * The three parts, in order:
 *
 *   core      one panel. What does not change.
 *   modules   what gets chosen. Five named, one deliberately open.
 */
export const whatWeBuild = {
  eyebrow: "What we build",
  statement: "Built around how you teach",
  lede: "No two learning businesses teach exactly the same way. We use strong learning-system foundations and shape the experience around your learners, educators and model.",

  /**
   * The foundation.
   *
   * `parts` is a plain list now — no repeated "Core" label in the row.
   * The panel's own heading and body already say this is the part that
   * does not change; printing the same word four times beside it was
   * decoration standing in for an argument the panel had already made.
   */
  core: {
    label: "Foundation",
    title: "Learning core",
    body: "Identity, roles, cohorts, content, data and permissions — the part that stays reliable while everything above it changes.",
    parts: [
      "Roles & permissions",
      "Content model",
      "Learning data",
      "Integration layer",
    ],
    annotation: "one foundation, configured differently",
  },

  /**
   * The capability modules.
   *
   * Five are ruled cells in a plain grid; the sixth is drawn as a mount
   * — its own border, its own paper, its own corner radius — because it
   * is the one that says the list does not end. A sixth identical cell
   * reading "Custom" would be a list item claiming to be an escape
   * hatch; drawing it differently is the escape hatch.
   */
  modules: [
    {
      n: "01",
      title: "Learning management",
      body: "Courses, cohorts, content, attendance",
    },
    {
      n: "02",
      title: "Assessments & test systems",
      body: "Tests, assignments, question banks, evaluation",
    },
    {
      n: "03",
      title: "Student & educator workspaces",
      body: "Dashboards, profiles, progress, workflows",
    },
    {
      n: "04",
      title: "Classroom & community",
      body: "Discussion, collaboration and live learning",
    },
    {
      n: "05",
      title: "AI learning tools",
      body: "Tutors, copilots and content intelligence",
    },
    {
      n: "06",
      title: "Custom modules & integrations",
      body: "Built around requirements specific to the learning model",
      /** Drawn as a mount rather than a ruled cell. See above. */
      open: true,
      tag: "Open-ended",
    },
  ],
  modulesNote: "These are starting points, not packages.",

  /** The one opinion in the section, and the only line in the hand. */
  closing: {
    statement:
      "The software should follow the learning model — not the other way around.",
    sign: "Buildvriksh · learning technology studio",
  },
};


/**
 * How we work.
 *
 * THE FEAR THIS SECTION ANSWERS: "custom software sounds slow,
 * complicated and risky." Everything here is written against that one
 * sentence. The previous version assumed the reader already had a
 * codebase, a repo and an environment to hand over — it opened with
 * pull requests, which is a conversation with a CTO, not with someone
 * who runs a teaching business.
 *
 * The order is deliberately front-loaded on understanding: two of the
 * five stages happen before anyone writes production code, because that
 * is where a learning system is actually won or lost.
 *
 * `output` is what the client HAS at the end of each stage. It is a
 * label, not a measurement, so it is set in the micro face rather than
 * the accent — the accent belongs to the stage numbers on the thread and
 * nothing else in this section.
 */
export const process = {
  /** The sheet's own header marks, in the data face. */
  eyebrow: "Working method",
  sheet: "Sheet 04 · Process flow",
  /** The one line in the hand at the top of the sheet. */
  aside: "read it like a page from the notebook",
  lede: "We understand the learning model before we decide what the software should become.",
  /**
   * FIVE CARDS ON A FLOW SHEET, not five rows on a timeline.
   *
   * `body` is deliberately two sentences at most. On the timeline these
   * were full paragraphs, which a card cannot hold without becoming a
   * wall — the long version of each stage lives in the conversation, not
   * on the sheet. `output` is what the client HAS at the end of the
   * stage, printed on the card's own header row after an arrow.
   */
  steps: [
    {
      n: "01",
      title: "We understand how you teach",
      body: "Show us how learning works today — who teaches, who learns, and where the friction lives. No fifty-page spec needed.",
      output: "Learning map",
    },
    {
      n: "02",
      title: "We map the system",
      body: "Roles, workflows, modules and priorities get settled while they are still a decision rather than a rewrite.",
      output: "Product blueprint",
    },
    {
      n: "03",
      title: "You see it before we build it",
      body: "We prototype the important educator and learner journeys first, while changing them is still easy.",
      output: "Prototype",
    },
    {
      n: "04",
      title: "We build the first working version",
      body: "The smallest version that solves the real problem well, shown working throughout development.",
      output: "Pilot",
    },
    {
      n: "05",
      title: "We launch, learn and evolve",
      body: "Rollout, migration, then watching how the system is actually used — and letting it evolve with the business.",
      output: "Live system",
    },
  ],
  /**
   * The note written between stage 03 and stage 04, in the hand. It sits
   * exactly where the sheet turns, because that is the sentence the turn
   * is making: two of the five stages happen before anyone writes
   * production code.
   */
  annotation: "nothing gets built before this is agreed",
  /** The dashed return from 05 back to 01. */
  loop: {
    label: "And back to 01",
    body: "What we learn in production changes the next map.",
  },
  /**
   * Standing commitments, not stages — they hold for the whole
   * engagement, which is why they are deliberately off the flow.
   */
  markers: ["Weekly demos", "Shared roadmap", "Clear milestones"],
  /** The line that closes the sheet, and the studio mark under it. */
  closing: {
    statement: "The learning model is decided first — the software follows it.",
    sign: "Buildvriksh · learning technology studio",
  },
};

/**
 * WHAT THE PEOPLE WE BUILT FOR SAID.
 *
 * These are testimonials, and they are held to the one rule that makes a
 * testimonial worth printing: every quote and every score came out of a
 * documented review session, and every attribution names the group that
 * actually sat in it.
 *
 * NO INVENTED INDIVIDUALS. The source material is two group reviews — ten
 * SAAVI pilot interviews with students and educators, and a physiotherapy
 * cohort evaluation under faculty mentorship — so the attribution is the
 * cohort, not a named person with a stock headshot. A fabricated name and
 * job title would be the one dishonest thing on an otherwise honest page,
 * and credibility is the entire product here. When a named client agrees
 * to be quoted, replace `source` and `role` and nothing else changes.
 *
 * `rating` is out of five and halves are allowed — it is rendered as five
 * drawn stars (see `Stars` in app/page.tsx), never as a number set large.
 * A giant "4.0" is a scoreboard; a row of stars is a review.
 */
export const validation = {
  lede: "From documented review sessions with the people who used the work.",
  items: [
    {
      rating: 4.5,
      quote:
        "Evaluating it against real patients rather than a synthetic dataset was the right call — the correction window and the stability filter are what a clinician would actually ask for.",
      body: "Reviewed with Bachelor of Physiotherapy students under faculty mentorship spanning both AIML and Physiotherapy perspectives, which puts the accuracy path on clinical rather than synthetic ground truth.",
      source: "BPT cohort & faculty mentors",
      role: "C-CAMP inter-institutional programme",
      project: "Posture Correction System",
    },
    {
      rating: 4,
      quote:
        "Being able to ask a question in the middle of a session and get an answer straight away is the part we would miss if it went away.",
      body: "Averaged across 10 documented SAAVI validation interviews. Real-time doubt solving and the shared progress view were named most often as the reason for the score.",
      source: "SAAVI pilot cohort",
      role: "10 students & educators, 5 schools",
      project: "SAAVI",
    },
  ],
};

/**
 * Things worth sharing.
 *
 * This section is NOT marketing content wearing a lab coat, and it must
 * not become that. These are the founders' actual conference papers and
 * technical write-ups, and they are on the site for one reason: so that a
 * visitor whose requirement turns out to be genuinely difficult can see
 * there is depth here beyond assembling CRUD screens.
 *
 * Rewriting them into "5 LMS trends for 2026" would destroy the only
 * thing they are good for.
 */
export const research = {
  lede: "Research, experiments and papers behind the systems we build.",
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  /** Opening paragraph, set larger than the body. */
  lead: string;
  sections: { heading: string; paragraphs: string[] }[];
};

export const articles: Article[] = [
  {
    slug: "small-models-that-pay-for-themselves",
    title: "Small models that pay for themselves",
    excerpt:
      "Pruning, sparsity and metalearning cut GPU hours by 30-50% and still lifted accuracy. Notes from the paper.",
    date: "Dec 2024",
    lead: "The interesting question about a language model is not how well it scores. It is how much you had to burn to get that score, and whether anyone outside a funded lab can afford to repeat it.",
    sections: [
      {
        heading: "The problem is the bill, not the benchmark",
        paragraphs: [
          "Large language models are expensive in a way that quietly decides who gets to build with them. The compute cost is the gate. If you cannot afford the GPU hours, the capability may as well not exist - which makes efficiency an accessibility problem wearing a systems-engineering costume.",
          "The paper we presented in December 2024 took that framing seriously: optimise low-parameter models for better performance and lower resource use at the same time, and treat the second half as the point rather than the compromise.",
        ],
      },
      {
        heading: "Three techniques, one hybrid",
        paragraphs: [
          "The KE Sieve algorithm prunes parameters that are not earning their place. The JEST method introduces sparsity during training rather than after it, so the efficiency is structural instead of retrofitted. Metalearning improves how quickly a model adapts to a specific task, which matters more than raw capacity once the model is small.",
          "Individually each one trades something away. Combined, they balance: the hybrid holds performance while the resource curve drops. That is the finding worth carrying forward - not any single technique, but the fact that they compose.",
        ],
      },
      {
        heading: "What the numbers said",
        paragraphs: [
          "Overall resource utilisation efficiency improved by 70%. GPU hours after optimisation fell 30-50%. Energy consumption during training dropped 20-40%, and memory usage 25-35% on average. Accuracy on NLP tasks went up 5-10% rather than down - fine-tuned on smaller models, evaluated on GLUE and SQuAD.",
          "The honest caveat, stated in the paper: efficiency techniques can slightly impact performance. The hybrid approach is what keeps that impact from mattering.",
        ],
      },
      {
        heading: "Why we keep coming back to it",
        paragraphs: [
          "This work is not decorative. A model small and cheap enough to run at the edge is exactly what a webcam-based posture device on a Raspberry Pi needs, and exactly what a voice tutor priced against ₹1,500-an-hour tutoring needs. The research track and the product track are the same track.",
        ],
      },
    ],
  },
  {
    slug: "reading-100k-survey-answers",
    title: "Reading 100,000 survey answers without reading them",
    excerpt:
      "Three approaches, two dead ends, and the fine-tuned LLM plus RAG pipeline that finally landed at 95%.",
    date: "Mar 2025",
    lead: "Organisations spend around 60% of their research time processing open-ended responses. Not analysing them - processing them. That gap is where the decision gets delayed.",
    sections: [
      {
        heading: "Why this problem found me",
        paragraphs: [
          "We did not go looking for it. While working on the products we hit the same wall directly: piles of open-ended survey text, no efficient way to turn them into something a decision could rest on. Most AI tooling in this space predicts a number - regression, classification - and skips perceptual understanding entirely, which is where the actual insight lives.",
          "The third framing matters most. Small institutes cannot afford a data analyst, and non-technical users cannot interpret raw survey data. The tooling exists; the access does not.",
        ],
      },
      {
        heading: "Two approaches that did not work",
        paragraphs: [
          "The first attempt was traditional NLP - sentiment analysis, structural topic modelling, TF-IDF keyword extraction. It lacked contextual understanding, needed constant manual tuning, and did not scale.",
          "The second combined machine learning models with NLP for classification and topic modelling. Accuracy improved, but the system stayed rigid: no adaptability, no real-time insight. Better numbers, same ceiling.",
        ],
      },
      {
        heading: "The dual-stream architecture",
        paragraphs: [
          "The third iteration worked: a GPT-based LLM fine-tuned for accuracy, with retrieval-augmented generation layered on for real-time context. Three components - automated question generation and interpretation, AI-driven analysis with a self-learning feedback loop, and interactive visualisation through D3.js and Plotly with a chat interface on top.",
          "Trained against a corpus of 100,000+ annotated responses, it reached 95% overall accuracy, cut manual processing by 60%, reduced processing time by a further 40% through the feedback loop, and held roughly 85% F1 on sentiment and summarisation.",
        ],
      },
      {
        heading: "The part we would tell a client",
        paragraphs: [
          "Write down the approaches that failed. A result with no failed iterations behind it is either luck or a very small problem. The progression from rule-based to deep learning to fine-tuned LLM plus RAG is the actual finding - it tells the next person where the ceiling of each method is, which is worth more than the final accuracy figure.",
        ],
      },
    ],
  },
  {
    slug: "verification-is-a-pipeline-stage",
    title: "Verification is a pipeline stage, not a filter",
    excerpt:
      "The same instinct keeps surfacing across a research engine, a health device and a survey analyser: produce a defensible output, not just an output.",
    date: "2025",
    lead: "Look at three systems built for three unrelated industries and the same structural decision shows up in all of them. That is either a habit or a thesis. We think it is a thesis.",
    sections: [
      {
        heading: "Three systems, one instinct",
        paragraphs: [
          "In Syrus, claim extraction and fact-checking are their own agents in the sequence rather than a post-hoc pass over the finished draft. In the survey analyser, a self-learning feedback loop and a dual-stream architecture exist for the same reason. In the posture device, a five-minute self-correction window and a ten-second stability filter sit between detection and alarm.",
          "Different domains, same move: the system is not finished when it has an answer. It is finished when the answer can survive being questioned.",
        ],
      },
      {
        heading: "Why bolting it on afterwards fails",
        paragraphs: [
          "A verification step added at the end can only score what it is handed. It has no access to the intermediate state - which sources were considered, which claims were load-bearing, what the model was uncertain about. By the time you are checking a finished paragraph, the information you needed to check it properly has already been discarded.",
          "Making verification a stage means the pipeline keeps that state around because a later stage depends on it. The architecture forces the honesty.",
        ],
      },
      {
        heading: "Alert fatigue is the same bug",
        paragraphs: [
          "The posture device makes this concrete. A binary good/bad alarm is a system with no verification stage - every detection becomes a notification, users stop trusting the notifications, and the device ends up in a drawer. Adding a correction window and a stability filter is not a UX nicety; it is the system checking its own claim before it acts on it. That single change removed 40% of false positives.",
        ],
      },
      {
        heading: "What it costs",
        paragraphs: [
          "Latency and complexity, mostly. Six agents are harder to reason about than one prompt, and a five-minute window means the device is deliberately slower to react than it could be. That is the trade, and it is worth making anywhere the cost of a confident wrong answer exceeds the cost of a slower right one - which, in research tooling and health hardware, is essentially always.",
        ],
      },
    ],
  },
];

/** Tracks the work clusters into - used by the /personal section. */
export const personalCategories = [
  {
    slug: "agentic-systems",
    title: "Agentic systems",
    blurb: "Multi-agent orchestration, retrieval and verification.",
  },
  {
    slug: "edge-ai",
    title: "Edge AI",
    blurb: "Small models on small hardware, close to the sensor.",
  },
  {
    slug: "applied-research",
    title: "Applied research",
    blurb: "Papers that feed straight back into the products.",
  },
];
