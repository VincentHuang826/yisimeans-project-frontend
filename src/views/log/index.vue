<script setup>

import { queryLog } from '@/api/log';
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';


onMounted(() => {
    search();
})

// 日誌列表對象
const logList = ref([]);

// 查詢日誌
const search = async () => {
    const result = await queryLog(currentPage.value, pageSize.value);

    if (result.code) {
        logList.value = result.data.rows;
        total.value = result.data.total;
    } else {
        ElMessage.error(result.msg);
    }
}

// 分頁相關數據
const currentPage = ref(1);
const pageSize = ref(10);
const background = ref(false);
const total = ref(0);

const handleSizeChange = (val) => {
    search();
}
const handleCurrentChange = (val) => {
    search();
}


</script>

<template>
    <!-- 頁面名稱 -->
    <div style="font-size: 24px; font-weight: bold;">
        日誌紀錄
    </div>

    <!-- 日誌列表 -->
    <div class="container">
        <el-table :data="logList" border style="width: 100%">
            <el-table-column prop="operateEmpId" label="員工ID" width="80" align="center" />
            <el-table-column prop="operateTime" label="操作時間" width="180" align="center" />
            <el-table-column prop="className" label="操作類別" width="200" align="center" />
            <el-table-column prop="methodName" label="方法名稱" width="180" align="center" />
            <el-table-column prop="methodParams" label="方法參數" width="250" show-overflow-tooltip align="center" />
            <el-table-column prop="returnValue" label="返回參數" width="250" show-overflow-tooltip align="center" />
            <el-table-column prop="costTime" label="執行耗時（毫秒）" width="100" align="center" />
        </el-table>
    </div>

    <!-- 分頁 -->
    <div class="container">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 50, 100, 200]"
            :background="background" layout="total, sizes, prev, pager, next, jumper" :total="total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

</template>

<style scoped>
.container {
    margin: 20px;
}
</style>
