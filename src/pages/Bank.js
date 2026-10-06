import React, { useEffect, useMemo, useState } from "react";
import {
  listenBankBalance,
  listenBankTransactions
} from "../utils/bank";

import "../CSS/Bank.css";

function Bank() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState({});

  useEffect(() => {
    const unsubscribeBalance = listenBankBalance(setBalance);
    const unsubscribeTransactions =
      listenBankTransactions(setTransactions);

    return () => {
      unsubscribeBalance();
      unsubscribeTransactions();
    };
  }, []);

  const transactionList = useMemo(() => {
    return Object.values(transactions || {}).sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );
  }, [transactions]);

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("th-TH").format(
      Number(amount) || 0
    );
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("th-TH", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };

  return (
    <div className="bank-page">
      <div className="bank-container">

        {/* HEADER */}
        <div className="bank-header">
          <div className="bank-label">
            M9 ORGANIZATION
          </div>

          <h1>BANK</h1>

          <p>
            บัญชีเงินกลางของแก๊ง
          </p>
        </div>

        {/* BALANCE */}
        <div className="bank-balance-card">
          <div className="balance-label">
            CURRENT BALANCE
          </div>

          <div className="balance-amount">
            ฿ {formatMoney(balance)}
          </div>

          <div className="balance-description">
            สมาชิกสามารถดูยอดเงินและประวัติได้
          </div>
        </div>

        {/* TRANSACTIONS */}
        <div className="bank-transactions">

          <div className="transactions-header">
            <div className="transactions-label">
              TRANSACTIONS
            </div>

            <h2>
              ประวัติรายการ
            </h2>
          </div>

          {transactionList.length === 0 ? (
            <div className="empty-transactions">
              ยังไม่มีประวัติรายการ
            </div>
          ) : (
            <div className="transaction-list">

              {transactionList.map((transaction) => {
                const isIncome =
                  transaction.type === "income";

                return (
                  <div
                    key={transaction.id}
                    className="transaction-card"
                  >
                    <div className="transaction-info">

                      <div className="transaction-reason">
                        {transaction.reason ||
                          "ไม่มีรายละเอียด"}
                      </div>

                      <div className="transaction-user">
                        ผู้ทำรายการ:{" "}
                        {transaction.createdBy || "-"}
                      </div>

                      <div className="transaction-date">
                        {formatDate(
                          transaction.createdAt
                        )}
                      </div>

                    </div>

                    <div
                      className={`transaction-amount ${
                        isIncome
                          ? "income"
                          : "expense"
                      }`}
                    >
                      {isIncome ? "+" : "-"} ฿{" "}
                      {formatMoney(transaction.amount)}
                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Bank;