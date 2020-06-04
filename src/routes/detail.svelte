
<script>
  import { onMount } from "svelte";
  import 'tui-chart/dist/tui-chart.css';
  let tui;
  let chartContainer;

  let data = {
    categories: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    series: [
      {
        name: "Hayoung",
        data: [70, 78, 81, 83, 85, 89, 91, 93, 95, 97, 99, 103]
      },
      {
        name: "Hayoung2",
        data: [71, 74, 83, 83, 85, 89, 91, 93, 95, 97, 99, 103]
      },
    ]
  };

  let options = {
    chart: {
      width: 1160,
      height: 540,
    },
    series: {
      zoomable: true,
      showDot: false,
      areaOpacity: 1,
    },
    tooltip: {
      suffix: 'Kg'
    }
  };

  onMount(async () => {
    const { default: Chart } = await import("tui-chart");
    tui = Chart;
    tui.areaChart(chartContainer, data, options);
  });
</script>

<main>
  <section bind:this={chartContainer}>
  </section>
</main>
