import React from 'react';

export const CodeSnippets = ({ ...props }) => {
  return (
    <code className="inline-block p-4 py-4.5% w-11/12 bg-gray-100 rounded border border-gray-200 text-gray-800 mb-[10px]">
      {props.value}
    </code>
  );
};
