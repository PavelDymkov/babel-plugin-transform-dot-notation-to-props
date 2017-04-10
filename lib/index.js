"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (_ref) {
    var t = _ref.types;

    return {
        inherits: require("babel-plugin-syntax-jsx"),

        visitor: {
            JSXOpeningElement: function JSXOpeningElement(path) {
                var name = path.node.name;


                if (t.isJSXMemberExpression(name)) {}
            }
        }
    };
};

;
//# sourceMappingURL=index.js.map