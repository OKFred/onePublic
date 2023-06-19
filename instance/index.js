/**
 * @author Fred
 * @desc 实例列表
 */

import myDownloader from "./myDownloader.js"; //下载文件
import myServiceMaker from "./myServiceMaker.js";

globalThis.nodeInstance = {
    myDownloader,
    myServiceMaker,
};

console.log("completed registration globally as nodeInstance", globalThis.nodeInstance);
