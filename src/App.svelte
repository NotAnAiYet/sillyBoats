<script lang="ts">
    import Background from './lib/Background.svelte';
    import Construction from './lib/Construction.svelte';
    import Counter from './lib/Counter.svelte';
    import Header from './lib/Header.svelte';
</script>

<header>
  <Header />
</header>
<main>
  <div class="background">
  <Background />
  <Construction />
  <Counter />
</div>
</main>