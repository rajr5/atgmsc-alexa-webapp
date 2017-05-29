export const serverPort = 3001;

export let env: string = 'development';

export function getEnv(): string {
  return env;
}

export function setEnv(environment: string): void {
  env = environment;
}