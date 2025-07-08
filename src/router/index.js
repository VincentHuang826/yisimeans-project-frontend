import { createRouter, createWebHistory } from 'vue-router'

import ClazzView from '@/views/clazz/index.vue'
import DeptView from '@/views/dept/index.vue'
import EmpView from '@/views/emp/index.vue'
import IndexView from '@/views/index/index.vue'
import LayoutView from '@/views/layout/index.vue'
import LogView from '@/views/log/index.vue'
import EmpReport from '@/views/report/emp/index.vue'
import StuReport from '@/views/report/stu/index.vue'
import StuView from '@/views/stu/index.vue'
import LoginView from '@/views/login/index.vue'

// 定義路由
const routes = 
[
    {      
        path: '/',
        name: '',
        component: LayoutView,
        redirect: '/index',
        children: [
            {path: '/index',name: 'index',component: IndexView},
            {path: '/dept',name: 'dept',component: DeptView},
            {path: '/emp',name: 'emp',component: EmpView},
            {path: '/clazz',name: 'clazz',component: ClazzView},
            {path: '/stu',name: 'stu',component: StuView},
            {path: '/empReport',name:'empReport',component: EmpReport},
            {path: '/stuReport',name:'stuReport',component: StuReport},
            {path: '/log',name:'log',component: LogView}
        ]
    },    
        {path: '/login',name:'login',component: LoginView}
]

// 創建路由實例
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router