import tasksReducer from "./taskReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  tasksReducer,
});

export default rootReducer;