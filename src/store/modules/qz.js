// 职责模块-状态管理
const state = { //要设置的全局访问的state对象
	sxslDict: {}, // 数据字典
    themeItem: {}//主题事项数据字典
};
const getters = { //实时监听state值的变化(最新状态,组件中用于获取状态值)
	sxslDict(state) {
		return state.sxslDict
	},
    themeItem(state) {
		return state.themeItem
	}
};
const mutations = { // 定义改变状态的方法（同步）
	setSxslDict(state, obj) {
		state.sxslDict = obj;
	},
	setThemeItem(state, obj) {
		state.themeItem = obj;
	}
};
const actions = { // 可异步，调用mutations的方法
	setSxslDict(context, obj) {
		context.commit('setSxslDict', obj);
	},
    setThemeItem(context, obj) {
		context.commit('setThemeItem', obj);
	}
};
export default {
	namespaced: true, //用于在全局引用此文件里的方法时标识这一个的文件名
	state,
	getters,
	mutations,
	actions
}
