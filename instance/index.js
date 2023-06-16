/**
 * @author Fred
 * @desc 实例列表
 */

import myDownloader from "./myDownloader.js"; //下载文件
import myServiceMaker from "./myServiceMaker.js";

myDownloader();
globalThis.myServiceMaker = myServiceMaker;

setTimeout(myServiceMaker, 6000)