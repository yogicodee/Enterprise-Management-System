import { useState, useMemo } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Star, 
  Calendar, 
  Calculator, 
  Contact, 
  CheckCircle2,
  FileSpreadsheet,
  FileCheck,
  X,
  CreditCard,
  TrendingUp,
  Briefcase
} from "lucide-react";
import { Employee } from "../types";

interface EmployeesViewProps {
  employees: Employee[];
  onAddEmployee: (emp: Omit<Employee, 'id'>) => void;
  onUpdateEmployee: (id: string, updates: Partial<Employee>) => void;
  onDeleteEmployee: (id: string) => void;
}

export default function EmployeesView({ 
  employees, 
  onAddEmployee, 
  onUpdateEmployee, 
  onDeleteEmployee 
}: EmployeesViewProps) {
  
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'attendance' | 'payroll' | 'performance'>('roster');
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");

  // Add / Edit Employee Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  
  // Selected Employee for Simulated Payslip
  const [selectedPayslipEmp, setSelectedPayslipEmp] = useState<Employee | null>(null);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          emp.position.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDept = deptFilter === "all" || emp.department === deptFilter;
      return matchSearch && matchDept;
    });
  }, [employees, searchQuery, deptFilter]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const total = employees.length;
    const avgSalary = total > 0 ? employees.reduce((sum, e) => sum + e.salary, 0) / total : 0;
    const avgAttendance = total > 0 ? employees.reduce((sum, e) => sum + e.attendanceRate, 0) / total : 0;
    const avgKpi = total > 0 ? employees.reduce((sum, e) => sum + e.performanceScore, 0) / total : 0;
    return { total, avgSalary, avgAttendance, avgKpi };
  }, [employees]);

  // Form Submissions
  const handleAddNewSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get('empName') as string;
    const department = data.get('empDept') as any;
    const position = data.get('empPos') as string;
    const salary = Number(data.get('empSalary'));
    const joinDate = data.get('empJoin') as string || new Date().toISOString().substring(0, 10);
    const contractStatus = data.get('empContract') as any;
    const attendanceRate = Number(data.get('empAttendance')) || 100;
    const performanceScore = Number(data.get('empPerformance')) || 4.0;

    if (name && position && salary > 0) {
      onAddEmployee({ name, department, position, salary, joinDate, contractStatus, attendanceRate, performanceScore });
      setShowAddModal(false);
    }
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingEmp) return;

    const data = new FormData(e.currentTarget);
    const name = data.get('empName') as string;
    const department = data.get('empDept') as any;
    const position = data.get('empPos') as string;
    const salary = Number(data.get('empSalary'));
    const contractStatus = data.get('empContract') as any;
    const attendanceRate = Number(data.get('empAttendance'));
    const performanceScore = Number(data.get('empPerformance'));

    onUpdateEmployee(editingEmp.id, { name, department, position, salary, contractStatus, attendanceRate, performanceScore });
    setEditingEmp(null);
  };

  // Payslip helper calculator
  const calculatePayslipData = (emp: Employee) => {
    const base = emp.salary;
    const allowance = base * 0.15; // 15% allowance (family and transport support)
    const tax = (base + allowance) * 0.05; // 5% PPh 21 income tax simulation
    const bpjs = base * 0.02; // BPJS Kesehatan 2% simulation
    const netPayout = base + allowance - tax - bpjs;

    return { base, allowance, tax, bpjs, netPayout };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-1 text-left leading-normal">
      
      {/* Module Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Human Capital & Payroll Management</h2>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Pusat master administrasi data karyawan, kehadiran log harian, slip gaji otomatis, dan evaluasi KPI berkala.</p>
        </div>
        <button 
          id="btn-add-employee"
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold cursor-pointer shadow-sm transition"
        >
          <Plus size={14} /> Tambahkan Data Karyawan
        </button>
      </div>

      {/* Aggregate KPI HR Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="hr-kpi-row">
        
        <div className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Headcount</p>
          <p className="text-xl font-bold mt-1 text-slate-800 dark:text-slate-100 font-mono">{metrics.total} Orang</p>
          <div className="text-[10px] text-slate-450 dark:text-slate-500 mt-1">Status database aktif</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rata-rata Gaji Pokok</p>
          <p className="text-xl font-bold mt-1 text-slate-800 dark:text-slate-100 font-mono">Rp {Math.floor(metrics.avgSalary).toLocaleString('id-ID')}</p>
          <div className="text-[10px] text-slate-450 dark:text-slate-500 mt-1">Sains Analitik Anggaran</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rata Kehadiran Kerja</p>
          <p className="text-xl font-bold mt-1 text-slate-800 dark:text-slate-100 font-mono">{metrics.avgAttendance.toFixed(1)}%</p>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">Excellent stability rating</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rerata Indeks KPI</p>
          <p className="text-xl font-bold mt-1 text-slate-800 dark:text-slate-100 font-mono">{metrics.avgKpi.toFixed(2)} / 5.0</p>
          <div className="text-[10px] text-purple-600 dark:text-purple-400 mt-1">Evaluasi triwulanan aktif</div>
        </div>

      </div>

      {/* Roster & HR Tabs Selector */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex gap-4 overflow-x-auto">
        <button 
          id="hr-tab-roster"
          onClick={() => setActiveSubTab('roster')}
          className={`pb-2.5 text-xs font-semibold px-1 cursor-pointer transition-colors relative shrink-0 ${
            activeSubTab === 'roster' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Daftar Staf
        </button>
        <button 
          id="hr-tab-attendance"
          onClick={() => setActiveSubTab('attendance')}
          className={`pb-2.5 text-xs font-semibold px-1 cursor-pointer transition-colors relative shrink-0 ${
            activeSubTab === 'attendance' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Kehadiran & Absen
        </button>
        <button 
          id="hr-tab-payroll"
          onClick={() => setActiveSubTab('payroll')}
          className={`pb-2.5 text-xs font-semibold px-1 cursor-pointer transition-colors relative shrink-0 ${
            activeSubTab === 'payroll' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Simulasi Payroll
        </button>
        <button 
          id="hr-tab-performance"
          onClick={() => setActiveSubTab('performance')}
          className={`pb-2.5 text-xs font-semibold px-1 cursor-pointer transition-colors relative shrink-0 ${
            activeSubTab === 'performance' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Pencapaian KPI
        </button>
      </div>

      {/* SUB-VIEW CONTENT CONTAINER */}
      <div>
        
        {/* TAB 1: MASTER ROSTER */}
        {activeSubTab === 'roster' && (
          <div className="space-y-4">
            
            {/* Search Filter bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-lg flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <Search size={14} />
                </span>
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama atau jabatan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-1.5 rounded-md border text-slate-850 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <select 
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="text-xs p-1.5 rounded-md border text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800"
              >
                <option value="all">Semua Departemen</option>
                <option value="IT">IT</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
                <option value="Sales">Sales</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left" id="employees-roster-table">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-150 dark:border-slate-800 text-slate-450 uppercase font-mono text-[9px] tracking-wider">
                      <th className="p-4">ID</th>
                      <th className="p-4">Nama Lengkap</th>
                      <th className="p-4">Departemen</th>
                      <th className="p-4">Jabatan (Roles)</th>
                      <th className="p-4">Kontrak</th>
                      <th className="p-4">Tanggal Gabung</th>
                      <th className="p-4 text-right">Gaji Pokok / Bulan</th>
                      <th className="p-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {filteredEmployees.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-400 dark:text-slate-500">
                          Tidak ditemukan data pegawai.
                        </td>
                      </tr>
                    ) : (
                      filteredEmployees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                          <td className="p-4 font-mono text-slate-500 dark:text-slate-550">{emp.id}</td>
                          <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">{emp.name}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-400 rounded text-[10px] font-semibold">{emp.department}</span>
                          </td>
                          <td className="p-4 text-slate-500 dark:text-slate-400">{emp.position}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              emp.contractStatus === 'Permanent' ? 'bg-blue-500/10 text-blue-600' : emp.contractStatus === 'Contract' ? 'bg-amber-500/10 text-amber-600' : 'bg-slate-200 text-slate-700'
                            }`}>{emp.contractStatus}</span>
                          </td>
                          <td className="p-4 font-mono text-slate-450">{emp.joinDate}</td>
                          <td className="p-4 text-right font-mono font-bold text-slate-800 dark:text-slate-300">Rp {emp.salary.toLocaleString('id-ID')}</td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => setEditingEmp(emp)}
                                className="p-1 text-slate-400 hover:text-blue-500 transition cursor-pointer"
                                title="Edit employee record"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button 
                                onClick={() => onDeleteEmployee(emp.id)}
                                className="p-1 text-slate-400 hover:text-red-500 transition cursor-pointer"
                                title="Delete employee record"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: ATTENDANCE RATINGS */}
        {activeSubTab === 'attendance' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-lg text-left">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Grafik Log Absensi Karyawan</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.map((emp) => (
                <div key={emp.id} className="p-3.5 border border-slate-100 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-800/10 flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{emp.name}</p>
                    <p className="text-[10px] text-slate-450 mt-1">{emp.department} • {emp.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono font-bold text-blue-500">{emp.attendanceRate}%</p>
                    <span className="text-[9px] text-emerald-600 font-bold">Stable</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PAYROLL SLIP GENERATOR SIMULATOR */}
        {activeSubTab === 'payroll' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left 1 columns: Employee list select list */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 text-left">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Pilih Staf</h3>
              
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {employees.map((emp) => {
                  const isSelected = selectedPayslipEmp?.id === emp.id;
                  return (
                    <button 
                      key={emp.id}
                      onClick={() => setSelectedPayslipEmp(emp)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition cursor-pointer ${
                        isSelected ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 text-slate-800 dark:text-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <p className="text-xs font-semibold truncate">{emp.name}</p>
                        <p className={`text-[9px] truncate ${isSelected ? 'text-blue-200' : 'text-slate-450'}`}>{emp.position}</p>
                      </div>
                      <span className={`text-[10px] font-mono shrink-0 font-bold ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                        Rp {Math.floor(emp.salary / 1000000)}M
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right 2 columns: Simulated premium digital corporate payslip */}
            <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 text-left shadow-xs flex flex-col justify-between">
              {selectedPayslipEmp ? (
                <div>
                  
                  {/* Payslip Header Area */}
                  <div className="border-b border-dashed border-slate-200 dark:border-slate-800 pb-4 flex justify-between items-start">
                    <div>
                      <h4 className="font-mono font-bold text-xs uppercase tracking-widest text-slate-450">CORPORATE PAYSLIP</h4>
                      <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100 mt-2">OMNICORP INDONESIA SYSTEM</h3>
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">ID Slip: PAYS-2026-06{selectedPayslipEmp.id.split("-")[1]}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-350">Status: PAID</p>
                      <p className="text-[10px] font-mono text-slate-500 mt-1">Tanggal transfer: 2026-06-02</p>
                    </div>
                  </div>

                  {/* Profile data */}
                  <div className="grid grid-cols-2 gap-4 py-4 text-xs">
                    <div>
                      <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wider block">ID Pegawai</span>
                      <strong className="text-slate-800 dark:text-slate-300 font-mono">{selectedPayslipEmp.id}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wider block">Nama Lengkap</span>
                      <strong className="text-slate-800 dark:text-slate-300">{selectedPayslipEmp.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wider block">Departemen / Jabatan</span>
                      <strong className="text-slate-800 dark:text-slate-300">{selectedPayslipEmp.department} / {selectedPayslipEmp.position}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wider block">Status Hubungan</span>
                      <strong className="text-slate-800 dark:text-slate-300">{selectedPayslipEmp.contractStatus} Employee</strong>
                    </div>
                  </div>

                  {/* Earnings and Payout calculation break down */}
                  <div className="border-t border-slate-200 dark:border-slate-800/80 pt-4 space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Detail Penghitungan & Potongan Pajak</p>
                    
                    {(() => {
                      const data = calculatePayslipData(selectedPayslipEmp);
                      return (
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Gaji Pokok Utama</span>
                            <span className="font-mono text-slate-800 dark:text-slate-300">Rp {data.base.toLocaleString('id-ID')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Tunjangan Operasional (Familial, Transportasi)</span>
                            <span className="font-mono text-emerald-600">+ Rp {data.allowance.toLocaleString('id-ID')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">PPh 21 Negara Pajak Penghasilan (5%)</span>
                            <span className="font-mono text-rose-500">- Rp {data.tax.toLocaleString('id-ID')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">BPJS Jaminan Hari Tua & Kesehatan (2%)</span>
                            <span className="font-mono text-rose-500">- Rp {data.bpjs.toLocaleString('id-ID')}</span>
                          </div>
                          
                          <div className="border-t border-dashed border-slate-200 dark:border-slate-850 pt-3 flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                            <strong className="text-[11px] uppercase font-bold text-slate-900 dark:text-white">Total Gaji Diterima (Net Take Home Pay)</strong>
                            <strong className="font-mono text-sm text-green-600 dark:text-green-400 font-bold">
                              Rp {Math.floor(data.netPayout).toLocaleString('id-ID')}
                            </strong>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                </div>
              ) : (
                <div className="py-24 text-center text-slate-400 dark:text-slate-500">
                  <Calculator size={36} className="mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                  <p className="text-xs">Pilih salah satu staf karyawan di sebelah kiri untuk me-render simulasi cetak slip gaji otomatis secara digital.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 4: PERFORMANCE RATINGS */}
        {activeSubTab === 'performance' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-lg text-left">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Evaluasi Penilaian KPI Pegawai Terhadap Performa</h3>
            <div className="space-y-3">
              {employees.map((emp) => (
                <div key={emp.id} className="p-3 border border-slate-100 dark:border-slate-800 rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-slate-400">{emp.id}</span>
                    <strong className="text-xs text-slate-800 dark:text-slate-200">{emp.name}</strong>
                    <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-1.5 py-0.5 rounded uppercase font-semibold">{emp.department}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1 items-center">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          size={11} 
                          className={s <= Math.floor(emp.performanceScore) ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-700'} 
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">{emp.performanceScore} / 5.0</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* CREATE EMPLOYEE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 max-w-md w-full shadow-2xl relative text-left">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X size={16} />
            </button>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Tambahkan Data Karyawan Baru</h3>

            <form onSubmit={handleAddNewSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Lengkap</label>
                <input type="text" name="empName" required placeholder="Contoh: Heri Gunawan" className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Departemen</label>
                  <select name="empDept" className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800">
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                    <option value="Sales">Sales</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Status Hubungan</label>
                  <select name="empContract" className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800">
                    <option value="Permanent">Permanent</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Jabatan Spesifik</label>
                <input type="text" name="empPos" required placeholder="Frontend Developer, Senior Financial Specialist..." className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Gaji Pokok bulanan (Rp)</label>
                  <input type="number" name="empSalary" required placeholder="Contoh: 10500000" className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-805 border-slate-200 dark:border-slate-800" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tanggal Gabung</label>
                  <input type="date" name="empJoin" className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Log Absensi Kerja (%)</label>
                  <input type="number" name="empAttendance" min={0} max={100} defaultValue={98} className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-800 border-slate-202 dark:border-slate-800" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Skor Kinerja KPI (1-5)</label>
                  <input type="number" step="0.1" min="1" max="5" name="empPerformance" defaultValue="4.2" className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-800 border-slate-202 dark:border-slate-800" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 text-slate-550 rounded text-xs font-semibold">Batal</button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold">Simpan Pegawai</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EMPLOYEE MODAL */}
      {editingEmp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 max-w-md w-full shadow-2xl relative text-left">
            <button 
              onClick={() => setEditingEmp(null)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X size={16} />
            </button>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Ubah Data Karyawan</h3>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Lengkap</label>
                <input type="text" name="empName" required defaultValue={editingEmp.name} className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Departemen</label>
                  <select name="empDept" defaultValue={editingEmp.department} className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800">
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                    <option value="Sales">Sales</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Status Hubungan</label>
                  <select name="empContract" defaultValue={editingEmp.contractStatus} className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800">
                    <option value="Permanent">Permanent</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Jabatan Spesifik</label>
                <input type="text" name="empPos" required defaultValue={editingEmp.position} className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Gaji Pokok bulanan (Rp)</label>
                  <input type="number" name="empSalary" required defaultValue={editingEmp.salary} className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-805 border-slate-200 dark:border-slate-800" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Kehadiran (%)</label>
                  <input type="number" min={0} max={100} name="empAttendance" defaultValue={editingEmp.attendanceRate} className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-805 border-slate-202 dark:border-slate-800" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Skor Kinerja KPI (1-5)</label>
                <input type="number" step="0.1" min="1" max="5" name="empPerformance" defaultValue={editingEmp.performanceScore} className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-805 border-slate-202 dark:border-slate-800" />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditingEmp(null)} className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 text-slate-550 rounded text-xs font-semibold">Batal</button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
