<script lang="ts">
    import sign from './assets/under-construction-sign.gif'
</script>

<h1>Welcome to <span class="sillyWorker">Silly</span> Boats</h1>
<p>This site is currently under construction. </p>
<img src={sign} alt="Under Construction">
<p>Feel free to click this button!</p>

<style>
    img {
        padding: 1rem 0px
    }

    .sillyWorker::after {
        background-image: url(./assets/construction-worker.gif);
        background-size: 60px 80px;
        position: relative;
        bottom: 22px;
        right: 67px;
        display: inline-block;
        width: 60px; 
        height: 80px;
        content:"";
    }
    .sillyWorker{
        white-space: nowrap;
        margin-right: -60px;
    }
</style>