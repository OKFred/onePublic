/**
 * @author Fred
 * @desc 模拟浏览器功能
 * @since 2023-02-22 18:27:00
 */

import fs from "fs";
import path from "path";

/**
 * @desc 依赖检查
 * @returns {boolean} res - 检查结果
 **/
(async function selfCheck() {
    console.log("准备工作");
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
    console.log("开始下载");
    console.time("下载耗时");
    let res = await fetch(url, fetchOptions);
    let fileAB = await res.arrayBuffer();
    fs.writeFileSync(path.join(savePath, saveAs), Buffer.from(fileAB));
    console.log("已下载 " + saveAs);
    console.timeEnd("下载耗时");
    return true;
}

export default {
    downloader,
};
