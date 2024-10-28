<template>
    <div class="wscn-http404-container">
        <div class="wscn-http404">
            <div class="pic-404">
                <img src="../../../images/no-permission.png" alt="无权限" class="pic-404__parent">
            </div>
            <div class="bullshit">
                <div class="bullshit__oops">
                    OOPS!
                </div>
                <div  class="bullshit__headline">
                    此路不通......
                </div>
                <div class="bullshit__info">
                    请检查您输入的用户是否与该系统匹配，请点击以下按钮重新登录。
                </div>
                <a href="javascript:void(0)" @click="onHome" class="bullshit__return-home router-link-active">
                    重新登录
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    import base from '@_src/core/base';
    export default {
        mixins: [base],
        name:'no-permission',
        data() {
            return {

            };
        },
        computed: {
        },
        methods: {
            onHome(){
                this.logout();
            }
        },
        created() {
        }
    };
</script>
<style lang="less" scoped>
    .wscn-http404-container {
        //-webkit-transform: translate(-50%,-50%);
        //transform: translate(-50%,-50%);
        width:100%;
        height:100%;
        position: relative;
        overflow:hidden;
        display:flex;
        justify-content:center;
        align-items:center;
    }

    .wscn-http404 {
        position: relative;
        width: 900px;
        height:340px;
        padding: 0;
    }

    .wscn-http404 .pic-404 {
        position: relative;
        float: left;
        width: 600px;
        overflow: hidden
    }

    .wscn-http404 .pic-404__parent {
        width: 100%
    }

    .wscn-http404 .pic-404__child {
        position: absolute
    }

    .wscn-http404 .pic-404__child.left {
        width: 80px;
        top: 17px;
        left: 220px;
        opacity: 0;
        -webkit-animation-name: cloudLeft;
        animation-name: cloudLeft;
        -webkit-animation-duration: 2s;
        animation-duration: 2s;
        -webkit-animation-timing-function: linear;
        animation-timing-function: linear;
        -webkit-animation-fill-mode: forwards;
        animation-fill-mode: forwards;
        -webkit-animation-delay: 1s;
        animation-delay: 1s
    }

    .wscn-http404 .pic-404__child.mid {
        width: 46px;
        top: 10px;
        left: 420px;
        opacity: 0;
        -webkit-animation-name: cloudMid;
        animation-name: cloudMid;
        -webkit-animation-duration: 2s;
        animation-duration: 2s;
        -webkit-animation-timing-function: linear;
        animation-timing-function: linear;
        -webkit-animation-fill-mode: forwards;
        animation-fill-mode: forwards;
        -webkit-animation-delay: 1.2s;
        animation-delay: 1.2s
    }

    .wscn-http404 .pic-404__child.right {
        width: 62px;
        top: 100px;
        left: 500px;
        opacity: 0;
        -webkit-animation-name: cloudRight;
        animation-name: cloudRight;
        -webkit-animation-duration: 2s;
        animation-duration: 2s;
        -webkit-animation-timing-function: linear;
        animation-timing-function: linear;
        -webkit-animation-fill-mode: forwards;
        animation-fill-mode: forwards;
        -webkit-animation-delay: 1s;
        animation-delay: 1s
    }

    @-webkit-keyframes cloudLeft {
        0% {
            top: 17px;
            left: 220px;
            opacity: 0
        }

        20% {
            top: 33px;
            left: 188px;
            opacity: 1
        }

        80% {
            top: 81px;
            left: 92px;
            opacity: 1
        }

        to {
            top: 97px;
            left: 60px;
            opacity: 0
        }
    }

    @keyframes cloudLeft {
        0% {
            top: 17px;
            left: 220px;
            opacity: 0
        }

        20% {
            top: 33px;
            left: 188px;
            opacity: 1
        }

        80% {
            top: 81px;
            left: 92px;
            opacity: 1
        }

        to {
            top: 97px;
            left: 60px;
            opacity: 0
        }
    }

    @-webkit-keyframes cloudMid {
        0% {
            top: 10px;
            left: 420px;
            opacity: 0
        }

        20% {
            top: 40px;
            left: 360px;
            opacity: 1
        }

        70% {
            top: 130px;
            left: 180px;
            opacity: 1
        }

        to {
            top: 160px;
            left: 120px;
            opacity: 0
        }
    }

    @keyframes cloudMid {
        0% {
            top: 10px;
            left: 420px;
            opacity: 0
        }

        20% {
            top: 40px;
            left: 360px;
            opacity: 1
        }

        70% {
            top: 130px;
            left: 180px;
            opacity: 1
        }

        to {
            top: 160px;
            left: 120px;
            opacity: 0
        }
    }

    @-webkit-keyframes cloudRight {
        0% {
            top: 100px;
            left: 500px;
            opacity: 0
        }

        20% {
            top: 120px;
            left: 460px;
            opacity: 1
        }

        80% {
            top: 180px;
            left: 340px;
            opacity: 1
        }

        to {
            top: 200px;
            left: 300px;
            opacity: 0
        }
    }

    @keyframes cloudRight {
        0% {
            top: 100px;
            left: 500px;
            opacity: 0
        }

        20% {
            top: 120px;
            left: 460px;
            opacity: 1
        }

        80% {
            top: 180px;
            left: 340px;
            opacity: 1
        }

        to {
            top: 200px;
            left: 300px;
            opacity: 0
        }
    }

    .wscn-http404 .bullshit {
        position: relative;
        float: left;
        width: 300px;
        padding: 30px 0;
        overflow: hidden
    }

    .wscn-http404 .bullshit__oops {
        font-size: 32px;
        line-height: 40px;
        color: #1482f0;
        margin-bottom: 20px;
        -webkit-animation-fill-mode: forwards;
        animation-fill-mode: forwards
    }

    .wscn-http404 .bullshit__headline,.wscn-http404 .bullshit__oops {
        font-weight: 700;
        opacity: 0;
        -webkit-animation-name: slideUp;
        animation-name: slideUp;
        -webkit-animation-duration: .5s;
        animation-duration: .5s
    }

    .wscn-http404 .bullshit__headline {
        font-size: 20px;
        line-height: 24px;
        color: #222;
        margin-bottom: 10px;
        -webkit-animation-delay: .1s;
        animation-delay: .1s;
        -webkit-animation-fill-mode: forwards;
        animation-fill-mode: forwards
    }

    .wscn-http404 .bullshit__info {
        font-size: 13px;
        line-height: 21px;
        color: grey;
        margin-bottom: 30px;
        -webkit-animation-delay: .2s;
        animation-delay: .2s;
        -webkit-animation-fill-mode: forwards;
        animation-fill-mode: forwards
    }

    .wscn-http404 .bullshit__info,.wscn-http404 .bullshit__return-home {
        opacity: 0;
        -webkit-animation-name: slideUp;
        animation-name: slideUp;
        -webkit-animation-duration: .5s;
        animation-duration: .5s
    }

    .wscn-http404 .bullshit__return-home {
        display: block;
        float: left;
        width: 110px;
        height: 36px;
        background: #1482f0;
        border-radius: 100px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        line-height: 36px;
        cursor: pointer;
        -webkit-animation-delay: .3s;
        animation-delay: .3s;
        -webkit-animation-fill-mode: forwards;
        animation-fill-mode: forwards
    }

    @-webkit-keyframes slideUp {
        0% {
            -webkit-transform: translateY(60px);
            transform: translateY(60px);
            opacity: 0
        }

        to {
            -webkit-transform: translateY(0);
            transform: translateY(0);
            opacity: 1
        }
    }

    @keyframes slideUp {
        0% {
            -webkit-transform: translateY(60px);
            transform: translateY(60px);
            opacity: 0
        }

        to {
            -webkit-transform: translateY(0);
            transform: translateY(0);
            opacity: 1
        }
    }
</style>