import { User, Employee, Project, Task, CRMLead, InventoryItem, Transaction, AuditLog, AppNotification } from './types';

export const INITIAL_USERS: User[] = [
  { id: 'USR-001', name: 'Yogi Ilham', email: 'yogiilham003@gmail.com', role: 'Super Admin', status: 'Active', lastLogin: '2026-06-13 08:15' },
  { id: 'USR-002', name: 'Ahmad Faisal', email: 'ahmad.faisal@corp.id', role: 'Manager', status: 'Active', lastLogin: '2026-06-12 17:30' },
  { id: 'USR-003', name: 'Siti Rahma', email: 'siti.rahma@corp.id', role: 'Admin', status: 'Active', lastLogin: '2026-06-13 09:02' },
  { id: 'USR-004', name: 'Budi Santoso', email: 'budi.s@corp.id', role: 'Staff', status: 'Active', lastLogin: '2026-06-11 14:20' },
  { id: 'USR-005', name: 'Diana Lestari', email: 'diana.l@corp.id', role: 'Viewer', status: 'Pending', lastLogin: '-' },
  { id: 'USR-006', name: 'Eko Prasetyo', email: 'eko.p@corp.id', role: 'Staff', status: 'Inactive', lastLogin: '2026-05-30 11:00' }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'EMP-001', name: 'Adi Wijaya', department: 'IT', position: 'Lead Software Architect', salary: 18500000, joinDate: '2024-01-15', contractStatus: 'Permanent', attendanceRate: 98, performanceScore: 4.8 },
  { id: 'EMP-002', name: 'Sari Devita', department: 'Finance', position: 'Financial Controller', salary: 14000000, joinDate: '2024-05-10', contractStatus: 'Permanent', attendanceRate: 96, performanceScore: 4.2 },
  { id: 'EMP-003', name: 'Heri Gunawan', department: 'IT', position: 'Senior Devops Specialist', salary: 16000000, joinDate: '2025-02-01', contractStatus: 'Contract', attendanceRate: 95, performanceScore: 4.5 },
  { id: 'EMP-004', name: 'Rina Marlina', department: 'HR', position: 'Talent Acquisition Lead', salary: 11500000, joinDate: '2024-09-18', contractStatus: 'Permanent', attendanceRate: 94, performanceScore: 4.0 },
  { id: 'EMP-005', name: 'Denny Hidayat', department: 'Sales', position: 'Key Account Manager', salary: 12500000, joinDate: '2024-11-01', contractStatus: 'Permanent', attendanceRate: 91, performanceScore: 4.6 },
  { id: 'EMP-006', name: 'Lia Ananda', department: 'Operations', position: 'Business Operations Manager', salary: 13800000, joinDate: '2023-08-20', contractStatus: 'Permanent', attendanceRate: 97, performanceScore: 4.4 },
  { id: 'EMP-007', name: 'Taufik Rahman', department: 'Sales', position: 'Senior Sales Executive', salary: 8500000, joinDate: '2025-03-15', contractStatus: 'Contract', attendanceRate: 92, performanceScore: 3.9 },
  { id: 'EMP-008', name: 'Fitri Handayani', department: 'Operations', position: 'Logistic Planner', salary: 9200000, joinDate: '2025-01-10', contractStatus: 'Contract', attendanceRate: 98, performanceScore: 4.1 },
  { id: 'EMP-009', name: 'Rizky Pratama', department: 'IT', position: 'Frontend Engineer', salary: 10500000, joinDate: '2025-05-01', contractStatus: 'Contract', attendanceRate: 99, performanceScore: 4.3 },
  { id: 'EMP-010', name: 'Wulan Amelia', department: 'Finance', position: 'Accountant Staff', salary: 7800000, joinDate: '2025-04-15', contractStatus: 'Intern', attendanceRate: 93, performanceScore: 3.8 }
];

