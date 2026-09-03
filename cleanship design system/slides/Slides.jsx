const { Icon, StatCounter, CheckList, PhotoFrame, Badge } = window.CS_DS;

const wordmark = (light) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <Icon name="anchor" size={26} color="var(--aqua-500)" />
    <span style={{ font: "var(--fw-bold) 26px/1 var(--font-display)", textTransform: "uppercase", letterSpacing: ".04em", color: light ? "#fff" : "var(--navy-800)" }}>
      Clean<span style={{ color: light ? "var(--aqua-500)" : "var(--blue-500)" }}>ship</span>
    </span>
  </div>
);

function Stage({ children, bg = "var(--white)" }) {
  return <div style={{ width: 1280, height: 720, background: bg, position: "relative", overflow: "hidden", fontFamily: "var(--font-body)" }}>{children}</div>;
}

function Footline({ label, page, light }) {
  return (
    <div style={{ position: "absolute", left: 56, right: 56, bottom: 30, display: "flex", justifyContent: "space-between",
      font: "var(--type-mono)", color: light ? "rgba(255,255,255,.6)" : "var(--text-faint)", textTransform: "uppercase", letterSpacing: "var(--ls-label)" }}>
      <span>{label}</span><span>{page}</span>
    </div>
  );
}

/* 1 — Cover: navy left plate, full-bleed vessel photo right */
function CoverSlide() {
  return (
    <Stage bg="var(--navy-800)">
      <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ padding: "56px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          {wordmark(true)}
          <div>
            <div style={{ width: 60, height: 3, background: "var(--aqua-500)", marginBottom: 26 }} />
            <h1 style={{ font: "var(--fw-bold) 76px/1.02 var(--font-display)", textTransform: "uppercase", color: "#fff", margin: 0, letterSpacing: ".01em" }}>
              Company<br />Introduction
            </h1>
            <p style={{ font: "var(--type-body-lg)", color: "var(--text-on-dark-muted)", marginTop: 22, maxWidth: 420 }}>
              Cleanship Marine Services &amp; Solutions — hold, tank and hull cleaning you can trust.
            </p>
          </div>
          <div style={{ font: "var(--type-body-sm)", color: "var(--text-on-dark-muted)", lineHeight: 1.8 }}>
            B.C. 1302955, Ajman Free Zone C1 Building, UAE<br />+971 - 554029954 · ops@cleanship.co
          </div>
        </div>
        <PhotoFrame slotId="slide-cover" scrim="none" placeholder="Drop a vessel photo"
          style={{ aspectRatio: "auto", height: "100%", borderRadius: 0 }} />
      </div>
    </Stage>
  );
}

/* 2 — Contents: photo band above, numbered index below */
function ContentsSlide() {
  const items = window.CS_DATA.services;
  return (
    <Stage>
      <div style={{ height: 330, position: "relative" }}>
        <PhotoFrame slotId="slide-contents" scrim="flat" placeholder="Drop an aerial vessel photo" style={{ aspectRatio: "auto", height: "100%", borderRadius: 0 }} />
        <div style={{ position: "absolute", left: 56, top: 40 }}>{wordmark(true)}</div>
        <h2 style={{ position: "absolute", left: 56, bottom: 40, font: "var(--fw-bold) 54px/1.04 var(--font-display)", textTransform: "uppercase", color: "#fff", margin: 0 }}>
          Cleanship<br />Marine Services
        </h2>
      </div>
      <div style={{ padding: "44px 56px 0", display: "flex", gap: 40, alignItems: "flex-start" }}>
        <div style={{ flex: "0 0 auto" }}>
          <div style={{ font: "var(--fw-bold) 34px/1 var(--font-display)", textTransform: "uppercase", color: "var(--navy-800)" }}>Contents</div>
          <div style={{ width: 46, height: 3, background: "var(--aqua-500)", marginTop: 12 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "26px 32px", flex: 1 }}>
          {items.map(s => (
            <div key={s.index} style={{ borderTop: "1px solid var(--border-default)", paddingTop: 12 }}>
              <div style={{ font: "var(--fw-bold) 22px/1 var(--font-display)", color: "var(--blue-500)" }}>{s.index}</div>
              <div style={{ font: "var(--fw-semibold) 17px/1.3 var(--font-body)", color: "var(--text-strong)", marginTop: 8 }}>{s.title}</div>
            </div>
          ))}
        </div>
      </div>
      <Footline label="Cleanship Marine Services FZE" page="02" />
    </Stage>
  );
}

