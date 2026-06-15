import { useState, useEffect } from "react";
import { 
  Settings, 
  User, 
  ShieldCheck, 
  Database, 
  History, 
  Users, 
  Trash2, 
  RefreshCw, 
  FileJson,
  Cpu,
  Terminal,
  Activity
} from "lucide-react";
import { AuditLog } from "../types";

interface SettingsViewProps {
  auditLogs: AuditLog[];
  onRefreshLogs: () => void;
}

export default function SettingsView({ auditLogs, onRefreshLogs }: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'system' | 'audit'>('profile');
  
  // Profile settings
  const [profile, setProfile] = useState({
    fullName: "Yogi Ilham Pratama",
    email: "yogi.ilham@omnicorp.id",
    company: "OmniCorp Indonesia Ltd",
    role: "Super Admin",
    phone: "+62 811-2233-4455"
  });

  // System Configuration values
  const [sysConfig, setSysConfig] = useState({
    maintenanceMode: false,
    rbacAuditing: true,
    geminiPrecision: "Balanced-Creative",
    dailyBackup: true,
    timezone: "Asia/Jakarta (GMT+7)"
  });

  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Profil korporasi berhasil di-update secara virtual!");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-1 text-left leading-normal">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">System Configuration & Logs</h2>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Atur profil personal Admin, atur global parameter state, dan reviu log audit kepatuhan ISO 27001.</p>
        </div>
      </div>

      {/* Sub navigation bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex gap-4 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`pb-2 text-xs font-semibold px-1 cursor-pointer transition-colors shrink-0 ${
            activeTab === 'profile' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Profil Admin
        </button>
        <button 
          onClick={() => setActiveTab('system')}
          className={`pb-2 text-xs font-semibold px-1 cursor-pointer transition-colors shrink-0 ${
            activeTab === 'system' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Konfigurasi Sistem
        </button>
        <button 
          onClick={() => {
            setActiveTab('audit'); 
            onRefreshLogs();
          }}
          className={`pb-2 text-xs font-semibold px-1 cursor-pointer transition-colors shrink-0 flex items-center gap-1 ${
            activeTab === 'audit' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <History size={12} /> Audit History & Timeline
        </button>
      </div>

      {/* VIEW CHASSIS */}
      <div className="text-left text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
        
        {/* TAB 1: ADMIN PROFILE CONTROLS */}
        {activeTab === 'profile' && (
          <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <User size={13} className="text-blue-500" /> Kredensial Administrator Utama
            </h3>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Pengguna</label>
              <input 
                type="text" 
                value={profile.fullName} 
                onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                className="w-full text-xs p-2 rounded border bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-800 text-slate-850 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Role Sistem</label>
                <input 
                  type="text" 
                  disabled 
                  value={profile.role} 
                  className="w-full text-xs p-2 rounded border bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed dark:bg-slate-800 dark:border-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Perusahaan</label>
                <input 
                  type="text" 
                  disabled 
                  value={profile.company} 
                  className="w-full text-xs p-2 rounded border bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed dark:bg-slate-805"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Alamat Email</label>
                <input 
                  type="email" 
                  value={profile.email} 
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full text-xs p-2 rounded border bg-slate-50 text-slate-850"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">No. Handphone</label>
                <input 
                  type="text" 
                  value={profile.phone} 
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full text-xs p-2 rounded border bg-slate-50 text-slate-850"
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer shadow"
              >
                Simpan Perubahan Profil
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: SYSTEM CONFIGURATION VARIABLES */}
        {activeTab === 'system' && (
          <div className="space-y-6 max-w-xl">
            
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Cpu size={13} className="text-blue-500" /> Pengaturan Server Core
              </h3>
              
              <div className="space-y-3">
                
                <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded">
                  <div>
                    <strong className="text-xs font-bold text-slate-800 dark:text-slate-200">Mode Perawatan (Maintenance Mode)</strong>
                    <p className="text-[10px] text-slate-500">Membekukan akses tulis database untuk non-admin.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={sysConfig.maintenanceMode}
                    onChange={(e) => setSysConfig({...sysConfig, maintenanceMode: e.target.checked})}
                    className="w-4 h-4 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded">
                  <div>
                    <strong className="text-xs font-bold text-slate-800 dark:text-slate-200">Enforce RBAC Auditing</strong>
                    <p className="text-[10px] text-slate-500">Mencatat mutasi CRUD harian ke server audit logs timeline.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={sysConfig.rbacAuditing}
                    onChange={(e) => setSysConfig({...sysConfig, rbacAuditing: e.target.checked})}
                    className="w-4 h-4 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded">
                  <div>
                    <strong className="text-xs font-bold text-slate-800 dark:text-slate-200">Simulasi Backup Otomatis Harian</strong>
                    <p className="text-[10px] text-slate-500">Ekspor berkas terkompresi SQL jam 01:00 UTC.</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={sysConfig.dailyBackup}
                    onChange={(e) => setSysConfig({...sysConfig, dailyBackup: e.target.checked})}
                    className="w-4 h-4 cursor-pointer"
                  />
                </div>

                <div className="p-3 border border-slate-100 dark:border-slate-800 rounded space-y-2">
                  <div className="flex justify-between items-center">
                    <strong className="text-xs font-bold text-slate-850 dark:text-slate-200">Gemini LLM Co-Pilot Mode Precision</strong>
                    <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-1.5 py-0.5 rounded font-mono">Dynamic Mode</span>
                  </div>
                  <select 
                    value={sysConfig.geminiPrecision}
                    onChange={(e) => setSysConfig({...sysConfig, geminiPrecision: e.target.value})}
                    className="w-full text-xs p-1.5 border rounded bg-slate-50 dark:bg-slate-800 dark:border-slate-800"
                  >
                    <option value="Balanced-Creative">Balanced Creative (Recommended ERP context)</option>
                    <option value="Deterministic">Deterministic (Strict numbers only)</option>
                    <option value="Pure AI Studio Default">AI Studio default configs</option>
                  </select>
                </div>

              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded border border-slate-200 border-dashed dark:border-slate-800 text-slate-500">
              <span className="font-mono text-[9px] uppercase font-bold tracking-wider text-slate-450 block mb-1">ISO 27001 Compliance Statement</span>
              Tingkat konfigurasi di atas diaudit berkala sesuai standar operasional PT OmniCorp Indonesia. Segala manipulasi state direkam di modul timeline log.
            </div>

          </div>
        )}

        {/* TAB 3: AUDIT HISTORY TIMELINE (REQUIRED EXACT USER REQUEST!) */}
        {activeTab === 'audit' && (
          <div className="space-y-4 text-left">
            
            <div className="flex items-center justify-between border-b pb-3 border-slate-150 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-blue-500" />
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Security compliance timeline</h3>
              </div>
              <button 
                onClick={onRefreshLogs}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] border text-slate-500 hover:bg-slate-50 rounded transition cursor-pointer"
              >
                <RefreshCw size={11} className="animate-spin" /> Muat Ulang Log
              </button>
            </div>

            {/* Timeline container */}
            <div className="relative border-l border-slate-200 dark:border-slate-800 pl-4 ml-3 space-y-6 pt-2" id="audit-logs-timeline-trail">
              {auditLogs.length === 0 ? (
                <p className="text-slate-400 italic text-xs py-4 pl-2">Belum ada aktivitas tercatat pada log audit.</p>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="relative group text-left">
                    
                    {/* Circle Bullet icon marker */}
                    <span className="absolute -left-[24.5px] top-1.5 bg-blue-500 w-2.5 h-2.5 rounded-full ring-4 ring-white dark:ring-slate-900 group-hover:bg-blue-600 transition" />

                    <div className="space-y-1">
                      
                      {/* DateTime and User info */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-850 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400 font-bold font-mono">
                          User: {log.user}
                        </span>
                        <span className="text-[9px] font-mono text-slate-450">
                          IP: {log.ipAddress}
                        </span>
                      </div>

                      {/* Description Action */}
                      <p className="text-[11px] text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
                        {log.action}
                      </p>

                    </div>

                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-slate-150 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span>Menampilkan {auditLogs.length} entri audit log harian</span>
              <span>Audit Log v1.0 • OmniCorp Compliance Ledger</span>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
