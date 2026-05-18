const { useState, useEffect, useRef, useMemo } = React;

// Build: 2026-05-18 — book-a-call wired to platform API + pipeline

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
  { id: "villages", name: "Retirement Villages", blurb: "Governance, facilities, resident services, and the executive view across all of them.", label: "ESTATE / RESIDENCES",  img: "images/Retirement Villiagespeg.jpeg" },
  { id: "groups",   name: "Senior Living Groups", blurb: "Multi-village roll-up, brand-consistent resident experience at scale.", label: "GROUP / MULTI-VILLAGE",              img: "images/Senior Living Groups.jpeg" },
  { id: "care",     name: "Residential Care",    blurb: "Medication, incidents, clinical handover, regulator-ready governance.", label: "CLINICAL / CARE",                    img: "images/Residential Care.jpeg" },
  { id: "multisite",name: "Multi-Site Operators",blurb: "Group-wide visibility, federated reporting, board-ready KPIs.", label: "FEDERATED / OPS",                          img: "images/Multi-site Operations.jpeg" },
];

const VILLAGES = [
  { name: "Stillwater Estate",   meta: "WESTERN CAPE · 412 RESIDENTS", governance: 96, incidents: 3, medication: 99.4, training: 91 },
  { name: "Oakridge Village",    meta: "GAUTENG · 287 RESIDENTS",     governance: 88, incidents: 7, medication: 97.1, training: 84 },
  { name: "The Cedar Residence", meta: "KZN · 198 RESIDENTS",         governance: 92, incidents: 2, medication: 99.8, training: 95 },
  { name: "Highveld Gardens",    meta: "GAUTENG · 156 RESIDENTS",     governance: 79, incidents: 5, medication: 96.3, training: 73 },
];

// ===========================================================
// JOLLY OAKS DEMO DATA (fictitious)
// ===========================================================
const JO_RESIDENTS = [
  { id:"r1", name:"Henry Carter",          ii:"HC", room:"12B", age:82, care:"Standard", status:"settled", family:"James Carter",       lastRound:"08:42" },
  { id:"r2", name:"Margaret van der Berg", ii:"MV", room:"8A",  age:78, care:"Standard", status:"settled", family:"Susan van der Berg",  lastRound:"08:55" },
  { id:"r3", name:"James Nkosi",           ii:"JN", room:"15C", age:74, care:"Complex",  status:"review",  family:"Nomvula Nkosi",       lastRound:"08:30" },
  { id:"r4", name:"Dorothy Pillay",        ii:"DP", room:"3A",  age:85, care:"High",     status:"settled", family:"Rajan Pillay",        lastRound:"09:01" },
  { id:"r5", name:"Elizabeth Fourie",      ii:"EF", room:"11A", age:71, care:"Standard", status:"settled", family:"Anne Fourie",         lastRound:"08:48" },
  { id:"r6", name:"Robert Smit",           ii:"RS", room:"7B",  age:80, care:"Standard", status:"monitor", family:"Claire Smit",         lastRound:"08:39" },
];
const JO_INCIDENTS = [
  { ref:"INC-0048", date:"17 May", type:"Medication", desc:"Evening dose recorded 45 min late",           sev:"low",    st:"open",   owner:"Sr Joubert" },
  { ref:"INC-0047", date:"16 May", type:"Fall",       desc:"Near-fall in corridor — no injury",            sev:"medium", st:"open",   owner:"K. Dlamini"  },
  { ref:"INC-0046", date:"14 May", type:"Facility",   desc:"Lift out of service 4h",                       sev:"low",    st:"closed", owner:"M. Pillay"   },
  { ref:"INC-0045", date:"12 May", type:"Medication", desc:"PRN given outside protocol window",            sev:"medium", st:"review", owner:"Sr Joubert"  },
  { ref:"INC-0044", date:"10 May", type:"Safeguard",  desc:"Family dispute — visit concern logged",         sev:"low",    st:"closed", owner:"M. Pillay"   },
];
const JO_STAFF = [
  { name:"Sr A. Joubert", role:"Clinical Lead",     dept:"Care", st:"on-shift", note:null },
  { name:"K. Dlamini",    role:"Registered Nurse",  dept:"Care", st:"on-shift", note:null },
  { name:"P. Swart",      role:"Care Worker",       dept:"Care", st:"on-shift", note:null },
  { name:"M. Pillay",     role:"Site Manager",      dept:"Ops",  st:"on-shift", note:null },
  { name:"T. Mokoena",    role:"Housekeeping Sup.", dept:"Ops",  st:"on-shift", note:null },
  { name:"D. Hendricks",  role:"Kitchen Supervisor",dept:"Ops",  st:"leave",    note:"Annual leave to 23 May" },
  { name:"R. September",  role:"Care Worker",       dept:"Care", st:"on-shift", note:null },
];
const JO_TRAINING = [
  { course:"POPIA Data Handling",       cat:"Compliance", due:"30 Jun", pct:85,  exp:2 },
  { course:"Manual Handling",           cat:"Clinical",   due:"15 Jun", pct:100, exp:0 },
  { course:"Fire Safety",               cat:"Safety",     due:"01 Jul", pct:91,  exp:1 },
  { course:"Dementia Care Awareness",   cat:"Clinical",   due:"30 Jun", pct:78,  exp:3 },
  { course:"Medication Administration", cat:"Clinical",   due:"31 May", pct:100, exp:0 },
];

// ===========================================================
// DEVICE PICKER (shared by Explore + Family Portal)
// ===========================================================
function DevicePicker({ mode, setMode, options = ["desktop","tablet","mobile"] }) {
  const labels = { desktop:"Desktop", tablet:"Tablet", mobile:"Mobile" };
  const icons  = { desktop:"⊡", tablet:"▭", mobile:"▯" };
  return (
    <div className="device-picker">
      {options.map(o => (
        <button key={o} className={`device-btn ${mode===o?"active":""}`} onClick={() => setMode(o)}>
          <span style={{fontSize:13}}>{icons[o]}</span>{labels[o]}
        </button>
      ))}
    </div>
  );
}

