export const ADD_ARRAY1 = "ADD_ARRAY1";
export const SET_ARRAY1 = "SET_ARRAY1";
export const SET_NUMBER = "SET_NUMBER";

export function addArray1(payload) {
  return { type: ADD_ARRAY1, payload: payload };
}

export function setArray1(payload) {
  return { type: SET_ARRAY1, payload: payload };
}

export function setNumber(payload) {
  return { type: SET_NUMBER, payload: payload };
}
