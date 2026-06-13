export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Manager' | 'Staff' | 'Viewer';
  status: 'Active' | 'Inactive' | 'Pending';
  lastLogin: string;
}

export interface Employee {
  id: string;
  name: string;
  department: 'IT' | 'Finance' | 'HR' | 'Sales' | 'Operations';
  position: string;
  salary: number;
  joinDate: string;
  contractStatus: 'Permanent' | 'Contract' | 'Intern';
  attendanceRate: number; // Percentage
  performanceScore: number; // 1-5 scale
}

export interface Project {
  id: string;
  name: string;
  progress: number; // Percentage
  members: string[]; // List of Employee names/IDs
  budget: number;
  spent: number;
  deadline: string;
  status: 'Planning' | 'In Progress' | 'Review' | 'Completed' | 'On Hold';
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  assignee: string; // Employee Name
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Backlog' | 'Todo' | 'In Progress' | 'Review' | 'Done';
  dueDate: string;
}

export interface CRMLead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  leadValue: number;
  status: 'Prospect' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  nextMeeting: string;
  notes: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'Hardware' | 'Software Licenses' | 'Office Supplies' | 'Infrastructure' | 'Peripherals';
  stock: number;
  minAlertStock: number;
  supplier: string;
  purchasePrice: number;
  sellingPrice: number;
}

export interface Transaction {
  id: string;
  date: string;
  category: 'Revenue' | 'Payroll' | 'Marketing' | 'Operations' | 'Procurement' | 'Hosting';
  type: 'Income' | 'Expense';
  amount: number;
  description: string;
  reference?: string;
  status?: 'Approved' | 'Pending';
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  ipAddress: string;
}

export interface AppNotification {
  id: string;
  title: string;
  category: 'system' | 'finance' | 'project' | 'crm';
  message: string;
  status: 'unread' | 'read';
  timestamp: string;
}

export interface DashboardMetrics {
  totalUsers: number;
  totalEmployees: number;
  totalProjects: number;
  totalRevenue: number;
  totalExpenses: number;
  pendingTasks: number;
  lowStockCount: number;
}
