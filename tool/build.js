
const fs = require('fs');
const path = require('path');
const pack = require('./pack');
const uglifyJS = require('uglify-js');


let editions = {
    all: {
        compress: 1,
        ignoreFeatures: ['devtool', 'error']
    },

    source: {},

    release: {
        ignoreFeatures: ['ssr', 'devtool']
    },

    spa: {
        ignoreFeatures: ['ssr', 'devtool', 'reverse']
    }

};

function build() {
    let rootDir = path.resolve(__dirname, '..');
    let distDir = path.resolve(rootDir, 'dist');
    let version = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'package.json'))).version;

    let source = pack(rootDir).replace('##version##', version);


    Object.keys(editions).forEach(edition => {
        let option = editions[edition];
        let editionSource = clearFeatureCode(source, option.ignoreFeatures);

        if (option.compress) {
            let ast = uglifyJS.parse(editionSource);
            ast.figure_out_scope();
            ast = ast.transform(new uglifyJS.Compressor());

            // need to figure out scope again so mangler works optimally
            ast.figure_out_scope();
            ast.compute_char_frequency();
            ast.mangle_names();

            editionSource = ast.print_to_string();
        }

        fs.writeFileSync(
            `${distDir}/san.${edition}.js`,
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
