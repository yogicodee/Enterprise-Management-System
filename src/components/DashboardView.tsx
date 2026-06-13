import { useMemo } from "react";
import { 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Briefcase, 
  DollarSign, 
  Boxes, 
  CheckSquare, 
  Clock, 
  Plus, 
  TrendingUp,
  Receipt
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Legend
} from "recharts";

import { User, Employee, Project, Task, CRMLead, InventoryItem, Transaction, AuditLog } from "../types";

interface DashboardProps {
  users: User[];
  employees: Employee[];
  projects: Project[];
  tasks: Task[];
  leads: CRMLead[];
  inventory: InventoryItem[];
  transactions: Transaction[];
  logs: AuditLog[];
  onNavigate: (tab: string) => void;
  onQuickTx: (tx: { type: 'Income' | 'Expense', amount: number, category: string, description: string }) => void;
}

export default function DashboardView({ 
  users, 
  employees, 
  projects, 
  tasks, 
  leads, 
  inventory, 
  transactions, 
  logs,
  onNavigate,
  onQuickTx
}: DashboardProps) {

  // Dynamic calculations based on live corporate records
  const metrics = useMemo(() => {
    const totalU = users.length;
    const totalE = employees.length;
    const totalP = projects.length;
    
    // Income and Expense sums
    const income = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    const revenueSum = income - expense;

    const pendingT = tasks.filter(t => t.status !== 'Done').length;
    
    // Low stock count (stock <= minAlertStock)
    const lowStock = inventory.filter(i => i.stock <= i.minAlertStock).length;

    return { totalU, totalE, totalP, income, expense, revenueSum, pendingT, lowStock };
  }, [users, employees, projects, tasks, inventory, transactions]);

  // Chart data 1: Monthly Financial trends (RP Millions representation)
  const financialData = useMemo(() => {
    return [
      { name: 'Jan', Pendapatan: 320, Pengeluaran: 190 },
      { name: 'Feb', Pendapatan: 420, Pengeluaran: 210 },
      { name: 'Mar', Pendapatan: 380, Pengeluaran: 240 },
      { name: 'Apr', Pendapatan: 510, Pengeluaran: 280 },
      { name: 'Mei', Pendapatan: metrics.income / 1000000, Pengeluaran: metrics.expense / 1000000 },
      { name: 'Jun (Est)', Pendapatan: (metrics.income * 1.25) / 1000000, Pengeluaran: (metrics.expense * 0.95) / 1000000 }
    ];
  }, [metrics]);

  // Chart data 2: Employee departmental distribution
  const deptData = useMemo(() => {
    const count: Record<string, number> = {};
    employees.forEach(e => {
      count[e.department] = (count[e.department] || 0) + 1;
    });
    return Object.entries(count).map(([name, value]) => ({ name, value }));
  }, [employees]);

  // Chart colors
  const COLORS = ['#2563EB', '#7C3AED', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  // Form submit for quick transaction logger (Simulates bookkeeping workflows)
  const handleQuickTxSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const type = data.get('txType') as 'Income' | 'Expense';
    const amount = Number(data.get('txAmount'));
    const category = data.get('txCategory') as string;
    const description = data.get('txDesc') as string;

    if (amount > 0 && category && description) {
      onQuickTx({ type, amount, category, description });
      e.currentTarget.reset();
    }
  };

  const formattedNetRevenue = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(metrics.revenueSum);
  const formattedIncome = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(metrics.income);
  const formattedExpense = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(metrics.expense);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-1 leading-normal">
      
      {/* 1. Core Dynamic KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-grid">
        
        {/* Card Revenue */}
        <div className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 p-5 rounded-xl text-left shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider dark:text-slate-400">Saldo Operasional</span>
            <div className="p-1.5 bg-blue-500/10 text-blue-500 rounded-md">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="text-xl font-bold mt-2 text-slate-800 dark:text-slate-100 font-mono tracking-tight">{formattedNetRevenue}</p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight size={12} />
            <span>+12.4% MoM growth rate</span>
          </div>
        </div>

        {/* Card Projects */}
        <div className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 p-5 rounded-xl text-left shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider dark:text-slate-400">Total Proyek</span>
            <div className="p-1.5 bg-purple-500/10 text-purple-500 rounded-md">
              <Briefcase size={16} />
            </div>
          </div>
          <p className="text-xl font-bold mt-2 text-slate-800 dark:text-slate-100 font-mono tracking-tight">{metrics.totalP}</p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-purple-600 dark:text-purple-400">
            <Clock size={12} />
            <span>{metrics.pendingT} sisa tugas aktif</span>
          </div>
        </div>

        {/* Card Employees */}
        <div className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 p-5 rounded-xl text-left shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider dark:text-slate-400">Staf Karyawan</span>
            <div className="p-1.5 bg-cyan-500/10 text-cyan-500 rounded-md">
              <Users size={16} />
            </div>
          </div>
          <p className="text-xl font-bold mt-2 text-slate-800 dark:text-slate-100 font-mono tracking-tight">{metrics.totalE}</p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-cyan-600 dark:text-cyan-400">
            <span>Rata-rata 95.3% Absensi Kehadiran</span>
          </div>
        </div>

        {/* Card Low Stock Register */}
        <div className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 p-5 rounded-xl text-left shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider dark:text-slate-400">Peringatan Menipis</span>
            <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-md">
              <Boxes size={16} />
            </div>
          </div>
          <p className="text-xl font-bold mt-2 text-slate-800 dark:text-slate-100 font-mono tracking-tight">{metrics.lowStock} SKU</p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            <span>Butuh suplai tambahan item secepatnya</span>
          </div>
        </div>

      </div>

      {/* 2. Interactive Charts Section & Quick Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Finance charts - Left 2 Columns */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 p-5 rounded-xl shadow-sm text-left">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Performa Keuangan Bulanan</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Skala Pendapatan vs Pengeluaran (dalam Juta Rupiah)</p>
            </div>
            <div className="flex gap-4 items-center text-[10px] font-mono">
              <span className="flex items-center gap-1 text-emerald-600"><span className="w-2.5 h-2.5 bg-[#10B981] rounded-sm"></span> Pendapatan</span>
              <span className="flex items-center gap-1 text-rose-600"><span className="w-2.5 h-2.5 bg-[#EF4444] rounded-sm"></span> Pengeluaran</span>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={financialData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '6px', color: '#FFF', fontSize: '11px' }}
                  formatter={(value) => [`Rp ${value} Juta`]}
                />
                <Line type="monotone" dataKey="Pendapatan" stroke="#10B981" strokeWidth={2.5} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Pengeluaran" stroke="#EF4444" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Breakdowns - Right 1 Column */}
        <div className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 p-5 rounded-xl shadow-sm text-left">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sebaran Staf Karyawan</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Grafik pembagian staf berdasarkan departemen</p>
          
          <div className="h-44 flex items-center justify-center">
            {deptData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deptData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {deptData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '6px', color: '#FFF', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400">Tidak ada data staf untuk dievaluasi.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            {deptData.map((d, index) => (
              <div key={d.name} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="truncate">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Asymmetric Bento Section: Recent ledger logs & Audit Log feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* List of Recent Transactions - Left 2 columns */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 p-5 rounded-xl shadow-sm text-left">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Histori Arus Kas Terbaru</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400> mt-1">Garis besar transaksi kredit dan debit perbankan</p>
            </div>
            <button 
              onClick={() => onNavigate('finance')}
              className="text-[10px] text-blue-500 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              Urus Kas <ArrowUpRight size={12} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-650 dark:text-slate-400">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-450 uppercase font-mono text-[9px] tracking-wider">
                  <th className="py-2.5">Tanggal</th>
                  <th className="py-2.5">Kategori</th>
                  <th className="py-2.5">Keterangan</th>
                  <th className="py-2.5 text-right font-semibold">Besar Transaksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {transactions.slice(0, 5).map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-2.5 font-mono text-slate-500 dark:text-slate-500">{tx.date}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${
                        tx.type === 'Income' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                      }`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-2.5 font-medium text-slate-800 dark:text-slate-300 truncate max-w-[200px]">{tx.description}</td>
                    <td className={`py-2.5 text-right font-mono font-bold ${
                      tx.type === 'Income' ? 'text-emerald-600' : 'text-rose-500'
                    }`}>
                      {tx.type === 'Income' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Transaction Bookkeeping Simulator form - Right column */}
        <div className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 p-5 rounded-xl shadow-sm text-left flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Simulasi input Kas</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Catat pengeluaran/pendapatan operasional instan</p>
            
            <form onSubmit={handleQuickTxSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tipe</label>
                <select name="txType" className="w-full text-xs p-2 rounded-md border text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800">
                  <option value="Income">Pendapatan (+)</option>
                  <option value="Expense">Pengeluaran (-)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Jumlah (Rp)</label>
                <input 
                  type="number" 
                  name="txAmount" 
                  placeholder="Contoh: 1500000" 
                  required
                  className="w-full text-xs p-2 rounded-md border text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kategori</label>
                <input 
                  type="text" 
                  name="txCategory" 
                  placeholder="Mkt, Ops, SaaS, dsb" 
                  required
                  className="w-full text-xs p-2 rounded-md border text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Keterangan</label>
                <input 
                  type="text" 
                  name="txDesc" 
                  placeholder="Deskripsi singkat" 
                  required
                  className="w-full text-xs p-2 rounded-md border text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800"
                />
              </div>

              <button 
                type="submit" 
                className="w-full flex items-center justify-center gap-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold cursor-pointer shadow-sm transition"
              >
                <Plus size={14} /> Amankan Transaksi
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* 4. Timeline logs area */}
      <div className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 p-5 rounded-xl shadow-sm text-left">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Aktivitas Audit Keamanan Terkini</h3>
        <div className="relative border-l border-slate-200 dark:border-slate-800 pl-4 space-y-4">
          {logs.slice(0, 4).map((log) => (
            <div key={log.id} className="relative">
              {/* Bullet indicator */}
              <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 bg-blue-500 shadow-sm" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{log.action}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500"> oleh </span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{log.user}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  <span>IP: {log.ipAddress}</span>
                  <span>•</span>
                  <span>{log.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
