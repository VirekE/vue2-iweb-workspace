<template>
    <div class="tag" :style="{background:bgColor,color: fontColor(bgColor)}">
        {{content}}
    </div>
</template>

<script>
    export default {
        name: "tag",
        props:{
            content:{
                type:String,
                default:'',
            },
            bgColor:{
                type:String,
                default:'',
            }
        },
        computed:{
            fontColor(){
                return function (color) {
                    return this.colorRgb(color)
                }
            }
        },
        methods:{
            colorRgb(color) {
                if(!color){return ""}
                let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-F]{6})$/;
                let arr = [];
                let sColor = color.toLowerCase();
                if (sColor && reg.test(sColor)) {
                    if (sColor.length === 4) {
                        let sColorNew = "#";
                        for (let i = 1; i < 4; i += 1) {
                            sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                        }
                        sColor = sColorNew;
                    }
                    //处理六位的颜色值
                    for (let i = 1; i < 7; i += 2) {
                        arr.push(parseInt("0x" + sColor.slice(i, i + 2)));
                    }
                } else {
                    let str =  sColor.slice(sColor.indexOf('(') +1,sColor.indexOf(')'));
                    arr = str.split(',');
                }
                let num = arr[0]*0.299+arr[1]*0.587+arr[2]*0.114;
                if(num >= 170){
                    return "#000"
                }
                return '#fff';
            }
        }
    }
</script>

<style scoped>
.tag{
    background: #eef6f5;
    width: 100px;
    display: flex;
    margin: auto;
    height: 40px;
    justify-content: center;
    border-radius: 30px;
    align-items: center;
    /*color: #fff;*/
}
</style>