import { Field, PanelProps } from '@grafana/data';
import { PanelDataErrorView } from '@grafana/runtime';
import React, { FC } from 'react';

import { Options } from 'options';

/** Sankey graph to display nodes and flows. */
export const Sankey: FC<PanelProps<Options>> = ({ options, data, width, height, id }) => {
  // ? Capture parameters shared by all errors in a closure
  const fail = (m: string) => <PanelDataErrorView message={m} panelId={id} data={data} />;

  // Extract main series from object provided by caller
  const [series] = data.series;

  // Ensure caller provided at least one data series
  if (series === undefined) {
    return fail('No data');
  }

  // Index columns by their name for faster look-up
  const fieldsByFieldName = new Map(series.fields.map((field) => [field.name, field]));

  // Ensure required columns are present, with the correct name
  for (const field of ['source', 'target', 'value']) {
    if (!fieldsByFieldName.has(field)) {
      return fail(`Data is missing a '${field}' field`);
    }
  }

  // ! Field exists, valid to cast to access column type
  const values = fieldsByFieldName.get('value') as Field<any>;

  // Ensure values have correct type
  if (values.type !== 'number') {
    return fail(`Column 'value' has type '${values.type}', expected 'number'`);
  }

  return (
    <>
    </>
  );
};
