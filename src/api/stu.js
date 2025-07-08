import request from '@/utils/request';

// 條件查詢所有學生
export const queryPageApi = (name, number, clazzId, page, pageSize) => 
    request.get(`/students?name=${name}&number=${number}&clazzId=${clazzId}&page=${page}&pageSize=${pageSize}`);

// 新增學生
export const addApi = (studentForm) => request.post('/students', studentForm);

// 根據ID查詢
export const queryByIdApi = (id) => request.get(`/students/${id}`);

// 修改學生
export const updateApi = (stu) => request.put('/students', stu);

// 刪除學生
export const deleteApi = (ids) => request.delete(`/students/${ids}`);
