<script>
  import { onMount } from "svelte";
  import { fly } from 'svelte/transition';
  import { heightZero } from '../animations';
  import "tui-chart/dist/tui-chart.css";

  let tui;
  let chartContainer;

  let scoops = 1;
  let selectYear = 2020;
  let selectMonth = 1;

  let data = {
    categories: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월"
    ],
    series: [
      {
        name: "Hayoung",
        data: [70, 78, 81, 83, 85, 89, 91, 93, 95, 97, 99, 103]
      }
    ]
  };

  let options = {
    theme: "customTheme",
    chart: {
      width: 1160,
      height: 540
    },
    series: {
      zoomable: true,
      showDot: false,
      areaOpacity: 0.8
    },
    tooltip: {
      suffix: "Kg"
    },
    legend: { visible: false },
    chartExportMenu: { visible: false }
  };

  const theme = {
    title: {
      fontSize: 0
    },
    chart: {
      fontFamily: "NexonLv2Gothic",
      background: {
        color: "white",
        opacity: 1
      }
    },
    series: {
      colors: ["#6B46C1"]
    },
    xAxis: {
      label: {
        fontSize: 12,
        fontFamily: "NexonLv2Gothic",
        fontWeight: "light",
        color: "#1A202C"
      }
    },
    yAxis: {
      label: {
        fontSize: 12,
        fontFamily: "NexonLv2Gothic",
        fontWeight: "light",
        color: "#1A202C"
      }
    }
  };

  onMount(async () => {
    const { default: Chart } = await import("tui-chart");
    tui = Chart;
    tui.registerTheme("customTheme", theme);
    tui.areaChart(chartContainer, data, options);
  });
</script>

<style>
  aside {
    left: 0;
    top: 20px;
    padding-left: 12px;
    min-width: 100px;
    min-height: 100px;
  }

</style>

<main>
  <aside class="absolute bg-white rounded-md">
    <div class='m-3'>
      <select bind:value={selectYear} class='border border-gray-400 rounded-md px-2 py-2 w-full'>
        <!-- TODO -->
        <option value={2018}>2018</option>
        <option value={2019}>2019</option>
        <option value={2020}>2020</option>
      </select>
    </div>
    {#if scoops === 1}
    <div class='m-3' out:heightZero="{{ delay: 150, duration: 300 }}" in:heightZero="{{ delay: 0, duration: 300 }}">
      <select out:fly="{{ x: -200, duration: 300 }}" in:fly="{{ x: -200, duration: 300, delay: 150 }}" bind:value={selectMonth} class='border border-gray-400 rounded-md px-2 py-2 w-full'>
        <!-- TODO -->
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
      </select>
    </div>
    {/if}

    <div class='p-6 pt-0 pb-3 flex flex-col'>
      <label class='py-1 flex items-center justify-between'>
        <input type="radio" bind:group={scoops} value={1}/>
        <span class='pl-2'>Days</span>
      </label>
      <label class='py-1 flex items-center justify-between'>
        <input type="radio" bind:group={scoops} value={2} />
        <span class='pl-2'>Months</span>
      </label>
      <label class='py-1 flex items-center justify-between'>
        <input type="radio" bind:group={scoops} value={3} />
        <span class='pl-2'>Years</span>
      </label>
    </div>
  </aside>
  <section class="rounded-md p-6 pt-8 bg-white" bind:this={chartContainer} />
</main>
