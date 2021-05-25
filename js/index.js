const ctx = document.querySelector(".js-chart").getContext("2d");
const GLOBAL_MEAN_TEMPERATURE = 14;

fetchData()
  .then(parseData)
  .then(getLabelsAndData)
  .then(({ years, globalTemps, northTemps, southTemps }) =>
    drawChart(years, globalTemps, northTemps, southTemps)
  );

function fetchData() {
  return fetch("./ZonAnn.Ts+dSST.csv").then((response) => response.text());
}

function parseData(data) {
  return Papa.parse(data, { header: true }).data;
}

function getLabelsAndData(data) {
  return data.reduce(
    (acc, entry) => {
      acc.years.push(entry.Year);
      acc.globalTemps.push(Number(entry.Glob) + GLOBAL_MEAN_TEMPERATURE);
      acc.northTemps.push(Number(entry.NHem) + GLOBAL_MEAN_TEMPERATURE);
      acc.southTemps.push(Number(entry.SHem) + GLOBAL_MEAN_TEMPERATURE);
      return acc;
    },
    { years: [], globalTemps: [], northTemps: [], southTemps: [] }
  );
}

function drawChart(labels, global, north, south) {
  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "# Средняя глобальная температура",
          data: global,
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          fill: false,
        },
        {
          label: "# Средняя температура северного полушария",
          data: north,
          borderColor: "rgb(99, 109, 255)",
          borderWidth: 1,
          fill: false,
        },
        {
          label: "# Средняя температура южного полушария",
          data: south,
          borderColor: "rgb(255, 232, 99)",
          borderWidth: 1,
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              callback(value) {
                return value + "°";
              },
            },
          },
        ],
      },
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Tables of Global and Hemispheric Monthly Means and Zonal Annual Means",
        },
      },
    },
  });
}
