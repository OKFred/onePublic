/**
 * @author Fred
 * @desc 模拟浏览器功能
 * @since 2023-02-22 18:27:00
 */

import fs from "fs";
import path from "path";
import mimeMap from "../../base/mimeMap.js";

/**
 * @desc 依赖检查
 * @returns {boolean} res - 检查结果
 **/
(async function selfCheck() {
    let nodeVersion = process.versions.node.split(".");
    if (nodeVersion[0] < 16 && nodeVersion[1] < 15) {
        console.log("需要16.15版本以上的nodeJS。请先更新");
        return false;
    }
    return true;
})();

/**
 * @desc 文件下载
 * @param {Object} obj - 入参对象
 * @param {string} obj.url - 下载地址，如：https://www.baidu.com/img/bd_logo1.png
 * @param {Object} obj.fetchOptions - fetch参数，如：{ method: "GET" }
 * @param {string} obj.saveAs - 保存文件名，如：bd_logo1.png
 * @param {string} obj.savePath - 保存路径，如：./images
 * @returns {boolean} res - 下载结果
 */

async function downloader({ url, fetchOptions, saveAs, savePath } = {}) {
    console.log("⏬开始下载");
    console.time("⌛下载耗时");
    let res = await fetch(url, fetchOptions);
    if (!saveAs) {
        let contentDisposition = res.headers.get("content-disposition") || ";_downloaded";
        let contentType = res.headers.get("content-type") || "";
        let arr = contentDisposition.split(";") || [`filename="_downloaded`];
        let fileNameArr = arr[2] ? arr[2].split(`''`) : arr[1].split(`="`);
        let defaultName = fileNameArr.length === 2 ? fileNameArr[1] : "";
        saveAs = defaultName ? decodeURIComponent(defaultName) : "_downloaded";
        if (saveAs === "_downloaded") {
            for (let [k, v] of Object.entries(mimeMap)) {
                if (contentType === v) {
                    saveAs = saveAs + k;
                    break;
                }
            }
        }
    } //如果没有指定文件名，则从响应头中获取
    let fileAB = await res.arrayBuffer();
    let finalPath = path.join(savePath, saveAs);
    try {
        fs.writeFileSync(finalPath, Buffer.from(fileAB));
    } catch (e) {
        console.log("下载失败，请检查保存路径：" + finalPath, e.message);
        return false;
    }
    console.timeEnd("⌛下载耗时");
    console.log("✅已下载： " + finalPath);
    return true;
}

export default {
    downloader,
};
