<script lang="ts">
  let count: number = 0
  const increment = () => {
    count += 1
  }
</script>

<button on:click={increment}>
  {count > 0 ? `you clicked me ${count} times` : "I just count"}
</button>

<style>
  button {
    margin-bottom: 10px;
  }
</style>