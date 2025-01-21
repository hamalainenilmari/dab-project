import postgres from "postgres";

const sql = postgres();

const create = async (language) => {
  const result = await sql`INSERT INTO languages (name)
    VALUES (${language.name})
    RETURNING *`;
  return result[0];
};

const readAll = async () => {
  return await sql`SELECT * FROM languages`;
};

const remove = async (id) => {
  const result = await sql`DELETE FROM languages WHERE id = ${id} RETURNING *`;
  return result[0];
};

export { create, readAll, remove };
