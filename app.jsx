const { useState, useEffect, useRef, useMemo } = React;

// ===========================================================
// DATA
// ===========================================================

const CATEGORIES = [
  { id: "front",       num: "01", name: "Front-of-House",        em: "Front-of-House",       blurb: "The first impression — and the system underneath it.",        moduleIds: ["facility-home", "welcome", "visitors", "pre-welcome"] },
  { id: "care",        num: "02", name: "Care",                  em: "Care",                 blurb: "Clinical work, person-centred and traceable.",                 moduleIds: ["residents", "care-plans", "mar", "observations", "dementia"] },
  { id: "portals",     num: "03", name: "Stakeholder Portals",   em: "Portals",              blurb: "Calm interfaces for the people outside the building.",         moduleIds: ["family-portal", "doctor-portal"] },
  { id: "hospitality", num: "04", name: "Hospitality",           em: "Hospitality",          blurb: "The experience residents see every day.",                      moduleIds: ["kitchen", "housekeeping"] },
  { id: "operations",  num: "05", name: "Operations & Governance", em: "Operations",         blurb: "The infrastructure that holds the operation together.",        moduleIds: ["qms", "assets", "hr", "finance", "service-desk"] },
  { id: "executive",   num: "06", name: "Executive",             em: "Executive",            blurb: "The view from the top — in one calm screen.",                  moduleIds: ["exec-command", "exec-kpis"] },
];

const MODULES = [
  { id: "facility-home", num: "01", name: "Facility Home",             short: "Facility Home",       category: "front",       blurb: "The single screen that opens every shift — today's residents, today's workload, today's flags." },
  { id: "welcome",       num: "02", name: "Welcome",                   short: "Welcome",             category: "front",       blurb: "Resident onboarding from enquiry to first night — paperwork, room readiness, family touchpoints, all sequenced." },
  { id: "visitors",      num: "03", name: "Visitors & Security",       short: "Visitors & Security", category: "front",       blurb: "Gate, reception, after-hours. Every entry logged, every visitor traceable, every emergency accountable." },
  { id: "pre-welcome",   num: "04", name: "Pre-Welcome Checks",        short: "Pre-Welcome",         category: "front",       blurb: "Clinical, financial and compliance checks before a resident arrives. Nothing slips through." },
  { id: "residents",     num: "05", name: "Residents",                 short: "Residents",           category: "care",        blurb: "The resident record — preferences, history, care needs, family contacts. One source of truth." },
  { id: "care-plans",    num: "06", name: "Care Plans",                short: "Care Plans",          category: "care",        blurb: "Person-centred care plans that change with the resident, reviewed on cadence, with named owners for each goal." },
  { id: "mar",           num: "07", name: "Medication MAR",            short: "Medication MAR",      category: "care",        blurb: "eMAR with controlled-substance witness flow, pharmacy reconciliation, refusal codes, and adverse-event linkage." },
  { id: "observations",  num: "08", name: "Observations",              short: "Observations",        category: "care",        blurb: "Vitals, behaviour, mood, sleep — trended over time and surfaced where they matter." },
  { id: "dementia",      num: "09", name: "Dementia Care",             short: "Dementia Care",       category: "care",        blurb: "Specialised workflows for cognitive decline — routines, behaviour mapping, wandering alerts, family communication." },
  { id: "family-portal", num: "10", name: "Family Portal",             short: "Family Portal",       category: "portals",     blurb: "A calm, branded family app — updates, messages, photos, billing, visit requests, without phone queues." },
  { id: "doctor-portal", num: "11", name: "Doctor Portal",             short: "Doctor Portal",       category: "portals",     blurb: "A focused interface for visiting and resident doctors — charts, scripts, notes, signatures, in and out in minutes." },
  { id: "kitchen",       num: "12", name: "Kitchen & Nutrition",       short: "Kitchen & Nutrition", category: "hospitality", blurb: "Menus, allergens, modified diets, plate-up sheets, weekly review against clinical needs." },
  { id: "housekeeping",  num: "13", name: "Housekeeping",              short: "Housekeeping",        category: "hospitality", blurb: "Rooms, common areas, deep cleans, infection-control rounds — scheduled, signed, audited." },
  { id: "qms",           num: "14", name: "Quality Management Engine", short: "QM Engine",           category: "operations",  blurb: "Policies, registers, risk, ISO alignment, POPIA — the living QMS, never the laminated one." },
  { id: "assets",        num: "15", name: "Asset Management",          short: "Assets",              category: "operations",  blurb: "Equipment lifecycle, service intervals, building compliance, capex pipeline." },
  { id: "hr",            num: "16", name: "HR & Workforce",            short: "HR & Workforce",      category: "operations",  blurb: "Rosters, credentialing, performance, succession — built for shift work and locum coverage." },
  { id: "finance",       num: "17", name: "Finance",                   short: "Finance",             category: "operations",  blurb: "Billing, debtors, levies, revenue oversight, board-grade financial reporting." },
  { id: "service-desk",  num: "18", name: "Service Desk",              short: "Service Desk",        category: "operations",  blurb: "Internal ticketing — maintenance, IT, family requests. SLAs, owners, closing times." },
  { id: "exec-command",  num: "19", name: "Executive Command",         short: "Executive Command",   category: "executive",   blurb: "The CEO's view — every site, every flag, every trend, in one calm screen." },
  { id: "exec-kpis",     num: "20", name: "Executive KPIs",            short: "Executive KPIs",      category: "executive",   blurb: "Board-ready KPIs across operations, governance, finance and resident experience." },
];

const MODULE_BY_ID = Object.fromEntries(MODULES.map((m) => [m.id, m]));

const SEGMENTS = [
  { id: "villages", name: "Retirement Villages", blurb: "Governance, facilities, resident services, and the executive view across all of them.", label: "ESTATE / RESIDENCES" },
  { id: "groups",   name: "Senior Living Groups", blurb: "Multi-village roll-up, brand-consistent resident experience at scale.", label: "GROUP / MULTI-VILLAGE" },
  { id: "care",     name: "Residential Care",    blurb: "Medication, incidents, clinical handover, regulator-ready governance.", label: "CLINICAL / CARE" },
  { id: "multisite",name: "Multi-Site Operators",blurb: "Group-wide visibility, federated reporting, board-ready KPIs.", label: "FEDERATED / OPS" },
];

const VILLAGES = [
  { name: "Stillwater Estate",   meta: "WESTERN CAPE · 412 RESIDENTS", governance: 96, incidents: 3, medication: 99.4, training: 91 },
  { name: "Oakridge Village",    meta: "GAUTENG · 287 RESIDENTS",     governance: 88, incidents: 7, medication: 97.1, training: 84 },
  { name: "The Cedar Residence", meta: "KZN · 198 RESIDENTS",         governance: 92, incidents: 2, medication: 99.8, training: 95 },
  { name: "Highveld Gardens",    meta: "GAUTENG · 156 RESIDENTS",     governance: 79, incidents: 5, medication: 96.3, training: 73 },
];

// ===========================================================
// LOGO + EMBLEM SVG
// ===========================================================
function LogoGlyph({ size = 26 }) {
  // Simple geometric stand-in for the emblem (interlocked cross)
  return (
    <svg className="logo-glyph" width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 6 h6 v5 h5 v6 h-5 v5 h-6 v-5 h-5 v-6 h5 z" stroke="#0F2547" />
      <path d="M15 10 h6 v5 h5 v6 h-5 v5 h-6 v-5 h-5 v-6 h5 z" stroke="#C99A4E" opacity="0.95" />
    </svg>
  );
}

// ===========================================================
// REVEAL ON SCROLL
// ===========================================================
function Reveal({ children, delay = 0, as: As = "div", className = "" }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <As
      ref={ref}
      className={`reveal ${vis ? "in" : ""} ${className}`}
      style={{ transitionDelay: vis ? `${delay}ms` : "0ms" }}
    >
      {children}
    </As>
  );
}

