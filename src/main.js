import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import * as echarts from 'echarts';
// import VueECharts from 'vue-echarts';

 

// Vue.component('v-chart', VueECharts)

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.use(ElementPlus, {locale: zhTw})
app.use(router)
app.mount('#app')


