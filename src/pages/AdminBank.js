import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  listenBankBalance,
  listenBankTransactions,
  addBankTransaction,
  deleteBankTransaction
} from "../utils/bank";

import "../CSS/AdminBank.css";


function AdminBank() {

  const [balance, setBalance] =
    useState(0);

  const [transactions, setTransactions] =
    useState({});


  const [type, setType] =
    useState("income");

  const [amount, setAmount] =
    useState("");

  const [reason, setReason] =
    useState("");

  const [createdBy, setCreatedBy] =
    useState("");


  const [saving, setSaving] =
    useState(false);


  // ========================================
  // CHECK ADMIN LOGIN
  // ========================================

  const isAdmin =
    localStorage.getItem(
      "m9-admin-login"
    ) === "true";


  // ========================================
  // FIREBASE LISTENERS
  // ========================================

  useEffect(() => {

    const unsubscribeBalance =
      listenBankBalance(
        setBalance
      );


    const unsubscribeTransactions =
      listenBankTransactions(
        setTransactions
      );


    return () => {

      unsubscribeBalance();
      unsubscribeTransactions();

    };

  }, []);


  // ========================================
  // SORT TRANSACTIONS
  // ========================================

  const transactionList =
    useMemo(() => {

      return Object.values(
        transactions || {}
      ).sort(
        (a, b) =>
          new Date(
            b.createdAt
          ) -
          new Date(
            a.createdAt
          )
      );

    }, [transactions]);


  // ========================================
  // FORMAT MONEY
  // ========================================

  const formatMoney = (value) => {

    return new Intl.NumberFormat(
      "th-TH"
    ).format(
      Number(value) || 0
    );

  };


  // ========================================
  // ADD TRANSACTION
  // ========================================

  const handleAddTransaction =
    async (e) => {

      e.preventDefault();


      if (
        !amount ||
        Number(amount) <= 0
      ) {

        alert(
          "กรุณาระบุจำนวนเงิน"
        );

        return;
      }


      if (!reason.trim()) {

        alert(
          "กรุณาระบุรายละเอียด"
        );

        return;
      }


      if (!createdBy.trim()) {

        alert(
          "กรุณาระบุชื่อผู้ทำรายการ"
        );

        return;
      }


      try {

        setSaving(true);


        await addBankTransaction({

          type,

          amount:
            Number(amount),

          reason:
            reason.trim(),

          createdBy:
            createdBy.trim()

        });


        // เคลียร์ช่อง
        setAmount("");
        setReason("");


        alert(
          type === "income"
            ? "เพิ่มเงินเรียบร้อยแล้ว"
            : "หักเงินเรียบร้อยแล้ว"
        );


      } catch (error) {

        console.error(
          "ADD BANK TRANSACTION ERROR:",
          error
        );


        alert(
          error?.message ||
          "ไม่สามารถบันทึกรายการได้"
        );


      } finally {

        setSaving(false);

      }
    };


  // ========================================
  // DELETE TRANSACTION
  // ========================================

  const handleDeleteTransaction =
    async (transactionId) => {

      const confirmed =
        window.confirm(
          "ต้องการลบรายการนี้ใช่หรือไม่?"
        );


      if (!confirmed) {
        return;
      }


      try {

        await deleteBankTransaction(
          transactionId
        );


        alert(
          "ลบรายการเรียบร้อยแล้ว"
        );


      } catch (error) {

        console.error(
          "DELETE BANK TRANSACTION ERROR:",
          error
        );


        alert(
          error?.message ||
          "ไม่สามารถลบรายการได้"
        );

      }
    };


  // ========================================
  // NOT ADMIN
  // ========================================

  if (!isAdmin) {

    return (

      <div className="admin-bank-page">

        <div className="admin-bank-denied">

          <div className="admin-bank-denied-code">
            403
          </div>

          <h1>
            ACCESS DENIED
          </h1>

          <p>
            หน้านี้สำหรับ Admin เท่านั้น
          </p>

        </div>

      </div>

    );
  }


  // ========================================
  // ADMIN PAGE
  // ========================================

  return (

    <div className="admin-bank-page">

      <div className="admin-bank-container">


        {/* HEADER */}

        <div className="admin-bank-header">

          <div className="admin-bank-label">
            M9 ADMINISTRATION
          </div>

          <h1>
            BANK MANAGEMENT
          </h1>

          <p>
            จัดการเงินกลางของแก๊ง
          </p>

        </div>


        {/* BALANCE */}

        <div className="admin-bank-balance">

          <div>

            <div className="admin-bank-balance-label">
              CURRENT BALANCE
            </div>

            <div className="admin-bank-balance-value">
              ฿ {formatMoney(balance)}
            </div>

          </div>

        </div>


        {/* ADD TRANSACTION */}

        <div className="admin-bank-section">

          <div className="admin-bank-section-title">

            <span>
              TRANSACTION
            </span>

            <h2>
              เพิ่มรายการ
            </h2>

          </div>


          <form
            className="admin-bank-form"
            onSubmit={
              handleAddTransaction
            }
          >


            {/* TYPE */}

            <div className="admin-bank-type">

              <button
                type="button"
                className={
                  type === "income"
                    ? "active income"
                    : ""
                }
                onClick={() =>
                  setType("income")
                }
                disabled={saving}
              >
                + เงินเข้า
              </button>


              <button
                type="button"
                className={
                  type === "expense"
                    ? "active expense"
                    : ""
                }
                onClick={() =>
                  setType("expense")
                }
                disabled={saving}
              >
                - เงินออก
              </button>

            </div>


            {/* AMOUNT */}

            <div className="admin-bank-field">

              <label>
                จำนวนเงิน
              </label>

              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
                placeholder="เช่น 500000"
                disabled={saving}
              />

            </div>


            {/* REASON */}

            <div className="admin-bank-field">

              <label>
                รายละเอียด
              </label>

              <input
                type="text"
                value={reason}
                onChange={(e) =>
                  setReason(
                    e.target.value
                  )
                }
                placeholder="เช่น ซื้ออุปกรณ์"
                disabled={saving}
              />

            </div>


            {/* CREATED BY */}

            <div className="admin-bank-field">

              <label>
                ผู้ทำรายการ
              </label>

              <input
                type="text"
                value={createdBy}
                onChange={(e) =>
                  setCreatedBy(
                    e.target.value
                  )
                }
                placeholder="เช่น PHAYU"
                disabled={saving}
              />

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              className={
                `admin-bank-submit ${
                  type === "income"
                    ? "income"
                    : "expense"
                }`
              }
              disabled={saving}
            >

              {saving
                ? "กำลังบันทึก..."
                : type === "income"
                ? "เพิ่มเงิน"
                : "หักเงิน"}

            </button>

          </form>

        </div>


        {/* TRANSACTION HISTORY */}

        <div className="admin-bank-section">

          <div className="admin-bank-section-title">

            <span>
              TRANSACTION HISTORY
            </span>

            <h2>
              ประวัติรายการ
            </h2>

          </div>


          {transactionList.length === 0 ? (

            <div className="admin-bank-empty">
              ยังไม่มีประวัติรายการ
            </div>

          ) : (

            <div className="admin-bank-list">

              {transactionList.map(
                (transaction) => {

                  const isIncome =
                    transaction.type ===
                    "income";


                  return (

                    <div
                      key={
                        transaction.id
                      }
                      className="admin-bank-transaction"
                    >

                      <div className="admin-bank-transaction-info">

                        <div className="admin-bank-transaction-reason">
                          {
                            transaction.reason ||
                            "ไม่มีรายละเอียด"
                          }
                        </div>


                        <div className="admin-bank-transaction-meta">
                          ผู้ทำรายการ:{" "}
                          {
                            transaction.createdBy ||
                            "-"
                          }
                        </div>


                        <div className="admin-bank-transaction-meta">

                          {transaction.createdAt

                            ? new Date(
                                transaction.createdAt
                              ).toLocaleString(
                                "th-TH",
                                {
                                  dateStyle:
                                    "medium",

                                  timeStyle:
                                    "short"
                                }
                              )

                            : "-"
                          }

                        </div>

                      </div>


                      <div className="admin-bank-transaction-right">

                        <div
                          className={
                            `admin-bank-transaction-amount ${
                              isIncome
                                ? "income"
                                : "expense"
                            }`
                          }
                        >

                          {isIncome
                            ? "+"
                            : "-"
                          }{" "}

                          ฿{" "}

                          {
                            formatMoney(
                              transaction.amount
                            )
                          }

                        </div>


                        <button
                          type="button"
                          className="admin-bank-delete"
                          onClick={() =>
                            handleDeleteTransaction(
                              transaction.id
                            )
                          }
                        >
                          ลบ
                        </button>

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          )}

        </div>

      </div>

    </div>

  );
}


export default AdminBank;