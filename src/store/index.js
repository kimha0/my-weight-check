import { format } from 'date-fns';
import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_KEY = '__DATA__';
const initializeValue = {
  name: '',
  weightList: [],
};

function localStorageSet(data) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

function localStorageGet() {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) { return {}; };
  return JSON.parse(data);
}

function getInitializeValueByLocalStorage() {
  if (!process.browser) {
    return;
  }
  if (!localStorage) {
    // TODO: Browser not support
    return initializeValue;
  }

  const data = localStorageGet();

  if (!data) {
    return initializeValue;
  }

  return data;
};

function updateLocalStorageData(data) {
  if (!process.browser) {
    return;
  }
  if (!localStorage) {
    throw new Error('browser not support LocalStorage');
  }

  if (!data) {
    console.error('data is empty', data);
    return;
  }

  localStorageSet(data);
}


function createData() {
  const { subscribe, set, update } = process.browser ? writable(getInitializeValueByLocalStorage()) : writable(initializeValue);
  const setName = (name = '') => {
    return update(n => ({
      ...n,
      name,
    }));
  }
  const add = (weight) => {
    if (weight === null || weight === undefined) {
      throw new TypeError('weight is empty');
    }

    if (!"number" === typeof weight) {
      throw new TypeError('weight is not number');
    }

    return update(n => ({
      ...n,
      weightList: [
        ...(n.weightList || []),
        {
          id: uuidv4(),
          date: format(new Date(), 'yyyy/MM/dd'),
          value: weight,
        }
      ]
    }));
  }
  const reset = () => set(initializeValue);

  subscribe(value => {
    updateLocalStorageData(value);
  });

  return {
    subscribe,
    add,
    setName,
    reset,
  }
}

export const data = createData();