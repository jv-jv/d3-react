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

    // 5. Draw Data

    // 6. Draw Peripherals

    // 7. Set Up Interactions

    // Clean up
    return () => {}
  })

  return divRef
}
