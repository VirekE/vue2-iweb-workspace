import Vue from 'vue';
import Index from './index.vue';

const Instance = new Vue({
  render: h => h(Index),
});

const component = Instance.$mount();
document.body.appendChild(component.$el);
const instance = Instance.$children[0];
export default instance;
