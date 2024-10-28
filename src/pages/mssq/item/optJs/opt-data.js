const defaultOpt = {
	name:"默认",
	optData:[
        {
			name:'返回',
			method:'goBack',
			icon:'icon-fanhui',
			type:'primary'
		}
	]
}
const editItem = {
	name:"新增事项",
	code:"editItem",
	optData:[
        {
			name:'返回',
			method:'goBack',
			icon:'icon-fanhui',
			type:'primary'
		},
		{
			name:'保存',
			method:'save',
			icon:'icon-xiazai',
			type:'warning'
		},
		{
			name:'提交',
			method:'submit',
			icon:'icon-shangchuan-tianchong',
			type:'success'
		},

	]
}
const overAllEditItem = {
	name:"新增事项",
	code:"editItem",
	optData:[
        {
			name:'返回',
			method:'goBack',
			icon:'icon-fanhui',
			type:'primary'
		},
		{
			name:'提交',
			method:'submit',
			icon:'icon-shangchuan-tianchong',
			type:'success'
		},

	]
}
const editPro = {
	name:"新增事项",
	code:"editPro",
	optData:[
        {
			name:'返回',
			method:'goBack',
			icon:'icon-fanhui',
			type:'primary'
		},
		{
			name:'保存',
			method:'save',
			icon:'icon-xiazai',
			type:'warning'
		},
		{
			name:'提交',
			method:'submit',
			icon:'icon-shangchuan-tianchong',
			type:'success'
		},

	]
}
const editItemStatistical = {
	name:"新增事项",
	code:"editItemStatistical",
	optData:[
        {
			name:'取消',
			method:'goBack',
			icon:'icon-fanhui',
			type:'primary'
		},
		{
			name:'保存',
			method:'save',
			icon:'icon-xiazai',
			type:'warning'
		}]
}
const examine = {
	name:"预审",
	code:"examineWait",
	optData:[
        {
			name:'返回',
			method:'goBack',
			icon:'icon-fanhui',
			type:'primary'
		},
		{
			name:'预审通过',
			method:'agree',
			icon:'icon-xiazai',
			type:'success'
		},
		{
			name:'预审不通过',
			method:'disAgree',
			icon:'icon-shangchuan-tianchong',
			type:'warning'
		},

	]
}
const accept = {
	name:"初审",
	code:"",
	optData:[
        {
			name:'返回',
			method:'goBack',
			icon:'icon-fanhui',
			type:'primary'
		},
		{
			name:'审核通过',
			method:'agree',
			icon:'icon-shangchuan-tianchong',
			type:'success'
		},
		{
			name:'审核不通过',
			method:'disAgree',
			icon:'icon-xiazai',
			type:'warning'
		},

	]
}
const overAll = {
	name:"初审",
	code:"",
	optData:[
        {
			name:'返回',
			method:'goBack',
			icon:'icon-fanhui',
			type:'primary'
		},
		{
			name:'统筹通过',
			method:'agree',
			icon:'icon-shangchuan-tianchong',
			type:'success'
		},
		{
			name:'统筹不通过',
			method:'disAgree',
			icon:'icon-xiazai',
			type:'warning'
		},

	]
}
export default {
    defaultOpt: defaultOpt,
    editItem: editItem,
    editPro: editPro,
    examine: examine,
    accept: accept,
	editItemStatistical: editItemStatistical,
	overAll: overAll,
	overAllEditItem: overAllEditItem,
}