// ===========================================================
// NAV
// ===========================================================
function Nav({ route, navigate }) {
  const [open, setOpen] = useState(null); // "platform" | "solutions" | "serve" | null
  const closeTimer = useRef(null);

  const enter = (key) => {
    clearTimeout(closeTimer.current);
    setOpen(key);
  };
  const leave = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 160);
  };

  const go = (r, payload) => { setOpen(null); navigate(r, payload); };

  return (
    <header className="nav" onMouseLeave={leave}>
      <div className="nav-inner">
        <button className="logo" onClick={() => go("home")} aria-label="HealthPrac home">
          <LogoGlyph />
          <span>HealthPrac</span>
        </button>

        <nav className="nav-items">
          <button
            className={`nav-item ${route === "platform" ? "active" : ""}`}
            onMouseEnter={() => enter("platform")}
            onClick={() => go("platform")}
          >Platform <span className="caret">▾</span></button>

          <button
            className={`nav-item ${route === "module" ? "active" : ""}`}
            onMouseEnter={() => enter("solutions")}
            onClick={() => go("module", { id: "mar" })}
          >Solutions <span className="caret">▾</span></button>

          <button
            className={`nav-item ${route === "serve" ? "active" : ""}`}
            onMouseEnter={() => enter("serve")}
            onClick={() => go("serve")}
          >Who We Serve <span className="caret">▾</span></button>

          <button
            className={`nav-item ${route === "why" ? "active" : ""}`}
            onMouseEnter={() => enter(null)}
            onClick={() => go("why")}
          >Why HPS</button>

          <button
            className={`nav-item ${route === "about" ? "active" : ""}`}
            onMouseEnter={() => enter(null)}
            onClick={() => go("about")}
          >About</button>
        </nav>

        <div className="nav-cta">
          <button className="nav-signin">Sign in</button>
          <button className="btn primary" onClick={() => go("call")}>
            Book a call to explore <span className="arrow">→</span>
          </button>
        </div>
      </div>

      {/* Platform dropdown */}
      <div
        className={`dropdown ${open === "platform" ? "open" : ""}`}
        onMouseEnter={() => enter("platform")}
        onMouseLeave={leave}
      >
        <div className="dropdown-inner">
          <div>
            <div className="dropdown-eyebrow">The Platform</div>
            <h3 className="dropdown-title">One platform.<br /><em>Designed together.</em></h3>
            <p className="dropdown-desc">A single, calm interface for everything that matters in a care environment — built for executives and operations leads, not just specialists.</p>
          </div>
          <div className="dropdown-grid">
            <button className="dd-item" onClick={() => go("platform")}>
              <span className="num">01</span>
              <span>
                <span className="name">Platform overview</span>
                <span className="blurb">Philosophy, architecture, and how the modules sit together.</span>
              </span>
            </button>
            <button className="dd-item" onClick={() => go("platform", { anchor: "partnership" })}>
              <span className="num">02</span>
              <span>
                <span className="name">Human partnership</span>
                <span className="blurb">Implementation, operational improvement, executive sounding-board.</span>
              </span>
            </button>
            <button className="dd-item" onClick={() => go("platform", { anchor: "security" })}>
              <span className="num">03</span>
              <span>
                <span className="name">Security</span>
                <span className="blurb">POPIA, data residency, encryption, RBAC, audit log.</span>
              </span>
            </button>
            <button className="dd-item" onClick={() => go("platform", { anchor: "tour" })}>
              <span className="num">04</span>
              <span>
                <span className="name">Take the tour</span>
                <span className="blurb">A 60-second walkthrough of the executive dashboard.</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Solutions mega-menu */}
      <div
        className={`dropdown mega ${open === "solutions" ? "open" : ""}`}
        onMouseEnter={() => enter("solutions")}
        onMouseLeave={leave}
      >
        <div className="dropdown-inner">
          <div className="mega-head">
            <h3 className="title">Twenty modules.<br/><em>Six categories. One record.</em></h3>
            <p className="desc">Each module works on its own. They were designed together — one data model, one identity layer, one audit log. Click any module to read its deep-dive.</p>
          </div>
          <div className="mega-cats">
            {CATEGORIES.map((c) => (
              <div className="mega-cat" key={c.id}>
                <div className="cat-label">{c.name}</div>
                <ul>
                  {c.moduleIds.map((mid) => {
                    const m = MODULE_BY_ID[mid];
                    return (
                      <li key={mid} onClick={() => go("module", { id: mid })}>{m.name}</li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Who We Serve dropdown */}
      <div
        className={`dropdown ${open === "serve" ? "open" : ""}`}
        onMouseEnter={() => enter("serve")}
        onMouseLeave={leave}
      >
        <div className="dropdown-inner">
          <div>
            <div className="dropdown-eyebrow">Who We Serve</div>
            <h3 className="dropdown-title">Premium operators<br/><em>of premium environments.</em></h3>
            <p className="dropdown-desc">Same platform, different lens — the parts that matter to each kind of operation.</p>
          </div>
          <div className="dropdown-grid">
            {SEGMENTS.map((s, i) => (
              <button key={s.id} className="dd-item" onClick={() => go("serve", { id: s.id })}>
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="name">{s.name}</span>
                  <span className="blurb">{s.blurb}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

// ===========================================================
// PRODUCT UI MOCK — executive dashboard
// ===========================================================
function ProductMock({ initialVillage = 0, facilityName = "Jolly Oaks Senior Living" }) {
  const [sel, setSel] = useState(initialVillage);
  const [tab, setTab] = useState("overview");
  const v = VILLAGES[sel];
  const yr = new Date().getFullYear();

  return (
    <div className="product-frame">
      <div className="product-screen">
        <div className="product-titlebar">
          <div className="dots"><i /><i /><i /></div>
          <div className="url">app.healthprac.com · {facilityName.toLowerCase().replace(/\s+/g, "-")} / executive</div>
        </div>
        <div className="product-body">
          <aside className="product-sidebar">
            <div className="brand">
              <div className="brand-mark">HP</div>
              <div className="brand-name">HealthPrac</div>
            </div>
            <div className="group-label">Operate</div>
            <div className="nav-link active">Executive view <span className="count">4</span></div>
            <div className="nav-link">Facility Home <span className="count">17</span></div>
            <div className="nav-link">Residents <span className="count">412</span></div>
            <div className="group-label">Care</div>
            <div className="nav-link">Care Plans</div>
            <div className="nav-link">Medication MAR <span className="count">12</span></div>
            <div className="nav-link">Observations</div>
            <div className="group-label">Operations</div>
            <div className="nav-link">QM Engine <span className="count">96%</span></div>
            <div className="nav-link">HR &amp; Workforce</div>
            <div className="nav-link">Finance</div>

            <div className="user-chip">
              <div className="avatar">LJ</div>
              <div>
                <div className="user-name">Liezl Joubert</div>
                <div className="user-role">Admin</div>
              </div>
            </div>
            <div className="powered">Powered by <em>HealthPrac Solutions</em></div>
          </aside>

          <main className="product-main">
            <div className="product-header">
              <div>
                <div className="product-eyebrow">Executive · Across {VILLAGES.length} villages</div>
                <div className="product-h">{facilityName} · <em>Q3 2026.</em></div>
              </div>
              <div className="product-tabs">
                <span className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}>Overview</span>
                <span className={tab === "compliance" ? "active" : ""} onClick={() => setTab("compliance")}>Compliance</span>
                <span className={tab === "care" ? "active" : ""} onClick={() => setTab("care")}>Care</span>
              </div>
            </div>

            <div className="village-grid">
              {VILLAGES.map((vil, i) => (
                <div
                  key={vil.name}
                  className={`village-card ${sel === i ? "selected" : ""}`}
                  onClick={() => setSel(i)}
                >
                  <div className="village-name">{vil.name}</div>
                  <div className="village-meta">{vil.meta}</div>
                  <div className="village-stats">
                    <div className={`village-stat ${vil.governance < 85 ? "warn" : ""}`}>
                      <span className="v">{vil.governance}%</span>
                      GOV
                    </div>
                    <div className={`village-stat ${vil.incidents > 4 ? "warn" : ""}`}>
                      <span className="v">{vil.incidents}</span>
                      INC
                    </div>
                    <div className="village-stat">
                      <span className="v">{vil.medication}</span>
                      MED
                    </div>
                    <div className={`village-stat ${vil.training < 80 ? "bad" : vil.training < 90 ? "warn" : ""}`}>
                      <span className="v">{vil.training}%</span>
                      TRG
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="product-detail">
              <div className="detail-section">
                <div className="label">{v.name} · Open Items</div>
                <div className="row"><span>POPIA training expiries (30d)</span><span className={`v ${v.training < 90 ? "warn" : "green"}`}>{Math.round((100 - v.training) * 0.4)}</span></div>
                <div className="row"><span>Open incidents</span><span className={`v ${v.incidents > 4 ? "bad" : "green"}`}>{v.incidents}</span></div>
                <div className="row"><span>Controlled meds variance</span><span className="v green">0</span></div>
                <div className="row"><span>Maintenance &gt; SLA</span><span className="v warn">2</span></div>
                <div className="row"><span>Family enquiries (24h)</span><span className="v">14</span></div>
              </div>
              <div className="detail-section">
                <div className="label">Governance · last 7 days</div>
                <div className="row"><span>Policies acknowledged</span><span className="v green">312 / 318</span></div>
                <div className="row"><span>Audit binder freshness</span><span className="v green">Live</span></div>
                <div className="row"><span>Risk register reviews</span><span className="v">On schedule</span></div>
                <div className="row"><span>Sub-processor disclosures</span><span className="v">Current</span></div>
                <div className="row"><span>Board pack · auto-generated</span><span className="v warn">Draft Q3</span></div>
              </div>
            </div>
          </main>
        </div>
        <div className="product-footer">
          <div>© {yr} HealthPrac Solutions. All Rights Reserved.</div>
          <div>Powered by <em>HealthPrac Solutions</em>.</div>
        </div>
      </div>
    </div>
  );
}

// ===========================================================
// FOOTER
// ===========================================================
function Footer({ navigate }) {
  const yr = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="mark"><LogoGlyph size={28} /> HealthPrac</div>
            <p>The operating system for senior living and care. Built by operators, for operators. Software-first; partnership where it matters.</p>
            <button className="btn gold" onClick={() => navigate("call")}>Book a call to explore <span className="arrow">→</span></button>
          </div>
          <div className="footer-col">
            <h5>Platform</h5>
            <ul>
              <li><a onClick={() => navigate("platform")}>Overview</a></li>
              <li><a onClick={() => navigate("platform")}>Partnership</a></li>
              <li><a onClick={() => navigate("platform")}>Security</a></li>
              <li><a onClick={() => navigate("platform")}>Integrations</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Platform Map</h5>
            <ul>
              {CATEGORIES.map((c) => (
                <li key={c.id}><a onClick={() => navigate("module", { id: c.moduleIds[0] })}>{c.name}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h5>Who We Serve</h5>
            <ul>
              {SEGMENTS.map((s) => (
                <li key={s.id}><a onClick={() => navigate("serve", { id: s.id })}>{s.name}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <ul>
              <li><a onClick={() => navigate("why")}>Why HPS</a></li>
              <li><a onClick={() => navigate("about")}>About</a></li>
              <li><a>Careers</a></li>
              <li><a>Press</a></li>
              <li><a>Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-legal">
          <div>© {yr} HealthPrac Solutions. All Rights Reserved. · Reg No. 2026/147357/07</div>
          <div>Powered by HPS · POPIA · Terms · DPA · Sub-processors</div>
        </div>
      </div>
    </footer>
  );
}

// ===========================================================
// MOMENTS CAROUSEL — slow auto-rotating imagery band
// ===========================================================
const MOMENTS = [
  { id: "view",      caption: "Resident's view at golden hour",         hint: "Upmarket retirement residence · garden / ocean / mountain view at golden hour", src: "images/view-golden-hour.jpg" },
  { id: "lounge",    caption: "Quiet lounge, mid-morning sun",          hint: "Elegant lounge interior · warm natural light · two happy residents reading / chatting", src: "images/lounge-morning.jpg" },
  { id: "care",      caption: "A nurse, a hand, the time it deserves",  hint: "Nurse seated beside elderly resident · holding hand · warm, compassionate, candid", src: "images/care-garden-walk.jpg" },
  { id: "garden",    caption: "Afternoon in the garden",                hint: "Couple of residents walking with carer in landscaped garden · sunshine · greenery", src: "images/garden-afternoon.jpg" },
  { id: "family",    caption: "Visiting day, calm reception",           hint: "Family visiting elderly resident · multi-generational · smiling · sunny lounge", src: "images/family-day.jpg" },
];

function MomentsCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = MOMENTS.length;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 7000);
    return () => clearInterval(t);
  }, [paused, n]);

  return (
    <section
      className="moments"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="moments-stage">
        {MOMENTS.map((m, idx) => (
          <div key={m.id} className={`moments-slide ${idx === i ? "on" : ""}`} aria-hidden={idx !== i}>
            <image-slot
              id={`moment-${m.id}`}
              shape="rect"
              placeholder={m.hint}
              src={m.src}
              style={{ width: "100%", height: "100%", display: "block" }}
            ></image-slot>
          </div>
        ))}
        <div className="moments-frame" aria-hidden="true"></div>
      </div>

      <div className="moments-foot">
        <div className="moments-caption">
          {MOMENTS.map((m, idx) => (
            <span key={m.id} className={`mc-line ${idx === i ? "on" : ""}`}>{m.caption}</span>
          ))}
        </div>
        <div className="moments-controls">
          <button
            type="button"
            className="mc-btn"
            aria-label="Previous"
            onClick={() => setI((x) => (x - 1 + n) % n)}
          >←</button>
          <div className="moments-dots" role="tablist">
            {MOMENTS.map((m, idx) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={idx === i}
                className={`mc-dot ${idx === i ? "on" : ""}`}
                onClick={() => setI(idx)}
                aria-label={`Slide ${idx + 1}`}
              ></button>
            ))}
          </div>
          <button
            type="button"
            className="mc-btn"
            aria-label="Next"
            onClick={() => setI((x) => (x + 1) % n)}
          >→</button>
        </div>
      </div>
    </section>
  );
}

// ===========================================================
// PROBLEM ACCORDION — twelve-systems pain points, expandable
// ===========================================================
const PROBLEM_ROWS = [
  {
    id: "governance",
    what: "Governance binder",
    where: "Shared drive",
    bad: false,
    body: "Policies, registers, ISO and POPIA evidence live in a folder nobody owns. The version on the wall is not the version in the drive. When an auditor asks, somebody spends a weekend reconstructing what good already looked like.",
    fix: "Replaced by the Quality Management Engine — a living QMS where every policy, register and control has an owner, a review cadence, and a date. Evidence is captured as the work happens, not the night before the audit.",
    modules: [{ id: "qms", name: "Quality Management Engine" }],
  },
  {
    id: "medication",
    what: "Medication records",
    where: "Vendor A",
    bad: false,
    body: "A standalone eMAR that doesn't talk to the care record. Controlled substances are witnessed on paper. Pharmacy reconciliation lands by email. Adverse events live in a separate spreadsheet that nobody links back to the resident.",
    fix: "Replaced by Medication MAR — controlled-substance witness flow, pharmacy reconciliation, refusal codes, and adverse-event linkage all sitting on the same resident record as Care Plans and Observations.",
    modules: [{ id: "mar", name: "Medication MAR" }],
  },
  {
    id: "incidents",
    what: "Incidents & falls",
    where: "Three places",
    bad: true,
    body: "Reported on a paper form at handover, retyped into a clinical system the next morning, then summarised in a board report a week later. Trends sit in nobody's eye-line. The same resident falls twice before the pattern is noticed.",
    fix: "Replaced by Observations + Care Plans — vitals, behaviour, falls and adverse events trended on one record, with named owners, routed escalation and regulator-ready documentation written as it happens.",
    modules: [
      { id: "observations", name: "Observations" },
      { id: "care-plans", name: "Care Plans" },
    ],
  },
  {
    id: "rosters",
    what: "Rosters & locum cover",
    where: "WhatsApp",
    bad: true,
    body: "Shift swaps and locum cover negotiated in a group chat at 22:00. No audit trail of who agreed to cover what. Credentialing checks happen — or don't — in a different system entirely. The roster on the fridge is already out of date.",
    fix: "Replaced by HR & Workforce — rosters, swaps, credentialing and locum cover in one place, built for shift work. Every change is logged. Every clinician is verified before they start.",
    modules: [{ id: "hr", name: "HR & Workforce" }],
  },
  {
    id: "training",
    what: "Training expiries",
    where: "Spreadsheet",
    bad: false,
    body: "A workbook that somebody updates when they remember. CPR cards lapsed three months ago and nobody noticed until the inspector pointed at it. The spreadsheet is the system, and the spreadsheet is wrong.",
    fix: "Replaced by HR & Workforce — credentialing with expiry dates, automatic reminders, blocked rostering when a clinician is out of date, and an audit trail the regulator can read directly.",
    modules: [{ id: "hr", name: "HR & Workforce" }],
  },
  {
    id: "family",
    what: "Family communication",
    where: "Phone, untracked",
    bad: true,
    body: "Daughters and sons phone reception, get routed to the floor, and a nurse takes a message on a sticky note. The same family asks the same question three times because nobody can see what has already been said. Reassurance becomes a phone queue.",
    fix: "Replaced by the Family Portal — a calm, branded family app: resident status, billing, events, menus, request centre, surveys, important contacts. Families stay up to date and the floor stays focused on care.",
    modules: [{ id: "family-portal", name: "Family Portal" }],
  },
  {
    id: "maintenance",
    what: "Maintenance jobs",
    where: "Clipboard",
    bad: false,
    body: "A request is written on a clipboard at reception. The maintenance lead reads it on his round, or doesn't. There is no SLA, no owner after he goes home, and no record of which equipment has been touched, by whom, when.",
    fix: "Replaced by the Service Desk + Asset Management — ticketed requests with owners and SLAs, linked to the equipment register: service intervals, building compliance, capex pipeline, all on one record.",
    modules: [
      { id: "service-desk", name: "Service Desk" },
      { id: "assets", name: "Asset Management" },
    ],
  },
  {
    id: "kpis",
    what: "Board KPIs",
    where: "Reconciled Sunday night",
    bad: true,
    body: "Finance, care and operations each export their own numbers, somebody reconciles them in a workbook on Sunday, and the board pack lands on Monday morning describing a reality that is already three days old. Decisions are made on stale data.",
    fix: "Replaced by Executive Command + Executive KPIs — every site, every flag, every trend in one calm screen. Board-ready KPIs across operations, governance, finance and resident experience, live and reconciled by the platform itself.",
    modules: [
      { id: "exec-command", name: "Executive Command" },
      { id: "exec-kpis", name: "Executive KPIs" },
    ],
  },
];

function ProblemAccordion({ navigate }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="problem-list problem-accordion">
      {PROBLEM_ROWS.map((r) => {
        const isOpen = open === r.id;
        return (
          <div key={r.id} className={`problem-row acc-row ${isOpen ? "open" : ""}`}>
            <button
              type="button"
              className="acc-head"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : r.id)}
            >
              <span className="what">{r.what}</span>
              <span className="acc-caret" aria-hidden="true">{isOpen ? "−" : "+"}</span>
            </button>
            <div className="acc-body" hidden={!isOpen}>
              <p className="acc-now">{r.body}</p>
              <p className="acc-fix">{r.fix}</p>
              <div className="acc-modules">
                {r.modules.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className="acc-module"
                    onClick={() => navigate && navigate("module", { id: m.id })}
                  >
                    {m.name} <span className="arrow">→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ===========================================================
// HOME PAGE
// ===========================================================
function HomePage({ navigate }) {
  return (
    <main className="page">
      {/* HERO */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <Reveal>
                <div className="eyebrow">Senior Living &amp; Care Operating System</div>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="display hero-h1">
                  The <em>operating system</em> for senior living &amp; care.
                </h1>
              </Reveal>
              <Reveal delay={180}>
                <p className="lede hero-sub">
                  One elegant platform for governance, medication, workforce, training, incidents, assets, facilities, and executive oversight — embedded by people who have run care environments themselves.
                </p>
              </Reveal>
              <Reveal delay={260}>
                <div className="hero-ctas">
                  <button className="btn primary" onClick={() => navigate("call")}>
                    Book a call to explore <span className="arrow">→</span>
                  </button>
                  <button className="btn secondary" onClick={() => navigate("platform")}>
                    Explore the Platform
                  </button>
                </div>
              </Reveal>
              <Reveal delay={340}>
                <div className="hero-meta">
                  <div className="item">Modules<strong>Twenty across six categories</strong></div>
                  <div className="item">Implementation<strong>4–6 weeks</strong></div>
                  <div className="item">Combined Leadership<strong>72 years</strong></div>
                </div>
              </Reveal>
            </div>
            <Reveal delay={120}>
              <ProductMock />
            </Reveal>
          </div>
        </div>
      </section>

      {/* PROOF STRIP */}
      <div className="proof">
        <div className="wrap">
          <div className="proof-row">
            <span className="label">Chosen by operators of</span>
            <span>Retirement Villages</span>
            <span>Senior Living Groups</span>
            <span>Residential Care</span>
            <span>Multi-Site Operations</span>
          </div>
        </div>
      </div>

      {/* MOMENTS — slow image carousel */}
      <MomentsCarousel />

      {/* PROBLEM */}
      <section className="block">
        <div className="wrap">
          <Reveal>
            <div className="problem-card">
              <div className="eyebrow">The Problem</div>
              <div className="problem-grid">
                <div>
                  <h2 className="problem-h">Twelve systems.<br/><em>No single source of truth.</em></h2>
                  <p className="body-l" style={{ marginTop: 20, maxWidth: "44ch" }}>
                    It works on the days nothing goes wrong. Then a resident has an event, a regulator arrives, or quality drifts in a way nobody saw coming — and the board has to be reassured from memory.
                  </p>
                  <p className="body-l" style={{ marginTop: 14, color: "var(--forest)", fontWeight: 500 }}>
                    HealthPrac replaces all of it — with an interface your executives actually want to use.
                  </p>
                </div>
                <ProblemAccordion navigate={navigate} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PLATFORM OVERVIEW band */}
      <section className="block tight" style={{ background: "var(--linen)", borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}>
        <div className="wrap">
          <Reveal>
            <div className="section-head" style={{ marginBottom: 32 }}>
              <div>
                <div className="eyebrow">The Platform</div>
                <h2>One platform.<br/><em>The way your operation should already feel.</em></h2>
              </div>
              <p className="body-l" style={{ maxWidth: "48ch" }}>
                A single, calm interface for everything that matters: care, compliance, people, places, and the numbers underneath. One identity layer. One audit log. One reporting surface — across every village, every site.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <ProductMock initialVillage={1} />
          </Reveal>
        </div>
      </section>

      {/* MODULES — grouped by category */}
      <section className="block">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <div>
                <div className="eyebrow">The Platform Map</div>
                <h2>Twenty modules.<br/><em>Six categories.</em><br/>One system of record.</h2>
              </div>
              <p className="body-l" style={{ maxWidth: "48ch" }}>
                Every layer of a care environment — from the gate to the boardroom — modelled, configured and connected on one platform. Click any module to read its deep-dive.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div className="cat-grid">
              {CATEGORIES.map((c) => (
                <div key={c.id} className="cat-card">
                  <div className="cat-head">
                    <span className="n">{c.num} · {c.em}</span>
                    <span className="c">{c.moduleIds.length} {c.moduleIds.length === 1 ? "module" : "modules"}</span>
                  </div>
                  <h3>{c.name}<em>.</em></h3>
                  <p className="blurb">{c.blurb}</p>
                  <ul className="cat-list">
                    {c.moduleIds.map((mid) => {
                      const m = MODULE_BY_ID[mid];
                      return (
                        <li key={mid} onClick={() => navigate("module", { id: mid })}>
                          <span className="name">{m.name}</span>
                          <span className="num">{m.num}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURED · FAMILY PORTAL */}
      <section className="block" style={{ background: "var(--linen)", borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}>
        <div className="wrap">
          <Reveal>
            <div className="fp-stage">
              <div className="fp-side">
                <div className="eyebrow">Featured Module · Family Portal</div>
                <h2 className="display">
                  The face of the facility<br/><em>to the family of the residence.</em>
                </h2>
                <p className="body-l" style={{ marginTop: 28, marginBottom: 24, maxWidth: "44ch" }}>
                  Branded for your residence. Mobile-first. Plain-language. Designed so families stay up to date — and feel reassured.
                </p>
                <p className="body-l" style={{ maxWidth: "44ch", marginBottom: 32 }}>
                  Seven calm screens: home, resident status, billing, events &amp; menu, request centre, surveys &amp; feedback, important contacts. The whole stakeholder layer of the platform, held to the standard your residents see at the front door.
                </p>
                <button className="btn primary" onClick={() => navigate("module", { id: "family-portal" })}>
                  Explore the Family Portal <span className="arrow">→</span>
                </button>
              </div>
              <FamilyPortalPreview />
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHY HPS */}
      <section className="block" style={{ background: "var(--linen)", borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}>
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <div>
                <div className="eyebrow">Why HealthPrac</div>
                <h2>Three reasons<br/>we tend to be <em>chosen.</em></h2>
              </div>
              <p className="body-l" style={{ maxWidth: "48ch" }}>
                Most operators do not need another point tool. They need a single operating system the whole organisation can run on — with people who have run organisations like theirs to make sure it lands well.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div className="why-grid">
              <div className="why-card">
                <div className="num">REASON · 01</div>
                <h3>Built for care, not retrofitted.</h3>
                <p>Every module starts from senior-living and complex-care realities — medication, falls, family communication, end-of-life governance — not from a generic ERP bent toward healthcare.</p>
              </div>
              <div className="why-card">
                <div className="num">REASON · 02</div>
                <h3>Embedded by partners, not flung over a wall.</h3>
                <p>Implementation is led by people who have run care environments. They sit in your operation, learn how you work, and configure the platform around it — not the other way around.</p>
              </div>
              <div className="why-card">
                <div className="num">REASON · 03</div>
                <h3>Premium by posture.</h3>
                <p>The interface, the documentation, and the partnership are held to the standard your residents see at the front door — software that an executive is comfortable showing the board.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PARTNERSHIP — dark band */}
      <section className="block dark">
        <div className="wrap">
          <Reveal>
            <div className="partnership">
              <div>
                <div className="eyebrow">Partnership</div>
                <h2 className="display" style={{ fontSize: "clamp(40px, 5vw, 64px)" }}>
                  The software is the platform.<br /><em>The partnership is what makes it stick.</em>
                </h2>
                <p className="body-l" style={{ marginTop: 28, maxWidth: "44ch" }}>
                  A small, senior team that has operated care environments — embedded for the work that matters: onboarding, configuration, the first year of operational improvement, and the boardroom conversations that go with all of it.
                </p>
                <div style={{ marginTop: 32 }}>
                  <button className="btn ghost-light" onClick={() => navigate("platform")}>How partnership works <span className="arrow">→</span></button>
                </div>
              </div>
              <ul className="partnership-list">
                <li>
                  <span className="num">01</span>
                  <div>
                    <h4>Implementation.</h4>
                    <p>Four to six weeks. The platform configured against your actual operating model, not a template. Trained, tested, signed off by your team — not ours.</p>
                  </div>
                </li>
                <li>
                  <span className="num">02</span>
                  <div>
                    <h4>Operational improvement.</h4>
                    <p>Quarterly reviews against the operational and governance metrics that matter. Improvement loops with named owners — not action items in a deck nobody opens.</p>
                  </div>
                </li>
                <li>
                  <span className="num">03</span>
                  <div>
                    <h4>Executive sounding-board.</h4>
                    <p>Confidential sessions with the operators on our team — for the strategic decisions a software vendor cannot help with: site expansion, leadership change, regulator concerns.</p>
                  </div>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section className="block">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <div>
                <div className="eyebrow">Built For</div>
                <h2>Premium operators<br/>of <em>premium environments.</em></h2>
              </div>
              <p className="body-l" style={{ maxWidth: "48ch" }}>
                A retirement village does not look like a residential care home. A multi-site senior-living group does not look like an independent estate. The platform is the same; the parts that matter to each are not.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div className="serve-grid">
              {SEGMENTS.map((s) => (
                <div key={s.id} className="serve-card" onClick={() => navigate("serve", { id: s.id })}>
                  <div className="img">{s.label}</div>
                  <h4>{s.name}</h4>
                  <p>{s.blurb}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* OPERATOR STORY */}
      <section className="block tight">
        <div className="wrap">
          <Reveal>
            <div className="story">
              <div>
                <div className="eyebrow">Operator · 01</div>
                <p className="quote">&ldquo;For the first time, the four villages look like one organisation in our board pack — not four sets of numbers we have to reconcile on a Sunday night.&rdquo;</p>
              </div>
              <div className="stats">
                <div className="stat"><div className="v">11 <em>wks</em></div><div className="k">To one operating picture</div></div>
                <div className="stat"><div className="v">4 → 1</div><div className="k">Reconciliations per month</div></div>
                <div className="stat"><div className="v">96<em>%</em></div><div className="k">Governance compliance</div></div>
                <div className="stat"><div className="v">0</div><div className="k">Spreadsheets running KPIs</div></div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* VALUES BAND */}
      <section className="block values-section">
        <div className="wrap">
          <Reveal>
            <div className="values-rule">
              <span className="values-mark" />
              <span className="values-label">Our Promise</span>
              <span className="values-mark" />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="display values-h">
              We handle the complexity.<br/><em>You handle the care.</em>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <div className="values-grid">
              <div>
                <div className="values-num">72</div>
                <div className="values-num-k">YEARS · COMBINED LEADERSHIP</div>
                <p className="values-p">
                  Across quality management, regulatory compliance, finance, operational performance, audit readiness, and multi-site governance.
                </p>
              </div>
              <div>
                <div className="values-num"><em>Bridge.</em></div>
                <div className="values-num-k">OVERSIGHT × EXECUTION</div>
                <p className="values-p">
                  We bridge strategic oversight and frontline execution — every solution we deliver is grounded in real-world implementation.
                </p>
              </div>
              <div>
                <div className="values-num">Day&nbsp;to&nbsp;<em>day.</em></div>
                <div className="values-num-k">MEASURABLE × SUSTAINABLE</div>
                <p className="values-p">
                  Outcomes that are measurable and sustainable — that work day to day, not just on paper.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="block dark close-cta">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow" style={{ justifyContent: "center", display: "inline-flex" }}>Where to Start</div>
            <h2>Operational clarity, for organisations where care must <em>be exceptional.</em></h2>
            <p className="body-l">
              A 45-minute exploratory call — we will listen to where your operation is, show you the platform against your actual workflows, and tell you honestly whether HealthPrac is the right partner for this stage of your organisation.
            </p>
            <div className="ctas">
              <button className="btn gold" onClick={() => navigate("call")}>Book a call to explore <span className="arrow">→</span></button>
              <button className="btn ghost-light">Download the Executive Brief</button>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

// ===========================================================
// PLATFORM PAGE
// ===========================================================
function PlatformPage({ navigate }) {
  return (
    <main className="page">
      <section className="block">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow">Platform</div>
            <h1 className="display" style={{ fontSize: "clamp(48px, 7vw, 96px)", maxWidth: "16ch" }}>
              One platform. Twenty modules.<br/><em>Six categories. Designed together.</em>
            </h1>
            <p className="lede" style={{ marginTop: 32, maxWidth: "44ch" }}>
              A single, calm interface for everything that matters in a care environment — built for executives and operations leads, not just specialists.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="block tight" style={{ background: "var(--linen)", borderTop: "1px solid var(--rule)" }}>
        <div className="wrap">
          <Reveal>
            <ProductMock initialVillage={0} />
          </Reveal>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <div>
                <div className="eyebrow">What Runs On It</div>
                <h2>The everyday operation,<br/><em>on one screen.</em></h2>
              </div>
              <p className="body-l" style={{ maxWidth: "48ch" }}>
                Four lenses on the same data — the executive view, the operations view, the care view, the governance view. Built to be opened in the morning and closed when it's been useful.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div className="why-grid">
              <div className="why-card"><div className="num">VIEW · 01</div><h3>Executive.</h3><p>Governance status, open incidents, medication alerts, workforce gaps, KPI trend — the view a CEO actually wants on a Monday morning.</p></div>
              <div className="why-card"><div className="num">VIEW · 02</div><h3>Operations.</h3><p>Today's workload across rosters, tickets, maintenance, training expiries, and resident requests — with named owners.</p></div>
              <div className="why-card"><div className="num">VIEW · 03</div><h3>Care.</h3><p>Medication, charts, incidents, care plans, family communication — written for the clinical team to actually use during a shift.</p></div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="block dark">
        <div className="wrap">
          <Reveal>
            <div className="partnership" id="partnership">
              <div>
                <div className="eyebrow">Partnership</div>
                <h2 className="display" style={{ fontSize: "clamp(40px, 5vw, 64px)" }}>
                  Software is the platform.<br/><em>Partnership is what lands it.</em>
                </h2>
                <p className="body-l" style={{ marginTop: 28, maxWidth: "44ch" }}>
                  HealthPrac is software-first. Implementation and operational improvement are how we make sure the software lands where it should — not a separate consultancy line of business pretending to be a product.
                </p>
              </div>
              <ul className="partnership-list">
                <li><span className="num">01</span><div><h4>Implementation.</h4><p>Four to six weeks. A senior team configures the platform against your actual operating model, migrates what's worth migrating, retires what isn't, trains the people who will use it.</p></div></li>
                <li><span className="num">02</span><div><h4>Operational improvement.</h4><p>Quarterly reviews against governance and operational metrics. Improvement loops with named owners.</p></div></li>
                <li><span className="num">03</span><div><h4>Executive sounding-board.</h4><p>Confidential sessions with the operators on our team — for the decisions a software vendor cannot help with.</p></div></li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="block close-cta dark">
        <div className="wrap">
          <Reveal>
            <h2>See the platform against <em>your operation.</em></h2>
            <p className="body-l">A 45-minute exploratory call — we'll show you the platform against your actual workflows.</p>
            <div className="ctas">
              <button className="btn gold" onClick={() => navigate("call")}>Book a call to explore <span className="arrow">→</span></button>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

// ===========================================================
// MODULE DEEP-DIVE PAGE
// ===========================================================
function ModulePage({ moduleId = "mar", navigate }) {
  const m = MODULES.find((x) => x.id === moduleId) || MODULE_BY_ID["mar"];
  const [tab, setTab] = useState("overview");

  // Per-module feature lists (Medication MAR shown rich; others use generic pattern)
  const features = {
    mar: [
      { id: "charts", h: "Charts & administration.", b: "eMAR-style charting, structured administration capture, refusal and omission codes, photographic confirmation where appropriate. Every dose has a person, a shift, and a time." },
      { id: "controlled", h: "Controlled substances.", b: "Witnessed administration, stock control, reconciliation cycles, regulator-ready evidence. Variance flags route to the named owner before the next handover." },
      { id: "reconcile", h: "Pharmacy reconciliation.", b: "Two-way reconciliation with your dispensing pharmacy. Discrepancies are surfaced at handover, not at month-end." },
      { id: "adverse", h: "Adverse events.", b: "Automatic linkage to the Incidents and Observations modules; root-cause workflow; regulator-ready documentation written as the work happens." },
    ],
    default: [
      { id: "core", h: "Built for care, not retrofitted.", b: `${m.name} starts from the realities of senior-living and complex-care operations — not from a generic system bent toward healthcare.` },
      { id: "data", h: "Shared data model.", b: "Records here are referenced everywhere they should be — care plans, incidents, governance evidence, board reporting. One change updates everywhere." },
      { id: "evidence", h: "Evidence as a side-effect.", b: "Doing the work in HealthPrac generates the audit evidence automatically. The binder updates as the team operates." },
    ],
  };
  const list = features[moduleId] || features.default;

  return (
    <main className="page">
      <section className="block tight">
        <div className="wrap">
          <Reveal>
            <div className="module-hero">
              <div>
                <div className="eyebrow">{CATEGORIES.find(c => c.id === m.category)?.name} · Module {m.num}</div>
                <h1 className="display" style={{ fontSize: "clamp(44px, 5.6vw, 80px)" }}>
                  {m.short}<em>.</em>
                </h1>
                <p className="lede" style={{ marginTop: 28, maxWidth: "32ch" }}>
                  {m.blurb}
                </p>
              </div>
              <div>
                <ProductMock initialVillage={2} />
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="chip-bar">
              {CATEGORIES.map((c) => (
                <div className="chip-row" key={c.id}>
                  <div className="group-label">{c.name}</div>
                  <div className="chips">
                    {c.moduleIds.map((mid) => {
                      const mm = MODULE_BY_ID[mid];
                      return (
                        <button
                          key={mid}
                          className={`chip ${mid === moduleId ? "active" : ""}`}
                          onClick={() => navigate("module", { id: mid })}
                        >
                          {mm.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="block tight">
        <div className="wrap">
          {list.map((f, i) => (
            <Reveal key={f.id}>
              <div className="feature-block">
                <div>
                  <div className="eyebrow">{String(i + 1).padStart(2, "0")} · Feature</div>
                  <h3 className="feature-h">{f.h.split(".")[0]}<em>.</em></h3>
                  <p className="body-l" style={{ maxWidth: "40ch" }}>{f.b}</p>
                </div>
                <div className="feature-screen">
                  <div className="head">
                    <div className="title">{f.h.split(".")[0]}</div>
                    <div className="badge">LIVE</div>
                  </div>
                  {i === 0 && (
                    <>
                      <div className="row"><span>Morning round · Wing B</span><span>06:42</span><span className="v green">38 / 38</span></div>
                      <div className="row"><span>Mid-day round · Wing A</span><span>12:08</span><span className="v green">42 / 42</span></div>
                      <div className="row"><span>Evening round · Wing B</span><span>18:14</span><span className="v warn">39 / 40</span></div>
                      <div className="row"><span>Refusal · R. Maharaj</span><span>18:14</span><span className="v">Coded</span></div>
                      <div className="row"><span>Night round · all</span><span>22:00</span><span className="v">Scheduled</span></div>
                    </>
                  )}
                  {i === 1 && (
                    <>
                      <div className="row"><span>Schedule 5 · Wing B</span><span>09:12</span><span className="v green">Witnessed</span></div>
                      <div className="row"><span>Stock variance · CD-04</span><span>—</span><span className="v green">0</span></div>
                      <div className="row"><span>Cycle reconciliation</span><span>Wk 12</span><span className="v green">Complete</span></div>
                      <div className="row"><span>Regulator export</span><span>Q3</span><span className="v warn">Draft</span></div>
                    </>
                  )}
                  {i === 2 && (
                    <>
                      <div className="row"><span>Pharmacy delivery · 2026-09-22</span><span>—</span><span className="v green">Reconciled</span></div>
                      <div className="row"><span>Variance · Atorvastatin 20</span><span>—</span><span className="v warn">2 packs</span></div>
                      <div className="row"><span>Returns · expiring</span><span>30d</span><span className="v">14 items</span></div>
                      <div className="row"><span>Next reconciliation</span><span>—</span><span className="v">2026-09-29</span></div>
                    </>
                  )}
                  {i === 3 && (
                    <>
                      <div className="row"><span>Adverse event · 2026-09-18</span><span>—</span><span className="v warn">Linked → INC-1142</span></div>
                      <div className="row"><span>Root-cause owner</span><span>—</span><span className="v">L. van Wyk</span></div>
                      <div className="row"><span>Family notification</span><span>—</span><span className="v green">Logged</span></div>
                      <div className="row"><span>Regulator-ready pack</span><span>—</span><span className="v green">Generated</span></div>
                    </>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="block dark close-cta">
        <div className="wrap">
          <Reveal>
            <h2>See {m.short.replace(".", "")} <em>against your operation.</em></h2>
            <p className="body-l">A 45-minute exploratory call — we'll show you the module against your actual workflows.</p>
            <div className="ctas">
              <button className="btn gold" onClick={() => navigate("call")}>Book a call to explore <span className="arrow">→</span></button>
              <button className="btn ghost-light" onClick={() => navigate("platform")}>See the platform</button>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

// ===========================================================
// FAMILY PORTAL — phone mock with 7 interactive screens
// ===========================================================
const FP_SCREENS = [
  { id: "home",     name: "Home",                desc: "A calm, branded welcome — today's highlights, quick actions, the sense that everything is in hand." },
  { id: "status",   name: "Resident Status",     desc: "How your loved one is today — comfort, mood, activity. In plain language. Never raw clinical data." },
  { id: "billing",  name: "Billing",             desc: "Current and past statements, payment status, and a one-tap way to raise a billing query." },
  { id: "events",   name: "Events & Menu",       desc: "What's happening at the residence this week. What's being served. When you might want to visit." },
  { id: "requests", name: "Request Centre",      desc: "Book a visit. Request a service. Track the status of every request, end to end." },
  { id: "surveys",  name: "Surveys & Feedback",  desc: "A short survey after a visit. A standing way to share what's working — and what isn't." },
  { id: "contacts", name: "Important Contacts",  desc: "Reception, care lead, site manager, after-hours emergency. One tap to dial." },
];

function HomeScreen() {
  return (
    <>
      <div><div className="phone-eyebrow">Good morning</div><h2 className="phone-h">A <em>quiet morning</em> for your father.</h2><p className="phone-sub">Last updated 09:14 from the morning care round.</p></div>
      <div className="phone-card">
        <span className="k">Today at the residence</span>
        <span className="v">Henry · <em>settled &amp; well</em></span>
        <p className="phone-sub" style={{ marginTop: 2 }}>Breakfast eaten in full · Morning walk in the gardens · Mood bright.</p>
      </div>
      <button className="phone-btn">Send a message</button>
      <button className="phone-btn outline">Book a visit</button>
      <div className="phone-card">
        <span className="k">From the care team</span>
        <p className="phone-sub">&ldquo;Settled night. Up early and pleased to see the gardens.&rdquo;</p>
        <span className="phone-sub" style={{ color: "var(--ink-3)", fontStyle: "italic" }}>Sr Joubert · 08:42</span>
      </div>
    </>
  );
}

function StatusScreen() {
  return (
    <>
      <div><div className="phone-eyebrow">Resident Status</div><h2 className="phone-h">Settled <em>and well.</em></h2><p className="phone-sub">Last care check · 08:42 · Sr Joubert</p></div>
      <div className="phone-card">
        <span className="k">Today's timeline</span>
        <div className="phone-row"><span className="label">Morning round</span><span className="pill green">Complete</span></div>
        <div className="phone-row"><span className="label">Breakfast</span><span className="pill green">Eaten in full</span></div>
        <div className="phone-row"><span className="label">Awake &amp; alert</span><span className="pill green">Settled</span></div>
        <div className="phone-row"><span className="label">Comfort &amp; rest</span><span className="pill green">Stable</span></div>
        <div className="phone-row"><span className="label">Activity</span><span className="pill green">Walk · gardens</span></div>
      </div>
      <div className="phone-card">
        <span className="k">Mood today</span>
        <span className="v"><em>Bright.</em></span>
      </div>
      <button className="phone-btn ghost">Read the care summary →</button>
    </>
  );
}

function BillingScreen() {
  return (
    <>
      <div><div className="phone-eyebrow">Billing</div><h2 className="phone-h">October <em>statement.</em></h2></div>
      <div className="phone-card">
        <span className="k">Current month</span>
        <span className="v"><em>R 28,450</em> · Paid</span>
        <p className="phone-sub" style={{ marginTop: 2 }}>Settled 02 October 2026 · Reference HPS-2610-114.</p>
      </div>
      <div className="phone-card">
        <span className="k">Past statements</span>
        <div className="phone-row"><span className="label">September 2026</span><span className="pill green">Paid</span></div>
        <div className="phone-row"><span className="label">August 2026</span><span className="pill green">Paid</span></div>
        <div className="phone-row"><span className="label">July 2026</span><span className="pill green">Paid</span></div>
      </div>
      <button className="phone-btn outline">Raise a billing query</button>
    </>
  );
}

function EventsScreen() {
  const days = [
    { d: "Monday",    a: "Yoga · 10AM",          m: "Roast chicken, herb butter" },
    { d: "Tuesday",   a: "Music recital · 4PM",  m: "Bobotie, yellow rice" },
    { d: "Wednesday", a: "Gardening club",       m: "Lamb stew, mash" },
    { d: "Thursday",  a: "Family tea · 3PM",     m: "Fish pie, greens" },
    { d: "Friday",    a: "Bingo · 2PM",          m: "Roast beef, potatoes" },
  ];
  return (
    <>
      <div><div className="phone-eyebrow">This Week</div><h2 className="phone-h">Events <em>&amp; menu.</em></h2></div>
      {days.map((d) => (
        <div key={d.d} className="phone-card">
          <span className="k">{d.d}</span>
          <span className="v">{d.a}</span>
          <p className="phone-sub" style={{ marginTop: 2 }}>Menu · {d.m}</p>
        </div>
      ))}
    </>
  );
}

function RequestsScreen() {
  return (
    <>
      <div><div className="phone-eyebrow">Request Centre</div><h2 className="phone-h">Your <em>open requests.</em></h2></div>
      <button className="phone-btn">+ Make a new request</button>
      <div className="phone-card">
        <span className="k">Open</span>
        <div className="phone-row"><span className="label">Visit · Fri 3PM</span><span className="pill green">Confirmed</span></div>
        <div className="phone-row"><span className="label">Linen change</span><span className="pill warn">Scheduled</span></div>
        <div className="phone-row"><span className="label">Hairdresser booking</span><span className="pill warn">Pending</span></div>
      </div>
      <div className="phone-card">
        <span className="k">Recently closed</span>
        <div className="phone-row"><span className="label">Handrail repair</span><span className="pill gray">Completed</span></div>
        <div className="phone-row"><span className="label">Wheelchair service</span><span className="pill gray">Completed</span></div>
      </div>
    </>
  );
}

function SurveysScreen() {
  const [picked, setPicked] = useState(null);
  return (
    <>
      <div><div className="phone-eyebrow">Survey</div><h2 className="phone-h">How was <em>your last visit?</em></h2><p className="phone-sub">Two minutes. It helps the team.</p></div>
      <button className={`phone-btn ${picked === "excellent" ? "" : "outline"}`} onClick={() => setPicked("excellent")}>Excellent</button>
      <button className={`phone-btn ${picked === "good" ? "" : "outline"}`} onClick={() => setPicked("good")}>Good</button>
      <button className={`phone-btn ${picked === "improve" ? "" : "outline"}`} onClick={() => setPicked("improve")}>Could be better</button>
      <div className="phone-card">
        <span className="k">Past feedback</span>
        <div className="phone-row"><span className="label">Family tea · Sep</span><span className="pill green">Shared</span></div>
        <div className="phone-row"><span className="label">Care quality · Aug</span><span className="pill green">Shared</span></div>
        <div className="phone-row"><span className="label">Welcome experience · Jun</span><span className="pill green">Shared</span></div>
      </div>
    </>
  );
}

function ContactsScreen() {
  return (
    <>
      <div><div className="phone-eyebrow">Important Contacts</div><h2 className="phone-h">One tap, <em>any hour.</em></h2></div>
      <div className="phone-card">
        <div className="phone-row"><span className="label">Reception</span><span className="pill gray">021 555 0184</span></div>
        <div className="phone-row"><span className="label">Care lead · Sr Joubert</span><span className="pill gray">021 555 0192</span></div>
        <div className="phone-row"><span className="label">Site manager · M. Pillay</span><span className="pill gray">021 555 0188</span></div>
        <div className="phone-row"><span className="label">After-hours · 24/7</span><span className="pill warn">060 555 0140</span></div>
      </div>
      <div className="phone-card">
        <span className="k">Email</span>
        <span className="v">cedar@residence.healthprac.com</span>
      </div>
    </>
  );
}

function Phone({ screenId, setScreen }) {
  const navItems = [
    { id: "home",     short: "home",     label: "Home"     },
    { id: "status",   short: "status",   label: "Status"   },
    { id: "requests", short: "requests", label: "Requests" },
    { id: "billing",  short: "billing",  label: "Billing"  },
    { id: "more",     short: "more",     label: "More"     },
  ];
  const activeBottom = ["events", "surveys", "contacts"].includes(screenId)
    ? "more"
    : screenId;

  return (
    <div className="phone">
      <div className="phone-screen">
        <div className="phone-status">
          <span>09:14</span>
          <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ letterSpacing: 0.08 }}>5G</span>
            <span style={{ fontSize: 10 }}>●●●●●</span>
            <span>96%</span>
          </span>
        </div>
        <div className="phone-header">
          <div>
            <div className="where">The Cedar Residence</div>
            <div className="who">Sarah Carter</div>
          </div>
          <div className="avatar">SC</div>
        </div>
        <div className="phone-body" key={screenId}>
          {screenId === "home" && <HomeScreen />}
          {screenId === "status" && <StatusScreen />}
          {screenId === "billing" && <BillingScreen />}
          {screenId === "events" && <EventsScreen />}
          {screenId === "requests" && <RequestsScreen />}
          {screenId === "surveys" && <SurveysScreen />}
          {screenId === "contacts" && <ContactsScreen />}
        </div>
        <div className="phone-nav">
          {navItems.map((n) => (
            <button
              key={n.id}
              className={`phone-nav-item ${activeBottom === n.id ? "active" : ""}`}
              onClick={() => setScreen(n.id === "more" ? "events" : n.id)}
            >
              <span className="glyph" />
              {n.label}
            </button>
          ))}
        </div>
        <div className="phone-footer">© 2026 The Cedar Residence · Powered by <em>HealthPrac</em></div>
      </div>
    </div>
  );
}

function FamilyPortalShowcase() {
  const [tab, setTab] = useState("home");
  const current = FP_SCREENS.find((s) => s.id === tab);
  return (
    <div className="fp-stage">
      <div className="fp-side">
        <div className="eyebrow">Showcase</div>
        <h3 className="display">
          {current.name}<em>.</em>
        </h3>
        <p className="body-l" style={{ marginTop: 24, marginBottom: 28, maxWidth: "40ch" }}>{current.desc}</p>
        <div className="mono-label" style={{ marginBottom: 12 }}>Switch screen</div>
        <div className="fp-tabs">
          {FP_SCREENS.map((s) => (
            <button key={s.id} className={`fp-tab ${tab === s.id ? "active" : ""}`} onClick={() => setTab(s.id)}>
              {s.name}
            </button>
          ))}
        </div>
      </div>
      <Phone screenId={tab} setScreen={setTab} />
    </div>
  );
}

// Standalone phone with internal screen state — for home-page preview
function FamilyPortalPreview() {
  const [screen, setScreen] = useState("home");
  return <Phone screenId={screen} setScreen={setScreen} />;
}

function FamilyPortalPage({ navigate }) {
  return (
    <main className="page">
      <section className="block">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow">Featured · Family Portal · Module 10</div>
            <h1 className="display" style={{ fontSize: "clamp(48px, 6.6vw, 112px)", maxWidth: "16ch" }}>
              Where families<br/><em>feel informed.</em>
            </h1>
            <p className="lede" style={{ marginTop: 36, maxWidth: "48ch" }}>
              A calm, branded family app — updates, requests, billing, events, feedback. Built so families see the right level of information, and feel reassured, without ever exposing what should stay inside the building.
            </p>
          </Reveal>
        </div>
      </section>

      {/* SHOWCASE */}
      <section className="block tight" style={{ background: "var(--linen)", borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}>
        <div className="wrap">
          <Reveal>
            <FamilyPortalShowcase />
          </Reveal>
        </div>
      </section>

      {/* PILLARS */}
      <section className="block">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <div>
                <div className="eyebrow">Four Principles</div>
                <h2>Premium. Mobile-first.<br/>Non-technical. <em>Governance-safe.</em></h2>
              </div>
              <p className="body-l" style={{ maxWidth: "48ch" }}>
                The Family Portal sits inside HealthPrac as a pillar of family engagement — alongside resident management, care governance, hospitality, operations, and executive visibility. It is the one part of the platform a non-employee will ever see, and it is held to a different standard because of that.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div className="fp-pillars">
              <div className="fp-pillar">
                <div className="num">PRINCIPLE · 01</div>
                <h4>Mobile-first.</h4>
                <p>Designed for the phone in a family member's hand on a Sunday afternoon, not the desktop in an office. Every screen built for one thumb.</p>
              </div>
              <div className="fp-pillar">
                <div className="num">PRINCIPLE · 02</div>
                <h4>Non-technical.</h4>
                <p>Calm, plain-language interface for any age and any literacy level. No manuals, no training, no help desk to call.</p>
              </div>
              <div className="fp-pillar">
                <div className="num">PRINCIPLE · 03</div>
                <h4>Premium &amp; reassuring.</h4>
                <p>The same brand standard as the residence itself. Clean, restful, warm — the way a family wants to feel after opening the app.</p>
              </div>
              <div className="fp-pillar">
                <div className="num">PRINCIPLE · 04</div>
                <h4>Governance-safe.</h4>
                <p>Families see the right level of information. Clinical records, staff actions, and internal systems stay inside HealthPrac — never exposed by accident.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SCREENS GRID */}
      <section className="block" style={{ background: "var(--linen)", borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}>
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <div>
                <div className="eyebrow">The Family Sees</div>
                <h2>Seven calm screens.<br/><em>Everything they need.</em> Nothing they shouldn't.</h2>
              </div>
              <p className="body-l" style={{ maxWidth: "48ch" }}>
                Each screen designed to answer one specific question a family member arrives with, in under five seconds. Click any to see it in the phone above.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div className="fp-screens">
              {FP_SCREENS.map((s, i) => (
                <div key={s.id} className="fp-screen-card" onClick={() => {
                  document.querySelector(".fp-stage")?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}>
                  <span className="n">SCREEN · {String(i + 1).padStart(2, "0")}</span>
                  <h4>{s.name}<em>.</em></h4>
                  <p>{s.desc}</p>
                </div>
              ))}
              <div className="fp-screen-card sister" onClick={() => navigate("module", { id: "doctor-portal" })}>
                <span className="n">SISTER · DOCTOR PORTAL</span>
                <h4>Doctor Portal<em>.</em></h4>
                <p>A focused interface for visiting and resident doctors — patient list, charts, scripts, notes, signatures, in and out in minutes.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* GOVERNANCE NOTE */}
      <section className="block dark">
        <div className="wrap">
          <Reveal>
            <div className="partnership">
              <div>
                <div className="eyebrow">Governance Note</div>
                <h2 className="display" style={{ fontSize: "clamp(40px, 5vw, 64px)" }}>
                  What the family sees is <em>not</em> what the building sees.
                </h2>
                <p className="body-l" style={{ marginTop: 28, maxWidth: "44ch" }}>
                  Every Family Portal screen reads from the same data your care team writes to — but the surfacing is curated. Vital signs are not shown. Incident detail is not shown. Staff names appear only where appropriate. The result: families informed and reassured; clinicians and operators protected.
                </p>
              </div>
              <ul className="partnership-list">
                <li><span className="num">01</span><div><h4>Curated surfacing.</h4><p>Calm status labels (&ldquo;settled and well&rdquo;), not raw clinical data. The translation layer lives inside HealthPrac.</p></div></li>
                <li><span className="num">02</span><div><h4>Family-level RBAC.</h4><p>Each family member sees only their resident. POPIA-compliant by design.</p></div></li>
                <li><span className="num">03</span><div><h4>Audit log.</h4><p>Every view, message, request, and survey is recorded — for compliance and for accountability.</p></div></li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="block dark close-cta">
        <div className="wrap">
          <Reveal>
            <h2>See the Family Portal<br/><em>branded for your residence.</em></h2>
            <p className="body-l">A 45-minute exploratory call — we'll walk you through the portal as your residents' families would see it. The brand, the tone, the boundary.</p>
            <div className="ctas">
              <button className="btn gold" onClick={() => navigate("call")}>Book a call to explore <span className="arrow">→</span></button>
              <button className="btn ghost-light" onClick={() => navigate("module", { id: "doctor-portal" })}>See the Doctor Portal</button>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

// ===========================================================
// WHO WE SERVE PAGE
// ===========================================================
function ServePage({ segmentId, navigate }) {
  const s = SEGMENTS.find((x) => x.id === segmentId) || SEGMENTS[0];
  return (
    <main className="page">
      <section className="block">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow">Who We Serve · {s.name}</div>
            <h1 className="display" style={{ fontSize: "clamp(44px, 6vw, 88px)", maxWidth: "16ch" }}>
              Built for the operational realities of <em>{s.name.toLowerCase()}.</em>
            </h1>
            <p className="lede" style={{ marginTop: 32, maxWidth: "44ch" }}>
              The platform is the same; the parts that matter to {s.name.toLowerCase()} are not.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="block tight" style={{ background: "var(--linen)", borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}>
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <div>
                <div className="eyebrow">What Changes On Day One</div>
                <h2>The operation,<br/><em>finally legible.</em></h2>
              </div>
              <p className="body-l" style={{ maxWidth: "48ch" }}>
                A short list of things that work differently within weeks of HealthPrac being in place — not what we hope for in a year.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div className="why-grid">
              <div className="why-card"><div className="num">01</div><h3>One source of truth.</h3><p>Care, governance, people, places — one record, one audit log, one reporting surface across every site.</p></div>
              <div className="why-card"><div className="num">02</div><h3>Family communication, traced.</h3><p>Every conversation is logged. Every concern has an owner and a closing time. Reception stops being the system of record.</p></div>
              <div className="why-card"><div className="num">03</div><h3>Board pack, on time.</h3><p>The KPIs your board wants are the platform's default view — not a custom build you have to commission.</p></div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <div>
                <div className="eyebrow">Other Operating Models</div>
                <h2>The platform,<br/><em>through other lenses.</em></h2>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div className="serve-grid">
              {SEGMENTS.filter((x) => x.id !== s.id).map((other) => (
                <div key={other.id} className="serve-card" onClick={() => navigate("serve", { id: other.id })}>
                  <div className="img">{other.label}</div>
                  <h4>{other.name}</h4>
                  <p>{other.blurb}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="block dark close-cta">
        <div className="wrap">
          <Reveal>
            <h2>See HealthPrac against <em>your operation.</em></h2>
            <div className="ctas">
              <button className="btn gold" onClick={() => navigate("call")}>Book a call to explore <span className="arrow">→</span></button>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

// ===========================================================
// WHY HPS PAGE
// ===========================================================
function WhyPage({ navigate }) {
  const reasons = [
    { h: "One system of record, not twelve.", b: "Care, compliance, people, places, and the numbers underneath share the same data model. No reconciliation. No spreadsheets to maintain. No \u201cwhich version is current?\u201d" },
    { h: "Built for care, not general business.", b: "The categories that matter in senior living — medication, incidents, family communication, end-of-life governance — are first-class objects, not bolt-ons." },
    { h: "Implemented by operators.", b: "Our implementation leads have run the kind of organisation you are running. They sit in your operation. They earn their fee in week one." },
    { h: "Strategic oversight, bridged to the floor.", b: "Over 72 years of combined leadership across quality management, regulatory compliance, finance, operational performance, audit readiness, and multi-site governance. Every solution we deliver is grounded in real-world implementation — measurable and sustainable." },
    { h: "Executive-grade out of the box.", b: "The reporting your board wants is the platform's default view — not a custom build you have to commission." },
    { h: "Outcomes that work day to day, not just on paper.", b: "Premium interface, premium documentation, premium partnership — held to the standard your residents see at the front door. Software an executive is comfortable showing the board." },
  ];
  return (
    <main className="page">
      <section className="block">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow">Why HealthPrac</div>
            <h1 className="display" style={{ fontSize: "clamp(48px, 6.4vw, 96px)", maxWidth: "18ch" }}>
              For boards and executives <em>who are tired of fragmentation.</em>
            </h1>
            <p className="lede" style={{ marginTop: 36, maxWidth: "44ch" }}>
              Most operators do not need another point tool. They need a single operating system the whole organisation can run on — with people who have run organisations like theirs to make it land well.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="block tight" style={{ background: "var(--linen)", borderTop: "1px solid var(--rule)" }}>
        <div className="wrap">
          {reasons.map((r, i) => (
            <Reveal key={i}>
              <div className="feature-block" style={{ borderTopColor: "var(--rule-2)" }}>
                <div>
                  <div className="eyebrow">{String(i + 1).padStart(2, "0")} · Reason</div>
                  <h3 className="feature-h">{r.h.split(",")[0].split(".")[0]}<em>.</em></h3>
                </div>
                <p className="body-l">{r.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="block dark close-cta">
        <div className="wrap">
          <Reveal>
            <h2>Worth a 45-minute<br/><em>conversation?</em></h2>
            <div className="ctas">
              <button className="btn gold" onClick={() => navigate("call")}>Book a call to explore <span className="arrow">→</span></button>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

// ===========================================================
// ABOUT PAGE
// ===========================================================
function AboutPage({ navigate }) {
  return (
    <main className="page">
      <section className="block">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow">About</div>
            <h1 className="display" style={{ fontSize: "clamp(48px, 6.4vw, 104px)", maxWidth: "14ch" }}>
              We handle the complexity.<br/><em>You handle the care.</em>
            </h1>
            <p className="lede" style={{ marginTop: 36, maxWidth: "46ch" }}>
              HealthPrac was founded by people who have managed multisite healthcare environments — from quality management to staffing — and have spent their careers needing a platform where all sites were visible on a single page.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="block tight" style={{ background: "var(--linen)", borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}>
        <div className="wrap" style={{ maxWidth: 880 }}>
          <Reveal>
            <div className="eyebrow">72 Years of Combined Leadership</div>
            <p className="body-l" style={{ fontSize: 20, color: "var(--ink)", lineHeight: 1.55 }}>
              Our team brings over <strong style={{ color: "var(--forest)", fontWeight: 600 }}>72 years of combined leadership experience</strong> in quality management, regulatory compliance, finance, operational performance, audit readiness, and multi-site governance.
            </p>
            <p className="body-l" style={{ fontSize: 19, color: "var(--ink-2)", marginTop: 24 }}>
              We bridge <strong style={{ color: "var(--forest)", fontWeight: 600 }}>strategic oversight</strong> and <strong style={{ color: "var(--forest)", fontWeight: 600 }}>frontline execution</strong> — ensuring every solution we deliver is grounded in real-world implementation.
            </p>
            <p className="lede" style={{ marginTop: 32, maxWidth: "48ch" }}>
              The result: outcomes that are not only measurable but sustainable — outcomes that work day to day, not just on paper.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="block tight">
        <div className="wrap" style={{ maxWidth: 880 }}>
          <Reveal>
            <div className="eyebrow">Why We Built This</div>
            <p className="body-l" style={{ fontSize: 18, color: "var(--ink-2)", lineHeight: 1.7 }}>
              The platform exists because we kept rebuilding the same systems for organisation after organisation. After the third or fourth time, we wrote it as software — and then assembled the partnership team that puts it to work in the kind of environment we came from.
            </p>
            <p className="body-l" style={{ fontSize: 18, color: "var(--ink-2)", marginTop: 20, lineHeight: 1.7 }}>
              We are deliberately small, deliberately senior, and deliberately patient about the operators we work with. HealthPrac is what we wish we had had, on the days the binder was empty and the regulator was already on the road.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="block dark close-cta">
        <div className="wrap">
          <Reveal>
            <h2>A 45-minute<br/><em>conversation, first.</em></h2>
            <div className="ctas">
              <button className="btn gold" onClick={() => navigate("call")}>Book a call to explore <span className="arrow">→</span></button>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

// ===========================================================
// BOOK-A-CALL FORM (multi-step + validation)
// ===========================================================
function StrategyCallPage({ navigate }) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState({
    name: "", email: "", role: "",
    org: "", segment: "", sites: "", currentSystems: "",
    focus: "", notes: "",
  });
  const [errs, setErrs] = useState({});

  const set = (k) => (e) => {
    const val = e && e.target ? e.target.value : e;
    setData((d) => ({ ...d, [k]: val }));
    if (errs[k]) setErrs((s) => ({ ...s, [k]: null }));
  };

  function validate(s) {
    const e = {};
    if (s === 0) {
      if (!data.name.trim()) e.name = "Required.";
      if (!data.email.trim()) e.email = "Required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Use a valid work email.";
      if (!data.role.trim()) e.role = "Required.";
    }
    if (s === 1) {
      if (!data.org.trim()) e.org = "Required.";
      if (!data.segment) e.segment = "Pick the closest match.";
      if (!data.sites) e.sites = "Required.";
    }
    if (s === 2) {
      if (!data.focus) e.focus = "Pick one to focus on.";
    }
    setErrs(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validate(step)) setStep((s) => Math.min(s + 1, 3));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }
  function submit() {
    if (validate(2)) {
      setSubmitted(true);
      setStep(3);
    }
  }

  const stepNames = ["About you", "Your operation", "What to focus on", "Review"];

  return (
    <main className="page form-page">
      <div className="wrap">
        <div className="form-shell">
          {/* Left rail */}
          <div className="form-side">
            <div className="eyebrow">Book a call to explore</div>
            <h1>A 45-minute conversation.<br/><em>Then we both decide.</em></h1>
            <p>You will speak to one of our partners. We listen to the operating model, the pressure points, and the board context. We show the platform against your actual workflows.</p>
            <ul>
              <li>One conversation, one decision — no follow-up sequences.</li>
              <li>If we're not the right partner, we say so on the call.</li>
              <li>Confidential under POPIA-compliant terms.</li>
            </ul>
          </div>

          {/* Form */}
          <div className="form-card">
            {!submitted && (
              <div className="form-steps">
                {stepNames.slice(0, 3).map((n, i) => (
                  <div key={n} className={`step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}>
                    <span className="n">{String(i + 1).padStart(2, "0")}</span>
                    <span>{n}</span>
                  </div>
                ))}
              </div>
            )}

            {step === 0 && (
              <>
                <h2 className="form-step-title">About you.</h2>
                <Field label="Your name" k="name" data={data} errs={errs} set={set} />
                <Field label="Work email" k="email" type="email" data={data} errs={errs} set={set} />
                <Field label="Your role" k="role" placeholder="CEO, COO, Operations Director, Board Member…" data={data} errs={errs} set={set} />
                <div className="form-actions">
                  <button className="form-back" disabled>← Back</button>
                  <button className="btn primary" onClick={next}>Continue <span className="arrow">→</span></button>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h2 className="form-step-title">Your operation.</h2>
                <Field label="Organisation" k="org" placeholder="e.g. Stillwater Living Group" data={data} errs={errs} set={set} />

                <div className="field">
                  <label>Closest match <span className="req">*</span></label>
                  <div className="radio-group">
                    {SEGMENTS.map((s) => (
                      <button
                        type="button"
                        key={s.id}
                        className={`radio-card ${data.segment === s.id ? "selected" : ""}`}
                        onClick={() => set("segment")(s.id)}
                      >
                        <span className="label">{s.name}</span>
                        <span className="sub">{s.label}</span>
                      </button>
                    ))}
                  </div>
                  {errs.segment && <span className="err">{errs.segment}</span>}
                </div>

                <div className="field">
                  <label>Number of sites <span className="req">*</span></label>
                  <div className="radio-group" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                    {["1", "2–4", "5–10", "10+"].map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        className={`radio-card ${data.sites === opt ? "selected" : ""}`}
                        onClick={() => set("sites")(opt)}
                        style={{ textAlign: "center" }}
                      >
                        <span className="label" style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 500 }}>{opt}</span>
                      </button>
                    ))}
                  </div>
                  {errs.sites && <span className="err">{errs.sites}</span>}
                </div>

                <Field label="Current systems (optional)" k="currentSystems" placeholder="e.g. GoodX, in-house spreadsheets, vendor X for medication…" data={data} errs={errs} set={set} optional />

                <div className="form-actions">
                  <button className="form-back" onClick={back}>← Back</button>
                  <button className="btn primary" onClick={next}>Continue <span className="arrow">→</span></button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="form-step-title">What to focus on.</h2>
                <p className="body-l" style={{ fontSize: 14, marginBottom: 24 }}>
                  Pick the one area you would most want us to walk you through. We'll cover the rest in the second half.
                </p>

                <div className="field">
                  <label>Focus area <span className="req">*</span></label>
                  <div className="radio-group">
                    {[
                      { id: "care",       label: "Care & medication", sub: "MAR · OBSERVATIONS · DEMENTIA" },
                      { id: "front",      label: "Front-of-house",    sub: "WELCOME · VISITORS · SECURITY" },
                      { id: "governance", label: "Governance & QMS",  sub: "POPIA · ISO · AUDIT" },
                      { id: "workforce",  label: "HR & workforce",    sub: "ROSTERS · CREDENTIALING" },
                      { id: "executive",  label: "Executive view",    sub: "COMMAND · KPIs · BOARD" },
                      { id: "platform",   label: "The whole platform", sub: "WALK-THROUGH" },
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.id}
                        className={`radio-card ${data.focus === opt.id ? "selected" : ""}`}
                        onClick={() => set("focus")(opt.id)}
                      >
                        <span className="label">{opt.label}</span>
                        <span className="sub">{opt.sub}</span>
                      </button>
                    ))}
                  </div>
                  {errs.focus && <span className="err">{errs.focus}</span>}
                </div>

                <div className="field">
                  <label>Anything else we should know (optional)</label>
                  <textarea
                    value={data.notes}
                    onChange={set("notes")}
                    placeholder="A regulator visit on the horizon? A site opening? The board asked a question you couldn't answer? Tell us in your own words."
                  />
                </div>

                <div className="form-actions">
                  <button className="form-back" onClick={back}>← Back</button>
                  <button className="btn primary" onClick={submit}>Review &amp; send <span className="arrow">→</span></button>
                </div>
              </>
            )}

            {step === 3 && submitted && (
              <div className="success">
                <div className="mark">✓</div>
                <h2><em>Thank you,</em> {data.name.split(" ")[0]}.</h2>
                <p>
                  We have your details. One of our partners will be in touch within one working day to confirm a time — usually the same week. The conversation is 45 minutes, by video or in person at our offices.
                </p>

                <div style={{ textAlign: "left", marginTop: 32, background: "var(--linen)", padding: 24, border: "1px solid var(--rule)" }}>
                  <div className="mono-label" style={{ marginBottom: 14 }}>What you sent</div>
                  <div className="review-list">
                    <div className="review-row"><span className="k">Name</span><span className="v">{data.name}</span></div>
                    <div className="review-row"><span className="k">Email</span><span className="v">{data.email}</span></div>
                    <div className="review-row"><span className="k">Role</span><span className="v">{data.role}</span></div>
                    <div className="review-row"><span className="k">Organisation</span><span className="v">{data.org}</span></div>
                    <div className="review-row"><span className="k">Segment</span><span className="v">{SEGMENTS.find((s) => s.id === data.segment)?.name || "—"}</span></div>
                    <div className="review-row"><span className="k">Sites</span><span className="v">{data.sites}</span></div>
                    <div className="review-row"><span className="k">Focus</span><span className="v">{data.focus}</span></div>
                    {data.currentSystems && <div className="review-row"><span className="k">Current systems</span><span className="v">{data.currentSystems}</span></div>}
                    {data.notes && <div className="review-row"><span className="k">Notes</span><span className="v">{data.notes}</span></div>}
                  </div>
                </div>

                <div style={{ marginTop: 32 }}>
                  <button className="btn secondary" onClick={() => navigate("home")}>Back to homepage</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({ label, k, type = "text", placeholder, data, errs, set, optional }) {
  return (
    <div className="field">
      <label>{label} {!optional && <span className="req">*</span>}</label>
      <input
        type={type}
        value={data[k]}
        onChange={set(k)}
        placeholder={placeholder || ""}
        className={errs[k] ? "invalid" : ""}
      />
      {errs[k] && <span className="err">{errs[k]}</span>}
    </div>
  );
}

// ===========================================================
// APP ROOT — simple route state
// ===========================================================
function App() {
  const [route, setRoute] = useState({ name: "home", payload: {} });

  const navigate = (name, payload = {}) => {
    setRoute({ name, payload });
    // scroll to top on route change unless an anchor is given
    setTimeout(() => {
      if (payload.anchor) {
        const el = document.getElementById(payload.anchor);
        if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 20);
  };

  let page;
  switch (route.name) {
    case "platform": page = <PlatformPage navigate={navigate} />; break;
    case "module":   page = route.payload.id === "family-portal"
                       ? <FamilyPortalPage navigate={navigate} />
                       : <ModulePage moduleId={route.payload.id} navigate={navigate} />; break;
    case "serve":    page = <ServePage segmentId={route.payload.id} navigate={navigate} />; break;
    case "why":      page = <WhyPage navigate={navigate} />; break;
    case "about":    page = <AboutPage navigate={navigate} />; break;
    case "call":     page = <StrategyCallPage navigate={navigate} />; break;
    case "home":
    default:         page = <HomePage navigate={navigate} />;
  }

  return (
    <>
      <Nav route={route.name} navigate={navigate} />
      <div key={`${route.name}-${route.payload.id || ""}`}>{page}</div>
      <Footer navigate={navigate} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
