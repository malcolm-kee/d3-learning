import * as d3 from 'd3';

let _dataset;

async function drawLineChart() {
  if (!_dataset) {
    _dataset = await import('./static/my_weather_data.json');
  }

  const dataset = _dataset;

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0]);

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth]);

  const lineGenerator = d3
    .line()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)));

  const yAxisGenerator = d3.axisLeft().scale(yScale);
  const xAxisGenerator = d3.axisBottom().scale(xScale).tickFormat(d3.timeFormat('%b'));

  const wrapper = d3
    .select('#wrapper')
    .html('')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height);

  const bound = wrapper
    .append('g')
    .style('transform', `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`);

  const freezingTemperaturePlacement = yScale(32);

  bound
    .append('rect')
    .attr('x', 0)
    .attr('width', dimensions.boundedWidth)
    .attr('y', freezingTemperaturePlacement)
    .attr('height', dimensions.boundedHeight - freezingTemperaturePlacement)
    .attr('fill', '#e0f3f3');

  bound
    .append('path')
    .attr('d', lineGenerator(dataset))
    .attr('fill', 'none')
    .attr('stroke', '#af9358')
    .attr('stroke-width', 2);

  bound.append('g').call(yAxisGenerator);

  bound
    .append('g')
    .call(xAxisGenerator)
    .style('transform', `translateY(${dimensions.boundedHeight}px)`);
}

const yAccessor = (d) => d.temperatureMax;
const parseDate = d3.timeParse('%Y-%m-%d');
const xAccessor = (d) => parseDate(d.date);

const dimensions = {
  get width() {
    return window.innerWidth * 0.9;
  },
  height: 400,
  margin: {
    top: 15,
    right: 15,
    bottom: 40,
    left: 60,
  },
  get boundedWidth() {
    return this.width - this.margin.left - this.margin.right;
  },
  get boundedHeight() {
    return this.height - this.margin.top - this.margin.bottom;
  },
};

drawLineChart();

window.addEventListener('resize', drawLineChart);
