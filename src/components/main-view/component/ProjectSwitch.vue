<template>
    <div class="projectOption">
        <div class="dishang">地上
            <div class="overChildren">
                <div class="erwei">二维</div>
                <div class="sanwei">三维</div>
            </div>
        </div>
        <div class="dixia">地下
            <div class="underChildren">
                <div class="quan">全</div>
                <div class="lan">栏</div>
                <div class="zhu">柱</div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.projectOption{
    position: absolute;
    left: 50px;
    top: 100px;
    z-index: 100;
    color:white;
}
.dishang{
    background: url('../images/资源 7upper.png') bottom no-repeat;
    width: 73px;
    height: 65px;
    line-height: 65px;
    text-align: center;
    cursor: pointer;
}
.dixia{
    background: url('../images/资源 8under.png') bottom no-repeat;
    width: 73px;
    height: 65px;
    line-height: 65px;
    text-align: center;
    cursor: pointer;
}
.overChildren .erwei{
    background: url('../images/资源 13blue hex.png') bottom no-repeat;
    width: 60px;
    height: 52px;
    display: inline-block;
    position: absolute;
    left: 61px;
    top: 37px;
    line-height: 55px;
    cursor: pointer;
}
.overChildren .sanwei{
    background: url('../images/资源 13blue hex.png') bottom no-repeat;
    width: 60px;
    height: 52px;
    display: inline-block;
    position: absolute;
    top:9px;
    left:109px;
    line-height: 55px;
    cursor: pointer;
}
.quan{
    background: url('../images/资源 12small hex.png') bottom no-repeat;
    width: 60px;
    height: 52px;
    display: inline-block;
    position: absolute;
    left: 61px;
    top: 104px;
    line-height: 55px;
    cursor: pointer;
}
.lan{
    background: url('../images/资源 12small hex.png') bottom no-repeat;
    width: 60px;
    height: 52px;
    display: inline-block;
    position: absolute;
    left: 111px;
    top: 76px;
    line-height: 55px;
    cursor: pointer;
}
.zhu{
    background: url('../images/资源 12small hex.png') bottom no-repeat;
    width: 60px;
    height: 52px;
    display: inline-block;
    position: absolute;
    left: 162px;
    top: 103px;
    line-height: 55px;
    cursor: pointer;
}
</style>
<script>
export default {
  name: 'projectSwitch'
}
</script>
