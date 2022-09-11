<script lang="ts">
  import { Router, Route } from "svelte-navigator";
  import Home from "./pages/Home.svelte";
  import CallList from "./pages/CallList.svelte";
  import Call from "./pages/Call.svelte";
</script>

<Router>
  <Route path="/" component={Home} />
  <Route path="calls" component={CallList} />
  <Route path="calls/:id" component={Call} />
</Router>
