
const fs = require('fs');
const path = require('path');

// 匹配 require
const REQ_RULE = /(=|^|\s)require\(\s*(['"])([^'"]+)['"]\s*\)/;

// 需要优化的 enum 变量
const OPTI_ENUM = {
    ExprType: require('../src/parser/expr-type'),
    NodeType: require('../src/view/node-type'),
    DataChangeType: require('../src/runtime/data-change-type')
};

const OPTI_ENUM_REPLACE_REG = new RegExp(
    '(' + Object.keys(OPTI_ENUM).join('|') + ')\\.([A-Z_]+)',
    'g'
);

function optiEnumReplaceFn(match, type, prop) {
    if (!(prop in OPTI_ENUM[type])) {
        throw new Error(`[ENUM OPTI ERROR] ${type} has not property ${prop}`);
    }

    return OPTI_ENUM[type][prop];
}


function pack(rootDir, mainFile) {
    let srcDir = path.resolve(rootDir, 'src');

    mainFile = mainFile || path.resolve(srcDir, 'main.js');

    let deps = depAnalyse(mainFile);
    return {
        content: fileContent(mainFile, 1, []).replace(
            '// #[main-dependencies]',
            deps.map(dep => fileContent(dep)).join('\n\n')),
        deps: deps,
        base: mainFile
    };
}

function depAnalyse(targetFile) {
    let deps = [];
    let depsIndex = {};

    function analyse(file) {
        if (depsIndex[file]) {
            if (depsIndex[file] === 1) {
                if (file !== targetFile) {
                    deps.push(file);
                }
                depsIndex[file] = 2;
            }
            return;
        }

        depsIndex[file] = 1;

        let lines = fs.readFileSync(file, 'UTF-8').split(/\r?\n/);
        lines.forEach(line => {
            let requireMatch = REQ_RULE.exec(line);

            if (requireMatch) {
                let dep = resolveDep(requireMatch[3], file);
                analyse(dep);
            }
        });

        if (file !== targetFile && depsIndex[file] !== 2) {
            deps.push(file);
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
 * @return {string} 处理后的源码
 */
function fileContent(file, dontIgnoreExports) {
    return fs.readFileSync(file, 'UTF-8').split(/\r?\n/)
        .map(line => {
            if (/(=|^|\s)require\(['"]/.test(line)
                || (!dontIgnoreExports && /^\s*(module\.)?exports\s+=/.test(line))
            ) {
                return '// ' + line;
            }

            return line.replace(OPTI_ENUM_REPLACE_REG, optiEnumReplaceFn);
        })
        .join('\n');
}


exports = module.exports = pack;
