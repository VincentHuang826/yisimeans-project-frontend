import request from '@/utils/request';

// 班級列表查詢
export const queryAllApi = (name, begin, end, page, pageSize) => {
    return request.get(`/clazzs?name=${name}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`);
}

// 新增班級
export const addApi = (clazz) => {
    return request.post('/clazzs', clazz);
}

// 根據部門ID查詢班級
export const queryByIdApi = (id) => {
    return request.get(`/clazzs/${id}`);
}

// 更新班級
export const updateApi = (clazz) => {
    return request.put('/clazzs', clazz);
}

// 刪除班級
export const deleteByIdApi = (id) => {
    return request.delete(`/clazzs/${id}`);
}

// 查詢所有班級
export const queryClazz = () => {
    return request.get('/clazzs/list');
}