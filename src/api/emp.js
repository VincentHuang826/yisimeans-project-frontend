import request from '@/utils/request';

// 條件查詢所有員工
export const queryPageApi = (name, gender, begin, end, page, pageSize) => 
    request.get(`/emps?name=${name}&gender=${gender}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`);

// 新增員工
export const addApi = (employeeForm) => request.post('/emps', employeeForm);

// 根據ID查詢
export const queryByIdApi = (id) => request.get(`/emps/${id}`);

// 修改員工
export const updateApi = (emp) => request.put('/emps', emp);

// 刪除員工
export const deleteApi = (ids) => request.delete(`/emps?ids=${ids}`);

// 查詢全部員工
export const queryAllEmp = () => request.get('/emps/list');