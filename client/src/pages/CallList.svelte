<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { navigate } from "svelte-navigator";
  import { username } from "@/stores/session";
  import { setCallInformation } from "@/stores/call";
  import { socket } from "@/services/socket";
  import type { Call } from "@/interfaces/call";
  import CallCard from "@/components/CallCard.svelte";

  let calls: Call[] = [];

  onMount(() => {
    if (!$username) {
      navigate("/", { replace: true });
    }

    socket.emit("request-calls");
    socket.on("calls-sent", ({ calls: previousCalls }: { calls: Call[] }) => {
      calls = previousCalls;
    });
    socket.on("call-joined", (call: Call) => {
      setCallInformation(call);
      navigate(`/calls/${call.id}`);
    });
    socket.on("call-created", (call: Call) => {
      calls = [...calls, call];
    });
    socket.on("call-filled", ({ id }) => {
      calls = calls.filter((call) => call.id !== id);
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
  {#if calls.length > 0}
    <div class="columns my-2 is-mobile is-multiline">
      {#each calls as { id, caller } (id)}
        <CallCard
          {caller}
          on:click={() => socket.emit("join-call", { id, callee: $username })}
        />
      {/each}
    </div>
  {:else}
    <p class="is-size-5">No hay llamadas disponibles</p>
  {/if}
</div>
