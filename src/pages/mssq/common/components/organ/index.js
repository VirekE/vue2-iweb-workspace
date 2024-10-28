import Vue from 'vue';
import Index from './index.vue';

const Instance = new Vue({
    render: h => h(Index),
});

const component = Instance.$mount();
document.body.appendChild(component.$el);
const instance = Instance.$children[0];
export default instance;
/**
 * region 区划
 *  grade=3  深圳市 市直部门
 *  grade=4  区   区直部门
 *  grade=5  街道  街道办事处部门
 *  grade=6  社区
 */
/**
 * organ 机构
 * grade=2  市直部门
 * grade=3  区直部门
 * grade=4  街道办事处
 * grade=5  社区工作站
 */
