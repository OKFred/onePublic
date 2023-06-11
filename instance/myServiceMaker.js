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
 * @type {{serviceOwner: string, serviceProgram: string, serviceProject: string, serviceExecutePath: string, serviceParams: string}}
 * */
let _config = {
    serviceOwner: "zq",
    serviceProgram: "NodeJS",
    serviceProject: "rpcServer",
    serviceExecutePath: "/home/zq/WorkSpace/NodeJS/rpcServer",
    serviceParams: "npm run pro",
};

function main() {
    let configDirectory = "./instance/myServices/";
    let configJSONFiles = explorer.readDirectory({
        directory: configDirectory,
        fileExtension: "json",
    });
    if (!configJSONFiles.status) return console.log("读取配置文件失败");
    console.log(`当前配置文件列表`,configJSONFiles.result);
    for (let configJSONFile of configJSONFiles.result) {
        let configObj = explorer.readFile({
            directory: configDirectory,
            fileName: configJSONFile.fileName,
        });
        if (!configObj.status) return console.log("读取配置文件失败");
        let configJSON = configObj.result;
        try {
            let config = JSON.parse(configJSON);
            makeExecuteFile(config);
            makeServiceFile(config);
            initateService(config);
        } catch (e) {
            console.log(`${configJSONFile} 配置文件无效`, e);
            console.log("参考格式", _config);
        }
    }
}

function makeExecuteFile(config = {}) {
    let { serviceProject, serviceExecutePath } = config;
    let pathArr = serviceExecutePath.split("/");
    let root = "/";
    pathArr.pop();
    pathArr.unshift(root);
    let dirObj =  explorer.makeDirectory({ pathArr, root });
    if (!dirObj.status) return console.log("目录创建失败");
    console.log("\n当前目录", dirObj.result);
    let content = makeExecuteTemplate(config);
    let fileObj = explorer.makeFile({
        directory: dirObj.result,
        fileName: `${serviceProject}.sh`,
        content,
        force: true,
    });
    if (!fileObj.status) return console.log("执行文件创建失败");
    console.log("\n文件创建成功", fileObj.result);
}

function makeServiceFile(config = {}) {
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
}

function initateService(config = {}) {
    let { serviceOwner, serviceProgram, serviceProject } = config;
    let service = `${serviceOwner}_${serviceProgram}_${serviceProject}`;
    let cmd = `systemctl daemon-reload && systemctl enable ${service} && systemctl start ${service} && systemctl status ${service} && systemctl list-unit-files --type=service | grep ${service}`;
    child_process.exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.log(`服务运行失败：`, error);
            return;
        }
        console.log(`服务运行成功`, stdout);
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
    serviceExecutePath,
    serviceParams,
} = {}) {
    return `
[Unit]
Description=${serviceProgram}_${serviceProject}@自启动脚本
After=default.target

#
[Service]
ExecStart=${serviceExecutePath}/${serviceProject}.sh

#
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
    serviceExecutePath,
    serviceParams,
} = {}) {
    let thisDate = new Date().Format("yyyy-MM-dd");
    return `
#!/bin/bash
# ${serviceOwner}@${thisDate}
# 开机自启动脚本

# 等待系统启动完成，预留15s
#sleep 15s

# 显示当前时间
#date

# 启动程序
echo "${serviceProgram}_${serviceProject}启动中..."
cd ${serviceExecutePath}
${serviceParams}
`;
}
