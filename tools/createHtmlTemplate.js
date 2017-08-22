/**
 * 依据../src/html/template.html创建模板
 * 1、命令参数: --filename 文件名
 * 2、文件名是否存在, 存在提示并退出
 * 3、基础模板文件是否存在, 不存在提示并退出
 * 4、拷贝并生产新文件
 * 5、改进: 模板内容动态改版,执行命令时提示自定义内容的输入
 */
const path = require('path');
const fs = require('fs'), stat = fs.stat;

console.log('===========================');
console.log('  创建模板开始  ');


const argsArr = process.argv;
if (argsArr.length < 3) {
    console.log('请输入参数:--filename 模板的名字');
}
const filename = argsArr[2];
const execFilePath = argsArr[1];
const execDir = path.parse(execFilePath).dir;
const [htmlDir,viewsDir]=[path.resolve(__dirname, '../src/html'), path.resolve(__dirname, '../src/views')];
const [htmlType,viewsTypes]=['.html', ['.js', '.less', '.vue']];
const templateName = 'template';

//文件名校验
const filenameReg = /[^a-zA-Z0-9_\-]/ig;
if (filenameReg.test(filename) === true) {
    throw new Error(filename + ' 格式不正确，只能是英文、数字、"-"和"_"');
}

//文件是否已经存在
const newHtmlFile = htmlDir + path.sep + filename + htmlType;
if (fs.existsSync(newHtmlFile)) {
    console.log("  提示:" + htmlDir + '目录下已经存在： ' + filename + htmlType + "文件");
    console.log('===========================');
    return;
}
//模板文件是否存在
const templateFile = htmlDir + path.sep + templateName + htmlType;
if (!fs.existsSync(templateFile)) {
    console.log("  提示:" + '模板文件不存在： ' + templateFile);
    console.log('===========================');
    return;
}
//创建文件
const createFile = function (filePath) {
    fs.writeFileSync(filePath, '');
};
createFile(newHtmlFile);

//复制文件
const copyFile = function (srcFile, destFile) {
    let readable, writable;
    stat(srcFile, function (err, _srcFile) {
        if (err) {
            throw err;
        }
        // 判断是否为文件
        if (_srcFile.isFile()) {
            // 创建读取流
            readable = fs.createReadStream(srcFile);
            // 创建写入流
            writable = fs.createWriteStream(destFile);
            // 通过管道来传输流
            readable.pipe(writable);
        }
    });
};
copyFile(templateFile, newHtmlFile);
console.log('  文件:' + newHtmlFile + '创建成功');
function createViewsSonDir(name) {
    let viewsSonDir = viewsDir + path.sep + name;
    console.log("  提示:" + viewsSonDir);
    if (fs.existsSync(viewsSonDir)) {
        console.log("  提示:" + viewsDir + '目录下已经存在：' + name + '目录');
        console.log('===========================');
        return;
    }
    fs.mkdirSync(viewsSonDir);
    createViewsSonDirFile(viewsSonDir, name);
}

function createViewsSonDirFile(dir, name) {
    var typeList = ['.js', '.less', '.vue'];
    for (var i = 0; i < typeList.length; i++) {
        var filePath = dir + path.sep + name + typeList[i];
        createFile(filePath);
        var templateFile = viewsDir + path.sep + templateName + path.sep + templateName + typeList[i];
        copyFile(templateFile, filePath);
    }
}
createViewsSonDir(filename);
console.log('  创建模板结束');
console.log('===========================');