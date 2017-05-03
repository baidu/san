
const fs = require('fs');
const path = require('path');

const REQ_RULE = /(=|^|\s)require\(\s*(['"])([^'"]+)['"]\s*\)/;

function pack(rootDir, mainFile) {
    let srcDir = path.resolve(rootDir, 'src');

    mainFile = mainFile || path.resolve(srcDir, 'main.js');

    let deps = depAnalyse(mainFile);

    return fileContent(mainFile, 1).replace(
        '// #[main-dependencies]',
        deps.map(dep => fileContent(dep)).join('\n\n')
    );
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

function fileContent(file, dontIgnoreExports) {
    return fs.readFileSync(file, 'UTF-8').split(/\r?\n/)
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

exports = module.exports = pack;
