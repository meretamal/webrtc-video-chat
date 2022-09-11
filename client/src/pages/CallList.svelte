<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { navigate } from "svelte-navigator";
  import { username } from "../stores/session";
  import { setCallInformation } from "../stores/call";
  import { socket } from "../services/socket";
  import type { Call } from "../interfaces/call";

  onMount(() => {
    if (!$username) {
      navigate("/", { replace: true });
    }

    socket.on("call-joined", (call: Call) => {
      setCallInformation(call);
      navigate(`/calls/${call.id}`);
    });
  });

  onDestroy(() => {
    socket.removeAllListeners();
  });
</script>

<div class="container my-5">
  <h3 class="is-size-4 has-text-grey">{$username}</h3>
  <div class="is-flex is-justify-content-space-between is-align-items-flex-end">
    <h2 class="is-size-1">Calls</h2>
    <button
      class="button is-success"
      on:click={() => socket.emit("create-call", { username: $username })}
    >
      Start a new call
    </button>
  </div>
</div>
