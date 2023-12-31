// Load the Uranus positions from the CSV file
d3.csv("uranus_positions.csv").then(function (data) {
  // Parse the position data
  data.forEach(function (d) {
    d.x = parseFloat(d.x);
    d.y = parseFloat(d.y);
    d.z = parseFloat(d.z);
  });

  // Create the SVG element
  const svg = d3.select("#chart");

  // Set up the chart dimensions
  let width = svg.node().getBoundingClientRect().width;
  let height = svg.node().getBoundingClientRect().height;

  // Create the chart container
  const chart = svg
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  // Create scales for the x and y axes
  const scalePadding = 100;
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.z))
    .range([(-width + scalePadding) / 2, (width - scalePadding) / 2]);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.y))
    .range([(height - scalePadding) / 2, (-height + scalePadding) / 2]);

  // Create the line generator
  const line = d3
    .line()
    .x((d) => xScale(d.z))
    .y((d) => yScale(d.y));

  // Add the path for the orbit
  const orbitPath = chart
    .append("path")
    .datum(data)
    .attr("class", "orbit")
    .attr("d", line);

  // Add the Uranus position
  const uranus = chart
    .append("circle")
    .attr("class", "uranus")
    .attr("cx", (d) => xScale(data[0].z))
    .attr("cy", (d) => yScale(data[0].y))
    .attr("r", 15);

  // Add the Sun in the center
  const sun = chart
    .append("circle")
    .attr("class", "sun")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 30);

  // Function to update Uranus' position
  let uranusRaise = false;
  function update(index) {
    const currentPosition = data[index];
    uranus
      .transition()
      // .duration(500)
      .attr("cx", (d) => xScale(currentPosition.z))
      .attr("cy", (d) => yScale(currentPosition.y));

    // console.log(index)
    // Uranus goes behind or in front of the sun
    if (index > 4000 && index < 5000 && !uranusRaise) {
      // console.log("RAISE")
      uranus.raise();
      uranusRaise = true;
    }
    if (index > 20000 && uranusRaise) {
      // console.log("LOWER")
      uranus.lower();
      uranusRaise = false;
      // keep the orbit path below
      orbitPath.lower();
    }
  }

  // Update Uranus' position periodically
  let currentIndex = 0;
  setInterval(function () {
    update(currentIndex);
    currentIndex = (currentIndex + 100) % data.length;
  }, 100);

  // Update chart dimensions on window resize
  function resizeChart() {
    width = svg.node().getBoundingClientRect().width;
    height = svg.node().getBoundingClientRect().height;

    chart.attr("transform", `translate(${width / 2}, ${height / 2})`);

    xScale.range([(-width + scalePadding) / 2, (width - scalePadding) / 2]);
    yScale.range([(height - scalePadding) / 2, (-height + scalePadding) / 2]);

    orbitPath.attr("d", line);
    uranus
      .attr("cx", (d) => xScale(data[currentIndex].z))
      .attr("cy", (d) => yScale(data[currentIndex].y));
  }

  window.addEventListener("resize", resizeChart);
});
