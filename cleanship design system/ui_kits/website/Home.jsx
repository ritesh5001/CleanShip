const { UtilityBar, SiteHeader, SiteFooter, SectionHeading, Button, Icon, ServiceCard, StatCounter, CheckList, ContactDetail, CtaBanner, PhotoFrame, Card, Badge } = window.CS_DS;

function Hero({ onNavigate }) {
  return (
    <section style={{ position: "relative", height: 620, background: "var(--navy-800)", overflow: "hidden" }}>
      <PhotoFrame slotId="web-hero" scrim="left" placeholder="Drop a full-bleed vessel photo"
        style={{ position: "absolute", inset: 0, aspectRatio: "auto", borderRadius: 0 }} />
      <div className="cs-container" style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, font: "var(--type-eyebrow)", letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", color: "var(--aqua-200)" }}>
          <span style={{ width: 30, height: 1, background: "var(--aqua-500)" }} />Cleanship Marine Services &amp; Solutions
        </div>
        <h1 style={{ font: "var(--fw-bold) var(--fs-display-1)/var(--lh-display) var(--font-display)", textTransform: "uppercase", color: "#fff", margin: 0, maxWidth: 820, letterSpacing: "var(--ls-display)" }}>
          Marine cleaning<br />you can trust
        </h1>
        <p style={{ font: "var(--type-body-lg)", color: "var(--text-on-dark-muted)", maxWidth: 560, margin: 0 }}>
          Hold, tank and underwater hull cleaning for bulk carriers, tankers and container ships — IMO and port compliant, Mon–Sun, 24 hours.
        </p>
        <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
          <Button variant="primary" size="lg" iconRight={<Icon name="arrow-right" size={16} />} onClick={() => onNavigate("Contact Us")}>Request a quote</Button>
          <Button variant="onDarkOutline" size="lg" onClick={() => onNavigate("Services")}>Our services</Button>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(6,32,58,.82)", borderTop: "var(--rule-accent-w) solid var(--aqua-500)" }}>
        <div className="cs-container" style={{ display: "flex", justifyContent: "space-between", padding: "18px var(--page-pad)", flexWrap: "wrap", gap: 16 }}>
          {["Experienced marine cleaning professionals", "IMO & port-compliant procedures", "Eco-friendly cleaning solutions"].map(t => (
            <span key={t} style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff", font: "var(--type-body-sm)" }}>
              <Icon name="shield-check" size={18} color="var(--aqua-500)" />{t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection({ onNavigate, limit = 8 }) {
  return (
    <section style={{ padding: "var(--section-y) 0", background: "var(--surface-page)" }}>
      <div className="cs-container">
        <SectionHeading eyebrow="Our Services" title="Comprehensive Marine Solutions" align="center"
          intro="Eight core disciplines, delivered by riding crews across UAE and Indian ports." style={{ marginBottom: 48 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "var(--gutter)" }}>
          {window.CS_DATA.services.slice(0, limit).map(s => (
            <ServiceCard key={s.index} index={s.index} title={s.title} icon={s.icon} slotId={"web-svc-" + s.index}
              description={s.teaser} onClick={e => { e.preventDefault(); onNavigate("Services"); }} />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, marginTop: 44 }}>
          <span style={{ font: "var(--type-body-lg)", color: "var(--text-muted)" }}>We always ready to serve you.</span>
          <Button variant="secondary" onClick={() => onNavigate("Services")} iconRight={<Icon name="arrow-right" size={15} />}>View more services</Button>
        </div>
      </div>
    </section>
  );
}

function AboutSection({ onNavigate }) {
  return (
    <section style={{ padding: "var(--section-y) 0", background: "var(--surface-subtle)" }}>
      <div className="cs-container" style={{ display: "grid", gridTemplateColumns: "1fr 1.05fr", gap: 64, alignItems: "center" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <PhotoFrame slotId="web-about-1" ratio="3 / 4" placeholder="Hold cleaning service" />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <PhotoFrame slotId="web-about-2" ratio="4 / 3" placeholder="Riding crew" />
            <div style={{ background: "var(--navy-800)", padding: "22px 20px" }}>
              <StatCounter value={5} label="Years Experiences" tone="dark" />
            </div>
          </div>
        </div>
        <div>
          <SectionHeading eyebrow="About Cleanship" title="Why will you choose our services?" />
          <p style={{ font: "var(--type-body)", color: "var(--text-muted)", margin: "18px 0 0" }}>
            Cleanship is a trusted Hold &amp; Tank Cleaning Service Provider, offering professional cleaning for cargo holds on all types of ships, including bulk carriers, tankers, and container ships.
          </p>
          <p style={{ font: "var(--type-body)", color: "var(--text-muted)" }}>
            Our eco-friendly methods and advanced tools thoroughly remove dirt, residues, and contaminants. We strictly follow international safety and environmental standards, ensuring your vessel remains compliant and ready for operations.
          </p>
          <CheckList style={{ margin: "22px 0 30px" }} items={["Experienced marine cleaning professionals", "IMO & port-compliant procedures", "Eco-friendly cleaning solutions"]} />
          <Button variant="navy" onClick={() => onNavigate("About Us")} iconRight={<Icon name="arrow-right" size={15} />}>More about us</Button>
        </div>
      </div>
    </section>
  );
}

function StatsBand() {
  return (
    <section style={{ background: "var(--surface-dark)", padding: "var(--section-y-tight) 0" }}>
      <div className="cs-container" style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 24 }}>
        {window.CS_DATA.stats.map(s => <StatCounter key={s.label} {...s} tone="dark" align="center" />)}
      </div>
    </section>
  );
}

function BlogTeaser() {
  const posts = [
    { tag: "Compliance", title: "What port state control checks after a hold cleaning", date: "12 Jun 2026" },
    { tag: "Hull", title: "Fuel savings from a clean hull: what the data shows", date: "28 May 2026" },
    { tag: "Safety", title: "Enclosed space entry: our tank cleaning protocol", date: "09 May 2026" },
  ];
  return (
    <section style={{ padding: "var(--section-y) 0" }}>
      <div className="cs-container">
        <SectionHeading eyebrow="Latest Blog" title="Cleanship Marine Services &amp; Solutions" align="center" style={{ marginBottom: 44 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "var(--gutter)" }}>
          {posts.map((p, i) => (
            <Card key={p.title} interactive pad="0" style={{ overflow: "hidden" }}>
              <PhotoFrame slotId={"web-blog-" + i} ratio="16 / 9" placeholder={p.tag} style={{ borderRadius: 0 }} />
              <div style={{ padding: 22 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <Badge tone="brand">{p.tag}</Badge>
                  <span style={{ font: "var(--type-body-sm)", color: "var(--text-faint)" }}>{p.date}</span>
                </div>
                <h3 style={{ font: "var(--type-h4)", margin: 0 }}>{p.title}</h3>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactStrip() {
  return (
    <section style={{ padding: "var(--section-y-tight) 0 var(--section-y)", background: "var(--surface-tint)" }}>
      <div className="cs-container">
        <SectionHeading eyebrow="Contact Us" title="Feel free to contact with us for any kind of query."
          intro="Our team is ready to assist you with all your marine service needs. Reach out to us through any of the following channels."
          align="center" style={{ marginBottom: 44 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "var(--gutter)" }}>
          {window.CS_DATA.contact.map(c => (
            <div key={c.label} style={{ background: "var(--white)", border: "1px solid var(--blue-100)", padding: 24 }}>
              <ContactDetail {...c} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Home({ onNavigate }) {
  return (
    <div>
      <Hero onNavigate={onNavigate} />
      <ServicesSection onNavigate={onNavigate} />
      <AboutSection onNavigate={onNavigate} />
      <StatsBand />
      <BlogTeaser />
      <ContactStrip />
      <div className="cs-container" style={{ paddingBottom: "var(--section-y)" }}>
        <CtaBanner eyebrow="We are Cleanship!" title="We always ready to serve you."
          body="Marine cleaning you can trust — Mon – Sun, 24 hours." primaryLabel="Contact us" secondaryLabel="Call +971 - 554029954" />
      </div>
    </div>
  );
}

Object.assign(window, { Home, Hero, ServicesSection, AboutSection, StatsBand, BlogTeaser, ContactStrip });
