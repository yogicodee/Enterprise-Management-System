import { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  Compass, 
  Loader2, 
  Workflow, 
  TrendingUp, 
  AlertTriangle 
} from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AiCopilotProps {
  onDismiss: () => void;
}

export default function AiCopilot({ onDismiss }: AiCopilotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Halo! Saya adalah OmniCorp AI Co-pilot terintegrasi. Saya tersinkronisasi realtime dengan seluruh data Operasional, HR, Keuangan, Inventaris, dan CRM Leads Anda. Bagaimana saya bisa membantu Anda mengoptimalkan bisnis hari ini?' 
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest response
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const testSuggestions = [
    { label: "Analisis Kesehatan Kas", icon: <TrendingUp size={11} className="text-emerald-500" />, prompt: "Analisis kesehatan keuangan kas, laba bersih, dan pengeluaran bulan ini berdasarkan pembukuan saat ini" },
    { label: "Stok Inventaris Menipis", icon: <AlertTriangle size={11} className="text-rose-500" />, prompt: "Cek apakah ada barang inventaris SKU yang tingkat stoknya menipis di bawah limit batas?" },
    { label: "Rangkuman KPI Staf", icon: <Compass size={11} className="text-blue-500" />, prompt: "Berikan evaluasi komprehensif performa KPI staf kontributor OmniCorp saat ini" },
    { label: "CRM Leads Kritis", icon: <Workflow size={11} className="text-purple-500" />, prompt: "Sebutkan daftar lead penjualan potensial teratas yang memiliki deal size besar dan butuh follow up" }
  ];

  const handleSendPrompt = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg = text.trim();
    setInputVal("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg })
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi Gemini API server-side proxy');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || "Maaf, saya tidak menerima respons yang valid dari server." }]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error Operasi: Tidak dapat memproses instruksi. Pastikan kunci GEMINI_API_KEY terdaftar secara aman di menu rahasia (Secrets). Detail error: ${err.message}` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Turn markdown-like logs into formatted HTML paragraphs safely
  const formatText = (text: string) => {
    return text.split("\n").map((line, idx) => {
      // Bold syntax
      let cleanLine = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      
      // Simple list representation
      const isList = cleanLine.trim().startsWith("-") || cleanLine.trim().startsWith("*");
      if (isList) {
        cleanLine = cleanLine.replace(/^[-*]\s*/, "");
      }

      // Format bold markup inside line
      const lineHtml = cleanLine.replace(boldRegex, '<strong class="font-bold text-slate-900 dark:text-slate-100">$1</strong>');

      if (isList) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-700 dark:text-slate-350 my-1 leading-relaxed text-xs" dangerouslySetInnerHTML={{ __html: lineHtml }} />
        );
      }

      if (line.trim() === "") {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="text-slate-700 dark:text-slate-300 my-1 leading-relaxed text-xs" dangerouslySetInnerHTML={{ __html: lineHtml }} />
      );
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 max-w-lg w-full bg-slate-900 dark:bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col justify-between z-50 animate-slide-in text-left">
      
      {/* Copilot Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-sm bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <Sparkles size={14} className="text-blue-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">OMNICORP AI CO-PILOT</h3>
            <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Enterprise Agent v2.4
            </span>
          </div>
        </div>
        
        <button 
          onClick={onDismiss}
          className="p-1 px-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition cursor-pointer"
        >
          <X size={15} />
        </button>
      </div>

      {/* Message Chat Board Area */}
      <div className="flex-1 p-5 overflow-y-auto bg-slate-950/40 space-y-4">
        {messages.map((m, idx) => (
          <div 
            key={idx} 
            className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse text-right' : 'mr-auto text-left'}`}
          >
            {/* Avatar Circle */}
            <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
              m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'
            }`}>
              {m.role === 'user' ? <User size={12} /> : <Bot size={12} />}
            </div>

            {/* Bubble */}
            <div className={`p-3.5 rounded-lg text-xs ${
              m.role === 'user' 
                ? 'bg-blue-600 font-medium text-slate-100 rounded-tr-none' 
                : 'bg-slate-900/90 border border-slate-800 text-slate-250 rounded-tl-none'
            }`}>
              {m.role === 'user' ? (
                <p className="leading-relaxed text-xs">{m.content}</p>
              ) : (
                <div className="space-y-1">{formatText(m.content)}</div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex gap-3 max-w-[80%] mr-auto text-left">
            <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 shrink-0 flex items-center justify-center text-xs">
              <Bot size={12} />
            </div>
            <div className="p-3.5 bg-slate-900/50 border border-slate-800 rounded-lg rounded-tl-none flex items-center gap-2">
              <Loader2 size={13} className="text-blue-400 animate-spin" />
              <span className="text-[11px] text-slate-400 font-mono">OmniCorp AI sedang menganalisa data...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips (Visible only when not loading) */}
      {!loading && messages.length <= 2 && (
        <div className="p-3 bg-slate-950/60 border-t border-slate-900 grid grid-cols-1 gap-1.5 text-left shrink-0">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-1">Rekomendasi Analisis Cepat:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {testSuggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPrompt(sug.prompt)}
                className="flex items-center gap-1.5 p-2 bg-slate-900 hover:bg-slate-800/80 border border-slate-800/60 hover:border-slate-700/80 rounded transition cursor-pointer text-left text-slate-300 font-medium"
              >
                {sug.icon}
                <span className="text-[10px] truncate">{sug.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form Box */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt(inputVal);
          }}
          className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-md px-2.5 py-1"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Tanyakan analisis strategis perusahaan..."
            disabled={loading}
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 py-1.5 border-none focus:outline-none focus:ring-0"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || loading}
            className={`p-1.5 rounded transition ${
              inputVal.trim() && !loading 
                ? 'bg-blue-600 text-white cursor-pointer hover:bg-blue-700' 
                : 'text-slate-650 cursor-not-allowed'
            }`}
          >
            <Send size={12} />
          </button>
        </form>
        <span className="text-[8px] text-slate-500 block text-center mt-2">
          Koneksi VPN Korporasi Dienskripsi End-to-End dengan Otoritas RBAC Token.
        </span>
      </div>

    </div>
  );
}
