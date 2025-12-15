import React from "react";
import Link from "next/link";

type User = {
	id?: string;
	name?: string;
	email?: string;
	role?: string;
	createdAt?: string;
};

/**
 * Placeholder: reemplazar por llamada real a la base de datos.
 * Ejemplo: usar libs/mongo.ts, fetch a /api/admin/users o una query a mongoose.
 */
async function getUsers(): Promise<User[]> {
	return []; // template vacío
}

export default async function AdminUsersPage() {
	const users = await getUsers();

	return (
		<main className="p-6">
			<header className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-semibold">Admin — Usuarios</h1>
				<Link
					href="#"
					className="inline-block px-3 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
				>
					Nuevo usuario
				</Link>
			</header>

			<section className="bg-white dark:bg-slate-800 rounded-md shadow overflow-auto">
				<table className="min-w-full divide-y">
					<thead className="bg-gray-50 dark:bg-slate-900">
						<tr>
							<th className="px-4 py-2 text-left text-sm font-medium">Nombre</th>
							<th className="px-4 py-2 text-left text-sm font-medium">Email</th>
							<th className="px-4 py-2 text-left text-sm font-medium">Rol</th>
							<th className="px-4 py-2 text-left text-sm font-medium">Creado</th>
						</tr>
					</thead>
					<tbody>
						{users.length === 0 ? (
							<tr>
								<td colSpan={4} className="p-6 text-center text-sm text-gray-500">
									No hay usuarios. Este es un template vacío — implementa getUsers() para mostrar datos.
								</td>
							</tr>
						) : (
							users.map((u) => (
								<tr key={u.id} className="border-t">
									<td className="px-4 py-3 text-sm">{u.name || "—"}</td>
									<td className="px-4 py-3 text-sm">{u.email || "—"}</td>
									<td className="px-4 py-3 text-sm">{u.role || "—"}</td>
									<td className="px-4 py-3 text-sm">{u.createdAt || "—"}</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</section>
		</main>
	);
}

