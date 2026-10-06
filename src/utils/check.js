import {
  ref,
  onValue,
  set,
  update,
  remove
} from "firebase/database";

import { database } from "../firebase";


/* =====================================================
   MEMBERS
===================================================== */

export const DEFAULT_MEMBERS = {
  "black-1": {
    id: "black-1",
    house: "Black",
    name: "Phayu"
  },
  "black-2": {
    id: "black-2",
    house: "Black",
    name: "X"
  },
  "black-3": {
    id: "black-3",
    house: "Black",
    name: "God"
  },
  "black-4": {
    id: "black-4",
    house: "Black",
    name: "Feat"
  },
  "black-5": {
    id: "black-5",
    house: "Black",
    name: "Jim"
  },
  "black-6": {
    id: "black-6",
    house: "Black",
    name: "Hatari"
  },
  "black-7": {
    id: "black-7",
    house: "Black",
    name: "Blue"
  },
  "black-8": {
    id: "black-8",
    house: "Black",
    name: "Essence"
  },
  "black-9": {
    id: "black-9",
    house: "Black",
    name: "Thid"
  },

  "white-1": {
    id: "white-1",
    house: "White",
    name: "Mafai"
  },
  "white-2": {
    id: "white-2",
    house: "White",
    name: "Lee"
  },
  "white-3": {
    id: "white-3",
    house: "White",
    name: "Dar"
  },
  "white-4": {
    id: "white-4",
    house: "White",
    name: "Tiger"
  },
  "white-5": {
    id: "white-5",
    house: "White",
    name: "Vic"
  },
  "white-6": {
    id: "white-6",
    house: "White",
    name: "Jeff"
  },
  "white-7": {
    id: "white-7",
    house: "White",
    name: "Khom"
  },
  "white-8": {
    id: "white-8",
    house: "White",
    name: "Yuto"
  },
  "white-9": {
    id: "white-9",
    house: "White",
    name: "Kaopun"
  },
  "white-10": {
    id: "white-10",
    house: "White",
    name: "Khom"
  },
  "white-11": {
    id: "white-11",
    house: "White",
    name: "Nori Seaweed"
  },
  "white-12": {
    id: "white-12",
    house: "White",
    name: "Taaum MHZ"
  },
  "white-13": {
    id: "white-13",
    house: "White",
    name: "Aum"
  },
  "white-14": {
    id: "white-14",
    house: "White",
    name: "Chopper"
  },
  "white-15": {
    id: "white-15",
    house: "White",
    name: "Kla"
  },
  "white-16": {
    id: "white-16",
    house: "White",
    name: "Melon"
  }
};


/* =====================================================
   ALL ITEMS
===================================================== */

export const CHECK_ITEMS = [
  {
    key: "money",
    label: "เงิน"
  },
  {
    key: "woodBox",
    label: "กล่องไม้"
  },
  {
    key: "steelBox",
    label: "กล่องเหล็ก"
  },
  {
    key: "rawStone",
    label: "หินดิบ"
  },
  {
    key: "cyberHaze",
    label: "CyberHaze"
  },
  {
    key: "redMoney",
    label: "เงินแดง"
  },
  {
    key: "cement",
    label: "ปูน"
  },
  {
    key: "ยา",
    label: "CyberHaze"
  },
  {
    key: "farmCoin",
    label: "เหรียญฟาร์ม"
  }
];


/* =====================================================
   ITEMS BY HOUSE
===================================================== */

export const BLACK_CHECK_ITEMS = [
  {
    key: "redMoney",
    label: "เงินแดง"
  },
  {
    key: "cement",
    label: "ปูน"
  },
  {
    key: "ยา",
    label: "CyberHaze"
  }
];


export const WHITE_CHECK_ITEMS = [
  {
    key: "money",
    label: "เงิน"
  },
  {
    key: "woodBox",
    label: "กล่องไม้"
  },
  {
    key: "steelBox",
    label: "กล่องเหล็ก"
  },
  {
    key: "rawStone",
    label: "หินดิบ"
  },
  {
    key: "cyberHaze",
    label: "CyberHaze"
  },
  {
    key: "farmCoin",
    label: "เหรียญฟาร์ม"
  }
];


export const getCheckItemsByHouse = (
  house
) => {

  if (house === "Black") {
    return BLACK_CHECK_ITEMS;
  }

  return WHITE_CHECK_ITEMS;
};


/* =====================================================
   MEMBERS - REALTIME
===================================================== */

export const listenMembers = (
  callback
) => {

  const membersRef =
    ref(
      database,
      "check/members"
    );

  return onValue(
    membersRef,
    (snapshot) => {

      const data =
        snapshot.val();

      if (!data) {
        callback(
          DEFAULT_MEMBERS
        );
        return;
      }

      callback(data);

    }
  );
};


