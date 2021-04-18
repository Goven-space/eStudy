import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import student from './modules/student'
import teacher from './modules/teacher'

//第三方自动登陆插件（自动保存登陆信息）
import createPersistedState from "vuex-persistedstate"
Vue.use(Vuex)

export default new Vuex.Store({
    
    modules:{
        user,
        student,
        teacher
    },
    plugins:[
        //自动登陆插件
        createPersistedState({
            key:'eStudy',
            paths:['user'],
            //订阅函数
            subscriber(store){
                store.dispatch('user/checkedLogin')
                return function(handle){
                    return  store.subscribe(handle)
                }
            }
        })
    ]

})