// ===========================================================
// EXPLORE SIDEBAR (desktop + tablet modes)
// ===========================================================
function ExploreAppSidebar({ active, setActive }) {
  const nav = [
    { grp:"Operate",    items:[["exec","Executive View","4"],["residents","Residents","48"],["facility","Facility Home",""]] },
    { grp:"Care",       items:[["plans","Care Plans",""],["mar","Medication MAR","3"],["obs","Observations",""]] },
    { grp:"Governance", items:[["incidents","Incidents","5"],["docs","QMS Documents",""]] },
    { grp:"People",     items:[["hr","HR & Workforce",""],["training","Training","2"]] },
    { grp:"Operations", items:[["facilities","Facilities",""],["housekeeping","Housekeeping",""]] },
  ];
  return (
    <aside className="explore-sidebar">
      <div className="esb-brand"><div className="esb-mark">HP</div><div className="esb-name">HealthPrac</div></div>
      {nav.map(({ grp, items }) => (
        <React.Fragment key={grp}>
          <div className="esb-grp">{grp}</div>
          {items.map(([id, label, cnt]) => (
            <div key={id} className={`esb-lnk ${active===id?"active":""}`} onClick={() => setActive(id)}>
              {label}{cnt ? <span className="esb-cnt">{cnt}</span> : null}
            </div>
          ))}
        </React.Fragment>
      ))}
      <div className="esb-usr">
        <div className="esb-av">LJ</div>
        <div><div className="esb-uname">Lisa Jordan</div><div className="esb-urole">Admin</div></div>
      </div>
    </aside>
  );
}

