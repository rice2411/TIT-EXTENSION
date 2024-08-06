const onSelectedChartType = () => {
  const select = document.getElementById("chart-type");
  const chart = new ChartCredits();
  select.addEventListener("change", (e) => {
    let data = [];
    switch (e.target.value) {
      case "avg-4":
        data = JSON.parse(localStorage.getItem("countscore4AVG"));
        chart.drawPieChart(data);
        return;
      case "avg-10":
        data = JSON.parse(localStorage.getItem("countscore10AVG"));
        chart.drawBarChart(data);
        return;
    }
  });
};

const onRenderChartCreditsTab = async () => {
  try {
    const htmlResponse = await fetch(
      chrome.runtime.getURL("view/Modal/Statistics/Tabs/chart.html")
    );
    const htmlRaw = await htmlResponse.text();
    document.querySelectorAll("#statistics-modal .tab-content")[0].innerHTML +=
      htmlRaw;
    onSelectedChartType();

    // chart.drawBarChart(data10);
    // await chart.drawDoughnutChart();
  } catch (e) {
    console.log(e);
  }
};
