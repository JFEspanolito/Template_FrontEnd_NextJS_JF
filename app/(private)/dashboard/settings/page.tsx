import React from "react";

async function getUserSettings() {
  return {
    timezone: "UTC",
    language: "en",
  };
}

export default async function DashboardSettingsPage() {
  const settings = await getUserSettings();

  return (
    <main className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Configuración</h1>
        <p className="text-sm text-gray-600">Ajustes del usuario (template vacío)</p>
      </header>

      <section className="bg-white dark:bg-slate-800 rounded-md shadow p-4 max-w-md">
        <div className="mb-4">
          <div className="text-sm text-gray-500">Zona horaria</div>
          <div className="text-lg font-medium">{settings.timezone}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500">Idioma</div>
          <div className="text-lg font-medium">{settings.language}</div>
        </div>
      </section>
    </main>
  );
}
