export const ADD_DIALOG = "ADD_DIALOG";
export const SET_DIALOG = "SET_DIALOG";
export const ADD_USER = "ADD_USER";
export const SET_USER = "SET_USER";
export const CHANGE_LANGUAGE = "CHANGE_LANGUAGE";
export const CHANGE_CONTEXT = "CHANGE_CONTEXT";
export const SETTING_SAVE = "SETTING_SAVE";
export const SET_SAVE = "SET_SAVE";
export const DELETE_SAVE = "DELETE_SAVE";
export const SET_GRA_SCORE = "SET_GRA_SCORE";
export const SET_PRO_SCORE = "SET_PRO_SCORE";
export const SET_DIA_SCORE = "SET_DIA_SCORE";
export const SET_CREDIT = "SET_CREDIT";
export const SET_ITEM = "SET_ITEM";
export const ADD_ITEM = "ADD_ITEM";
export const SET_POINT = "SET_POINT";
export const EQUIP = "EQUIP";
export const RESET_STATE = "RESET_STATE";

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
export function settingSave(payload) {
  return { type: SETTING_SAVE, payload: payload };
}
export function setSave(payload) {
  return { type: SET_SAVE, payload: payload };
}
export function deleteSave(payload) {
  return { type: DELETE_SAVE, payload: payload };
}
export function setGraScore(payload) {
  return { type: SET_GRA_SCORE, payload: payload };
}
export function setProScore(payload) {
  return { type: SET_PRO_SCORE, payload: payload };
}

export function setDiaScore(payload) {
  return { type: SET_DIA_SCORE, payload: payload };
}

export function setCredit(payload) {
  return { type: SET_CREDIT, payload: payload };
}
export function setItem(payload) {
  return { type: SET_ITEM, payload: payload };
}
export function addItem(payload) {
  return { type: ADD_ITEM, payload: payload };
}
export function setPoint(payload) {
  return { type: SET_POINT, payload: payload };
}
export function equip(payload) {
  return { type: EQUIP, payload: payload };
}

export function resetState() {
  return { type: RESET_STATE };
}
