// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ZKTable from 'vue-table-with-tree-grid'
import './assets/style/global.css'
import ElementuUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import vuedit from 'vue-quill-editor'
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
axios.defaults.baseURL='http://localhost:8888/api/private/v1/'
axios.interceptors.request.use(config =>{
  console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http=axios
Vue.use(ElementuUI)
Vue.config.productionTip = false
Vue.component('tree-table',ZKTable)
Vue.use(vuedit)

Vue.filter('dataFormat',function(time){
  let dt = new Date(time)
  let year = dt.getFullYear()
  let month = (dt.getMonth() + 1 +'' ).padStart(2,'0')
  let day = (dt.getDate() + '').padStart(2,'0')
  let hh = (dt.getHours() + '').padStart(2,'0')
  let mm = (dt.getMinutes() + '').padStart(2,'0')
  let ss = (dt.getSeconds() + '').padStart(2,'0')
  return `${year}-${month}-${day} ${hh}:${mm}:${ss}`
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
