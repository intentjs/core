import React from "react";
import { CodeBlock, dracula } from "@react-email/code-block";

interface ReactComponentProp {
  value: {
    code: string;
    lineNumbers: boolean;
  };
}

export const InjectReactComponent = ({ value }: ReactComponentProp) => {
  return (
    <CodeBlock
      code={value.code}
      lineNumbers={value.lineNumbers}
      theme={dracula}
      language="javascript"
    />
  );
};
