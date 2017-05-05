const babel = require("babel-core");
const {assert} = require("chai");

const spaces = /\s+/g;
let options = {
    plugins: ["transform-dot-notation-to-props"]
};

function isEquil(input, expected) {
    let output = babel.transform(input, options).code;

    return output.replace(spaces, "") == expected.replace(spaces, "");
}


describe("transform-dot-notation-to-props tests", () => {
    it("should move div to prop array", () => {
        const input = `
            <Component>
                <Component.Item>
                    <div>text</div>
                </Component.Item>
            </Component>
        `;
        const output = `
            <Component Item={[<div>text</div>]}>
            </Component>;
        `;

        assert.isTrue(isEquil(input, output));
    });

    it("should transform empty item to empty array", () => {
        const input = `
            <Component>
                <Component.Item></Component.Item>
            </Component>
        `;
        const output = `
            <Component Item={[]}>
            </Component>;
        `;

        assert.isTrue(isEquil(input, output));
    });

    it("should transform empty item to empty array (2)", () => {
        const input = `
            <Component>
                <Component.Item />
            </Component>
        `;
        const output = `
            <Component Item={[]}>
            </Component>;
        `;

        assert.isTrue(isEquil(input, output));
    });

    it("should process string", () => {
        const input = `
            <Component>
                <Component.Item> string </Component.Item>
            </Component>
        `;
        const output = `
            <Component Item={["string"]}>
            </Component>;
        `;

        assert.isTrue(isEquil(input, output));
    });

    it("should process number", () => {
        const input = `
            <Component>
                <Component.Item> { 123 } </Component.Item>
            </Component>
        `;
        const output = `
            <Component Item={[123]}>
            </Component>;
        `;

        assert.isTrue(isEquil(input, output));
    });

    it("should add string to existing prop array", () => {
        const input = `
            <Component Item={["some string"]}>
                <Component.Item> string </Component.Item>
            </Component>
        `;
        const output = `
            <Component Item={["some string", "string"]}>
            </Component>;
        `;

        assert.isTrue(isEquil(input, output));
    });

    it("should add items to prop array", () => {
        const input = `
            <Component>
                <Component.Item>
                    <div>text 1</div>
                    <div>text 2</div>
                </Component.Item>
            </Component>
        `;
        const output = `
            <Component Item={[<div>text 1</div>, <div>text 2</div>]}>
            </Component>;
        `;

        assert.isTrue(isEquil(input, output));
    });

    it("should correct processing elements with namespace", () => {
        const input = `
            <name:Component>
                <Component.Item>
                    <div />
                </Component.Item>
            </name:Component>
        `;
        const output = `
            <name:Component Item={[<div />]}>
            </name:Component>;
        `;

        assert.isTrue(isEquil(input, output));
    });
});