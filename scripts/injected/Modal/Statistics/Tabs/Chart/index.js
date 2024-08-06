const onRenderChartCreditsTab = async () => {
    try {
        const htmlResponse = await fetch(
            chrome.runtime.getURL('view/Modal/Statistics/Tabs/chart.html')
        );
        const htmlRaw = await htmlResponse.text();
        document.querySelectorAll("#statistics-modal .tab-content")[0].innerHTML += htmlRaw;
        const data4 = JSON.parse(localStorage.getItem('countscore4AVG'))
        const data10 = JSON.parse(localStorage.getItem('countscore10AVG'))
        const chart = new ChartCredits()
        chart.drawPieChart(data4);
        chart.drawBarChart(data10);
        await chart.drawDoughnutChart();
    } catch (e) {
        console.log(e);
    }
};