export const INITIAL_PROJECTS: Project[] = [
  { id: 'PRJ-101', name: 'Next-Gen Mobile SaaS', progress: 68, members: ['Adi Wijaya', 'Rizky Pratama', 'Heri Gunawan'], budget: 320000000, spent: 215000000, deadline: '2026-08-30', status: 'In Progress' },
  { id: 'PRJ-102', name: 'ERP Cloud Migration', progress: 40, members: ['Heri Gunawan', 'Lia Ananda'], budget: 450000000, spent: 180000000, deadline: '2026-11-15', status: 'In Progress' },
  { id: 'PRJ-103', name: 'Fintech Security Audit', progress: 100, members: ['Adi Wijaya', 'Sari Devita'], budget: 150000000, spent: 145000000, deadline: '2026-05-31', status: 'Completed' },
  { id: 'PRJ-104', name: 'Automated CRM Pipeline', progress: 15, members: ['Denny Hidayat', 'Rizky Pratama'], budget: 180000000, spent: 35000000, deadline: '2026-10-10', status: 'Planning' }
];

export const INITIAL_TASKS: Task[] = [
  { id: 'TSK-1001', projectId: 'PRJ-101', title: 'Implement JWT Auth in server.ts', assignee: 'Adi Wijaya', priority: 'High', status: 'Done', dueDate: '2026-06-10' },
  { id: 'TSK-1002', projectId: 'PRJ-101', title: 'Design Responsive Mobile Dashboard UI', assignee: 'Rizky Pratama', priority: 'Medium', status: 'In Progress', dueDate: '2026-06-25' },
  { id: 'TSK-1003', projectId: 'PRJ-101', title: 'Setup Multi-Tenant Redis Caching', assignee: 'Heri Gunawan', priority: 'High', status: 'Todo', dueDate: '2026-07-05' },
  { id: 'TSK-1004', projectId: 'PRJ-102', title: 'Configure Multi-region Postgres DB Cluster', assignee: 'Heri Gunawan', priority: 'Urgent', status: 'In Progress', dueDate: '2026-06-20' },
  { id: 'TSK-1005', projectId: 'PRJ-102', title: 'Define SLA and Escalation Paths', assignee: 'Lia Ananda', priority: 'Low', status: 'Backlog', dueDate: '2026-09-01' },
  { id: 'TSK-1006', projectId: 'PRJ-103', title: 'Conduct Internal Penetration Test', assignee: 'Adi Wijaya', priority: 'Urgent', status: 'Done', dueDate: '2026-05-15' },
  { id: 'TSK-1007', projectId: 'PRJ-103', title: 'Resolve Financial Audit Vulnerabilities', assignee: 'Sari Devita', priority: 'High', status: 'Done', dueDate: '2026-05-28' },
  { id: 'TSK-1008', projectId: 'PRJ-104', title: 'Map HubSpot Leads Fields Integration', assignee: 'Denny Hidayat', priority: 'Medium', status: 'Backlog', dueDate: '2026-07-15' },
  { id: 'TSK-1009', projectId: 'PRJ-104', title: 'Draft CRM UI Mockups', assignee: 'Rizky Pratama', priority: 'Low', status: 'Todo', dueDate: '2026-06-30' },
  { id: 'TSK-1010', projectId: 'PRJ-101', title: 'Final Code Audit for Beta Launch', assignee: 'Adi Wijaya', priority: 'High', status: 'Review', dueDate: '2026-06-18' }
];

