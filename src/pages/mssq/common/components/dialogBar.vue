<template>
	<div class="dialog" v-if="showMask">
		<div class="dialog-container">
			<div class="cancel">
				<h2>{{title}}</h2>
				<el-button type="text" class="cancelBtn" @click="closeMask">
					<i class="iconfont icon-quxiao"></i>
				</el-button>
			</div>
			<div class="content">
				<slot></slot>
			</div>
			<div class="footer">
				<el-button type="primary" @click="trueMask">确定</el-button>
				<el-button @click="closeMask">取消</el-button>
			</div>
		</div>
	</div>
</template>
<script>
	export default{
		data(){
			return{
			}
		},
		props:{
			showMask:{
				type:Boolean,
				default:false,
			},
			title:{
				type:String,
				default:''
			}
		},
		methods:{
			closeMask(){
				this.$emit('close',false);
			},
			trueMask(){

			},
		}
	}
</script>
<style lang="less" scoped>
	.dialog{
		position:fixed;
		width:100%;
		height:100%;
		background:rgba(0,0,0,0.7);
		top:0;
		left:0;
		z-index:1012;
		.dialog-container{
			min-width:50%;
			max-width:90%;
			min-height:3rem;
			background:#fff;
			position:absolute;
			top:50%;
			left:50%;
			transform: translate(-50%, -50%);
			.cancel{
				width:100%;
				height:3rem;
				border-bottom:1px solid #dcdfe6;
				position:relative;
				line-height:3rem;
				background:#f5f7fa;
				h2{
					padding-left:20px;
					font-size:16px;
				}
				.cancelBtn{
					position: absolute;
				    right: 10px;
				    top: 50%;
				    transform: translateY(-50%);
				    width: 2.5rem;
				}
				/deep/.el-button{
					padding:0;
				}
			}
			.content{
				padding:14px 20px 20px 20px;
				max-height:calc(100vh - 210px);
				overflow:auto;
			}
		}
		.footer{
			display:flex;
			justify-content:flex-end;
			padding:20px;
			.el-button{
				width: 6rem;
			}
		}
	}
</style>