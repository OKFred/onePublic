//作为客户端主动收集&保存信息
import iexplore from "../service/client/iexplore.js";
import explorer from "../service/client/explorer.js";

/**
 * @author Fred
 * @desc 实例——下载文件
 */

let myDownloader = async () => {
    let pathArr = ["..", "..", "public", "download"];
    let saveAs = "";
    let fetchOptions = {
        method: "GET",
    };
    let url =
        "https://dss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/topnav/newbaike-889054f349.png";
    let dirObj = explorer.makeDirectory({ pathArr });
    if (!dirObj.status) return console.log("目录创建失败");
    console.log("\n当前目录", dirObj.result);
    let savePath = dirObj.result;
    return await iexplore.downloader({ url, fetchOptions, saveAs, savePath });
};

export default myDownloader;
