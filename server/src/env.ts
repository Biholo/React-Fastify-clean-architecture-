import { ONE_DAY, ONE_HOUR, ONE_MONTH } from "@/domain/constants";
import { createEnv } from "@/utils/createEnv";
import { z } from "zod";

const EnvType = {
  BOOLEAN: z.string().transform((s) => s !== "false" && s !== "0"),
  ONLY_BOOLEAN: z
    .string()
    .refine((s) => s === "true" || s === "false")
    .transform((s) => s === "true"),
  NUMBER: z.coerce.number(),
  STRING: z.string().nonempty(),
};

/* ------------------------------- definition ------------------------------- */

const envSchema = z.object({
  PORT: EnvType.NUMBER.default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: EnvType.STRING,
  ACCESS_TOKEN_SECRET: EnvType.STRING,
  ACCESS_TOKEN_EXPIRATION_IN_MS: EnvType.NUMBER.int().default(ONE_DAY),
  REFRESH_TOKEN_SECRET: EnvType.STRING,
  REFRESH_TOKEN_EXPIRATION_IN_MS: EnvType.NUMBER.int().default(ONE_MONTH),
  RESET_PASSWORD_SECRET: EnvType.STRING,
  RESET_PASSWORD_EXPIRATION_IN_MS: EnvType.NUMBER.int().default(ONE_HOUR),
  MINIO_ENDPOINT: EnvType.STRING,
  MINIO_PORT: EnvType.NUMBER,
  MINIO_ROOT_USER: EnvType.STRING,
  MINIO_ROOT_PASSWORD: EnvType.STRING,
  MINIO_USE_SSL: EnvType.BOOLEAN,
  MINIO_PUBLIC_URL: EnvType.STRING,
});


 

/* ----------------------------------- env ---------------------------------- */

export const env = createEnv(envSchema, {
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
