<script lang="ts">
  import { SyncLoader } from "svelte-loading-spinners";
  import { navigate } from "svelte-navigator";
  import { onMount, onDestroy } from "svelte";
  import CallContainer from "@/components/CallContainer.svelte";
  import { socket } from "@/services/socket";
  import {
    id,
    caller,
    callee,
    ready,
    setCallInformation,
    resetCall,
  } from "@/stores/call";
  import type { Call } from "@/interfaces/call";

  onMount(() => {
    if (!$id || !$caller) {
      navigate("/calls", { replace: true });
    }
    socket.on("call-joined", (call: Call) => {
      setCallInformation(call);
      socket.emit("begin-call", { id: $id });
    });
  });

  onDestroy(() => {
    socket.removeAllListeners();
  });

  const handleCallEnded = () => {
    resetCall();
    navigate("/calls");
  };
</script>

<div
  class="container is-full is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
>
  {#if !$ready}
    {#if !$callee}
      <p class="is-size-2">Waiting for someone to join</p>
    {:else}
      <p class="is-size-2">Waiting for the call to begin</p>
    {/if}
    <SyncLoader color="#23d160" />
  {/if}
  <CallContainer on:call-ended={handleCallEnded} />
</div>

<style>
  .is-full {
    width: 100vw;
    min-height: 100vh;
  }
</style>
