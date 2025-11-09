'use client';
import { useState } from 'react';
import { ChevronDown, ChevronRight, Zap } from 'lucide-react';
import { ParsedComponent } from '@/src/hooks/useComponentParser';

interface ComponentTreeProps {
  component: ParsedComponent;
  level?: number;
}

export default function ComponentTree({ component, level = 0 }: ComponentTreeProps) {
  const [open, setOpen] = useState(true);

  const hasChildren = component.children && component.children.length > 0;
  const indent = level * 20;

  return (
    <div style={{ marginLeft: indent }}>
      <div
        className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-100 rounded"
        onClick={() => setOpen(!open)}
      >
        {/* Collapse icon */}
        {hasChildren ? (
          open ? <ChevronDown size={14} /> : <ChevronRight size={14} />
        ) : (
          <span className="w-[14px]" /> // empty space for alignment
        )}

        {/* Component name */}
        <span className="font-semibold text-blue-700">{component.name}</span>

        {/* Props */}
        {component.props.length > 0 && (
          <span className="text-xs text-gray-500">
            props: {component.props.join(', ')}
          </span>
        )}

        {/* Hooks */}
        {component.hooks.length > 0 && (
          <span className="flex items-center gap-1 text-xs text-green-600">
            <Zap size={12} />
            {component.hooks.join(', ')}
          </span>
        )}
      </div>

      {/* Child components */}
      {open &&
        hasChildren &&
        component.children.map((child, index) => (
          <ComponentTree key={index} component={child} level={level + 1} />
        ))}
    </div>
  );
}
