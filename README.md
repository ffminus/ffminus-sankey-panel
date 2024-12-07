# ffminus-sankey-panel

Sankey diagrams for Grafana.

This plugin leverages [d3-sankey](https://github.com/d3/d3-sankey) to build [Sankey diagrams](https://en.wikipedia.org/wiki/Sankey_diagram) in Grafana panels.

## Usage

The panel expects three specific columns, named "source", "target", and "value".
Input and output flows of each node are not required to be balanced.

Below is an example of flows with the expected format, along with the resulting diagram.

```csv
source,target,value
A,C,100
B,C,200
C,D,200
C,F,50
D,E,200
```

![](https://github.com/ffminus/ffminus-sankey-panel/blob/main/src/img/screenshot.png?raw=true)

## Configuration

Customization is possible via panel options, namely node alignment and styling, and link color and opacity.

## Contributing

This project was meant as a one-off for personal use, I do not plan on maintaining it much or accepting contributions.
