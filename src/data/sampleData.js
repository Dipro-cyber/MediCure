// ─── Sample PHCs ────────────────────────────────────────────────────────────
export const samplePHCs = [
  { id: "phc1", name: "PHC Barmer", district: "Barmer", state: "Rajasthan", contactPerson: "Dr. Ramesh Sharma", phone: "9414012345", address: "NH-15, Barmer, Rajasthan 344001" },
  { id: "phc2", name: "PHC Jaisalmer", district: "Jaisalmer", state: "Rajasthan", contactPerson: "Dr. Sunita Verma", phone: "9414023456", address: "Station Road, Jaisalmer, Rajasthan 345001" },
  { id: "phc3", name: "PHC Shravasti", district: "Shravasti", state: "Uttar Pradesh", contactPerson: "Dr. Anil Kumar", phone: "9415034567", address: "Bhinga Road, Shravasti, UP 271831" },
  { id: "phc4", name: "PHC Bahraich", district: "Bahraich", state: "Uttar Pradesh", contactPerson: "Dr. Priya Singh", phone: "9415045678", address: "Civil Lines, Bahraich, UP 271801" },
  { id: "phc5", name: "PHC Sitamarhi", district: "Sitamarhi", state: "Bihar", contactPerson: "Dr. Manoj Prasad", phone: "9431056789", address: "Dumra Road, Sitamarhi, Bihar 843302" },
  { id: "phc6", name: "PHC Araria", district: "Araria", state: "Bihar", contactPerson: "Dr. Kavita Jha", phone: "9431067890", address: "Station Road, Araria, Bihar 854311" },
];

// ─── Sample Medicines ────────────────────────────────────────────────────────
export const sampleMedicines = [
  { id: "med1",  name: "Paracetamol 500mg",     category: "Pain Relief",    currentStock: 45,   minimumStock: 200, unit: "Tablets",  expiryDate: "2025-08-15", unitPrice: 1.2,  supplier: "Sun Pharma, Mumbai",       lastUpdated: "2026-04-01" },
  { id: "med2",  name: "Amoxicillin 250mg",      category: "Antibiotics",   currentStock: 30,   minimumStock: 150, unit: "Capsules", expiryDate: "2025-11-20", unitPrice: 4.5,  supplier: "Cipla Ltd, Goa",           lastUpdated: "2026-04-01" },
  { id: "med3",  name: "ORS Sachets",            category: "Oral Rehydration", currentStock: 80, minimumStock: 300, unit: "Sachets",  expiryDate: "2026-06-30", unitPrice: 3.0,  supplier: "Electral, Ahmedabad",      lastUpdated: "2026-04-02" },
  { id: "med4",  name: "Iron Folic Acid",        category: "Supplements",   currentStock: 500,  minimumStock: 400, unit: "Tablets",  expiryDate: "2026-12-01", unitPrice: 0.8,  supplier: "Mankind Pharma, Delhi",    lastUpdated: "2026-04-01" },
  { id: "med5",  name: "Vitamin D3 60K IU",      category: "Supplements",   currentStock: 120,  minimumStock: 100, unit: "Capsules", expiryDate: "2026-09-15", unitPrice: 12.0, supplier: "Abbott India, Mumbai",      lastUpdated: "2026-04-01" },
  { id: "med6",  name: "Metformin 500mg",        category: "Diabetes",      currentStock: 200,  minimumStock: 150, unit: "Tablets",  expiryDate: "2026-10-20", unitPrice: 2.5,  supplier: "USV Pvt Ltd, Mumbai",      lastUpdated: "2026-04-02" },
  { id: "med7",  name: "Atenolol 50mg",          category: "Cardiac",       currentStock: 180,  minimumStock: 120, unit: "Tablets",  expiryDate: "2026-07-10", unitPrice: 3.2,  supplier: "Zydus Cadila, Ahmedabad",  lastUpdated: "2026-04-01" },
  { id: "med8",  name: "Amlodipine 5mg",         category: "Cardiac",       currentStock: 25,   minimumStock: 100, unit: "Tablets",  expiryDate: "2025-12-31", unitPrice: 2.8,  supplier: "Torrent Pharma, Ahmedabad",lastUpdated: "2026-04-02" },
  { id: "med9",  name: "Omeprazole 20mg",        category: "Gastro",        currentStock: 90,   minimumStock: 120, unit: "Capsules", expiryDate: "2026-05-15", unitPrice: 5.5,  supplier: "Dr. Reddy's, Hyderabad",   lastUpdated: "2026-04-01" },
  { id: "med10", name: "Ciprofloxacin 500mg",    category: "Antibiotics",   currentStock: 15,   minimumStock: 100, unit: "Tablets",  expiryDate: "2026-03-20", unitPrice: 6.0,  supplier: "Lupin Ltd, Mumbai",        lastUpdated: "2026-04-02" },
  { id: "med11", name: "Azithromycin 250mg",     category: "Antibiotics",   currentStock: 60,   minimumStock: 80,  unit: "Tablets",  expiryDate: "2026-08-25", unitPrice: 8.5,  supplier: "Cipla Ltd, Goa",           lastUpdated: "2026-04-01" },
  { id: "med12", name: "BCG Vaccine",            category: "Vaccines",      currentStock: 50,   minimumStock: 40,  unit: "Vials",    expiryDate: "2026-06-01", unitPrice: 45.0, supplier: "Serum Institute, Pune",    lastUpdated: "2026-04-02" },
  { id: "med13", name: "Polio Drops (OPV)",      category: "Vaccines",      currentStock: 35,   minimumStock: 30,  unit: "Vials",    expiryDate: "2026-05-10", unitPrice: 30.0, supplier: "Bharat Biotech, Hyderabad", lastUpdated: "2026-04-01" },
  { id: "med14", name: "Hepatitis B Vaccine",    category: "Vaccines",      currentStock: 20,   minimumStock: 25,  unit: "Vials",    expiryDate: "2026-04-30", unitPrice: 55.0, supplier: "Serum Institute, Pune",    lastUpdated: "2026-04-02" },
  { id: "med15", name: "Insulin Regular 40IU",   category: "Diabetes",      currentStock: 8,    minimumStock: 30,  unit: "Vials",    expiryDate: "2025-10-15", unitPrice: 85.0, supplier: "Novo Nordisk India, Pune", lastUpdated: "2026-04-01" },
  { id: "med16", name: "Salbutamol Inhaler",     category: "Respiratory",   currentStock: 18,   minimumStock: 40,  unit: "Inhalers", expiryDate: "2026-02-28", unitPrice: 95.0, supplier: "GSK India, Mumbai",        lastUpdated: "2026-04-02" },
  { id: "med17", name: "Chloroquine 250mg",      category: "Anti-malarial", currentStock: 12,   minimumStock: 150, unit: "Tablets",  expiryDate: "2026-09-30", unitPrice: 3.5,  supplier: "IPCA Labs, Mumbai",        lastUpdated: "2026-04-01" },
  { id: "med18", name: "Cotrimoxazole 480mg",    category: "Antibiotics",   currentStock: 220,  minimumStock: 150, unit: "Tablets",  expiryDate: "2026-11-15", unitPrice: 2.2,  supplier: "Alkem Labs, Mumbai",       lastUpdated: "2026-04-02" },
];

