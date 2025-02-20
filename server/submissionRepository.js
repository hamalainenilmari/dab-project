import postgres from "postgres";

const sql = postgres();

const create = async (submission,exercise_id) => {
  const result = await sql`INSERT INTO exercise_submissions (exercise_id, source_code)
    VALUES (${exercise_id}, ${submission.source_code})
    RETURNING *`;
  return result[0];
};

const readExercises = async (languageId) => {
  return await sql`SELECT id, title, description FROM exercises WHERE language_id = ${languageId};`;
};

const remove = async (id) => {
  const result = await sql`DELETE FROM exercies WHERE id = ${id} RETURNING *`;
  return result[0];
};

export { create, readExercises, remove };
