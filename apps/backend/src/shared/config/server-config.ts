export type ServerConfig = {
  host: string;
  port: number;
};

export function readServerConfig(env: NodeJS.ProcessEnv): ServerConfig {
  return {
    host: env.HOST ?? '127.0.0.1',
    port: readPort(env.PORT),
  };
}

function readPort(value: string | undefined): number {
  if (value === undefined || value === '') {
    return 3000;
  }

  const port = Number.parseInt(value, 10);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT value: ${value}`);
  }

  return port;
}
