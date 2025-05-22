<script>
  import { useUserState } from "../states/userState.svelte.js";
  const userState = useUserState();
</script>


{#if userState.email}
  <p>{userState.email}</p>
{:else}
    <a href="auth/login">login</a>
    <a href="auth/register">Register</a>
{/if}
