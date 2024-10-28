import QzFrame from './common/components/frame/qz-frame'
//目录页面
const CatalogList = () => import('./catalog/list.vue');
const catalogLibrary = () => import('./catalog/catalogLibrary.vue');
const CatalogRegister = () => import('./catalog/register.vue');
const CatalogEdit = () => import('./catalog/edit.vue');
const CatalogDisuse = () => import('./catalog/disuse.vue');
const MajorEdit = () => import('./catalog/major-edit.vue');
const MinorEdit = () => import('./catalog/minor-edit.vue');
const distribution = () => import('./catalog/distribution.vue');
const catalogOverAll = () => import('./catalog/overAll.vue');
const issue = () => import('./catalog/issue.vue');

//表单页面
const NewFormManage = () => import('./bdgl/manage/newForm-manage.vue');
const associaItem = () => import('./bdgl/associaItem.vue');
//事项页面
const ItemList = () => import('./item/list.vue');
const ItemInfo = () => import('./item/info.vue');
const Item_Info = () => import('./item/components/info/item-info.vue');
const ItemSearch = () => import('./item/search.vue');
const tagList = () => import('./item/tag/list.vue');
const associationItem = () => import('./item/tag/associationItem/list.vue');
const examineItem = () => import('./taskCenter/item_todo_list.vue');
const itemEmpower = () => import('./item/empower/index.vue');
const association = () => import('./item/association/index.vue');
const escalation = () => import('./item/association/escalation.vue');
const escalaHistory = () => import('./item/association/escalaHistory.vue');
//统筹清单
const overAll = () => import('./overAll/list.vue');
const overAllTodo = () => import('./overAll/todo.vue');

//字典
const dictList = () => import('./dict/list.vue');
const dictItemList = () => import('./dict/dict-item-list.vue');
const systemKey = () => import('./system/key.vue');
const systemMonitor = () => import('./system/monitor.vue');

//任务中心
const catalogExamine = () => import('./taskCenter/examine.vue');
const itemTodoList = () => import('./taskCenter/item_todo_list.vue');
const taskMessage = () => import('./taskCenter/message.vue');
const messageRemind = () => import('./taskCenter/message-remind.vue');
//职责清单
const qzqdIndex = () => import('./qzqd/index.vue');
const qzqdInfo = () => import('./qzqd/info.vue');
//抄送职责清单
const sendDuplicate = () => import('./sendDuplicate/index.vue');


//首页
const homeIndex = () => import('./home/index.vue');
//监控管理
const management = () => import('./monitor/management.vue');
const info = () => import('./monitor/management-region.vue');
//统计分析
const statisticalCatalog = () => import('./statistical/catalog.vue');
const statisticalResponsibility = () => import('./statistical/responsibility.vue');
const statisticalItem = () => import('./statistical/item.vue');
//异议管理
const objectionList = () => import('./objection/list.vue');
const objectionInfo = () => import('./objection/info.vue');
const objectionTodo = () => import('./objection/todo.vue');
const objectionApply = () => import('./objection/apply.vue');
const mechanismChange = () => import('./mechanism/change.vue');
const mechanismRelevanceItem = () => import('./mechanism/relevanceItem.vue');
//台账
const standingBook = () => import('./standingBook/index.vue');
const standingBookInfo = () => import('./standingBook/info.vue');
//目录职责清单
const catalogZzqd = () => import('./catalogZzqd/index.vue');
const catalogZzqdInfo = () => import('./catalogZzqd/info.vue');
//推送日志
const pushLogs = () => import('./pushLogs/list.vue');
const pushLogsIndex = () => import('./pushLogs/index.vue');


//演示需要临时添加页面
const addCatalog = () => import('./catalog/add/addCatalog.vue');
const addCatalogInfo = () => import('./catalog/add/addCatalogInfo.vue');
const addItem = () => import('./item/add/addItem.vue');
const viewItem = () => import('./item/add/viewItem.vue');
const addItemInfo = () => import('./item/add/addItemInfo.vue');


/**
 * 全局路由配置
 * @type {*[]}
 */