/* 3 — Service spread: navy title band, copy column, photo grid */
function ServiceSpreadSlide() {
  return (
    <Stage>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", height: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ background: "var(--navy-800)", padding: "40px 56px 34px" }}>
            <div style={{ font: "var(--type-eyebrow)", letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", color: "var(--aqua-200)", marginBottom: 12 }}>Service 01</div>
            <h2 style={{ font: "var(--fw-bold) 46px/1.04 var(--font-display)", textTransform: "uppercase", color: "#fff", margin: 0 }}>Hold Cleaning</h2>
          </div>
          <div style={{ padding: "34px 56px", flex: 1 }}>
            <p style={{ font: "var(--type-body)", color: "var(--text-muted)" }}>
              Professional cargo hold cleaning service ensures residue-free holds, cargo readiness, safety compliance, and efficient vessel turnaround.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 28px", marginTop: 26 }}>
              {[["Scope", "Sweeping, washing, lime-washing and hold drying on bulk carriers, tankers and container ships."],
                ["Compliance", "IMO and MARPOL procedures; enclosed-space entry permits and gas-free certification."],
                ["Method", "Eco-friendly chemicals with advanced high-pressure equipment."],
                ["Turnaround", "Riding crews work in transit — cargo-ready on arrival."]].map(([t, b]) => (
                <div key={t} style={{ borderTop: "var(--rule-accent-w) solid var(--aqua-500)", paddingTop: 12 }}>
                  <div style={{ font: "var(--fw-semibold) var(--fs-caption)/1 var(--font-body)", letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: "var(--blue-600)", marginBottom: 8 }}>{t}</div>
                  <div style={{ font: "var(--type-body-sm)", color: "var(--text-muted)" }}>{b}</div>
                </div>
              ))}
            </div>
          </div>
          <Footline label="Hold Cleaning" page="03" />
        </div>
        <div style={{ background: "var(--paper)", padding: 28, display: "grid", gridTemplateRows: "1.4fr 1fr", gap: 16 }}>
          <PhotoFrame slotId="slide-svc-a" placeholder="Hold before cleaning" style={{ aspectRatio: "auto", borderRadius: 0 }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <PhotoFrame slotId="slide-svc-b" placeholder="Crew at work" style={{ aspectRatio: "auto", borderRadius: 0 }} />
            <PhotoFrame slotId="slide-svc-c" placeholder="Hold after cleaning" style={{ aspectRatio: "auto", borderRadius: 0 }} />
          </div>
        </div>
      </div>
    </Stage>
  );
}

/* 4 — Stats / credentials on navy */
function StatsSlide() {
  return (
    <Stage bg="var(--navy-900)">
      <div style={{ padding: "56px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {wordmark(true)}
        <div>
          <div style={{ font: "var(--type-eyebrow)", letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", color: "var(--aqua-200)", marginBottom: 14 }}>About Cleanship</div>
          <h2 style={{ font: "var(--fw-bold) 52px/1.05 var(--font-display)", textTransform: "uppercase", color: "#fff", margin: "0 0 40px", maxWidth: 760 }}>
            Why will you choose our services?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 24, borderTop: "1px solid var(--border-on-dark)", paddingTop: 34 }}>
            {window.CS_DATA.stats.map(s => <StatCounter key={s.label} {...s} tone="dark" />)}
          </div>
        </div>
        <CheckList tone="dark" columns={3} items={["Experienced marine cleaning professionals", "IMO & port-compliant procedures", "Eco-friendly cleaning solutions"]} />
        <Footline label="Credentials" page="04" light />
      </div>
    </Stage>
  );
}

/* 5 — Closing / contact */
function ClosingSlide() {
  return (
    <Stage bg="var(--navy-800)">
      <PhotoFrame slotId="slide-closing" scrim="bottom" placeholder="Drop a horizon photo" style={{ position: "absolute", inset: 0, aspectRatio: "auto", borderRadius: 0 }} />
      <div style={{ position: "absolute", inset: 0, padding: 56, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {wordmark(true)}
        <div>
          <h2 style={{ font: "var(--fw-bold) 64px/1.03 var(--font-display)", textTransform: "uppercase", color: "#fff", margin: 0 }}>
            We always ready<br />to serve you.
          </h2>
          <div style={{ display: "flex", gap: 56, marginTop: 34, font: "var(--type-body)", color: "#fff" }}>
            <div><div style={{ font: "var(--type-label)", letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: "var(--aqua-200)", marginBottom: 8 }}>Phone</div>+971 - 554029954<br />+91 - 9236520609</div>
            <div><div style={{ font: "var(--type-label)", letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: "var(--aqua-200)", marginBottom: 8 }}>Mail</div>ops@cleanship.co</div>
            <div><div style={{ font: "var(--type-label)", letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: "var(--aqua-200)", marginBottom: 8 }}>Office</div>B.C. 1302955, Ajman Free Zone<br />C1 Building, UAE</div>
            <div><div style={{ font: "var(--type-label)", letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: "var(--aqua-200)", marginBottom: 8 }}>Hours</div>Mon – Sun: 24 Hours</div>
          </div>
        </div>
      </div>
    </Stage>
  );
}

Object.assign(window, { Stage, CoverSlide, ContentsSlide, ServiceSpreadSlide, StatsSlide, ClosingSlide });
