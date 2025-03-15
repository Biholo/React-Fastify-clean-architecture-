import { createServer } from "@/server";
import prisma from "@/infrastructure/database/conn";
import { logger } from "@/utils/logger";

async function main() {
  const { env } = await import("@/env");
  const server = await createServer();

  const connectionResult = await prisma.$connect();

  try {
    await server.listen({ port: env.PORT, host: '0.0.0.0' });
    logger.info(`Server is running on port ${env.PORT}`);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

main();