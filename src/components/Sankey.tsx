import { DataFrame, DataFrameView, DisplayProcessor, Field, PanelProps } from '@grafana/data';
import { PanelDataErrorView } from '@grafana/runtime';
import { scaleOrdinal } from 'd3';
import { sankey } from 'd3-sankey';
import React, { FC } from 'react';

import { ALIGNMENTS, COLORS, Options } from 'options';
import { Rect } from 'types';

import { Link, LinkData } from './Link';
import { Node } from './Node';
import { Tooltip } from './Tooltip';

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

  // Specify size of SVG with a pair
  const dimensions: [number, number] = [width, height];

  // Build Sankey graph with provided parameters
  const graph = sankey<{ name: string }, { source: number; target: number; value: number; id: string; uid: string }>()
    .nodeAlign(ALIGNMENTS[options.alignment])
    .nodeWidth(options.node.width)
    .nodePadding(options.node.padding)
    .extent([[1, 1], dimensions])({ nodes, links });

  // Pick node colors based on value or palette provided by user
  const getColor =
    options.node.colors.kind === 'single'
      ? () => options.node.colors.single
      : scaleOrdinal(COLORS[options.node.colors.palette]);

  // ? Assert shape of node data coming from link object
  const getColorOfLink =
    options.link.colors.kind === 'single'
      ? () => ({ source: options.link.colors.single, target: options.link.colors.single })
      : (source: { name: string }, target: { name: string }) => ({
          source: getColor(source.name),
          target: getColor(target.name),
        });

  return (
    <>
      <svg width={width} height={height}>
        <g fill="none" strokeOpacity={options.link.opacity}>
          {graph.links.map((data, i) => (
            <Link
              key={`link-${i}`}
              id={id}
              colors={getColorOfLink(data.source as { name: string }, data.target as { name: string })}
              data={data as LinkData}
            />
          ))}
        </g>
        <g>
          {graph.nodes.map(({ name, value, ...rect }, i) => (
            <Node
              key={`node-${i}`}
              name={name}
              value={value as number}
              id={`sankey-${id}-node-${i}`}
              className={`sankey-${id}-node`}
              color={getColor(name)}
              rect={rect as Rect}
              width={width}
              label={options.node.label}
            />
          ))}
        </g>
        <Tooltip id={id} fmt={values.display as DisplayProcessor} opacity={options.link.opacity} />
      </svg>
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
