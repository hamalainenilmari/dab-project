import postgres from "postgres";

const sql = postgres();

const create = async (submission,exercise_id) => {
  const result = await sql`INSERT INTO exercise_submissions (exercise_id, source_code)
    VALUES (${exercise_id}, ${submission.source})
    RETURNING *`;
  return result[0];
};

const updateStatus = async (submissionId, status) => {
    const result = await sql`UPDATE exercise_submissions SET grading_status = ${status}
        WHERE id = ${submissionId}
        RETURNING *`;
    return result[0];
}

const gradeSubmission = async (submissionId, grade) => {
    const graded = "graded";
    const result = await sql`UPDATE exercise_submissions SET grade = ${grade}, grading_status = ${graded}
        WHERE id = ${submissionId}
        RETURNING *`;
    return result[0];
}

const getSolution = async (id) => {
  return await sql`SELECT solution_code FROM exercises WHERE id = ${id};`;
}


export { create, updateStatus, gradeSubmission, getSolution };
