import request from '@/utils/request';

// 獲取員工職位人數統計
export const getEmpJobDataApi = () => request.get('/report/empJobData');

// 獲取員工性別人數統計
export const getGenderDataApi = () => request.get('/report/empGenderData');