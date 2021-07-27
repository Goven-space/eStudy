// 引入axios
import axios from "axios"
import Vue from "vue"

const api = axios.create({
    // baseURL:"http://sandbox_api.estudy.chanke.xyz"
    baseURL:"http://localhost:3000"
})
// 设置请求头文件格式为json
api.defaults.headers.post["Content-Type"] = "application/json"
//设置返回信息拦截器
api.interceptors.response.use(response => {
    console.log(response)
    return response.data.data
},error => {
    const headers = error.config.headers
    const response = error.response
    if (! headers._slient) {
        Vue.$notification.error({
            message:"API error",
            description:response.data.errorMessage
        })
    }
    return Promise.reject(error)

})

export {api}
