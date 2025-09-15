import axios from 'axios'
// import router from '../router/index'

const baseURL = 'http://localhost:8087'
const scoketURL = 'ws://localhost:8087/myWs'

const instance = axios.create({
    // TODO 1. 基础地址，超时时间
    baseURL,
    timeout: 20000
})

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        return config
    },
    (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
    (res) => {
        // TODO 4. 摘取核心响应数据
        if (res.data.success === true) {
            return res
        }
        // TODO 3. 处理业务失败
        // 处理业务失败, 给错误提示，抛出错误
        
        return Promise.reject(res.data)
    },
    (err) => {
        // 错误的默认情况 => 只要给提示
        
        return Promise.reject(err)
    }
)

export default instance
export { baseURL, scoketURL }

