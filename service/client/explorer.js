/**
 * @author Fred
 * @desc 模拟文件管理器功能
 * @since 2023-02-22 18:27:00
 */

import fs from "fs";
import path from "path";
import * as url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

/**
 * @desc 读取文件
 * @param {Object} obj - 入参对象
 * @param {string} obj.directory - 目录，如：./images
 * @param {string} obj.fileName - 文件名，如：bd_logo1.png
 * @returns {Object} res - 读取结果
 */
function readFile({ directory, fileName } = {}) {
    // console.log('读取文件');
    try {
        let filePath = path.join(directory, fileName);
        if (!fs.existsSync(filePath)) {
            return { status: false, result: filePath, message: "文件不存在" };
        }
        fs.readFileSync(filePath);
        return { status: true, result: filePath };
    } catch (e) {
        // console.log(e.message);
        return { status: false, result: e };
    }
}

/**
 * @desc 生成文件
 * @param {Object} obj - 入参对象
 * @param {string} obj.directory - 目录，如：./images
 * @param {string} obj.fileName - 文件名，如：bd_logo1.png
 * @param {string} obj.content - 文件内容，如：hello world
 * @param {boolean} obj.force - 是否强制覆盖，如：true
 * @returns {Object} res - 生成结果
 */
function makeFile({ directory, fileName, content, force } = {}) {
    // console.log('生成文件');
    try {
        let filePath = path.join(directory, fileName);
        if (fs.existsSync(filePath) && !force) {
            return { status: false, result: filePath, message: "文件已存在" };
        }
        fs.writeFileSync(filePath, content);
        return { status: true, result: filePath };
    } catch (e) {
        // console.log(e.message);
        return { status: false, result: e };
    }
}

/**
 * @desc 文件复制
 * @param {Object} obj - 入参对象
 * @param {string} obj.fromFile - 源文件名，如：bd_logo1.png
 * @param {string} obj.fromDirectory - 源目录，如：./old/images
 * @param {string} obj.toFile - 目标文件名，如：bd_logo1.png
 * @param {string} obj.toDirectory - 目标目录，如：./new/images
 * @param {boolean} obj.force - 是否强制覆盖，如：true
 * @returns {Object} res - 复制结果
 */
function copyFile({ fromFile, fromDirectory, toFile, toDirectory, force } = {}) {
    // console.log('复制文件');
    try {
        let fromPath = path.join(fromDirectory, fromFile);
        let toPath = path.join(toDirectory, toFile);
        if (fs.existsSync(toPath) && !force) {
            return { status: false, result: toPath, message: "文件已存在" };
        }
        fs.writeFileSync(toPath, fs.readFileSync(fromPath));
        return { status: true, result: toPath };
    } catch (e) {
        // console.log(e.message);
        return { status: false, result: e };
    }
}

/**
 * @desc 剪切/重命名文件
 * @param {Object} obj - 入参对象
 * @param {string} obj.fromFile - 源文件名，如：bd_logo1.png
 * @param {string} obj.fromDirectory - 源目录，如：./old/images
 * @param {string} obj.toFile - 目标文件名，如：bd_logo1.png
 * @param {string} obj.toDirectory - 目标目录，如：./new/images
 * @param {boolean} obj.force - 是否强制覆盖，如：true
 * @returns {Object} res - 剪切结果
 */
function cutFile({ fromFile, fromDirectory, toFile, toDirectory, force } = {}) {
    // console.log('剪切/重命名文件');
    try {
        let fromPath = path.join(fromDirectory, fromFile);
        let toPath = path.join(toDirectory, toFile);
        if (fs.existsSync(toPath) && !force) {
            return { status: false, result: toPath, message: "文件已存在" };
        }
        fs.writeFileSync(toPath, fs.readFileSync(fromPath));
        fs.unlinkSync(fromPath);
        return { status: true, result: toPath };
    } catch (e) {
        // console.log(e.message);
        return { status: false, result: e };
    }
}

/**
 * @desc 删除文件
 * @param {Object} obj - 入参对象
 * @param {string} obj.fromFile - 源文件名，如：bd_logo1.png
 * @param {string} obj.fromDirectory - 源目录，如：./old/images
 * @returns {Object} res - 删除结果
 */
function deleteFile({ fromFile, fromDirectory } = {}) {
    // console.log('删除文件');
    try {
        let fromPath = path.join(fromDirectory, fromFile);
        fs.unlinkSync(fromPath);
        return { status: true, result: fromPath };
    } catch (e) {
        // console.log(e.message);
        return { status: false, result: e };
    }
}

/**
 * 生成目录
 * @param {Object} obj - 入参对象
 * @param {Array} obj.pathArr - 目录数组，如：["download", "images"]
 * @returns {Object} res - 生成结果
 */
function makeDirectory({ pathArr, root } = {}) {
    // console.log("生成目录");
    let args = [];
    if (!root) root = __dirname;
    let result = root;
    for (let pathName of pathArr) {
        args.push(pathName);
        result = path.join(root, ...args);
        if (!fs.existsSync(result)) {
            try {
                fs.mkdirSync(result);
            } catch (e) {
                // console.log(e.message);
                return { status: false, result: e };
                break;
            }
        }
    }
    // console.log("目录已生成  ");
    return { status: true, result };
}

/**
 * @desc 复制目录
 * @param {Object} obj - 入参对象
 * @param {string} obj.fromDirectory - 源目录，如：./old/images
 * @param {string} obj.toDirectory - 目标目录，如：./new/images
 * @param {boolean} obj.force - 是否强制覆盖，如：true
 * @returns {Object} res - 复制结果
 */
function copyDirectory({ fromDirectory, toDirectory, force } = {}) {
    // console.log('复制目录');
    try {
        let fromPath = path.join(fromDirectory);
        let toPath = path.join(toDirectory);
        if (fs.existsSync(toPath) && !force) {
            return { status: false, result: toPath, message: "目录已存在" };
        }
        fs.copyFileSync(fromPath, toPath);
        return { status: true, result: toPath };
    } catch (e) {
        // console.log(e.message);
        return { status: false, result: e };
    }
}

/**
 * @desc 列出当前目录下所有文件和目录 (参考 ls -lh)
 * @param {Object} obj - 入参对象
 * @param {string} obj.directory - 目录，如：./images
 * @returns {Object} res - 列出结果
 * */
function readDirectory({ directory, fileExtension } = {}) {
    // console.log('列出当前目录下所有文件和目录');
    try {
        let dir = directory || __dirname;
        let files = fs.readdirSync(dir);
        let result = [];
        let fileExtensionReg = fileExtension ? new RegExp(fileExtension, "i") : null;
        for (let file of files) {
            let stat = fs.statSync(path.join(dir, file));
            let isDirectory = stat.isDirectory();
            if (fileExtensionReg && !fileExtensionReg.test(file)) continue;
            result.push({
                name: file,
                size: stat.size,
                dateModified: new Date(stat.mtime).Format("yyyy-MM-dd hh:mm:ss"),
                isDirectory,
            });
        }
        return { status: true, result };
    } catch (e) {
        // console.log(e.message);
        return { status: false, result: e };
    }
}

export default {
    readFile,
    makeFile,
    copyFile,
    cutFile,
    deleteFile,
    makeDirectory,
    copyDirectory,
    readDirectory,
};
