/**
 * desc: 导出报表的共用方法
 * User: Lyon.li@gymboglobal.com
 * Date: 2019/1/10
 * Time: 上午10:38
 */
import {Fetch} from "@/service/fetch";

const timeout = 30000;
export const downloadExcel = (data, url, name) => {
    const params = {
        url,
        data,
        responseType: 'arraybuffer',
    };

    Fetch.post(params, timeout).then(res => {
        let link = document.createElement('a');
        link.download = name;
        link.style.display = 'none';
        link.href = URL.createObjectURL(new Blob([res]));
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
    })
};