/* =====================================================
   SAVE MEMBER
===================================================== */

export const saveMember = async (
  member
) => {

  if (!member?.id) {
    throw new Error(
      "ไม่พบ Member ID"
    );
  }

  const memberRef =
    ref(
      database,
      `check/members/${member.id}`
    );

  await set(
    memberRef,
    member
  );
};


/* =====================================================
   DELETE MEMBER
===================================================== */

export const deleteMember = async (
  memberId
) => {

  if (!memberId) {
    return;
  }

  const memberRef =
    ref(
      database,
      `check/members/${memberId}`
    );

  await remove(
    memberRef
  );
};


/* =====================================================
   INITIALIZE MEMBERS
===================================================== */

export const initializeMembers =
  async () => {

    const membersRef =
      ref(
        database,
        "check/members"
      );

    await set(
      membersRef,
      DEFAULT_MEMBERS
    );
  };


/* =====================================================
   WEEKS - REALTIME
===================================================== */

export const listenWeeks = (
  callback
) => {

  const weeksRef =
    ref(
      database,
      "check/weeks"
    );

  return onValue(
    weeksRef,
    (snapshot) => {

      callback(
        snapshot.val() || {}
      );

    }
  );
};


/* =====================================================
   SAVE WEEK
===================================================== */

export const saveWeek = async (
  week
) => {

  if (!week?.id) {
    throw new Error(
      "ไม่พบ Week ID"
    );
  }

  const weekRef =
    ref(
      database,
      `check/weeks/${week.id}`
    );

  await set(
    weekRef,
    {
      id:
        week.id,

      label:
        week.label || "",

      startDate:
        week.startDate || "",

      endDate:
        week.endDate || "",

      /* =========================================
         REQUIRED ITEMS BY HOUSE
      ========================================= */

      requiredItemsByHouse:
        week.requiredItemsByHouse || {

          Black: {
            redMoney: true,
            cement: true,
            ยา: true
          },

          White: {
            money: true,
            woodBox: true,
            steelBox: true,
            rawStone: true,
            cyberHaze: true,
            farmCoin: true
          }

        },

      /* =========================================
         OLD REQUIRED ITEMS
         เก็บไว้เพื่อรองรับข้อมูลเก่า
      ========================================= */

      requiredItems:
        week.requiredItems || {},

      createdAt:
        week.createdAt ||
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString()
    }
  );
};


/* =====================================================
   DELETE WEEK
===================================================== */

export const deleteWeek = async (
  weekId
) => {

  if (!weekId) {
    return;
  }

  const weekRef =
    ref(
      database,
      `check/weeks/${weekId}`
    );

  await remove(
    weekRef
  );
};


/* =====================================================
   SUBMISSIONS - REALTIME
===================================================== */

export const listenSubmissions = (
  weekId,
  callback
) => {

  if (!weekId) {

    callback({});

    return () => {};

  }

  const submissionRef =
    ref(
      database,
      `check/submissions/${weekId}`
    );

  return onValue(
    submissionRef,
    (snapshot) => {

      callback(
        snapshot.val() || {}
      );

    }
  );
};


/* =====================================================
   UPDATE SUBMISSION
===================================================== */

export const updateCheckStatus =
  async (
    weekId,
    memberId,
    itemKey,
    status
  ) => {

    if (!weekId) {
      throw new Error(
        "ไม่พบ Week"
      );
    }

    if (!memberId) {
      throw new Error(
        "ไม่พบ Member"
      );
    }

    if (!itemKey) {
      throw new Error(
        "ไม่พบ Item"
      );
    }

    const statusRef =
      ref(
        database,
        `check/submissions/${weekId}/${memberId}/${itemKey}`
      );

    await set(
      statusRef,
      Boolean(status)
    );
  };


/* =====================================================
   CLEAR MEMBER SUBMISSION
===================================================== */

export const clearMemberSubmission =
  async (
    weekId,
    memberId
  ) => {

    if (!weekId || !memberId) {
      return;
    }

    const memberRef =
      ref(
        database,
        `check/submissions/${weekId}/${memberId}`
      );

    await remove(
      memberRef
    );
  };


/* =====================================================
   CLEAR WEEK SUBMISSIONS
===================================================== */

export const clearWeekSubmissions =
  async (
    weekId
  ) => {

    if (!weekId) {
      return;
    }

    const weekRef =
      ref(
        database,
        `check/submissions/${weekId}`
      );

    await remove(
      weekRef
    );
  };


/* =====================================================
   UPDATE MANY DATA
===================================================== */

export const updateCheckData =
  async (
    updates
  ) => {

    if (!updates) {
      return;
    }

    await update(
      ref(database),
      updates
    );
  };