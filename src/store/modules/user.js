import { api } from "../../utils/api"



const state = {
    loggedIn:false,
    info: {}
}
const getters = {

}
const mutations = {
    login(state,data){
        state.loggedIn = true
        //存储登录请求成功后返回的数据
        state.info = data
        api.defaults.headers.common["Token"] = state.info.token
    },
    getToken(state,token){
        state.info.token = token
    },
    logout(state){
        state.info = {}
        state.loggedIn = false
        api.defaults.headers.common["Token"] = ''
    }
}
const actions = {
    login({commit},form){
        api.post('/auth/login',form).then(result => {
            commit('login',result)
        })
    },
    checkedLogin({commit,state,dispatch}){
        api.defaults.headers.common["Token"] = state.info.token
        api.post('/auth/refreshToken',{},{headers:{_slient:true}}).then(token =>{
            commit('getToken',token)
        }).catch(err => {
            dispatch('logout')
        })
    },
    logout({commit,state}){
        commit('logout')
    }
}

export default {
    //设置独立的命名空间
    namespaced:true,
    state,
    getters,
    mutations,
    actions
}