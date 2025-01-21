import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";
import { cache } from "@hono/hono/cache";
import * as languageRepository from "./languageRepository.js"
import * as exerciseRepository from "./exerciseRepository.js"


const app = new Hono();

app.use("/*", cors());
app.use("/*", logger());

app.get("/", (c) => c.json({ message: "Hello world!" }));

app.get("/api/languages", 
    cache({
        cacheName: "languages-cache",
        wait: true,
      }),
);

app.get("/api/languages", async (c) => {
    return c.json(await languageRepository.readAll());
});

app.post("/api/languages", async (c) => {
    const language = await c.req.json();
    return c.json(await languageRepository.create(language));
});

app.get("/api/languages/:id/exercises", 
    cache({
        cacheName: "language-exercises-cache",
        wait: true,
      }),
);

app.get("/api/languages/:id/exercises", async (c) => {
    const languageId = c.req.param("id");
    return c.json(await exerciseRepository.readExercises(languageId));
});

app.post("/api/languages/:id/exercises", async (c) => {
    const exercise = await c.req.json();
    return c.json(await exerciseRepository.create(exercise));
});

export default app;