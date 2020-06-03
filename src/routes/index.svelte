<style>
  input::placeholder { text-align: center; }
  input.border-red-400::placeholder {
    color: #e53e3e;
    color: rgba(299, 62, 62, var(--text-opacity));
  }
</style>

<script>
  import { tick } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { widthZero } from '../animations';

  let weight;
  let isValidated = true;
  let errorMessage;
  let step = 0;
  let isViewPage = true;

  const onSubmit = (event) => {
    if (Math.sign(weight) === 1) {
      isValidated = true;
      errorMessage = null;
      step = -1;
      
    } else {
      isValidated = false;
      errorMessage = '몸무게를 잘못 적으신거 같아요..';
    };
  };

  $: if (Math.sign(weight) === 1) {
    isValidated = true;
    errorMessage = null;
  }

</script>

<svelte:head>
	<title>Sapper project template</title>
</svelte:head>

<div class='h-screen w-screen bg-gray-400 flex justify-center items-center'>
{#if isViewPage}
  <main class='container rounded-lg p-6 m-6 bg-white min-h-card overflow-hidden box-border' out:widthZero={{ duration: 1000 }}>
  {#if step === 0}
    <div
      out:fly='{{ x: 300, duration: 300 }}'
      on:outroend="{() => step = 1 }"
      class='flex justify-center items-center flex-col min-h-inherit'
    >
      <section class='text-center text-center my-4'>
        <h1 class='text-lg font-light text-gray-800'>오늘 한 운동을 작성해보세요</h1>
      </section>
      <article class='flex justify-center items-center flex-col w-full'>
        <input
          class:text-red-600={!isValidated}
          class:border-red-400={!isValidated}
          class:border-gray-200={isValidated}
          class='border py-2 px-4 mx-2 my-6 w-full box-border transition-colors duration-300 rounded-md' type='number' placeholder='오늘의 체중을 입력해보세요' bind:value={weight} min={1} max={200} />
        <p class='text-red-600 mt-0'>
        {#if !isValidated}
          <span transition:fade='{{ duration: 300 }}'>{errorMessage}</span>
        {:else}
          <span>&nbsp;</span>
        {/if}
        </p>
        <button
          class:text-red-600={!isValidated}
          class:border-red-400={!isValidated}
          class:border-gray-200={isValidated}
          on:click={onSubmit}
          class='border py-2 px-4 mx-2 mt-6 w-auto box-border text-gray-800 transition-colors duration-300 rounded-md'>✔ 확인</button>
      </article>
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
</div>