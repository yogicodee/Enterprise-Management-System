import { useState, useMemo } from "react";
import { 
  Boxes, 
  Search, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Truck, 
  BadgeCheck, 
  Settings,
  Filter,
  X,
  Database
} from "lucide-react";
import { InventoryItem } from "../types";

interface InventoryViewProps {
  inventory: InventoryItem[];
  onAddItem: (item: Omit<InventoryItem, 'id'>) => void;
  onUpdateItem: (id: string, updates: Partial<InventoryItem>) => void;
  onDeleteItem: (id: string) => void;
  searchQuery: string;
}

export default function InventoryView({ 
  inventory, 
  onAddItem, 
  onUpdateItem, 
  onDeleteItem,
  searchQuery
}: InventoryViewProps) {
  
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [localSearch, setLocalSearch] = useState("");

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(localSearch.toLowerCase()) || 
                          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.sku.toLowerCase().includes(localSearch.toLowerCase()) ||
                          item.supplier.toLowerCase().includes(localSearch.toLowerCase());
      
      const matchCat = categoryFilter === "all" || item.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [inventory, localSearch, searchQuery, categoryFilter]);

  // Aggregate stats
  const stats = useMemo(() => {
    const totalItems = inventory.length;
    const totalValue = inventory.reduce((sum, item) => sum + (item.stock * item.purchasePrice), 0);
    const alertCount = inventory.filter(item => item.stock <= item.minAlertStock).length;
    return { totalItems, totalValue, alertCount };
  }, [inventory]);

  // Form submission handling
  const handleAddNewSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const sku = data.get('itemSku') as string;
    const name = data.get('itemName') as string;
    const category = data.get('itemCategory') as any;
    const stock = Number(data.get('itemStock'));
    const minAlertStock = Number(data.get('itemMinAlert'));
    const supplier = data.get('itemSupplier') as string;
    const purchasePrice = Number(data.get('itemPurchasePrice'));
    const sellingPrice = Number(data.get('itemSellingPrice'));

    if (sku && name && stock >= 0 && purchasePrice > 0) {
      onAddItem({ sku, name, category, stock, minAlertStock, supplier, purchasePrice, sellingPrice });
      setShowAddItemModal(false);
    }
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;

    const data = new FormData(e.currentTarget);
    const stock = Number(data.get('itemStock'));
    const minAlertStock = Number(data.get('itemMinAlert'));
    const supplier = data.get('itemSupplier') as string;
    const purchasePrice = Number(data.get('itemPurchasePrice'));
    const sellingPrice = Number(data.get('itemSellingPrice'));

    onUpdateItem(editingItem.id, { stock, minAlertStock, supplier, purchasePrice, sellingPrice });
    setEditingItem(null);
  };

  // Custom vector simulated barcode generator (Pure css design representation!)
  const renderSimulatedBarcode = (sku: string) => {
    // Generate different width bars based on characters in SKU
    const seed = sku.split("").map(c => c.charCodeAt(0) % 5 + 1);
    return (
      <div className="flex flex-col items-center">
        <div className="flex items-center h-8 bg-white p-1 rounded border border-slate-250 shrink-0 gap-0.5">
          {seed.map((width, idx) => (
            <div 
              key={idx} 
              className="bg-black h-full shrink-0" 
              style={{ width: `${width * 0.75}px` }}
            />
          ))}
          {/* Static separator */}
          <div className="bg-black h-full w-[1px] shrink-0 mx-0.5"></div>
          {seed.slice().reverse().map((width, idx) => (
            <div 
              key={`rev-${idx}`} 
              className="bg-black h-full shrink-0" 
              style={{ width: `${(5 - width + 1) * 0.75}px` }}
            />
          ))}
        </div>
        <span className="text-[7px] font-mono tracking-widest text-slate-400 mt-0.5">{sku}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-1 text-left leading-normal">
      
      {/* Title Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aset Perusahaan & Logistik SKU</h2>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Kelola suplai komputer hardware, server lisensi cloud hosting, kalkulasikan taksasi aset, dan pantau minimum limit gudang.</p>
        </div>
        <button 
          id="btn-add-inventory"
          onClick={() => setShowAddItemModal(true)}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold cursor-pointer shadow-sm transition"
        >
          <Plus size={14} /> Daftarkan SKU Baru
        </button>
      </div>

      {/* Aggregate metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="inventory-kpi-grid">
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-lg shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jumlah Koleksi Deskripsi</p>
          <p className="text-xl font-bold mt-1 text-slate-850 dark:text-slate-100 font-mono">{stats.totalItems} Produk</p>
          <span className="text-[9px] text-slate-450 dark:text-slate-550">Terdaftar di server</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-lg shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Taksasi Aset (Harga Beli gudang)</p>
          <p className="text-xl font-bold mt-1 text-slate-850 dark:text-slate-100 font-mono">Rp {stats.totalValue.toLocaleString('id-ID')}</p>
          <span className="text-[9px] text-slate-450 dark:text-slate-550">Penilaian buku aset bulanan</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-lg shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono text-red-500">Peringatan Kritis (Menipis)</p>
          <p className="text-xl font-bold mt-1 text-red-650 dark:text-red-400 font-mono">{stats.alertCount} Item</p>
          <span className="text-[9px] text-red-500 font-semibold">Tingkat stok di bawah minimum batas</span>
        </div>

      </div>

      {/* Inputs controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-lg flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Cari berdasarkan nama produk, SKU, supplier..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-1.5 rounded-md border text-slate-800 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-slate-100"
          />
        </div>

        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-xs p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100"
        >
          <option value="all">Semua Kategori</option>
          <option value="Hardware">Hardware</option>
          <option value="Software Licenses">Software Licenses</option>
          <option value="Office Supplies">Office Supplies</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Peripherals">Peripherals</option>
        </select>
      </div>

      {/* Main inventory desk ledger table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs" id="inventory-registry-table">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-150 dark:border-slate-800 text-slate-450 uppercase font-mono text-[9px] tracking-wider">
                <th className="p-4">Kode Barcode SKU</th>
                <th className="p-4">Model & Nama Aset</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Sisa Stok</th>
                <th className="p-4">Mitra Pemasok (Supplier)</th>
                <th className="p-4 text-right">Harga Beli</th>
                <th className="p-4 text-right">Harga Jual</th>
                <th className="p-4 text-center">Aksi (Stok)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Tidak ditemukan data katalog inventaris.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const isLow = item.stock <= item.minAlertStock;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="p-4 w-28 text-center">
                        {renderSimulatedBarcode(item.sku)}
                      </td>
                      <td className="p-4">
                        <div className="text-left font-semibold text-slate-800 dark:text-slate-200">{item.name}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-400 text-[9px] font-semibold rounded">{item.category}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-left">
                          {isLow ? (
                            <span className="flex items-center gap-1 text-red-650 dark:text-red-400">
                              <AlertTriangle size={12} className="animate-bounce" /> {item.stock} <span className="text-[9px] font-normal text-slate-400">(Low!)</span>
                            </span>
                          ) : (
                            <span className="text-slate-800 dark:text-slate-350">{item.stock} Unit</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-slate-555 dark:text-slate-450">{item.supplier}</td>
                      <td className="p-4 text-right font-mono font-semibold text-slate-705 dark:text-slate-400">Rp {item.purchasePrice.toLocaleString('id-ID')}</td>
                      <td className="p-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">Rp {item.sellingPrice.toLocaleString('id-ID')}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setEditingItem(item)}
                            className="p-1 text-slate-400 hover:text-blue-500 transition cursor-pointer"
                            title="Edit Stock or Supplier info"
                          >
                            <Settings size={13} />
                          </button>
                          <button 
                            onClick={() => onDeleteItem(item.id)}
                            className="p-1 text-slate-400 hover:text-red-500 transition cursor-pointer"
                            title="Delete SKU entry"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE ASSET ITEM MODAL */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 max-w-md w-full shadow-2xl relative text-left">
            <button 
              onClick={() => setShowAddItemModal(false)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X size={16} />
            </button>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Tambahkan Data SKU Inventaris</h3>

            <form onSubmit={handleAddNewSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">SKU Unique Code</label>
                  <input type="text" name="itemSku" required placeholder="Contoh: HW-LT-XPS" className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-800 border-slate-202 text-slate-850" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kategori</label>
                  <select name="itemCategory" className="w-full text-xs p-2 border bg-slate-50 rounded">
                    <option value="Hardware">Hardware</option>
                    <option value="Software Licenses">Software Licenses</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Peripherals">Peripherals</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Model & Deskripsi Barang</label>
                <input type="text" name="itemName" required placeholder="Contoh: Dell XPS 15 Laptop..." className="w-full text-xs p-2 rounded border bg-slate-50" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Jumlah Stok Masuk</label>
                  <input type="number" name="itemStock" required placeholder="5" className="w-full text-xs p-2 rounded border bg-slate-50 animate-pulse" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Alert Threshold Limit</label>
                  <input type="text" name="itemMinAlert" defaultValue="2" className="w-full text-xs p-2 rounded border bg-slate-50" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mitra Pemasok (Supplier)</label>
                <input type="text" name="itemSupplier" required placeholder="Schneider, Dell Corp Indonesia, dsb" className="w-full text-xs p-2 rounded border bg-slate-50" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Harga Kulakan (Beli) (Rp)</label>
                  <input type="number" name="itemPurchasePrice" required placeholder="4500000" className="w-full text-xs p-2 rounded border bg-slate-50" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Harga Jual Katalog (Rp)</label>
                  <input type="number" name="itemSellingPrice" required placeholder="5900000" className="w-full text-xs p-2 rounded border bg-slate-50" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddItemModal(false)} className="px-3 py-1.5 border hover:bg-slate-100 rounded text-xs font-semibold">Batal</button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold">Simpan Katalog</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ASSET ITEM MODAL */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 max-w-md w-full shadow-2xl relative text-left">
            <button 
              onClick={() => setEditingItem(null)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X size={16} />
            </button>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Ubah Detil & Stok Aset</h3>

            <p className="text-xs text-slate-400 mb-4">Model: <strong className="text-slate-800 dark:text-slate-200">{editingItem.name}</strong> • SKU: <strong className="text-slate-800 dark:text-slate-205">{editingItem.sku}</strong></p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sisa Stok Saat Ini</label>
                  <input type="number" name="itemStock" required defaultValue={editingItem.stock} className="w-full text-xs p-2 rounded border bg-slate-50 text-slate-805" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Alert Limit</label>
                  <input type="number" name="itemMinAlert" defaultValue={editingItem.minAlertStock} className="w-full text-xs p-2 rounded border bg-slate-50" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mitra Pemasok (Supplier)</label>
                <input type="text" name="itemSupplier" required defaultValue={editingItem.supplier} className="w-full text-xs p-2 rounded border bg-slate-50 text-slate-805" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Harga Beli Gudang (Rp)</label>
                  <input type="number" name="itemPurchasePrice" required defaultValue={editingItem.purchasePrice} className="w-full text-xs p-2 rounded border bg-slate-50" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Harga Jual Toko (Rp)</label>
                  <input type="number" name="itemSellingPrice" required defaultValue={editingItem.sellingPrice} className="w-full text-xs p-2 rounded border bg-slate-50" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditingItem(null)} className="px-3 py-1.5 border rounded text-xs font-semibold">Batal</button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
