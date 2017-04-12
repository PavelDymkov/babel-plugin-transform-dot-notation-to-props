const babel = require("babel-core");
const babelOptions = {
    plugins: [["transform-dot-notation-to-props", { wrapper: '<span class="x" data-attr="0" />' }]]
};


let input = `
let x = <Component>
    <Component.Item></Component.Item>
    <Component.Item />
    <Component.Item> string </Component.Item>
    <Component.Item> { 123 } </Component.Item>
    <Component.Item>
        <div>text</div>
    </Component.Item>
    <Component.Item>
        <div>text</div>
        <div>text</div>
    </Component.Item>
</Component>
`;

// babel.transform(input, babelOptions).code;
console.log( babel.transform(input, babelOptions).code );