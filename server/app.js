import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";
import { cache } from "@hono/hono/cache";
import { Redis } from "ioredis";
import * as languageRepository from "./languageRepository.js"
import * as exerciseRepository from "./exerciseRepository.js"
import * as submissionRepository from "./submissionRepository.js"

let redis;
if (Deno.env.get("REDIS_HOST")) {
    redis = new Redis(
        Number.parseInt(Deno.env.get("REDIS_PORT")),
        Deno.env.get("REDIS_HOST"),
    );
} else {
  redis = new Redis(6379, "redis");
}


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

app.post("/api/exercises/:id/submissions", async (c) => {
    const exerciseId = c.req.param("id");
    const submissionSource = await c.req.json();
    const submission = await submissionRepository.create(submissionSource, exerciseId);
    redis.lpush("submissions", submission.id);
    return c.json(submission);
});

export default app;