const babel = require("babel-core");
const babelOptions = {
    plugins: [["transform-dot-notation-to-props", { wrapper: '<span class="x" data-attr="0" />' }]]
};


let input = `
let x = <Component>
    <Component.Item> foo </Component.Item>
    <Component.Item> bar </Component.Item>
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