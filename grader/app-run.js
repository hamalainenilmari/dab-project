import app from "./app.js";

Deno.serve({port:8001}, app.fetch);