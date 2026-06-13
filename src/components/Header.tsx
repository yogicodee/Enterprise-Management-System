import { useState, useEffect } from "react";
import { 
  Bell, 
  Search, 
  Check, 
  Trash2, 
  Sun, 
  Moon, 
  Clock, 
  Globe2,
  Calendar,
  Layers,
  ArrowRight,
  Bot
} from "lucide-react";
import { AppNotification } from "../types";

interface HeaderProps {
  activeTab: string;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  notifications: AppNotification[];
  refreshNotifications: () => void;
  onSearchQuery: (query: string) => void;
  onOpenAssistant: () => void;
}

export default function Header({ 
  activeTab, 
  theme, 
  setTheme, 
  notifications, 
  refreshNotifications,
  onSearchQuery,
  onOpenAssistant
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  const unreadCount = notifications.filter(n => n.status === "unread").length;

  useEffect(() => {
    // Clock tick
    const updateTime = () => {
      const now = new Date();
      // Format as HH:mm:ss WIB (or Local Time)
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setCurrentTime(now.toLocaleTimeString('id-ID', options) + " WIB");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      refreshNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: "all" })
      });
      refreshNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    onSearchQuery(val);
  };

  // Human-readable titles mapping
  const titleMap: Record<string, string> = {
    dashboard: "Executive Main Dashboard",
    users: "Manajemen Sistem Keamanan & Akses",
    employees: "Master Staff & payroll System",
    projects: "Kanban Project Tracker",
    crm: "CRM Leads & Sales Pipelines",
    inventory: "Supply Chain & Inventory Registry",
    finance: "General Finance Ledger",
    analytics: "Corporate Intelligence & Audit Logs",
  };

  return (
    <header 
      id="header-bar"
      className="h-16 border-b flex items-center justify-between px-6 shrink-0 transition-colors z-20 bg-white border-[#E5E7EB] dark:bg-slate-900 dark:border-slate-800"
    >
      {/* Title & Path */}
      <div className="flex items-center gap-3">
        <Layers size={16} className="text-blue-500 hidden sm:block shrink-0" />
        <div className="text-left">
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500">Root / Corporate</p>
          <h1 className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-150">
            {titleMap[activeTab] || "OmniCorp Enterprise"}
          </h1>
        </div>
      </div>

      {/* Global Actions Bar Container */}
      <div className="flex items-center gap-4">
        
        {/* Modern Live Clock Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-800/60 rounded-full border border-[#E5E7EB] dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400">
          <Clock size={12} className="text-blue-500 animate-pulse" />
          <span>{currentTime}</span>
        </div>

        {/* Global Smart Search with Hotkey preview */}
        <div className="relative w-48 md:w-64 max-w-xs shrink-0">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-450 dark:text-slate-500">
            <Search size={14} />
          </span>
          <input
            id="global-smart-search"
            type="text"
            placeholder="Cari data, proyek, SKU..."
            value={localSearch}
            onChange={handleSearchChange}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            className="w-full text-xs pl-9 pr-4 py-1.5 rounded-lg border border-transparent focus:border-[#E5E7EB] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none bg-[#F9FAFB] dark:bg-slate-800/50 transition-all duration-150"
          />
          {localSearch === "" && !searchFocused && (
            <kbd className="absolute right-2 top-1.5 px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 text-[9px] text-slate-400 dark:text-slate-500 rounded font-semibold font-sans hidden md:inline-block pointer-events-none">
              ⌘K
            </kbd>
          )}
        </div>

        {/* AI Co-Pilot Slideout Button */}
        <button
          id="co-pilot-quick-action"
          onClick={onOpenAssistant}
          className="flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-slate-100 transition rounded-lg text-xs font-medium cursor-pointer"
        >
          <Bot size={13} />
          <span className="hidden sm:inline">AI Co-Pilot</span>
        </button>

        {/* Theme Toggler and Notifications */}
        <div className="flex items-center gap-1 border-l pl-3 border-slate-200 dark:border-slate-800">
          
          <button
            id="theme-toggler"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md transition-colors"
            title="Toggle Theme"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Connected Notifications Bell */}
          <div className="relative">
            <button
              id="notifications-ledger-toggle"
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 cursor-pointer rounded-md transition-colors ${
                showNotifications || unreadCount > 0
                  ? 'bg-blue-500/5 hover:bg-blue-500/10 text-blue-500' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
              )}
            </button>

            {/* Notifications Absolute Dropdown Card */}
            {showNotifications && (
              <div 
                id="notifications-slide-popup"
                className="absolute right-0 mt-3 w-80 max-w-sm rounded-lg border shadow-xl flex flex-col z-50 bg-white border-slate-200 dark:bg-slate-850 dark:border-slate-850"
              >
                <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30 rounded-t-lg">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Alert & Notifikasi ({unreadCount})</p>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-[10px] text-blue-500 font-medium hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Check size={10} /> Bersihkan
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 dark:text-slate-500">
                      <p className="text-xs">Tidak ada log notifikasi baru.</p>
                    </div>
                  ) : (
                    notifications.map((ntf) => (
                      <div 
                        key={ntf.id} 
                        className={`p-3 text-left transition-colors relative ${
                          ntf.status === "unread" ? 'bg-blue-500/5 dark:bg-blue-500/[0.02]' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start gap-1">
                          <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{ntf.title}</p>
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono shrink-0">{ntf.timestamp.split(" ")[1] || ntf.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">{ntf.message}</p>
                        {ntf.status === "unread" && (
                          <button
                            onClick={() => markAsRead(ntf.id)}
                            className="absolute bottom-2 right-2 p-1 bg-blue-500/10 hover:bg-blue-500 text-blue-600 dark:text-blue-400 hover:text-white rounded-md transition duration-150 cursor-pointer text-[9px]"
                            title="Mark as Read"
                          >
                            <Check size={10} />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </header>
  );
}
