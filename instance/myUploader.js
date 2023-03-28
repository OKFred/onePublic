import fs from "fs";
import process from "process";
import explorer from "../service/client/explorer.js";
import mimeObj from "../base/mimeMap.js";

let root = process.cwd();

(function selfCheck() {
    let pathArr = ["..", "..", "public", "upload"];
    let dirObj = explorer.makeDirectory({ pathArr });
    if (!dirObj.status) return console.log("目录创建失败");
    console.log("\n上传当前目录", dirObj.result);
})();

async function fileUploadQuery(req, res) {
    let urlArr = [];
    for (let value of Object.values(req.files)) {
        let { fieldName, path, type } = value;
        let fileExtension = "";
        for (let [key, value] of Object.entries(mimeObj)) {
            if (type === value) {
                fileExtension = key;
                break;
            }
        }
        let newPath = `./public/upload/${fieldName}${fileExtension}`;
        let serverIP = globalThis.internalIPAddress;
        let PORT = global.envGetter("PORT") || 3000;
        urlArr.push(`http://${serverIP}:${PORT}/rest/file/read/${fieldName}${fileExtension}`);
        fs.copyFile(path, newPath, (err) => {
            if (err) console.log(err);
        });
    }
    res.status(200).json({ message: "上传成功", status: 200, data: urlArr });
}

async function fileReadQuery(req, res) {
    let { url } = req;
    let pathArr = url.split("/");
    let fileName = pathArr[pathArr.length - 1];
    let filePath = `./public/upload/${fileName}`;
    if (fs.existsSync(filePath) === false) return res.status(404).send("文件不存在");
    res.sendFile(filePath, { root });
}

export { fileUploadQuery, fileReadQuery };
