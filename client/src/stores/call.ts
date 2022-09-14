import { writable } from 'svelte/store';
import type { Call } from 'src/interfaces/call';

export const id = writable<string>(null);
export const caller = writable<string>(null);
export const callee = writable<string | null>(null);
export const ready = writable<boolean>(false);

export const setCallInformation = (data: Call) => {
  id.set(data.id);
  caller.set(data.caller);
  callee.set(data.callee);
};
