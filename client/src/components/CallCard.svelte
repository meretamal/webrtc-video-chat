<script lang="ts">
  export let caller: string;
</script>

<div class="column is-12-mobile is-4-tablet is-3-desktop">
  <div class="card">
    <div class="card-content">
      <p class="title is-4">{caller}</p>
      <button class="button is-success mt-2" on:click>Join</button>
    </div>
  </div>
</div>
