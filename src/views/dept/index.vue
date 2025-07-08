<script setup>

import { ref, onMounted } from 'vue';
import { queryAllApi, addApi, queryByIdApi, updateApi, deleteByIdApi } from '@/api/dept';
import { ElMessage, ElMessageBox } from 'element-plus';


onMounted(() => {
    queryAll();
})

// 查詢所有部門
const queryAll = async () => {
    const result = await queryAllApi();
    deptList.value = result.data;
}

const deptList = ref([]);

// 對話框相關
const dialogFormVisible = ref(false);
const formTitle = ref('');
const dept = ref({ name: '' });

// 保存部門
const save = () => {
    // 表單校驗
    if (!deptFormRef.value) return;
    deptFormRef.value.validate(async (valid) => {
        if (valid) { // 校驗通過

            let result;
            // 判斷是新增還是修改
            if (dept.value.id) {
                result = await updateApi(dept.value);
            } else {
                result = await addApi(dept.value);
            }

            if (result.code) { // 成功
                // 返回提示訊息
                ElMessage.success('新增成功');

                // 關閉對話框
                dialogFormVisible.value = false;

                // 查詢所有部門
                queryAll();

            } else { // 失敗
                // 返回提示訊息
                ElMessage.error(result.msg);
            }
        } else { // 校驗失敗
            ElMessage.error('部門名稱校驗失敗');
        }
    })
}

// 新增部門
const addDept = () => {
    dialogFormVisible.value = true;
    formTitle.value = '新增部門';
    dept.value = { name: '' };
    // 重置表單校驗
    if (deptFormRef.value) {
        deptFormRef.value.resetFields();
    }
}

// 新增部門表單校驗規則
const deptFormRef = ref();

const rules = ref({
    name: [
        { required: true, message: '部門名稱為必填', trigger: 'blur' },
        { min: 2, max: 10, message: '部門名稱長度為2-10位', trigger: 'blur' }
    ]
})

// 編輯
const edit = async (id) => {
    formTitle.value = '修改部門';
    const result = await queryByIdApi(id);

    // 重置表單校驗
    if (deptFormRef.value) {
        deptFormRef.value.resetFields();
    }

    if (result.code) {
        dialogFormVisible.value = true;
        dept.value = result.data;
    }
}

// 刪除
const del = (id) => {
    ElMessageBox.confirm(
        '是否確定刪除該部門?',
        '警告',
        {
            confirmButtonText: '確認',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => { // 確認刪除
            const result = await deleteByIdApi(id);

            if (result.code) {
                ElMessage.success('刪除成功');
                queryAll();
            } else {
                ElMessage.error(result.msg);
            }
        })
        .catch(() => { // 取消刪除
            ElMessage.info('取消刪除');
        })
}

</script>



<template>
    <!-- 頁面名稱 -->
    <div style="font-size: 24px; font-weight: bold;">
        部門管理
    </div>

    <!-- 新增按鈕 -->
    <div class="container">
        <el-button type="primary" @click="addDept">
            <el-icon>
                <Plus />
            </el-icon>
            新增部門
        </el-button>
    </div>

    <!-- 對話框 -->
    <el-dialog v-model="dialogFormVisible" :title="formTitle" width="500">
        <el-form :model="dept" :rules="rules" ref="deptFormRef">
            <el-form-item label="部門名稱" label-width=100px prop="name">
                <el-input v-model="dept.name" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="save">確定</el-button>
            <el-button @click="dialogFormVisible = false">取消</el-button>
        </template>
    </el-dialog>

    <!-- 表格 -->
    <div class="container">
        <el-table :data="deptList" stripe style="width: 100%">
            <el-table-column type="index" prop="number" label="序號" width="100" align="center" />
            <el-table-column prop="name" label="部門名稱" width="300" align="center" />
            <el-table-column prop="updateTime" label="最後操作時間" width="300" align="center" />
            <el-table-column label="操作" width="300" align="center">
                <template #default="scope">
                    <el-button size="small" type="warning" @click="edit(scope.row.id)">
                        <el-icon>
                            <EditPen />
                        </el-icon>編輯
                    </el-button>
                    <el-button size="small" type="danger" @click="del(scope.row.id)">
                        <el-icon>
                            <Delete />
                        </el-icon>刪除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>


</template>



<style scoped>
.container {
    margin: 30px 0;
}
</style>
