import { useState, useMemo } from "react";
import { 
  Building2, 
  Search, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Briefcase, 
  Calendar, 
  Contact, 
  CheckCircle2, 
  Mail, 
  Phone,
  ArrowUpRight,
  ChevronRight,
  X,
  UserCheck
} from "lucide-react";
import { CRMLead } from "../types";

interface CrmViewProps {
  leads: CRMLead[];
  onAddLead: (lead: Omit<CRMLead, 'id'>) => void;
  onUpdateLead: (id: string, updates: Partial<CRMLead>) => void;
  onDeleteLead: (id: string) => void;
  searchQuery: string;
}

export default function CrmView({ 
  leads, 
  onAddLead, 
  onUpdateLead, 
  onDeleteLead,
  searchQuery
}: CrmViewProps) {
  
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [editingLead, setEditingLead] = useState<CRMLead | null>(null);
  const [localSearch, setLocalSearch] = useState("");

  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const matchSearch = l.name.toLowerCase().includes(localSearch.toLowerCase()) || 
                          l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.company.toLowerCase().includes(localSearch.toLowerCase());
      return matchSearch;
    });
  }, [leads, localSearch, searchQuery]);

  // Dynamic Pipeline aggregates (Fancier than standard lists!)
  const pipelineMetrics = useMemo(() => {
    const defaultPipeline: Record<CRMLead['status'], { count: number; value: number }> = {
      Prospect: { count: 0, value: 0 },
      Qualified: { count: 0, value: 0 },
      Proposal: { count: 0, value: 0 },
      Negotiation: { count: 0, value: 0 },
      Won: { count: 0, value: 0 },
      Lost: { count: 0, value: 0 }
    };

    leads.forEach(l => {
      if (defaultPipeline[l.status]) {
        defaultPipeline[l.status].count += 1;
        defaultPipeline[l.status].value += l.leadValue;
      }
    });

    return defaultPipeline;
  }, [leads]);

  // Form submit for new Lead
  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get('leadName') as string;
    const company = data.get('leadCompany') as string;
    const email = data.get('leadEmail') as string;
    const phone = data.get('leadPhone') as string;
    const leadValue = Number(data.get('leadValue'));
    const status = data.get('leadStatus') as any;
    const notes = data.get('leadNotes') as string;
    const nextMeeting = data.get('leadMeeting') as string || "-";

    if (name && company && leadValue > 0) {
      onAddLead({ name, company, email, phone, leadValue, status, nextMeeting, notes });
      setShowAddLeadModal(false);
    }
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingLead) return;

    const data = new FormData(e.currentTarget);
    const name = data.get('leadName') as string;
    const company = data.get('leadCompany') as string;
    const email = data.get('leadEmail') as string;
    const phone = data.get('leadPhone') as string;
    const leadValue = Number(data.get('leadValue'));
    const status = data.get('leadStatus') as any;
    const notes = data.get('leadNotes') as string;
    const nextMeeting = data.get('leadMeeting') as string;

    onUpdateLead(editingLead.id, { name, company, email, phone, leadValue, status, nextMeeting, notes });
    setEditingLead(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-1 text-left leading-normal">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">CRM & Customer Pipelines</h2>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Arsip kontak pembeli potensial, hitung deal size perusahaan, saring lead potensial, dan follow up pertemuan.</p>
        </div>
        <button 
          id="btn-add-lead"
          onClick={() => setShowAddLeadModal(true)}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold cursor-pointer shadow-sm transition"
        >
          <Plus size={14} /> Daftarkan Lead Potensial
        </button>
      </div>

      {/* SALES PIPELINE PIPES SUMMARY SCALES (SAAS Unicorn style!) */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3" id="crm-sales-pipe">
        {(Object.entries(pipelineMetrics) as [CRMLead['status'], { count: number; value: number }][]).map(([stage, med]) => (
          <div key={stage} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-lg text-left shadow-xs">
            <span className={`inline-block w-2.5 h-2.5 rounded-full mb-2 ${
              stage === 'Won' ? 'bg-emerald-500' :
              stage === 'Lost' ? 'bg-rose-500' :
              stage === 'Negotiation' ? 'bg-purple-500' :
              stage === 'Proposal' ? 'bg-blue-500' :
              'bg-slate-400'
            }`}></span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stage}</p>
            <p className="text-xs font-mono font-bold text-slate-850 dark:text-slate-200 mt-1">Rp {(med.value / 1000000).toFixed(0)} Jt</p>
            <p className="text-[9px] text-slate-500 mt-0.5">{med.count} leads terindeks</p>
          </div>
        ))}
      </div>

      {/* Filtering Inputs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-lg flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Cari berdasarkan nama pembeli atau instansi..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-1.5 rounded-md border text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* CRM Leads Core Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="crm-lead-cards">
        {filteredLeads.length === 0 ? (
          <div className="p-8 text-center col-span-3 text-slate-400">
            Tidak ditemukan data prospek pembeli di basis data.
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div key={lead.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 flex flex-col justify-between hover:shadow-md transition">
              <div>
                
                {/* ID & Stage */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-mono text-slate-400">{lead.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    lead.status === 'Won' ? 'bg-emerald-500/15 text-emerald-600' :
                    lead.status === 'Lost' ? 'bg-rose-500/15 text-rose-500' :
                    lead.status === 'Negotiation' ? 'bg-purple-500/15 text-purple-600' :
                    lead.status === 'Proposal' ? 'bg-blue-500/15 text-blue-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>{lead.status}</span>
                </div>

                {/* Main Client Info */}
                <div className="text-left space-y-1">
                  <h4 className="text-xs font-bold text-slate-850 dark:text-white leading-snug">{lead.name}</h4>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Building2 size={10} className="text-slate-400 shrink-0" /> {lead.company}
                  </p>
                </div>

                {/* Budget visual */}
                <div className="bg-slate-50 dark:bg-slate-800/40 rounded-md p-2.5 my-3 text-left">
                  <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block">Estimated Value</span>
                  <strong className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">Rp {lead.leadValue.toLocaleString('id-ID')}</strong>
                </div>

                {/* Brief contact & notes */}
                <div className="space-y-1.5 text-[10px] text-slate-500 text-left border-t border-slate-50 dark:border-slate-850 pt-3">
                  <p className="flex items-center gap-1.5 truncate">
                    <Mail size={11} className="text-slate-400 shrink-0" /> {lead.email}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone size={11} className="text-slate-400 shrink-0" /> {lead.phone}
                  </p>
                  <p className="flex items-center gap-1.5 font-medium truncate">
                    <Calendar size={11} className="text-blue-500 shrink-0" /> Pertemuan: {lead.nextMeeting}
                  </p>
                  <p className="text-[10px] text-slate-400 pt-1.5 mt-1 border-t border-dotted border-slate-100 dark:border-slate-800 leading-normal italic line-clamp-2">
                    "{lead.notes}"
                  </p>
                </div>

              </div>

              {/* Card Actions */}
              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-50 dark:border-slate-800/60">
                <button 
                  onClick={() => setEditingLead(lead)}
                  className="p-1 px-1.5 border border-slate-200 dark:border-slate-800 rounded text-[10px] text-slate-450 hover:bg-slate-150 hover:text-blue-500 transition cursor-pointer"
                >
                  Edit Lead
                </button>
                <button 
                  onClick={() => onDeleteLead(lead.id)}
                  className="p-1 hover:text-red-500 transition cursor-pointer"
                  title="Hapus Prospek"
                >
                  <Trash2 size={12} className="text-slate-400 hover:text-red-500" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* CREATE LEAD MODAL */}
      {showAddLeadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 max-w-md w-full shadow-2xl relative text-left">
            <button 
              onClick={() => setShowAddLeadModal(false)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X size={16} />
            </button>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Daftarkan CRM Lead</h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Prospek</label>
                <input type="text" name="leadName" required placeholder="Contoh: Roy Marten" className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-800 border-slate-202 text-slate-850" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Instansi / Perusahaan</label>
                <input type="text" name="leadCompany" required placeholder="PT Astra Nusantara, dsb" className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-800 border-slate-202 text-slate-850" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email</label>
                  <input type="email" name="leadEmail" placeholder="client@corp.id" className="w-full text-xs p-2 rounded border bg-slate-50" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Telepon</label>
                  <input type="text" name="leadPhone" placeholder="+62..." className="w-full text-xs p-2 rounded border bg-slate-50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Deal Value (Rp)</label>
                  <input type="number" name="leadValue" required placeholder="75000000" className="w-full text-xs p-2 rounded border bg-slate-50" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Stage</label>
                  <select name="leadStatus" className="w-full text-xs p-2 rounded border bg-slate-50">
                    <option value="Prospect">Prospect</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Agenda Pertemuan Berikutnya</label>
                <input type="text" name="leadMeeting" placeholder="Senin 15 Juni 14:00" className="w-full text-xs p-2 rounded border bg-slate-50" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Catatan Follow Up</label>
                <textarea name="leadNotes" rows={2} placeholder="Sangat tertarik dengan paket Enterprise Cloud..." className="w-full text-xs p-2 rounded border bg-slate-50"></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddLeadModal(false)} className="px-3 py-1.5 border hover:bg-slate-100 rounded text-xs font-semibold">Batal</button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold">Simpan Prospek</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT LEAD MODAL */}
      {editingLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 max-w-md w-full shadow-2xl relative text-left">
            <button 
              onClick={() => setEditingLead(null)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X size={16} />
            </button>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Ubah Data CRM Lead</h3>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Prospek</label>
                <input type="text" name="leadName" required defaultValue={editingLead.name} className="w-full text-xs p-2 rounded border bg-slate-50 text-slate-850" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Instansi</label>
                <input type="text" name="leadCompany" required defaultValue={editingLead.company} className="w-full text-xs p-2 rounded border bg-slate-50 text-slate-850" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email</label>
                  <input type="email" name="leadEmail" defaultValue={editingLead.email} className="w-full text-xs p-2 rounded border bg-slate-50" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Telepon</label>
                  <input type="text" name="leadPhone" defaultValue={editingLead.phone} className="w-full text-xs p-2 rounded border bg-slate-50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Deal Value (Rp)</label>
                  <input type="number" name="leadValue" required defaultValue={editingLead.leadValue} className="w-full text-xs p-2 rounded border bg-slate-50" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Status Prospek</label>
                  <select name="leadStatus" defaultValue={editingLead.status} className="w-full text-xs p-2 rounded border bg-slate-50">
                    <option value="Prospect">Prospect</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Agenda Pertemuan Berikutnya</label>
                <input type="text" name="leadMeeting" defaultValue={editingLead.nextMeeting} className="w-full text-xs p-2 rounded border bg-slate-50" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Catatan Follow Up</label>
                <textarea name="leadNotes" rows={2} defaultValue={editingLead.notes} className="w-full text-xs p-2 rounded border bg-slate-50"></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditingLead(null)} className="px-3 py-1.5 border rounded text-xs font-semibold">Batal</button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
