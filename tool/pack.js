
const fs = require('fs');
const path = require('path');

// 匹配 require
const REQ_RULE = /(=|^|\s)require\(\s*(['"])([^'"]+)['"]\s*\)/;
// 匹配枚举类型依赖，规则为以 `-type.js` 结尾的文件
const ENUM_TYPE_RULE = /\/([^\/]+-type)\.js/;
// 记录枚举类型变量的 map
let enumTypes = {};

function pack(rootDir, mainFile) {
    let srcDir = path.resolve(rootDir, 'src');

    mainFile = mainFile || path.resolve(srcDir, 'main.js');

    let deps = depAnalyse(mainFile);

    return fileContent(mainFile, 1, []).replace(
        '// #[main-dependencies]',
        deps.map(dep => fileContent(dep.file, 0, dep.enum)).join('\n\n')
    );
}

function depAnalyse(targetFile) {
    let deps = [];
    let depsIndex = {};

    function analyse(file) {
        if (depsIndex[file]) {
            if (depsIndex[file] === 1) {
                if (file !== targetFile) {
                    deps.push({
                        file: file,
                        enum: Object.keys(enumTypes)
                    });
                }
                depsIndex[file] = 2;
            }
            return;
        }

        // 用于记录当前文件，依赖了哪些枚举类型
        let localEnumDeps = [];

        depsIndex[file] = 1;

        let lines = fs.readFileSync(file, 'UTF-8').split(/\r?\n/);
        lines.forEach(line => {
            let requireMatch = REQ_RULE.exec(line);

            if (requireMatch) {
                let dep = resolveDep(requireMatch[3], file);
                let enumTypeMatch = ENUM_TYPE_RULE.exec(dep);
                // 有枚举类型依赖
                if (enumTypeMatch) {
                    // 获取枚举变量名
                    let namespace = kebab2upperCamel(enumTypeMatch[1]);
                    // 获取枚举值
                    let namespaceEnum = require(dep);
                    // 记录相关信息
                    if (!enumTypes[namespace]) {
                        enumTypes[namespace] = namespaceEnum;
                    }
                    localEnumDeps.push(namespace);
                }
                analyse(dep);
            }
        });

        if (file !== targetFile && depsIndex[file] !== 2) {
            deps.push({
                // 依赖文件路径
                file: file,
                // 涉及到的枚举类型依赖
                enum: localEnumDeps
            });
        }
        depsIndex[file] = 2;
    }

    analyse(targetFile, 1);

    return deps;
}

function resolveDep(dep, inFile) {
    dep = path.resolve(path.dirname(inFile), dep);

    if (path.extname(dep) !== '.js') {
        dep += '.js';
    }

    return dep;
}

/**
 * 读取源码文件内容并执行一系列处理
 *
 * @param {string} file 文件路径
 * @param {boolean} dontIgnoreExports 产出是否不忽略 exports 语句
 * @param {string[]} localEnumDeps 文件所依赖的枚举变量列表
 * @return {string} 处理后的源码
 */
function fileContent(file, dontIgnoreExports, localEnumDeps) {
    return fs.readFileSync(file, 'UTF-8').split(/\r?\n/)
        .map(line => {
            if (localEnumDeps.length === 0) {
                return line;
            }
            for (let i = 0; i < localEnumDeps.length; i++) {
                let namespace = localEnumDeps[i];
                for (let enumName in enumTypes[namespace]) {
                    let replacer = namespace + '.' + enumName;
                    let replaceValue = enumTypes[namespace][enumName];
                    line = line.replace(replacer, replaceValue);
                }
            }
            return line;
        })
        .map(line => {
            if (/(=|^|\s)require\(['"]/.test(line)
                || (!dontIgnoreExports && /^\s*(module\.)?exports\s+=/.test(line))
            ) {
                return '// ' + line;
            }

            return line;
        })
        .join('\n');
}

/**
 * kebab 命名转大坨峰命名
 *
 * @param {string} source 源字符串
 * @return {string} 大坨峰格式字符串
 */
function kebab2upperCamel(source) {
    return source.replace(/(-|^)([a-z])/g, function (match, alpha, beta) {
        return beta.toUpperCase();
    });
}

exports = module.exports = pack;
