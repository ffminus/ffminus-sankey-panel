import {
  schemeAccent,
  schemeBlues,
  schemeBrBG,
  schemeCategory10,
  schemeDark2,
  schemeGreens,
  schemeGreys,
  schemeOranges,
  schemePaired,
  schemePastel1,
  schemePastel2,
  schemePuBuGn,
  schemePurples,
  schemeRdYlBu,
  schemeRdYlGn,
  schemeReds,
  schemeSet1,
  schemeSet2,
  schemeSet3,
  schemeSpectral,
  schemeTableau10,
  schemeYlGnBu,
  schemeYlOrBr,
  schemeYlOrRd,
} from 'd3';
import { sankeyCenter, sankeyJustify, sankeyLeft, sankeyRight } from 'd3-sankey';

/** Configuration parameters parsed from panel options. */
export interface Options {
  alignment: Alignment;
  node: {
    colors: { kind: 'single' | 'palette'; single: string; palette: Color };
    width: number;
    padding: number;
    label: { size: number; color: string };
  };
  link: { colors: { kind: 'single' | 'gradient'; single: string }; opacity: number };
}

/** Accepted options for node alignment. */
export type Alignment = keyof typeof ALIGNMENTS;

/** Map a user input string to a specific algorithm. */
export const ALIGNMENTS = { Justify: sankeyJustify, Left: sankeyLeft, Center: sankeyCenter, Right: sankeyRight };

/** Accepted options for node colors. */
export type Color = keyof typeof COLORS;

/** Available color schemes for nodes. */
export const COLORS = {
  Category: schemeCategory10,
  Accent: schemeAccent,
  Blue: schemeBlues[5],
  BrBG: schemeBrBG[5],
  Dark: schemeDark2,
  Green: schemeGreens[5],
  Grey: schemeGreys[5],
  Orange: schemeOranges[5],
  Paired: schemePaired,
  'Pastel 1': schemePastel1,
  'Pastel 2': schemePastel2,
  PuBuGn: schemePuBuGn[5],
  Purple: schemePurples[5],
  RdYlBu: schemeRdYlBu[5],
  RdYlGn: schemeRdYlGn[5],
  Red: schemeReds[5],
  'Set 1': schemeSet1,
  'Set 2': schemeSet2,
  'Set 3': schemeSet3,
  Spectral: schemeSpectral[5],
  Tableau: schemeTableau10,
  YlGnBu: schemeYlGnBu[5],
  YlOrBr: schemeYlOrBr[5],
  YlOrRd: schemeYlOrRd[5],
};
