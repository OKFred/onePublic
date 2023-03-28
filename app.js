/**
 * @author Fred
 * @desc 初始化入口
 * @since 2023-02-02 10:27:00
 */

import dotenv from "dotenv";

(async function main() {
    await env();
    await init();
})(); //主函数

async function env() {
    //node组件
    await import("./service/server/status.js");
    //通用组件
    await import("./base/proto_string.js");
    await import("./base/proto_array.js");
    await import("./base/proto_number.js");
    await import("./base/proto_date.js");
    await import("./base/network.js");
    //服务器
    await import("./service/server/index.js");
    console.log("👌环境准备完毕\n");
} //环境准备

async function init() {
    console.log("🚀引入实例");
    await import("./instance/index.js");
    await import("./instance/myServer.js");
    await import("./instance/myUploader.js");
} //引入实例

global.envGetter = function envGetter(key) {
    const config = dotenv.config();
    if (config.error) return console.log("环境变量解析失败，请重新配置");
    let envObj = config.parsed;
    if (key === undefined) return envObj;
    return envObj[key];
}; //读取环境变量 .env

setInterval(() => console.log("keep alive"), 1000 * 60 * 60 * 24);
