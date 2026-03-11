import type { Schema, Document } from "mongoose";

/**
 * Mongoose schema plugin — toJSON transform:
 *  - removes __v and any path with `private: true`
 *  - replaces _id with id
 */

type JsonObject = Record<string, unknown>;

const deleteAtPath = (obj: JsonObject, path: string[], index: number): void => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  const next = obj[path[index]];
  if (next && typeof next === "object") {
    deleteAtPath(next as JsonObject, path, index + 1);
  }
};

const toJSON = (schema: Schema): void => {
  const existingTransform = schema.options.toJSON?.transform as
    | ((doc: Document, ret: JsonObject, options: unknown) => JsonObject | void)
    | undefined;

  schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
    transform(doc: Document, ret: JsonObject, options: unknown) {
      Object.keys(schema.paths).forEach((path) => {
        const schemaPath = schema.paths[path] as { options?: { private?: boolean } };
        if (schemaPath.options?.private) {
          deleteAtPath(ret, path.split("."), 0);
        }
      });

      if (ret._id) {
        ret.id = String(ret._id);
      }
      delete ret._id;
      delete ret.__v;

      if (existingTransform) {
        return existingTransform(doc, ret, options);
      }
    },
  });
};

export default toJSON;
