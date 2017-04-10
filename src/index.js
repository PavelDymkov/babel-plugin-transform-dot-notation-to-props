export default function({ types: t }) {
    return {
        inherits: require("babel-plugin-syntax-jsx"),

        visitor: {
            JSXOpeningElement: function (path) {
                let {name} = path.node;

                if (t.isJSXMemberExpression(name)) {

                }
            }
        }
    };
};