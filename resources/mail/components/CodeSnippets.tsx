import React from "react";

interface CodeSnippetsProp {
  className?: string;
  value: string;
}

export const CodeSnippets = ({ className, value }: CodeSnippetsProp) => {
  return (
    <code
      className={
        className
          ? className
          : "inline-block p-4 py-4.5% w-11/12 bg-gray-100 rounded border border-gray-200 text-gray-800"
      }
    >
      {value}
    </code>
  );
};
