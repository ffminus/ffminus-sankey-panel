import { sankeyLinkHorizontal } from 'd3-sankey';
import React, { FC } from 'react';

import { Rect } from 'types';

/** Properties required to display path between two nodes. */
export type LinkData = {
  source: Rect & { name: string };
  target: Rect & { name: string };
  value: number;

  id: string;
  uid: string;

  width: number;
};

/** Properties to pass to `Link` component. */
type Props = { id: number; colors: { source: string; target: string }; data: LinkData };

/** Declare flow to link a source and a target node of the graph. */
export const Link: FC<Props> = ({ id, colors, data }) => (
  <g>
    <linearGradient id={data.id} gradientUnits="userSpaceOnUse" x1={data.source.x1} x2={data.target.x0}>
      <stop offset="0%" stopColor={colors.source} />
      <stop offset="100%" stopColor={colors.target} />
    </linearGradient>
    <path
      name={`${data.source.name} → ${data.target.name}`}
      data-value={data.value}
      id={data.id}
      className={`sankey-${id}-link`}
      d={sankeyLinkHorizontal()(data) ?? undefined}
      fill="none"
      stroke={data.uid}
      strokeWidth={Math.max(1, data.width)}
    />
  </g>
);
