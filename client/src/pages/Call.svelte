<script lang="ts">
  import { SyncLoader } from "svelte-loading-spinners";
  import { navigate } from "svelte-navigator";
  import { onMount } from "svelte";
  import CallContainer from "../components/CallContainer.svelte";
  import { socket } from "../services/socket";
  import { id, callee, ready, setCallInformation } from "../stores/call";

  onMount(() => {
    socket.on("call-joined", (call) => {
      setCallInformation(call);
      socket.emit("begin-call", { id: $id });
    });
  });
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
  <CallContainer on:call-ended={() => navigate("/calls")} />
</div>

<style>
  .is-full {
    width: 100vw;
    min-height: 100vh;
  }
</style>
