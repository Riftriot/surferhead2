// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------

import { Identifier } from 'estree';
import { Transformer } from './index';
import { createTopGetWrapper } from '../node-builder';
import INSTRUCTION from '../instruction';
import { Syntax } from 'esotope-hammerhead';

// Transform:
// top -->
// __get$Top(top)

const transformer: Transformer<Identifier> = {
    name: 'top-get',

    nodeReplacementRequireTransform: false,

    nodeTypes: Syntax.Identifier,

    condition: (node, parent) => {
        if (node.name !== 'top' || !parent)
            return false;

        // Skip: const top = value;
        if (parent.type === Syntax.VariableDeclarator && parent.id === node)
            return false;

        // Skip: top = value || function x (top = value) { ... }
        if ((parent.type === Syntax.AssignmentExpression || parent.type === Syntax.AssignmentPattern) &&
            parent.left === node)
            return false;

        // Skip: function top() {}
        if ((parent.type === Syntax.FunctionExpression || parent.type === Syntax.FunctionDeclaration) &&
            parent.id === node)
            return false;

        // Skip: object.top || top.field
        if (parent.type === Syntax.MemberExpression && parent.property === node)
            return false;

        // Skip: { top: value }
        if (parent.type === Syntax.Property && parent.key === node)
            return false;

        // Skip: { top }
        if (parent.type === Syntax.Property && parent.value === node && parent.shorthand)
            return false;

        // Skip: top++ || top-- || ++top || --top
        if (parent.type === Syntax.UpdateExpression && (parent.operator === '++' || parent.operator === '--'))
            return false;

        // Skip: function (top) { ... } || function func(top) { ... } || top => { ... }
        if ((parent.type === Syntax.FunctionExpression || parent.type === Syntax.FunctionDeclaration ||
             parent.type === Syntax.ArrowFunctionExpression) && parent.params.indexOf(node) !== -1)
            return false;

        // Skip already transformed: __get$Top(top)
        if (parent.type === Syntax.CallExpression && parent.callee.type === Syntax.Identifier &&
            parent.callee.name === INSTRUCTION.getTop)
            return false;

        // Skip: class X { top () {} }
        if (parent.type === Syntax.MethodDefinition)
            return false;

        // Skip: class top { x () {} }
        if (parent.type === Syntax.ClassDeclaration)
            return false;

        // Skip: function x (...top) {}
        if (parent.type === Syntax.RestElement)
            return false;

        // Skip: export { top } from "module";
        if (parent.type === Syntax.ExportSpecifier)
            return false;

        // Skip: import { top } from "module";
        if (parent.type === Syntax.ImportSpecifier)
            return false;

        return true;
    },

    run: createTopGetWrapper,
};

export default transformer;
