import { DataFrame, DataFrameView, Field, PanelProps } from '@grafana/data';
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

  // Prepare input data for graph
  const { nodes, links } = parse(series, id);

  return (
    <>
    </>
  );
};

/** Convert input data from user query into Sankey nodes and links. */
const parse = (series: DataFrame, panel: number) => {
  // Convert rows into a dataframe for ease of access
  const frame = new DataFrameView<{ source: string; target: string; value: number }>(series);

  // Identify all individual node names
  const names = new Set<string>(frame.flatMap(({ source, target }) => [source, target]));

  // Build nodes objects out of names
  const nodes = Array.from(names).map((name) => ({ name }));

  // Map a node name to its associated index
  const nodeIdByName = new Map(nodes.map(({ name }, i) => [name, i]));

  // Sankey API expects links to refer to nodes by their index
  const links = frame.map(({ source: sourceName, target: targetName, value }, i) => {
    // Identify links with globally unique names across panels
    const id = `sankey-${panel}-link-${i}`;

    // ! Names are present in map by construction, cast is valid
    const source = nodeIdByName.get(sourceName) as number;
    const target = nodeIdByName.get(targetName) as number;

    return { value, id, uid: `url(#${id})`, source, target };
  });

  return { nodes, links };
};
