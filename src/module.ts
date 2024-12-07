import { PanelPlugin } from '@grafana/data';

import { Sankey } from 'components/Sankey';
import { Options } from 'options';

/** Declare panel plugin, along with its configuration widgets. */
export const plugin = new PanelPlugin<Options>(Sankey);
