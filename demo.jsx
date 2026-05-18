// ===================================================================
// JOLLY OAKS INTERACTIVE DEMO
// All data is fictional. No records are created or saved.
// ===================================================================

// ---- DEMO DATA -------------------------------------------------------

const JO_RESIDENTS = [
  { id:"r01", name:"Henry Thompson",   age:84, gender:"M", wing:"Wing A", level:"Frail Care",   room:"A12", status:"settled",    admission:"2024-03-15", gp:"Dr R. Naidoo", nok:"Robert Thompson",       dob:"1942-03-14", diagnosis:"CHF, osteoarthritis", diet:"Soft diet", allergies:"Penicillin" },
  { id:"r02", name:"Miriam du Plessis", age:79, gender:"F", wing:"Wing B", level:"Memory Care",  room:"B07", status:"alert",      admission:"2024-07-22", gp:"Dr R. Naidoo", nok:"Anneline du Plessis",   dob:"1947-11-03", diagnosis:"Alzheimer's Disease (moderate)", diet:"Regular", allergies:"None known" },
  { id:"r03", name:"Samuel Khumalo",   age:91, gender:"M", wing:"Wing A", level:"Frail Care",   room:"A05", status:"settled",    admission:"2022-01-10", gp:"Dr R. Naidoo", nok:"Lungelo Khumalo",       dob:"1934-08-27", diagnosis:"COPD, hypertension",  diet:"Low-sodium", allergies:"Sulfa drugs" },
  { id:"r04", name:"Eleanor Swartz",   age:76, gender:"F", wing:"Wing C", level:"Independent",  room:"C03", status:"active",     admission:"2025-02-18", gp:"Dr R. Naidoo", nok:"Paul Swartz",           dob:"1950-06-12", diagnosis:"Controlled HTN",      diet:"Regular", allergies:"None known" },
  { id:"r05", name:"Johannes Meyer",   age:88, gender:"M", wing:"Wing B", level:"Frail Care",   room:"B14", status:"settled",    admission:"2026-04-30", gp:"Dr R. Naidoo", nok:"Elsa Meyer",            dob:"1937-12-05", diagnosis:"Post-CVA, type 2 DM", diet:"Diabetic", allergies:"Aspirin" },
  { id:"r06", name:"Priya Govender",   age:82, gender:"F", wing:"Wing C", level:"General Care", room:"C11", status:"monitoring", admission:"2023-09-14", gp:"Dr R. Naidoo", nok:"Arjun Govender",        dob:"1944-04-22", diagnosis:"Type 2 DM, stage 3 CKD", diet:"Renal, diabetic", allergies:"Codeine" },
  { id:"r07", name:"Agnes Williams",   age:95, gender:"F", wing:"Wing A", level:"Frail Care",   room:"A01", status:"settled",    admission:"2021-06-03", gp:"Dr R. Naidoo", nok:"Grace Williams-Abed",   dob:"1931-01-19", diagnosis:"General frailty",     diet:"Fortified, puree", allergies:"Latex" },
  { id:"r08", name:"Charles Ferreira", age:73, gender:"M", wing:"Wing C", level:"Independent",  room:"C08", status:"active",     admission:"2026-01-15", gp:"Dr R. Naidoo", nok:"Sandra Ferreira",       dob:"1953-07-30", diagnosis:"Well, social admission", diet:"Regular", allergies:"None known" },
];

const JO_STAFF = [
  { id:"st01", name:"Sandra Botha",       role:"Facility Manager",    dept:"Management",   shift:"Day",   leave:false },
  { id:"st02", name:"Sr Linda van Wyk",   role:"Care Lead",           dept:"Clinical",     shift:"Day",   leave:false },
  { id:"st03", name:"Dr Ravi Naidoo",     role:"Visiting GP",         dept:"Medical",      shift:"Day",   leave:false },
  { id:"st04", name:"Nurse Thabo Dlamini",role:"Registered Nurse",    dept:"Clinical",     shift:"Night", leave:false },
  { id:"st05", name:"Sr Fikile Mokoena",  role:"Registered Nurse",    dept:"Clinical",     shift:"Day",   leave:false },
  { id:"st06", name:"Kevin Pietersen",    role:"Administrator",       dept:"Admin",        shift:"Day",   leave:false },
  { id:"st07", name:"Marco van der Berg", role:"Head Chef",           dept:"Kitchen",      shift:"Day",   leave:false },
  { id:"st08", name:"Sipho Khoza",        role:"Housekeeping Lead",   dept:"Housekeeping", shift:"Day",   leave:true  },
  { id:"st09", name:"Priscilla Adams",    role:"Care Worker",         dept:"Clinical",     shift:"Day",   leave:false },
  { id:"st10", name:"Nomsa Dube",         role:"Care Worker",         dept:"Clinical",     shift:"Night", leave:false },
  { id:"st11", name:"James Hendricks",    role:"Maintenance",         dept:"Facilities",   shift:"Day",   leave:false },
  { id:"st12", name:"Carol Timmermans",   role:"Receptionist",        dept:"Admin",        shift:"Day",   leave:false },
];

const JO_INCIDENTS = [
  { id:"INC-1241", date:"2026-05-16", type:"Fall",        resident:"Henry Thompson",   severity:"Moderate", status:"open",   owner:"Sr L. van Wyk" },
  { id:"INC-1239", date:"2026-05-14", type:"Medication",  resident:"Priya Govender",   severity:"Low",      status:"closed", owner:"Nurse T. Dlamini" },
  { id:"INC-1235", date:"2026-05-10", type:"Behaviour",   resident:"Miriam du Plessis",severity:"Low",      status:"closed", owner:"Sr F. Mokoena" },
  { id:"INC-1228", date:"2026-05-03", type:"Environmental",resident:"Agnes Williams",  severity:"Low",      status:"closed", owner:"Sr L. van Wyk" },
  { id:"INC-1219", date:"2026-04-24", type:"Fall",        resident:"Samuel Khumalo",   severity:"Moderate", status:"closed", owner:"Sr L. van Wyk" },
];

const JO_MEDS = [
  { resident:"r01", name:"Furosemide 40mg",    dose:"OD",  route:"Oral",  am:true,  noon:false, pm:false, night:false },
  { resident:"r01", name:"Bisoprolol 5mg",      dose:"OD",  route:"Oral",  am:true,  noon:false, pm:false, night:false },
  { resident:"r01", name:"Paracetamol 1g",      dose:"TDS", route:"Oral",  am:true,  noon:true,  pm:true,  night:false },
  { resident:"r02", name:"Donepezil 10mg",      dose:"OD",  route:"Oral",  am:false, noon:false, pm:false, night:true  },
  { resident:"r02", name:"Quetiapine 25mg",     dose:"PRN", route:"Oral",  am:false, noon:false, pm:false, night:true  },
  { resident:"r03", name:"Salbutamol inhaler",  dose:"PRN", route:"Inhaled",am:true, noon:false, pm:true,  night:false },
  { resident:"r03", name:"Amlodipine 5mg",      dose:"OD",  route:"Oral",  am:true,  noon:false, pm:false, night:false },
  { resident:"r05", name:"Metformin 500mg",     dose:"BD",  route:"Oral",  am:true,  noon:false, pm:true,  night:false },
  { resident:"r05", name:"Aspirin 75mg",        dose:"OD",  route:"Oral",  am:true,  noon:false, pm:false, night:false },
  { resident:"r06", name:"Insulin Glargine 20U",dose:"OD",  route:"SC",    am:false, noon:false, pm:false, night:true  },
  { resident:"r06", name:"Lisinopril 10mg",     dose:"OD",  route:"Oral",  am:true,  noon:false, pm:false, night:false },
  { resident:"r07", name:"Paracetamol 500mg",   dose:"QID", route:"Oral",  am:true,  noon:true,  pm:true,  night:true  },
];

const JO_VITALS = [
  { date:"May 12", bp:"138/84", hr:72,  temp:36.4, spo2:97, weight:68.2 },
  { date:"May 13", bp:"142/86", hr:74,  temp:36.5, spo2:96, weight:68.0 },
  { date:"May 14", bp:"136/82", hr:70,  temp:36.3, spo2:97, weight:68.1 },
  { date:"May 15", bp:"140/88", hr:76,  temp:36.6, spo2:95, weight:67.9 },
  { date:"May 16", bp:"144/90", hr:78,  temp:36.5, spo2:96, weight:68.0 },
  { date:"May 17", bp:"139/85", hr:73,  temp:36.4, spo2:97, weight:68.2 },
  { date:"May 18", bp:"137/83", hr:71,  temp:36.3, spo2:98, weight:68.1 },
];

const JO_TICKETS = [
  { id:"TKT-0412", subject:"Heater not working — Room B14",   type:"Maintenance", priority:"High",   status:"in_progress", owner:"J. Hendricks",  age:"2d" },
  { id:"TKT-0411", subject:"WiFi intermittent — Wing C lounge",type:"IT",         priority:"Normal", status:"open",        owner:"Unassigned",    age:"3d" },
  { id:"TKT-0409", subject:"Shower chair replacement — A12",  type:"Maintenance", priority:"Normal", status:"open",        owner:"J. Hendricks",  age:"5d" },
  { id:"TKT-0407", subject:"Family request — extra visiting hour",type:"Service", priority:"Low",    status:"pending",     owner:"C. Timmermans", age:"5d" },
  { id:"TKT-0404", subject:"Medication query — Priya Govender",type:"Clinical",   priority:"High",   status:"open",        owner:"Sr van Wyk",    age:"6d" },
  { id:"TKT-0398", subject:"Light bulb replacement — B07",    type:"Maintenance", priority:"Low",    status:"open",        owner:"Unassigned",    age:"8d" },
  { id:"TKT-0391", subject:"Annual fire equipment inspection", type:"Compliance", priority:"Normal", status:"open",        owner:"S. Botha",      age:"12d" },
];

