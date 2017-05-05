const babel = require("babel-core");
const babelOptions = {
    plugins: ["transform-dot-notation-to-props"]
};


let input = `
let x = <div>
    <Component>
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
    
    <name:Component>
        <Component.Item>
            <div />
        </Component.Item>
    </name:Component>
</div>
`;

// babel.transform(input, babelOptions).code;
console.log( babel.transform(input, babelOptions).code );