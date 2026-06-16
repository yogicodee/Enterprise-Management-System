import { useState, useMemo } from "react";
import { 
  FolderGit2, 
  Plus, 
  Clock, 
  DollarSign, 
  Users, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  MoreVertical, 
  Trash2,
  X,
  PlusCircle,
  AlertCircle
} from "lucide-react";
import { Project, Task, Employee } from "../types";

interface ProjectsViewProps {
  projects: Project[];
  tasks: Task[];
  employees: Employee[];
  onAddProject: (proj: Omit<Project, 'id'>) => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  searchQuery: string;
}

export default function ProjectsView({ 
  projects, 
  tasks, 
  employees,
  onAddProject, 
  onUpdateProject,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  searchQuery
}: ProjectsViewProps) {
  
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || "");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  const selectedProject = useMemo(() => {
    return projects.find(p => p.id === selectedProjectId) || projects[0];
  }, [projects, selectedProjectId]);

  // Tasks belonging to this project
  const projectTasks = useMemo(() => {
    if (!selectedProject) return [];
    return tasks.filter(t => t.projectId === selectedProject.id && 
      (t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.assignee.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [tasks, selectedProject, searchQuery]);

  // Kanban Columns
  const columns: { id: Task['status']; label: string; color: string }[] = [
    { id: 'Backlog', label: 'Backlog', color: 'bg-slate-400 dark:bg-slate-650' },
    { id: 'Todo', label: 'To Do', color: 'bg-blue-500' },
    { id: 'In Progress', label: 'In Progress', color: 'bg-amber-500' },
    { id: 'Review', label: 'Review', color: 'bg-purple-500' },
    { id: 'Done', label: 'Selesai', color: 'bg-emerald-500' },
  ];

  // Move Task forwards or backwards or set specific column
  const moveTask = (taskId: string, targetStatus: Task['status']) => {
    onUpdateTask(taskId, { status: targetStatus });
  };

  // Add Task submit
  const handleAddTaskSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProject) return;

    const data = new FormData(e.currentTarget);
    const title = data.get('taskTitle') as string;
    const assignee = data.get('taskAssignee') as string;
    const priority = data.get('taskPriority') as any;
    const status = data.get('taskStatus') as any;
    const dueDate = data.get('taskDueDate') as string || new Date().toISOString().substring(0, 10);

    if (title && assignee) {
      onAddTask({
        projectId: selectedProject.id,
        title,
        assignee,
        priority,
        status,
        dueDate
      });
      setShowAddTaskModal(false);
    }
  };

  // Add Project submit
  const handleAddProjectSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get('prjName') as string;
    const budget = Number(data.get('prjBudget'));
    const deadline = data.get('prjDeadline') as string || new Date().toISOString().substring(0, 10);
    const membersInput = data.get('prjMembers') as string;
    const members = membersInput ? membersInput.split(",").map(m => m.trim()) : [];

    if (name && budget > 0) {
      onAddProject({
        name,
        progress: 0,
        members,
        budget,
        spent: 0,
        deadline,
        status: 'Planning'
      });
      setShowAddProjectModal(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-1 text-left leading-normal">
      
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Kanban Workspace</h2>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Rencanakan deliverable, tugaskan task, monitoring budget spending, dan kelola workflow tim.</p>
        </div>
        <div className="flex gap-2">
          <button 
            id="btn-add-project"
            onClick={() => setShowAddProjectModal(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-100 rounded-md text-xs font-semibold cursor-pointer shadow-sm transition"
          >
            Inisiasi Proyek Baru
          </button>
          {selectedProject && (
            <button 
              id="btn-add-task-board"
              onClick={() => setShowAddTaskModal(true)}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold cursor-pointer shadow-sm transition"
            >
              <Plus size={14} /> Buat Tugas Kanban
            </button>
          )}
        </div>
      </div>

      {/* Projects selectors row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedProjectId(p.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedProjectId === p.id 
                ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-500/25' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {selectedProject ? (
        <div className="space-y-6">
          
          {/* Active Project Card Dashboard context */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Left: General info and progress */}
            <div className="md:col-span-2 text-left space-y-3 border-r border-slate-100 dark:border-slate-800 pr-4">
              <span className={`inline-block px-2.5 py-0.5 text-[9px] font-bold rounded-full ${
                selectedProject.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-600' : 'bg-blue-500/15 text-blue-600'
              }`}>{selectedProject.status}</span>
              <h3 className="text-sm font-bold text-slate-850 dark:text-white leading-tight">{selectedProject.name}</h3>
              
              {/* Progress metrics */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Progres Kumulatif</span>
                  <span className="font-mono font-bold text-blue-500">{selectedProject.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${selectedProject.progress}%` }}></div>
                </div>
              </div>
            </div>

            {/* Middle: Budget usage info */}
            <div className="text-left space-y-1.5 flex flex-col justify-center border-r border-slate-100 dark:border-slate-800 md:pl-4">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Keluaran Anggaran</span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Rp {selectedProject.spent.toLocaleString('id-ID')}
              </p>
              <span className="text-[10px] text-slate-500">
                dari pagu Rp {selectedProject.budget.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Right: Team members and deadline */}
            <div className="text-left space-y-1.5 flex flex-col justify-center md:pl-4">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Tenggat Waktu</span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Clock size={12} className="text-blue-500" /> {selectedProject.deadline}
              </p>
              <span className="text-[10px] text-slate-500 truncate">
                Anggota: {selectedProject.members.join(", ")}
              </span>
            </div>

          </div>

          {/* KANBAN BOARD SCREEN */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4" id="kanban-stage">
            {columns.map((col) => {
              const colTasks = projectTasks.filter(t => t.status === col.id);
              return (
                <div 
                  key={col.id} 
                  className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/65 dark:border-slate-800 p-3 rounded-lg flex flex-col min-h-[400px]"
                >
                  {/* Column Header */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${col.color}`}></span>
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-350">{col.label}</h4>
                    </div>
                    <span className="font-mono text-[10px] bg-slate-200/60 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Tasks Container */}
                  <div className="space-y-2.5 flex-1 overflow-y-auto">
                    {colTasks.length === 0 ? (
                      <div className="py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-md flex items-center justify-center">
                        <span className="text-[10px] text-slate-400">Empty State</span>
                      </div>
                    ) : (
                      colTasks.map((t) => (
                        <div 
                          key={t.id} 
                          className="bg-white dark:bg-slate-900 p-3.5 rounded-md border border-slate-200/80 dark:border-slate-800 shadow-xs text-left space-y-3 relative group"
                        >
                          <div className="flex justify-between items-start gap-1">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide ${
                              t.priority === 'Urgent' ? 'bg-red-500/10 text-red-500' :
                              t.priority === 'High' ? 'bg-amber-500/10 text-amber-500' :
                              t.priority === 'Medium' ? 'bg-blue-500/10 text-blue-500' :
                              'bg-slate-100 text-slate-600'
                            }`}>{t.priority}</span>
                            <button 
                              onClick={() => onDeleteTask(t.id)}
                              className="text-slate-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100 p-0.5"
                              title="Hapus tugas"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>

                          <h5 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-snug">{t.title}</h5>

                          <div className="flex justify-between items-center text-[10px] text-slate-450 pt-1.5 border-t border-slate-50 dark:border-slate-800">
                            <span className="truncate">{t.assignee}</span>
                            <span className="font-mono text-[9px] shrink-0 text-slate-500">{t.dueDate.substring(5)}</span>
                          </div>

                          {/* Quick movement controls (Very user friendly!) */}
                          <div className="flex justify-between items-center pt-2 gap-1 border-t border-slate-50 dark:border-slate-850">
                            {col.id !== 'Backlog' && (
                              <button 
                                onClick={() => {
                                  // Move backward
                                  const stepIdx = columns.findIndex(c => c.id === col.id);
                                  moveTask(t.id, columns[stepIdx - 1].id);
                                }}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition cursor-pointer text-slate-400"
                                title="Geser ke kiri"
                              >
                                <ArrowLeft size={10} />
                              </button>
                            )}
                            <div className="flex-1"></div>
                            {col.id !== 'Done' && (
                              <button 
                                onClick={() => {
                                  // Move forward
                                  const stepIdx = columns.findIndex(c => c.id === col.id);
                                  moveTask(t.id, columns[stepIdx + 1].id);
                                }}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition cursor-pointer text-slate-400"
                                title="Geser ke kanan"
                              >
                                <ArrowRight size={10} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      ) : (
        <div className="py-24 text-center text-slate-400">Inisiasilah proyek baru untuk mendarat pada Workspace utama.</div>
      )}

      {/* CREATE KANBAN TASK MODAL */}
      {showAddTaskModal && selectedProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 max-w-md w-full shadow-2xl relative text-left">
            <button 
              onClick={() => setShowAddTaskModal(false)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X size={16} />
            </button>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Tambahkan Tugas Kanban Baru</h3>

            <form onSubmit={handleAddTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Judul Tugas</label>
                <input 
                  type="text" 
                  name="taskTitle" 
                  required 
                  placeholder="Contoh: Optimasi query DB index..." 
                  className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-100" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tugaskan Kepada (Assignee)</label>
                <select name="taskAssignee" className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800">
                  {employees.map(e => (
                    <option key={e.id} value={e.name}>{e.name} ({e.department})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Prioritas</label>
                  <select name="taskPriority" className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800">
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kolom Awal</label>
                  <select name="taskStatus" className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800">
                    <option value="Todo">To Do</option>
                    <option value="Backlog">Backlog</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tenggat Tanggal</label>
                <input type="date" name="taskDueDate" className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-800 border-slate-202 dark:border-slate-800" />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddTaskModal(false)} className="px-3 py-1.5 border border-slate-200 dark:border-slate-850 text-slate-550 rounded text-xs font-semibold">Batal</button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold">Tugaskan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE PROJECT MODAL */}
      {showAddProjectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 max-w-md w-full shadow-2xl relative text-left">
            <button 
              onClick={() => setShowAddProjectModal(false)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X size={16} />
            </button>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Inisiasi Proyek Baru</h3>

            <form onSubmit={handleAddProjectSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Proyek</label>
                <input type="text" name="prjName" required placeholder="Contoh: Security Fintech Audit..." className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-850" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Total Pagu Budget (Rp)</label>
                <input type="number" name="prjBudget" required placeholder="Contoh: 150000000" className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-800 border-slate-202 dark:border-slate-800" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Deadline Pencapaian</label>
                <input type="date" name="prjDeadline" className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-800 border-slate-202" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Anggota Tim (Pisahkan koma)</label>
                <input type="text" name="prjMembers" placeholder="Adi Wijaya, Heri Gunawan" className="w-full text-xs p-2 rounded border bg-slate-50 dark:bg-slate-800 border-slate-202" />
                <span className="text-[10px] text-slate-450 mt-1 block">Tulis nama lengkap persis sesuai di modul roster (karyawan).</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddProjectModal(false)} className="px-3 py-1.5 border border-slate-202 text-slate-550 rounded text-xs font-semibold">Batal</button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer">Inisiasi</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
