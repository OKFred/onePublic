/**
 * @author Fred
 * @desc 实例列表
 */

import myDownloader from "./myDownloader.js"; //下载文件
import myRegister from "./myRegister.js";

globalThis.nodeInstance = {
    myDownloader,
    myRegister,
};

console.log("completed registration globally as nodeInstance", globalThis.nodeInstance);
