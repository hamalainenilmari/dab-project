<script>
    let submitText = $state();
    let input = $state();
    let showText = $state(false);
    let numberIfs = $state(0)
    const submitForm = (e) => {
        numberIfs = input.match(/if/gi)?.length || 0; // regex
        showText = true;
        submitText = input;
        e.preventDefault();
    };
</script>
  
<textarea bind:value={input}></textarea>
<button onclick={submitForm}>Submit</button>
{#if showText} 
    <p>Characters: {submitText.length}</p>
    <p>Ifs: {numberIfs}</p>
{/if}