// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------

import { Identifier } from 'estree';
import { Transformer } from './index';
import { createParentGetWrapper } from '../node-builder';
import INSTRUCTION from '../instruction';
import { Syntax } from 'esotope-hammerhead';

// Transform:
// parent -->
// __get$Parent(parent)

const transformer: Transformer<Identifier> = {
    name: 'parent-get',

    nodeReplacementRequireTransform: false,

    nodeTypes: Syntax.Identifier,

    condition: (node, parent) => {
        if (node.name !== 'parent' || !parent)
            return false;

        // Skip: const parent = value;
        if (parent.type === Syntax.VariableDeclarator && parent.id === node)
            return false;

        // Skip: parent = value || function x (parent = value) { ... }
        if ((parent.type === Syntax.AssignmentExpression || parent.type === Syntax.AssignmentPattern) &&
            parent.left === node)
            return false;

        // Skip: function parent() {}
        if ((parent.type === Syntax.FunctionExpression || parent.type === Syntax.FunctionDeclaration) &&
            parent.id === node)
            return false;

        // Skip: object.parent || parent.field
        if (parent.type === Syntax.MemberExpression && parent.property === node)
            return false;

        // Skip: { parent: value }
        if (parent.type === Syntax.Property && parent.key === node)
            return false;

        // Skip: { parent }
        if (parent.type === Syntax.Property && parent.value === node && parent.shorthand)
            return false;

        // Skip: parent++ || parent-- || ++parent || --parent
        if (parent.type === Syntax.UpdateExpression && (parent.operator === '++' || parent.operator === '--'))
            return false;

        // Skip: function (parent) { ... } || function func(parent) { ... } || parent => { ... }
        if ((parent.type === Syntax.FunctionExpression || parent.type === Syntax.FunctionDeclaration ||
             parent.type === Syntax.ArrowFunctionExpression) && parent.params.indexOf(node) !== -1)
            return false;

        // Skip already transformed: __get$Parent(parent)
        if (parent.type === Syntax.CallExpression && parent.callee.type === Syntax.Identifier &&
            parent.callee.name === INSTRUCTION.getParent)
            return false;

        // Skip: class X { parent () {} }
        if (parent.type === Syntax.MethodDefinition)
            return false;

        // Skip: class parent { x () {} }
        if (parent.type === Syntax.ClassDeclaration)
            return false;

        // Skip: function x (...parent) {}
        if (parent.type === Syntax.RestElement)
            return false;

        // Skip: export { parent } from "module";
        if (parent.type === Syntax.ExportSpecifier)
            return false;

        // Skip: import { parent } from "module";
        if (parent.type === Syntax.ImportSpecifier)
            return false;

        return true;
    },

    run: createParentGetWrapper,
};

export default transformer;
