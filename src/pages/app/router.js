/**
 * 全局路由配置
 * @type {*[]}
 */
const AppView = () => import('./app.vue');

const APP = [
    {
        path: "/system/:appCode",
        component: AppView,
        meta:{
            requireAuth : false
        }
    },
    {path:'*',redirect:'/admin/404'}
]
export default APP;
