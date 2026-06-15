import { useState, useMemo } from "react";
import { 
  DollarSign, 
  Search, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Filter, 
  Calendar,
  Layers,
  TrendingDown,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertCircle,
  X
} from "lucide-react";
import { Transaction } from "../types";

interface FinanceViewProps {
  transactions: Transaction[];
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => void;
  searchQuery: string;
}

export default function FinanceView({ 
  transactions, 
  onAddTransaction,
  searchQuery
}: FinanceViewProps) {
  
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Filters
  const [typeFilter, setTypeFilter] = useState<"all" | "Income" | "Expense">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [localSearch, setLocalSearch] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchSearch = tx.description.toLowerCase().includes(localSearch.toLowerCase()) ||
                          tx.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tx.category.toLowerCase().includes(localSearch.toLowerCase());
      
      const matchType = typeFilter === "all" || tx.type === typeFilter;
      const matchCat = categoryFilter === "all" || tx.category === categoryFilter;

      return matchSearch && matchType && matchCat;
    });
  }, [transactions, localSearch, searchQuery, typeFilter, categoryFilter]);

  // Aggregate Finance Figures
  const stats = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach(tx => {
      if (tx.type === 'Income') income += tx.amount;
      else expense += tx.amount;
    });

    const netProfit = income - expense;
    const profitMargin = income > 0 ? (netProfit / income) * 100 : 0;

    return { income, expense, netProfit, profitMargin };
  }, [transactions]);

  // Form submit for ledger logging
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const description = data.get('txDesc') as string;
    const amount = Number(data.get('txAmount'));
    const type = data.get('txType') as any;
    const category = data.get('txCategory') as any;
    const reference = data.get('txRef') as string || "N/A";
    const status = data.get('txStatus') as any;

    if (description && amount > 0) {
      onAddTransaction({ description, amount, type, category, reference, status });
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-1 text-left leading-normal">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Accounting Ledger & Cash Book</h2>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Arsip pembukuan kas, audit bukti invoice, monitoring profit margin, dan rekonsiliasi pengeluaran operasional perusahaan.</p>
        </div>
        <button 
          id="btn-add-tx"
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold cursor-pointer shadow-sm transition"
        >
          <Plus size={14} /> Catat Mutasi Kas/Invoicing
        </button>
      </div>

      {/* Aggregate financial summary dashboard cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="finance-kpis">
        
        <div className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 p-5 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Pendapatan (Incomes)</p>
            <p className="text-lg font-bold mt-1 text-slate-800 dark:text-slate-100 font-mono">Rp {stats.income.toLocaleString('id-ID')}</p>
            <span className="text-[9px] text-emerald-600 font-semibold block mt-1 flex items-center gap-0.5">
              <TrendingUp size={10} /> Arus kas masuk stabil
            </span>
          </div>
          <span className="bg-emerald-500/10 p-2.5 rounded text-emerald-650 shrink-0">
            <ArrowUpRight size={18} />
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 p-5 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Metode Pengeluaran (Expenses)</p>
            <p className="text-lg font-bold mt-1 text-slate-800 dark:text-slate-100 font-mono">Rp {stats.expense.toLocaleString('id-ID')}</p>
            <span className="text-[9px] text-rose-500 font-semibold block mt-1 flex items-center gap-0.5">
              <TrendingDown size={10} /> Payouts & vendor sourcing
            </span>
          </div>
          <span className="bg-rose-500/10 p-2.5 rounded text-rose-600 shrink-0">
            <ArrowDownLeft size={18} />
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 p-5 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bottomline Margin (Sisa Kas)</p>
            <p className={`text-lg font-bold mt-1 font-mono ${stats.netProfit >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
              Rp {stats.netProfit.toLocaleString('id-ID')}
            </p>
            <span className="text-[9px] text-slate-450 mt-1 block">Net operating margin</span>
          </div>
          <span className="bg-blue-500/10 p-2.5 rounded text-blue-600 shrink-0">
            <DollarSign size={18} />
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 p-5 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rasio Margin Bersih</p>
            <p className="text-lg font-bold mt-1 text-slate-800 dark:text-slate-100 font-mono">{stats.profitMargin.toFixed(1)}%</p>
            <span className="text-[9px] text-slate-450 mt-1 block">Rasio EBITDA teratur</span>
          </div>
          <span className="bg-purple-500/10 p-2.5 rounded text-purple-600 shrink-0">
            <Percent size={18} />
          </span>
        </div>

      </div>

      {/* Grid Inputs filter */}
      <div className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Cari berdasarkan deskripsi, referensi bank..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-1.5 rounded-md border text-slate-800 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-slate-100"
          />
        </div>

        <div className="flex gap-2">
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="text-xs p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100"
          >
            <option value="all">Semua Tipe Kas</option>
            <option value="Income">Income (Pemasukan)</option>
            <option value="Expense">Expense (Pengeluaran)</option>
          </select>

          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-100"
          >
            <option value="all">Semua Kategori</option>
            <option value="Operating Revenue">Operating Revenue</option>
            <option value="Cloud Server Bills">Cloud Server Bills</option>
            <option value="Marketing Ads">Marketing Ads</option>
            <option value="Office Equipment Sourcing">Office Equipment Sourcing</option>
            <option value="HR Payroll Payout">HR Payroll Payout</option>
          </select>
        </div>
      </div>

      {/* Transactions Chronological Ledger */}
      <div className="bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left" id="finance-ledger-table">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-150 dark:border-slate-800 text-slate-450 uppercase font-mono text-[9px] tracking-wider">
                <th className="p-4">Ref Invoice</th>
                <th className="p-4">Tanggal Pembukuan</th>
                <th className="p-4">Deskripsi Rekonsiliasi</th>
                <th className="p-4">Klasifikasi Kategori</th>
                <th className="p-4 text-center">Tipe Arus</th>
                <th className="p-4 text-right">Nilai Mutasi Kas</th>
                <th className="p-4 text-center">Status Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Tidak ditemukan data mutasi kas finansial di log ledger.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-500">{tx.reference}</td>
                    <td className="p-4 font-mono text-slate-450">{tx.date}</td>
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{tx.description}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-400 text-[10px] font-semibold">{tx.category}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        tx.type === "Income" 
                          ? "bg-emerald-500/10 text-emerald-600" 
                          : "bg-rose-500/10 text-rose-600"
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${tx.type === "Income" ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`p-4 text-right font-mono font-bold ${tx.type === "Income" ? 'text-emerald-600' : 'text-slate-705 dark:text-slate-350'}`}>
                      {tx.type === "Income" ? "+" : "-"} Rp {tx.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-bold ${
                        tx.status === "Approved" ? "text-emerald-600" : "text-amber-600"
                      }`}>
                        {tx.status === "Approved" ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE TRANSACTION RECORD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 max-w-md w-full shadow-2xl relative text-left">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X size={16} />
            </button>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Catat Posisi Mutasi Kas Baru</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Maksud Rekonsiliasi (Deskripsi)</label>
                <input type="text" name="txDesc" required placeholder="Contoh: Pencairan pembayaran invoice #78..." className="w-full text-xs p-2 rounded border bg-slate-50 text-slate-850" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nilai Arus Kas (Rp)</label>
                  <input type="number" name="txAmount" required placeholder="1490000" className="w-full text-xs p-2 rounded border bg-slate-50" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tipe Mutasi</label>
                  <select name="txType" className="w-full text-xs p-2 bg-slate-50 rounded border">
                    <option value="Income">Income (Masuk)</option>
                    <option value="Expense">Expense (Keluar)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Referensi Bukti Invoice</label>
                  <input type="text" name="txRef" placeholder="INV-2026-902" className="w-full text-xs p-2 rounded border bg-slate-50" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Klasifikasi Kategori</label>
                  <select name="txCategory" className="w-full text-xs p-2 bg-slate-50 rounded border">
                    <option value="Operating Revenue">Operating Revenue</option>
                    <option value="Cloud Server Bills">Cloud Server Bills</option>
                    <option value="Marketing Ads">Marketing Ads</option>
                    <option value="Office Equipment Sourcing">Office Equipment Sourcing</option>
                    <option value="HR Payroll Payout">HR Payroll Payout</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Status Audit</label>
                <select name="txStatus" className="w-full text-xs p-2 bg-slate-50 rounded border">
                  <option value="Approved">Approved (Selesai Audit)</option>
                  <option value="Pending">Pending (Reviu Internal)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 border hover:bg-slate-105 rounded text-xs font-semibold">Batal</button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold">Log Pembukuan</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
