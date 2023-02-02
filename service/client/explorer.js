import fs from "fs";
import path from "path";
import * as url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

/**
 * @author Fred
 * @desc 文件管理器
 * @since 2023-02-02 10:27:00
 */

let explorer = (() => {
    /**
     * 生成目录
     * @param { pathArr } 目录数组，如：["download","images"]
     * @return  //{status: true, result: "./download/images"}
     */

    function makeDirectory({ pathArr } = {}) {
        // console.log("生成目录");
        let args = [];
        let status = true;
        let result = __dirname;
        for (let pathName of pathArr) {
            args.push(pathName);
            result = path.join(__dirname, ...args);
            if (!fs.existsSync(result)) {
                try {
                    fs.mkdirSync(result);
                } catch (e) {
                    console.log(e);
                    status = false;
                    break;
                }
            }
        }
        // console.log("目录已生成  ");
        return { status, result };
    }
    return {
        makeDirectory,
    };
})();

export default explorer;
