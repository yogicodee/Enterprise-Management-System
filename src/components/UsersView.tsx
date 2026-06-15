import { useState, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ShieldAlert, 
  UserPlus,
  RefreshCw,
  Lock,
  UserCheck
} from "lucide-react";
import { User } from "../types";

interface UsersViewProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id' | 'lastLogin'>) => void;
  onUpdateUser: (id: string, updates: Partial<User>) => void;
  onDeleteUser: (id: string) => void;
  searchQuery: string;
}

export default function UsersView({ 
  users, 
  onAddUser, 
  onUpdateUser, 
  onDeleteUser,
  searchQuery 
}: UsersViewProps) {
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Filter states
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [localSearch, setLocalSearch] = useState("");

  // Grid / UI filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchSearch = 
        user.name.toLowerCase().includes(localSearch.toLowerCase()) || 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(localSearch.toLowerCase());
      
      const matchRole = roleFilter === "all" || user.role === roleFilter;
      const matchStatus = statusFilter === "all" || user.status === statusFilter;

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, localSearch, searchQuery, roleFilter, statusFilter]);

  // Form Submission
  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get('userName') as string;
    const email = data.get('userEmail') as string;
    const role = data.get('userRole') as any;
    const status = data.get('userStatus') as any;

    if (name && email) {
      onAddUser({ name, email, role, status });
      setShowAddModal(false);
    }
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;
    
    const data = new FormData(e.currentTarget);
    const name = data.get('userName') as string;
    const email = data.get('userEmail') as string;
    const role = data.get('userRole') as any;
    const status = data.get('userStatus') as any;

    onUpdateUser(editingUser.id, { name, email, role, status });
    setEditingUser(null);
  };

  // Static Role-Permission Matrix definitions (Highly Enterprise styled)
  const permissionsMatrix = [
    { role: 'Super Admin', create: true, read: true, update: true, delete: true, approve: true, export: true },
    { role: 'Admin', create: true, read: true, update: true, delete: false, approve: true, export: true },
    { role: 'Manager', create: true, read: true, update: true, delete: false, approve: true, export: false },
    { role: 'Staff', create: false, read: true, update: true, delete: false, approve: false, export: false },
    { role: 'Viewer', create: false, read: true, update: false, delete: false, approve: false, export: false },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-1 text-left leading-normal">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Keamanan & Akses Identitas</h2>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Atur kredensial staff, role, status, dan granularitas ijin RBAC perusahaan.</p>
        </div>
        <button 
          id="btn-register-user"
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold cursor-pointer shadow-sm transition"
        >
          <UserPlus size={14} /> Daftarkan Pengguna Baru
        </button>
      </div>

      {/* Filter and Query Board */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-lg flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search size={14} />
          </span>
          <input
            id="user-search-box"
            type="text"
            placeholder="Cari berdasarkan nama atau email..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-1.5 rounded-md border text-slate-850 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Role filter */}
          <select 
            id="filter-role-select"
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs p-1.5 rounded-md border text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800"
          >
            <option value="all">Semua Role</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
            <option value="Viewer">Viewer</option>
          </select>

          {/* Status filter */}
          <select 
            id="filter-status-select"
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs p-1.5 rounded-md border text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800"
          >
            <option value="all">Semua Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left" id="user-accounts-table">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-150 dark:border-slate-800 text-slate-450 uppercase font-mono text-[9px] tracking-wider">
                <th className="p-4">ID</th>
                <th className="p-4">Nama Pengguna</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role Akses</th>
                <th className="p-4">Status Akun</th>
                <th className="p-4">Kunjungan Terakhir</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 dark:text-slate-500">
                    Tidak ditemukan data pengguna yang cocok dengan kriteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 font-mono text-slate-500 dark:text-slate-500">{user.id}</td>
                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">{user.name}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-450">{user.email}</td>
                    <td className="p-4">
                      <span className="font-medium text-slate-800 dark:text-slate-300">{user.role}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        user.status === "Active" 
                          ? "bg-emerald-500/10 text-emerald-600" 
                          : user.status === "Pending"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-rose-500/10 text-rose-600"
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${
                          user.status === "Active" ? "bg-emerald-500" : user.status === "Pending" ? "bg-amber-500" : "bg-rose-500"
                        }`}></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-450 dark:text-slate-550">{user.lastLogin}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => setEditingUser(user)}
                          className="p-1 text-slate-450 hover:text-blue-500 transition cursor-pointer"
                          title="Edit User Role/Status"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button 
                          onClick={() => onDeleteUser(user.id)}
                          disabled={user.role === 'Super Admin'}
                          className={`p-1 transition cursor-pointer ${
                            user.role === 'Super Admin' ? 'opacity-30 cursor-not-allowed' : 'text-slate-450 hover:text-red-500'
                          }`}
                          title="Delete User"
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

      {/* Enterprise RBAC Role-Permission Grid Matrix */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={15} className="text-blue-500" />
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Granular Permission Matrix (RBAC)</h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
          Skema otoritas di bawah adalah aturan baku yang didelegasikan oleh sistem server untuk menyaring verifikasi token pengoperasian audit.
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-100 dark:divide-slate-800">
            <thead>
              <tr className="font-mono text-[9px] text-slate-400 dark:text-slate-500 uppercase">
                <th className="py-2">Level Penugasan (Role)</th>
                <th className="py-2 text-center">Create</th>
                <th className="py-2 text-center">Read</th>
                <th className="py-2 text-center">Update</th>
                <th className="py-2 text-center">Delete</th>
                <th className="py-2 text-center">Approve</th>
                <th className="py-2 text-center">Export Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
              {permissionsMatrix.map((matrix) => (
                <tr key={matrix.role} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                  <td className="py-2.5 font-semibold text-slate-800 dark:text-slate-300">{matrix.role}</td>
                  <td className="py-2.5 text-center">
                    {matrix.create ? <Check size={14} className="mx-auto text-emerald-500" /> : <X size={14} className="mx-auto text-slate-300 dark:text-slate-700" />}
                  </td>
                  <td className="py-2.5 text-center">
                    {matrix.read ? <Check size={14} className="mx-auto text-emerald-500" /> : <X size={14} className="mx-auto text-slate-300 dark:text-slate-700" />}
                  </td>
                  <td className="py-2.5 text-center">
                    {matrix.update ? <Check size={14} className="mx-auto text-emerald-500" /> : <X size={14} className="mx-auto text-slate-300 dark:text-slate-700" />}
                  </td>
                  <td className="py-2.5 text-center">
                    {matrix.delete ? <Check size={14} className="mx-auto text-emerald-500" /> : <X size={14} className="mx-auto text-slate-300 dark:text-slate-700" />}
                  </td>
                  <td className="py-2.5 text-center">
                    {matrix.approve ? <Check size={14} className="mx-auto text-emerald-500" /> : <X size={14} className="mx-auto text-slate-300 dark:text-slate-700" />}
                  </td>
                  <td className="py-2.5 text-center">
                    {matrix.export ? <Check size={14} className="mx-auto text-emerald-500" /> : <X size={14} className="mx-auto text-slate-300 dark:text-slate-700" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE USER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 max-w-md w-full shadow-2xl relative text-left">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X size={16} />
            </button>
            
            <div className="flex items-center gap-2 mb-4">
              <UserCheck size={18} className="text-blue-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Registrasi Pengguna Baru</h3>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  name="userName" 
                  required
                  placeholder="Contoh: Yogi Ilham"
                  className="w-full text-xs p-2 rounded-md border text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Alamat Email</label>
                <input 
                  type="email" 
                  name="userEmail" 
                  required
                  placeholder="developer@corp.id"
                  className="w-full text-xs p-2 rounded-md border text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Role Akses</label>
                <select name="userRole" className="w-full text-xs p-2 rounded-md border text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800">
                  <option value="Staff">Staff</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Status Aktivasi</label>
                <select name="userStatus" className="w-full text-xs p-2 rounded-md border text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800">
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold cursor-pointer shadow-md"
                >
                  Daftarkan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER STATUS/ROLE MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 max-w-md w-full shadow-2xl relative text-left">
            <button 
              onClick={() => setEditingUser(null)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X size={16} />
            </button>
            
            <div className="flex items-center gap-2 mb-4">
              <Edit3 size={18} className="text-blue-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ubah Pengaturan Pengguna</h3>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  name="userName" 
                  required
                  defaultValue={editingUser.name}
                  className="w-full text-xs p-2 rounded-md border text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Alamat Email</label>
                <input 
                  type="email" 
                  name="userEmail" 
                  required
                  defaultValue={editingUser.email}
                  className="w-full text-xs p-2 rounded-md border text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Role Akses</label>
                <select 
                  name="userRole" 
                  defaultValue={editingUser.role} 
                  className="w-full text-xs p-2 rounded-md border text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Staff">Staff</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Status Aktivasi</label>
                <select 
                  name="userStatus" 
                  defaultValue={editingUser.status} 
                  className="w-full text-xs p-2 rounded-md border text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setEditingUser(null)}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold cursor-pointer shadow-md"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
