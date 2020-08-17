<template>
    <div>
        <div class="panelBg">
            <div></div>
        </div>
    </div>
</template>
<script>
export default {
    name:'controlPanel'
}
</script>
<style scoped>
.panelBg{
    background:url('../images/viewtreeBg.png') no-repeat;
    background-size: 100% 296px;
    width: calc(100% - 10px);
    height:296px;
    position:absolute;
    bottom: 10px;
    z-index: 100;
    left: 5px;
}
</style>