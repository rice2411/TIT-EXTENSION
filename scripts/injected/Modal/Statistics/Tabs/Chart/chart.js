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
  async drawDoughnutChart() {
    const url = getFullUrl(location.origin, SITE_URL.tuitionHistory);
    const doc = await getPageDOM(url);
    const tableRows = [...doc.querySelectorAll("tbody tr")];
    const dataInput = tableRows.map((row) => {
      return {
        label: row.querySelectorAll("td")[3].textContent.trim(),
        value: parseInt(
          row.querySelectorAll("td")[6].textContent.trim().replace(/,/g, "")
        ),
      };
    });
    const ctx = document.getElementById("chart");
    ctx.getContext("2d").clearRect(0, 0, ctx.width, ctx.height);
    this.chart.destroy();
    const data = {
      labels: dataInput.map((item) => item.label),
      datasets: [
        {
          label: "VND",
          data: dataInput.map((item) => item.value),
          backgroundColor: this.utils().generateHexColors(dataInput.length),
          hoverOffset: 4,
        },
      ],
    };
    const config = {
      type: "doughnut",
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: true,
            text: "HỌC PHÍ TỪNG HỌC KÌ",
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
  utils() {
    return {
      getRandomHexColor() {
        const chars = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
          color += chars[Math.floor(Math.random() * 16)];
        }
        return color;
      },

      generateHexColors(count) {
        if (count < 1) {
          throw new Error("Count must be at least 1");
        }
        const colors = [];
        for (let i = 0; i < count; i++) {
          colors.push(this.getRandomHexColor());
        }
        return colors;
      },
    };
  }
}
