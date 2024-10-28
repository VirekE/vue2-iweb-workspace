<template>
  <el-select class="select-panel"
             v-model="result"
             @remove-tag="$emit('remove',$event)"
             @change="$emit('updateModelVal',$event)"
             :multiple="multiple"
             :popper-append-to-body="false"
             :placeholder="placeholder">
    <template v-if="!panelBox">
      <div v-if="search" class="search">
        <el-input v-model="searchValue" @input="onInput" @change="onSearch" placeholder="请输入搜索关键字"></el-input>
      </div>
      <div class="item-list">
        <el-option
                v-if="!$scopedSlots.default"
                v-for="item in list"
                :key="item[parameter.value]"
                :label="item[parameter.label]"
                :value="item[parameter.value]">
        </el-option>
        <slot v-else :row="item"></slot>
      </div>
      <el-option value="null" style="display: none"></el-option>
      <div v-if="list.length<1" class="empty">暂无数据</div>
      <div v-if="pagination" class="pagination">
        <el-pagination
                hide-on-single-page
                @current-change="onPagination"
                :current-page="page"
                :page-size="limit"
                layout="total, prev, pager, next"
                :total="total">
        </el-pagination>
      </div>
      <div v-if="$scopedSlots.footer" class="footer">
        <slot name="footer" :openPanel="openPanel"></slot>
      </div>
    </template>
    <div class="panel" v-if="panelBox">
      <el-option value="null" style="display: none"></el-option>
      <div @click="closePanel" class="back"><i class="el-icon-arrow-left"></i>返回</div>
      <slot name="panel"></slot>
    </div>
  </el-select>
</template>

