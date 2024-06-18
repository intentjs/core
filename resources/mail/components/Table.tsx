import * as React from 'react';
import { Row, Column, Section, Hr } from '@react-email/components';

export const Table = ({ ...props }) => {
  return (
    <Section className="mb-2">
      {props.value.map((row: string[]) => {
        return (
          <Row>
            {row.map((column: string) => {
              return <Column>{column}</Column>;
            })}
            <Hr />
          </Row>
        );
      })}
    </Section>
  );
};
