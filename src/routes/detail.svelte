<script>
  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { heightZero } from "../animations";
  import {
    getYear,
    getMonth,
    getDaysInMonth,
    isSameDay,
    isSameMonth,
    isSameYear,
    format,
  } from "date-fns";
  import { data } from "../store";
  import "tui-chart/dist/tui-chart.css";

  const nowDate = new Date();

  let tui;
  let chartContainer;
  let tuiInstance;

  let scoops = 1;
  /**
   * 1 = day
   * 2 = month
   * 3 = year
   */

  let selectYear = getYear(nowDate);
  let selectMonth = getMonth(nowDate);

  const years = new Array(selectYear - 2019)
    .fill(null)
    .map((_, index) => 2020 + index);
  const months = new Array(12).fill(null).map((_, index) => index + 1);
  $: days = new Array(getDaysInMonth(new Date(selectYear, selectMonth - 1)))
    .fill(null)
    .map((_, index) => index + 1);

  const weightList = $data.weightList || [];

  let categories;
  let weightData;
  let graphData;

  $: initalizeOptions = {
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
    xAxis: {
      type: "datetime",
      dateFormat: scoops === 1 ? "MM.DD" : scoops === 2 ? "YYYY.MM" : "YYYY"
    },
    yAxis: {
      suffix: "kg",
      pointOnColumn: true,
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
      },
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

  $: {
    switch (scoops) {
      case 1: {
        categories = days.map(day => new Date(selectYear, selectMonth, day));
        weightData = categories.reduce(
          (accu, curr) => {
            const weight = weightList.find(weight => isSameDay(new Date(weight.date), curr));
            if (!weight) {
              return accu;
            }

            return [
              ...accu,
              [new Date(weight.date), weight.value],
            ]
          },
          [],
        );
        break;
      }
      case 2: {
        categories = months.map(month => new Date(selectYear, month - 1));
        weightData = categories.reduce(
          (accu, curr) => [
            ...accu,
            weightList.find(weight => isSameYear(new Date(weight.date, curr)))
          ],
          []
        ).map(w => w ? w.value : null);
        break;
      }
      case 3: {
        break;
      }

      default: {
        categories = [];
        break;
      }
    };

    graphData = {
      series: [
        {
          name: $data.name,
          data: weightData,
        }
      ]
    };

    if (tuiInstance && chartContainer) {
      tuiInstance.destroy();
      tui.registerTheme("customTheme", theme);
      tuiInstance = new tui.lineChart(
        chartContainer,
        graphData,
        initalizeOptions
      );
    }
  }

  onMount(async () => {
    const { default: Chart } = await import("tui-chart");
    tui = Chart;
    tui.registerTheme("customTheme", theme);

    tuiInstance = new tui.lineChart(
      chartContainer,
      graphData,
      initalizeOptions
    );
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

<main in:fade={{ delay: 2000, duration: 1000 }}>
  <aside class="absolute bg-white rounded-md">
    <div class="m-3">
      <select
        bind:value={selectYear}
        class="border border-gray-400 rounded-md px-2 py-2 w-full">
        {#each years as year (year)}
          <option value={year} selected={year === selectYear}>{year}</option>
        {/each}
      </select>
    </div>
    {#if scoops === 1}
      <div
        class="m-3"
        out:heightZero={{ delay: 150, duration: 300 }}
        in:heightZero={{ delay: 0, duration: 300 }}>
        <select
          out:fly={{ x: -200, duration: 300 }}
          in:fly={{ x: -200, duration: 300, delay: 150 }}
          bind:value={selectMonth}
          class="border border-gray-400 rounded-md px-2 py-2 w-full">
          {#each months as month (month)}
            <option value={month} selected={month === selectMonth}>
              {month}
            </option>
          {/each}
        </select>
      </div>
    {/if}

    <div class="p-6 pt-0 pb-3 flex flex-col">
      <label class="py-1 flex items-center justify-between">
        <input type="radio" bind:group={scoops} value={1} />
        <span class="pl-2">Days</span>
      </label>
      <label class="py-1 flex items-center justify-between">
        <input type="radio" bind:group={scoops} value={2} />
        <span class="pl-2">Months</span>
      </label>
      <label class="py-1 flex items-center justify-between">
        <input type="radio" bind:group={scoops} value={3} />
        <span class="pl-2">Years</span>
      </label>
    </div>
  </aside>
  <section class="rounded-md p-6 pt-8 bg-white" bind:this={chartContainer} />
</main>
