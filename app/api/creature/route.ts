
import { NextResponse } from 'next/server';
import { CreatureSchema } from '@/core/creature/domain/CreatureSchema';
import { UploadCreature } from '@/core/creature/application/UploadCreature';
import { MongoRepository } from '@/core/creature/infrastructure/MongoRepository';

const repo = new MongoRepository();
const uploadUseCase = new UploadCreature(repo);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = CreatureSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(result.error.format(), { status: 400 });
    }

    await uploadUseCase.execute(result.data);
    return NextResponse.json({ message: "Creado" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}