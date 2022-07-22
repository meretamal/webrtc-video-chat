<script>
  import { username } from "../stores/session";
</script>

<div class="container my-5">
  <h3 class="is-size-4 has-text-grey">{$username}</h3>
  <div class="is-flex is-justify-content-space-between is-align-items-flex-end">
    <h2 class="is-size-1">Llamadas</h2>
    <button class="button is-success"> Crear llamada </button>
  </div>
</div>
