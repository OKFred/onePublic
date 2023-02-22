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
    let status = true;
    let result = null;
    try {
        let fromPath = path.join(fromDirectory, fromFile);
        let toPath = path.join(toDirectory, toFile);
        if (fs.existsSync(toPath) && !force) {
            return { status: false, result: toPath, message: "文件已存在" };
        }
        fs.writeFileSync(toPath, fs.readFileSync(fromPath));
        return { status, result: toPath };
    } catch (e) {
        console.log(e);
        status = false;
        result = e;
        return { status, result: e };
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
    let status = true;
    let result = null;
    try {
        let fromPath = path.join(fromDirectory, fromFile);
        let toPath = path.join(toDirectory, toFile);
        if (fs.existsSync(toPath) && !force) {
            return { status: false, result: toPath, message: "文件已存在" };
        }
        fs.writeFileSync(toPath, fs.readFileSync(fromPath));
        fs.unlinkSync(fromPath);
        return { status, result: toPath };
    } catch (e) {
        console.log(e);
        status = false;
        result = e;
        return { status, result: e };
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
    let status = true;
    let result = null;
    try {
        let fromPath = path.join(fromDirectory, fromFile);
        fs.unlinkSync(fromPath);
        return { status, result: fromPath };
    } catch (e) {
        console.log(e);
        status = false;
        result = e;
        return { status, result: e };
    }
}

/**
 * 生成目录
 * @param {Object} obj - 入参对象
 * @param {Array} obj.pathArr - 目录数组，如：["download", "images"]
 * @returns {Object} res - 生成结果
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
    let status = true;
    let result = null;
    try {
        let fromPath = path.join(fromDirectory);
        let toPath = path.join(toDirectory);
        if (fs.existsSync(toPath) && !force) {
            return { status: false, result: toPath, message: "目录已存在" };
        }
        fs.copyFileSync(fromPath, toPath);
        return { status, result: toPath };
    } catch (e) {
        console.log(e);
        status = false;
        result = e;
        return { status, result: e };
    }
}

export default {
    copyFile,
    cutFile,
    deleteFile,
    makeDirectory,
    copyDirectory,
};