// ─── Consumption History (6 months) ─────────────────────────────────────────
// Monsoon spike Jun–Sep for ORS/anti-malarials; winter spike Nov–Jan for antibiotics
export const consumptionHistory = [
  { month: "Nov '25", paracetamol: 320, ors: 90,  antibiotics: 280, antimalarial: 40,  vaccines: 55 },
  { month: "Dec '25", paracetamol: 350, ors: 70,  antibiotics: 310, antimalarial: 30,  vaccines: 60 },
  { month: "Jan '26", paracetamol: 380, ors: 65,  antibiotics: 340, antimalarial: 25,  vaccines: 58 },
  { month: "Feb '26", paracetamol: 290, ors: 80,  antibiotics: 220, antimalarial: 35,  vaccines: 62 },
  { month: "Mar '26", paracetamol: 260, ors: 110, antibiotics: 190, antimalarial: 55,  vaccines: 70 },
  { month: "Apr '26", paracetamol: 240, ors: 150, antibiotics: 170, antimalarial: 80,  vaccines: 75 },
];

export const predictedConsumption = [
  { medicine: "Paracetamol 500mg",  predicted: 420, current: 45  },
  { medicine: "ORS Sachets",        predicted: 380, current: 80  },
  { medicine: "Chloroquine 250mg",  predicted: 290, current: 12  },
  { medicine: "Ciprofloxacin 500mg",predicted: 180, current: 15  },
  { medicine: "Insulin Regular",    predicted: 95,  current: 8   },
  { medicine: "Salbutamol Inhaler", predicted: 60,  current: 18  },
  { medicine: "Amoxicillin 250mg",  predicted: 210, current: 30  },
];

