const fs = require('fs');
const path = require('path');
const san = require('../dist/san')

console.log('----- Build Specs -----');


console.log(`[Build Spec] unpack-anode.spec.js`);

let code = `
function expectEqual(a, b) {
    var type = typeof a;
    expect(type).toBe(typeof b);

    if (a === null) {
        expect(b === null).toBeTruthy();
    }
    else {
        switch (type) {
            case 'boolean':
            case 'string':
            case 'number':
                expect(b === a).toBeTruthy();
                break;

            case 'undefined':
                expect(b == null).toBeTruthy();
                break;

            case 'object':
                for (var i in a) {
                    if (a.hasOwnProperty(i) && a[i] != null) {
                        expect(b.hasOwnProperty(i)).toBeTruthy();
                    }
                }
            
                for (var i in b) {
                    if (b.hasOwnProperty(i) && b[i] != null) {
                        expect(a.hasOwnProperty(i)).toBeTruthy();
                    }
                }
            
                for (var i in a) {
                    expectEqual(a[i], b[i]);
                }
                break;

            default:
                if (a instanceof Array) {
                    expect(b instanceof Array).toBeTruthy();
                    expect(a.length).toBe(b.length);

                    if (b instanceof Array && a.length === b.length) {
                        for (var i = 0; i < a.length; i++) {
                            expectEqual(a[i], b[i]);
                        }
                    }
                }
        }
    }
}

describe("Unpack ANode", function () {
`;

const packDir = path.resolve(__dirname, '../node_modules/san-anode-cases/pack');
fs.readdirSync(packDir).forEach(file => {
    file = path.parse(file);
    if (file.ext === '.tpl') {
        const tpl = fs.readFileSync(`${packDir}/${file.base}`, 'UTF-8');
        const packed = fs.readFileSync(`${packDir}/${file.name}.apack`, 'UTF-8');

        var aNode = JSON.stringify(san.parseTemplate(tpl).children[0]);
        code += `
        it("${file.name}", function () {
            var packed = ${packed};
            var aNode = ${aNode};

            expectEqual(san.unpackANode(packed), aNode);
    
        });
        `;
    }
});

code += '\n\n});';
fs.writeFileSync(`${__dirname}/unpack-anode.spec.js`, code, 'UTF-8');


