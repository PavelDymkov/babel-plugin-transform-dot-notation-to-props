import { types as t } from "@babel/core";
import not from "logical-not";


export default () => ({
    name: "transform-dot-notation-to-props",

    manipulateOptions(_, parserOptions) {
        let { plugins } = parserOptions;

        if (not(plugins.includes("jsx"))) {
            plugins.push("jsx");
        }
    },

    visitor: {
        JSXElement(path, { opts: { ignoreCapitalizedProps } }) {
            let { node } = path;
            let { name: memberExpression } = node.openingElement;

            if (not(t.isJSXMemberExpression(memberExpression))) return;
            if (not(isCorrectTagName(memberExpression.object, path.parent))) return;

            let propertyIdentifier = memberExpression.property;

            if (ignoreCapitalizedProps) {
                let [firstChar] = propertyIdentifier.name;

                if (firstChar == firstChar.toUpperCase()) return;
            }

            let targetOpeningElementPath = path.parentPath.get("openingElement");

            if (propsExistsOn(targetOpeningElementPath, propertyIdentifier))
                throw new Error(`Duplicate props declaration: ${propertyIdentifier.name} is already exists`);

            let attributeValue = toAttributeValue(node.children.filter(notEmptyTextNode));

            if (attributeValue) {
                let attribute = t.jsxAttribute(propertyIdentifier, attributeValue);

                targetOpeningElementPath.pushContainer("attributes", attribute);
            }

            path.remove();
        }
    }
});


function isCorrectTagName({ name }, parentNode) {
    if (t.isJSXElement(parentNode)) {
        let parentNameNode = parentNode.openingElement.name;

        if (t.isJSXNamespacedName(parentNameNode)) {
            let { name: parentName } = parentNameNode.name;

            return name == parentName;
        }

        if (t.isJSXIdentifier(parentNameNode)) {
            return name == parentNameNode.name;
        }
    }

    return false;
}

function propsExistsOn({ node: { attributes } }, propertyIdentifier) {
    return attributes.findIndex(ofExistsAttributeWith, propertyIdentifier) != -1;
}

function ofExistsAttributeWith({name: identifier}) {
    return identifier.name == this.name;
}

function toAttributeValue(children) {
    if (children.length == 1) {
        let [node] = children;

        if (t.isJSXText(node)) return t.stringLiteral(node.value.trim());
        if (t.isJSXExpressionContainer(node)) return node;
        if (t.isJSXSpreadChild(node)) return t.jsxExpressionContainer(node.expression);

        return t.jsxExpressionContainer(node);
    }

    if (children.length == 0) {
        return null;
    }

    return toAttributeValue([t.jsxFragment(t.jsxOpeningFragment(), t.jsxClosingFragment(), children)]);
}

function notEmptyTextNode(node) {
    return t.isJSXText(node) ? node.value.trim() : true;
}
