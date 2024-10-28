<template>
  <div class="search-form"
       :class="['padding-top-15',dynamicTags.length>0&&!isSearch?'margin-bottom-10':'']">
    <!-- 选中标签 -->
    <div class="form-option" v-if="dynamicTags.length>0" :class="!isSearch?'margin-top-15':''">
      <div class="border-split">
        <span class="form-option-label" >筛选结果</span><!--:style="{'width':labelWidth}"-->
        <div class="form-option-content">
          <div class="form-option-tag" v-for="(item,index) in dynamicTags">
            <span>{{ item.name }}:</span>
            <p>{{ item.value }}</p>
            <i class="el-icon-error" @click="deleteTag(item,index)"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- 搜索表单 -->
    <el-form ref="searchformData" :model="searchformData" ><!--:label-width="labelWidth"-->
      <el-row style="display: flex; align-items: center; flex-wrap:wrap">
        <el-col :span="item.span" v-for="(item,key,index) in fieldData" :key="index" v-if="searchformData[key]">
          <el-form-item :label="item.label" :prop="key" :class="item.type" :label-width="item.itemWidth || labelWidth">
            <el-input v-model="searchformData[key].value" v-if="item.type==='Input'" size="small"
                      :placeholder="item.placeholder" :style="item.width?'width:'+item.width:'width:100%'"></el-input>
            <el-select filterable v-model="searchformData[key].value" @change="selectSearch" size="small"
                       :placeholder="item.placeholder" :multiple="item.multiple" v-else-if="item.type==='Select'"
                       :style="item.width?'width:'+item.width:'width:100%'">
              <el-option :label="items.name" :value="items.id" :key="index" :disabled="items.disabled"
                         v-for="(items,index) in item.selectList"></el-option>
            </el-select>
            <el-date-picker :type="item.types" @change="search" size="small"
                            :value-format="item.valueFormat" :placeholder="item.placeholder"
                            v-model="searchformData[key].value" :style="item.width?'width:'+item.width:'width:100%'"
                            v-else-if="item.type==='DatePicker'" range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"></el-date-picker>
            <el-input type="textarea" size="small" v-model="searchformData[key].value" :autosize="item.autosize" show-word-limit
                      v-else-if="item.type==='Textarea'"></el-input>
            <el-input size="small" v-model="searchformData[key].value" readonly
                      :style="item.width?'width:'+item.width:'width:100%'" @input.native="search"
                      v-else-if="item.type==='inputSelect'">
              <el-button slot="append" class="iconfont icon-caidan"
                         @click="chooseClick"></el-button>
            </el-input>
            <select-system class="w100" @change="searchformData[key].valueName = $event.name;search()" v-else-if="item.type=='SelectSystem'" v-model="searchformData[key].value"></select-system>

              <div v-else-if="item.type==='Button'" :class="item.span===24?'searchButton':'search-btn'" >
                <el-button type="primary" size="small" @click="resetForm('searchformData')" plain>重置</el-button>
                <el-button type="primary" size="small" @click="search(searchformData)">搜索</el-button>
                <slot name="footer"></slot>
              </div>
            <slot :row="item"></slot>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dynamicTags: [],
        searchformData: {},
        dynamicTagsArray: []
      }
    },
    props: {
      isSearch: {
        type: Boolean,
        default: false
      },
      fieldData: {
        type: Object,
        default: () => {
        }
      },
      labelWidth: {
        type: String,
        default: '100px'
      }
    },
    watch: {
      fieldData: {
        handler(val) {
          for (let i in val) {
            if(val[i].value && val[i].type == 'inputSelect'){
              this.search();
            }

          }
          this.init()
          this.generateTag();
        },
        deep: true,
        immediate: true
      }
    },
    mounted() {

    },
    computed: {},
    methods: {
      // 初始化
      init() {
        let obj = {};
        function getValue() {
          const dataList = arguments;
          for (let i = 0; i < dataList.length; i++) {
            if (dataList[i] != '' && dataList[i] != null && dataList[i] != undefined) {
              return dataList[i]
            }
          }
          return '';
        }
        for (let key in this.fieldData) {
          let temp = Object.assign({},this.searchformData[key],{
            label: this.fieldData[key].label,
            type: this.fieldData[key].type,//类型
            placeholder: this.fieldData[key].placeholder,
            value: getValue((this.searchformData[key] && this.searchformData[key].value), this.fieldData[key].value),
            span: this.fieldData[key].span,//布局比例
            multiple: this.fieldData[key].multiple,//是否多选
            selectList: this.fieldData[key].selectList || [],
          })
          //初始化后就将默认值清空
          this.fieldData[key].value = ""
          Object.assign(obj, {[key]: temp})
        }
        this.searchformData = obj;
      },
      // 重置
      resetForm(formName) {
        this.dynamicTags = [];
        this.$refs[formName].resetFields();
        for (let key in this.searchformData) {
          this.searchformData[key].value = '';
          delete this.searchformData[key].valueName;
        }
        this.$emit('searchClick', this.searchformData,'reload');
      },
      selectSearch(){
        this.$emit('selectClick', this.searchformData)
        this.search();
      },
      // 搜索
      search() {
        this.init()
        this.generateTag()
        this.$emit('searchClick', this.searchformData)
      },
      // 生成标签
      generateTag(){
        this.dynamicTags = [];
        let formData = this.searchformData
        let value = {}
        // 获取填写值组装对象
        for(let key in this.searchformData){
          value[key] = this.searchformData[key].valueName || this.searchformData[key].value
        }
        // 组装标签
        for(let key in formData){
          let item = formData[key]
          let type = formData[key].type
          if(value[key] == "" || value[key] == null){continue}
          if(type == "Select" || type == 'inputSelect'){
            // 下拉框
            value[key] = Array.isArray(value[key])?value[key]:[value[key]]

            let temp = [];
            for(let i =0;i<item.selectList.length;i++){
              if(value[key].indexOf(item.selectList[i].id)!=-1 || value[key].indexOf(item.selectList[i].code)!=-1){

                temp.push(item.selectList[i].name)
              }
            }
            if(key != 'deptName'){
              this.dynamicTags.push({
                'name': item.label,
                'key': key,
               'value': temp.join(",")
              });
            }
          }else{
            // 其它
            this.dynamicTags.push({
              'name': item.label,
              'key': key,
              'value': value[key]
            });
          }
        }
      },
      // 删除标签
      deleteTag(item, index) {
        // 删除填写数据
        for (let key in this.searchformData) {
          if (item.key == key) {
            this.searchformData[key].value = "";
            if(key == 'deptId' && this.searchformData['deptName']){
              this.searchformData['deptName'].value = '';
            }
            this.$emit('searchClick', this.searchformData)
            break
          }
        }
        this.dynamicTags.splice(index, 1);
      },
      chooseClick(){
        this.$emit('chooseDept')
      },
      update(key,value,isSearch){
        this.searchformData[key].value = value;
        this.generateTag();
        if(isSearch){//判断是否掉搜索方法
          this.search();
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  .search-form {
    padding: 0px 15px 15px 0px;
    // 选中标签
    .form-option {
      background: #fff;

      & > div {
        padding-bottom: 5px;

        .form-option-label {
          padding: 0 12px 0 0;
          font-size: 14px;
          text-align: right;
          vertical-align: middle;
          color: #606266;
          line-height: 35px;
          display: inline-block;
        }

        .form-option-content {
          display: flex;
          flex: 1;
          flex-wrap: wrap;
          .form-option-tag {
            display: flex;
            align-items: center;
            height: 25px;
            padding: 2px 8px;
            /*margin-right: 6px;*/
            margin: 5px;
            background: #eff7ff;
            cursor: pointer;

            span {
              font-size: 14px;
            }

            p {
              color: #409eff;
              margin: 0 6px;
              font-size: 14px;
            }

            i {
              color: #409eff;
              font-size: 18px;
            }
          }
        }
      }

    }

    .border-split {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dashed #ebeef5;
    }

    // 搜索表单
    .el-form {
      padding-top: 10px;
      background: #fff;

      .search-btn {
        display: flex;
        align-items:center;
        justify-content:flex-end;
        :deep(.el-button) {
          /*padding: 12px 34px;*/
        }
      }
      .inputSelect{
        :deep(.el-form-item__content){
          display: flex;
          height: 40px;
          align-items: center;
        }
      }
      .el-form-item {
        margin-bottom: 0 !important;
        :deep(.el-form-item__content) {
          padding-right: 10px;
        }
      }
      :deep .el-col-24 {
        .el-form-item__content {
          margin-left: 0 !important;
        }
      }
      :deep .el-col-12 {
        .el-form-item__content {
          margin-left: 0 !important;
        }
      }
    }
  }
  .searchButton{
    display: flex;
    justify-content: center;
    align-items:center;
  }

</style>