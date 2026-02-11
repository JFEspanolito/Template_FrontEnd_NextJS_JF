// src/app/api/creature/route.ts
import { NextResponse } from 'next/server';
import { CreatureSchema } from '@/core/creature/domain/CreatureSchema';
import { uploadCreatureUseCase } from '@/core/container'; 

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = CreatureSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(result.error.format(), { status: 400 });
    }

    // Usamos el caso de uso que ya viene con el repositorio inyectado
    await uploadCreatureUseCase.execute(result.data);
    
    return NextResponse.json({ message: "Creado" }, { status: 201 });
  } catch (error) {
    // Aquí es donde entran tus nuevos errores de shared/errors.ts
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}