export const INITIAL_CRM_LEADS: CRMLead[] = [
  { id: 'LD-101', name: 'Bambang Utomo', company: 'PT Astra Nusantara', email: 'bambang@astranusa.co.id', phone: '+62 811-2345-678', leadValue: 750000000, status: 'Negotiation', nextMeeting: '2026-06-15 14:00', notes: 'Sangat tertarik dengan paket Enterprise Cloud Migrations. Menunggu persetujuan diskon 5%.' },
  { id: 'LD-102', name: 'Farah Quinn', company: 'Quinn Retail Group', email: 'farah@quinnretail.com', phone: '+62 812-9876-543', leadValue: 350000000, status: 'Proposal', nextMeeting: '2026-06-18 10:00', notes: 'Proposal modul inventory & omnichannel telah dikirim. Butuh integrasi barcode scan.' },
  { id: 'LD-103', name: 'Roy Marten', company: 'Digital Nusantara Solusindo', email: 'roy@dns.net', phone: '+62 821-4433-221', leadValue: 1200000000, status: 'Qualified', nextMeeting: '2026-06-22 11:30', notes: 'Klien menginginkan sistem ERP berskala besar dengan deployment hybrid cloud.' },
  { id: 'LD-104', name: 'Citra Kirana', company: 'Karya Agung Property', email: 'citra@karyaagung.co.id', phone: '+62 819-3355-779', leadValue: 480000000, status: 'Won', nextMeeting: 'Completed', notes: 'Kontrak ditandatangani hari ini untuk 3 tahun. Uang muka 30% telah dicarikan ke bank.' },
  { id: 'LD-105', name: 'Gunawan Sudrajat', company: 'Indo Logistik Abadi', email: 'gunawan@indolog.id', phone: '+62 813-5566-778', leadValue: 200000000, status: 'Prospect', nextMeeting: '2026-06-20 09:15', notes: 'Mencari solusi tracking armada kendaraan terintegrasi ERP.' },
  { id: 'LD-106', name: 'Maya Amelia', company: 'Sumatera Pulp & Paper', email: 'maya@sumaterapulp.com', phone: '+62 811-5544-332', leadValue: 900000000, status: 'Lost', nextMeeting: '-', notes: 'Kalah komparasi fitur dengan partner lokal yang bersedia install on-premise sepenuhnya.' }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'INV-001', sku: 'HW-SRV-DL360', name: 'HPE ProLiant DL360 Gen11 Server', category: 'Hardware', stock: 4, minAlertStock: 2, supplier: 'Metrodata Solusindo', purchasePrice: 48000000, sellingPrice: 59000000 },
  { id: 'INV-002', sku: 'SW-LIC-MS365', name: 'Microsoft 365 Enterprise E5 (1 Year)', category: 'Software Licenses', stock: 120, minAlertStock: 15, supplier: 'Bhineka Tech', purchasePrice: 6200000, sellingPrice: 7500000 },
  { id: 'INV-003', sku: 'HW-LT-XPS15', name: 'Dell XPS 15 9530 Developer Edition', category: 'Hardware', stock: 12, minAlertStock: 3, supplier: 'Dell Indonesia Corp', purchasePrice: 28500000, sellingPrice: 34000000 },
  { id: 'INV-004', sku: 'HW-MON-U4021', name: 'Dell UltraSharp 40" Curved WUHD Monitor', category: 'Hardware', stock: 5, minAlertStock: 2, supplier: 'Dell Indonesia Corp', purchasePrice: 21000000, sellingPrice: 25500000 },
  { id: 'INV-005', sku: 'SW-LIC-AWS100', name: 'AWS Cloud Credit Coupon ($1000 Pack)', category: 'Software Licenses', stock: 18, minAlertStock: 5, supplier: 'Amazon Web Services', purchasePrice: 13500000, sellingPrice: 15200000 },
  { id: 'INV-006', sku: 'INF-APC-1500', name: 'APC Smart-UPS SMT 1500VA LCD 230V', category: 'Infrastructure', stock: 1, minAlertStock: 2, supplier: 'Schneider Electric', purchasePrice: 8900000, sellingPrice: 11000000 }, // LOW STOCK ALERT
  { id: 'INV-007', sku: 'HW-PER-MXM3', name: 'Logitech MX Master 3S Wireless Mouse', category: 'Peripherals', stock: 42, minAlertStock: 10, supplier: 'Logitech Hub', purchasePrice: 1450000, sellingPrice: 1850000 },
  { id: 'INV-008', sku: 'OFF-PAP-A4', name: 'PaperOne A4 Paper High Quality 80gsm (Box)', category: 'Office Supplies', stock: 3, minAlertStock: 5, supplier: 'Sinar Mas Paper', purchasePrice: 220000, sellingPrice: 310000 } // LOW STOCK ALERT
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'TX-4001', date: '2026-06-01', category: 'Revenue', type: 'Income', amount: 350000000, description: 'Pembayaran DP 30% Karya Agung Property Proyek CRM' },
  { id: 'TX-4002', date: '2026-06-02', category: 'Payroll', type: 'Expense', amount: 123800000, description: 'Pajak & Gaji Karyawan Utama Bulanan Mei 2026' },
  { id: 'TX-4003', date: '2026-06-03', category: 'Hosting', type: 'Expense', amount: 15400000, description: 'SaaS AWS Cloud Provider Hosting Billing' },
  { id: 'TX-4004', date: '2026-06-04', category: 'Marketing', type: 'Expense', amount: 18500000, description: 'Google Ads & LinkedIn Sales Navigator Campaign' },
  { id: 'TX-4005', date: '2026-06-05', category: 'Procurement', type: 'Expense', amount: 96000000, description: 'Pengadaan HPE ProLiant Server untuk Unit Gudang Metrodata' },
  { id: 'TX-4006', date: '2026-06-06', category: 'Revenue', type: 'Income', amount: 150000000, description: 'Pelunasan Proyek Security Audit Bank Syariah Indonesia' },
  { id: 'TX-4007', date: '2026-06-08', category: 'Operations', type: 'Expense', amount: 4500000, description: 'Sewa Internet Fiber Optik Biznet Dedicated Kantor Pusat' },
  { id: 'TX-4008', date: '2026-06-09', category: 'Revenue', type: 'Income', amount: 75000000, description: 'Penjualan License Microsoft 365 E5 Quinn Group' },
  { id: 'TX-4009', date: '2026-06-11', category: 'Operations', type: 'Expense', amount: 6200000, description: 'Listrik PLN Graha Multi-Teknologi Bulanan' },
  { id: 'TX-4010', date: '2026-06-12', category: 'Revenue', type: 'Income', amount: 110000000, description: 'Pelunasan Lisensi AWS Cloud Credit PT Astra Nusantara' }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'LOG-001', user: 'Yogi Ilham', action: 'User Sign-in', timestamp: '2026-06-13 08:15:32', ipAddress: '182.253.40.11' },
  { id: 'LOG-002', user: 'Yogi Ilham', action: 'Create CRM Lead: Citra Kirana', timestamp: '2026-06-13 08:30:11', ipAddress: '182.253.40.11' },
  { id: 'LOG-003', user: 'Siti Rahma', action: 'Modify Employee Contract Status: EMP-003', timestamp: '2026-06-13 09:05:44', ipAddress: '36.85.12.98' },
  { id: 'LOG-004', user: 'Ahmad Faisal', action: 'Approve Procurement Invoice TX-4005', timestamp: '2026-06-12 17:42:01', ipAddress: '114.122.31.205' },
  { id: 'LOG-005', user: 'Yogi Ilham', action: 'Export Financial Report PDF', timestamp: '2026-06-13 09:33:00', ipAddress: '182.253.40.11' },
  { id: 'LOG-006', user: 'Budi Santoso', action: 'Update Inventory SKU stock: HW-MON-U4021', timestamp: '2026-06-11 14:32:15', ipAddress: '103.111.90.14' }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: 'NTF-001', title: 'Low Inventory Alert', category: 'system', message: 'PaperOne A4 Paper stock falls below alert limit (3 items left). Please procure soon.', status: 'unread', timestamp: '2026-06-13 08:00' },
  { id: 'NTF-002', title: 'Action Required: CRM Meeting', category: 'crm', message: 'Negotiation meeting with Bambang Utomo (PT Astra Nusantara) starts in 2 hours.', status: 'unread', timestamp: '2026-06-13 08:15' },
  { id: 'NTF-003', title: 'Project Milestones Approved', category: 'project', message: 'Fintech Security Audit completed status has been signed by regional manager.', status: 'read', timestamp: '2026-06-12 18:00' },
  { id: 'NTF-004', title: 'Financial Monthly Review', category: 'finance', message: 'Profit & Loss analysis for Q2 has been calculated. Operational cost decreased 4.5%.', status: 'read', timestamp: '2026-06-12 17:00' }
];
