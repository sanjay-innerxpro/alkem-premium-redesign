// Next.js calls register() once when the server starts: apply pending data migrations.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { runDataMigrations } = await import("./lib/catalogue");
  await runDataMigrations();
}