// ===========================================================
// LOGO + EMBLEM SVG
// ===========================================================
function HPSEmblem({ height = 28, style = {} }) {
  return (
    <img
      src="images/hps-emblem.svg"
      alt=""
      height={height}
      style={{ display: "block", ...style }}
    />
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
          <HPSEmblem height={28} />
          <span>HealthPrac<span style={{marginLeft:"0.18em",color:"var(--champagne)"}}>Solutions</span></span>
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
            <button className="dd-item" onClick={() => go("explore")}>
              <span className="num">04</span>
              <span>
                <span className="name">Interactive demo</span>
                <span className="blurb">Click through the platform live — all modules, fictitious data.</span>
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
// EXPLORE MODULE SCREENS
// ===========================================================
function ExecScreen({ sm }) {
  return (
    <div className={`aci ${sm?"sm":""}`}>
      <div className="mod-hd">
        <div><div className="mod-ey">Executive · Q3 2026</div><div className="mod-ti">Jolly Oaks Senior Living<em>.</em></div></div>
        {!sm && <button className="mod-act">Board pack ↗</button>}
      </div>
      <div className={`kpi-row ${sm?"k2":"k4"}`}>
        <div className="kpi-card"><div className="kv good">48</div><div className="kl">Residents</div><div className="kd">All rooms occupied</div></div>
        <div className="kpi-card"><div className="kv warn">5</div><div className="kl">Open Incidents</div><div className="kd">2 require action</div></div>
        <div className="kpi-card"><div className="kv good">99.1%</div><div className="kl">Medication acc.</div><div className="kd">Last 30 days</div></div>
        <div className="kpi-card"><div className="kv">91%</div><div className="kl">Training current</div><div className="kd">6 expiring soon</div></div>
      </div>
      <div className={sm?"one-col":"two-col"}>
        <div className="cc">
          <div className="cc-hd"><div className="cc-lbl">Open Items</div><span className="cc-badge">TODAY</span></div>
          <div className="cr"><span className="ll">POPIA training expiries (30d)</span><span className="vv warn">6</span></div>
          <div className="cr"><span className="ll">Open incidents</span><span className="vv warn">5</span></div>
          <div className="cr"><span className="ll">Medication variance</span><span className="vv good">0</span></div>
          <div className="cr"><span className="ll">Maintenance &gt; SLA</span><span className="vv warn">2</span></div>
          <div className="cr"><span className="ll">Family enquiries (24h)</span><span className="vv">7</span></div>
        </div>
        <div className="cc">
          <div className="cc-hd"><div className="cc-lbl">Governance · Last 7 days</div><span className="cc-badge">LIVE</span></div>
          <div className="cr"><span className="ll">Policies acknowledged</span><span className="vv good">43 / 46</span></div>
          <div className="cr"><span className="ll">Audit binder freshness</span><span className="vv good">Live</span></div>
          <div className="cr"><span className="ll">Risk register</span><span className="vv">On schedule</span></div>
          <div className="cr"><span className="ll">Sub-processor disclosures</span><span className="vv good">Current</span></div>
          <div className="cr"><span className="ll">Board pack (Q3)</span><span className="vv warn">Draft</span></div>
        </div>
      </div>
    </div>
  );
}

function ResidentsScreen({ sm, onSelect }) {
  return (
    <div className={`aci ${sm?"sm":""}`}>
      <div className="mod-hd">
        <div><div className="mod-ey">Residents</div><div className="mod-ti">Active Residents<em> · 48</em></div></div>
        {!sm && <button className="mod-act">+ Admit resident</button>}
      </div>
      <div className="cc">
        <table className="dt">
          <thead><tr>
            <th>Name</th><th>Room</th>
            {!sm && <th>Care level</th>}
            <th>Status</th><th>Last round</th>
          </tr></thead>
          <tbody>
            {JO_RESIDENTS.map(r => (
              <tr key={r.id} className="clk" onClick={() => onSelect(r)}>
                <td><span className="nm">{r.name}</span></td>
                <td>{r.room}</td>
                {!sm && <td>{r.care}</td>}
                <td>
                  {r.status==="settled" && <span className="tg green">Settled</span>}
                  {r.status==="review"  && <span className="tg warn">Review</span>}
                  {r.status==="monitor" && <span className="tg gold">Monitor</span>}
                </td>
                <td><span className="vv dim">{r.lastRound}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{fontSize:9,color:"var(--ink-3)",fontFamily:"Geist Mono,monospace",letterSpacing:"0.08em"}}>SHOWING 6 OF 48 · CLICK ANY ROW TO OPEN FILE</div>
    </div>
  );
}

function ResidentFileScreen({ sm, resident, onBack }) {
  const [tab, setTab] = useState("profile");
  const r = resident;
  return (
    <div className={`aci ${sm?"sm":""}`}>
      <div className="rf-back" onClick={onBack}>← Residents</div>
      <div className="rf-banner">
        <div className="rf-av">{r.ii}</div>
        <div style={{flex:1}}>
          <div className="rf-name">{r.name}</div>
          <div className="rf-meta">Room {r.room} · Age {r.age} · {r.care} care</div>
          <div className="rf-tags">
            {r.status==="settled" && <span className="tg green">Settled</span>}
            {r.status==="review"  && <span className="tg warn">Under review</span>}
            {r.status==="monitor" && <span className="tg gold">Monitored</span>}
            <span className="tg gray">Admitted Aug 2024</span>
          </div>
        </div>
      </div>
      <div className="rf-tabs">
        {["profile","care","medication"].map(t => (
          <div key={t} className={`rf-tab ${tab===t?"active":""}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </div>
        ))}
      </div>
      {tab==="profile" && (
        <div className="cc">
          <div className="cc-hd"><div className="cc-lbl">Personal Details</div></div>
          <div className="cr"><span className="ll">Date of birth</span><span className="vv">14 March 1944</span></div>
          <div className="cr"><span className="ll">Room</span><span className="vv">{r.room} — Wing B</span></div>
          <div className="cr"><span className="ll">Admission date</span><span className="vv">15 August 2024</span></div>
          <div className="cr"><span className="ll">Emergency contact</span><span className="vv">{r.family}</span></div>
          <div className="cr"><span className="ll">Contact number</span><span className="vv">083 555 0144</span></div>
          <div className="cr"><span className="ll">Relationship</span><span className="vv">Son</span></div>
        </div>
      )}
      {tab==="care" && (
        <div className="cc">
          <div className="cc-hd"><div className="cc-lbl">Care Plan · Active</div><span className="cc-badge">REVIEWED 12 MAY</span></div>
          <div className="cr"><span className="ll">Mobility</span><span className="vv">Level 2 — supervised walking</span></div>
          <div className="cr"><span className="ll">Falls risk</span><span className="vv warn">Moderate — rail in place</span></div>
          <div className="cr"><span className="ll">Diet</span><span className="vv">Texture C · soft foods</span></div>
          <div className="cr"><span className="ll">Skin integrity</span><span className="vv good">Intact — weekly review</span></div>
          <div className="cr"><span className="ll">Cognitive status</span><span className="vv">Oriented × 3</span></div>
          <div className="cr"><span className="ll">Care note</span><span className="vv dim">"Settled night. Pleased to see the gardens." — Sr Joubert 08:42</span></div>
        </div>
      )}
      {tab==="medication" && (
        <div className="cc">
          <div className="cc-hd"><div className="cc-lbl">Medication Plan</div><span className="cc-badge">CURRENT</span></div>
          <div className="cr"><span className="ll">Atorvastatin 20mg</span><span className="vv">OD · Nocte</span></div>
          <div className="cr"><span className="ll">Ramipril 5mg</span><span className="vv">OD · Morning</span></div>
          <div className="cr"><span className="ll">Aspirin 100mg</span><span className="vv">OD · Morning</span></div>
          <div className="cr"><span className="ll">Paracetamol 1g</span><span className="vv">PRN · max 4×/day</span></div>
          <div className="cr"><span className="ll">Last administered</span><span className="vv good">All current · 08:42</span></div>
        </div>
      )}
    </div>
  );
}

function MARScreen({ sm }) {
  return (
    <div className={`aci ${sm?"sm":""}`}>
      <div className="mod-hd">
        <div><div className="mod-ey">Medication · MAR</div><div className="mod-ti">Today's Rounds<em> · 18 May 2026</em></div></div>
        {!sm && <button className="mod-act">PRN log</button>}
      </div>
      <div className={`kpi-row ${sm?"k2":"k3"}`}>
        <div className="kpi-card"><div className="kv good">38/38</div><div className="kl">Morning round</div><div className="kd">Complete · 06:00–08:00</div></div>
        <div className="kpi-card"><div className="kv good">36/36</div><div className="kl">Afternoon round</div><div className="kd">Complete · 12:00–14:00</div></div>
        <div className="kpi-card"><div className="kv warn">28/40</div><div className="kl">Evening round</div><div className="kd">In progress · 18:00–20:00</div></div>
      </div>
      <div className="cc">
        <div className="cc-hd"><div className="cc-lbl">Evening Round · In Progress</div><span className="cc-badge">LIVE</span></div>
        <div className="cr"><span className="ll">H. Carter · Atorvastatin 20mg</span><span className="tg green">Administered</span></div>
        <div className="cr"><span className="ll">M. van der Berg · Ramipril 5mg</span><span className="tg green">Administered</span></div>
        <div className="cr"><span className="ll">J. Nkosi · Metformin 500mg</span><span className="tg gold">Pending</span></div>
        <div className="cr"><span className="ll">D. Pillay · Amlodipine 5mg</span><span className="tg gold">Pending</span></div>
        <div className="cr"><span className="ll">E. Fourie · Furosemide 40mg</span><span className="tg gold">Pending</span></div>
        <div className="cr"><span className="ll">R. Smit · Bisoprolol 2.5mg</span><span className="tg gold">Pending</span></div>
      </div>
      <div className="cc">
        <div className="cc-hd"><div className="cc-lbl">PRN Today</div></div>
        <div className="cr"><span className="ll">Paracetamol 1g · H. Carter</span><span className="vv dim">14:22 · Sr Joubert</span></div>
        <div className="cr"><span className="ll">Buscopan 10mg · D. Pillay</span><span className="vv dim">11:05 · K. Dlamini</span></div>
      </div>
    </div>
  );
}

function IncidentsScreen({ sm }) {
  return (
    <div className={`aci ${sm?"sm":""}`}>
      <div className="mod-hd">
        <div><div className="mod-ey">QMS · Incidents</div><div className="mod-ti">Incident Register<em> · 5 open</em></div></div>
        {!sm && <button className="mod-act">+ Raise IR</button>}
      </div>
      <div className="cc">
        <div className="cc-hd"><div className="cc-lbl">All Incidents</div><span className="cc-badge">LIVE</span></div>
        <table className="dt">
          <thead><tr>
            <th>Reference</th><th>Date</th>
            {!sm && <th>Type</th>}
            <th>Status</th>
            {!sm && <th>Owner</th>}
          </tr></thead>
          <tbody>
            {JO_INCIDENTS.map(inc => (
              <tr key={inc.ref} className="clk">
                <td><span className="nm">{inc.ref}</span></td>
                <td>{inc.date}</td>
                {!sm && <td>{inc.type}</td>}
                <td>
                  {inc.st==="open"   && <span className="tg warn">Open</span>}
                  {inc.st==="review" && <span className="tg gold">Review</span>}
                  {inc.st==="closed" && <span className="tg gray">Closed</span>}
                </td>
                {!sm && <td><span className="vv dim">{inc.owner}</span></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HRScreen({ sm }) {
  return (
    <div className={`aci ${sm?"sm":""}`}>
      <div className="mod-hd">
        <div><div className="mod-ey">HR & Workforce</div><div className="mod-ti">Staff on Shift<em> · Today</em></div></div>
        {!sm && <button className="mod-act">Roster</button>}
      </div>
      <div className={`kpi-row ${sm?"k2":"k3"}`}>
        <div className="kpi-card"><div className="kv">7</div><div className="kl">Staff on site</div></div>
        <div className="kpi-card"><div className="kv warn">1</div><div className="kl">On leave</div></div>
        <div className="kpi-card"><div className="kv good">0</div><div className="kl">Credentialing expiries</div></div>
      </div>
      <div className="cc">
        <div className="cc-hd"><div className="cc-lbl">Today's Roster</div><span className="cc-badge">18 MAY</span></div>
        <table className="dt">
          <thead><tr>
            <th>Name</th>{!sm && <th>Role</th>}<th>Status</th>
          </tr></thead>
          <tbody>
            {JO_STAFF.map(s => (
              <tr key={s.name}>
                <td>
                  <span className="nm">{s.name}</span>
                  {s.note && <div style={{fontSize:10,color:"var(--ink-3)",marginTop:2}}>{s.note}</div>}
                </td>
                {!sm && <td>{s.role}</td>}
                <td>{s.st==="on-shift" ? <span className="tg green">On shift</span> : <span className="tg gold">Leave</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TrainingScreen({ sm }) {
  return (
    <div className={`aci ${sm?"sm":""}`}>
      <div className="mod-hd">
        <div><div className="mod-ey">Training</div><div className="mod-ti">Course Status<em> · Q2 2026</em></div></div>
        {!sm && <button className="mod-act">Certificates</button>}
      </div>
      <div className="cc">
        <div className="cc-hd"><div className="cc-lbl">Compliance Training</div><span className="cc-badge">6 EXPIRING</span></div>
        {JO_TRAINING.map(t => (
          <div key={t.course} className="cr">
            <div style={{flex:1}}>
              <div className="ll">{t.course}</div>
              {!sm && <div style={{fontSize:9,color:"var(--ink-3)",fontFamily:"Geist Mono,monospace",letterSpacing:"0.08em",marginTop:1}}>DUE {t.due} · {t.cat.toUpperCase()}</div>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:7}}>
              {t.exp>0 && <span className="tg warn">{t.exp} expiring</span>}
              <span className={t.pct===100?"tg green":t.pct>=85?"tg gold":"tg warn"}>{t.pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FacilitiesScreen({ sm }) {
  return (
    <div className={`aci ${sm?"sm":""}`}>
      <div className="mod-hd">
        <div><div className="mod-ey">Facilities · OHS</div><div className="mod-ti">Inspections<em> · May 2026</em></div></div>
        {!sm && <button className="mod-act">Run inspection</button>}
      </div>
      <div className={`kpi-row ${sm?"k2":"k3"}`}>
        <div className="kpi-card"><div className="kv good">93%</div><div className="kl">Overall score</div><div className="kd">Avg — last 5</div></div>
        <div className="kpi-card"><div className="kv warn">4</div><div className="kl">Open tickets</div><div className="kd">2 near SLA</div></div>
        <div className="kpi-card"><div className="kv blue">5</div><div className="kl">Inspections this month</div></div>
      </div>
      <div className={sm?"one-col":"two-col"}>
        <div className="cc">
          <div className="cc-hd"><div className="cc-lbl">Inspection Scores</div></div>
          {[["Fire Safety",96,"10 May"],["IPC / Hygiene",92,"15 May"],["Kitchen & Food",88,"12 May"],["OHS",94,"08 May"],["Grounds",97,"14 May"]].map(([n,s,d]) => (
            <div key={n} className="cr">
              <span className="ll">{n}</span>
              {!sm && <span className="vv dim">{d}</span>}
              <span className={s>=95?"tg green":s>=90?"tg gold":"tg warn"}>{s}%</span>
            </div>
          ))}
        </div>
        <div className="cc">
          <div className="cc-hd"><div className="cc-lbl">Open Maintenance</div></div>
          {[["Handrail · Corridor C","Assigned","gold"],["Window seal · Rm 15C","Scheduled","gold"],["Extractor · Laundry","Open","warn"],["Light fitting · Dining","Completed","green"]].map(([d,s,c]) => (
            <div key={d} className="cr"><span className="ll">{d}</span><span className={`tg ${c}`}>{s}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===========================================================
// EXPLORE APP SHELL — sidebar + module switcher
// ===========================================================
function ExploreAppShell({ device, activeModule, setActiveModule, selectedResident, setSelectedResident }) {
  const sm = device === "mobile";

  const mobileNav = [
    { id:"exec",      label:"Overview" },
    { id:"residents", label:"Residents" },
    { id:"mar",       label:"Care" },
    { id:"incidents", label:"Incidents" },
    { id:"hr",        label:"People" },
  ];

  const handleModule = (id) => { setActiveModule(id); setSelectedResident(null); };

  const renderContent = () => {
    if (activeModule==="residents" && selectedResident) {
      return <ResidentFileScreen sm={sm} resident={selectedResident} onBack={() => setSelectedResident(null)} />;
    }
    switch(activeModule) {
      case "exec":        return <ExecScreen sm={sm} />;
      case "residents":   return <ResidentsScreen sm={sm} onSelect={setSelectedResident} />;
      case "mar":
      case "plans":
      case "obs":         return <MARScreen sm={sm} />;
      case "incidents":   return <IncidentsScreen sm={sm} />;
      case "hr":          return <HRScreen sm={sm} />;
      case "training":    return <TrainingScreen sm={sm} />;
      case "facilities":
      case "housekeeping":
      case "docs":
      case "facility":    return <FacilitiesScreen sm={sm} />;
      default:            return <ExecScreen sm={sm} />;
    }
  };

  return (
    <div className={`app-shell ${device}`}>
      {sm && (
        <div className="mobile-topbar">
          <div className="mtb-brand"><div className="mtb-mark">HP</div><div className="mtb-name">HealthPrac</div></div>
          <div className="hamburger"><span/><span/><span/></div>
        </div>
      )}
      {!sm && <ExploreAppSidebar active={activeModule} setActive={handleModule} />}
      <div className="app-content">
        {renderContent()}
      </div>
      {sm && (
        <div className="mobile-bottom-nav">
          {mobileNav.map(n => (
            <div key={n.id} className={`mbn-item ${activeModule===n.id?"active":""}`} onClick={() => handleModule(n.id)}>
              <div className="mbn-glyph"/>
              {n.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===========================================================
// EXPLORE PAGE — full interactive platform demo
// ===========================================================
function ExplorePage({ navigate }) {
  const [device, setDevice] = useState("desktop");
  const [activeModule, setActiveModule] = useState("exec");
  const [selectedResident, setSelectedResident] = useState(null);

  const shell = (
    <ExploreAppShell
      device={device}
      activeModule={activeModule}
      setActiveModule={setActiveModule}
      selectedResident={selectedResident}
      setSelectedResident={setSelectedResident}
    />
  );

  const renderFrame = () => {
    if (device === "desktop") return (
      <div className="browser-frame">
        <div className="browser-titlebar">
          <div className="browser-dots"><i/><i/><i/></div>
          <div className="browser-url">app.healthprac.com · jolly-oaks-senior-living</div>
        </div>
        <div className="browser-content">{shell}</div>
      </div>
    );
    if (device === "tablet") return (
      <div style={{display:"flex",justifyContent:"center"}}>
        <div className="tablet-outer">
          <div className="tablet-top-bar"><div className="tablet-cam"/></div>
          <div className="tablet-inner">{shell}</div>
          <div className="tablet-bottom-bar"><div className="tablet-home"/></div>
        </div>
      </div>
    );
    return (
      <div style={{display:"flex",justifyContent:"center"}}>
        <div className="mobile-outer">
          <div className="mobile-notch-bar"><div className="mobile-notch"/></div>
          <div className="mobile-inner">{shell}</div>
          <div className="mobile-home-bar"><div className="mobile-home-pill"/></div>
        </div>
      </div>
    );
  };

  return (
    <main className="page">
      <section className="block">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow">Interactive Demo · Jolly Oaks Senior Living</div>
            <h1 className="display" style={{fontSize:"clamp(44px,6vw,88px)",maxWidth:"18ch"}}>
              The platform,<br/><em>in your hands.</em>
            </h1>
            <p className="lede" style={{marginTop:28,maxWidth:"48ch"}}>
              Click through a live demo of the Jolly Oaks Senior Living facility — fictitious data, real platform. Navigate any module. Switch between desktop, tablet, and mobile to see exactly how your team would use it every day.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="block tight" style={{background:"var(--linen)",borderTop:"1px solid var(--rule)",borderBottom:"1px solid var(--rule)"}}>
        <div className="wrap" style={{paddingTop:40,paddingBottom:56}}>
          <Reveal>
            <DevicePicker mode={device} setMode={(d) => { setDevice(d); setSelectedResident(null); }} />
            {renderFrame()}
          </Reveal>
        </div>
      </section>

      <section className="block dark close-cta">
        <div className="wrap">
          <Reveal>
            <h2>See this against <em>your operation.</em></h2>
            <p className="body-l">A 45-minute call — we'll configure the platform around your actual workflows and show you what your executive dashboard looks like from day one.</p>
            <div className="ctas">
              <button className="btn gold" onClick={() => navigate("call")}>Book a call to explore <span className="arrow">→</span></button>
              <button className="btn ghost-light" onClick={() => navigate("platform")}>How the platform works</button>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
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
                <div className="user-name">Lisa Jordan</div>
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
function LegalModal({ title, tag, onClose, children, footerNote }) {
  React.useEffect(() => {
    const esc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className="legal-overlay" onClick={onClose}>
      <div className="legal-modal" onClick={(e) => e.stopPropagation()}>
        <div className="legal-modal-header">
          <div>
            <h3>{title}</h3>
            <div className="legal-tag">{tag}</div>
          </div>
          <button className="legal-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="legal-modal-body">{children}</div>
        {footerNote && <div className="legal-modal-footer">{footerNote}</div>}
      </div>
    </div>
  );
}

function TermsModal({ onClose }) {
  return (
    <LegalModal
      title="SaaS Provider &amp; Client Conduct Disclaimer"
      tag="HealthPrac Solutions · Platform Terms"
      onClose={onClose}
      footerNote={
        <span>Read together with the platform terms of use, customer agreement, and data processing/operator agreement. · <a href="mailto:admin@healthprac.com">admin@healthprac.com</a></span>
      }
    >
      <h4>Platform Status</h4>
      <p>HealthPrac Solutions ("HPS") is a software-as-a-service provider. HPS supplies hosted software, system functionality, related technical services, and may from time to time provide limited consultation services requested by a client, including assistance with matters such as incident investigations, workflow reviews, platform configuration guidance, and related operational support. Such consultation is advisory in nature only and does not make HPS the employer, practice owner, healthcare provider, records custodian, compliance officer, information officer, operator of the client's business, or decision-maker in respect of the client's operational, legal, regulatory, clinical, HR, financial, or data-processing activities, unless expressly agreed otherwise in writing.</p>

      <h4>Consultation Scope</h4>
      <p>Any consultation, guidance, support, recommendation, review, comment, participation, or assistance provided by HPS is provided strictly in an advisory and support capacity. Final responsibility for investigating, assessing, escalating, reporting, documenting, deciding, implementing, and responding to any incident, complaint, dispute, breach, governance issue, disciplinary matter, legal matter, operational issue, or compliance issue remains solely with the client at all times.</p>

      <h4>Client Responsibility</h4>
      <p>Each client is solely responsible for how it configures, administers, accesses, uses, and relies on the platform, including all data entered into the platform and all actions taken or omitted by its authorised users, administrators, employees, contractors, agents, and representatives. The client is also solely responsible for how it interprets, adopts, rejects, or acts on any consultation or support provided by HPS. The client's use of the platform, and any conduct carried out through or in connection with the platform, is undertaken entirely at the client's own risk and for the client's own account.</p>

      <h4>No Endorsement or Attribution</h4>
      <p>Any act, omission, misconduct, non-compliance, misrepresentation, unlawful processing, unauthorised disclosure, employment dispute, regulatory breach, content upload, instruction, communication, or business practice of a client or user is solely that client's or user's responsibility and shall not be interpreted as reflecting the views, conduct, standards, endorsement, approval, or responsibility of HPS. The fact that HPS may have provided consultation or support to the client on a related matter does not create responsibility, control, assumption of duty, or legal attribution to HPS for the client's decisions, failures, or outcomes.</p>

      <h4>Exclusion of Liability</h4>
      <p>To the maximum extent permitted by applicable law, HPS shall not be liable for any direct, indirect, incidental, consequential, special, punitive, or exemplary loss, damage, penalty, fine, claim, demand, cost, expense, business interruption, reputational harm, or legal exposure arising from or related to:</p>
      <ul>
        <li>any client's or user's acts or omissions;</li>
        <li>any client's non-compliance with applicable laws, regulations, professional obligations, or contractual duties;</li>
        <li>any instructions given by a client to its staff, patients, customers, contractors, or third parties;</li>
        <li>any data, content, records, messages, files, documents, or information uploaded, transmitted, stored, generated, or shared by a client or user; or</li>
        <li>any reliance placed by a client or third party on outputs, workflows, reminders, automations, records, consultations, suggestions, or support generated through or in connection with the platform, where the client remains responsible for independent review, verification, lawful use, and final decision-making.</li>
      </ul>

      <h4>Indemnity</h4>
      <p>Each client indemnifies, defends, and holds harmless HPS, its affiliates, officers, employees, contractors, and agents from and against any and all claims, complaints, investigations, proceedings, damages, losses, liabilities, penalties, fines, costs, and expenses, including reasonable legal costs, arising from or connected with that client's use of the platform, reliance on consultation, breach of law, breach of contract, infringement of rights, or misuse of personal or confidential information.</p>

      <h4>Enforceability</h4>
      <p>If any part of this disclaimer is found to be unenforceable, the remaining provisions shall continue in full force to the maximum extent permitted by law.</p>
    </LegalModal>
  );
}

function PopiaModal({ onClose }) {
  return (
    <LegalModal
      title="POPIA &amp; Website Data Disclaimer"
      tag="Protection of Personal Information Act 4 of 2013 · HealthPrac Solutions"
      onClose={onClose}
      footerNote={
        <span>Read together with the website privacy notice, platform terms of use, customer agreement, and data processing/operator agreement. · <a href="mailto:admin@healthprac.com">admin@healthprac.com</a></span>
      }
    >
      <h4>Important Notice</h4>
      <p>This website and the software services made available through it may involve the collection, storage, use, transmission, and other processing of personal information. Any such processing must be conducted in accordance with the Protection of Personal Information Act, 4 of 2013 ("POPIA"), and any other applicable South African data protection, privacy, confidentiality, employment, health, consumer, or sector-specific laws and regulations.</p>

      <h4>Role of HealthPrac Solutions</h4>
      <p>HealthPrac Solutions ("HPS") provides a software-as-a-service platform and related digital infrastructure to its clients. Unless expressly stated otherwise in a written agreement, HPS does not determine the lawful basis, purpose, scope, retention period, disclosure practices, or accuracy of personal information captured, uploaded, stored, or processed by any client, user, practice, business, administrator, employee, contractor, or third party using the platform.</p>
      <p>Each client remains solely and fully responsible for ensuring that:</p>
      <ul>
        <li>it has a lawful basis and any required permissions, notices, authorisations, or consents for the collection and processing of personal information;</li>
        <li>all data entered into or processed through the platform is collected, used, stored, shared, and retained lawfully;</li>
        <li>appropriate internal policies, access controls, safeguards, operator agreements, training, and governance measures are in place;</li>
        <li>data subjects are provided with all notices and information required by POPIA and any other applicable laws; and</li>
        <li>any cross-border transfers, special personal information processing, direct marketing, security incident handling, and records management activities are compliant with applicable law.</li>
      </ul>

      <h4>No Legal Advice</h4>
      <p>Nothing on this website or within the platform constitutes legal advice, regulatory advice, compliance certification, or a representation that any client's use of the platform is automatically POPIA-compliant. Clients must obtain their own independent legal, compliance, and regulatory advice appropriate to their operations and industry.</p>

      <h4>Limitation of Responsibility</h4>
      <p>HPS does not accept responsibility for, and shall not be liable for, any unlawful, negligent, unauthorised, excessive, inaccurate, misleading, or non-compliant collection, capture, storage, use, disclosure, transfer, retention, deletion, or other processing of personal information by any client or user of the platform. HPS shall not be responsible for any fines, penalties, enforcement action, complaints, damages, losses, claims, costs, or liabilities arising from or relating to a client's or user's failure to comply with POPIA or any other applicable law.</p>

      <h4>Reservation of Rights</h4>
      <p>HPS reserves the right to suspend, restrict, investigate, or terminate access where it reasonably believes that the platform is being used in a manner that may be unlawful, abusive, insecure, or inconsistent with applicable law, contractual terms, or platform policies.</p>

      <h4>Recommended Use</h4>
      <p>This disclaimer should be read together with the website privacy notice, platform terms of use, customer agreement, data processing/operator agreement, and any information security documentation made available by HPS.</p>
    </LegalModal>
  );
}

function Footer({ navigate }) {
  const yr = new Date().getFullYear();
  const [showTerms, setShowTerms] = React.useState(false);
  const [showPopia, setShowPopia] = React.useState(false);
  return (
    <>
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
      {showPopia && <PopiaModal onClose={() => setShowPopia(false)} />}
      <footer className="footer">
        <div className="wrap">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="mark">
                <HPSEmblem height={32} style={{ filter: "brightness(0) invert(1) opacity(0.85)" }} />
                HealthPrac<span style={{marginLeft:"0.18em",color:"var(--champagne-2)"}}>Solutions</span>
              </div>
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
            <div>
              Powered by HPS ·{" "}
              <button className="footer-legal-link" onClick={() => setShowPopia(true)}>POPIA</button>
              {" · "}
              <button className="footer-legal-link" onClick={() => setShowTerms(true)}>Terms</button>
              {" · DPA · Sub-processors"}
            </div>
          </div>
        </div>
      </footer>
    </>
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
// PROBLEM ACCORDION — eight pain-point categories, expandable
// ===========================================================
const PROBLEM_ROWS = [
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
          <div style={{ maxWidth: "780px", margin: "0 auto", textAlign: "center" }}>
            <Reveal>
              <div className="eyebrow" style={{ justifyContent: "center" }}>Senior Living &amp; Care Operating System</div>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="display hero-h1">
                The <em>operating system</em> for senior living &amp; care.
              </h1>
            </Reveal>
            <Reveal delay={180}>
              <p className="lede hero-sub" style={{ maxWidth: "540px", margin: "32px auto 36px" }}>
                One elegant platform for governance, medication, workforce, training, incidents, assets, facilities, and executive oversight — embedded by people who understand the challenges of multi-site operations in a healthcare environment.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="hero-ctas" style={{ justifyContent: "center" }}>
                <button className="btn primary" onClick={() => navigate("call")}>
                  Book a call to explore <span className="arrow">→</span>
                </button>
              </div>
            </Reveal>
            <Reveal delay={340}>
              <div className="hero-meta" style={{ justifyContent: "center" }}>
                <div className="item">Modules<strong>Twenty across six categories</strong></div>
                <div className="item">Implementation<strong>4–6 weeks</strong></div>
                <div className="item">Combined Leadership<strong>72 years</strong></div>
              </div>
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
                  <h2 className="problem-h">Eight systems.<br/><em>No single source of truth.</em></h2>
                  <p className="body-l" style={{ marginTop: 20, maxWidth: "44ch" }}>
                    It works on the days nothing goes wrong. Then a resident has an event, a regulator arrives, or quality drifts in a way nobody saw coming — and the CEO has to reassure the board from memory, with a spreadsheet assembled the night before.
                  </p>
                  <p className="body-l" style={{ marginTop: 14, color: "var(--forest)", fontWeight: 500 }}>
                    The HealthPrac Solution ensures the C-Suite is board- and audit-ready by default due to the detailed oversight of each facility.
                  </p>
                  <button
                    type="button"
                    className="btn ghost-light"
                    style={{ marginTop: 16, fontSize: 13, padding: "8px 18px" }}
                    onClick={() => navigate("call")}
                  >
                    Book a call to explore
                  </button>
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
                Every layer of a care environment — from the gate to the boardroom — modelled, configured and connected on one platform.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div className="cat-grid">
              {CATEGORIES.map((c) => (
                <div key={c.id} className="cat-card" style={{ minHeight: "auto" }}>
                  <div className="cat-head">
                    <span className="n">{c.num} · {c.em}</span>
                    <span className="c">{c.moduleIds.length} {c.moduleIds.length === 1 ? "module" : "modules"}</span>
                  </div>
                  <h3>{c.name}<em>.</em></h3>
                  <p className="blurb">{c.blurb}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <button className="btn primary" onClick={() => navigate("call")}>
                Book a call to explore <span className="arrow">→</span>
              </button>
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
                <button className="btn primary" onClick={() => navigate("call")}>
                  Book a call to explore <span className="arrow">→</span>
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
                  <div className="img">
                    <img src={s.img} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>
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
            <div style={{textAlign:"center",marginBottom:28}}>
              <div className="eyebrow">Interactive Demo</div>
              <h2 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(28px,4vw,44px)",fontWeight:400,color:"var(--forest)",margin:"8px 0 16px"}}>
                Click through the platform<em style={{fontStyle:"italic",color:"var(--champagne)"}}> live.</em>
              </h2>
              <p className="body-l" style={{maxWidth:"48ch",margin:"0 auto 24px"}}>*Disclaimer. All information loaded is fictitious and for demonstration purposes only.</p>
              <button className="btn primary" onClick={() => navigate("demo")}>Explore the Platform Interactive <span className="arrow">→</span></button>
            </div>
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

function FPTabletFrame({ tab, setTab }) {
  const navItems = [
    { id:"home",     label:"Home"     },
    { id:"status",   label:"Status"   },
    { id:"requests", label:"Requests" },
    { id:"billing",  label:"Billing"  },
    { id:"more",     label:"More"     },
  ];
  const activeBottom = ["events","surveys","contacts"].includes(tab) ? "more" : tab;
  return (
    <div className="fp-tablet-outer">
      <div className="fp-tablet-cam"><div className="fp-tablet-cam-dot"/></div>
      <div className="fp-tablet-content">
        <div style={{background:"var(--paper)",display:"flex",flexDirection:"column",height:520}}>
          <div className="phone-status" style={{padding:"12px 20px"}}>
            <span>09:14</span>
            <span style={{display:"flex",gap:10,alignItems:"center"}}><span>5G</span><span style={{fontSize:10}}>●●●●●</span><span>96%</span></span>
          </div>
          <div className="phone-header" style={{padding:"12px 20px"}}>
            <div><div className="where">The Cedar Residence</div><div className="who">Sarah Carter</div></div>
            <div className="avatar">SC</div>
          </div>
          <div className="phone-body" style={{padding:"20px 24px 12px",flex:"1 1 auto"}}>
            {tab==="home"     && <HomeScreen />}
            {tab==="status"   && <StatusScreen />}
            {tab==="billing"  && <BillingScreen />}
            {tab==="events"   && <EventsScreen />}
            {tab==="requests" && <RequestsScreen />}
            {tab==="surveys"  && <SurveysScreen />}
            {tab==="contacts" && <ContactsScreen />}
          </div>
          <div className="phone-nav">
            {navItems.map(n => (
              <button key={n.id} className={`phone-nav-item ${activeBottom===n.id?"active":""}`} onClick={() => setTab(n.id==="more"?"events":n.id)}>
                <span className="glyph"/>{n.label}
              </button>
            ))}
          </div>
          <div className="phone-footer">© 2026 The Cedar Residence · Powered by <em>HealthPrac</em></div>
        </div>
      </div>
      <div className="fp-tablet-home"><div className="fp-tablet-pill"/></div>
    </div>
  );
}

function FPDesktopFrame({ tab, setTab }) {
  const current = FP_SCREENS.find(s => s.id === tab);
  return (
    <div className="fp-desktop-frame">
      <div className="browser-titlebar" style={{borderRadius:"3px 3px 0 0",marginBottom:0}}>
        <div className="browser-dots"><i/><i/><i/></div>
        <div className="browser-url">family.healthprac.com · the-cedar-residence</div>
      </div>
      <div className="fp-desktop-shell">
        <div className="fp-desktop-nav">
          <div className="fdn-brand">
            <div className="fdn-mark">CR</div>
            <div className="fdn-name">The Cedar Residence</div>
          </div>
          <div className="fdn-sect">My Family</div>
          <div className="fdn-lnk active"><span>Henry Carter</span><span style={{fontFamily:"Geist Mono,monospace",fontSize:9,background:"rgba(184,155,110,0.2)",padding:"2px 6px",borderRadius:2,color:"var(--champagne-2)"}}>Rm 12B</span></div>
          <div className="fdn-sect">Portal</div>
          {FP_SCREENS.map(s => (
            <div key={s.id} className={`fdn-lnk ${tab===s.id?"active":""}`} onClick={() => setTab(s.id)}>{s.name}</div>
          ))}
          <div className="fdn-sect">Account</div>
          <div className="fdn-lnk">Profile settings</div>
          <div className="fdn-lnk">Help &amp; support</div>
        </div>
        <div className="fp-desktop-main">
          <div>
            <div className="fp-dey">{current.name}</div>
            <div className="fp-dh">{current.name}<em>.</em></div>
            <p style={{color:"var(--ink-2)",fontSize:13,margin:"8px 0 16px",maxWidth:"44ch"}}>{current.desc}</p>
          </div>
          {tab==="home" && (
            <div className="fp-desktop-grid">
              <div className="cc">
                <div className="cc-hd"><div className="cc-lbl">Today</div><span className="cc-badge">09:14</span></div>
                <div className="cr"><span className="ll">Resident</span><span className="vv">Henry Carter</span></div>
                <div className="cr"><span className="ll">Status</span><span className="tg green">Settled &amp; well</span></div>
                <div className="cr"><span className="ll">Last care round</span><span className="vv">08:42 · Sr Joubert</span></div>
                <div className="cr"><span className="ll">Mood</span><span className="vv">Bright</span></div>
                <div className="cr"><span className="ll">Breakfast</span><span className="tg green">Eaten in full</span></div>
              </div>
              <div className="cc">
                <div className="cc-hd"><div className="cc-lbl">Care team note</div></div>
                <div style={{padding:"14px 14px"}}>
                  <p style={{color:"var(--forest)",fontSize:13,fontStyle:"italic",margin:"0 0 8px",lineHeight:1.6}}>"Settled night. Up early and pleased to see the gardens."</p>
                  <div style={{fontSize:11,color:"var(--ink-3)"}}>Sr Joubert · 08:42</div>
                </div>
              </div>
            </div>
          )}
          {tab==="status" && (
            <div className="cc">
              <div className="cc-hd"><div className="cc-lbl">Today's Timeline</div></div>
              {[["Morning round","Complete","green"],["Breakfast","Eaten in full","green"],["Awake & alert","Settled","green"],["Comfort & rest","Stable","green"],["Activity","Walk · gardens","green"],["Evening round","Scheduled","gold"]].map(([k,v,c]) => (
                <div key={k} className="cr"><span className="ll">{k}</span><span className={`tg ${c}`}>{v}</span></div>
              ))}
            </div>
          )}
          {tab==="billing" && (
            <div className="cc">
              <div className="cc-hd"><div className="cc-lbl">October Statement</div><span className="cc-badge">PAID</span></div>
              <div className="cr"><span className="ll">Current month</span><span className="vv">R 28,450</span></div>
              <div className="cr"><span className="ll">Settlement date</span><span className="vv">02 October 2026</span></div>
              <div className="cr"><span className="ll">Reference</span><span className="vv">HPS-2610-114</span></div>
              <div className="cr"><span className="ll">Status</span><span className="tg green">Paid</span></div>
              <div className="cr"><span className="ll">September 2026</span><span className="tg green">Paid</span></div>
              <div className="cr"><span className="ll">August 2026</span><span className="tg green">Paid</span></div>
            </div>
          )}
          {tab==="events" && (
            <div className="fp-desktop-grid">
              {[["Monday","Yoga · 10AM","Roast chicken, herb butter"],["Tuesday","Music recital · 4PM","Bobotie, yellow rice"],["Wednesday","Gardening club","Lamb stew, mash"],["Thursday","Family tea · 3PM","Fish pie, greens"]].map(([day,act,menu]) => (
                <div key={day} className="cc">
                  <div className="cc-hd"><div className="cc-lbl">{day}</div></div>
                  <div className="cr"><span className="ll">Activity</span><span className="vv">{act}</span></div>
                  <div className="cr"><span className="ll">Menu</span><span className="vv dim">{menu}</span></div>
                </div>
              ))}
            </div>
          )}
          {tab==="requests" && (
            <div className="cc">
              <div className="cc-hd"><div className="cc-lbl">Your Requests</div></div>
              {[["Visit · Fri 3PM","Confirmed","green"],["Linen change","Scheduled","gold"],["Hairdresser booking","Pending","gold"],["Handrail repair","Completed","green"],["Wheelchair service","Completed","green"]].map(([k,v,c]) => (
                <div key={k} className="cr"><span className="ll">{k}</span><span className={`tg ${c}`}>{v}</span></div>
              ))}
            </div>
          )}
          {tab==="surveys" && (
            <div className="cc">
              <div className="cc-hd"><div className="cc-lbl">Recent Feedback</div></div>
              {[["Family tea · Sep 2026","Shared","green"],["Care quality · Aug 2026","Shared","green"],["Welcome experience · Jun 2026","Shared","green"]].map(([k,v,c]) => (
                <div key={k} className="cr"><span className="ll">{k}</span><span className={`tg ${c}`}>{v}</span></div>
              ))}
            </div>
          )}
          {tab==="contacts" && (
            <div className="cc">
              <div className="cc-hd"><div className="cc-lbl">Important Contacts</div></div>
              <div className="cr"><span className="ll">Reception</span><span className="vv">021 555 0184</span></div>
              <div className="cr"><span className="ll">Care lead · Sr Joubert</span><span className="vv">021 555 0192</span></div>
              <div className="cr"><span className="ll">Site manager · M. Pillay</span><span className="vv">021 555 0188</span></div>
              <div className="cr"><span className="ll">After-hours · 24/7</span><span className="vv warn">060 555 0140</span></div>
              <div className="cr"><span className="ll">Email</span><span className="vv">cedar@residence.healthprac.com</span></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FamilyPortalShowcase() {
  const [tab, setTab] = useState("home");
  const [fpDevice, setFpDevice] = useState("mobile");
  const current = FP_SCREENS.find((s) => s.id === tab);

  const screenPicker = (
    <>
      <div className="fp-device-picker">
        {["mobile","tablet","desktop"].map(m => (
          <button key={m} className={`fp-device-btn ${fpDevice===m?"active":""}`} onClick={() => setFpDevice(m)}>
            {m.charAt(0).toUpperCase()+m.slice(1)}
          </button>
        ))}
      </div>
      <div className="mono-label" style={{marginBottom:12}}>Switch screen</div>
      <div className="fp-tabs">
        {FP_SCREENS.map((s) => (
          <button key={s.id} className={`fp-tab ${tab===s.id?"active":""}`} onClick={() => setTab(s.id)}>
            {s.name}
          </button>
        ))}
      </div>
    </>
  );

  if (fpDevice === "desktop") {
    return (
      <div className="fp-stage-desktop">
        <div>
          <div className="eyebrow">Showcase · Desktop</div>
          <h3 className="display">{current.name}<em>.</em></h3>
          <p className="body-l" style={{marginTop:20,marginBottom:20,maxWidth:"52ch"}}>{current.desc}</p>
          {screenPicker}
        </div>
        <FPDesktopFrame tab={tab} setTab={setTab} />
      </div>
    );
  }

  return (
    <div className="fp-stage">
      <div className="fp-side">
        <div className="eyebrow">Showcase</div>
        <h3 className="display">{current.name}<em>.</em></h3>
        <p className="body-l" style={{marginTop:24,marginBottom:20,maxWidth:"40ch"}}>{current.desc}</p>
        {screenPicker}
      </div>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"center",flexShrink:0}}>
        {fpDevice==="mobile"  && <Phone screenId={tab} setScreen={setTab} />}
        {fpDevice==="tablet"  && <FPTabletFrame tab={tab} setTab={setTab} />}
      </div>
    </div>
  );
}

// Standalone phone with internal screen state — for home-page preview
function FamilyPortalPreview() {
  return <Phone screenId="home" setScreen={() => {}} />;
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
                  <div className="img">
                    <img src={other.img} alt={other.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>
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
  const [sending, setSending] = useState(false);
  const [sendErr, setSendErr] = useState("");

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
  async function submit() {
    if (!validate(2)) return;
    setSending(true);
    setSendErr("");
    try {
      const res = await fetch("https://main.d2rogr2lbyrjz1.amplifyapp.com/api/book-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:           data.name.trim(),
          email:          data.email.trim().toLowerCase(),
          role:           data.role.trim(),
          org:            data.org.trim(),
          segment:        data.segment,
          sites:          data.sites,
          focus:          data.focus,
          currentSystems: data.currentSystems.trim() || undefined,
          notes:          data.notes.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      setSubmitted(true);
      setStep(3);
    } catch (err) {
      setSendErr(err.message || "Failed to send. Please try again.");
    } finally {
      setSending(false);
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
                  <button className="form-back" onClick={back} disabled={sending}>← Back</button>
                  <button className="btn primary" onClick={submit} disabled={sending}>
                    {sending ? "Sending…" : <><span>Send request</span><span className="arrow">→</span></>}
                  </button>
                </div>
                {sendErr && (
                  <p style={{ marginTop: 12, color: "#c0392b", fontSize: 13, lineHeight: 1.5 }}>
                    {sendErr}
                  </p>
                )}
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

  // Demo gets full-screen treatment — no website nav/footer
  if (route.name === "demo") {
    return <DemoPage navigate={navigate} />;
  }

  let page;
  switch (route.name) {
    case "explore":  page = <ExplorePage navigate={navigate} />; break;
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
