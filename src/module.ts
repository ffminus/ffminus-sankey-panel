import { FieldConfigProperty, PanelPlugin } from '@grafana/data';

import { Sankey } from 'components/Sankey';
import { Options } from 'options';

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
  });
