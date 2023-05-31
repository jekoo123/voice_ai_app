export const ADD_ARRAY1 = "ADD_ARRAY1";
export const SET_ARRAY1 = "SET_ARRAY1";
export const SET_NUMBER = "SET_NUMBER";
export const SET_ID = "SET_ID";
export const SAVE_SENTENCE = "SAVE_SENTENCE";
export const SET_CONTEXT = "SET_CONTEXT";

export function addArray1(payload) {
  return { type: ADD_ARRAY1, payload: payload };
}

export function setArray1(payload) {
  return { type: SET_ARRAY1, payload: payload };
}

export function setNumber(payload) {
  return { type: SET_NUMBER, payload: payload };
}

export function setId(payload) {
  return { type: SET_ID, payload: payload };
}

export function saveSentence(payload) {
  return { type: SAVE_SENTENCE, payload: payload };
}

export function setContext1(payload) {
  return { type: SET_CONTEXT, payload: payload };
}
