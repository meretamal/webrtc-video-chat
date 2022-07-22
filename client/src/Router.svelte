<script lang="ts">
  import { Router, Route } from "svelte-navigator";
  import Home from "./pages/Home.svelte";
</script>

<Router>
  <Route path="/" component={Home} />
</Router>
