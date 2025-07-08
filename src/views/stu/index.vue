<script setup>

import { ref, onMounted } from "vue";
import { queryPageApi, addApi, queryByIdApi, updateApi, deleteApi } from "@/api/stu";
import { Check, Delete, Edit, Message, Search, Star } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { queryClazz } from "@/api/clazz";


onMounted(() => {
    search();
    queryAllClazz();
})

// 搜尋欄對象
const searchStu = ref({ name: '', number: '', clazzId: '' });

// 班級選項
const clazzOptions = ref([]);

// 查詢所有班級名稱
const queryAllClazz = async () => {
    const result = await queryClazz();

    if (result.code) {
        clazzOptions.value = result.data;
    }
}

// 學生列表數據
const stuList = ref([]);

// 條件查詢學生
const search = async () => {
    const result = await queryPageApi(searchStu.value.name,
        searchStu.value.number,
        searchStu.value.clazzId,
        currentPage.value,
        pageSize.value
    );

    if (result.code) {
        stuList.value = result.data.rows;
        total.value = result.data.total;
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

// 清空搜尋欄
const clear = () => {
    searchStu.value = { name: '', number: '', clazzId: '' };
    search();
}

// 新增學生
const addStu = () => {
    dialogFormVisible.value = true;
    dialogTitle.value = '新增學生';

    if (stuFormRef.value) {
        stuFormRef.value.resetFields(); // 重置表單校驗
    }
    // 重置學生表單數據
    studentForm.value = { name: '', number: '', gender: '', phone: '', email: '', birthday: '', address: '', clazzId: '', emergencyContactList: [] };
}

// 新增與修改學生對話框
const dialogFormVisible = ref(false);
const dialogTitle = ref('');
const studentForm = ref({ name: '', number: '', gender: '', phone: '', email: '', birthday: '', address: '', clazzId: '', emergencyContactList: [] });

// 學生性別選項
const genderOptions = ref([{ label: '男', value: 1 }, { label: '女', value: 2 }]);

// 新增緊急聯絡人欄位
const addEmergencyContactList = () => {
    studentForm.value.emergencyContactList.push({ name: '', phone: '', relation: '' });
}

// 刪除緊急聯絡人欄位
const delEmergencyContactList = (index) => {
    studentForm.value.emergencyContactList.splice(index, 1);
}

// 新增/修改學生表單校驗規則
const stuFormRef = ref();

const rules = ref({
    name: [
        { required: true, message: '請輸入姓名', trigger: 'blur' },
        { min: 1, max: 20, message: '長度1-20字', trigger: 'blur' },
    ],
    number: [
        { required: true, message: '請輸入學號', trigger: 'blur' },
        { min: 3, max: 10, message: '長度3-10字', trigger: 'blur' },
    ],
    gender: [
        { required: true, message: '請選擇性別', trigger: 'change' }
    ],
    phone: [
        { required: true, message: '請輸入電話號碼', trigger: 'blur' },
        { pattern: /^09\d{8}$/, message: '請輸入有效的手機號碼', trigger: 'blur' },
    ],
    address: [
        { required: true, message: '請輸入地址', trigger: 'blur' }
    ],
    birthday: [
        { required: true, message: '請輸入生日', trigger: 'blur' }
    ],
    clazzId: [
        { required: true, message: '請選擇班級', trigger: 'change' }
    ]
});

// 保存學生
const save = () => {
    // 表單校驗
    if (!stuFormRef.value) return;
    stuFormRef.value.validate(async (valid) => {
        if (valid) { // 校驗通過

            let result;
            // 判斷是新增還是修改
            if (studentForm.value.id) {
                result = await updateApi(studentForm.value);
            } else {
                result = await addApi(studentForm.value);
            }

            if (result.code) { // 成功
                // 返回提示訊息
                ElMessage.success('新增成功');

                // 關閉對話框
                dialogFormVisible.value = false;

                // 查詢所有學生
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

// 編輯學生
const edit = async (id) => {
    const result = await queryByIdApi(id);

    if (result.code) {
        dialogFormVisible.value = true;
        dialogTitle.value = '編輯學生';
        studentForm.value = result.data;
    } else {
        ElMessage.error(result.msg);
    }
}

// 刪除學生
const deleteById = (id) => {
    ElMessageBox.confirm(
        '是否確定刪除該學生?',
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

// 紀錄選中的學生ID
const selectedIds = ref([]);

// 選框勾選時觸發
const handleSelectionChange = (selection) => {
    selectedIds.value = selection.map(item => item.id);
}

// 批量刪除學生
const deleteByIds = () => {
    if (selectedIds.value && selectedIds.value.length > 0) {
        ElMessageBox.confirm(
            '是否確定刪除所選學生?',
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
        ElMessage.warning('請先選擇要刪除的學生');
    }
}

</script>


<template>
    <!-- 頁面名稱 -->
    <div style="font-size: 24px; font-weight: bold;">
        學生管理
    </div>

    <!-- 搜尋欄 -->
    <div class="container">
        <el-form :inline="true" :model="searchStu">
            <el-form-item label="姓名">
                <el-input v-model="searchStu.name" placeholder="請輸入姓名" clearable />
            </el-form-item>

            <el-form-item label="學號">
                <el-input v-model="searchStu.number" placeholder="請輸入學號" clearable />
            </el-form-item>

            <el-form-item label="所屬班級">
                <el-select v-model="searchStu.clazzId">
                    <el-option v-for="c in clazzOptions" :key="c.id" :label="c.name" :value="c.id" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" round @click="search">查詢</el-button>
                <el-button round @click="clear">清空</el-button>
            </el-form-item>
        </el-form>
    </div>

    <!-- 新增與批量刪除按鈕 -->
    <div class="container">
        <el-button type="success" text bg @click="addStu">
            <el-icon>
                <Plus />
            </el-icon>
            新增學生
        </el-button>

        <el-button type="danger" text bg @click="deleteByIds">
            <el-icon>
                <Minus />
            </el-icon>
            批量刪除
        </el-button>
    </div>

    <!-- 學生列表 -->
    <div class=container>
        <el-table :data="stuList" stripe style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="30" align="center" />
            <el-table-column prop="name" label="姓名" width="150" align="center" />
            <el-table-column prop="number" label="學號" width="100" align="center" />
            <el-table-column label="性別" width="80" align="center">
                <template #default="scope">
                    {{ scope.row.gender == 1 ? '男' : '女' }}
                </template>
            </el-table-column>
            <el-table-column prop="phone" label="電話" width="150" align="center" />
            <el-table-column prop="birthday" label="生日" width="150" align="center" />
            <el-table-column prop="clazzName" label="班級" width="200" align="center" />
            <el-table-column prop="address" label="地址" width="300" align="center" />
            <el-table-column prop="createTime" label="入學日期" width="200" align="center" />
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

    <!-- 新增與修改學生 -->
    <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="880">
        <el-form :model="studentForm" :rules="rules" ref="stuFormRef">

            <!-- 第一列 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="studentForm.name" placeholder="請輸入長度1-20字" />
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="性別" prop="gender">
                        <el-select v-model="studentForm.gender">
                            <el-option v-for="g in genderOptions" :key="g.value" :label="g.label" :value="g.value"
                                placeholder="請選擇" />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="學號" prop="number">
                        <el-input v-model="studentForm.number" placeholder="請輸入長度3-10字" />
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 第二列 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="電話" prop="phone">
                        <el-input v-model="studentForm.phone" placeholder="請輸入手機號碼" />
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="生日" prop="birthday">
                        <el-date-picker v-model="studentForm.birthday" type="date" value-format="YYYY-MM-DD"
                            placeholder="請選擇" />
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="所屬班級" prop="clazzId">
                        <el-select v-model="studentForm.clazzId" clearable>
                            <el-option v-for="c in clazzOptions" :key="c.id" :label="c.name" :value="c.id"
                                placeholder="請選擇" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 第三列 -->
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="地址" prop="address">
                        <el-input v-model="studentForm.address" placeholder="請輸入聯絡地址" />
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 緊急聯絡人按鈕 -->
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item>
                        <el-button type="success" text bg @click="addEmergencyContactList">
                            <el-icon>
                                <Collection />
                            </el-icon>
                            新增緊急聯絡人
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 緊急聯絡人欄位 -->
            <el-row :gutter="20" v-for="(se, index) in studentForm.emergencyContactList" :key="index">
                <el-col :span="7">
                    <el-form-item label="姓名">
                        <el-input v-model="se.name" placeholder="請輸入聯絡人姓名" />
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="電話">
                        <el-input v-model="se.phone" placeholder="請輸入聯絡電話" />
                    </el-form-item>
                </el-col>

                <el-col :span="6">
                    <el-form-item label="關係">
                        <el-input v-model="se.relation" placeholder="請輸入聯絡人關係" />
                    </el-form-item>
                </el-col>

                <el-col :span="3">
                    <el-form-item label="刪除">
                        <el-button type="danger" :icon="Delete" circle @click="delEmergencyContactList(index)" />
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
