<script lang="ts">
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
  let count: number = 0
  let classes = "still"
  const doomClick = () => {
    count += 1
    classes = "run"
    delay(350).then(() => classes = "still")
  };
</script>

<div class="counterContainer">
  <button class={classes} on:click={doomClick} />
  <p>clicked {count} times</p>

</div>

<style>
  button {
    margin-bottom: 10px;
    width: 60px; 
    height: 60px;
    background-size: 60px 60px;
    border: 0;
  }

  button.still {
    background: url('./assets/doom.png');   
  }

  button.run {
    background: url('./assets/doom.gif');   
  }

  .counterContainer {
    position: relative;
  }
</style>