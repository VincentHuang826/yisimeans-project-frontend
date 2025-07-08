<script setup>

import { ref, watch, onMounted } from "vue";
import { queryPageApi, addApi, queryByIdApi, updateApi, deleteApi } from "@/api/emp";
import { Check, Delete, Edit, Message, Search, Star } from '@element-plus/icons-vue'
import { queryAllApi as queryDepts } from "@/api/dept";
import { ElMessage, ElMessageBox } from 'element-plus';


onMounted(() => {
    search();
    queryAllDepts();
})

// 員工性別選項
const genderOptions = ref([{ label: '男', value: 1 }, { label: '女', value: 2 }]);

// 員工職務選項
const positionOptions = ref([
    { label: '經理', value: 1 },
    { label: '主管', value: 2 },
    { label: '專員', value: 3 },
    { label: '助理', value: 4 },
    { label: '實習生', value: 5 }
]);

// 員工部門選項
const departmentOptions = ref([]);

// 搜尋欄對象
const searchEmp = ref({ name: '', gender: '', date: [], begin: '', end: '' });

// 監聽日期範圍變化
watch(() => searchEmp.value.date, (newVal, oldVal) => {
    if (newVal.length == 2) {
        searchEmp.value.begin = newVal[0];
        searchEmp.value.end = newVal[1];
    } else {
        searchEmp.value.begin = '';
        searchEmp.value.end = '';
    }
})

// 條件查詢員工
const search = async () => {
    const result = await queryPageApi(searchEmp.value.name,
        searchEmp.value.gender,
        searchEmp.value.begin,
        searchEmp.value.end,
        currentPage.value,
        pageSize.value
    );

    if (result.code) {
        empList.value = result.data.rows;
        total.value = result.data.total;
    }
}

// 清空搜尋欄
const clear = () => {
    searchEmp.value = { name: '', gender: '', date: [], begin: '', end: '' };
    search();
}

// 員工列表數據
const empList = ref([]);

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

// 新增與修改員工對話框
const dialogFormVisible = ref(false);
const dialogTitle = ref('');
const employeeForm = ref({ name: '', username: '', gender: '', phone: '', email: '', birthday: '', address: '', salary: '', departmentId: '', position: '', startDate: '', certificatesList: [] });

// 新增員工
const addEmp = () => {
    dialogFormVisible.value = true;
    dialogTitle.value = '新增員工';

    if (empFormRef.value) {
        empFormRef.value.resetFields(); // 重置表單校驗
    }
    // 重置員工表單數據
    employeeForm.value = { name: '', username: '', gender: '', phone: '', email: '', birthday: '', address: '', salary: '', departmentId: '', position: '', startDate: '', certificatesList: [] };
}

// 新增/修改員工表單校驗規則
const empFormRef = ref();

const rules = ref({
    name: [
        { required: true, message: '請輸入姓名', trigger: 'blur' },
        { min: 2, max: 10, message: '長度2-10字', trigger: 'blur' },
    ],
    username: [
        { required: true, message: '請輸入使用者名稱', trigger: 'blur' },
        { min: 3, max: 30, message: '長度3-30字', trigger: 'blur' },
    ],
    gender: [
        { required: true, message: '請選擇性別', trigger: 'change' }
    ],
    phone: [
        { required: true, message: '請輸入電話號碼', trigger: 'blur' },
        { pattern: /^09\d{8}$/, message: '請輸入有效的手機號碼', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '請輸入信箱', trigger: 'blur' }
    ],
    address: [
        { required: true, message: '請輸入地址', trigger: 'blur' }
    ],
    birthday: [
        { required: true, message: '請輸入生日', trigger: 'blur' }
    ],
    startDate: [
        { required: true, message: '請輸入到職日期', trigger: 'blur' }
    ]
});

// 查詢所有部門數據
const queryAllDepts = async () => {
    const result = await queryDepts();

    if (result.code) {
        departmentOptions.value = result.data;
    }
}

// 新增證照
const addCertificate = () => {
    employeeForm.value.certificatesList.push({ name: '', issueDate: '', expirationDate: '', cerDate: [] });
}

// 刪除證照
const delCertificates = (index) => {
    employeeForm.value.certificatesList.splice(index, 1);
}

