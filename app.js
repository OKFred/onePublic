/**
 * @author Fred
 * @desc 初始化入口
 * @since 2023-02-02 10:27:00
 */

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
    console.log("👌环境准备完毕\n");
} //环境准备

async function init() {
    console.log("🚀引入实例");
    await import("./instance/index.js");
} //引入实例

setInterval(() => console.log("keep alive"), 1000 * 60 * 60 * 24);
