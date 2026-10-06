
import {
  ref,
  push,
  onValue
} from "firebase/database";

import { database } from "../firebase";

export const addReport = async (reportData) => {
  const reportRef = ref(
    database,
    "report"
  );

  await push(
    reportRef,
    reportData
  );
};

export const listenReport = (callback) => {
  const reportRef = ref(
    database,
    "report"
  );

  return onValue(
    reportRef,
    (snapshot) => {
      callback(
        snapshot.val() || {}
      );
    }
  );
};