const JO_ASSETS = [
  { id:"AST-0021", name:"Electric Hospital Bed",   location:"Room A01", status:"ok",    service:"2026-08-15", cert:"current" },
  { id:"AST-0034", name:"IV Pump — Baxter",        location:"Nurses Station A", status:"ok", service:"2026-06-01", cert:"current" },
  { id:"AST-0047", name:"Wheelchair — Heavy Duty", location:"Room B14", status:"ok",    service:"2026-09-30", cert:"current" },
  { id:"AST-0055", name:"Blood Pressure Monitor",  location:"Treatment Room", status:"due",  service:"2026-05-20", cert:"current" },
  { id:"AST-0062", name:"Portable Oxygen Unit",    location:"Store Room",     status:"ok",   service:"2026-07-10", cert:"current" },
  { id:"AST-0078", name:"Ceiling Hoist — Wing A",  location:"Wing A Corridor",status:"ok",   service:"2026-10-01", cert:"current" },
  { id:"AST-0091", name:"Defibrillator (AED)",     location:"Reception",      status:"ok",   service:"2026-05-30", cert:"current" },
  { id:"AST-0104", name:"Nebuliser — Medel Clenny",location:"Treatment Room",  status:"ok",  service:"2026-11-15", cert:"current" },
];

const JO_DOCS = [
  { id:"JO-POL-0012", title:"Medication Management Policy",       version:"v3.1", status:"approved",  review:"2027-03-01", owner:"Sr van Wyk" },
  { id:"JO-POL-0008", title:"Falls Prevention & Management SOP",  version:"v2.4", status:"approved",  review:"2026-11-15", owner:"Sr van Wyk" },
  { id:"JO-POL-0019", title:"POPIA Resident Information Handling", version:"v1.2", status:"approved",  review:"2027-01-10", owner:"S. Botha" },
  { id:"JO-POL-0025", title:"Infection Prevention & Control SOP", version:"v4.0", status:"approved",  review:"2026-08-20", owner:"Sr Mokoena" },
  { id:"JO-POL-0031", title:"End-of-Life Care Pathway",           version:"v2.0", status:"review",    review:"2026-06-01", owner:"Sr van Wyk" },
  { id:"JO-POL-0033", title:"Emergency Evacuation Procedure",     version:"v1.5", status:"approved",  review:"2027-05-01", owner:"S. Botha" },
];

const JO_MENU = {
  breakfast: ["Oat porridge with honey", "Toast with marmalade", "Fresh fruit salad", "Scrambled eggs"],
  lunch:     ["Chicken casserole with rice", "Steamed vegetables", "Garden salad", "Yoghurt"],
  dinner:    ["Beef stew with mashed potato", "Buttered carrots & beans", "Bread roll", "Jelly & custard"],
  snacks:    ["Morning: tea & rusks", "Afternoon: cake & coffee"],
};

const JO_ENQUIRIES = [
  { id:"ENQ-0087", name:"Margaret Olifant",   age:80, contact:"Trish Olifant", date:"2026-05-15", level:"Frail Care",  status:"assessment_due",   source:"Referral" },
  { id:"ENQ-0083", name:"Ronald Pretorius",   age:77, contact:"Bea Pretorius", date:"2026-05-09", level:"Independent", status:"tour_booked",       source:"Website" },
  { id:"ENQ-0079", name:"Dora Nkosi",         age:88, contact:"Mpho Nkosi",   date:"2026-04-28", level:"Frail Care",  status:"pre_welcome_checks", source:"GP Referral" },
];

// ---- UTILITY COMPONENTS -----------------------------------------------

function DemoBadge({ status }) {
  const map = {
    settled:    ["#d1fae5","#065f46","Settled"],
    active:     ["#dbeafe","#1e40af","Active"],
    alert:      ["#fef3c7","#92400e","Alert"],
    monitoring: ["#fce7f3","#9d174d","Monitoring"],
    open:       ["#fee2e2","#991b1b","Open"],
    closed:     ["#d1fae5","#065f46","Closed"],
    in_progress:["#dbeafe","#1e40af","In Progress"],
    pending:    ["#fef3c7","#92400e","Pending"],
    approved:   ["#d1fae5","#065f46","Approved"],
    review:     ["#fef3c7","#92400e","In Review"],
    ok:         ["#d1fae5","#065f46","OK"],
    due:        ["#fee2e2","#991b1b","Due"],
    assessment_due:   ["#fce7f3","#9d174d","Assessment Due"],
    tour_booked:      ["#dbeafe","#1e40af","Tour Booked"],
    pre_welcome_checks:["#d1fae5","#065f46","Pre-Welcome"],
    current:    ["#d1fae5","#065f46","Current"],
    High:       ["#fee2e2","#991b1b","High"],
    Normal:     ["#dbeafe","#1e40af","Normal"],
    Low:        ["#f3f4f6","#374151","Low"],
    Moderate:   ["#fef3c7","#92400e","Moderate"],
  };
  const [bg, fg, label] = map[status] || ["#f3f4f6","#374151", status];
  return (
    <span style={{ background:bg, color:fg, padding:"2px 10px", borderRadius:12, fontSize:12, fontWeight:600, whiteSpace:"nowrap" }}>
      {label}
    </span>
  );
}

function DemoStat({ label, value, note, color }) {
  return (
    <div className="demo-stat-card">
      <div className="demo-stat-value" style={{ color: color || "var(--jo-ink)" }}>{value}</div>
      <div className="demo-stat-label">{label}</div>
      {note && <div className="demo-stat-note">{note}</div>}
    </div>
  );
}

