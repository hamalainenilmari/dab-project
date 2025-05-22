<script>
    import { useUserState } from "../states/userState.svelte.js";
    const userState = useUserState();

    export let id;
    let ex;
    
    let submitText;
    let input = "";
    let gradingStatus;
    let grade;
    let checkGrade = false;
    let subId;

    const fetchExercise = async () => {
        const response = await fetch(`/api/exercises/${id}`);
        const res = await response.json();
        ex = res;
    };

    fetchExercise();
    
    const submitForm =  async (e) => {
        submitText = input;
        const response = await fetch(`/api/exercises/${id}/submissions`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({"source_code": submitText})
        });

        const result = await response.json();
        subId = result.id;
        checkGrade = true;
        console.log(result)
        e.preventDefault();
    };

    const pollGrading = async () => {
        const response = await fetch(`/api/submissions/${subId}/status`);
        const grading = await response.json();
        gradingStatus = grading.grading_status;
        grade = grading.grade;
        console.log("grading: ", grading)
        if (grading.grading_status == "graded") {
            checkGrade = false;
        }
    };

    const interval = setInterval(() => {
        if (checkGrade) {
            pollGrading();
        }
    }, 500);
    

</script>

{#if ex}
    <h1>{ex.title}</h1>
    <p>{ex.description}</p>
{/if}

{#if userState.email}
    <textarea bind:value={input}></textarea>
    <button on:click={submitForm}>Submit</button>

    <p>Grading status: {gradingStatus}</p>
    <p>Grade: {grade}</p>
{:else}
    <p>Login or register to complete exercises.</p>
{/if}