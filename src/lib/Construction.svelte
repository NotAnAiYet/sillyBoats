<script>
    import sign from './assets/under-construction-sign.gif'
</script>

<h1>Welcome to <span class="sillyWorker">Silly</span> Boats</h1>
<p>This site is currently under construction</p>
<img src={sign} alt="Under Construction" width="100%">
<p>Feel free to click this button!</p>
<style>
    .sillyWorker::after {
        background-image: url(./assets/construction-worker.gif);
        background-size: 80px 98px;
        position: relative;
        bottom: 20px;
        right: 79px;
        display: inline-block;
        width: 80px; 
        height: 100px;
        content:"";
    }
    .sillyWorker{
        white-space: nowrap;
        margin-right: -80px;
    }
</style>