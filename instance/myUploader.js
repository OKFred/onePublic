import fs from "fs";
import process from "process";
import explorer from "../service/client/explorer.js";
import mimeObj from "../base/mimeMap.js";

let root = process.cwd();

(function selfCheck() {
    let pathArr = ["..", "..", "public", "upload"];
    let dirObj = explorer.makeDirectory({ pathArr });
    if (!dirObj.status) return console.log("目录创建失败");
    console.log("\n当前上传目录", dirObj.result);
})();

async function fileUploadQuery(req, res) {
    let urlArr = [];
    for (let value of Object.values(req.files)) {
        let fileArr = Array.isArray(value) ? value : [value]; //兼容传多个文件的情况
        for (let fileObj of fileArr) {
            let { originalFilename, path, type } = fileObj;
            let fileExtension = "";
            for (let [k, v] of Object.entries(mimeObj)) {
                if (type === v) {
                    fileExtension = k;
                    break;
                } //找到文件后缀名
            }
            let newPath = `./public/upload/${originalFilename}${fileExtension}`;
            let serverIP = globalThis.internalIPAddress;
            let PORT = global.envGetter("PORT") || 3000;
            urlArr.push(
                `http://${serverIP}:${PORT}/rest/file/read/${originalFilename}${fileExtension}`,
            );
            fs.copyFile(path, newPath, (err) => {
                if (err) console.log(err);
            });
        }
    }
    console.log("已上传", urlArr.join("\n"));
    res.status(200).json({ message: "上传成功", code: 200, success: true, data: urlArr });
}

async function fileReadQuery(req, res) {
    let { url } = req;
    url = decodeURIComponent(url);
    let pathArr = url.split("/");
    let fileName = pathArr[pathArr.length - 1];
    let filePath = `./public/upload/${fileName}`;
    if (fs.existsSync(filePath) === false) return res.status(404).send("文件不存在");
    res.sendFile(filePath, { root });
}

export { fileUploadQuery, fileReadQuery };
