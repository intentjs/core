import * as React from "react";
import { Row, Column, Section, Hr } from "@react-email/components";

interface TableProp {
  className?: string;
  value: string[][];
}

export const Table = ({ className, value }: TableProp) => {
  return (
    <Section className={className ? className : ""}>
      {value.map((row: string[], i) => {
        return (
          <Row key={i}>
            {row.map((column: string, j) => {
              return <Column key={j}>{column}</Column>;
            })}
            <Hr />
          </Row>
        );
      })}
    </Section>
  );
};
