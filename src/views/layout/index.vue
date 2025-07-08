<script setup>

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';


// 點擊logo圖片時，跳轉到首頁
const router = useRouter();
const activeIndex = () => {
    router.push('/index');
}

const loginName = ref('');

onMounted(() => {
    // 從 localStorage 中獲取使用者資訊
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (userInfo && userInfo.name) {
        loginName.value = userInfo.name;
    }
})

// 登出
const logout = () => {
    ElMessageBox.confirm(
        '是否要登出',
        '警告',
        {
            confirmButtonText: '確認',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => { // 確認
            localStorage.removeItem('userInfo'); // 清除使用者資訊
            router.push('/login'); // 跳轉到登入頁面
            ElMessage.success('登出成功');
        })
        .catch(() => { // 取消
            ElMessage.info('取消登出');
        })
}

</script>


<template>
    <div class="common-layout">

        <!-- header 區域 -->
        <el-container>
            <el-header class="header">

                <el-menu :default-active="activeIndex" class="el-menu" mode="horizontal" :ellipsis="false"
                    @select="handleSelect" style="height: 100px;">

                    <!-- logo -->
                    <el-menu-item>
                        <img class="img" src="@/images/logo.jpg" @click="activeIndex()" />
                    </el-menu-item>

                    <!-- 使用者名稱欄位 -->
                    <el-sub-menu>
                        <template #title>
                            <el-icon>
                                <Setting />
                            </el-icon>
                            使用者 [{{ loginName }}]
                        </template>
                        <el-menu-item @click="logout">登出</el-menu-item>
                        <el-menu-item>修改密碼</el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </el-header>

            <!-- 側邊欄位區域 -->
            <el-container>
                <el-aside class="aside" width="250px">
                    <el-menu router>

                        <!-- 首頁menu -->
                        <el-menu-item index="/index">
                            <el-icon>
                                <HomeFilled />
                            </el-icon>
                            <span>首頁</span>
                        </el-menu-item>

                        <!-- 部門員工menu -->
                        <el-sub-menu index="1">
                            <template #title>
                                <el-icon>
                                    <Avatar />
                                </el-icon>
                                <span>部門與員工管理</span>
                            </template>
                            <!-- 子菜單 -->
                            <el-menu-item index="/dept">部門管理</el-menu-item>
                            <el-menu-item index="/emp">員工管理</el-menu-item>
                        </el-sub-menu>

                        <!-- 班級學生menu -->
                        <el-sub-menu index="2">
                            <template #title>
                                <el-icon>
                                    <UserFilled />
                                </el-icon>
                                <span>班級與學生管理</span>
                            </template>
                            <!-- 子菜單 -->
                            <el-menu-item index="/clazz">班級管理</el-menu-item>
                            <el-menu-item index="/stu">學生管理</el-menu-item>
                        </el-sub-menu>

                        <!-- 數據統計menu -->
                        <el-sub-menu index="3">
                            <template #title>
                                <el-icon>
                                    <Histogram />
                                </el-icon>
                                <span>數據統計管理</span>
                            </template>
                            <!-- 子菜單 -->
                            <el-menu-item index="/empReport">員工統計</el-menu-item>
                            <el-menu-item index="/stuReport">學生統計</el-menu-item>
                            <el-menu-item index="/log">日誌</el-menu-item>
                        </el-sub-menu>
                    </el-menu>
                </el-aside>

                <!-- 主內容區域 -->
                <el-main class="main">
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>


<style scoped>
.header {
    height: 100px;
}

.img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    cursor: pointer;
}

.el-menu--horizontal>.el-menu-item:nth-child(1) {
    margin-right: auto;
}

.aside {
    width: 250px;
    border-right: 1px solid #ccc;
    height: auto;
}
</style>