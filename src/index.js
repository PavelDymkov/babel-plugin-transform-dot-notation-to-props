const t = require("babel-types");


function isCorrectTagName({name}, {parentPath: { node: parentNode }}) {
    if (t.isJSXElement(parentNode)) {
        let { name: parentName } = parentNode.openingElement.name;

        return name == parentName;
    }

    return false;
}

function toCorrectTypes(node) {
    if (t.isJSXText(node)) {
        return t.stringLiteral(node.value.trim());
    }

    if (t.isJSXElement(node)) {
        return node;
    }

    return t.nullLiteral();
}


export default function({ types: t }) {
    return {
        inherits: require("babel-plugin-syntax-jsx"),

        visitor: {
            JSXElement: function (path) {
                let { node } = path;
                let { name: memberExpression } = node.openingElement;

                if (t.isJSXMemberExpression(memberExpression) && isCorrectTagName(memberExpression.object, path)) {
                    let propertyIdentifier = memberExpression.property;

                    let originOpeningElementPath = path.parentPath.get("openingElement");
                    let {node: originOpeningElement} = originOpeningElementPath;

                    let arrayExpression = t.arrayExpression(node.children.map(toCorrectTypes));
                    let attributeValue = t.jSXExpressionContainer(arrayExpression);
                    let attribute = t.jSXAttribute(propertyIdentifier, attributeValue);

                    let attributes = [...originOpeningElement.attributes, attribute];

                    let openingElement = t.jSXOpeningElement(originOpeningElement.name, attributes, originOpeningElement.selfClosing);

                    originOpeningElementPath.replaceWith(openingElement);
                    path.remove();
                }
            }
        }
    };
};
