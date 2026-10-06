import {
  ref,
  push,
  onValue
} from "firebase/database";

import { database } from "../firebase";


// ==============================
// เพิ่มข้อมูลการลา
// ==============================

export const addAbsence = async (absenceData) => {

  const absenceRef = ref(
    database,
    "absence"
  );

  try {

    const result = await push(
      absenceRef,
      absenceData
    );

    console.log(
      "ABSENCE SAVED:",
      result.key
    );

    return result.key;

  } catch (error) {

    console.error(
      "ABSENCE SAVE ERROR:",
      error
    );

    throw error;

  }
};


// ==============================
// REALTIME ข้อมูลการลา
// ==============================

export const listenAbsence = (callback) => {

  const absenceRef = ref(
    database,
    "absence"
  );

  return onValue(
    absenceRef,
    (snapshot) => {

      const data =
        snapshot.val() || {};

      console.log(
        "ABSENCE REALTIME:",
        data
      );

      callback(data);

    },
    (error) => {

      console.error(
        "ABSENCE REALTIME ERROR:",
        error
      );

    }
  );
};