// 監聽certificatesList日期變化
watch(() => employeeForm.value.certificatesList, (newVal, oldVal) => {
    if (employeeForm.value.certificatesList && employeeForm.value.certificatesList.length > 0) {
        employeeForm.value.certificatesList.forEach((cer) => {
            cer.issueDate = cer.cerDate[0];
            cer.expirationDate = cer.cerDate[1];
        })
    }
}, { deep: true }); // 深度監聽

// 保存員工
const save = () => {
    // 表單校驗
    if (!empFormRef.value) return;
    empFormRef.value.validate(async (valid) => {
        if (valid) { // 校驗通過

            let result;
            // 判斷是新增還是修改
            if (employeeForm.value.id) {
                result = await updateApi(employeeForm.value);
            } else {
                result = await addApi(employeeForm.value);
            }

            if (result.code) { // 成功
                // 返回提示訊息
                ElMessage.success('新增成功');

                // 關閉對話框
                dialogFormVisible.value = false;

                // 查詢所有員工
                search();

            } else { // 失敗
                // 返回提示訊息
                ElMessage.error(result.msg);
            }
        } else { // 校驗失敗
            ElMessage.error('表單必填項目校驗失敗');
        }
    })
}

// 編輯員工
const edit = async (id) => {
    const result = await queryByIdApi(id);

    if (result.code) {
        dialogFormVisible.value = true;
        dialogTitle.value = '編輯員工';
        employeeForm.value = result.data;

        let cerList = employeeForm.value.certificatesList;
        if (cerList && cerList.length > 0) {
            cerList.forEach((cer) => {
                cer.cerDate = [cer.issueDate, cer.expirationDate];
            })
        }
    } else {
        ElMessage.error(result.msg);
    }
}

