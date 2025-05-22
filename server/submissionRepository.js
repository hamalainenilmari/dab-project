import postgres from "postgres";

const sql = postgres();

const create = async (submission,exercise_id) => {
  const result = await sql`INSERT INTO exercise_submissions (exercise_id, source_code)
    VALUES (${exercise_id}, ${submission.source_code})
    RETURNING *`;
  return result[0];
};

const getSubmission = async (id) => {
  return await sql`SELECT grading_status, grade FROM exercise_submissions WHERE id = ${id};`;
}

const updateStatus = async (submission, status) => {
    const result = await sql`UPDATE exercise_submissions SET grading_status = ${status}
        WHERE id = ${submission.id}
        RETURNING *`;
    return result[0];
}

const gradeSubmission = async (submission, grade) => {
    const result = await sql`UPDATE exercise_submissions SET grade = ${grade}, grading_status = "graded"
        WHERE id = ${submission.id}
        RETURNING *`;
    return result[0];
}

export { create, updateStatus, gradeSubmission, getSubmission };
