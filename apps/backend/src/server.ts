import { buildApp } from './app.js';
import { readServerConfig } from './shared/config/server-config.js';

const app = await buildApp();
const config = readServerConfig(process.env);

try {
  await app.listen({ host: config.host, port: config.port });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
