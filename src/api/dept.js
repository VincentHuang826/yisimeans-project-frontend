import request from '@/utils/request';

// 查詢所有部門
export const queryAllApi = () => {
    return request.get('/depts');
}

// 新增部門
export const addApi = (dept) => {
    return request.post('/depts', dept);
}

// 根據部門ID查詢部門
export const queryByIdApi = (id) => {
    return request.get(`/depts/${id}`);
}

// 更新部門
export const updateApi = (dept) => {
    return request.put('/depts', dept);
}

// 刪除部門
export const deleteByIdApi = (id) => {
    return request.delete(`/depts?id=${id}`);
}
