import { MongoClient } from "mongodb";
import mongoose from "mongoose";

// Declaración global para evitar múltiples conexiones en desarrollo (Hot Reload)
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI;

let clientPromise: Promise<MongoClient> | undefined;

if (uri) {
  const client = new MongoClient(uri);

  // Patrón Singleton para Next.js en Desarrollo
  if (process.env.NODE_ENV === "development") {
    // En desarrollo, guardamos la promesa de conexión en global
    clientPromise =
      global._mongoClientPromise ??
      (global._mongoClientPromise = client.connect());
  } else {
    // En producción, creamos una nueva promesa normal
    clientPromise = client.connect();
  }
}

/**
 * EXPORTACIÓN 1: Para NextAuth (Auth.js)
 * El adaptador de NextAuth necesita una promesa directa al cliente nativo de MongoDB.
 */
export default clientPromise;

/**
 * EXPORTACIÓN 2: Para tus API Routes y Server Actions
 * Usa esto cuando necesites interactuar con tus modelos de Mongoose (User, Order, etc).
 * Mongoose gestiona internamente si ya está conectado, así que es seguro llamarlo siempre.
 */
export const connectMongo = async () => {
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Please add it to your environment variables."
    );
  }
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  return await mongoose.connect(uri);
};