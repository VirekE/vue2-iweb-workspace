const defaultOpt = {
	name:"默认",
    optData:[
        {
			name:'返回',
			popover:false,
			method:'goBack',
			icon:'icon-fanhui',
			type:'primary'
		}
	]
}
const newCatalog = {
	name:"新增目录",
	code:"newCatalog",
    optData:[
        {
			name:'返回',
			method:'goBack',
			popover:false,
			icon:'icon-fanhui',
			content:[],
			type:'primary'
		},
		{
			name:'保存',
			popover:true,
			method:'save',
			icon:'icon-xiazai',
			content:['1、点击“保存”，保存成功，则提示“保存成功”;',
			'2、点击“保存”，保存失败，则提示“保存失败”;'],
			type:'warning'
		},
		{
			name:'提交',
			method:'submit',
			content:['1、点击“提交”，跳转至目录主项信息提交页，填写提交办理意见。'],
			popover:true,
			icon:'icon-shangchuan-tianchong',
			type:'success'
		}
		
	]
}
const accept = {
	name:"初审",
	code:"",
	optData:[
        {
			popover:false,
			name:'返回',
			method:'goBack',
			icon:'icon-fanhui',
			type:'primary'
		},
		{
			name: '审核通过',
			popover:false,
			method:'agree',
			icon:'icon-shangchuan-tianchong',
			type:'success'
		},
		{
			name:'审核不通过',
			popover:false,
			method:'disAgree',
			icon:'icon-xiazai',
			type:'warning'
		}
		
	]
};
const preExamina = {
	name:"初审",
	code:"",
	optData:[
        {
			popover:false,
			name:'返回',
			method:'goBack',
			icon:'icon-fanhui',
			type:'primary'
		},
		{
			name: '预审通过',
			popover:false,
			method:'agree',
			icon:'icon-shangchuan-tianchong',
			type:'success'
		},
		{
			name:'预审不通过',
			popover:false,
			method:'disAgree',
			icon:'icon-xiazai',
			type:'warning'
		}

	]
}

export default {
    defaultOpt: defaultOpt,
    newCatalog: newCatalog,
    accept: accept,
		preExamina:preExamina
}