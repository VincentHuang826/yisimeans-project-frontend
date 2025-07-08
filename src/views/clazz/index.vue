<script setup>

import { ref, onMounted, watch } from 'vue';
import { queryAllApi, addApi, queryByIdApi, updateApi, deleteByIdApi } from '@/api/clazz';
import { ElMessage, ElMessageBox } from 'element-plus';
import { queryAllEmp } from '@/api/emp';


onMounted(() => {
    search();
    queryEmp();
})

// 搜尋欄對象
const searchClazz = ref({ name: '', date: [], begin: '', end: '' });

// 員工列表數據
const clazzList = ref([]);

// 條件查詢班級
const search = async () => {
    const result = await queryAllApi(searchClazz.value.name,
        searchClazz.value.begin,
        searchClazz.value.end,
        currentPage.value,
        pageSize.value
    )
    if (result.code) {
        clazzList.value = result.data.rows;
        total.value = result.data.total;
    }
}

// 監聽日期範圍變化
watch(() => searchClazz.value.date, (newVal, oldVal) => {
    if (newVal.length == 2) {
        searchClazz.value.begin = newVal[0];
        searchClazz.value.end = newVal[1];
    } else {
        searchClazz.value.begin = '';
        searchClazz.value.end = '';
    }
})

// 清空搜尋欄
const clear = () => {
    searchClazz.value = { name: '', gender: '', date: [], begin: '', end: '' };
    search();
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

// 新增班級
const addClazz = () => {
    dialogFormVisible.value = true;
    formTitle.value = '新增班級';
    clazzData.value = { name: '', room: '', beginDate: '', endDate: '', teacherId: '' };
    // 重置表單校驗
    if (clazzFormRef.value) {
        clazzFormRef.value.resetFields();
    }
}

// 對話框相關
const dialogFormVisible = ref(false);
const formTitle = ref('');
const clazzData = ref({ name: '', room: '', beginDate: '', endDate: '', teacherId: '' });

// 新增班級表單校驗規則
const clazzFormRef = ref();

const rules = ref({
    name: [
        { required: true, message: '班級名稱為必填', trigger: 'blur' },
        { min: 3, max: 20, message: '班級名稱長度為3-20位', trigger: 'blur' }
    ],
    room: [
        { required: true, message: '教室名稱為必填', trigger: 'blur' },
        { min: 3, max: 10, message: '教室名稱長度為3-10位', trigger: 'blur' }
    ],
    beginDate: [
        { type: 'date', required: true, message: '請選擇開課日期', trigger: 'change' }
    ],
    endDate: [
        { type: 'date', required: true, message: '請選擇結課日期', trigger: 'change' }
    ],
    teacherId: [
        { required: true, message: '請選擇班導師', trigger: 'change' }
    ]
})

// 查詢全部員工
const empOptions = ref([]);

const queryEmp = async () => {
    const result = await queryAllEmp();

    if (result.code) {
        empOptions.value = result.data;
    }
}

// 保存班級
const save = () => {
    // 表單校驗
    if (!clazzFormRef.value) return;

    clazzFormRef.value.validate(async (valid) => {
        if (valid) { // 校驗通過
            let result;

            if (clazzData.value.id) { // 判斷是新增還是修改
                result = await updateApi(clazzData.value);
            } else {
                result = await addApi(clazzData.value);
            }

            if (result.code) { // 成功
                // 返回提示訊息
                ElMessage.success('新增成功');

                // 關閉對話框
                dialogFormVisible.value = false;

                // 查詢所有班級
                search();

            } else { // 失敗
                // 返回提示訊息
                ElMessage.error(result.msg);
            }
        } else { // 校驗失敗
            ElMessage.error('請檢查表單輸入內容是否正確');
        }
    })
}

// 編輯班級
const edit = async (id) => {
    const result = await queryByIdApi(id);

    // 重置表單校驗
    if (clazzFormRef.value) {
        clazzFormRef.value.resetFields();
    }

    if (result.code) {
        formTitle.value = '修改班級';
        clazzData.value = result.data;
        dialogFormVisible.value = true;
    } else {
        ElMessage.error(result.msg);
    }
}

// 刪除
const del = (id) => {
    ElMessageBox.confirm(
        '是否確定刪除該班級?',
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
                search();
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
        班級管理
    </div>

    <!-- 搜尋欄 -->
    <div class="container">
        <el-form :inline="true" :model="searchClazz">
            <el-form-item label="班級名稱">
                <el-input v-model="searchClazz.name" placeholder="請輸入班級" clearable />
            </el-form-item>

            <el-form-item label="日期範圍">
                <el-date-picker v-model="searchClazz.date" type="daterange" range-separator="To"
                    start-placeholder="開始時間" end-placeholder="結束時間" value-format="YYYY-MM-DD" :clearable="false" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" round @click="search">查詢</el-button>
                <el-button round @click="clear">清空</el-button>
            </el-form-item>
        </el-form>
    </div>

    <!-- 新增按鈕 -->
    <el-button type="primary" @click="addClazz">
        <el-icon>
            <Plus />
        </el-icon>
        新增班級
    </el-button>

    <!-- 對話框 -->
    <el-dialog v-model="dialogFormVisible" :title="formTitle" width="500">
        <el-form :model="clazzData" :rules="rules" ref="clazzFormRef">
            <el-form-item label="班級名稱" label-width=100px prop="name">
                <el-input v-model="clazzData.name" placeholder="請輸入長度為3-20位的班級名稱" />
            </el-form-item>

            <el-form-item label="教室名稱" label-width=100px prop="room">
                <el-input v-model="clazzData.room" placeholder="請輸入長度為3-10位的教室名稱" />
            </el-form-item>

            <el-form-item label="開課日期" label-width=100px prop="beginDate">
                <el-date-picker v-model="clazzData.beginDate" type="date" placeholder="請選擇開課日期"
                    value-format="YYYY-MM-DD" />
            </el-form-item>

            <el-form-item label="結課日期" label-width=100px prop="endDate">
                <el-date-picker v-model="clazzData.endDate" type="date" placeholder="請選擇結課日期"
                    value-format="YYYY-MM-DD" />
            </el-form-item>

            <el-form-item label="班導師" label-width=100px prop="teacherId">
                <el-select v-model="clazzData.teacherId" placeholder="請選擇班導師" clearable>
                    <el-option v-for="e in empOptions" :key="e.id" :label="e.name" :value="e.id" placeholder="請選擇" />
                </el-select>
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button type="primary" @click="save">確定</el-button>
            <el-button @click="dialogFormVisible = false">取消</el-button>
        </template>
    </el-dialog>

    <!-- 表格 -->
    <div class="container">
        <el-table :data="clazzList" stripe style="width: 100%">
            <el-table-column type="index" prop="number" label="序號" width="60" align="center" />
            <el-table-column prop="name" label="課程名稱" width="300" align="center" />
            <el-table-column prop="room" label="教室" width="150" align="center" />
            <el-table-column prop="teacherName" label="班導師" width="150" align="center" />
            <el-table-column prop="beginDate" label="開課日" width="120" align="center" />
            <el-table-column prop="endDate" label="結課日" width="120" align="center" />
            <el-table-column prop="clazzStatus" label="課程狀態" width="100" align="center" />
            <el-table-column label="操作" width="200" align="center">
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

    <!-- 分頁 -->
    <div class="container">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 50, 100, 200]"
            :background="background" layout="total, sizes, prev, pager, next, jumper" :total="total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
</template>


<style scoped>
.container {
    margin: 30px 0;
}
</style>