const router = [
    {
        path: "/",
        component: QzFrame,
        children:[
            //目录注册页面
            {path: "catalog/register",component: CatalogRegister},
            {path: "catalog/edit",component: CatalogEdit},
            {path: "catalog/disuse",component: CatalogDisuse},
            {path: "catalog/major_edit",component: MajorEdit},
            {path: "catalog/minor_edit",component: MinorEdit,meta:{path:'',name:'目录详情'}},
            {path: "catalog/distribution",component: distribution},
            {path: "catalog/overAll",component: catalogOverAll},
            {path: "catalog/issue",component: issue},
            {path:'catalog/examineCatalog',component:catalogExamine},
            //目录清单
            {path: "catalog/list",component: CatalogList},
            //目录库
            {path: "catalog/library",component: catalogLibrary},
            //表单页面
            {path:"newForm/manage",component:NewFormManage},
            {path:"newForm/associaItem",component:associaItem},
            //事项页面
            {path:'item/list',component:ItemList},
            {path:'item/info',component:ItemInfo,meta:{path:'/dict/list',name:'事项详情'}},
            {path:'item/item-info',component:Item_Info,meta:{path:'/dict/list',name:'职责清单详情'}},
            {path:'item/search',component:ItemSearch},
            {path:'tag/list',component:tagList},
            {path:'associationItem/list',component:associationItem},
            {path:'item/examineItem',component:examineItem},
            {path:'overAll/list',component:overAll},
            {path:'overAll/todo',component:overAllTodo},
            {path:'overAll/waitTodo',component:overAllTodo},
            {path:'item/empower',component:itemEmpower},
            {path:'item/association',component:association},
            {path:'item/escalation',component:escalation},
            {path:'item/escalaHistory',component:escalaHistory},

            //字典页面
            {path:'dict/list',component:dictList},
            {path:'dict/item_list',component:dictItemList,meta:{path:'/dict/list',name:'字典子项'}},
            {path:'system/key',component:systemKey},
            {path:'system/monitor',component:systemMonitor},

            //任务中心
            {path:'catalog/examine',component:catalogExamine},
            {path:'item/todo-list',component:itemTodoList},
            {path:'taskCenter/message',component:taskMessage},
            {path:'objection/todo_list',component:taskMessage},

            //异议管理
            {path:'objection/apply',component:objectionApply},
            {path:'objection/todo',component:objectionTodo},
            {path:'objection/list',component:objectionList},
            {path:'objection/info',component:objectionInfo},
            //新增事项申请
            {path:'addItem/propose',component:taskMessage},
            {path:'addItem/receive',component:taskMessage},
            {path:'addItem/apply',component:taskMessage},
            //职责清单
            {path:'qzqd/list',component:qzqdIndex},
            {path:'qzqd/info',component:qzqdInfo,meta:{path:'/qzqd/list',name:'职责清单详情'}},
            //抄送职责清单
            {path:'sendDuplicate/index',component:sendDuplicate},
          //首页
            {path:'home/index',component:homeIndex},
            //监控管理
            {path:'monitor/management',component:management},
            {path:'monitor/managementRegion',component:info},
            //统计分析
            {path:'statistical/catalog',component:statisticalCatalog},
            {path:'statistical/responsibility',component:statisticalResponsibility},

			{path:'statistical/item',component:statisticalItem},
            //机构变更
            {path:'mechanism/change',component:mechanismChange},
            {path:'mechanism/relevanceItem',component:mechanismRelevanceItem},
            //验收临时添加页面
            {path:'catalog/addCatalogInfo',component:addCatalogInfo},
            {path:'catalog/addCatalog',component:addCatalog},
            {path:'item/addItemInfo',component:addItemInfo},
            {path:'item/addItem',component:addItem},
            {path:'item/viewItem',component:viewItem},
            {path:'standingBook/index',component:standingBook},
            {path:'standingBook/info',component:standingBookInfo},
            {path:'catalogZzqd/index',component:catalogZzqd},
            {path:'catalogZzqd/info',component:catalogZzqdInfo},
            //推送日志
            {path:'pushLogs/list',component:pushLogs},
            {path:'pushLogs/index',component:pushLogsIndex},

        ]
    },
]
export default router;
