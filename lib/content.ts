/**
 * All site copy lives here so pages stay structural.
 *
 * Everything below is drawn from the portfolio master document: three
 * end-to-end products and two conference papers. Figures quoted in the case
 * studies are the ones stated in the source decks - if a number is not in
 * there, it is not here either.
 */

export const site = {
  name: "Sahil Saurav",
  role: "AI & Automation Engineer",
  location: "Bhopal, India",
  email: "sahilsaurav2507@gmail.com",
  socials: [
    { label: "GitHub", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Scholar", href: "#" },
  ],
};

/**
 * The floating top-right bar shown over the hero. Both entries scroll to a
 * section of the home page rather than routing anywhere - it is a shortcut,
 * not a menu, and it retires the moment the page starts moving.
 */
export const topNav = [
  { label: "Work", id: "work" },
  { label: "What I do", id: "what-i-do" },
];

/** Short positioning line shown in the side rail. */
export const blurb =
  "Working with your team to design and ship AI systems - agents, retrieval pipelines and data workflows that hold up outside a demo.";

/** Two headline numbers for the rail's stat card. */
export const stats = [
  { value: "3", label: "Products\nshipped" },
  { value: "2", label: "Research\npapers" },
];

/**
 * Side rail navigation - one row per section of the home page, in the order
 * they are read. `id` is the section's DOM id, used both for the anchor and
 * for scroll-spy highlighting. `icon` keys map to glyphs in components/icons.tsx.
 */
export const sideNav = [
  { label: "Home", id: "top", icon: "home" as const },
  { label: "Things I have built", id: "work", icon: "folder" as const },
  { label: "What I do", id: "what-i-do", icon: "bolt" as const },
  { label: "Kind words", id: "kind-words", icon: "person" as const },
  { label: "Things worth sharing", id: "worth-sharing", icon: "layers" as const },
];

/** Section ids in document order - the scroll-spy walks this list. */
export const sectionIds = sideNav.map((s) => s.id);

/**
 * Hero.
 *
 * `statement` is the thesis, set at display-xl — the claim the rest of
 * the site spends its time backing up. It is drawn from the through-line
 * that already runs through the case studies and the articles: a system
 * is not finished when it has an answer, it is finished when the answer
 * survives being questioned.
 *
 * `lede` carries the identity that the statement no longer states, and
 * the meta pairs below carry the facts. Location deliberately appears
 * once, in `meta` — the old headline repeated it.
 */
export const hero = {
  statement: [
    "I help startups and businesses turn ideas into",
    "functional *AI-powered* MVPs, *automation* *systems,*",
    "and *data-driven* *products.*",
  ],
  lede: "AI engineer in Bhopal building agents, retrieval pipelines and the data plumbing underneath them.",
  meta: [
    { label: "Based", value: "Bhopal, India" },
    { label: "Focus", value: "AI Agents, RAG, Data Engineering" },
    { label: "Languages", value: "English, Hindi" },
    { label: "Open for", value: "Freelance work" },
  ],
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
  /** Only numbers stated in the source material. */
  metrics: { label: string; value: string }[];
};

export const projects: Project[] = [
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
    metrics: [
      { label: "Agents in the pipeline", value: "6" },
      { label: "Output surfaces", value: "4 tabs" },
      { label: "Verification stages", value: "2" },
    ],
  },
  {
    slug: "posture-detection",
    title: "Posture Detection System",
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
    metrics: [
      { label: "Accuracy on synthetic data", value: "85%" },
      { label: "Projected on clinical data", value: "95%" },
      { label: "Response time", value: "200ms" },
      { label: "False positives removed", value: "40%" },
    ],
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
    metrics: [
      { label: "Pilot schools", value: "5" },
      { label: "Validation interviews", value: "10" },
      { label: "Average rating", value: "4.0 / 5" },
      { label: "Monthly infrastructure", value: "$450" },
    ],
  },
];

/** Six cells so the 3-column grid forms two complete rows. */
export const services = [
  {
    n: "01",
    title: "AI agents & automation",
    body: "Custom agents and workflow automation wired into the tools you already run - from feasibility study to something your team uses daily.",
  },
  {
    n: "02",
    title: "LLM & SLM integration",
    body: "Fine-tuning, retrieval-augmented generation, and prompt and model-performance optimisation measured against a real evaluation set.",
  },
  {
    n: "03",
    title: "Solution architecture",
    body: "Prototypes and proofs of concept that answer whether a thing is worth building, before the budget commits to it.",
  },
  {
    n: "04",
    title: "Data engineering",
    body: "Cleaning, transformation, ethical collection and automated pipelines - AI-ready datasets that stay usable six months later.",
  },
  {
    n: "05",
    title: "Analytics & dashboards",
    body: "Exploratory analysis, reporting surfaces and predictive models that resolve to a decision rather than a chart.",
  },
  {
    n: "06",
    title: "Websites & portfolios",
    body: "Responsive sites and landing pages with SEO and analytics configured, deployed and maintained.",
  },
];

/**
 * Aggregate validation drawn from the source decks. The underlying slides
 * carry named respondents and phone numbers; those are deliberately not
 * reproduced. Swap these for named quotes once you have consent.
 */
export const testimonials = [
  {
    quote:
      "Across ten documented validation interviews with students and professors, the assistant averaged 4.0 out of 5. Real-time doubt solving and the shared progress view were named most often as the reason.",
    author: "Customer validation report",
    role: "SAAVI pilot - 10 respondents",
  },
  {
    quote:
      "Clinical validation was carried out with Bachelor of Physiotherapy students under faculty mentorship spanning both the AIML and Physiotherapy departments, which puts the accuracy path on clinical rather than synthetic data.",
    author: "Institutional review",
    role: "C-CAMP Inter-Institutional Biomedical Program",
  },
];

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
          "The paper I presented in December 2024 took that framing seriously: optimise low-parameter models for better performance and lower resource use at the same time, and treat the second half as the point rather than the compromise.",
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
        heading: "Why I keep coming back to it",
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
          "I did not go looking for it. While working on the products I hit the same wall directly: piles of open-ended survey text, no efficient way to turn them into something a decision could rest on. Most AI tooling in this space predicts a number - regression, classification - and skips perceptual understanding entirely, which is where the actual insight lives.",
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
        heading: "The part I would tell a client",
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
    lead: "Look at three systems built for three unrelated industries and the same structural decision shows up in all of them. That is either a habit or a thesis. I think it is a thesis.",
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
