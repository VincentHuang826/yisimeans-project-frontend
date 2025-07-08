<script setup>

import { loginApi } from '@/api/login';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';


const loginForm = ref({ username: '', password: '' });
const router = useRouter();

// 登入
const login = async () => {
    const result = await loginApi(loginForm.value);

    if (result.code) {
        // 登入成功
        ElMessage.success('登入成功');
        // 儲存登入資訊到本地存儲
        localStorage.setItem('userInfo', JSON.stringify(result.data));
        // 跳轉到首頁
        router.push('/index');
    } else {
        // 登入失敗
        ElMessage.error(result.msg);
    }
}

// 清除表單
const clear = () => {
    loginForm.value = { username: '', password: '' };
}

</script>

<template>
    <div id="container">
        <div class="login-form">
            <el-form label-width="50px" :model="loginForm">
                <P class="title">一絲意思管理系統</P>
                <el-form-item label="帳號">
                    <el-input v-model="loginForm.username" placeholder="請輸入使用者帳號" />
                </el-form-item>

                <el-form-item label="密碼">
                    <el-input v-model="loginForm.password" type="password" placeholder="請輸入使用者密碼" show-password />
                </el-form-item>
            </el-form>

            <el-form-item>
                <el-button class="button1" type="primary" @click="login">登入</el-button>
                <el-button class="button2" @click="clear">取消</el-button>
            </el-form-item>
        </div>
    </div>

</template>

<style scoped>
#container {
    padding: 10%;
    height: 410px;
    background-image: url(@/images/yisimeans.jpg);
    background-repeat: no-repeat;
    background-size: cover;
}

.login-form {
    max-width: 400px;
    padding: 0 30px 30px 30px;
    margin: -100px auto 0;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    background-color: white;
}

.title {
    font-size: 30px;
    text-align: center;
    margin-bottom: 30px;
    font-weight: bold;
}

.button1 {
    width: 100px;
    margin: 0 15px 0 90px;
}

.button2 {
    width: 100px;
    margin: 0 50px 0 15px;
}
</style>
