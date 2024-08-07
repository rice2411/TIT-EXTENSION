const processTuitionData = async () => {
  const dataInput = await getTuitionData();
  const result = [];

  dataInput.forEach((item, index) => {
    if (item.label.split('.')[1] === '3' && result.length > 0) {
      result[result.length - 1].value += item.value;
    } else if (item.label.split('.')[1] !== '3') {
      result.push({ ...item });
    }
  });

  return result;
}

const getTuitionData = async () => {
  const url = getFullUrl(location.origin, SITE_URL.tuitionHistory);
  const doc = await getPageDOM(url);
  const tableRows = [...doc.querySelectorAll("tbody tr")];
  return tableRows.map((row) => {
    return {
      label: row.querySelectorAll("td")[3].textContent.trim(),
      value: parseInt(
        row.querySelectorAll("td")[6].textContent.trim().replace(/,/g, "")
      ),
    };
  });
}

const onSelectedChartType = () => {
  const select = document.getElementById("chart-type");
  const chart = new ChartCredits();
  select.addEventListener("change", async (e) => {
    let dataInput = [];
    let options = {}
    document.getElementById('404-text').hidden = true
    document.getElementById('chart').hidden = false
    switch (e.target.value) {
      case "avg-4":
        dataInput = JSON.parse(localStorage.getItem("countscore4AVG"));
        options = {
          title: 'Biểu đồ thống kê số tín chỉ tích lũy',
          data: {
            datasets: [
              {
                label: "TÍch lũy",
                data: [
                  dataInput.A,
                  dataInput.B,
                  dataInput.C,
                  dataInput.D,
                  dataInput.F,
                ],
                backgroundColor: [
                  "#62B58A",
                  "#ffc534",
                  "#29c3be",
                  "#5d62b5",
                  "#f2726f",
                ],
              },
            ],
            labels: ["Điểm A", "Điểm B", "Điểm C", "Điểm D", "Điểm F"],
          }
        }
        chart.drawPieChart(options);
        return;
      case "avg-10":
        dataInput = JSON.parse(localStorage.getItem("countscore10AVG"));
        options = {
          title: 'ĐIỂM TRUNG BÌNH HỌC KỲ',
          data: {
            datasets: [
              {
                label: "Điểm trung bình học kì",
                data: dataInput.map(
                  (item) => Math.round((item.value / item.totalCredits) * 100) / 100
                ),
                backgroundColor: ["#883cae"],
              },
            ],
            labels: dataInput.map((item) => item.id),
          }
        }
        chart.drawBarChart(options);
        return;

      case "tuition":
        dataInput = await getTuitionData();
        options = {
          title: 'Học phí từng học kì',
          data: {
            datasets: [
              {
                label: "VND",
                data: dataInput.map((item) => item.value),
                backgroundColor: ["#69d100"],
              },
            ],
            labels: dataInput.map((item) => item.label),
          }
        }
        chart.drawBarChart(options);
        return;
      case 'avg-credits':
        const semester = JSON.parse(localStorage.getItem("countscore10AVG"))
        dataInput = await processTuitionData()
        options = {
          title: 'Trùng bình học phí tín chỉ',
          data: {
            datasets: [
              {
                label: "VND",
                data: dataInput.map((item, index) => item.value / semester[index].totalCredits),
                backgroundColor: ["#69d100"],
              },
            ],
            labels: semester.map((item) => item.id),
          }
        }
        chart.drawBarChart(options);
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
