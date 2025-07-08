import request from '@/utils/request';

// 查詢日誌
export const queryLog = (page, pageSize) => request.get(`/log/page?page=${page}&pageSize=${pageSize}`);
