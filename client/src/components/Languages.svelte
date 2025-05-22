<script>
    let langs = $state([]);
    
    const fetchLanguages = async () => {
        const response = await fetch("/api/languages");
        const res = await response.json();
        //langs = (res.map(r => r.name));
        langs = res;
        console.log(langs);
    };

    fetchLanguages();

  import { useUserState } from "../states/userState.svelte.js";
  const userState = useUserState();
</script>

<h1>Available languages</h1>
	<ul>
		{#each langs as l}
			<li><a href="/languages/{l.id}">{l.name}</a></li>
		{/each}
	</ul>
