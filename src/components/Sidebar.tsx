import { 
  LayoutDashboard, 
  Users, 
  Contact, 
  FolderGit2, 
  Boxes, 
  DollarSign, 
  LineChart, 
  FileText, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  Bot
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  notificationsCount: number;
}

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed, notificationsCount }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
    { id: 'users', label: 'Manajemen Pengguna', icon: ShieldCheck },
    { id: 'employees', label: 'Manajemen Karyawan', icon: Users },
    { id: 'projects', label: 'Manajemen Proyek', icon: FolderGit2 },
    { id: 'crm', label: 'CRM Pelanggan', icon: Contact },
    { id: 'inventory', label: 'Manajemen Inventaris', icon: Boxes },
    { id: 'finance', label: 'Manajemen Keuangan', icon: DollarSign },
    { id: 'analytics', label: 'Analitik & audit', icon: LineChart },
  ];

  return (
    <aside 
      id="sidebar-container"
      className={`relative h-screen bg-white dark:bg-slate-900 border-r border-[#E5E7EB] dark:border-slate-800 flex flex-col justify-between transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Branding Area */}
        <div className="h-16 flex items-center px-4 border-b border-[#E5E7EB] dark:border-slate-800 justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-[#2563EB] rounded-lg flex items-center justify-center shrink-0">
              <span className="font-mono font-black text-white text-base">O</span>
            </div>
            {!collapsed && (
              <span className="font-sans font-semibold text-slate-900 dark:text-slate-100 text-lg tracking-tight transition-all duration-200">
                OmniCorp
              </span>
            )}
          </div>
          <button
            id="toggle-sidebar"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
 
        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                id={`sidebar-${item.id}`}
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-xs font-medium cursor-pointer ${
                  isActive 
                    ? 'bg-[#F3F4F6] text-[#2563EB] dark:bg-slate-800 dark:text-blue-400 font-medium' 
                    : 'text-[#4B5563] dark:text-slate-400 hover:bg-[#F9FAFB] dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-150'
                }`}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
 
      {/* Footer Meta Area */}
      <div className="p-4 border-t border-[#E5E7EB] dark:border-slate-800">
        <div className="bg-gray-50 dark:bg-slate-800/40 rounded-lg p-2.5 overflow-hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-bold shrink-0">
              YI
            </div>
            {!collapsed && (
              <div className="truncate text-left">
                <p className="text-[11px] font-semibold text-slate-900 dark:text-slate-200 leading-tight">Yogi Ilham</p>
                <p className="text-[9px] text-slate-500 dark:text-slate-450 truncate">Super Admin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
