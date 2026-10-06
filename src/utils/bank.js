import {
  ref,
  onValue,
  set,
  push,
  runTransaction,
  remove
} from "firebase/database";

import { database } from "../firebase";


// ========================================
// ฟังยอดเงิน
// ========================================

export const listenBankBalance = (callback) => {
  const balanceRef = ref(
    database,
    "bank/balance"
  );

  return onValue(
    balanceRef,
    (snapshot) => {
      const value = snapshot.val();

      callback(
        typeof value === "number"
          ? value
          : Number(value) || 0
      );
    }
  );
};


// ========================================
// ตั้งยอดเงิน
// ========================================

export const saveBankBalance = async (amount) => {
  const balanceRef = ref(
    database,
    "bank/balance"
  );

  await set(
    balanceRef,
    Number(amount) || 0
  );
};


// ========================================
// ฟังประวัติรายการ
// ========================================

export const listenBankTransactions = (callback) => {
  const transactionsRef = ref(
    database,
    "bank/transactions"
  );

  return onValue(
    transactionsRef,
    (snapshot) => {
      const data =
        snapshot.val() || {};

      callback(data);
    }
  );
};


// ========================================
// เพิ่มรายการเงินเข้า / เงินออก
// ========================================

export const addBankTransaction = async ({
  type,
  amount,
  reason,
  createdBy
}) => {

  const numericAmount =
    Number(amount);

  // ตรวจสอบจำนวนเงิน
  if (
    !Number.isFinite(numericAmount) ||
    numericAmount <= 0
  ) {
    throw new Error(
      "จำนวนเงินต้องมากกว่า 0"
    );
  }

  // ตรวจสอบประเภท
  if (
    type !== "income" &&
    type !== "expense"
  ) {
    throw new Error(
      "ประเภทรายการไม่ถูกต้อง"
    );
  }

  // ตรวจสอบรายละเอียด
  if (!reason?.trim()) {
    throw new Error(
      "กรุณาระบุรายละเอียด"
    );
  }

  // ตรวจสอบผู้ทำรายการ
  if (!createdBy?.trim()) {
    throw new Error(
      "กรุณาระบุชื่อผู้ทำรายการ"
    );
  }


  // ======================================
  // สร้าง Transaction ID
  // ======================================

  const transactionRef = push(
    ref(
      database,
      "bank/transactions"
    )
  );

  const transactionId =
    transactionRef.key;

  if (!transactionId) {
    throw new Error(
      "ไม่สามารถสร้างรหัสรายการได้"
    );
  }


  // ======================================
  // แก้ยอดเงิน
  // ======================================

  const balanceRef = ref(
    database,
    "bank/balance"
  );

  let errorMessage = "";

  const result =
    await runTransaction(
      balanceRef,
      (currentBalance) => {

        const balance =
          Number(currentBalance) || 0;


        // เงินเข้า
        if (type === "income") {
          return (
            balance +
            numericAmount
          );
        }


        // เงินออก
        if (type === "expense") {

          if (
            numericAmount >
            balance
          ) {

            errorMessage =
              `เงินในบัญชีไม่พอ\n\n` +
              `ยอดคงเหลือ: ${balance.toLocaleString()} บาท\n` +
              `ต้องการหัก: ${numericAmount.toLocaleString()} บาท`;

            return;
          }

          return (
            balance -
            numericAmount
          );
        }

        return;
      }
    );


  // ======================================
  // ตรวจสอบการแก้ยอด
  // ======================================

  if (!result.committed) {

    if (errorMessage) {
      throw new Error(
        errorMessage
      );
    }

    throw new Error(
      "ไม่สามารถแก้ไขยอดเงินใน Firebase ได้"
    );
  }


  // ======================================
  // สร้างรายการ
  // ======================================

  const transaction = {

    id:
      transactionId,

    type:
      type,

    amount:
      numericAmount,

    reason:
      reason.trim(),

    createdBy:
      createdBy.trim(),

    createdAt:
      new Date().toISOString()

  };


  try {

    await set(
      transactionRef,
      transaction
    );

    return transaction;

  } catch (error) {

    console.error(
      "CREATE BANK TRANSACTION ERROR:",
      error
    );

    throw new Error(
      error?.message ||
      "ไม่สามารถบันทึกรายการได้"
    );
  }
};


// ========================================
// แก้ไขรายการ
// ========================================

export const updateBankTransaction = async (
  transactionId,
  data
) => {

  const bankRef = ref(
    database,
    "bank"
  );

  const result =
    await runTransaction(
      bankRef,
      (currentData) => {

        if (!currentData) {
          return;
        }

        if (
          !currentData.transactions ||
          !currentData.transactions[
            transactionId
          ]
        ) {
          return;
        }


        const oldTransaction =
          currentData.transactions[
            transactionId
          ];

        const oldAmount =
          Number(
            oldTransaction.amount
          ) || 0;

        const oldType =
          oldTransaction.type;

        const newAmount =
          data.amount !== undefined
            ? Number(data.amount)
            : oldAmount;

        const newType =
          data.type ||
          oldType;


        if (
          !Number.isFinite(
            newAmount
          ) ||
          newAmount <= 0
        ) {
          return;
        }

        if (
          newType !== "income" &&
          newType !== "expense"
        ) {
          return;
        }


        let balance =
          Number(
            currentData.balance
          ) || 0;


        // คืนผลของรายการเก่า
        if (
          oldType === "income"
        ) {
          balance -= oldAmount;
        }

        if (
          oldType === "expense"
        ) {
          balance += oldAmount;
        }


        // ใส่รายการใหม่
        if (
          newType === "income"
        ) {

          balance += newAmount;

        } else {

          if (
            newAmount >
            balance
          ) {
            return;
          }

          balance -= newAmount;
        }


        currentData.balance =
          balance;


        currentData.transactions[
          transactionId
        ] = {

          ...oldTransaction,

          ...data,

          id:
            transactionId,

          amount:
            newAmount,

          type:
            newType,

          updatedAt:
            new Date().toISOString()

        };


        return currentData;
      }
    );


  if (!result.committed) {

    throw new Error(
      "ไม่สามารถแก้ไขรายการได้ หรือเงินในบัญชีไม่เพียงพอ"
    );
  }
};


// ========================================
// ลบประวัติรายการ
// ========================================
// หมายเหตุ:
// ลบเฉพาะประวัติ
// ไม่แก้ไขยอดเงินใน BANK
// ========================================

export const deleteBankTransaction = async (
  transactionId
) => {

  if (!transactionId) {
    throw new Error(
      "ไม่พบรหัสรายการ"
    );
  }


  const transactionRef = ref(
    database,
    `bank/transactions/${transactionId}`
  );


  try {

    await remove(
      transactionRef
    );

  } catch (error) {

    console.error(
      "DELETE BANK TRANSACTION ERROR:",
      error
    );

    throw new Error(
      error?.message ||
      "ไม่สามารถลบรายการได้"
    );
  }
};