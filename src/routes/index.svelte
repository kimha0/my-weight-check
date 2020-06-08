<style>
  input::placeholder { text-align: center; }
  input.border-red-400::placeholder {
    color: #e53e3e;
    color: rgba(299, 62, 62, var(--text-opacity));
  }
</style>

<script>
  import { data } from '../store'
  import { tick, onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { goto } from '@sapper/app';
  import { isSameDay } from 'date-fns';

  const { setName, add } = data;

  let weight;
  let name;

  let isValidated = true;
  let errorMessage;
  let step = -1;
  let isViewPage = false;
  let isEmptyName = !$data.name;

  const onSubmit = (event) => {
    event.preventDefault();
    if (Math.sign(weight) === 1) {
      isValidated = true;
      errorMessage = null;
      step = -1;

      // TODO
      setName(name || 'Empty');
      add(weight);
      
    } else {
      isValidated = false;
      errorMessage = '몸무게를 잘못 적으신거 같아요..';
    };
  };

  $: if (Math.sign(weight) === 1) {
    isValidated = true;
    errorMessage = null;
  }

  onMount(async () => {
    const weightList = $data.weightList || [];
    const nowDate = new Date();
    const todayWeightData = weightList.find(weight => isSameDay(nowDate, new Date(weight.date)));
    if (todayWeightData !== undefined) {
      step = -1;
      await tick();
      await goto('/detail');
    }
    step = 0;
    isViewPage = true;
  });
</script>



<svelte:head>
	<title>Sapper project template</title>
</svelte:head>


{#if isViewPage}
  <main
    class='container rounded-lg m-6 bg-white min-h-card overflow-hidden'
    out:fade={{ duration: 1000 }}
    on:outroend="{async () => await goto('/detail')}">
  {#if step === 0}
    <div
      out:fly='{{ x: 300, duration: 300 }}'
      on:outroend="{() => step = 1 }"
      class='flex justify-center items-center flex-col min-h-inherit'
    >
      <section class='text-center text-center my-4'>
        <h1 class='text-lg font-light text-gray-800'>🏋️‍♀️</h1>
      </section>
      <form on:submit={onSubmit} class='flex justify-center items-center flex-col w-full'>
        {#if isEmptyName}
        <input
          class:text-red-600={!isValidated}
          class:border-red-400={!isValidated}
          class:border-gray-200={isValidated}
          class='border py-2 px-4 mx-2 my-3 mb-0 w-full box-border transition-colors duration-300 rounded-md text-center' type='text' placeholder='이름을 입력해주세요.' bind:value={name} />
        {/if}

        <input
          class:text-red-600={!isValidated}
          class:border-red-400={!isValidated}
          class:border-gray-200={isValidated}
          class='border py-2 px-4 mx-2 my-3 mb-0 w-full box-border transition-colors duration-300 rounded-md text-center' type='number' placeholder='오늘의 체중을 입력해보세요' bind:value={weight} min={1} max={1000} />
        <p class='text-red-600 mt-0'>
        {#if !isValidated}
          <span transition:fade='{{ duration: 300 }}'>{errorMessage}</span>
        {:else}
          <span>&nbsp;</span>
        {/if}
        </p>
        <button
          type='submit'
          class:text-red-600={!isValidated}
          class:border-red-400={!isValidated}
          class:border-gray-200={isValidated}
          class='border py-2 px-4 mx-2 mt-6 w-auto box-border text-gray-800 transition-colors duration-300 rounded-md'>✔ 확인</button>
      </form>
    </div>
  {:else if (step === 1)}
    <div
      in:fade='{{ duration: 1000 }}'
      on:introend="{() => window.setTimeout(() => { step = 2 }, 1000) }"
      class='flex justify-center items-center min-h-inherit text-4xl text-center'>
      <p class='h-full font-light'>좋아요</p>
    </div>
  {:else if (step === 2)}
    <div
      in:fade='{{ duration: 1000 }}'
      out:fade='{{ duration: 300 }}'
      on:introend="{() => { window.setTimeout(async() => { step = 3; await tick(); isViewPage = false }, 1500) }}"
      class='flex justify-center items-center min-h-inherit text-4xl'>
      <p class='h-full font-light'>그러면 이제,<br/><span class='font-bold'>그래프</span>를 그려보도록 할게요</p>
    </div>
  {/if}
  </main>
{/if}