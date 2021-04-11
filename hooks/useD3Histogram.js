import { useEffect, useRef } from "react"
import * as d3 from "d3"

import { random } from "../utils"

// temp data
const data = [
  ...Array(100)
    .fill()
    .map((e) => ({ x: random(100) })),
]

export default function useD3Histogram() {
  const divRef = useRef()

  useEffect(() => {
    // 1. Access Data
    const metricAccessor = (d) => d.x
    const yAccessor = (d) => d.length

    // 2. Create Dimensions
    const width = 600
    const dimensions = {
      width: width,
      height: width * 0.6,
      margin: {
        top: 30,
        right: 10,
        bottom: 50,
        left: 50,
      },
    }

    dimensions.boundedWidth =
      dimensions.width - dimensions.margin.left - dimensions.margin.right
    dimensions.boundedHeight =
      dimensions.height - dimensions.margin.top - dimensions.margin.bottom

    // 3. Draw Canvas
    const wrapper = d3
      .select(divRef.current)
      .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

    const bounds = wrapper
      .append("g")
      .style(
        "transform",
        `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
      )

    // 4. Create Scales
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, metricAccessor))
      .range([0, dimensions.boundedWidth])
      .nice()

    const binsGenerator = d3
      .histogram()
      .domain(xScale.domain())
      .value(metricAccessor)
      .thresholds(12)

    const bins = binsGenerator(data)

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(bins, yAccessor)])
      .range([dimensions.boundedHeight, 0])
      .nice()

    // 5. Draw Data

    const binsGroup = bounds.append("g")

    const binGroups = binsGroup.selectAll("g").data(bins).enter().append("g")

    const barPadding = 1

    const barRects = binGroups
      .append("rect")
      .attr("x", (d) => xScale(d.x0) + barPadding / 2)
      .attr("y", (d) => yScale(yAccessor(d)))
      .attr("width", (d) =>
        d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding])
      )
      .attr("height", (d) => dimensions.boundedHeight - yScale(yAccessor(d)))
      .attr("fill", "cornflowerblue")

    const barText = binGroups
      .filter(yAccessor)
      .append("text")
      .attr("x", (d) => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
      .attr("y", (d) => yScale(yAccessor(d)) - 5)
      .text(yAccessor)
      .style("text-anchor", "middle")
      .attr("fill", "darkgrey")
      .style("font-size", "12px")
      .style("font-family", "sans-serif")

    // 6. Draw Peripherals

    const xAxisGenerator = d3.axisBottom().scale(xScale)

    const xAxis = bounds
      .append("g")
      .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)

    const xAxisLabel = xAxis
      .append("text")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", dimensions.margin.bottom - 10)
      .attr("fill", "black")
      .style("font-size", "1.4em")
      .text("x")

    // 7. Set Up Interactions

    // Clean up
    return () => {}
  })

  return divRef
}
