<script lang="ts">
    import matrix from "./assets/matrix.gif"
</script>
<img class="background" src={matrix} alt="matrix">

<style>
  img.background {
      position: absolute;
      left: 0px;
      top: 0px;
      z-index: -1;
      width: 100%;
      height: 100%;
      -webkit-filter: blur(4px); /* Safari 6.0 - 9.0 */
      filter: blur(4px);
      }
</style>