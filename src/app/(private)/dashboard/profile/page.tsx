import React from "react";

type Profile = {
  id?: string;
  name?: string;
  email?: string;
};

async function getProfile(): Promise<Profile> {
  return { id: "", name: "Usuario", email: "user@example.com" };
}

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <main className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Mi perfil</h1>
        <p className="text-sm text-gray-600">Información del usuario (template vacío)</p>
      </header>

      <section className="bg-white dark:bg-slate-800 rounded-md shadow p-4 max-w-md">
        <div className="mb-2">
          <div className="text-sm text-gray-500">Nombre</div>
          <div className="text-lg font-medium">{profile.name}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Email</div>
          <div className="text-lg font-medium">{profile.email}</div>
        </div>
      </section>
    </main>
  );
}
