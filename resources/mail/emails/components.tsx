import * as React from "react";

import { Image } from "../components/Image";
import { Greetings } from "../components/Greetings";
import { ActionButton } from "../components/button";
import { Regards } from "../components/Regards";
import { Table } from "../components/Table";
import { InjectMarkdown } from "../components/InjectMarkdown";
import { InjectReactComponent } from "../components/InjectReactComponent";
import { CodeSnippets } from "../components/codeBlock";
import { CText } from "../components/CText";
import { CLink } from "../components/CLink";
import { HrLine } from "../components/HrLine";
import { ICodeInline } from "../components/codeInline";

export const ComponentBuilder = ({
  type,
  value,
  ...props
}: Record<string, any>) => {
  if (type === "button") {
    return <ActionButton value={value} className={props.className} />;
  }

  if (type === "code") {
    return <CodeSnippets value={value} className={props.className} />;
  }

  if (type === "greeting") {
    return <Greetings value={value} {...props} />;
  }

  if (type === "image") {
    return <Image value={value} {...props} />;
  }

  if (type === "line") {
    return <HrLine value={value} {...props} />;
  }

  if (type === "link") {
    return <CLink value={value} className={props.className} />;
  }

  if (type === "markdown") {
    return <InjectMarkdown value={value} className={props.className} />;
  }

  if (type === "component") {
    return <InjectReactComponent {...props} />;
  }

  if (type === "regard") {
    return <Regards value={value} {...props} />;
  }

  if (type === "table") {
    return <Table value={value} {...props} />;
  }

  if (type === "text") {
    return <CText value={value} className={props.className} />;
  }

  if (type === "code-inline") {
    return <ICodeInline value={value} />;
  }
};
