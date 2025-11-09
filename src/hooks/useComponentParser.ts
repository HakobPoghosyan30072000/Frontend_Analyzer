import { useState, useEffect } from 'react';
import * as BabelParser from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

export interface ParsedComponent {
  name: string;
  props: string[];
  hooks: string[];
  children: ParsedComponent[];
  renders?: string[];
}

export const useComponentParser = (code: string) => {
  const [parsed, setParsed] = useState<ParsedComponent | null>(null);
  const [error, setError] = useState<string | null>(null);
  console.log(error, 'error')
  
  useEffect(() => {
    const trimmed = code.trim();
    if (!trimmed) {
      setParsed(null);
      setError(null);
      return;
    }

    try {
      const ast = BabelParser.parse(trimmed, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      });

      const rootComponent: ParsedComponent = {
        name: 'Root',
        props: [],
        hooks: [],
        children: [],
      };

      const analyzeFunction = (
        fnPath: NodePath<t.FunctionDeclaration> | NodePath<t.ArrowFunctionExpression>,
        name: string
      ) => {
        const props: string[] = [];
        const hooks: string[] = [];
        const renders: string[] = [];

        fnPath.traverse({
          // Collect hooks
          CallExpression(callPath: NodePath<t.CallExpression>) {
            const callee = callPath.node.callee;
            if (t.isIdentifier(callee) && callee.name.startsWith('use')) {
              hooks.push(callee.name);
            }
          },
          // Collect rendered JSX components
          JSXOpeningElement(jsxPath: NodePath<t.JSXOpeningElement>) {
            const tag = jsxPath.node.name;
            if (t.isJSXIdentifier(tag)) {
              const tagName = tag.name;
              // Uppercase tags = React components (not HTML)
              if (tagName[0] === tagName[0].toUpperCase()) {
                renders.push(tagName);
              }
            }
          },
        });

        rootComponent.children.push({ name, props, hooks, children: [], renders });
      };

      traverse(ast, {
        FunctionDeclaration(path: NodePath<t.FunctionDeclaration>) {
          const name = path.node.id?.name || 'AnonymousFunction';
          analyzeFunction(path, name);
        },
        VariableDeclarator(path: NodePath<t.VariableDeclarator>) {
          const id = path.node.id;
          const init = path.node.init;
          if (t.isIdentifier(id) && t.isArrowFunctionExpression(init)) {
            analyzeFunction(path.get('init') as NodePath<t.ArrowFunctionExpression>, id.name);
          }
        },
      });

      queueMicrotask(() => {
        setParsed(rootComponent);
        setError(null);
      });
    } catch (e: unknown) {
      queueMicrotask(() => {
        if (e instanceof Error) setError(e.message);
        else setError(String(e));
        setParsed(null);
      });
    }
  }, [code]);

  return { parsed, error };
};