// ─── Sample Orders ───────────────────────────────────────────────────────────
export const sampleOrders = [
  {
    id: "ORD-2026-001", phcId: "phc1", phcName: "PHC Barmer",
    medicines: [{ name: "Paracetamol 500mg", qty: 500 }, { name: "ORS Sachets", qty: 300 }],
    status: "Delivered", priority: "High", orderDate: "2026-03-10", expectedDelivery: "2026-03-17",
    createdBy: "Dr. Ramesh Sharma", notes: "Urgent restock before summer",
    timeline: ["2026-03-10","2026-03-11","2026-03-13","2026-03-15","2026-03-17"],
  },
  {
    id: "ORD-2026-002", phcId: "phc3", phcName: "PHC Shravasti",
    medicines: [{ name: "Amoxicillin 250mg", qty: 200 }, { name: "Azithromycin 250mg", qty: 100 }],
    status: "Shipped", priority: "Normal", orderDate: "2026-03-20", expectedDelivery: "2026-03-28",
    createdBy: "Dr. Anil Kumar", notes: "",
    timeline: ["2026-03-20","2026-03-21","2026-03-23","2026-03-25",null],
  },
  {
    id: "ORD-2026-003", phcId: "phc5", phcName: "PHC Sitamarhi",
    medicines: [{ name: "Insulin Regular 40IU", qty: 50 }, { name: "Metformin 500mg", qty: 300 }],
    status: "Processing", priority: "Emergency", orderDate: "2026-04-01", expectedDelivery: "2026-04-05",
    createdBy: "Dr. Manoj Prasad", notes: "Diabetic patients running out",
    timeline: ["2026-04-01","2026-04-02",null,null,null],
  },
  {
    id: "ORD-2026-004", phcId: "phc2", phcName: "PHC Jaisalmer",
    medicines: [{ name: "BCG Vaccine", qty: 30 }, { name: "Hepatitis B Vaccine", qty: 25 }],
    status: "Pending", priority: "High", orderDate: "2026-04-05", expectedDelivery: "2026-04-12",
    createdBy: "Dr. Sunita Verma", notes: "Immunization drive next week",
    timeline: ["2026-04-05",null,null,null,null],
  },
  {
    id: "ORD-2026-005", phcId: "phc4", phcName: "PHC Bahraich",
    medicines: [{ name: "Chloroquine 250mg", qty: 400 }, { name: "ORS Sachets", qty: 500 }],
    status: "Pending", priority: "Emergency", orderDate: "2026-04-07", expectedDelivery: "2026-04-10",
    createdBy: "Dr. Priya Singh", notes: "Pre-monsoon anti-malarial stock",
    timeline: ["2026-04-07",null,null,null,null],
  },
  {
    id: "ORD-2026-006", phcId: "phc6", phcName: "PHC Araria",
    medicines: [{ name: "Salbutamol Inhaler", qty: 40 }, { name: "Ciprofloxacin 500mg", qty: 200 }],
    status: "Delivered", priority: "Normal", orderDate: "2026-02-15", expectedDelivery: "2026-02-22",
    createdBy: "Dr. Kavita Jha", notes: "",
    timeline: ["2026-02-15","2026-02-16","2026-02-18","2026-02-20","2026-02-22"],
  },
  {
    id: "ORD-2026-007", phcId: "phc1", phcName: "PHC Barmer",
    medicines: [{ name: "Amlodipine 5mg", qty: 300 }, { name: "Atenolol 50mg", qty: 200 }],
    status: "Delivered", priority: "Normal", orderDate: "2026-01-20", expectedDelivery: "2026-01-28",
    createdBy: "Dr. Ramesh Sharma", notes: "Monthly cardiac medicines",
    timeline: ["2026-01-20","2026-01-21","2026-01-23","2026-01-26","2026-01-28"],
  },
  {
    id: "ORD-2026-008", phcId: "phc3", phcName: "PHC Shravasti",
    medicines: [{ name: "Iron Folic Acid", qty: 600 }, { name: "Vitamin D3 60K IU", qty: 150 }],
    status: "Shipped", priority: "Normal", orderDate: "2026-04-03", expectedDelivery: "2026-04-11",
    createdBy: "Dr. Anil Kumar", notes: "Maternal health program",
    timeline: ["2026-04-03","2026-04-04","2026-04-06","2026-04-08",null],
  },
];

// ─── Alerts ──────────────────────────────────────────────────────────────────
export const sampleAlerts = [
  { id: "alt1", type: "critical", message: "Insulin Regular 40IU critically low — only 8 vials remaining (min: 30)", medicineId: "med15", severity: "critical", isRead: false, createdAt: "2026-04-08T08:30:00" },
  { id: "alt2", type: "critical", message: "Chloroquine 250mg stock at 12 tablets — monsoon season approaching", medicineId: "med17", severity: "critical", isRead: false, createdAt: "2026-04-08T07:15:00" },
  { id: "alt3", type: "warning",  message: "Paracetamol 500mg below minimum threshold — reorder recommended", medicineId: "med1",  severity: "warning",  isRead: false, createdAt: "2026-04-07T16:45:00" },
  { id: "alt4", type: "warning",  message: "Hepatitis B Vaccine expiring on 2026-04-30 — use or return", medicineId: "med14", severity: "warning",  isRead: false, createdAt: "2026-04-07T10:00:00" },
  { id: "alt5", type: "info",     message: "Order ORD-2026-002 has been shipped — expected delivery 28 Mar", medicineId: null,    severity: "info",     isRead: true,  createdAt: "2026-04-06T14:20:00" },
];

// ─── PHC Map Coordinates (approximate SVG positions for India map) ────────────
export const phcMapLocations = [
  { id: "phc1", name: "PHC Barmer",    x: 155, y: 195, state: "Rajasthan" },
  { id: "phc2", name: "PHC Jaisalmer", x: 145, y: 180, state: "Rajasthan" },
  { id: "phc3", name: "PHC Shravasti", x: 265, y: 175, state: "Uttar Pradesh" },
  { id: "phc4", name: "PHC Bahraich",  x: 260, y: 168, state: "Uttar Pradesh" },
  { id: "phc5", name: "PHC Sitamarhi", x: 295, y: 170, state: "Bihar" },
  { id: "phc6", name: "PHC Araria",    x: 305, y: 165, state: "Bihar" },
];
