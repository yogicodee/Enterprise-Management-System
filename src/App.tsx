import { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardView from "./components/DashboardView";
import UsersView from "./components/UsersView";
import EmployeesView from "./components/EmployeesView";
import ProjectsView from "./components/ProjectsView";
import CrmView from "./components/CrmView";
import InventoryView from "./components/InventoryView";
import FinanceView from "./components/FinanceView";
import SettingsView from "./components/SettingsView";
import AiCopilot from "./components/AiCopilot";

import { 
  User, 
  Employee, 
  Project, 
  Task, 
  CRMLead, 
  InventoryItem, 
  Transaction, 
  AuditLog, 
  AppNotification 
} from "./types";

export default function App() {
  // Main Navigation active context
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'users' | 'employees' | 'projects' | 'crm' | 'inventory' | 'finance' | 'settings'
  >('dashboard');

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Dark vs Light theme
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Sidebar controls
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Floating AI Co-pilot drawer controls
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Core Data stores state
  const [users, setUsers] = useState<User[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Server state loader spinner
  const [loading, setLoading] = useState(true);

  // Fetch all corporate databases from our Express API on mount
  const fetchMasterData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [
        usersRes, 
        employeesRes, 
        projectsRes, 
        tasksRes, 
        leadsRes, 
        inventoryRes, 
        transactionsRes, 
        notificationsRes, 
        logsRes
      ] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/employees'),
        fetch('/api/projects'),
        fetch('/api/tasks'),
        fetch('/api/leads'),
        fetch('/api/inventory'),
        fetch('/api/transactions'),
        fetch('/api/notifications'),
        fetch('/api/logs')
      ]);

      const [
        usersData, 
        employeesData, 
        projectsData, 
        tasksData, 
        leadsData, 
        inventoryData, 
        transactionsData, 
        notificationsData, 
        logsData
      ] = await Promise.all([
        usersRes.json(),
        employeesRes.json(),
        projectsRes.json(),
        tasksRes.json(),
        leadsRes.json(),
        inventoryRes.json(),
        transactionsRes.json(),
        notificationsRes.json(),
        logsRes.json()
      ]);

      setUsers(usersData.users || []);
      setEmployees(employeesData.employees || []);
      setProjects(projectsData.projects || []);
      setTasks(tasksData.tasks || []);
      setLeads(leadsData.leads || []);
      setInventory(inventoryData.inventory || []);
      setTransactions(transactionsData.transactions || []);
      setNotifications(notificationsData.notifications || []);
      setAuditLogs(logsData.logs || []);

    } catch (err) {
      console.error("Gagal memuat basis data utama korporat :", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMasterData();
  }, [fetchMasterData]);

  // Set html element class list for Tailwind responsive dark mode tracking
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Live Audits log reloader helper
  const reloadLogsOnly = async () => {
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      setAuditLogs(data.logs || []);
    } catch (e) {
      console.error("Gagal me-refresh logs:", e);
    }
  };

  // CRUD OPERATIONS BACKED BY API CALLS

  // 1. Users
  const handleAddUser = async (userPayload: Omit<User, 'id' | 'lastLogin'>) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload)
      });
      if (res.ok) {
        fetchMasterData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateUser = async (id: string, updates: Partial<User>) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        fetchMasterData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMasterData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 2. Employees
  const handleAddEmployee = async (empPayload: Omit<Employee, 'id'>) => {
    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empPayload)
      });
      if (res.ok) {
        fetchMasterData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateEmployee = async (id: string, updates: Partial<Employee>) => {
    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        fetchMasterData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMasterData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 3. Projects
  const handleAddProject = async (projPayload: Omit<Project, 'id'>) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projPayload)
      });
      if (res.ok) {
        fetchMasterData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        fetchMasterData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 4. Tasks (Kanban)
  const handleAddTask = async (taskPayload: Omit<Task, 'id'>) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskPayload)
      });
      if (res.ok) {
        fetchMasterData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        fetchMasterData(); // Live reload to update lists
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMasterData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 5. CRM Leads
  const handleAddCRMLead = async (leadPayload: Omit<CRMLead, 'id'>) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload)
      });
      if (res.ok) {
        fetchMasterData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateCRMLead = async (id: string, updates: Partial<CRMLead>) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        fetchMasterData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCRMLead = async (id: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMasterData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 6. Inventory Items
  const handleAddInventoryItem = async (invPayload: Omit<InventoryItem, 'id'>) => {
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invPayload)
      });
      if (res.ok) {
        fetchMasterData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        fetchMasterData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteInventoryItem = async (id: string) => {
    try {
      const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMasterData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 7. Finance Transactions
  const handleAddTransaction = async (txPayload: Omit<Transaction, 'id' | 'date'>) => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(txPayload)
      });
      if (res.ok) {
        fetchMasterData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 8. Notifications
  const handleMarkNotificationRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'PUT' });
      if (res.ok) {
        fetchMasterData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearNotifications = async () => {
    try {
      const res = await fetch(`/api/notifications/clear`, { method: 'POST' });
      if (res.ok) {
        fetchMasterData();
      }
    } catch (e) {
      console.error(e);
    }
  };


  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 flex transition-colors duration-200 antialiased font-sans">
      
      {/* 1. COLLAPSIBLE SIDEBAR */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab: any) => setActiveTab(tab)} 
        collapsed={isSidebarCollapsed} 
        setCollapsed={setIsSidebarCollapsed} 
        notificationsCount={notifications.filter(n => n.status === 'unread').length}
      />

      {/* 2. MAIN VIEW STAGE COMPONENT CHASSIS */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* 2.1 HEADER COMPONENT */}
        <Header 
          activeTab={activeTab}
          theme={theme}
          setTheme={setTheme}
          notifications={notifications}
          refreshNotifications={fetchMasterData}
          onSearchQuery={setSearchQuery}
          onOpenAssistant={() => setIsCopilotOpen(true)}
        />

        {/* 2.2 CENTRALIZED ACTIVE VIEW ROUTER PANEL */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-mono text-slate-500">Menghubungkan ke OmniCorp database...</span>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView 
                  users={users}
                  employees={employees}
                  projects={projects}
                  tasks={tasks}
                  leads={leads}
                  inventory={inventory}
                  transactions={transactions}
                  logs={auditLogs}
                  onNavigate={(tab: any) => setActiveTab(tab)}
                  onQuickTx={(tx) => handleAddTransaction({ ...tx, category: tx.category as any, reference: "QUICK-TX", status: 'Approved' })}
                />
              )}

              {activeTab === 'users' && (
                <UsersView 
                  users={users}
                  onAddUser={handleAddUser}
                  onUpdateUser={handleUpdateUser}
                  onDeleteUser={handleDeleteUser}
                  searchQuery={searchQuery}
                />
              )}

              {activeTab === 'employees' && (
                <EmployeesView 
                  employees={employees}
                  onAddEmployee={handleAddEmployee}
                  onUpdateEmployee={handleUpdateEmployee}
                  onDeleteEmployee={handleDeleteEmployee}
                />
              )}

              {activeTab === 'projects' && (
                <ProjectsView 
                  projects={projects}
                  tasks={tasks}
                  employees={employees}
                  onAddProject={handleAddProject}
                  onUpdateProject={handleUpdateProject}
                  onAddTask={handleAddTask}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                  searchQuery={searchQuery}
                />
              )}

              {activeTab === 'crm' && (
                <CrmView 
                  leads={leads}
                  onAddLead={handleAddCRMLead}
                  onUpdateLead={handleUpdateCRMLead}
                  onDeleteLead={handleDeleteCRMLead}
                  searchQuery={searchQuery}
                />
              )}

              {activeTab === 'inventory' && (
                <InventoryView 
                  inventory={inventory}
                  onAddItem={handleAddInventoryItem}
                  onUpdateItem={handleUpdateInventoryItem}
                  onDeleteItem={handleDeleteInventoryItem}
                  searchQuery={searchQuery}
                />
              )}

              {activeTab === 'finance' && (
                <FinanceView 
                  transactions={transactions}
                  onAddTransaction={handleAddTransaction}
                  searchQuery={searchQuery}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView 
                  auditLogs={auditLogs}
                  onRefreshLogs={reloadLogsOnly}
                />
              )}
            </>
          )}
        </main>

      </div>

      {/* 3. FLOATING CO-PILOT ASSISTANT VIEW (Framer motion simulated sidebar drawer) */}
      {isCopilotOpen && (
        <AiCopilot onDismiss={() => setIsCopilotOpen(false)} />
      )}

    </div>
  );
}
