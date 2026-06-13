import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Seed data
import {
  INITIAL_USERS,
  INITIAL_EMPLOYEES,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_CRM_LEADS,
  INITIAL_INVENTORY,
  INITIAL_TRANSACTIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS
} from "./src/data.js";

import { User, Employee, Project, Task, CRMLead, InventoryItem, Transaction, AuditLog, AppNotification } from "./src/types.js";

// In-memory data store for live CRUD persistence
let users: User[] = [...INITIAL_USERS];
let employees: Employee[] = [...INITIAL_EMPLOYEES];
let projects: Project[] = [...INITIAL_PROJECTS];
let tasks: Task[] = [...INITIAL_TASKS];
let leads: CRMLead[] = [...INITIAL_CRM_LEADS];
let inventory: InventoryItem[] = [...INITIAL_INVENTORY];
let transactions: Transaction[] = [...INITIAL_TRANSACTIONS];
let auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];
let notifications: AppNotification[] = [...INITIAL_NOTIFICATIONS];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json());

  // Helper log function
  const createLog = (user: string, action: string, ip: string = "127.0.0.1") => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newLog: AuditLog = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      user,
      action,
      timestamp,
      ipAddress: ip
    };
    auditLogs.unshift(newLog);
    if (auditLogs.length > 100) auditLogs.pop();
    return newLog;
  };

  // 1. USERS API
  app.get("/api/users", (req, res) => {
    res.json(users);
  });

  app.post("/api/users", (req, res) => {
    const newUser = req.body;
    newUser.id = `USR-${Math.floor(100 + Math.random() * 900)}`;
    newUser.lastLogin = "-";
    users.push(newUser);
    createLog("System/Admin", `Created user: ${newUser.name} [${newUser.role}]`);
    res.status(201).json(newUser);
  });

  app.put("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...body };
      createLog("System/Admin", `Updated user settings for: ${users[index].name}`);
      res.json(users[index]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      const deleted = users[index];
      users = users.filter(u => u.id !== id);
      createLog("System/Admin", `Deleted user account: ${deleted.name}`);
      res.json({ success: true, deletedId: id });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  // 2. EMPLOYEES API
  app.get("/api/employees", (req, res) => {
    res.json(employees);
  });

  app.post("/api/employees", (req, res) => {
    const emp = req.body;
    emp.id = `EMP-${Math.floor(100 + Math.random() * 900)}`;
    employees.push(emp);
    createLog("System/Admin", `Added employee record: ${emp.name} in ${emp.department}`);
    // Auto trigger notification
    notifications.unshift({
      id: `NTF-${Math.floor(1000 + Math.random() * 9000)}`,
      title: "New Employee Onboarded",
      category: "system",
      message: `${emp.name} joined as ${emp.position} in ${emp.department} department.`,
      status: "unread",
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    });
    res.status(201).json(emp);
  });

  app.put("/api/employees/:id", (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const index = employees.findIndex(e => e.id === id);
    if (index !== -1) {
      employees[index] = { ...employees[index], ...body };
      createLog("System/Admin", `Modified employee records: ${employees[index].name}`);
      res.json(employees[index]);
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  });

  app.delete("/api/employees/:id", (req, res) => {
    const { id } = req.params;
    const index = employees.findIndex(e => e.id === id);
    if (index !== -1) {
      const deleted = employees[index];
      employees = employees.filter(e => e.id !== id);
      createLog("System/Admin", `Declassified employee file: ${deleted.name}`);
      res.json({ success: true, deletedId: id });
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  });

  // 3. PROJECTS API
  app.get("/api/projects", (req, res) => {
    res.json(projects);
  });

  app.post("/api/projects", (req, res) => {
    const proj = req.body;
    proj.id = `PRJ-${Math.floor(100 + Math.random() * 900)}`;
    projects.push(proj);
    createLog("System/Admin", `Initiated new corporate project: ${proj.name}`);
    res.status(201).json(proj);
  });

  app.put("/api/projects/:id", (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...body };
      createLog("System/Admin", `Updated progress of project: ${projects[index].name}`);
      res.json(projects[index]);
    } else {
      res.status(404).json({ error: "Project not found" });
    }
  });

  // 4. KANBAN TASKS API
  app.get("/api/tasks", (req, res) => {
    res.json(tasks);
  });

  app.post("/api/tasks", (req, res) => {
    const task = req.body;
    task.id = `TSK-${Math.floor(1000 + Math.random() * 9000)}`;
    tasks.push(task);
    createLog("System/Admin", `Assigned task: "${task.title}" to ${task.assignee}`);
    res.status(201).json(task);
  });

  app.put("/api/tasks/:id", (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...body };
      createLog("System/Admin", `Modified task status: "${tasks[index].title}" -> ${tasks[index].status}`);
      res.json(tasks[index]);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  });

  app.delete("/api/tasks/:id", (req, res) => {
    const { id } = req.params;
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      const deleted = tasks[index];
      tasks = tasks.filter(t => t.id !== id);
      createLog("System/Admin", `Removed task checklist: "${deleted.title}"`);
      res.json({ success: true, deletedId: id });
    } else {
      res.status(404).json({ error: "Task or checklist item not found" });
    }
  });

  // 5. CRM LEADS API
  app.get("/api/crm", (req, res) => {
    res.json(leads);
  });

  app.post("/api/crm", (req, res) => {
    const lead = req.body;
    lead.id = `LD-${Math.floor(100 + Math.random() * 900)}`;
    leads.push(lead);
    createLog("System/Admin", `Acquired new sales lead: ${lead.name} from ${lead.company}`);
    res.status(201).json(lead);
  });

  app.put("/api/crm/:id", (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const index = leads.findIndex(l => l.id === id);
    if (index !== -1) {
      leads[index] = { ...leads[index], ...body };
      createLog("System/Admin", `Advanced sales lead: ${leads[index].name} to stage ${leads[index].status}`);
      res.json(leads[index]);
    } else {
      res.status(404).json({ error: "Lead not found" });
    }
  });

  app.delete("/api/crm/:id", (req, res) => {
    const { id } = req.params;
    const index = leads.findIndex(l => l.id === id);
    if (index !== -1) {
      const deleted = leads[index];
      leads = leads.filter(l => l.id !== id);
      createLog("System/Admin", `Removed CRM lead archive: ${deleted.name}`);
      res.json({ success: true, deletedId: id });
    } else {
      res.status(404).json({ error: "Lead not found" });
    }
  });

  // 6. INVENTORY API
  app.get("/api/inventory", (req, res) => {
    res.json(inventory);
  });

  app.post("/api/inventory", (req, res) => {
    const item = req.body;
    item.id = `INV-${Math.floor(100 + Math.random() * 900)}`;
    inventory.push(item);
    createLog("System/Admin", `Registered stock inventory core SKU: ${item.name}`);
    res.status(201).json(item);
  });

  app.put("/api/inventory/:id", (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const index = inventory.findIndex(i => i.id === id);
    if (index !== -1) {
      inventory[index] = { ...inventory[index], ...body };
      createLog("System/Admin", `Adjusted stock catalog level for: ${inventory[index].name}`);
      // Auto stock alerts validation
      if (inventory[index].stock <= inventory[index].minAlertStock) {
        notifications.unshift({
          id: `NTF-${Math.floor(1000 + Math.random() * 9000)}`,
          title: "Critical Stock Danger",
          category: "system",
          message: `Stock level for ${inventory[index].name} is critically low (${inventory[index].stock} units left).`,
          status: "unread",
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
        });
      }
      res.json(inventory[index]);
    } else {
      res.status(404).json({ error: "Inventory item not found" });
    }
  });

  app.delete("/api/inventory/:id", (req, res) => {
    const { id } = req.params;
    const index = inventory.findIndex(i => i.id === id);
    if (index !== -1) {
      const deleted = inventory[index];
      inventory = inventory.filter(i => i.id !== id);
      createLog("System/Admin", `Deregistered inventory SKU catalog: ${deleted.sku}`);
      res.json({ success: true, deletedId: id });
    } else {
      res.status(404).json({ error: "Inventory item not found" });
    }
  });

  // 7. FINANCE API
  app.get("/api/transactions", (req, res) => {
    res.json(transactions);
  });

  app.post("/api/transactions", (req, res) => {
    const tx = req.body;
    tx.id = `TX-${Math.floor(1000 + Math.random() * 9000)}`;
    tx.date = new Date().toISOString().substring(0, 10);
    transactions.unshift(tx);
    createLog("System/Admin", `Logged ${tx.type} ledger ledger-entry: Rp ${tx.amount.toLocaleString('id-ID')} for ${tx.description}`);
    res.status(201).json(tx);
  });

  // 8. NOTIFICATIONS & AUDIT LOGS
  app.get("/api/notifications", (req, res) => {
    res.json(notifications);
  });

  app.post("/api/notifications/mark-read", (req, res) => {
    const { id } = req.body;
    if (id === "all") {
      notifications = notifications.map(n => ({ ...n, status: "read" }));
    } else {
      notifications = notifications.map(n => n.id === id ? { ...n, status: "read" } : n);
    }
    res.json({ success: true });
  });

  app.get("/api/audit-logs", (req, res) => {
    res.json(auditLogs);
  });

  // 9. AI ASSISTANT SERVICE WITH GEMINI API
  app.post("/api/gemini/generate", async (req, res) => {
    const { chatHistory, userPrompt } = req.body;

    if (!userPrompt) {
      return res.status(400).json({ error: "Missing prompt parameter." });
    }

    try {
      // Lazy initialize GoogleGenAI securely server-side
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "GEMINI_API_KEY environment variable is missing on this container. Please set it in Settings > Secrets."
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      // Construct a dynamic global company status payload representing realistic real-time state of database in prompt context
      const totalIncome = transactions.filter(t => t.type === 'Income').reduce((a, b) => a + b.amount, 0);
      const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((a, b) => a + b.amount, 0);
      const netRevenue = totalIncome - totalExpense;

      const employeeMetaString = employees.map(e => `[ID ${e.id}] Name: ${e.name}, Dep: ${e.department}, Position: ${e.position}, Salary: Rp ${e.salary.toLocaleString('id-ID')}, Contract: ${e.contractStatus}, Attendance: ${e.attendanceRate}%, KPI score: ${e.performanceScore}/5.0`).join("\n");
      const projectMetaString = projects.map(p => `Project: ${p.name}, Status: ${p.status}, Progress: ${p.progress}%, Budget: Rp ${p.budget.toLocaleString('id-ID')}, Spent: Rp ${p.spent.toLocaleString('id-ID')}`).join("\n");
      const pipelineMetaString = leads.map(l => `Lead: ${l.name} (${l.company}), Stage: ${l.status}, Deal Value: Rp ${l.leadValue.toLocaleString('id-ID')}`).join("\n");
      const stockMetaString = inventory.map(i => `SKU: ${i.sku}, Product: ${i.name}, Stock: ${i.stock} (Min: ${i.minAlertStock}), Cost: Rp ${i.purchasePrice.toLocaleString('id-ID')}`).join("\n");

      // Set robust, professional System Instructions
      const systemInstruction = `Anda adalah Executive AI Co-Pilot & Business Intelligence Assistant untuk "OmniCorp Enterprise Management Dashboard".
Anda berbicara dalam bahasa Indonesia formal, ramah, dan sangat profesional, setara dengan konsultan bisnis McKinsey/SaaS Advisor.

Berikut adalah Status Real-time Enterprise Database saat ini yang dapat Anda analisis langsung untuk pengguna:
=== KEUANGAN ===
* Total Transaksi Pendapatan (Income): Rp ${totalIncome.toLocaleString('id-ID')}
* Total Transaksi Pengeluaran (Expense): Rp ${totalExpense.toLocaleString('id-ID')}
* Saldo Bersih Bulanan (Net Revenue): Rp ${netRevenue.toLocaleString('id-ID')}

=== DAFTAR KARYAWAN ===
${employeeMetaString}

=== PROYEK & TIM ===
${projectMetaString}

=== CRM LEADS PIPELINE ===
${pipelineMetaString}

=== INVENTARIS PRODUK ===
${stockMetaString}

=== LOG AKTIVITAS AUDIT TERBARU ===
${auditLogs.slice(0, 5).map(l => `[${l.timestamp}] ${l.user}: ${l.action}`).join("\n")}

INFORMASI PETUNJUK UTAMA:
- Jawablah seluruh pertanyaan tentang analitik, staf, keuangan, stok barang, atau proyek berlandaskan data real-time autentik di atas.
- JANGAN mengada-ada atau memalsukan angka di luar data di atas. Gunakan kalkulasi aseli jika mereka meminta total, rata-rata, atau perbandingan gaji/progres.
- Berikan insight strategis, rekomendasi bisnis praktis, dan presentasikan data dalam format point list, tabel markdown, atau kutipan bergaya elegan tanpa lebay atau dekorasi berlebihan.
- Jaga kerahasiaan informasi dengan gaya enterprise professional yang kokoh.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          ...chatHistory.map((h: any) => ({
            role: h.role,
            parts: [{ text: h.content }]
          })),
          { role: "user", parts: [{ text: userPrompt }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const reply = response.text || "Terjadi kendala dalam memuat respons dari AI Co-Pilot.";
      res.json({ reply });

    } catch (err: any) {
      console.error("Gemini API Error in backend:", err);
      res.status(500).json({ error: err.message || "Failed to query server-side Gemini assist engine." });
    }
  });

  // Serve static assets / handle Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express Enterprise Core is listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
