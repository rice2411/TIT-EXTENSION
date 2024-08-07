class ChartCredits {
  chart = new Chart();
  drawPieChart(options) {
    const ctx = document.getElementById("chart");
    ctx.getContext("2d").clearRect(0, 0, ctx.width, ctx.height);
    this.chart.destroy();
    const config = {
      type: "pie",
      data: options.data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: true,
            text: options.title,
            font: {
              size: 20, // Change this value to set the title size
              weight: "bold", // Optional: set font weight
            },
          },
        },
      },
    };
    this.chart = new Chart(ctx, config);
  }
  drawBarChart(options) {
    const ctx = document.getElementById("chart");
    ctx.getContext("2d").clearRect(0, 0, ctx.width, ctx.height);
    this.chart.destroy();
    const config = {
      type: "bar",
      data: options.data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: true,
            text: options.title,
            font: {
              size: 24, // Change this value to set the title size
              weight: "bold", // Optional: set font weight
            },
          },
        },
      },
    };
    this.chart = new Chart(ctx, config);
  }
}
