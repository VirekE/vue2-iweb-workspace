<template>
	<div class="no-data">
		<img :src="src" class="imgClass" alt="">
		<p>{{hText}}</p>
		<span>{{text}}</span>
		<slot></slot>
	</div>
</template>

<script>
	export default {
	  props:{
		  hText:{
			  type:String,
			  default:''
		  },
		  text:{
			  type:String,
			  default:''
		  }
	  },
		computed: {
			src(){
				return require('../../../../../static/img/no-data.svg')
			}
		},
	}
</script>

<style lang="less" scoped>
	.no-data{
		height:100%;
		flex-direction: column;
		display: flex;
		justify-content: center;
		align-items: center;
		.imgClass{
			height:138px;
		}
		p{
			font-size:18px;
			color:#060F2A;
			margin:30px 0 10px 0;
		}
		span{
			font-size:14px;
			color:#060F2A;
			opacity:0.7;
		}
	}
</style>