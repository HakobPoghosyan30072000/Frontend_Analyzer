'use client'
import { useState } from 'react';
import { useComponentParser } from '../../hooks/useComponentParser';
import ComponentTree from './ComponentTree';

export default function ComponentUploader() {
  const [code, setCode] = useState('');
  const { parsed, error } = useComponentParser(code);
    console.log(parsed , error);
    
  return (
    <div className="p-4 space-y-4">
      <textarea
        className="w-full h-48 p-2 border rounded"
        placeholder="Paste your React component code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      {error && <div className="text-red-500">Error: {error}</div>}
      {parsed && <ComponentTree component={parsed} />}
    </div>
  );
}
