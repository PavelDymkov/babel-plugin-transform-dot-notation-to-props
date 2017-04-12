export default function({ types: t }) {
    return {
        inherits: require("babel-plugin-syntax-jsx"),

        visitor: {
            JSXElement: function (path) {
                let {node} = path;
                let {name: memberExpression} = node.openingElement;

                if (!t.isJSXMemberExpression(memberExpression))
                    return;
                if (!isCorrectTagName(memberExpression.object, path))
                    return;

                let propertyIdentifier = memberExpression.property;

                let originOpeningElementPath = path.parentPath.get("openingElement");
                let {node: originOpeningElement} = originOpeningElementPath;
                let attributes = [...originOpeningElement.attributes];

                let elements = null;
                let index = attributes.findIndex(ofExistsAttributeWith, propertyIdentifier);

                if (index == -1) {
                    elements = node.children.reduce(toCorrectTypes, []);
                } else {
                    let [{value: originAttributeValue}] = attributes.splice(index, 1);

                    let originElements =
                        isCorrectAttributeValueType(originAttributeValue) ?
                            originAttributeValue.expression.elements : [];

                    elements = [...originElements, ...node.children.reduce(toCorrectTypes, [])];
                }

                let arrayExpression = t.arrayExpression(elements);
                let attributeValue = t.jSXExpressionContainer(arrayExpression);
                let attribute = t.jSXAttribute(propertyIdentifier, attributeValue);

                attributes.push(attribute);

                let openingElement = t.jSXOpeningElement(originOpeningElement.name, attributes, originOpeningElement.selfClosing);

                originOpeningElementPath.replaceWith(openingElement);

                path.remove();
            }
        }
    };


    function isCorrectTagName({name}, {parentPath: { node: parentNode }}) {
        if (t.isJSXElement(parentNode)) {
            let { name: parentName } = parentNode.openingElement.name;

            return name == parentName;
        }

        return false;
    }

    function toCorrectTypes(array, node) {
        if (t.isJSXText(node)) {
            let text = node.value.trim();

            if (text) {
                array.push(t.stringLiteral(text));
            }
        }

        if (t.isJSXExpressionContainer(node)) {
            array.push(node.expression);
        }

        if (t.isJSXElement(node)) {
            array.push(node);
        }

        return array;
    }

    function ofExistsAttributeWith({name: identifier}) {
        return identifier.name == this.name;
    }

    function isCorrectAttributeValueType(value) {
        return t.isJSXExpressionContainer(value) && t.isArrayExpression(value.expression);
    }
};
