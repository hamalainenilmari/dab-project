import postgres from "postgres";

const sql = postgres();

const create = async (exercise) => {
  const result = await sql`INSERT INTO exercises (title, description, language_id)
    VALUES (${exercise.title}, ${exercise.description}, ${exercise.language_id})
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
