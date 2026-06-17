'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  profit: number;
  counterpartiesCount: number;
  employeesCount: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data.data);
      } catch (error) {
        // Use demo data on error
        setStats({
          totalIncome: 245000000,
          totalExpenses: 187000000,
          balance: 125000000,
          profit: 58000000,
          counterpartiesCount: 10,
          employeesCount: 7,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(amount) + ' UZS';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Boshqaruv paneli</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Boshqaruv paneli</h1>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-l-green-500">
          <p className="text-sm text-muted-foreground">Jami daromad</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(stats?.totalIncome || 0)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-l-red-500">
          <p className="text-sm text-muted-foreground">Jami xarajat</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(stats?.totalExpenses || 0)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-l-blue-500">
          <p className="text-sm text-muted-foreground">Balans</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats?.balance || 0)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-l-purple-500">
          <p className="text-sm text-muted-foreground">Sof foyda</p>
          <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats?.profit || 0)}</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-muted-foreground">Kontragentlar</p>
          <p className="text-3xl font-bold">{stats?.counterpartiesCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-muted-foreground">Xodimlar</p>
          <p className="text-3xl font-bold">{stats?.employeesCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-muted-foreground">So'nggi yangilanish</p>
          <p className="text-lg font-semibold">{new Date().toLocaleTimeString('uz-UZ')}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Tezkor harakatlar</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <a href="/journal/new" className="p-3 text-center bg-primary/10 rounded-lg hover:bg-primary/20 transition">
            <p className="text-sm font-medium">Yangi provodka</p>
          </a>
          <a href="/transactions/new" className="p-3 text-center bg-green-50 rounded-lg hover:bg-green-100 transition">
            <p className="text-sm font-medium">Yangi tranzaksiya</p>
          </a>
          <a href="/invoices/new" className="p-3 text-center bg-blue-50 rounded-lg hover:bg-blue-100 transition">
            <p className="text-sm font-medium">Yangi schet-faktura</p>
          </a>
          <a href="/cash/income" className="p-3 text-center bg-purple-50 rounded-lg hover:bg-purple-100 transition">
            <p className="text-sm font-medium">Kassa kirimi</p>
          </a>
        </div>
      </div>
    </div>
  );
}
