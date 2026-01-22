
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut, TrendingUp, Users, Package, DollarSign } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    LineChart, Line
} from 'recharts';
import { io } from 'socket.io-client';

const SOCKET_URL = 'https://myl-msf-thiruvegappura.onrender.com';

interface Payment {
    _id: string;
    name: string;
    ward: string;
    mobile: string;
    amount: number;
    quantity: number;
    paymentId: string;
    createdAt: string;
    status: string;
}

interface Analytics {
    overall: {
        totalAmount: number;
        totalQuantity: number;
        totalOrders: number;
        avgOrderValue: number;
    };
    wardStats: { _id: string; amount: number; quantity: number; count: number }[];
    dailyStats: { _id: string; amount: number; quantity: number; count: number }[];
}

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'analytics' | 'payments'>('analytics');
    const [payments, setPayments] = useState<Payment[]>([]);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [search, setSearch] = useState('');
    const [wardFilter, setWardFilter] = useState('All');
    const navigate = useNavigate();

    const fetchPayments = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) return navigate('/login');

        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (wardFilter !== 'All') params.append('ward', wardFilter);

            const res = await fetch(`https://myl-msf-thiruvegappura.onrender.com/api/admin/payments?${params.toString()}`, {
                headers: { 'Authorization': token }
            });

            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem('adminToken');
                return navigate('/login');
            }

            const data = await res.json();
            setPayments(data);
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    };

    const fetchAnalytics = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) return navigate('/login');
        try {
            const res = await fetch(`https://myl-msf-thiruvegappura.onrender.com/api/admin/analytics`, {
                headers: { 'Authorization': token }
            });
            const data = await res.json();
            setAnalytics(data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    useEffect(() => {
        fetchAnalytics();

        const socket = io(SOCKET_URL);
        socket.on('connect', () => console.log('Admin Socket Connected'));
        socket.on('payment_success', () => {
            console.log('Payment Success. Refreshing...');
            fetchAnalytics();
            fetchPayments();
        });
        socket.on('payment_created', () => {
            console.log('New Payment Created. Refreshing...');
            fetchPayments();
        });
        socket.on('payment_failed', () => {
            console.log('Payment Failed. Refreshing...');
            fetchPayments();
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (activeTab === 'payments') {
            const debounce = setTimeout(() => {
                fetchPayments();
            }, 300);
            return () => clearTimeout(debounce);
        }
    }, [search, wardFilter, activeTab]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen pb-24 space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-400 text-sm">Overview & Management</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-white/5 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`px-4 py-2 rounded-md text-sm transition-colors ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Analytics
                        </button>
                        <button
                            onClick={() => setActiveTab('payments')}
                            className={`px-4 py-2 rounded-md text-sm transition-colors ${activeTab === 'payments' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Payments
                        </button>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="glass-button text-sm py-2 px-4 bg-red-600 hover:bg-red-500 flex items-center gap-2"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </header>

            {activeTab === 'analytics' && analytics && (
                <div className="space-y-8 animate-in fade-in zoom-in duration-300">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="glass-panel p-6 flex flex-col items-center text-center">
                            <div className="p-3 bg-emerald-500/20 rounded-full mb-2">
                                <DollarSign className="text-emerald-400" size={24} />
                            </div>
                            <h3 className="text-gray-400 text-xs uppercase tracking-wider">Total Revenue</h3>
                            <p className="text-2xl font-bold text-white mt-1">₹{analytics.overall.totalAmount.toLocaleString()}</p>
                        </div>

                        <div className="glass-panel p-6 flex flex-col items-center text-center">
                            <div className="p-3 bg-blue-500/20 rounded-full mb-2">
                                <Package className="text-blue-400" size={24} />
                            </div>
                            <h3 className="text-gray-400 text-xs uppercase tracking-wider">Total Packs</h3>
                            <p className="text-2xl font-bold text-white mt-1">{analytics.overall.totalQuantity}</p>
                        </div>

                        <div className="glass-panel p-6 flex flex-col items-center text-center">
                            <div className="p-3 bg-purple-500/20 rounded-full mb-2">
                                <Users className="text-purple-400" size={24} />
                            </div>
                            <h3 className="text-gray-400 text-xs uppercase tracking-wider">Total Orders</h3>
                            <p className="text-2xl font-bold text-white mt-1">{analytics.overall.totalOrders}</p>
                        </div>

                        <div className="glass-panel p-6 flex flex-col items-center text-center">
                            <div className="p-3 bg-amber-500/20 rounded-full mb-2">
                                <TrendingUp className="text-amber-400" size={24} />
                            </div>
                            <h3 className="text-gray-400 text-xs uppercase tracking-wider">Avg Order Value</h3>
                            <p className="text-2xl font-bold text-white mt-1">₹{Math.round(analytics.overall.avgOrderValue || 0)}</p>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Ward Performance */}
                        <div className="glass-panel p-6">
                            <h3 className="text-lg font-bold mb-6">Unit Performance</h3>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={analytics.wardStats} layout="vertical" margin={{ left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                        <XAxis type="number" stroke="#9ca3af" fontSize={12} tickFormatter={(val) => `₹${val / 1000}k`} />
                                        <YAxis dataKey="_id" type="category" stroke="#9ca3af" fontSize={12} width={60} />
                                        <RechartsTooltip
                                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#ffffff20', color: '#fff' }}
                                            itemStyle={{ color: '#fff' }}
                                            formatter={(value?: number) => [`₹${(value || 0).toLocaleString()}`, 'Revenue']}
                                        />
                                        <Bar dataKey="amount" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Daily Trend */}
                        <div className="glass-panel p-6">
                            <h3 className="text-lg font-bold mb-6">Daily Growth (Last 7 Days)</h3>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={analytics.dailyStats}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                        <XAxis dataKey="_id" stroke="#9ca3af" fontSize={12} />
                                        <YAxis stroke="#9ca3af" fontSize={12} />
                                        <RechartsTooltip
                                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#ffffff20', color: '#fff' }}
                                            itemStyle={{ color: '#fff' }}
                                            formatter={(value?: number) => [`₹${(value || 0).toLocaleString()}`, 'Revenue']}
                                        />
                                        <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'payments' && (
                <div className="animate-in fade-in zoom-in duration-300">
                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search Name, Mobile, or Payment ID"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="glass-input w-full pl-10"
                            />
                        </div>

                        <select
                            value={wardFilter}
                            onChange={(e) => setWardFilter(e.target.value)}
                            className="glass-input w-full bg-[#1e293b] text-white"
                        >
                            <option value="All" className="bg-[#1e293b] text-white">All Units</option>
                            {[
                                'തിരുവേഗപ്പുറ', 'മൂച്ചിത്തറ', 'വെസ്റ്റ് കൈപ്പുറം', 'ഫാറൂഖ് നഗർ', 'കൈപ്പുറം',
                                'വിളത്തൂർ', 'തെക്കുമ്മല', 'മാഞ്ഞാമ്പ്ര', 'പൈലിപ്പുറം', 'നെടുങ്ങോട്ടൂർ',
                                'നോർത്ത് കൈപ്പുറം', 'മനക്കൽ പീടിക', 'ഞാവളുംകാട്', 'ചെമ്പ്ര', 'Other'
                            ].map((ward, i) => (
                                <option key={i} value={ward} className="bg-[#1e293b] text-white">{ward}</option>
                            ))}
                        </select>
                    </div>

                    {/* Table */}
                    <div className="glass-panel overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-gray-400 border-b border-white/5">
                                    <tr>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Mobile</th>
                                        <th className="p-4">Unit</th>
                                        <th className="p-4">Qty</th>
                                        <th className="p-4">Amount</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 hidden md:table-cell">Payment ID</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {payments.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-gray-500">No payments found</td>
                                        </tr>
                                    ) : (
                                        payments.map((p) => (
                                            <tr key={p._id} className="hover:bg-white/5 transition-colors">
                                                <td className="p-4 text-sm text-gray-300">{new Date(p.createdAt).toLocaleDateString()}</td>
                                                <td className="p-4 font-semibold">{p.name}</td>
                                                <td className="p-4 text-gray-300 font-mono">{p.mobile}</td>
                                                <td className="p-4 text-gray-300">{p.ward}</td>
                                                <td className="p-4 text-gray-300">{p.quantity}</td>
                                                <td className="p-4 text-emerald-400 font-bold">₹{p.amount}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.status === 'success'
                                                        ? 'bg-emerald-500/10 text-emerald-400'
                                                        : p.status === 'failed'
                                                            ? 'bg-red-500/10 text-red-400'
                                                            : 'bg-amber-500/10 text-amber-400'
                                                        }`}>
                                                        {p.status ? (p.status.charAt(0).toUpperCase() + p.status.slice(1)) : 'Success'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-xs text-gray-500 font-mono hidden md:table-cell">{p.paymentId}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
