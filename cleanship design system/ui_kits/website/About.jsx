const { PageHero, SectionHeading, CheckList, StatCounter, PhotoFrame, Card, Icon, CtaBanner } = window.CS_DS;

function AboutPage({ onNavigate }) {
  return (
    <div>
      <PageHero title="About Us" eyebrow="We are Cleanship!" breadcrumb={["Home", "About Us"]} slotId="web-hero-about" />
      <section style={{ padding: "var(--section-y) 0" }}>
        <div className="cs-container" style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <SectionHeading eyebrow="About Cleanship" title="Why will you choose our services?" />
            <p style={{ font: "var(--type-body)", color: "var(--text-muted)", margin: "18px 0 0" }}>
              Cleanship is a trusted Hold &amp; Tank Cleaning Service Provider, offering professional cleaning for cargo holds on all types of ships, including bulk carriers, tankers, and container ships.
            </p>
            <p style={{ font: "var(--type-body)", color: "var(--text-muted)" }}>
              Our eco-friendly methods and advanced tools thoroughly remove dirt, residues, and contaminants. We strictly follow international safety and environmental standards, ensuring your vessel remains compliant and ready for operations.
            </p>
            <CheckList style={{ marginTop: 22 }} items={["Experienced marine cleaning professionals", "IMO & port-compliant procedures", "Eco-friendly cleaning solutions"]} />
          </div>
          <PhotoFrame slotId="web-about-page" ratio="4 / 3" placeholder="Riding crew at work" />
        </div>
      </section>
      <section style={{ background: "var(--surface-dark)", padding: "var(--section-y-tight) 0" }}>
        <div className="cs-container" style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 24 }}>
          {window.CS_DATA.stats.map(s => <StatCounter key={s.label} {...s} tone="dark" align="center" />)}
        </div>
      </section>
      <section style={{ padding: "var(--section-y) 0" }}>
        <div className="cs-container">
          <SectionHeading eyebrow="How we work" title="From enquiry to cargo-ready hold" align="center" style={{ marginBottom: 44 }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "var(--gutter)" }}>
            {[["01", "Enquiry", "Vessel, port, cargo history and dates."],
              ["02", "Survey & method", "Condition survey and written method statement."],
              ["03", "Mobilise", "Riding crew and equipment on board."],
              ["04", "Handover", "Inspection, photos and compliance report."]].map(([n, t, b]) => (
              <Card key={n} pad="26px" style={{ position: "relative" }}>
                <span style={{ font: "var(--fw-bold) 34px/1 var(--font-display)", color: "var(--blue-100)", display: "block", marginBottom: 10 }}>{n}</span>
                <h3 style={{ font: "var(--type-h4)", margin: "0 0 8px" }}>{t}</h3>
                <p style={{ font: "var(--type-body-sm)", color: "var(--text-muted)", margin: 0 }}>{b}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <div className="cs-container" style={{ paddingBottom: "var(--section-y)" }}>
        <CtaBanner eyebrow="We are Cleanship!" title="Marine Cleaning You Can Trust" body="B.C. 1302955, Ajman Free Zone C1 Building, UAE" primaryLabel="Contact us" />
      </div>
    </div>
  );
}
Object.assign(window, { AboutPage });
