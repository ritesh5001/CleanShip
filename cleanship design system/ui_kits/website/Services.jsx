const { PageHero, SectionHeading, ServiceCard, Tag, CtaBanner, Card, Icon, CheckList, Button } = window.CS_DS;

function ServicesPage({ onNavigate }) {
  const [filter, setFilter] = React.useState("All services");
  const groups = { "All services": null, "Cleaning": ["01", "02", "03", "04", "07"], "Surface": ["05", "06"], "Offshore": ["08"] };
  const list = window.CS_DATA.services.filter(s => !groups[filter] || groups[filter].includes(s.index));
  return (
    <div>
      <PageHero title="Our Services" eyebrow="Cleanship Marine Services" breadcrumb={["Home", "Services"]} slotId="web-hero-services" />
      <section style={{ padding: "var(--section-y) 0" }}>
        <div className="cs-container">
          <SectionHeading eyebrow="Our Services" title="Comprehensive Marine Solutions"
            intro="Select a discipline to see scope, method and compliance notes." style={{ marginBottom: 30 }} />
          <div style={{ display: "flex", gap: 10, marginBottom: 36, flexWrap: "wrap" }}>
            {Object.keys(groups).map(g => <Tag key={g} active={g === filter} onClick={() => setFilter(g)}>{g}</Tag>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "var(--gutter)" }}>
            {list.map(s => (
              <ServiceCard key={s.index} index={s.index} title={s.title} icon={s.icon} description={s.description}
                slotId={"web-svcpage-" + s.index} onClick={e => { e.preventDefault(); onNavigate("Contact Us"); }} />
            ))}
          </div>
        </div>
      </section>
      <section style={{ background: "var(--surface-subtle)", padding: "var(--section-y-tight) 0" }}>
        <div className="cs-container" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "var(--gutter)" }}>
          {[["clipboard-check", "Scope & survey", "Pre-cleaning survey, hold condition report and a written method statement before crews mobilise."],
            ["shield-check", "Compliance", "IMO, MARPOL and port-authority procedures, with enclosed-space entry permits and gas-free certification."],
            ["ship", "Turnaround", "Riding crews work in transit so the vessel is cargo-ready on arrival — no idle days alongside."]].map(([ic, t, b]) => (
            <Card key={t} accentRule pad="28px">
              <Icon name={ic} size={30} color="var(--blue-600)" style={{ marginBottom: 16 }} />
              <h3 style={{ font: "var(--type-h4)", margin: "0 0 10px" }}>{t}</h3>
              <p style={{ font: "var(--type-body-sm)", color: "var(--text-muted)", margin: 0 }}>{b}</p>
            </Card>
          ))}
        </div>
      </section>
      <div className="cs-container" style={{ padding: "var(--section-y) 0" }}>
        <CtaBanner title="Need a scope and price for your next port call?" body="Send vessel details and we respond within the working day."
          primaryLabel="Contact us" primaryHref="#contact" />
      </div>
    </div>
  );
}
Object.assign(window, { ServicesPage });
