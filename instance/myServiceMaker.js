/**
 * @author Fred
 * @desc 生成service文件，用于systemctl管理
 * @since 2023-03-28 09:52:00
 */

import explorer from "../service/client/explorer.js";
import child_process from "child_process";
export default main;

/**
 * @desc 配置文件参考
 * @type {{serviceOwner: string, serviceProgram: string, serviceProject: string, serviceParentFolder: string, serviceParams: string}}
 * */
let _config = {
    serviceOwner: "zq",
    serviceProgram: "NodeJS",
    serviceProject: "oneHub",
    serviceParentFolder: "/home/zq/WorkSpace/NodeJS/",
    // serviceExecuteFolder: "/home/zq/WorkSpace/NodeJS/oneHub/",
    serviceRepository: "https://github.com/OKFred/oneHub",
    serviceParams: "npm run build",
};

async function main() {
    let configDirectory = "./instance/myServices/";
    let configJSONFiles = explorer.readDirectory({
        directory: configDirectory,
        fileExtension: "json",
    });
    if (!configJSONFiles.status) return console.log("读取配置文件失败");
    console.log(`当前配置文件列表`, configJSONFiles.result);
    for (let configJSONFile of configJSONFiles.result) {
        let configObj = explorer.readFile({
            directory: configDirectory,
            fileName: configJSONFile.fileName,
        });
        if (!configObj.status) return console.log("读取配置文件失败");
        let configJSON = configObj.result;
        let config; //配置文件
        try {
            config = JSON.parse(configJSON);
        } catch (e) {
            console.log("配置文件解析失败。格式参考：", _config);
            return console.log(e.message);
        }
        try {
            config.serviceExecuteFolder = config.serviceParentFolder + config.serviceProject;
            config = await downloadServiceRepository(config);
            config = await prepareServiceEnvironment(config);
            config = await makeExecuteFile(config);
            config = await makeServiceFile(config);
            config = await initateService(config);
        } catch (e) {
            console.log(`服务创建失败：`, e);
        }
    }
}

async function downloadServiceRepository(config) {
    if (!config) throw new Error("FATAL");
    let { serviceRepository, serviceParentFolder } = config;
    let dirObj = explorer.makeDirectory({ pathStr: serviceParentFolder, force: true });
    if (!dirObj.status) return console.log("目录创建失败");
    return new Promise((resolve, reject) => {
        child_process.exec(
            `cd ${serviceParentFolder} && git clone ${serviceRepository}`,
            (error, stdout, stderr) => {
                if (error) {
                    console.log(`服务下载失败：`, error);
                    return resolve(false);
                }
                console.log(`服务下载成功`, stdout);
                return resolve(config);
            },
        );
    });
}

async function prepareServiceEnvironment(config) {
    if (!config) throw new Error("FATAL");
    let { serviceExecuteFolder } = config;
    return new Promise((resolve, reject) => {
        child_process.exec(`cd ${serviceExecuteFolder} && npm install`, (error, stdout, stderr) => {
            if (error) {
                console.log(`服务环境准备失败：`, error);
                return resolve(false);
            }
            console.log(`服务环境准备成功`, stdout);
            return resolve(config);
        });
    });
}

async function makeExecuteFile(config) {
    if (!config) throw new Error("FATAL");
    let { serviceProject, serviceParentFolder } = config;
    let pathStr = serviceParentFolder + serviceProject;
    let dirObj = explorer.makeDirectory({ pathStr, force: true });
    if (!dirObj.status) return console.log("目录创建失败");
    console.log("\n当前目录", dirObj.result);
    let content = makeExecuteTemplate(config);
    let fileObj = explorer.makeFile({
        directory: dirObj.result,
        fileName: `index.sh`,
        content,
        force: true,
    });
    if (!fileObj.status) return console.log("执行文件创建失败");
    console.log("\n文件创建成功", fileObj.result);
    //添加执行权限 777
    return new Promise((resolve, reject) => {
        child_process.exec(`chmod 777 ${pathStr}/index.sh`, (error, stdout, stderr) => {
            if (error) {
                console.log(`权限设置失败：`, error);
                return resolve(false);
            }
            console.log(`权限设置成功`, stdout);
            return resolve(config);
        });
    });
}

function makeServiceFile(config) {
    if (!config) throw new Error("FATAL");
    let { serviceOwner, serviceProgram, serviceProject } = config;
    let directory = "/etc/systemd/system/";
    let fileName = `${serviceOwner}_${serviceProgram}_${serviceProject}.service`;
    let content = makeServiceTemplate(config);
    let fileObj = explorer.makeFile({
        directory,
        fileName,
        content,
        force: true,
    });
    if (!fileObj.status) return console.log("服务文件创建失败");
    console.log("\n文件创建成功", fileObj.result);
    return config;
}

async function initateService(config) {
    if (!config) throw new Error("FATAL");
    let { serviceOwner, serviceProgram, serviceProject } = config;
    let service = `${serviceOwner}_${serviceProgram}_${serviceProject}`;
    let cmd = `systemctl daemon-reload && systemctl enable ${service} && systemctl list-unit-files --type=service | grep ${service}`;
    return new Promise((resolve, reject) => {
        child_process.exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.log(`服务启用失败：`, error);
                return resolve(false);
            }
            console.log(`服务启用成功`, stdout);
            return resolve(config);
        });
    });
}

/**
 * @desc 生成service文件
 * @param {Object} config
 * @return string
 * */
function makeServiceTemplate({
    serviceOwner,
    serviceProgram,
    serviceProject,
    serviceExecuteFolder,
    serviceParams,
} = {}) {
    return `[Unit]
Description=${serviceProgram}_${serviceProject}@自启动脚本
After=default.target

[Service]
ExecStart=${serviceExecuteFolder}/index.sh

[Install]
WantedBy=default.target
`;
}

/**
 * @desc 生成执行文件
 * @param {Object} config
 * @return string
 * */
function makeExecuteTemplate({
    serviceOwner,
    serviceProgram,
    serviceProject,
    serviceExecuteFolder,
    serviceParams,
} = {}) {
    let thisDate = new Date().Format("yyyy-MM-dd");
    return `#!/bin/bash
# ${serviceOwner}@${thisDate}
# 开机自启动脚本

# 等待系统启动完成，预留10s
sleep 10s

# 显示当前时间
date

# 启动程序
echo "${serviceProgram}_${serviceProject}启动中..."
cd ${serviceExecuteFolder}
${serviceParams}
`;
}
