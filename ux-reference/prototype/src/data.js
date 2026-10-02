export const products = [
  { id: "t-reg", name: "t-reg", status: "active", teams: ["CTM", "Dev", "PS"] },
  { id: "soc", name: "SOC", status: "active", teams: ["Engineer", "PM"] },
  { id: "cybersec", name: "Cybersec", status: "active", teams: ["Engineer"] },
  { id: "sap", name: "Security Awareness Program", status: "active", teams: ["Project Management"] }
];

export const people = [
  { id: "x1", name: "คุณ X1", team: "CTM", email: "" },
  { id: "x2", name: "คุณ X2", team: "Dev", email: "" },
  { id: "x3", name: "คุณ X3", team: "Engineer", email: "" },
  { id: "pm1", name: "PM Owner", team: "Project Management", email: "" },
  { id: "ps1", name: "PS Owner", team: "PS", email: "" }
];

export const responses = [
  {
    id: "r01",
    customer: "Thai IOD Q3/26",
    product: "t-reg",
    team: "CTM",
    responsible: "คุณ X1",
    score: 9,
    source: "service",
    date: "2026-09-19",
    comment: "ทีมงานให้ข้อมูลเรื่องเอกสารและ Consent ชัดเจนขึ้น ใช้งานต่อได้มั่นใจ",
    followUpStatus: "resolved",
    slaHoursLeft: 0
  },
  {
    id: "r02",
    customer: "Customer 02",
    product: "t-reg",
    team: "Dev",
    responsible: "คุณ X2",
    score: 6,
    source: "service",
    date: "2026-09-18",
    comment: "ยังมีจุดที่ขั้นตอนซับซ้อน อยากให้หน้าจอทำงานเร็วและเข้าใจง่ายขึ้น",
    followUpStatus: "contacted",
    slaHoursLeft: 18
  },
  {
    id: "r03",
    customer: "PDPA Seminar Q3",
    product: "Security Awareness Program",
    team: "Project Management",
    responsible: "PM Owner",
    score: 10,
    source: "event",
    date: "2026-09-15",
    comment: "เนื้อหา Cyber Security และ AI น่าสนใจ สไลด์กระชับและเข้าใจง่าย",
    followUpStatus: "none",
    slaHoursLeft: null
  },
  {
    id: "r04",
    customer: "Workshop IRPC",
    product: "Cybersec",
    team: "Engineer",
    responsible: "คุณ X3",
    score: 8,
    source: "event",
    date: "2026-09-12",
    comment: "กิจกรรม Breach Drill ดี แต่บางช่วงอยากให้เวลาทำภารกิจมากขึ้น",
    followUpStatus: "none",
    slaHoursLeft: null
  },
  {
    id: "r05",
    customer: "Customer 05",
    product: "SOC",
    team: "Engineer",
    responsible: "คุณ X3",
    score: 5,
    source: "service",
    date: "2026-09-11",
    comment: "พบปัญหาระหว่างใช้งานและใช้เวลานานกว่าจะได้รับการแก้ไข",
    followUpStatus: "reported",
    slaHoursLeft: -6
  },
  {
    id: "r06",
    customer: "Customer 06",
    product: "SOC",
    team: "PM",
    responsible: "คุณ X1",
    score: 7,
    source: "service",
    date: "2026-09-10",
    comment: "โดยรวมโอเค แต่การประสานงานบางขั้นตอนยังใช้เวลานาน",
    followUpStatus: "contacted",
    slaHoursLeft: 9
  },
  {
    id: "r07",
    customer: "Customer 07",
    product: "t-reg",
    team: "PS",
    responsible: "PS Owner",
    score: 8,
    source: "service",
    date: "2026-09-09",
    comment: "ได้รับการช่วยเหลือครบถ้วน แต่อาจตอบกลับช้าบ้างครั้ง",
    followUpStatus: "resolved",
    slaHoursLeft: 0
  },
  {
    id: "r08",
    customer: "Customer 08",
    product: "t-reg",
    team: "CTM",
    responsible: "คุณ X1",
    score: 10,
    source: "service",
    date: "2026-09-08",
    comment: "ประทับใจการบริการและการติดตามงาน แนะนำต่อแน่นอน",
    followUpStatus: "none",
    slaHoursLeft: null
  },
  {
    id: "r09",
    customer: "Customer 09",
    product: "SOC",
    team: "Engineer",
    responsible: "คุณ X3",
    score: 9,
    source: "service",
    date: "2026-09-07",
    comment: "ทีมมีความเป็นมืออาชีพ แก้ไขปัญหาได้ดี",
    followUpStatus: "none",
    slaHoursLeft: null
  },
  {
    id: "r10",
    customer: "Customer 10",
    product: "Security Awareness Program",
    team: "Project Management",
    responsible: "PM Owner",
    score: 6,
    source: "event",
    date: "2026-09-06",
    comment: "ช่วงบ่ายเริ่มง่วง ถ้าเป็น workshop น่าจะเหมาะกว่า",
    followUpStatus: "reported",
    slaHoursLeft: 24
  }
];
