<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import { username } from "../stores/session";

  onMount(() => {
    if (!$username) {
      navigate("/", { replace: true });
    }
  });
</script>

<div class="container my-5">
  <h3 class="is-size-4 has-text-grey">{$username}</h3>
  <div class="is-flex is-justify-content-space-between is-align-items-flex-end">
    <h2 class="is-size-1">Calls</h2>
    <button class="button is-success">Start a new call</button>
  </div>
</div>
