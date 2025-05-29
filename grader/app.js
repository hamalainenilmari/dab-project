import { Redis } from "ioredis";
import { Hono } from "@hono/hono";
import * as submissionRepository from "./submissionRepository.js"
import { levenshteinDistance } from "./grader-utils.js";

const app = new Hono();

let redis;
if (Deno.env.get("REDIS_HOST")) {
  redis = new Redis(
    Number.parseInt(Deno.env.get("REDIS_PORT")),
    Deno.env.get("REDIS_HOST"),
  );
} else {
  redis = new Redis(6379, "redis");
}

const QUEUE_NAME = "submissions";
let CONSUME_ENABLED = false;

function sleep(ms) {
    console.log("sleeping")
    return new Promise(resolve => setTimeout(resolve, ms));
}

const consume = async () => {
  console.log(`consume enabled: ${CONSUME_ENABLED}`)
  while (CONSUME_ENABLED) {
    const len = await redis.llen("submissions");
    if (len > 0) {
        const result = await redis.brpop(QUEUE_NAME, 0);
        if (result) {
            const [queue, raw_submission] = result;
            const submission = JSON.parse(raw_submission);
            await submissionRepository.updateStatus(submission.id, "processing");
            sleep(Math.random() * (2000) + 1000)

            console.log("submission: ", submission);
            const solution = await submissionRepository.getSolution(submission.exercise_id);
            const solutionCode = solution[0].solution_code;
            console.log("solution:", solution);
            console.log("submission in grader: ", submission, submission.id, submission.source_code);
            const grade = Math.ceil(100 * (1 - (levenshteinDistance(submission.source_code, solutionCode) / Math.max(submission.source_code.length, solutionCode.length))))
            await submissionRepository.gradeSubmission(submission.id, grade)
        }
    } else {
        await sleep(250);
    }
  }
};

app.get("/api/status", async (c) => {
    const queueSize = await redis.llen("submissions");
    return c.json({"queue_size": queueSize, "consume_enabled": CONSUME_ENABLED});
})

app.post("/api/consume/enable", (c) => {
    CONSUME_ENABLED = true;
    consume();
    return c.json({"consume_enabled": true});
})

app.post("/api/consume/disable", (c) => {
    CONSUME_ENABLED = false;
    return c.json({"consume_enabled": false});
})

export default app;