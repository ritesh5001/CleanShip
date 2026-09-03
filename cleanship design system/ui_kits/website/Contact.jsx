const { PageHero, SectionHeading, ContactDetail, Input, Select, Textarea, Checkbox, Button, Card, Icon, PhotoFrame } = window.CS_DS;

function ContactPage() {
  const [sent, setSent] = React.useState(false);
  const [ok, setOk] = React.useState(false);
  return (
    <div>
      <PageHero title="Contact Us" eyebrow="Cleanship Marine Services" breadcrumb={["Home", "Contact Us"]} slotId="web-hero-contact" height={280} />
      <section style={{ padding: "var(--section-y) 0" }}>
        <div className="cs-container">
          <SectionHeading eyebrow="Contact Us" title="Feel free to contact with us for any kind of query."
            intro="Our team is ready to assist you with all your marine service needs. Reach out to us through any of the following channels."
            align="center" style={{ marginBottom: 48 }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: 48, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {window.CS_DATA.contact.map(c => (
                <div key={c.label} style={{ background: "var(--surface-tint)", border: "1px solid var(--blue-100)", padding: 22 }}>
                  <ContactDetail {...c} />
                </div>
              ))}
            </div>
            <Card pad="32px" accentRule>
              {sent ? (
                <div style={{ textAlign: "center", padding: "48px 0" }}>
                  <Icon name="check" size={40} color="var(--success-600)" style={{ margin: "0 auto 16px" }} />
                  <h3 style={{ font: "var(--type-h3)", margin: "0 0 8px" }}>Enquiry received</h3>
                  <p style={{ font: "var(--type-body)", color: "var(--text-muted)" }}>We reply within the working day, Mon–Sat.</p>
                  <Button variant="secondary" onClick={() => setSent(false)}>Send another</Button>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); setSent(true); }} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 20px" }}>
                  <Input id="c-name" label="Full name" placeholder="Capt. A. Rahman" required />
                  <Input id="c-company" label="Company" placeholder="Fleet or agency" />
                  <Input id="c-mail" label="Mail address" placeholder="ops@yourfleet.com" iconLeft={<Icon name="mail" size={16} />} required />
                  <Input id="c-phone" label="Phone" placeholder="+971 …" iconLeft={<Icon name="phone-call" size={16} />} />
                  <Select id="c-service" label="Service required" placeholder="Select a service" options={window.CS_DATA.services.map(s => s.title)} />
                  <Input id="c-port" label="Port / anchorage" placeholder="Khor Fakkan" />
                  <Textarea id="c-msg" label="Your enquiry" rows={5} placeholder="Vessel, cargo history, dates, scope of work…" style={{ gridColumn: "1 / -1" }} />
                  <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
                    <Checkbox checked={ok} onChange={e => setOk(e.target.checked)} label="Send me port compliance updates" />
                    <Button variant="primary" size="lg" iconRight={<Icon name="arrow-right" size={16} />}>Send enquiry</Button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      </section>
      <section style={{ paddingBottom: "var(--section-y)" }}>
        <div className="cs-container">
          <PhotoFrame slotId="web-map" ratio="21 / 9" placeholder="Drop a map of Ajman Free Zone C1 Building" />
        </div>
      </section>
    </div>
  );
}
Object.assign(window, { ContactPage });
