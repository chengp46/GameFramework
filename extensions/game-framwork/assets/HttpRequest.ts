// HttpManager.ts

import { _decorator } from 'cc';
const { ccclass } = _decorator;

export class HttpResponse {
    success: boolean;
    response: any;
    error: string;
}

export class UploadData {
    dataType: string;
    fileData: any;
    filePath: string;
}

/**
 * HTTP 请求管理类（使用 fetch）
 */
@ccclass('HttpManager')
export default class HttpRequest {
    /** 请求超时时间 */
    public timeout: number = 10000;
    /** 自定义请求头信息 */
    private headers = new Headers();
    /**
     * 添加自定义请求头信息
     * @param name  信息名
     * @param value 信息值
     */
    addHeader(name: string, value: string) {
        this.headers.append(name, value);
    }

    /**
     * 发送 GET 请求
     * @param url 请求地址
     * @param params 请求参数
     * @param callback 成功回调
     */
    public get(url: string, params: any, callback: (data: HttpResponse) => void): void {
        const queryString = this.buildQueryString(params);
        const requestUrl = queryString ? `${url}?${queryString}` : url;
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('Request Timeout'));
            }, this.timeout);
        });
        const requestPromise = fetch(requestUrl);
        let res: HttpResponse = new HttpResponse();
        Promise.race([requestPromise, timeoutPromise])
            .then((response: Response) => {
                if (!response?.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                res.success = true;
                res.response = data;
                callback(res);
            })
            .catch(error => {
                res.success = false;
                res.error = error.message || 'Network Error';
                callback(res);
            });
    }

    public async getAsync(url: string, params: any) {
        return new Promise((resolve, _) => {
            this.get(url, params, (data: HttpResponse) => {
                resolve(data);
            });
        });
    }

    /**
     * 发送 POST 请求
     * @param url 请求地址
     * @param params 请求数据
     * @param callback 成功回调
     */
    public post(url: string, params: any, callback: (data: HttpResponse) => void): void {
        if ([...this.headers.keys()].length === 0) {
            this.headers.set('Content-Type', 'application/json');
        }
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('Request Timeout'));
            }, this.timeout);
        });
        const requestPromise = fetch(url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(params),
        });
        let res: HttpResponse = new HttpResponse();
        Promise.race([requestPromise, timeoutPromise])
            .then((response: Response) => {
                if (!response?.ok) {
                    throw new Error(`HTTP Error: ${response?.status}`);
                }
                return response?.json();
            })
            .then(data => {
                res.success = true;
                res.response = data;
                callback(data);
            })
            .catch(error => {
                res.success = false;
                res.error = error.message || 'Network Error';
                callback(res);
            });
    }

    public async postAsync(url: string, params: any) {
        return new Promise((resolve, _) => {
            this.post(url, params, (data: HttpResponse) => {
                resolve(data);
            });
        });
    }

    /**
     * 上传文件
     * @param url 请求地址
     * @param uploadData 上传数据信息
     * @param callback 成功回调
     */
    public uploadFile(url: string, uploadData: UploadData, callback: (data: HttpResponse) => void) {
        if ([...this.headers.keys()].length === 0) {
            this.headers.set('Content-Type', 'multipart/form-data');
        }
        let res: HttpResponse = new HttpResponse();
        if (!uploadData.fileData) {
            res.success = false;
            callback(res);
            return;
        }
        let blob = new Blob([uploadData.fileData], { type: uploadData.dataType });
        let fileName = uploadData.filePath.split('/').pop();
        const formData = new FormData();
        formData.append('file', blob, fileName);
        let params = {
            method: 'POST',
            headers: this.headers,
            body: formData,
        };
        fetch(url, params)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                res.success = true;
                res.response = data;
                callback(data);
            })
            .catch(error => {
                res.success = false;
                res.error = error.message || 'Network Error';
                callback(res);
            });
    }

    /**
     * 构建查询字符串
     * @param params 请求参数
     * @returns 查询字符串
     */
    private buildQueryString(params: any): string {
        if (!params) return '';
        return Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
    }
}