<script>
  const DefaultOptions = {
    // 请求地址
    url:"",
    // 请求方式
    method:"post",
    // 请求附加参数
    data:{},
    // 请求入参是否为json格式
    requestJson: false,
    // 搜索条件key
    search:"",
    // 选项名称key
    label:"label",
    // 选项值key
    value:"value",
    // 接口分页key
    page:"page",
    // 接口分页条数key
    limit:"limit",
    // 返回结果
    rows: "rows",
    // 总条数key
    total:"records",
    // 默认初始化数组
    defaultList: null
  }
  const PINYINKEY = "__ToPinYin__"
  export default {
    name: 'selectPanel',
    data() {
      return {
        result: "", // 结果
        searchValue: "", // 搜索
        // 列表数据
        page: 1,
        limit: 7,
        total: 0,
        list: [],
        parameter: {}, // 入参
        panelBox: false, // 扩展面板
        sourceList:[] // 原列表数据
      };
    },
    model:{
      prop: "value",
      event: "updateModelVal"
    },
    props:{
      // v-model绑定值
      value:{
        type: [String,Number,Array],
        default: ""
      },
      // 多选
      multiple:{
        type: Boolean,
        default: false
      },
      // 默认显示分页
      pagination:{
        type: Boolean,
        default: true
      },
      // 默认支持搜索
      search:{
        type: Boolean,
        default: true
      },
      // 提示文字
      placeholder:{
        type: String,
        default: "请选择"
      },
      // 格式化列表数据
      formatList:{
        type: Function,
        default: ()=>{}
      },
      // 初始化是否自动调用接口
      automatic:{
        type: Boolean,
        default: true
      },
      // 配置项
      options:{
        type: Object,
        default:()=>{
          return DefaultOptions
        },
        validator: function (value) {
          if(Object.prototype.toString.call(value) !== "[object Object]"){
            console.error( "select-panel options: " + DefaultOptions)
            return false
          }
          if(value.method && value.method != "get" && value.method != "post"){
            console.error( "select-panel options.method: [ post | get ]")
            return false
          }
          if(value.requestJson!=null && typeof value.requestJson !== "boolean"){
            console.error( "select-panel options.requestJson: boolean")
            return false
          }
          return true
        }
      }
    },
    watch:{
      value(val){
        this.result = val
      }
    },
    mounted() {
      this.init(()=>{
        if(this.automatic){
          this.getList()
        }
      })
    },
    methods: {
      // 初始化
      init(done){
        this.parameter = Object.assign(DefaultOptions,this.options)
        if(this.pagination && Array.isArray(this.parameter.defaultList)){
          /**
           * 如果涉及分页，默认值使用以下格式：
           * [{label:"选项一",value:"1"}]
           * label 选项名称
           * value 选项值
           */
          this.list = this.parameter.defaultList
        }
        this.result = this.value
        this.$nextTick(()=>{
          this.list = []
          done()
        })
      },
      // 获取列表数据
      getList(){
        let parameter = this.parameter.data
        if(this.pagination){
          parameter = Object.assign({
            [this.parameter.page]: this.page,
            [this.parameter.limit]: this.limit,
            [this.parameter.search]: this.searchValue,
          },parameter)
          this.page = parameter.page
          this.limit = parameter.limit
        }
        // 写入请求结果
        const setValue = (ret)=>{
          console.log(this.parameter.rows)
          const list = JSON.parse(JSON.stringify(ret[this.parameter.rows]))
          this.formatList(list);
          this.list = list
          this.sourceList = list
          if(this.pagination){
            this.total = ret[this.parameter.total]
          }
        }
        // 校验是否已存在相同请求
        const record = window[this.parameter.method+"_"+this.parameter.url]
        if(record && record.parameter === JSON.stringify(parameter)){
          window[this.parameter.method+"_"+this.parameter.url].list.push((ret)=>{
            setValue(ret)
          })
          return
        }
        // 记录接口类型、地址与入参数据
        window[this.parameter.method+"_"+this.parameter.url] = {
          parameter: JSON.stringify(parameter),
          list: []
        }
        this["$http_"+this.parameter.method](this.parameter.url,parameter,this.parameter.requestJson).then((ret)=>{
          if(ret.state==1){
            console.log(ret)
            setValue(ret)
            // 告知其它相同请求接口返回的结果
            window[this.parameter.method+"_"+this.parameter.url].list.forEach((fun)=>{
              fun(ret)
            })
            delete window[this.parameter.method+"_"+this.parameter.url]
          }else{
            this.$message.error(ret.message)
            delete window[this.parameter.method+"_"+this.parameter.url]
          }
        }).catch((e)=>{
          this.$message.error("获取数据失败，请重试！")
          delete window[this.parameter.method+"_"+this.parameter.url]
        })
      },
      // 打开自定义面板
      openPanel(){
        this.$emit("open-panel")
        this.panelBox = true
      },
      // 关闭自定义面板
      closePanel(){
        this.$emit("close-panel")
        this.getList()
        this.panelBox = false
      },
      // 改变触发接口搜索
      onSearch(){
        if(this.parameter.search!="" && this.parameter.search!=null){
          this.getList()
        }
      },
      // 输入触发前端搜索
      onInput(val){
        if(this.parameter.search=="" || this.parameter.search==null){
          this.searchList(val)
        }else{
          this.getList()
        }
      },
      // 当前列表内数据搜索
      searchList(val){
        const sourceList = JSON.parse(JSON.stringify(this.sourceList))
        if(val==""){
          this.list = sourceList
        }else{
          let result = []
          for(let i=0,len=sourceList.length;i<len;i++){
            let label = sourceList[i][this.parameter.label]
            let pinyin = sourceList[i][PINYINKEY].toUpperCase()
            let initials = this.getInitials(sourceList[i][PINYINKEY])
            // 标签中文匹配、拼音匹配、首字母缩写匹配
            if(label.indexOf(val)!=-1 || pinyin.startsWith(val.toUpperCase()) || initials.startsWith(val.toUpperCase())){
              result.push(sourceList[i])
            }
          }
          this.list = result
        }
      },
      // 提取首字母
      getInitials(val){
        let list = val.split("")
        let res = ""
        list.forEach((key)=>{
          if(key == key.toUpperCase()){
            res += key
          }
        })
        return res
      },
      // 翻页
      onPagination(val){
        this.page = val
        this.getList()
      },
      getResult(){
        let res = []
        this.list.forEach((item)=>{
          if(this.result.indexOf(item[this.parameter.value])!=-1){
            res.push(item)
          }
        })
        return res
      }
    }
  }
</script>

<style scoped lang="less">
  .select-panel {
    :deep(.el-select-dropdown) {
      .el-select-dropdown__wrap{
        max-height: 500px;
      }
      .search{
        padding: 10px;
        margin-bottom: 10px;
        border-bottom: 1px solid #eee;
      }
      .item-list{
        max-height: 300px;
        overflow-y: auto;
      }
      .pagination{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .el-pagination{
          height: 40px;
          padding: 0 10px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .el-pager{
            line-height: normal;
          }
        }
      }
      .empty{
        color: #909399;
        padding: 10px;
        text-align: center;
      }
      .footer{
        border-top: 1px solid #eee;
        padding-top: 6px;
        .btn{
          height: 40px;
          line-height: 40px;
          padding: 0 10px;
          cursor: pointer;
          &:hover{
            color: white;
            background: var(--primary,#409eff);
          }
        }
      }
      .panel{
        .back{
          padding: 0 10px;
          cursor: pointer;
          &:hover{
            color: var(--primary,#409eff);
          }
        }
      }
    }
  }
</style>
