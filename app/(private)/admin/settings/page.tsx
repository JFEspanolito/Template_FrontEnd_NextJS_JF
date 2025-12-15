import React from "react";

/**
 * Admin Settings — template vacío
 * Reemplaza `getSettings()` y `saveSettings()` por llamadas reales.
 */
async function getSettings() {
  return {
    siteName: "My App",
    supportEmail: "support@example.com",
  };
}

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <main className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Admin — Settings</h1>
        <p className="text-sm text-gray-600">Panel de configuración (template vacío)</p>
      </header>

      <section className="bg-white dark:bg-slate-800 rounded-md shadow p-4">
        <div className="mb-4">
          <label className="block text-sm text-gray-500">Site name</label>
          <div className="text-lg font-medium">{settings.siteName}</div>
        </div>

        <div>
          <label className="block text-sm text-gray-500">Support email</label>
          <div className="text-lg font-medium">{settings.supportEmail}</div>
        </div>
      </section>
    </main>
  );
}
