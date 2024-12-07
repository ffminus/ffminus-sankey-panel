import React, { CSSProperties, FC } from 'react';

import { Rect } from 'types';

/** Properties to pass to `Node` component. */
type Props = {
  name: string;
  value: number;

  id: string;
  className: string;

  color: string;
  rect: Rect;
  width: number;

  label: { size: number; color: string };
};

/** Declare a source or target node of the graph. */
export const Node: FC<Props> = ({ id, name, value, className, color, rect: { x0, x1, y0, y1 }, width, label }) => (
  <>
    <rect
      name={name}
      data-value={`${value}`}
      id={id}
      className={className}
      x={x0}
      y={y0}
      width={x1 - x0}
      height={y1 - y0}
      stroke="black"
      fill={color}
    />
    <text x={x0 < width / 2 ? x1 + 6 : x0 - 6} y={(y1 + y0) / 2} style={styleLabel(x0, width, label)}>
      {name}
    </text>
  </>
);

/** List CSS properties to apply to graph node text. */
const styleLabel = (x0: number, width: number, label: { size: number; color: string }): CSSProperties => ({
  fill: label.color,
  alignmentBaseline: 'middle',
  fontSize: `${label.size}px`,
  textAnchor: x0 < width / 2 ? 'start' : 'end',
});
