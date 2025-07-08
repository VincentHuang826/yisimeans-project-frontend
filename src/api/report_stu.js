import request from '@/utils/request';

// 獲取班級人數統計
export const getStudentCountDataApi = () => request.get('/report/studentCountData');

// 獲取學生性別人數統計
export const getStudentGenderDataApi = () => request.get('/report/studentGenderData');