<script>
    import { onMount } from 'svelte';
    
    
    export let id; 
    let exes = []; 

    const fetchExercises = async () => {
        const response = await fetch(`/api/languages/${id}/exercises`);
        const res = await response.json();
        //langs = (res.map(r => r.name));
        exes = res;
        console.log(exes);
    };

    onMount(() => {
        if (id) {
            fetchExercises();
        }
    });

    //fetchExercises();
</script>

<h1>Available exercises</h1>
	<ul>
		{#each exes as e}
			<li><a href="/exercises/{e.id}">{e.title}</a></li>
		{/each}
	</ul>