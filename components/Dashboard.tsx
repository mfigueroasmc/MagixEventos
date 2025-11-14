
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getDashboardData } from '../services/supabaseService';

interface DashboardData {
    totalRevenue: number;
    upcomingEvents: number;
    lowStockItems: number;
    eventsByMonth: { name: string; Eventos: number }[];
    incomeByCompany: { name: string; Ingresos: number }[];
    topArticles: { name: string; Cantidad: number }[];
}

const StatCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
);

const Dashboard: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dashboardData = await getDashboardData();
                setData(dashboardData);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const PIE_COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

    if (loading) {
        return <div className="text-center p-8">Loading dashboard...</div>;
    }

    if (!data) {
        return <div className="text-center p-8 text-red-500">Could not load dashboard data.</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <StatCard title="Total Revenue" value={`$${data.totalRevenue.toLocaleString()}`} />
                <StatCard title="Upcoming Events" value={data.upcomingEvents} />
                <StatCard title="Low Stock Items" value={data.lowStockItems} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Events per Month</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.eventsByMonth}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.2)" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }} />
                            <Legend />
                            <Bar dataKey="Eventos" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Most Used Items</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data.topArticles}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="Cantidad"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {data.topArticles.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
