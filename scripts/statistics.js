const getInfoStudent = () => {
  const studentName = document.querySelectorAll(".hitec-information h5")[0]
    .textContent;
  const anotherInfo = [...document.getElementsByTagName("a")]
    .filter((item) => item.href.includes("Setting/Change"))[0]
    .textContent.split(`\n`);
  document.getElementById("student-name").innerHTML = studentName;
  document.getElementById("student-major").innerHTML = anotherInfo[1];
  document.getElementById("student-time-study").innerHTML = anotherInfo[2];
  document.getElementById("student-semester").innerHTML = anotherInfo[3];
};

const statisticsScore = async () => {
  const htmlRaw = await getHtmlRawOfPage(
    `${location.origin}${SITE_URL.studyResult}`
  );
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlRaw, "text/html");
  const studyInfo = doc.querySelectorAll(".form-control-static");
  const totalCreditsEarned = studyInfo[3].textContent;
  const grade4AVG = studyInfo[4].textContent;
  const tableRows = [
    ...doc.querySelectorAll("tbody")[0].querySelectorAll("tr"),
  ];
  let totalScoreGrade10 = 0;
  const countGrade4AVG = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    F: 0,
  };
  tableRows
    .filter((row) => row.children.length === 8)
    .map((row) => {
      totalScoreGrade10 +=
        parseFloat(row.children[5].textContent) *
        parseInt(row.children[2].textContent);
      countGrade4AVG[`${row.children[6].textContent}`]++;
    });
  const grade10AVG =
    Math.round((totalScoreGrade10 / parseInt(totalCreditsEarned)) * 100) / 100;
  const getRankType = (mark) => {
    if (mark >= 3.6) {
      return "Xuất sắc";
    }
    if (mark < 3.6 && mark >= 3.2) {
      return "Giỏi";
    }
    if (mark < 3.2 && mark >= 2.5) {
      return "Khá";
    }
    if (mark < 2.5) {
      return "Trung bình";
    }
  };

  document.getElementById("total-credits").innerHTML = totalCreditsEarned;
  document.getElementById("grade4AVG").innerHTML = grade4AVG;
  document.getElementById("grade10AVG").innerHTML = grade10AVG;
  document.getElementById("quantity-a").innerHTML = countGrade4AVG.A;
  document.getElementById("quantity-b").innerHTML = countGrade4AVG.B;
  document.getElementById("quantity-c").innerHTML = countGrade4AVG.C;
  document.getElementById("quantity-d").innerHTML = countGrade4AVG.D;
  document.getElementById("quantity-f").innerHTML = countGrade4AVG.F;
  document.getElementById("academic-ability").innerHTML = getRankType(
    parseFloat(grade4AVG)
  );
  document.getElementById("training-assessment").innerHTML =
    await traningAssessment();
  initChart(countGrade4AVG);
};

const traningAssessment = async () => {
  const htmlRaw = await getHtmlRawOfPage(
    `${location.origin}${SITE_URL.conduct}`
  );
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlRaw, "text/html");
  const rows = [...doc.querySelector("tbody").children];
  const total = Math.round(
    rows.reduce((sum, row) => sum + parseInt(row.children[3].textContent), 0) /
      rows.length
  );

  if (total >= 90) return "Xuất Sắc";
  if (total < 90 && total >= 80) return "Giỏi";
  if (total < 80 && total >= 70) return "Khá";
  if (total < 70 && total >= 60) return "Trung Bình Khá";
  if (total < 60 && total >= 50) return "Trung Bình";
  if (total < 50 && total >= 30) return "Yếu";
  if (total < 30) return "Kém";
};

const initChart = (dataInput) => {
  const ctx = document.getElementById("statistics-chart");
  const data = {
    datasets: [
      {
        label: "THỐNG KÊ XẾP LOẠI",
        data: [dataInput.A, dataInput.B, dataInput.C, dataInput.D, dataInput.F],
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
  };
  const config = {
    type: "pie",
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  };
  new Chart(ctx, config);
};

const renderModalStatistics = async () => {
  const response = await fetch(chrome.runtime.getURL("/modal_statistics.html"));
  const modalHtmlRaw = await response.text();
  document.body.innerHTML += modalHtmlRaw;
};

window.addEventListener("load", async () => {
  await renderModalStatistics();
  getInfoStudent();
  statisticsScore();
});
