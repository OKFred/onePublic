import fs from "fs";
import path from "path";

/**
 * @author Fred
 * @desc 浏览器
 * @since 2023-02-02 10:27:00
 */

let iexplore = (() => {
    function preCheck() {
        console.log("准备工作");
        let nodeVersion = process.versions.node.split(".");
        if (nodeVersion[0] < 16 && nodeVersion[1] < 15) {
            console.log("需要16.15版本以上的nodeJS。请先更新");
            return false;
        }
        return true;
    }

    /**
     * 文件下载
     * @param url 下载地址 如：https://www.baidu.com/img/bd_logo1.png
     * @param fetchOptions fetch的配置项
     * @param saveAs 保存的文件名 如：bd_logo1.png
     * @param savePath 保存的路径 如：./download/images
     * @return  // true 下载成功，false 下载失败
     */

    async function downloader({ url, fetchOptions, saveAs, savePath } = {}) {
        let status = preCheck();
        if (!status) return false;
        console.log("开始下载");
        let res = await fetch(url, fetchOptions);
        let fileAB = await res.arrayBuffer();
        fs.writeFileSync(path.join(savePath, saveAs), Buffer.from(fileAB));
        console.log("已下载 " + saveAs);
        return true;
    }
    return {
        downloader,
    };
})();

export default iexplore;
