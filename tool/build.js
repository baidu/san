
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const pack = require('./pack');
const uglifyJS = require('uglify-js');
const MOZ_SourceMap = require('source-map');

let editions = {
    ssr: {},

    '__': {
        ignoreFeatures: ['ssr', 'devtool', 'error']
    },

    min: {
        ignoreFeatures: ['ssr', 'devtool', 'error'],
        compress: 1
    },

    dev: {
        ignoreFeatures: ['ssr']
    },

    'modern': {
        ignoreFeatures: ['ssr', 'devtool', 'error', 'allua']
    },

    'modern.min': {
        ignoreFeatures: ['ssr', 'devtool', 'error', 'allua'],
        compress: 1
    },

    'modern.dev': {
        ignoreFeatures: ['ssr', 'allua']
    },

    spa: {
        ignoreFeatures: ['ssr', 'devtool', 'reverse', 'error']
    },

    'spa.min': {
        ignoreFeatures: ['ssr', 'devtool', 'reverse', 'error'],
        compress: 1
    },

    'spa.dev': {
        ignoreFeatures: ['ssr', 'reverse']
    },

    'spa.modern': {
        ignoreFeatures: ['ssr', 'devtool', 'reverse', 'error', 'allua']
    },

    'spa.modern.min': {
        ignoreFeatures: ['ssr', 'devtool', 'reverse', 'error', 'allua'],
        compress: 1
    },

    'spa.modern.dev': {
        ignoreFeatures: ['ssr', 'reverse', 'allua']
    }
};

function build() {
    let rootDir = path.resolve(__dirname, '..');
    let distDir = path.resolve(rootDir, 'dist');

    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir);
    }

    let version = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'package.json'))).version;

    let baseSource = pack(rootDir);
    let source = baseSource.content.replace(/##version##/g, version);


    Object.keys(editions).forEach(edition => {
        let option = editions[edition];
        let editionSource = clearFeatureCode(source, option.ignoreFeatures);
        let fileName = edition === '__' ? `san.js` : `san.${edition}.js`;
        let filePath = path.join(distDir, fileName);

        if (option.compress) {
            let ast = uglifyJS.parse(editionSource);
            ast.figure_out_scope({screw_ie8: false});
            ast = ast.transform(new uglifyJS.Compressor({screw_ie8: false}));

            // need to figure out scope again so mangler works optimally
            ast.figure_out_scope({screw_ie8: false});
            ast.compute_char_frequency({screw_ie8: false});
            ast.mangle_names({screw_ie8: false});

            editionSource = ast.print_to_string({screw_ie8: false});
        }
        else {
            editionSource += '//@ sourceMappingURL=' + path.join('./', fileName + '.map');

            assert(typeof path.parse(baseSource.base) === 'object', 'The base(entry file) must be a file path!');
            let map = new MOZ_SourceMap.SourceMapGenerator({
                file: fileName
            });
            let baseLineLength = fs.readFileSync(baseSource.base)
                .toString('utf8').split('// #[main-dependencies]')[0]
                .split('\n').length;

            for (let i = 0; i < baseSource.deps.length; i++) {
                let script = fs.readFileSync(baseSource.deps[i]);
                let fileSplit = script.toString('utf8').split('\n');
                let fileLineLength = fileSplit.length;
                for (let j = 0; j < fileLineLength; j++) {
                    map.addMapping({
                        source: path.relative(distDir, baseSource.deps[i]),
                        original: {
                            line: j + 1,
                            column: 0
                        },
                        generated: {
                            line: baseLineLength + j,
                            column: 0
                        }
                    });
                }
                baseLineLength = fileLineLength + 1 + baseLineLength;
            }
            fs.writeFileSync(`${filePath}.map`, map.toString(), 'UTF-8');
        }

        fs.writeFileSync(
            filePath,
            editionSource,
            'UTF-8'
        );
    });
}

function clearFeatureCode(source, ignoreFeatures) {
    if (!ignoreFeatures) {
        return source;
    }

    let beginRule = /^\s*\/\/\s*#\[begin\]\s*(\w+)\s*$/;
    let endRule = /^\s*\/\/\s*#\[end\]\s*$/;

    let featureRule = new RegExp('(' + ignoreFeatures.join('|') + ')');
    let state = 0;
    return source.split('\n')
        .map(line => {
            switch (state) {
                case 1:
                case 2:
                    if (endRule.test(line)) {
                        state = 0;
                    }
                    else if (state === 2) {
                        return '// ' + line;
                    }
                    break;

                case 0:
                    let match;
                    if ((match = beginRule.exec(line))) {
                        state = featureRule.test(match[1]) ? 2 : 1;
                    }
                    break;
            }

            return line;
        })
        .join('\n');
}

exports = module.exports = build;

build();
