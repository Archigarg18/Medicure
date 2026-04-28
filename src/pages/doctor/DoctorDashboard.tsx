import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { safeLocalStorageGet, safeLocalStorageRemove } from "@/lib/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Users, 
  MessageSquare, 
  UserCircle, 
  Settings, 
  HelpCircle,
  Search,
  Bell,
  Mail,
  CalendarPlus,
  ClipboardCheck,
  XCircle,
  CalendarClock,
  MailOpen,
  FileText,
  Save
} from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

const chartData = [
  { name: 'Dept A', count: 100, fill: '#8884d8' },
  { name: 'Dept B', count: 120, fill: '#83a6ed' },
  { name: 'Dept C', count: 140, fill: '#8dd1e1' },
  { name: 'Dept D', count: 120, fill: '#82ca9d' },
];

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [slots, setSlots] = useState("");
  const [isEditingSlots, setIsEditingSlots] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = safeLocalStorageGet("token");
      const res = await fetch("http://localhost:5002/api/doctors/me/appointments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch appointments");
    }
  };

  const handleUpdateSlots = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5002/api/doctors/me/slots", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ availableSlots: slots.split(",") }),
      });
      if (res.ok) {
        toast({ title: "Success", description: "Timings updated successfully!" });
        setIsEditingSlots(false);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update timings", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    safeLocalStorageRemove("token");
    safeLocalStorageRemove("isLoggedIn");
    safeLocalStorageRemove("userRole");
    navigate("/doctor/login");
  };

  const userName = safeLocalStorageGet("userName") || "Doctor";
  const userEmail = safeLocalStorageGet("userEmail") || "";
  const userPic =
    safeLocalStorageGet("userPic") ||
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=60";

  return (
    <div className="flex h-screen bg-[#F5F6FA] font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col flex-shrink-0 relative overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[#21C5D8]/20 to-transparent pointer-events-none" />
        
        <div className="p-6">
          <h1 className="text-[#21C5D8] font-bold text-2xl tracking-tight">Medicure</h1>
        </div>

        <div className="flex flex-col items-center mt-2 mb-8 relative z-10">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden mb-3">
            <img src={userPic} alt="Doctor" className="w-full h-full object-cover" />
          </div>
          <h2 className="font-bold text-gray-800 text-center">{userName}</h2>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-[#21C5D8] text-white rounded-xl shadow-sm shadow-[#21C5D8]/30 transition-all font-medium">
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all font-medium">
            <CalendarCheck size={20} /> Appointment list
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all font-medium">
            <Users size={20} /> Manage Team
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all font-medium">
            <MessageSquare size={20} /> Messages
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all font-medium">
            <UserCircle size={20} /> Profile
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all font-medium">
            <Settings size={20} /> Settings
          </a>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium mt-auto">
            <HelpCircle size={20} /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <header className="h-20 bg-white border-b flex items-center justify-end px-8 shadow-sm z-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img src={userPic} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart Widget */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] lg:col-span-1 border border-gray-100/50">
              <h3 className="font-bold text-gray-800 mb-6 text-lg">Patients by department</h3>
              <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" barSize={10} data={chartData}>
                    <RadialBar background dataKey="count" cornerRadius={10} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Total</p>
                  <p className="text-xl font-bold text-gray-900">480</p>
                </div>
              </div>
            </div>

            {/* Latest Appointments Widget */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] lg:col-span-1 border border-gray-100/50">
              <h3 className="font-bold text-gray-800 mb-6 text-lg">Latest Appointments</h3>
              <div className="space-y-4">
                {appointments.slice(0, 4).map((apt, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 hover:bg-[#F5F6FA] rounded-2xl transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-600 shadow-inner group-hover:shadow-md transition-all">
                      {apt.user?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{apt.user?.name || "Unknown Patient"}</p>
                      <p className="text-xs text-gray-500 font-medium">{new Date(apt.appointmentDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                {appointments.length === 0 && (
                   <p className="text-gray-500 text-sm text-center py-8">No appointments yet</p>
                )}
              </div>
            </div>

            {/* Stats Column */}
            <div className="flex flex-col gap-4 lg:col-span-1">
              <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex items-center gap-5 border border-gray-100/50 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-[#E8F8F5] flex items-center justify-center text-[#21C5D8]">
                  <CalendarPlus size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-2xl font-black text-[#21C5D8]">{appointments.length}</p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Total Appointments</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex items-center gap-5 border border-gray-100/50 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-[#EBF5FF] flex items-center justify-center text-[#3B82F6]">
                  <ClipboardCheck size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-2xl font-black text-[#3B82F6]">
                     {appointments.filter(a => a.status === 'completed').length}
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Completed Appointments</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex items-center gap-5 border border-gray-100/50 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF1F2] flex items-center justify-center text-[#EF4444]">
                  <XCircle size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-2xl font-black text-[#EF4444]">
                     {appointments.filter(a => a.status === 'cancelled').length}
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Cancelled Appointments</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex items-center gap-5 border border-gray-100/50 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF7ED] flex items-center justify-center text-[#F97316]">
                  <CalendarClock size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-2xl font-black text-[#F97316]">
                     {appointments.filter(a => a.status === 'pending').length}
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Followup Appointments</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex items-center gap-5 cursor-pointer hover:shadow-md transition-all border border-gray-100/50 group">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF7ED] flex items-center justify-center text-[#F97316] group-hover:scale-110 transition-transform">
                <MailOpen size={24} strokeWidth={2} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">New Messages</h4>
                <p className="text-xs text-[#21C5D8] font-medium mt-1">Click to view</p>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-center transition-all border border-gray-100/50">
              {!isEditingSlots ? (
                <div onClick={() => setIsEditingSlots(true)} className="flex items-center gap-5 cursor-pointer group w-full">
                  <div className="w-14 h-14 rounded-2xl bg-[#FEF2F2] flex items-center justify-center text-[#EF4444] group-hover:scale-110 transition-transform">
                    <FileText size={24} strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Update OPD Slots</h4>
                    <p className="text-xs text-[#21C5D8] font-medium mt-1">Click to edit timings</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUpdateSlots} className="w-full flex flex-col gap-3">
                  <h4 className="font-bold text-gray-900 text-sm">Set Available Slots</h4>
                  <Input 
                    placeholder="e.g., Mon-Fri 10AM-2PM" 
                    value={slots} 
                    onChange={(e) => setSlots(e.target.value)} 
                    required 
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" className="flex-1 bg-[#21C5D8] text-white hover:bg-[#1CAEBF]">Save</Button>
                    <Button type="button" size="sm" variant="outline" className="flex-1" onClick={() => setIsEditingSlots(false)}>Cancel</Button>
                  </div>
                </form>
              )}
            </div>

            <div className="bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex items-center gap-5 cursor-pointer hover:shadow-md transition-all border border-gray-100/50 group">
              <div className="w-14 h-14 rounded-2xl bg-[#F0FDF4] flex items-center justify-center text-[#22C55E] group-hover:scale-110 transition-transform">
                <Save size={24} strokeWidth={2} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">View Saved items</h4>
                <p className="text-xs text-[#21C5D8] font-medium mt-1">Click to view</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