function DemoModuleHeader({ eyebrow, title, action }) {
  return (
    <div className="demo-module-header">
      <div>
        <div className="demo-eyebrow">{eyebrow}</div>
        <h2 className="demo-module-title">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function DemoTable({ cols, rows, onRow }) {
  return (
    <table className="demo-table">
      <thead>
        <tr>{cols.map(c => <th key={c}>{c}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} onClick={onRow ? () => onRow(r) : undefined} className={onRow ? "clickable" : ""}>
            {r.cells.map((c, j) => <td key={j}>{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DemoCard({ children, style }) {
  return <div className="demo-card" style={style}>{children}</div>;
}

function DemoSection({ title, children }) {
  return (
    <div style={{ marginBottom:28 }}>
      {title && <div className="demo-section-title">{title}</div>}
      {children}
    </div>
  );
}

// ---- SIDEBAR -------------------------------------------------------

const DEMO_NAV = [
  { group: "Front of House" },
  { id:"facility-home", label:"Facility Home",       num:"01" },
  { id:"welcome",       label:"Welcome",             num:"02" },
  { id:"visitors",      label:"Visitors & Security", num:"03" },
  { id:"pre-welcome",   label:"Pre-Welcome Checks",  num:"04" },
  { group: "Care" },
  { id:"residents",     label:"Residents",           num:"05" },
  { id:"care-plans",    label:"Care Plans",          num:"06" },
  { id:"medication",    label:"Medication MAR",      num:"07" },
  { id:"observations",  label:"Observations",        num:"08" },
  { id:"dementia",      label:"Dementia Care",       num:"09" },
  { group: "Portals" },
  { id:"family-portal", label:"Family Portal",       num:"10" },
  { id:"doctor-portal", label:"Doctor Portal",       num:"11" },
  { group: "Hospitality" },
  { id:"kitchen",       label:"Kitchen & Nutrition", num:"12" },
  { id:"housekeeping",  label:"Housekeeping",        num:"13" },
  { group: "Operations" },
  { id:"qms",           label:"QM Engine",           num:"14" },
  { id:"assets",        label:"Asset Management",    num:"15" },
  { id:"hr",            label:"HR & Workforce",      num:"16" },
  { id:"finance",       label:"Finance",             num:"17" },
  { id:"service-desk",  label:"Service Desk",        num:"18" },
  { group: "Executive" },
  { id:"exec-command",  label:"Executive Command",   num:"19" },
  { id:"exec-kpis",     label:"Executive KPIs",      num:"20" },
];

function DemoSidebar({ active, setActive, onExit }) {
  return (
    <aside className="demo-sidebar">
      <div className="demo-sidebar-brand">
        <div className="demo-sidebar-mark">JO</div>
        <div>
          <div className="demo-sidebar-name">Jolly Oaks</div>
          <div className="demo-sidebar-sub">Senior Living</div>
        </div>
      </div>
      <nav className="demo-sidebar-nav">
        {DEMO_NAV.map((item, i) => {
          if (item.group) return <div key={i} className="demo-nav-group">{item.group}</div>;
          return (
            <button
              key={item.id}
              className={"demo-nav-item" + (active === item.id ? " active" : "")}
              onClick={() => setActive(item.id)}
            >
              <span className="demo-nav-num">{item.num}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="demo-sidebar-footer">
        <div className="demo-sidebar-user">
          <div className="demo-sidebar-avatar">DU</div>
          <div>
            <div style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.9)" }}>Demo User</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)" }}>Facility Manager</div>
          </div>
        </div>
        <button className="demo-exit-btn" onClick={onExit}>← Exit Demo</button>
      </div>
    </aside>
  );
}

// ---- MODULE 01: FACILITY HOME ----------------------------------------

function FacilityHomeModule({ setActive }) {
  const flags = [
    { text:"Henry Thompson — fall reported 16 May · INC-1241 open", type:"warn" },
    { text:"BP Monitor AST-0055 service due 20 May", type:"warn" },
    { text:"Ticket TKT-0412 overdue — Room B14 heater", type:"warn" },
    { text:"POPIA training: 3 staff expiring in 30 days", type:"info" },
  ];
  const activity = [
    { time:"08:42", event:"Morning medication round complete — Wing A (38/38)", by:"Sr van Wyk" },
    { time:"08:51", event:"Morning medication round complete — Wing B (24/24)", by:"Sr Mokoena" },
    { time:"09:14", event:"Care check recorded — Henry Thompson, settled", by:"Sr van Wyk" },
    { time:"09:31", event:"Visitor signed in — Robert Thompson (family of A12)", by:"C. Timmermans" },
    { time:"10:02", event:"Housekeeping round complete — Wing C", by:"N. Dube" },
    { time:"10:45", event:"Dr Naidoo visiting — consultations scheduled for 3 residents", by:"K. Pietersen" },
  ];
  return (
    <div className="demo-module-content">
      <DemoModuleHeader eyebrow="Today · Monday 18 May 2026" title="Jolly Oaks — Facility Home" />
      <div className="demo-stats-row">
        <DemoStat label="Residents" value="48" note="46 occupied · 2 vacant" />
        <DemoStat label="Open Incidents" value="1" note="INC-1241 active" color="#b45309" />
        <DemoStat label="Medication Adherence" value="97.2%" note="Last 7 days" color="#065f46" />
        <DemoStat label="Training Compliance" value="89%" note="3 expiring soon" color="#1e40af" />
        <DemoStat label="Open Tickets" value="7" note="2 high priority" color="#6b21a8" />
      </div>

      <div className="demo-two-col">
        <DemoCard>
          <div className="demo-card-title">⚑ Today's Flags</div>
          {flags.map((f,i) => (
            <div key={i} className={"demo-flag demo-flag--" + f.type}>
              {f.text}
            </div>
          ))}
        </DemoCard>
        <DemoCard>
          <div className="demo-card-title">Quick Navigation</div>
          {[
            ["Residents (48)","residents"],["Medication MAR","medication"],
            ["Log Incident","qms"],["Observations","observations"],
            ["HR & Roster","hr"],["Executive View","exec-command"],
          ].map(([label, mod]) => (
            <button key={mod} className="demo-quick-btn" onClick={() => setActive(mod)}>{label} →</button>
          ))}
        </DemoCard>
      </div>

      <DemoCard>
        <div className="demo-card-title">Activity Feed · Today</div>
        <div className="demo-activity">
          {activity.map((a,i) => (
            <div key={i} className="demo-activity-row">
              <span className="demo-activity-time">{a.time}</span>
              <span className="demo-activity-event">{a.event}</span>
              <span className="demo-activity-by">{a.by}</span>
            </div>
          ))}
        </div>
      </DemoCard>
    </div>
  );
}

// ---- MODULE 02: WELCOME ----------------------------------------------

function WelcomeModule() {
  return (
    <div className="demo-module-content">
      <DemoModuleHeader eyebrow="Module 02 · Front of House" title="Welcome — Admissions" />
      <div className="demo-stats-row">
        <DemoStat label="Enquiries Open" value="3" note="This month" />
        <DemoStat label="Admissions This Month" value="1" note="Johannes Meyer, 30 Apr" color="#065f46" />
        <DemoStat label="Occupancy" value="95.8%" note="46 / 48 beds" color="#065f46" />
        <DemoStat label="Avg. Enquiry → Admission" value="14 days" />
      </div>
      <DemoSection title="Active Enquiries">
        <DemoTable
          cols={["ID","Name","Age","Care Level","Source","Status"]}
          rows={JO_ENQUIRIES.map(e => ({
            cells:[
              <span style={{ fontFamily:"monospace", fontSize:12 }}>{e.id}</span>,
              e.name, e.age, e.level, e.source,
              <DemoBadge status={e.status} />
            ]
          }))}
        />
      </DemoSection>
      <DemoSection title="Room Readiness — B14 (Johannes Meyer, admitted 30 Apr)">
        {[
          { item:"Room cleaned & inspected", done:true },
          { item:"Bed configured (HOB, side rails)", done:true },
          { item:"Emergency cord tested", done:true },
          { item:"Welcome pack placed in room", done:true },
          { item:"Dietary profile loaded into kitchen system", done:true },
          { item:"GP referral letter filed", done:true },
          { item:"Family induction completed", done:true },
          { item:"14-day review scheduled", done:false },
        ].map((c,i) => (
          <div key={i} className="demo-checklist-row">
            <span className={"demo-check-icon " + (c.done ? "done" : "pending")}>{c.done ? "✓" : "○"}</span>
            <span style={{ textDecoration: c.done ? "none" : "none", color: c.done ? "var(--jo-muted)" : "var(--jo-ink)" }}>{c.item}</span>
          </div>
        ))}
      </DemoSection>
    </div>
  );
}

// ---- MODULE 03: VISITORS & SECURITY ----------------------------------

function VisitorsModule() {
  const active = [
    { name:"Robert Thompson",  visiting:"Henry Thompson (A12)",  arrived:"09:31", purpose:"Family" },
    { name:"Elsa Meyer",       visiting:"Johannes Meyer (B14)",  arrived:"10:15", purpose:"Family" },
    { name:"Dr Ravi Naidoo",   visiting:"3 residents",           arrived:"10:45", purpose:"Medical" },
    { name:"Pieter du Toit",   visiting:"Eleanor Swartz (C03)",  arrived:"11:02", purpose:"Family" },
  ];
  return (
    <div className="demo-module-content">
      <DemoModuleHeader eyebrow="Module 03 · Front of House" title="Visitors & Security" />
      <div className="demo-stats-row">
        <DemoStat label="Active Visitors" value="4" note="Signed in" />
        <DemoStat label="Visitors Today" value="6" note="2 already departed" color="#065f46" />
        <DemoStat label="Security Alerts" value="0" note="All clear" color="#065f46" />
        <DemoStat label="After-Hours Code" value="Active" note="Intercom monitored" />
      </div>
      <DemoSection title="Active Board — Visitors on Site">
        <DemoTable
          cols={["Visitor Name","Visiting","Arrived","Purpose","Status"]}
          rows={active.map(v => ({
            cells:[v.name, v.visiting, v.arrived, v.purpose, <DemoBadge status="active" />]
          }))}
        />
      </DemoSection>
      <DemoSection title="Security Log — Last 24 Hours">
        {[
          { time:"07:00", event:"Day shift gate code changed — all relevant staff notified" },
          { time:"08:15", event:"Delivery: Clicks Pharmacy — received by Sr van Wyk" },
          { time:"09:31", event:"Robert Thompson signed in — family visit, A12" },
          { time:"10:45", event:"Dr Naidoo signed in — medical visits" },
          { time:"22:00", event:"Night shift handover — all clear, T. Dlamini on duty" },
        ].map((l,i) => (
          <div key={i} className="demo-activity-row">
            <span className="demo-activity-time">{l.time}</span>
            <span className="demo-activity-event">{l.event}</span>
          </div>
        ))}
      </DemoSection>
    </div>
  );
}

// ---- MODULE 04: PRE-WELCOME CHECKS -----------------------------------

function PreWelcomeModule() {
  const checks = [
    { cat:"Clinical",   item:"GP referral letter received",          done:true  },
    { cat:"Clinical",   item:"Current medication list from GP",       done:true  },
    { cat:"Clinical",   item:"Cognitive assessment (MMSE/ACE)",       done:true  },
    { cat:"Clinical",   item:"Nutritional assessment complete",        done:true  },
    { cat:"Clinical",   item:"Falls risk tool completed",             done:true  },
    { cat:"Financial",  item:"Levy schedule signed",                  done:true  },
    { cat:"Financial",  item:"ID document on file",                   done:true  },
    { cat:"Financial",  item:"Debit order mandate signed",            done:true  },
    { cat:"Financial",  item:"Deposit paid",                          done:true  },
    { cat:"Compliance", item:"POPIA consent form signed",             done:true  },
    { cat:"Compliance", item:"NOK / next-of-kin declaration",         done:true  },
    { cat:"Compliance", item:"Medical aid details confirmed",         done:false },
    { cat:"Compliance", item:"Power of attorney (if applicable)",     done:true  },
  ];
  return (
    <div className="demo-module-content">
      <DemoModuleHeader eyebrow="Module 04 · Front of House" title="Pre-Welcome Checks" />
      <DemoCard style={{ marginBottom:20 }}>
        <div style={{ display:"flex", gap:16, alignItems:"center" }}>
          <div>
            <div className="demo-eyebrow">Pending admission</div>
            <div style={{ fontWeight:700, fontSize:18 }}>Margaret Olifant · 80F · Frail Care</div>
            <div style={{ color:"var(--jo-muted)", fontSize:13 }}>ENQ-0087 · Referred by Medicross Somerset West · Expected admission: 25 May 2026</div>
          </div>
          <div style={{ marginLeft:"auto" }}>
            <DemoBadge status="assessment_due" />
          </div>
        </div>
      </DemoCard>
      {["Clinical","Financial","Compliance"].map(cat => (
        <DemoSection key={cat} title={cat + " Checks"}>
          {checks.filter(c => c.cat === cat).map((c,i) => (
            <div key={i} className="demo-checklist-row">
              <span className={"demo-check-icon " + (c.done ? "done" : "pending")}>{c.done ? "✓" : "○"}</span>
              <span style={{ color: c.done ? "var(--jo-muted)" : "var(--jo-ink)" }}>{c.item}</span>
              {!c.done && <span style={{ marginLeft:"auto", fontSize:11, color:"#b45309", fontWeight:600 }}>OUTSTANDING</span>}
            </div>
          ))}
        </DemoSection>
      ))}
    </div>
  );
}

// ---- MODULE 05: RESIDENTS --------------------------------------------

function ResidentsModule() {
  const [selected, setSelected] = useState(null);
  if (selected) return <ResidentProfile resident={selected} onBack={() => setSelected(null)} />;
  return (
    <div className="demo-module-content">
      <DemoModuleHeader eyebrow="Module 05 · Care" title="Residents" />
      <div className="demo-stats-row">
        <DemoStat label="Total Residents" value="48" />
        <DemoStat label="Frail Care" value="32" />
        <DemoStat label="General / Memory" value="10" />
        <DemoStat label="Independent" value="6" />
      </div>
      <DemoSection title="Resident Directory — Demo view (8 of 48)">
        <DemoTable
          cols={["Resident","Room","Level","Status","NOK","Admitted"]}
          rows={JO_RESIDENTS.map(r => ({
            cells:[
              <span style={{ fontWeight:600 }}>{r.name}</span>,
              r.room, r.level,
              <DemoBadge status={r.status} />,
              r.nok, r.admission
            ]
          }))}
          onRow={r => setSelected(JO_RESIDENTS.find(x => x.name === r.cells[0].props.children))}
        />
      </DemoSection>
      <div style={{ fontSize:12, color:"var(--jo-muted)", marginTop:8 }}>Click any resident to open their profile.</div>
    </div>
  );
}

function ResidentProfile({ resident: r, onBack }) {
  const meds = JO_MEDS.filter(m => m.resident === r.id);
  const incidents = JO_INCIDENTS.filter(i => i.resident === r.name);
  const vitals = r.id === "r01" ? JO_VITALS : null;
  return (
    <div className="demo-module-content">
      <button className="demo-back-btn" onClick={onBack}>← All Residents</button>
      <DemoModuleHeader eyebrow={"Resident Profile · " + r.room} title={r.name} />
      <div className="demo-two-col">
        <DemoCard>
          <div className="demo-card-title">Demographics</div>
          {[
            ["DOB", r.dob + " (age " + r.age + ")"],
            ["Gender", r.gender === "M" ? "Male" : "Female"],
            ["Wing", r.wing + " · " + r.room],
            ["Care Level", r.level],
            ["Admission", r.admission],
            ["GP", r.gp],
            ["NOK", r.nok],
            ["Allergies", r.allergies],
            ["Diet", r.diet],
          ].map(([k,v]) => (
            <div key={k} className="demo-info-row"><span className="demo-info-key">{k}</span><span>{v}</span></div>
          ))}
        </DemoCard>
        <DemoCard>
          <div className="demo-card-title">Diagnosis</div>
          <div style={{ color:"var(--jo-ink)", lineHeight:1.7 }}>{r.diagnosis}</div>
          <div className="demo-card-title" style={{ marginTop:20 }}>Status</div>
          <DemoBadge status={r.status} />
          <div className="demo-card-title" style={{ marginTop:20 }}>Current Medications ({meds.length})</div>
          {meds.length === 0 && <div style={{ color:"var(--jo-muted)", fontSize:13 }}>No demo meds loaded for this resident.</div>}
          {meds.map((m,i) => (
            <div key={i} className="demo-med-row">
              <span style={{ fontWeight:600 }}>{m.name}</span>
              <span className="demo-med-dose">{m.dose} · {m.route}</span>
            </div>
          ))}
        </DemoCard>
      </div>
      {vitals && (
        <DemoCard>
          <div className="demo-card-title">Observations — Last 7 Days (Henry Thompson)</div>
          <DemoTable
            cols={["Date","BP","HR","Temp °C","SpO₂ %","Weight kg"]}
            rows={vitals.map(v => ({
              cells:[v.date, v.bp, v.hr, v.temp, v.spo2, v.weight]
            }))}
          />
        </DemoCard>
      )}
      {incidents.length > 0 && (
        <DemoCard>
          <div className="demo-card-title">Recent Incidents</div>
          <DemoTable
            cols={["Ref","Date","Type","Severity","Status"]}
            rows={incidents.map(i => ({
              cells:[<span style={{ fontFamily:"monospace", fontSize:12 }}>{i.id}</span>, i.date, i.type, <DemoBadge status={i.severity} />, <DemoBadge status={i.status} />]
            }))}
          />
        </DemoCard>
      )}
    </div>
  );
}

// ---- MODULE 06: CARE PLANS ------------------------------------------

function CarePlansModule() {
  const plans = [
    { resident:"Henry Thompson",  goal:"Mobility maintained, fall risk managed",          review:"2026-06-15", status:"active",  owner:"Sr van Wyk"  },
    { resident:"Miriam du Plessis",goal:"Behavioural triggers identified, routine stable", review:"2026-05-30", status:"active",  owner:"Sr Mokoena"  },
    { resident:"Samuel Khumalo",  goal:"Respiratory managed, comfort maintained",          review:"2026-07-01", status:"active",  owner:"Sr van Wyk"  },
    { resident:"Priya Govender",  goal:"Blood glucose within target range",               review:"2026-06-01", status:"active",  owner:"Sr Mokoena"  },
    { resident:"Johannes Meyer",  goal:"Post-CVA rehabilitation, DM monitoring",          review:"2026-06-30", status:"active",  owner:"Sr van Wyk"  },
    { resident:"Agnes Williams",  goal:"Comfort care, dignity, pain management",          review:"2026-05-25", status:"review",  owner:"Sr van Wyk"  },
    { resident:"Eleanor Swartz",  goal:"Independence maintained, social engagement",      review:"2026-09-01", status:"active",  owner:"Sr Mokoena"  },
    { resident:"Charles Ferreira",goal:"Wellbeing, social participation, health baseline",review:"2026-08-15", status:"active",  owner:"Sr van Wyk"  },
  ];
  return (
    <div className="demo-module-content">
      <DemoModuleHeader eyebrow="Module 06 · Care" title="Care Plans" />
      <div className="demo-stats-row">
        <DemoStat label="Active Plans" value="7" />
        <DemoStat label="Due for Review" value="2" note="Within 14 days" color="#b45309" />
        <DemoStat label="Overdue Reviews" value="0" color="#065f46" />
      </div>
      <DemoSection title="Care Plan Register">
        <DemoTable
          cols={["Resident","Primary Goal","Next Review","Status","Owner"]}
          rows={plans.map(p => ({
            cells:[
              <span style={{ fontWeight:600 }}>{p.resident}</span>,
              <span style={{ fontSize:13 }}>{p.goal}</span>,
              p.review,
              <DemoBadge status={p.status} />,
              p.owner
            ]
          }))}
        />
      </DemoSection>
    </div>
  );
}

// ---- MODULE 07: MEDICATION MAR ---------------------------------------

function MedicationModule() {
  const rounds = [
    { time:"06:00 AM", wing:"Wing A", total:38, done:38, status:"complete" },
    { time:"06:30 AM", wing:"Wing B", total:24, done:24, status:"complete" },
    { time:"08:00 AM", wing:"Wing C", total:12, done:11, status:"partial",  note:"1 refusal — coded" },
    { time:"12:00 PM", wing:"Wing A", total:22, done:22, status:"complete" },
    { time:"12:30 PM", wing:"Wing B", total:14, done:14, status:"complete" },
    { time:"06:00 PM", wing:"All",    total:74, done:0,  status:"scheduled" },
    { time:"10:00 PM", wing:"Wing A+B",total:18,done:0,  status:"scheduled" },
  ];
  return (
    <div className="demo-module-content">
      <DemoModuleHeader eyebrow="Module 07 · Care" title="Medication MAR — 18 May 2026" />
      <div className="demo-stats-row">
        <DemoStat label="Adherence Today" value="97.8%" color="#065f46" />
        <DemoStat label="Rounds Complete" value="5 / 7" />
        <DemoStat label="Refusals" value="1" note="Coded" color="#b45309" />
        <DemoStat label="Controlled Substances" value="0 variance" note="All reconciled" color="#065f46" />
        <DemoStat label="Pharmacy Reconciliation" value="Up to date" color="#065f46" />
      </div>
      <DemoSection title="Medication Rounds — Today">
        <DemoTable
          cols={["Round Time","Wing","Administered","Status","Notes"]}
          rows={rounds.map(r => ({
            cells:[
              r.time, r.wing,
              r.status === "scheduled" ? <span style={{ color:"var(--jo-muted)" }}>Scheduled</span> : `${r.done} / ${r.total}`,
              <span className={"demo-round-badge demo-round--" + r.status}>{r.status === "complete" ? "✓ Complete" : r.status === "partial" ? "⚠ Partial" : "Scheduled"}</span>,
              r.note || "—"
            ]
          }))}
        />
      </DemoSection>
      <DemoSection title="Individual Medication Schedule (Demo Residents)">
        <DemoTable
          cols={["Resident","Medication","Dose","Route","AM","Noon","PM","Night"]}
          rows={JO_MEDS.slice(0,8).map(m => {
            const res = JO_RESIDENTS.find(r => r.id === m.resident);
            return { cells:[
              res?.name || m.resident, m.name, m.dose, m.route,
              m.am ? "✓" : "—", m.noon ? "✓" : "—",
              m.pm ? "✓" : "—", m.night ? "✓" : "—"
            ]};
          })}
        />
      </DemoSection>
      <DemoCard>
        <div className="demo-card-title">Controlled Substance Log — Wing A · 18 May 2026</div>
        {[
          { time:"06:14", drug:"Morphine Sulphate 10mg (oral)",  res:"Agnes Williams",   admin:"Sr van Wyk", witness:"P. Adams",   balance:18 },
          { time:"06:28", drug:"Morphine Sulphate 10mg (oral)",  res:"Samuel Khumalo",   admin:"Sr van Wyk", witness:"P. Adams",   balance:16 },
          { time:"10:30", drug:"Morphine Sulphate 10mg (oral)",  res:"Agnes Williams",   admin:"Sr van Wyk", witness:"Sr Mokoena", balance:14 },
        ].map((l,i) => (
          <div key={i} className="demo-activity-row">
            <span className="demo-activity-time">{l.time}</span>
            <span className="demo-activity-event" style={{ flex:2 }}>{l.drug} — {l.res}</span>
            <span className="demo-activity-by">Admin: {l.admin} · Witness: {l.witness} · Balance: {l.balance}</span>
          </div>
        ))}
      </DemoCard>
    </div>
  );
}

// ---- MODULE 08: OBSERVATIONS -----------------------------------------

function ObservationsModule() {
  return (
    <div className="demo-module-content">
      <DemoModuleHeader eyebrow="Module 08 · Care" title="Observations" />
      <DemoCard style={{ marginBottom:20 }}>
        <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:12 }}>
          <div>
            <div className="demo-eyebrow">Showing observations for</div>
            <div style={{ fontWeight:700, fontSize:16 }}>Henry Thompson · Room A12 · Frail Care</div>
          </div>
        </div>
        <DemoTable
          cols={["Date","Blood Pressure","Heart Rate","Temp °C","SpO₂ %","Weight kg","Recorded by"]}
          rows={JO_VITALS.map(v => ({
            cells:[
              v.date, v.bp,
              <span style={{ color: v.hr > 76 ? "#b45309" : "inherit" }}>{v.hr}</span>,
              v.temp,
              <span style={{ color: v.spo2 < 96 ? "#b45309" : "#065f46" }}>{v.spo2}</span>,
              v.weight,
              "Sr van Wyk"
            ]
          }))}
        />
      </DemoCard>
      <div className="demo-two-col">
        <DemoCard>
          <div className="demo-card-title">Trend Summary — BP (7 days)</div>
          <div className="demo-sparkline">
            {JO_VITALS.map((v,i) => {
              const sys = parseInt(v.bp);
              const h = ((sys - 130) / 20) * 40 + 20;
              return (
                <div key={i} className="demo-bar-wrap">
                  <div className="demo-bar" style={{ height: Math.max(10, h), background: sys > 142 ? "#f87171" : "#6ee7b7" }} />
                  <div className="demo-bar-label">{v.date.replace("May ","")}</div>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize:11, color:"var(--jo-muted)", marginTop:8 }}>Systolic BP · Target &lt; 140 mmHg</div>
        </DemoCard>
        <DemoCard>
          <div className="demo-card-title">Alerts & Trends</div>
          <div className="demo-flag demo-flag--warn">BP reading 15 May elevated (144/90) — noted by Sr van Wyk</div>
          <div className="demo-flag demo-flag--info">SpO₂ 95% on 15 May — reviewed, no intervention required</div>
          <div className="demo-flag demo-flag--info">Weight stable — no significant change over 7 days</div>
          <div style={{ marginTop:16 }}>
            <div className="demo-card-title">Pending Observations (Today)</div>
            {[
              ["Samuel Khumalo","Scheduled 14:00","Sr van Wyk"],
              ["Miriam du Plessis","Scheduled 14:30","Sr Mokoena"],
              ["Priya Govender","Scheduled 15:00","Sr Mokoena"],
            ].map(([r,t,by],i) => (
              <div key={i} className="demo-info-row">
                <span style={{ fontWeight:600 }}>{r}</span>
                <span style={{ color:"var(--jo-muted)", fontSize:12 }}>{t} · {by}</span>
              </div>
            ))}
          </div>
        </DemoCard>
      </div>
    </div>
  );
}

// ---- MODULE 09: DEMENTIA CARE ----------------------------------------

function DementiaCareModule() {
  return (
    <div className="demo-module-content">
      <DemoModuleHeader eyebrow="Module 09 · Care" title="Dementia Care" />
      <DemoCard style={{ marginBottom:20 }}>
        <div style={{ fontWeight:700, marginBottom:4 }}>Miriam du Plessis · Room B07 · Memory Care</div>
        <div style={{ color:"var(--jo-muted)", fontSize:13 }}>Alzheimer's Disease (moderate) · Admitted 22 Jul 2024</div>
      </DemoCard>
      <div className="demo-two-col">
        <DemoCard>
          <div className="demo-card-title">Behavioural Log — Last 7 Days</div>
          {[
            { date:"12 May", behaviour:"Agitation PM — redirected with music therapy", trigger:"Sundowning", resolved:true },
            { date:"13 May", behaviour:"Wandering — Wing B corridor 21:30", trigger:"Disorientation", resolved:true },
            { date:"14 May", behaviour:"Refused dinner — encouraged by Sr Mokoena", trigger:"Fatigue", resolved:true },
            { date:"15 May", behaviour:"Calm and engaged — activity session", trigger:"—", resolved:true },
            { date:"16 May", behaviour:"Agitation AM — family call calmed", trigger:"Unfamiliar staff", resolved:true },
            { date:"17 May", behaviour:"Settled — good engagement at breakfast", trigger:"—", resolved:true },
          ].map((b,i) => (
            <div key={i} className="demo-activity-row">
              <span className="demo-activity-time">{b.date}</span>
              <span className="demo-activity-event">{b.behaviour}</span>
              <span className="demo-activity-by" style={{ color: b.trigger === "—" ? "#065f46" : "#b45309" }}>{b.trigger}</span>
            </div>
          ))}
        </DemoCard>
        <DemoCard>
          <div className="demo-card-title">Routine & Triggers Profile</div>
          {[
            ["Calming triggers", "Music (Afrikaans classics), family photos, garden walks"],
            ["Known agitation triggers", "Unfamiliar staff, sudden noise, sundowning (after 17:00)"],
            ["Wandering risk", "Moderate — GPS wristband active"],
            ["Communication", "Responds well to Afrikaans, simple sentences"],
            ["Sleep pattern", "Naps 14:00–15:30, settles 21:00"],
            ["Preferred carer", "Sr Mokoena, Priscilla Adams"],
          ].map(([k,v]) => (
            <div key={k} className="demo-info-row" style={{ alignItems:"flex-start" }}>
              <span className="demo-info-key" style={{ minWidth:160 }}>{k}</span>
              <span style={{ fontSize:13 }}>{v}</span>
            </div>
          ))}
          <div className="demo-card-title" style={{ marginTop:20 }}>Wandering Alerts — Last 30 Days</div>
          <div className="demo-flag demo-flag--warn">13 May 21:30 — Wing B corridor · auto-alert sent to Nurse Dlamini · resolved 21:38</div>
          <div className="demo-flag demo-flag--info">4 May 20:15 — Exit door attempt · alarm activated · resolved immediately</div>
        </DemoCard>
      </div>
    </div>
  );
}

// ---- MODULE 10: FAMILY PORTAL ----------------------------------------

function FamilyPortalModule() {
  return (
    <div className="demo-module-content">
      <DemoModuleHeader eyebrow="Module 10 · Portals" title="Family Portal — Staff View" />
      <div className="demo-stats-row">
        <DemoStat label="Registered Families" value="41" />
        <DemoStat label="Messages (unread)" value="3" color="#b45309" />
        <DemoStat label="Visit Requests Open" value="2" />
        <DemoStat label="Surveys Pending" value="5" />
      </div>
      <div className="demo-two-col">
        <DemoCard>
          <div className="demo-card-title">Unread Family Messages</div>
          {[
            { family:"Robert Thompson", resident:"Henry Thompson", time:"09:45", msg:"Is Dad's physio appointment still this Thursday? We'd like to be there." },
            { family:"Arjun Govender",  resident:"Priya Govender",  time:"Yesterday", msg:"Please confirm Mum's last HbA1c result — our GP needs it for her record." },
            { family:"Elsa Meyer",      resident:"Johannes Meyer",  time:"Yesterday", msg:"Johannes mentioned the heater wasn't working — just checking it's been sorted." },
          ].map((m,i) => (
            <div key={i} className="demo-message-card">
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontWeight:600 }}>{m.family}</span>
                <span style={{ fontSize:11, color:"var(--jo-muted)" }}>{m.time}</span>
              </div>
              <div style={{ fontSize:12, color:"var(--jo-muted)" }}>Re: {m.resident}</div>
              <div style={{ fontSize:13, marginTop:6, lineHeight:1.6 }}>{m.msg}</div>
              <button className="demo-quick-btn" style={{ marginTop:8, fontSize:12 }}>Reply →</button>
            </div>
          ))}
        </DemoCard>
        <DemoCard>
          <div className="demo-card-title">Visit Requests</div>
          {[
            { family:"Lungelo Khumalo", resident:"Samuel Khumalo", date:"21 May", time:"14:00", status:"pending" },
            { family:"Grace Williams-Abed", resident:"Agnes Williams", date:"20 May", time:"11:00", status:"approved" },
          ].map((v,i) => (
            <div key={i} className="demo-info-row">
              <div>
                <div style={{ fontWeight:600 }}>{v.family}</div>
                <div style={{ fontSize:12, color:"var(--jo-muted)" }}>{v.resident} · {v.date} at {v.time}</div>
              </div>
              <DemoBadge status={v.status} />
            </div>
          ))}
          <div className="demo-card-title" style={{ marginTop:20 }}>Recent Satisfaction Survey</div>
          <div style={{ fontSize:13, color:"var(--jo-muted)", marginBottom:12 }}>April 2026 Family Survey — 31 responses</div>
          {[
            { label:"Overall experience", score:4.6 },
            { label:"Communication from care team", score:4.3 },
            { label:"Cleanliness & comfort", score:4.8 },
            { label:"Food quality", score:4.1 },
          ].map((s,i) => (
            <div key={i} className="demo-score-row">
              <span style={{ fontSize:13, flex:1 }}>{s.label}</span>
              <span style={{ fontWeight:700, color:"var(--jo-gold)" }}>{s.score} / 5</span>
            </div>
          ))}
        </DemoCard>
      </div>
    </div>
  );
}

// ---- MODULE 11: DOCTOR PORTAL ----------------------------------------

function DoctorPortalModule() {
  return (
    <div className="demo-module-content">
      <DemoModuleHeader eyebrow="Module 11 · Portals" title="Doctor Portal" />
      <DemoCard style={{ marginBottom:20 }}>
        <div style={{ fontWeight:700 }}>Dr Ravi Naidoo — GP · Visiting today (18 May 2026)</div>
        <div style={{ fontSize:12, color:"var(--jo-muted)" }}>3 consultations scheduled · 2 prescriptions pending</div>
      </DemoCard>
      <div className="demo-two-col">
        <DemoCard>
          <div className="demo-card-title">Today's Consultations</div>
          {[
            { time:"10:45", resident:"Henry Thompson (A12)", reason:"Post-fall review — INC-1241", status:"in_progress" },
            { time:"11:15", resident:"Samuel Khumalo (A05)", reason:"COPD routine review + inhaler check", status:"pending" },
            { time:"11:45", resident:"Priya Govender (C11)", reason:"Diabetes review — HbA1c results", status:"pending" },
          ].map((c,i) => (
            <div key={i} className="demo-info-row">
              <span className="demo-activity-time">{c.time}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:13 }}>{c.resident}</div>
                <div style={{ fontSize:12, color:"var(--jo-muted)" }}>{c.reason}</div>
              </div>
              <DemoBadge status={c.status} />
            </div>
          ))}
        </DemoCard>
        <DemoCard>
          <div className="demo-card-title">Pending Prescriptions</div>
          {[
            { resident:"Samuel Khumalo", med:"Tiotropium 18mcg inhaler", action:"Renew — 3-month supply" },
            { resident:"Priya Govender", med:"Insulin Glargine 20U nocte", action:"Adjust dose pending review" },
          ].map((p,i) => (
            <div key={i} style={{ marginBottom:12, paddingBottom:12, borderBottom:"1px solid var(--jo-rule)" }}>
              <div style={{ fontWeight:600, fontSize:13 }}>{p.resident}</div>
              <div style={{ fontSize:12 }}>{p.med}</div>
              <div style={{ fontSize:11, color:"var(--jo-muted)" }}>{p.action}</div>
            </div>
          ))}
          <div className="demo-card-title" style={{ marginTop:12 }}>Previous Consultation Notes</div>
          <div style={{ fontSize:12, color:"var(--jo-muted)", lineHeight:1.7 }}>
            <strong>05 May 2026 · Henry Thompson</strong><br/>
            Post-fall assessment. Gait unsteady. BP elevated. Referred for physio. Increase Furosemide review in 2 weeks.<br/><br/>
            <strong>05 May 2026 · Agnes Williams</strong><br/>
            Comfort care review. Pain management adequate. Family updated. No changes to current plan.
          </div>
        </DemoCard>
      </div>
    </div>
  );
}

// ---- MODULE 12: KITCHEN & NUTRITION ----------------------------------

function KitchenModule() {
  const dietProfiles = [
    { resident:"Henry Thompson",  diet:"Low-sodium, soft",          fluids:"Free",        allergy:"Penicillin (not diet-related)" },
    { resident:"Samuel Khumalo",  diet:"Low-sodium, regular",       fluids:"Free",        allergy:"None" },
    { resident:"Miriam du Plessis",diet:"Regular, finger-food",     fluids:"Thickened",   allergy:"None" },
    { resident:"Agnes Williams",  diet:"Fortified, puree",          fluids:"Thickened",   allergy:"Latex (not diet-related)" },
    { resident:"Priya Govender",  diet:"Diabetic, renal",           fluids:"Restricted 1.5L",allergy:"Codeine (not diet-related)" },
    { resident:"Johannes Meyer",  diet:"Diabetic, regular",         fluids:"Free",        allergy:"None" },
    { resident:"Eleanor Swartz",  diet:"Regular",                   fluids:"Free",        allergy:"None" },
    { resident:"Charles Ferreira",diet:"Regular",                   fluids:"Free",        allergy:"None" },
  ];
  return (
    <div className="demo-module-content">
      <DemoModuleHeader eyebrow="Module 12 · Hospitality" title="Kitchen & Nutrition" />
      <DemoSection title="Today's Menu — 18 May 2026">
        <div className="demo-menu-grid">
          {[["Breakfast", JO_MENU.breakfast],["Lunch", JO_MENU.lunch],["Dinner", JO_MENU.dinner],["Snacks", JO_MENU.snacks]].map(([meal, items]) => (
            <DemoCard key={meal}>
              <div className="demo-card-title">{meal}</div>
              {items.map((item,i) => <div key={i} className="demo-menu-item">· {item}</div>)}
            </DemoCard>
          ))}
        </div>
      </DemoSection>
      <DemoSection title="Dietary Profiles">
        <DemoTable
          cols={["Resident","Diet Type","Fluids","Notes"]}
          rows={dietProfiles.map(d => ({
            cells:[<span style={{ fontWeight:600 }}>{d.resident}</span>, d.diet, d.fluids, d.allergy]
          }))}
        />
      </DemoSection>
      <DemoCard>
        <div className="demo-card-title">Kitchen Compliance</div>
        <div className="demo-stats-row" style={{ margin:0, padding:0, background:"none", border:"none" }}>
          <DemoStat label="Food Safety Score" value="98%" color="#065f46" />
          <DemoStat label="Meal Satisfaction" value="4.1 / 5" color="#065f46" />
          <DemoStat label="Dietary Alerts Today" value="0" color="#065f46" />
          <DemoStat label="Special Prep Meals" value="4" note="Puree · thickened" />
        </div>
      </DemoCard>
    </div>
  );
}

// ---- MODULE 13: HOUSEKEEPING -----------------------------------------

function HousekeepingModule() {
  const rooms = [
    { room:"A01 — Agnes Williams",   clean:"06:45", IPC:true,  laundry:true,  status:"complete" },
    { room:"A05 — Samuel Khumalo",   clean:"07:10", IPC:true,  laundry:true,  status:"complete" },
    { room:"A12 — Henry Thompson",   clean:"07:35", IPC:true,  laundry:false, status:"complete", note:"Awaiting laundry return" },
    { room:"B07 — Miriam du Plessis",clean:"08:00", IPC:true,  laundry:true,  status:"complete" },
    { room:"B14 — Johannes Meyer",   clean:"08:20", IPC:false, laundry:true,  status:"pending",  note:"IPC inspection outstanding" },
    { room:"C03 — Eleanor Swartz",   clean:"09:00", IPC:true,  laundry:true,  status:"complete" },
    { room:"C08 — Charles Ferreira", clean:"09:20", IPC:true,  laundry:true,  status:"complete" },
    { room:"C11 — Priya Govender",   clean:"09:40", IPC:true,  laundry:true,  status:"complete" },
  ];
  return (
    <div className="demo-module-content">
      <DemoModuleHeader eyebrow="Module 13 · Hospitality" title="Housekeeping" />
      <div className="demo-stats-row">
        <DemoStat label="Rooms Complete" value="7 / 8" />
        <DemoStat label="IPC Rounds" value="7 / 8" color="#065f46" />
        <DemoStat label="Laundry Returned" value="6 / 8" />
        <DemoStat label="Waste Removed" value="✓" color="#065f46" />
      </div>
      <DemoSection title="Room Cleaning Schedule — 18 May 2026">
        <DemoTable
          cols={["Room / Resident","Cleaned","IPC","Laundry","Status","Notes"]}
          rows={rooms.map(r => ({
            cells:[
              r.room, r.clean,
              r.IPC ? "✓" : <span style={{ color:"#b45309" }}>Pending</span>,
              r.laundry ? "✓" : <span style={{ color:"#b45309" }}>Pending</span>,
              <DemoBadge status={r.status} />,
              r.note || "—"
            ]
          }))}
        />
      </DemoSection>
      <DemoCard>
        <div className="demo-card-title">IPC Dashboard — Month to Date</div>
        <div className="demo-stats-row" style={{ margin:0, padding:0, background:"none", border:"none" }}>
          <DemoStat label="IPC Compliance" value="96.8%" color="#065f46" />
          <DemoStat label="Deep Cleans" value="4" note="Completed this month" />
          <DemoStat label="Infection Incidents" value="0" color="#065f46" />
          <DemoStat label="PPE Compliance" value="100%" color="#065f46" />
        </div>
      </DemoCard>
    </div>
  );
}

// ---- MODULE 14: QM ENGINE (with Incident Form) -----------------------

function QMEngineModule() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    type:"", resident:"", date:"2026-05-18", time:"", severity:"", location:"", description:"", reporter:"Demo User", witness:""
  });
  const [errs, setErrs] = useState({});

  function validate() {
    const e = {};
    if (!form.type) e.type = "Required";
    if (!form.resident) e.resident = "Required";
    if (!form.time) e.time = "Required";
    if (!form.severity) e.severity = "Required";
    if (!form.description || form.description.length < 10) e.description = "Please provide more detail";
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrs(e); return; }
    setSubmitted(true);
  }

  return (
    <div className="demo-module-content">
      <DemoModuleHeader
        eyebrow="Module 14 · Operations"
        title="Quality Management Engine"
        action={
          <button className="demo-primary-btn" onClick={() => { setShowForm(true); setSubmitted(false); setErrs({}); setForm({ type:"", resident:"", date:"2026-05-18", time:"", severity:"", location:"", description:"", reporter:"Demo User", witness:"" }); }}>
            + Log Incident
          </button>
        }
      />
      <div className="demo-stats-row">
        <DemoStat label="Open Incidents" value="1" color="#b45309" />
        <DemoStat label="Open NCRs" value="2" />
        <DemoStat label="Governance Score" value="94%" color="#065f46" />
        <DemoStat label="Docs Acknowledged" value="312 / 318" />
        <DemoStat label="Risk Register" value="On schedule" color="#065f46" />
      </div>
      <DemoSection title="Incident Register">
        <DemoTable
          cols={["Ref","Date","Type","Resident","Severity","Status","Owner"]}
          rows={JO_INCIDENTS.map(i => ({
            cells:[
              <span style={{ fontFamily:"monospace", fontSize:12 }}>{i.id}</span>,
              i.date, i.type,
              <span style={{ fontWeight:600 }}>{i.resident}</span>,
              <DemoBadge status={i.severity} />,
              <DemoBadge status={i.status} />,
              i.owner
            ]
          }))}
        />
      </DemoSection>
      <DemoSection title="Document Register">
        <DemoTable
          cols={["Doc No.","Title","Version","Status","Review Date","Owner"]}
          rows={JO_DOCS.map(d => ({
            cells:[
              <span style={{ fontFamily:"monospace", fontSize:12 }}>{d.id}</span>,
              d.title, d.version,
              <DemoBadge status={d.status} />,
              d.review, d.owner
            ]
          }))}
        />
      </DemoSection>

      {showForm && (
        <div className="demo-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="demo-modal">
            {submitted ? (
              <div className="demo-modal-success">
                <div className="demo-success-icon">✓</div>
                <h3>Incident Logged — DEMO MODE</h3>
                <p>In a live account, this would be saved as <strong>INC-1247</strong> and routed to <strong>Sr van Wyk</strong> for investigation. Governance cascade would auto-raise a Nonconformance and notify the relevant staff.</p>
                <p style={{ fontSize:13, color:"#6b7a6b" }}>No data has been stored. This is a demonstration only.</p>
                <button className="demo-primary-btn" onClick={() => setShowForm(false)}>Close Demo</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="demo-modal-header">
                  <h3>Log Incident</h3>
                  <div className="demo-demo-tag">DEMO MODE — not saved</div>
                  <button type="button" className="demo-modal-close" onClick={() => setShowForm(false)}>✕</button>
                </div>
                <div className="demo-form-grid">
                  <div className="demo-field">
                    <label>Incident Type <span className="req">*</span></label>
                    <select value={form.type} onChange={e => setForm(f => ({...f, type:e.target.value}))} className={errs.type ? "invalid" : ""}>
                      <option value="">Select type…</option>
                      <option>Fall</option><option>Medication Error</option><option>Behaviour</option>
                      <option>Environmental</option><option>Clinical</option><option>Fire / Security</option>
                      <option>Visitor Incident</option><option>Abuse / Neglect Allegation</option>
                    </select>
                    {errs.type && <span className="demo-err">{errs.type}</span>}
                  </div>
                  <div className="demo-field">
                    <label>Resident Involved <span className="req">*</span></label>
                    <select value={form.resident} onChange={e => setForm(f => ({...f, resident:e.target.value}))} className={errs.resident ? "invalid" : ""}>
                      <option value="">Select resident…</option>
                      {JO_RESIDENTS.map(r => <option key={r.id}>{r.name} ({r.room})</option>)}
                      <option>Staff only</option><option>Visitor</option>
                    </select>
                    {errs.resident && <span className="demo-err">{errs.resident}</span>}
                  </div>
                  <div className="demo-field">
                    <label>Date</label>
                    <input type="date" value={form.date} onChange={e => setForm(f => ({...f, date:e.target.value}))} />
                  </div>
                  <div className="demo-field">
                    <label>Time <span className="req">*</span></label>
                    <input type="time" value={form.time} onChange={e => setForm(f => ({...f, time:e.target.value}))} className={errs.time ? "invalid" : ""} />
                    {errs.time && <span className="demo-err">{errs.time}</span>}
                  </div>
                  <div className="demo-field">
                    <label>Severity <span className="req">*</span></label>
                    <select value={form.severity} onChange={e => setForm(f => ({...f, severity:e.target.value}))} className={errs.severity ? "invalid" : ""}>
                      <option value="">Select…</option>
                      <option>Low</option><option>Moderate</option><option>High</option><option>Critical</option>
                    </select>
                    {errs.severity && <span className="demo-err">{errs.severity}</span>}
                  </div>
                  <div className="demo-field">
                    <label>Location</label>
                    <input value={form.location} onChange={e => setForm(f => ({...f, location:e.target.value}))} placeholder="e.g. Room A12, Wing B corridor" />
                  </div>
                  <div className="demo-field" style={{ gridColumn:"1/-1" }}>
                    <label>Description <span className="req">*</span></label>
                    <textarea rows={4} value={form.description} onChange={e => setForm(f => ({...f, description:e.target.value}))} placeholder="Describe what happened, what was observed, and any immediate action taken…" className={errs.description ? "invalid" : ""} />
                    {errs.description && <span className="demo-err">{errs.description}</span>}
                  </div>
                  <div className="demo-field">
                    <label>Reported by</label>
                    <input value={form.reporter} onChange={e => setForm(f => ({...f, reporter:e.target.value}))} />
                  </div>
                  <div className="demo-field">
                    <label>Witness (if any)</label>
                    <input value={form.witness} onChange={e => setForm(f => ({...f, witness:e.target.value}))} placeholder="Name of witness" />
                  </div>
                </div>
                <div className="demo-form-actions">
                  <button type="button" className="demo-ghost-btn" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="demo-primary-btn">Submit Incident →</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---- MODULE 15: ASSET MANAGEMENT -------------------------------------

function AssetManagementModule() {
  return (
    <div className="demo-module-content">
      <DemoModuleHeader eyebrow="Module 15 · Operations" title="Asset Management" />
      <div className="demo-stats-row">
        <DemoStat label="Total Assets" value="47" />
        <DemoStat label="Due for Service" value="1" note="AST-0055 — 20 May" color="#b45309" />
        <DemoStat label="Overdue" value="0" color="#065f46" />
        <DemoStat label="Compliance Certs" value="All current" color="#065f46" />
      </div>
      <DemoSection title="Asset Register">
        <DemoTable
          cols={["Asset ID","Description","Location","Status","Next Service","Cert"]}
          rows={JO_ASSETS.map(a => ({
            cells:[
              <span style={{ fontFamily:"monospace", fontSize:12 }}>{a.id}</span>,
              a.name, a.location,
              <DemoBadge status={a.status} />,
              <span style={{ color: a.status === "due" ? "#b45309" : "inherit", fontWeight: a.status === "due" ? 700 : 400 }}>{a.service}</span>,
              <DemoBadge status={a.cert} />
            ]
          }))}
        />
      </DemoSection>
    </div>
  );
}

// ---- MODULE 16: HR & WORKFORCE ---------------------------------------

function HRModule() {
  return (
    <div className="demo-module-content">
      <DemoModuleHeader eyebrow="Module 16 · Operations" title="HR & Workforce" />
      <div className="demo-stats-row">
        <DemoStat label="Total Staff" value="12" />
        <DemoStat label="On Leave Today" value="1" note="S. Khoza" />
        <DemoStat label="Night Shift Tonight" value="2" note="Dlamini, Dube" />
        <DemoStat label="POPIA Training Expiring" value="3" note="Within 30 days" color="#b45309" />
        <DemoStat label="Credentialing Current" value="11 / 12" />
      </div>
      <DemoSection title="Staff Directory">
        <DemoTable
          cols={["Name","Role","Department","Shift","Status"]}
          rows={JO_STAFF.map(s => ({
            cells:[
              <span style={{ fontWeight:600 }}>{s.name}</span>,
              s.role, s.dept, s.shift,
              <DemoBadge status={s.leave ? "monitoring" : "active"} />
            ]
          }))}
        />
      </DemoSection>
      <DemoCard>
        <div className="demo-card-title">Today's Roster — Day Shift</div>
        <div className="demo-two-col" style={{ gap:12 }}>
          <div>
            <div className="demo-eyebrow" style={{ marginBottom:8 }}>Wing A + Wing B — Clinical</div>
            {[["Sr Linda van Wyk","Care Lead · Wings A+B"],["Sr Fikile Mokoena","RN · Wings A+B"],["Priscilla Adams","Care Worker · Wing A"],["Nomsa Dube","Care Worker · Wing B"]].map(([n,r]) => (
              <div key={n} className="demo-info-row"><span style={{ fontWeight:600 }}>{n}</span><span style={{ fontSize:12, color:"var(--jo-muted)" }}>{r}</span></div>
            ))}
          </div>
          <div>
            <div className="demo-eyebrow" style={{ marginBottom:8 }}>Support Functions</div>
            {[["Sandra Botha","Management"],["Kevin Pietersen","Admin"],["Marco van der Berg","Kitchen"],["James Hendricks","Maintenance"],["Carol Timmermans","Reception"]].map(([n,r]) => (
              <div key={n} className="demo-info-row"><span style={{ fontWeight:600 }}>{n}</span><span style={{ fontSize:12, color:"var(--jo-muted)" }}>{r}</span></div>
            ))}
          </div>
        </div>
      </DemoCard>
    </div>
  );
}

// ---- MODULE 17: FINANCE ----------------------------------------------

function FinanceModule() {
  const ar = [
    { family:"Thompson family",   resident:"Henry Thompson",   amount:"R 8 450", days:"Current", status:"ok" },
    { family:"Khumalo family",    resident:"Samuel Khumalo",   amount:"R 8 200", days:"Current", status:"ok" },
    { family:"du Plessis family", resident:"Miriam du Plessis",amount:"R 9 100", days:"Current", status:"ok" },
    { family:"Meyer family",      resident:"Johannes Meyer",   amount:"R 1 840", days:"7 days",  status:"ok" },
    { family:"Govender family",   resident:"Priya Govender",   amount:"R 8 650", days:"32 days", status:"alert" },
    { family:"Williams estate",   resident:"Agnes Williams",   amount:"R 8 950", days:"Current", status:"ok" },
  ];
  return (
    <div className="demo-module-content">
      <DemoModuleHeader eyebrow="Module 17 · Operations" title="Finance" />
      <div className="demo-stats-row">
        <DemoStat label="Monthly Revenue" value="R 485 200" color="#065f46" />
        <DemoStat label="AR Outstanding" value="R 10 490" note="1 account overdue" color="#b45309" />
        <DemoStat label="Occupancy Revenue" value="97.2%" color="#065f46" />
        <DemoStat label="Xero Sync" value="Reconciled" note="Last: 17 May 23:00" color="#065f46" />
        <DemoStat label="Month End" value="Open" note="13 days remaining" />
      </div>
      <DemoSection title="Resident Billing — AR Aging (Demo Extract)">
        <DemoTable
          cols={["Family","Resident","Monthly Levy","Aging","Status"]}
          rows={ar.map(r => ({
            cells:[
              r.family,
              <span style={{ fontWeight:600 }}>{r.resident}</span>,
              r.amount, r.days,
              <DemoBadge status={r.status === "alert" ? "alert" : "settled"} />
            ]
          }))}
        />
      </DemoSection>
      <DemoCard>
        <div className="demo-card-title">Revenue Summary — May 2026</div>
        {[
          ["Frail Care levies",    "R 281 600"],
          ["Memory Care levies",   "R 54 600"],
          ["General Care levies",  "R 82 000"],
          ["Independent levies",   "R 49 000"],
          ["Sundry services",      "R 18 000"],
          ["Total Revenue",        "R 485 200"],
        ].map(([k,v]) => (
          <div key={k} className="demo-info-row" style={{ borderBottom: k === "Sundry services" ? "2px solid var(--jo-ink)" : undefined, fontWeight: k === "Total Revenue" ? 700 : 400 }}>
            <span>{k}</span><span>{v}</span>
          </div>
        ))}
      </DemoCard>
    </div>
  );
}

// ---- MODULE 18: SERVICE DESK -----------------------------------------

function ServiceDeskModule() {
  return (
    <div className="demo-module-content">
      <DemoModuleHeader eyebrow="Module 18 · Operations" title="Service Desk" />
      <div className="demo-stats-row">
        <DemoStat label="Open Tickets" value="7" />
        <DemoStat label="High Priority" value="2" color="#b45309" />
        <DemoStat label="Overdue (SLA)" value="1" color="#b45309" />
        <DemoStat label="Resolved This Week" value="9" color="#065f46" />
        <DemoStat label="Avg. Resolution" value="2.1 days" />
      </div>
      <DemoSection title="Open Ticket Queue">
        <DemoTable
          cols={["Ticket","Subject","Type","Priority","Owner","Age","Status"]}
          rows={JO_TICKETS.map(t => ({
            cells:[
              <span style={{ fontFamily:"monospace", fontSize:12 }}>{t.id}</span>,
              t.subject, t.type,
              <DemoBadge status={t.priority} />,
              t.owner, t.age,
              <DemoBadge status={t.status} />
            ]
          }))}
        />
      </DemoSection>
    </div>
  );
}

// ---- MODULE 19: EXECUTIVE COMMAND ------------------------------------

function ExecCommandModule() {
  return (
    <div className="demo-module-content">
      <DemoModuleHeader eyebrow="Module 19 · Executive" title="Executive Command — Jolly Oaks" />
      <div className="demo-stats-row">
        <DemoStat label="Governance Score" value="94%" color="#065f46" />
        <DemoStat label="Medication Adherence" value="97.2%" color="#065f46" />
        <DemoStat label="Training Compliance" value="89%" color="#b45309" />
        <DemoStat label="Open Incidents" value="1" color="#b45309" />
        <DemoStat label="Occupancy" value="95.8%" color="#065f46" />
        <DemoStat label="AR Overdue" value="1" color="#b45309" />
      </div>
      <div className="demo-two-col">
        <DemoCard>
          <div className="demo-card-title">Health Pillars</div>
          {[
            { pillar:"Governance & Compliance", score:94, color:"#065f46" },
            { pillar:"Clinical Safety",         score:97, color:"#065f46" },
            { pillar:"Workforce Readiness",     score:89, color:"#b45309" },
            { pillar:"Resident Experience",     score:92, color:"#065f46" },
            { pillar:"Financial Health",        score:91, color:"#065f46" },
            { pillar:"Facility & Assets",       score:88, color:"#b45309" },
          ].map(p => (
            <div key={p.pillar} className="demo-pillar-row">
              <span style={{ fontSize:13, flex:1 }}>{p.pillar}</span>
              <div className="demo-pillar-bar-bg">
                <div className="demo-pillar-bar" style={{ width: p.score + "%", background: p.color }} />
              </div>
              <span style={{ fontSize:13, fontWeight:700, color:p.color, minWidth:40, textAlign:"right" }}>{p.score}%</span>
            </div>
          ))}
        </DemoCard>
        <DemoCard>
          <div className="demo-card-title">Executive Flags — Action Required</div>
          {[
            { text:"INC-1241 (Henry Thompson fall) — open 2 days, root cause pending", sev:"high" },
            { text:"POPIA training: 3 staff expiring in &lt; 30 days", sev:"med" },
            { text:"BP Monitor AST-0055 service overdue 20 May", sev:"med" },
            { text:"Priya Govender AR — 32 days outstanding", sev:"med" },
            { text:"End-of-life care pathway document in review — expedite sign-off", sev:"low" },
          ].map((f,i) => (
            <div key={i} className={"demo-flag demo-flag--" + (f.sev === "high" ? "warn" : "info")} dangerouslySetInnerHTML={{ __html: f.text }} />
          ))}
          <div className="demo-card-title" style={{ marginTop:20 }}>Board Pack</div>
          <div style={{ fontSize:13, color:"var(--jo-muted)" }}>Q2 2026 Board Pack — <span style={{ color:"#b45309", fontWeight:600 }}>Draft</span> · Auto-generated · Pending CEO sign-off</div>
        </DemoCard>
      </div>
      <DemoCard>
        <div className="demo-card-title">Daily Digest — 18 May 2026</div>
        <div className="demo-activity">
          {[
            { time:"06:00", event:"Medication round complete — Wing A (38/38)" },
            { time:"06:30", event:"Medication round complete — Wing B (24/24)" },
            { time:"09:31", event:"4 visitors on site — all signed in" },
            { time:"10:02", event:"Housekeeping Wing C complete" },
            { time:"10:45", event:"Dr Naidoo on site — 3 consultations" },
            { time:"12:00", event:"Midday medication round complete — all wings" },
          ].map((a,i) => (
            <div key={i} className="demo-activity-row">
              <span className="demo-activity-time">{a.time}</span>
              <span className="demo-activity-event">{a.event}</span>
            </div>
          ))}
        </div>
      </DemoCard>
    </div>
  );
}

// ---- MODULE 20: EXECUTIVE KPIs ---------------------------------------

function ExecKPIsModule() {
  const kpis = [
    { cat:"Clinical",    name:"Medication Adherence",        value:"97.2%", trend:"+0.4%", target:"≥ 97%",   status:"ok" },
    { cat:"Clinical",    name:"Falls Rate (per 1000 bed-days)",value:"1.2",  trend:"-0.3", target:"&lt; 2.0", status:"ok" },
    { cat:"Clinical",    name:"Open Incident &gt; 7 days",   value:"1",    trend:"=",    target:"0",         status:"warn" },
    { cat:"Clinical",    name:"Unplanned GP Callouts",       value:"2",    trend:"-1",   target:"&lt; 3",    status:"ok" },
    { cat:"Governance",  name:"Policy Acknowledgement Rate",  value:"98.1%", trend:"+1.2%", target:"100%",   status:"ok" },
    { cat:"Governance",  name:"Risk Register Reviews On Time",value:"100%", trend:"=",    target:"100%",     status:"ok" },
    { cat:"Governance",  name:"Audit Compliance Score",       value:"94%",  trend:"+2%",  target:"≥ 90%",   status:"ok" },
    { cat:"Workforce",   name:"Registered Nurse Compliance",  value:"100%", trend:"=",    target:"100%",     status:"ok" },
    { cat:"Workforce",   name:"Training Compliance",          value:"89%",  trend:"-3%",  target:"≥ 95%",   status:"warn" },
    { cat:"Workforce",   name:"Sick Leave Rate",              value:"4.2%", trend:"+0.8%",target:"&lt; 5%",  status:"ok" },
    { cat:"Financial",   name:"Occupancy Rate",               value:"95.8%",trend:"+0.4%",target:"≥ 95%",   status:"ok" },
    { cat:"Financial",   name:"Revenue per Bed (R)",          value:"R 10 108",trend:"+2.1%",target:"≥ R 9 500",status:"ok" },
    { cat:"Financial",   name:"AR Days Outstanding (avg)",    value:"12.4d",trend:"+1.2d",target:"&lt; 15d", status:"ok" },
    { cat:"Resident Exp.",name:"Family Satisfaction Score",   value:"4.4 / 5",trend:"+0.2",target:"≥ 4.0", status:"ok" },
    { cat:"Resident Exp.",name:"Complaint Resolution &lt; 5d",value:"100%", trend:"=",    target:"100%",     status:"ok" },
  ];
  const cats = [...new Set(kpis.map(k => k.cat))];
  return (
    <div className="demo-module-content">
      <DemoModuleHeader eyebrow="Module 20 · Executive" title="Executive KPIs — Board View" />
      <div className="demo-stats-row">
        <DemoStat label="KPIs On Target" value="13 / 15" color="#065f46" />
        <DemoStat label="Requiring Attention" value="2" color="#b45309" />
        <DemoStat label="Board Pack" value="Q2 Draft" />
        <DemoStat label="Period" value="May 2026" />
      </div>
      {cats.map(cat => (
        <DemoSection key={cat} title={cat}>
          <DemoTable
            cols={["KPI","Value","Trend","Target","Status"]}
            rows={kpis.filter(k => k.cat === cat).map(k => ({
              cells:[
                <span dangerouslySetInnerHTML={{ __html: k.name }} />,
                <span style={{ fontWeight:700 }}>{k.value}</span>,
                <span style={{ color: k.trend.startsWith("+") ? "#065f46" : k.trend.startsWith("-") && k.status === "ok" ? "#065f46" : k.trend.startsWith("-") ? "#b45309" : "var(--jo-muted)" }}>{k.trend}</span>,
                <span dangerouslySetInnerHTML={{ __html: k.target }} />,
                <DemoBadge status={k.status === "ok" ? "settled" : "alert"} />
              ]
            }))}
          />
        </DemoSection>
      ))}
    </div>
  );
}

// ---- MODULE ROUTER ---------------------------------------------------

function renderDemoModule(id, helpers) {
  const { setActive } = helpers;
  switch(id) {
    case "facility-home": return <FacilityHomeModule setActive={setActive} />;
    case "welcome":       return <WelcomeModule />;
    case "visitors":      return <VisitorsModule />;
    case "pre-welcome":   return <PreWelcomeModule />;
    case "residents":     return <ResidentsModule />;
    case "care-plans":    return <CarePlansModule />;
    case "medication":    return <MedicationModule />;
    case "observations":  return <ObservationsModule />;
    case "dementia":      return <DementiaCareModule />;
    case "family-portal": return <FamilyPortalModule />;
    case "doctor-portal": return <DoctorPortalModule />;
    case "kitchen":       return <KitchenModule />;
    case "housekeeping":  return <HousekeepingModule />;
    case "qms":           return <QMEngineModule />;
    case "assets":        return <AssetManagementModule />;
    case "hr":            return <HRModule />;
    case "finance":       return <FinanceModule />;
    case "service-desk":  return <ServiceDeskModule />;
    case "exec-command":  return <ExecCommandModule />;
    case "exec-kpis":     return <ExecKPIsModule />;
    default:              return <FacilityHomeModule setActive={setActive} />;
  }
}

// ---- DEMO PAGE (TOP-LEVEL) -------------------------------------------

function DemoPage({ navigate }) {
  const [active, setActive] = useState("facility-home");

  return (
    <div className="demo-shell">
      <div className="demo-top-banner">
        <span className="demo-top-badge">DEMO</span>
        <span>You are exploring a live demo of the Jolly Oaks Senior Living platform — all data is fictional. No records are created or saved.</span>
        <button className="demo-top-exit" onClick={() => navigate("home")}>Exit Demo ✕</button>
      </div>
      <div className="demo-body">
        <DemoSidebar active={active} setActive={setActive} onExit={() => navigate("home")} />
        <main className="demo-main" key={active}>
          {renderDemoModule(active, { setActive })}
        </main>
      </div>
    </div>
  );
}
