<script lang="ts">
  import { SyncLoader } from "svelte-loading-spinners";
  import { onMount } from "svelte";
  import { socket } from "../services/socket";
  import { callee, setCallInformation } from "../stores/call";

  let ready = false;

  onMount(() => {
    socket.on("call-joined", (call) => {
      setCallInformation(call);
    });
  });
</script>

<div
  class="container is-full is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
>
  {#if !ready}
    {#if !$callee}
      <p class="is-size-2">Waiting for someone to join</p>
    {:else}
      <p class="is-size-2">Waiting for the call to begin</p>
    {/if}
    <SyncLoader color="#23d160" />
  {/if}
</div>

<style>
  .is-full {
    width: 100vw;
    min-height: 100vh;
  }
</style>
