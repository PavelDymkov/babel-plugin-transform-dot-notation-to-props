const { assert } = require("chai");
const createPluginTestHelper = require("babel-plugin-test-helper");

const isEqual = createPluginTestHelper(require("../"));


describe("transform-dot-notation-to-props tests", () => {
    it("should move div to props", () => {
        const input = `
            <component>
                <component.item>
                    <div />
                </component.item>
            </component>
        `;
        const output = `
            <component item={<div />}>
            </component>;
        `;

        assert.isTrue(isEqual(input, output));
    });

    it("should just remove empty item", () => {
        const input = `
            <component>
                <component.item>
                </component.item>

                <component.anotherItem />
            </component>;
        `;
        const output = `
            <component></component>;
        `;

        assert.isTrue(isEqual(input, output));
    });

    it("should trim string and append to props as string", () => {
        const input = `
            <component>
                <component.item>  string  </component.item>
            </component>;
        `;
        const output = `
            <component item="string"></component>;
        `;

        assert.isTrue(isEqual(input, output));
    });

    it("should append experession to props", () => {
        const input = `
            <component>
                <component.item> { 123 } </component.item>
            </component>;
        `;
        const output = `
            <component item={123}></component>;
        `;

        assert.isTrue(isEqual(input, output));
    });

    it("should add items to props as jsx fragment", () => {
        const input = `
            <component>
                <component.item>
                    <div>text 1</div>
                    <div>text 2</div>
                </component.item>
            </component>;
        `;
        const output = `
            <component item={<><div>text 1</div><div>text 2</div></>}>
            </component>;
        `;

        assert.isTrue(isEqual(input, output));
    });

    it("should correct processing elements with namespace", () => {
        const input = `
            <name:component>
                <component.item>
                    <div />
                </component.item>
            </name:component>;
        `;
        const output = `
            <name:component item={<div />}>
            </name:component>;
        `;

        assert.isTrue(isEqual(input, output));
    });

    it("should ignore capitalized props", () => {
        let input = `
            <component>
                <component.Item>text</component.Item>
                <component.item>text</component.item>
            </component>;
        `;
        const output = `
            <component item="text">
                <component.Item>text</component.Item>
            </component>;
        `;

        assert.isTrue(isEqual(input, output, { ignoreCapitalizedProps: true }));
    });
});