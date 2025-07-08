import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router/index';

// 創建一個 axios 實例
const request = axios.create({
    baseURL: '/api',
    timeout: 100000
})

// 添加axios響應攔截器
request.interceptors.response.use(
    (response) => { // 處理成功的響應
        return response.data;
    },
    (error) => { // 處理錯誤的響應
        if (error.response.status == 401) {
            ElMessage.error('登入超時，請重新登入');
            router.push('/login'); // 導向登入頁面
        } else {
            ElMessage.error('請求失敗，請稍後再試');
        }
        return Promise.reject(error);
    }
)

// 添加axios請求攔截器,獲取localStorage中的token
request.interceptors.request.use(
    (config) => { // 成功的請求攔截
        const userInfo = JSON.parse(localStorage.getItem('userInfo')); // 從localStorage中獲取用戶信息

        if (userInfo && userInfo.token) {
            config.headers.token = userInfo.token; // 在請求頭中添加token
        }
        return config;
    },
    (error) => { // 錯誤的請求攔截
        return Promise.reject(error);
    }
)

export default request;