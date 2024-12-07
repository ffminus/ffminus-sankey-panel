import { FieldConfigProperty, PanelPlugin, SelectFieldConfigSettings } from '@grafana/data';

import { Sankey } from 'components/Sankey';
import { Alignment, ALIGNMENTS, Color, COLORS, Options } from 'options';

/** Hide all standard options except the ones that apply to our panel. */
const standardOptionsToInclude = ['unit', 'decimals'];

/** Declare panel plugin, along with its configuration widgets. */
export const plugin = new PanelPlugin<Options>(Sankey)
  .useFieldConfig({
    standardOptions: Object.fromEntries(
      Object.values(FieldConfigProperty)
        .filter((field) => !standardOptionsToInclude.includes(field))
        .map((field) => [field, { hideFromDefaults: true }])
    ),
  })
  .setPanelOptions((builder) =>
    builder
      .addRadio<Alignment, SelectFieldConfigSettings<Alignment>>({
        path: 'alignment',
        name: 'Alignment',
        defaultValue: 'Justify',
        settings: { options: Object.keys(ALIGNMENTS).map((a) => ({ value: a as Alignment, label: a })) },
      })
      .addRadio({
        path: 'node.colors.kind',
        name: 'Node color type',
        defaultValue: 'palette',
        settings: {
          options: [
            { value: 'single', label: 'Single' },
            { value: 'palette', label: 'Palette' },
          ],
        },
      })
      .addColorPicker({
        path: 'node.colors.single',
        name: 'Node color',
        defaultValue: 'green',
        showIf: ({ node }) => node.colors.kind === 'single',
      })
      .addSelect<Color, SelectFieldConfigSettings<Color>>({
        path: 'node.colors.palette',
        name: 'Node color palette',
        showIf: ({ node }) => node.colors.kind === 'palette',
        defaultValue: 'Category',
        settings: { options: Object.keys(COLORS).map((color) => ({ value: color as Color, label: color })) },
      })
      .addSliderInput({
        path: 'node.width',
        name: 'Node width',
        description: 'Width of nodes, in pixels',
        defaultValue: 15,
        settings: { min: 5, max: 100, step: 1 },
      })
      .addSliderInput({
        path: 'node.padding',
        name: 'Node padding',
        description: 'Padding between nodes, in pixels',
        defaultValue: 20,
        settings: { min: 0, max: 200, step: 1 },
      })
      .addSliderInput({
        path: 'node.label.size',
        name: 'Node label font size',
        description: 'Font size of node label, in pixels',
        defaultValue: 16,
        settings: { min: 4, max: 256, step: 1 },
      })
      .addColorPicker({
        path: 'node.label.color',
        name: 'Node label font color',
        defaultValue: 'white',
      })
      .addRadio({
        path: 'link.colors.kind',
        name: 'Link color type',
        defaultValue: 'gradient',
        settings: {
          options: [
            { value: 'single', label: 'Single' },
            { value: 'gradient', label: 'Gradient' },
          ],
        },
      })
      .addColorPicker({
        path: 'link.colors.single',
        name: 'Link color',
        defaultValue: 'grey',
        showIf: ({ link }) => link.colors.kind === 'single',
      })
      .addSliderInput({
        path: 'link.opacity',
        name: 'Link opacity',
        description: 'Opacity of links, from transparent to fully opaque',
        defaultValue: 0.4,
        settings: { min: 0.0, max: 1.0, step: 0.01 },
      })
  );
