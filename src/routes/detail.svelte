<script>
  import { onMount, onDestroy } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { heightZero } from "../animations";
  import {
    getYear,
    getMonth,
    getDaysInMonth,
    isSameDay,
    format,
    set,
    differenceInYears,
    isSameYear,
  } from "date-fns";
  import { data } from "../store";
  import "tui-chart/dist/tui-chart.css";

  const nowDate = new Date();

  let windowInnerWidth = 1160;
  let windowInnerHeight = 540;

  $: chartWidth = windowInnerWidth > 1160 ? 1160 : windowInnerWidth;
  $: chartHeight = windowInnerHeight > 540 ? 540 : windowInnerHeight;

  let tui;
  let chartContainer;
  let tuiInstance;

  let scoops = 1;
  /**
   * 1 = day
   * 2 = month
   * 3 = all
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
  let hasWeightData = false;

  $: initalizeOptions = {
    theme: "customTheme",
    chart: {
      width: 1160,
      height: 540,
      format: (value, chartType, type, axis) => {
        if (axis === "y") return `${value}kg`;
        if (axis === "x")
          return format(new Date(parseInt(value, 10)), "yyyy년 M월 d일");
        return value;
      }
    },
    series: {
      zoomable: true,
      showDot: true,
      areaOpacity: 0.8
    },
    tooltip: {
      suffix: "Kg"
    },
    xAxis: {
      type: "datetime",
      dateFormat:
        scoops === 1 ? "YYYY.MM.DD" : scoops === 2 ? "YYYY.MM" : "YYYY"
    },
    yAxis: {
      suffix: "",
      pointOnColumn: true
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

  $: {
    switch (scoops) {
      case 1: {
        categories = days.map(day => new Date(selectYear, selectMonth, day));
        const _categorires = [];
        weightData = categories.reduce((accu, curr) => {
          const weight = weightList.find(weight =>
            isSameDay(new Date(weight.date), curr)
          );
          if (!weight) {
            return accu;
          }

          const date = new Date(weight.date);
          return [...accu, [date, weight.value]];
        }, []);

        graphData = {
          series: [
            {
              name: $data.name,
              data: weightData
            }
          ]
        };

        if (weightData.length === 0) {
          destroyChart();
          break;
        }
        reInitalizeChart();
        break;
      }
      case 2: {
        categories = months.map(month => new Date(selectYear, month - 1));
        const today = set(new Date(), {
          hours: 0,
          minutes: 0,
          seconds: 0,
          milliseconds: 0
        });
        const weightData = weightList
          .filter(
            weight => differenceInYears(new Date(weight.date), today) === 0
          )
          .map(weight => [new Date(weight.date), weight.value]);
        graphData = {
          series: [
            {
              name: $data.name,
              data: weightData
            }
          ]
        };
        if (weightData.length === 0) {
          destroyChart();
          break;
        }
        reInitalizeChart();
        break;
      }
      case 3: {
        const weightData = weightList.map(weight => [
          new Date(weight.date),
          weight.value
        ]);
        graphData = {
          series: [
            {
              name: $data.name,
              data: weightData
            }
          ]
        };
        if (weightData.length === 0) {
          destroyChart();
          break;
        }
        reInitalizeChart();
        break;
      }

      default: {
        categories = [];
        break;
      }
    }
  }

  $: {
    if (tuiInstance) {
      tuiInstance.resize({ width: chartWidth, height: chartHeight });
    }
  }

  onMount(() => {
    initializeChart();
  });

  onDestroy(() => {
    destroyChart();
  });

  async function initializeChart() {
    const { default: Chart } = await import("tui-chart");
    tui = Chart;
    tui.registerTheme("customTheme", theme);

    tuiInstance = new tui.lineChart(
      chartContainer,
      graphData,
      initalizeOptions,
    );
    hasWeightData = true;
  }

  function destroyChart() {
    if (tuiInstance && chartContainer) {
      tuiInstance.destroy();
      tuiInstance = null;
      hasWeightData = false;
    }
  }

  async function reInitalizeChart() {
    if (tuiInstance) {
      tuiInstance.destroy();
    }
    if (chartContainer) {
      tui.registerTheme("customTheme", theme);
      tuiInstance = new tui.lineChart(
        chartContainer,
        graphData,
        initalizeOptions,
      );
      hasWeightData = true;
    }
  }
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

<svelte:window bind:innerWidth={windowInnerWidth} bind:innerHeight={windowInnerHeight} />

<main in:fade={{ delay: 2000, duration: 1000 }}>
  <aside class="absolute bg-white rounded-md">
    {#if scoops !== 3}
      <div
        class="m-3"
        out:heightZero={{ delay: 150, duration: 300 }}
        in:heightZero={{ delay: 0, duration: 300 }}>
        <select
          out:fly={{ x: -200, duration: 300 }}
          in:fly={{ x: -200, duration: 300, delay: 150 }}
          bind:value={selectYear}
          class="border border-gray-400 rounded-md px-2 py-2 w-full">
          {#each years as year (year)}
            <option value={year} selected={year === selectYear}>{year}</option>
          {/each}
        </select>
      </div>
    {/if}
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

    <div class="p-6 pt-3 pb-3 flex flex-col">
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
        <span class="pl-2">All</span>
      </label>
    </div>
  </aside>
  <section class="rounded-md p-6 pt-8 bg-white" bind:this={chartContainer}>
    {#if !hasWeightData}
      <p>No data</p>
    {/if}
  </section>
</main>
