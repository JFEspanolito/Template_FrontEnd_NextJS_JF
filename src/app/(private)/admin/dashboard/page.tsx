import React from "react";

/**
 * Admin Dashboard — template vacío
 * Reemplaza `getStats()` por llamadas reales a la base de datos o a tus APIs.
 */
async function getStats() {
  return {
    usersCount: 0,
    activeSessions: 0,
    revenueThisMonth: 0,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <main className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Admin — Dashboard</h1>
        <p className="text-sm text-gray-600">Resumen rápido (template vacío)</p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="p-4 bg-white dark:bg-slate-800 rounded shadow">
          <h2 className="text-sm text-gray-500">Usuarios</h2>
          <div className="text-2xl font-bold">{stats.usersCount}</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded shadow">
          <h2 className="text-sm text-gray-500">Sesiones activas</h2>
          <div className="text-2xl font-bold">{stats.activeSessions}</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded shadow">
          <h2 className="text-sm text-gray-500">Ingresos (mes)</h2>
          <div className="text-2xl font-bold">${stats.revenueThisMonth}</div>
        </div>
      </section>
    </main>
  );
}
