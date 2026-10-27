import { spawn } from "node:child_process";
try {
  process.loadEnvFile(".env.local");
} catch {}
const args = process.argv.slice(2);
const portIndex = args.indexOf("--port");
const child = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    process.env.PREVIEW_PRODUCTION === "true" ? "start" : "dev",
    "--hostname",
    "0.0.0.0",
    "--port",
    portIndex >= 0 ? args[portIndex + 1] : "3000",
  ],
  { stdio: "inherit", env: process.env },
);
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => child.kill(sig));
child.on("exit", (code) => process.exit(code ?? 1));
