import { all } from "redux-saga/effects";
import { remindersSaga } from "./remindersSaga";

/**
 * Root Saga - Combines all sagas
 */
export function* rootSaga() {
  yield all([remindersSaga()]);
}
