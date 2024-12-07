import { DisplayProcessor, formattedValueToString } from '@grafana/data';
import { BaseType, select, selectAll, Selection } from 'd3';
import { FC, useEffect, useState } from 'react';

export const Tooltip: FC<{ id: number; fmt: DisplayProcessor; opacity: number }> = ({ id, fmt, opacity }) => {
  // Read and update mouse position with a dedicated store
  const [mousePosition, setMousePosition] = useState({ mouseX: 0, mouseY: 0 });

  // Track mouse movement to spawn tooltip under mouse on hover
  const trackMousePosition = (e: MouseEvent) => setMousePosition({ mouseX: e.clientX, mouseY: e.clientY });

  // Style tooltip to display values on hover
  const showTooltip = (node: Selection<BaseType, unknown, null, undefined>) =>
    select('body')
      .append('div')
      .attr('id', `${node.attr('id')}-tooltip`)
      .text(() => `${node.attr('name')}: ${formattedValueToString(fmt(node.attr('data-value')))}`)
      .style('left', mousePosition.mouseX + 'px')
      .style('top', mousePosition.mouseY + 'px')
      .style('opacity', 0)
      .style('color', 'white')
      .style('background', '#19191A')
      .style('padding', '10px 15px')
      .style('border', '#A8A8A8 solid 2px')
      .style('border-radius', '5px')
      .style('z-index', '1')
      .style('position', 'absolute')
      .transition()
      .duration(200)
      .style('opacity', 1.0);

  // Clean up tooltip on mouse away
  const hideTooltip = (node: Selection<BaseType, unknown, null, undefined>) =>
    select(`#${node.attr('id')}-tooltip`).remove();

  // Dim all other flows on link hover
  const setLinkOpacityExceptLinkId = (opacity: number, linkId: string) =>
    selectAll(`.sankey-${id}-link`).each(function () {
      const link = select(this);

      if (link.attr('id') !== linkId) {
        link.transition().duration(300).style('opacity', opacity);
      }
    });

  useEffect(() => {
    window.addEventListener('mousemove', trackMousePosition);

    selectAll(`.sankey-${id}-node`)
      .on('mouseover', function () {
        showTooltip(select(this));
      })
      .on('mouseout', function () {
        hideTooltip(select(this));
      });

    selectAll(`.sankey-${id}-link`)
      .on('mouseover', function () {
        const link = select(this);
        showTooltip(link);
        setLinkOpacityExceptLinkId(Math.max(0.1, opacity - 0.2), link.attr('id'));
      })
      .on('mouseout', function () {
        const link = select(this);
        hideTooltip(link);
        setLinkOpacityExceptLinkId(opacity, link.attr('id'));
      });

    return () => window.removeEventListener('mousemove', trackMousePosition);
  });

  return null;
};
