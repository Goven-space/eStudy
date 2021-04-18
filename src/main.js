import Vue from 'vue'
import App from './App.vue'
import store from './store/store'
//引入第三方工具库
import Antd from 'ant-design-vue'
//引入样式
import 'ant-design-vue/dist/antd.css'
//引入表单验证插件
import { ValidationObserver ,ValidationProvider,localize,extend} from 'vee-validate'
import zh_CN from 'vee-validate/dist/locale/zh_CN.json'
import { required } from 'vee-validate/dist/rules';
import Notification from "ant-design-vue/lib/notification"

Vue.$notification = Notification
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver',ValidationObserver)

extend('required', required)
localize('zh_CN', zh_CN)
Vue.use(Antd)
Vue.config.productionTip = false

import moment from 'moment'
import 'moment/locale/zh-cn' 
moment.locale('zh-cn');

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
