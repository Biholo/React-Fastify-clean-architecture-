import { z } from "zod";

type EnvOptions = {
  emptyStringAsUndefined?: boolean;
  skipValidation?: boolean;
};

export function createEnv<TSchema extends z.AnyZodObject>(
  schema: TSchema,
  opts: EnvOptions = {}
): z.infer<TSchema> {
  const runtimeEnv = process.env;

  if (opts.emptyStringAsUndefined) {
    for (const [key, value] of Object.entries(runtimeEnv)) {
      if (value === "") {
        delete runtimeEnv[key];
      }
    }
  }

  if (opts.skipValidation) {
    return runtimeEnv as any;
  }

  const result = schema.safeParse(runtimeEnv);

  if (!result.success) {
    throw new Error(`Invalid env: ${result.error.errors}`);
  }

  return result.data;
}