// 刪除員工
const deleteById = (id) => {
    ElMessageBox.confirm(
        '是否確定刪除該員工?',
        '警告',
        {
            confirmButtonText: '確認',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => { // 確認刪除
            const result = await deleteApi(id);

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

// 紀錄選中的員工ID
const selectedIds = ref([]);

// 選框勾選時觸發
const handleSelectionChange = (selection) => {
    selectedIds.value = selection.map(item => item.id);
}

// 批量刪除員工
const deleteByIds = () => {
    if (selectedIds.value && selectedIds.value.length > 0) {
        ElMessageBox.confirm(
            '是否確定刪除所選員工?',
            '警告',
            {
                confirmButtonText: '確認',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(async () => { // 確認刪除
                const result = await deleteApi(selectedIds.value);

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
    } else {
        ElMessage.warning('請先選擇要刪除的員工');
    }
}

</script>


<template>
    <!-- 頁面名稱 -->
    <div style="font-size: 24px; font-weight: bold;">
        員工管理
    </div>

    <!-- 搜尋欄 -->
    <div class="container">
        <el-form :inline="true" :model="searchEmp">
            <el-form-item label="姓名">
                <el-input v-model="searchEmp.name" placeholder="請輸入姓名" clearable />
            </el-form-item>

            <el-form-item label="性別">
                <el-select v-model="searchEmp.gender" placeholder="請選擇">
                    <el-option label="男" value="1" />
                    <el-option label="女" value="2" />
                </el-select>
            </el-form-item>

            <el-form-item label="到職日期">
                <el-date-picker v-model="searchEmp.date" type="daterange" range-separator="To" start-placeholder="開始時間"
                    end-placeholder="結束時間" value-format="YYYY-MM-DD" :clearable="false" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" round @click="search">查詢</el-button>
                <el-button round @click="clear">清空</el-button>
            </el-form-item>
        </el-form>
    </div>

    <!-- 新增與批量刪除按鈕 -->
    <div class="container">
        <el-button type="success" text bg @click="addEmp">
            <el-icon>
                <Plus />
            </el-icon>
            新增員工
        </el-button>

        <el-button type="danger" text bg @click="deleteByIds">
            <el-icon>
                <Minus />
            </el-icon>
            批量刪除
        </el-button>
    </div>

    <!-- 員工列表 -->
    <div class=container>
        <el-table :data="empList" stripe style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="30" align="center" />
            <el-table-column prop="name" label="姓名" width="150" align="center" />
            <el-table-column label="性別" width="80" align="center">
                <template #default="scope">
                    {{ scope.row.gender == 1 ? '男' : '女' }}
                </template>
            </el-table-column>
            <el-table-column prop="phone" label="電話" width="150" align="center" />
            <el-table-column prop="email" label="信箱" width="230" align="center" />
            <el-table-column prop="birthday" label="生日" width="150" align="center" />
            <el-table-column prop="address" label="地址" width="250" align="center" />
            <el-table-column prop="departmentName" label="部門" width="100" align="center" />
            <el-table-column prop="position" label="職務" width="100" align="center">
                <template #default="scope">
                    <span v-if="scope.row.position == 1">經理</span>
                    <span v-else-if="scope.row.position == 2">主管</span>
                    <span v-else-if="scope.row.position == 3">專員</span>
                    <span v-else-if="scope.row.position == 4">助理</span>
                    <span v-else-if="scope.row.position == 5">實習生</span>
                    <span v-else>其他</span>
                </template>
            </el-table-column>
            <el-table-column prop="startDate" label="入職日期" width="150" align="center" />
            <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                    <el-button size="small" type="warning" text @click="edit(scope.row.id)">
                        <el-icon>
                            <EditPen />
                        </el-icon>編輯
                    </el-button>
                    <el-button size="small" type="danger" text @click="deleteById(scope.row.id)">
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

    <!-- 新增與修改員工 -->
    <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="880">
        <el-form :model="employeeForm" :rules="rules" ref="empFormRef">

            <!-- 第一列 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="employeeForm.name" placeholder="請輸入長度2-10字" />
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="性別" prop="gender">
                        <el-select v-model="employeeForm.gender">
                            <el-option v-for="g in genderOptions" :key="g.value" :label="g.label" :value="g.value" />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="使用者名稱" prop="username">
                        <el-input v-model="employeeForm.username" placeholder="請輸入長度3-30字" />
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 第二列 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="電話" prop="phone">
                        <el-input v-model="employeeForm.phone" placeholder="請輸入手機號碼" />
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="入職日期" prop="startDate">
                        <el-date-picker v-model="employeeForm.startDate" type="date" value-format="YYYY-MM-DD"
                            placeholder="請選擇" />
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="生日" prop="birthday">
                        <el-date-picker v-model="employeeForm.birthday" type="date" value-format="YYYY-MM-DD"
                            placeholder="請選擇" />
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 第三列 -->
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="信箱" prop="email">
                        <el-input v-model="employeeForm.email" placeholder="請輸入E-mai地址" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="地址" prop="address">
                        <el-input v-model="employeeForm.address" placeholder="請輸入聯絡地址" />
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 第四列 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="薪資">
                        <el-input v-model="employeeForm.salary" placeholder="請輸入薪資" />
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="部門">
                        <el-select v-model="employeeForm.departmentId" clearable>
                            <el-option v-for="d in departmentOptions" :key="d.id" :label="d.name" :value="d.id"
                                placeholder="請選擇" />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="職務">
                        <el-select v-model="employeeForm.position" clearable>
                            <el-option v-for="p in positionOptions" :key="p.value" :label="p.label" :value="p.value"
                                placeholder="請選擇" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 證照按鈕 -->
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item>
                        <el-button type="success" text bg @click="addCertificate">
                            <el-icon>
                                <Collection />
                            </el-icon>
                            新增專業證照
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 證照欄位 -->
            <el-row :gutter="20" v-for="(cer, index) in employeeForm.certificatesList" :key="index">
                <el-col :span="8">
                    <el-form-item label="證照名稱">
                        <el-input v-model="cer.name" placeholder="請輸入證照名稱" />
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="發證與到期日期">
                        <el-date-picker v-model="cer.cerDate" type="daterange" range-separator="To"
                            start-placeholder="發證日期" end-placeholder="到期日期" :size="small" :clearable="false"
                            value-format="YYYY-MM-DD" />
                    </el-form-item>
                </el-col>

                <el-col :span="4">
                    <el-form-item label="刪除">
                        <el-button type="danger" :icon="Delete" circle @click="delCertificates(index)" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <!-- 底部確認按鈕 -->
        <template #footer>
            <el-button type="primary" @click="save()">
                保存
            </el-button>
            <el-button @click="dialogFormVisible = false">取消</el-button>
        </template>
    </el-dialog>
</template>


<style scoped>
.container {
    margin: 20px 0;
}
</style>
