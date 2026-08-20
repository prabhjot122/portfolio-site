import { Section, Reveal } from "@/components/section";
import { site } from "@/lib/content";

export const metadata = { title: "Privacy Policy" };

const sections = [
  {
    heading: "What we collect",
    body: "When you reach out through the contact form, we collect what you give us directly - your name, the message you send, and any files you choose to attach. We do not run analytics scripts or advertising trackers on this site, and we do not collect information about you simply by your visiting.",
  },
  {
    heading: "How we use it",
    body: "We use what you send us for exactly one purpose: to read your message and reply. We do not sell, rent, or share your information with third parties, and we do not use it for marketing you have not asked for.",
  },
  {
    heading: "How it reaches us",
    body: "The contact form hands your message to your own email client, addressed to us - it does not pass through a server or database we run. Attachments you select are named in that message as a reminder to attach them yourself; the form does not upload or store files anywhere.",
  },
  {
    heading: "How long we keep it",
    body: "We keep enquiry emails for as long as is useful to the working relationship they start, and delete them when they are no longer needed.",
  },
  {
    heading: "Your rights",
    body: "You can ask us at any time what we hold about you, and ask us to correct or delete it. Write to the address below and we will act on it promptly.",
  },
  {
    heading: "Changes to this policy",
    body: "If this policy changes, the update will be posted on this page with a new effective date.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <section className="px-5 pt-32 pb-8 md:px-10 md:pt-[8.75rem] md:pb-12">
        <div className="mx-auto max-w-[89.5rem]">
          <Reveal>
            <h1 className="max-w-[24ch] display-l">Privacy Policy</h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-8 max-w-[46ch] text-lg leading-[1.5] text-ink-2">
              A short, plain-language account of what we collect, why, and
              how to reach us about it.
            </p>
          </Reveal>
        </div>
      </section>

      <Section className="!pt-0">
        <div className="flex flex-col gap-10 border-t border-hair pt-10 md:max-w-[60ch]">
          {sections.map((s, i) => (
            <Reveal key={s.heading} delay={i * 0.04}>
              <h2 className="text-title">{s.heading}</h2>
              <p className="mt-3 leading-[1.6] text-ink-2">{s.body}</p>
            </Reveal>
          ))}

          <Reveal delay={sections.length * 0.04}>
            <h2 className="text-title">Contact</h2>
            <p className="mt-3 leading-[1.6] text-ink-2">
              Questions about this policy, or your data, go to{" "}
              <a
                href={`mailto:${site.email}`}
                data-cursor="copy"
                className="text-ink underline decoration-hair-strong underline-offset-2 hover:text-accent"
              >
                {site.email}
              </a>
              .
            </p>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
