export const ADD_DIALOG = "ADD_DIALOG";
export const SET_DIALOG = "SET_DIALOG";
export const ADD_USER = "ADD_USER";
export const SET_USER = "SET_USER";
export const CHANGE_LANGUAGE = "CHANGE_LANGUAGE";
export const CHANGE_CONTEXT = "CHANGE_CONTEXT";
export const SET_SAVE = "SET_SAVE";
export const DELETE_SAVE = "DELETE_SAVE";
export const SET_SCORE = "SET_SCORE";

export function addDialog(payload) {
  return { type: ADD_DIALOG, payload: payload };
}

export function setDialog(payload) {
  return { type: SET_DIALOG, payload: payload };
}

export function addUser(payload) {
  return { type: ADD_USER, payload: payload };
}

export function setUser(payload) {
  return { type: SET_USER, payload: payload };
}

export function changeLanguage(payload) {
  return { type: CHANGE_LANGUAGE, payload: payload };
}

export function changeContext(payload) {
  return { type: CHANGE_CONTEXT, payload: payload };
}

export function setSave(payload) {
  return { type: SET_SAVE, payload: payload };
}

export function deleteSave(payload) {
  return { type: DELETE_SAVE, payload: payload };
}
export function setScore(payload) {
  return { type: SET_SCORE, payload: payload };
}
// export function setContext1(payload) {
//   return { type: SET_CONTEXT, payload: payload };
// }

// export function deleteSave(payload){
//   return { type: DELETE_SAVE, payload: payload };
// }
