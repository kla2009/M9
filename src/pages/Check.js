
import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import "../CSS/Check.css";

import {
  DEFAULT_MEMBERS,
  listenMembers,
  listenWeeks,
  listenSubmissions,
  getCheckItemsByHouse
} from "../utils/check";


function formatDate(dateString) {

  if (!dateString) {
    return "-";
  }

  const parts =
    dateString.split("-");

  if (parts.length !== 3) {
    return dateString;
  }

  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}


function getMonday(date) {

  const result =
    new Date(date);

  const day =
    result.getDay();

  const diff =
    day === 0
      ? -6
      : 1 - day;

  result.setDate(
    result.getDate() + diff
  );

  result.setHours(
    0,
    0,
    0,
    0
  );

  return result;
}


function formatInputDate(date) {

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function getDefaultWeek() {

  const monday =
    getMonday(
      new Date()
    );

  const sunday =
    new Date(monday);

  sunday.setDate(
    monday.getDate() + 6
  );

  return {

    id:
      formatInputDate(monday),

    label:
      "Week 1",

    startDate:
      formatInputDate(monday),

    endDate:
      formatInputDate(sunday),

    requiredItemsByHouse: {

      Black: {
        redMoney: true,
        cement: true
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

    requiredItems: {}

  };
}


function Check() {

  /* =========================================
     STATE
  ========================================= */

  const [members, setMembers] =
    useState(DEFAULT_MEMBERS);

  const [weeks, setWeeks] =
    useState({});

  const [selectedWeekId, setSelectedWeekId] =
    useState("");

  const [submissions, setSubmissions] =
    useState({});

  const [house, setHouse] =
    useState("Black");

  const [selectedMemberId, setSelectedMemberId] =
    useState("");


  /* =========================================
     DEFAULT WEEK
  ========================================= */

  const defaultWeek =
    useMemo(
      () => getDefaultWeek(),
      []
    );


  /* =========================================
     MEMBERS REALTIME
  ========================================= */

  useEffect(() => {

    const unsubscribe =
      listenMembers(
        (data) => {

          setMembers(
            data || DEFAULT_MEMBERS
          );

        }
      );

    return () => {

      if (unsubscribe) {
        unsubscribe();
      }

    };

  }, []);


  /* =========================================
     WEEKS REALTIME
  ========================================= */

  useEffect(() => {

    const unsubscribe =
      listenWeeks(
        (data) => {

          setWeeks(
            data || {}
          );

        }
      );

    return () => {

      if (unsubscribe) {
        unsubscribe();
      }

    };

  }, []);


  /* =========================================
     SORT WEEKS
  ========================================= */

  const sortedWeekIds =
    useMemo(() => {

      return Object.keys(
        weeks || {}
      ).sort(
        (a, b) => {

          const weekA =
            weeks[a];

          const weekB =
            weeks[b];

          const dateA =
            weekA?.startDate || a;

          const dateB =
            weekB?.startDate || b;

          return dateA.localeCompare(
            dateB
          );

        }
      );

    }, [weeks]);


  /* =========================================
     SELECT DEFAULT WEEK
  ========================================= */

  useEffect(() => {

    if (
      sortedWeekIds.length === 0
    ) {

      setSelectedWeekId(
        defaultWeek.id
      );

      return;

    }


    const exists =
      sortedWeekIds.includes(
        selectedWeekId
      );


    if (
      !selectedWeekId ||
      !exists
    ) {

      setSelectedWeekId(
        sortedWeekIds[
          sortedWeekIds.length - 1
        ]
      );

    }

  }, [
    sortedWeekIds,
    selectedWeekId,
    defaultWeek.id
  ]);


  /* =========================================
     SUBMISSIONS REALTIME
     อ่านอย่างเดียว
  ========================================= */

  useEffect(() => {

    if (!selectedWeekId) {

      setSubmissions({});

      return;

    }

    const unsubscribe =
      listenSubmissions(
        selectedWeekId,
        (data) => {

          setSubmissions(
            data || {}
          );

        }
      );

    return () => {

      if (unsubscribe) {
        unsubscribe();
      }

    };

  }, [
    selectedWeekId
  ]);


  /* =========================================
     SELECTED WEEK
  ========================================= */

  const selectedWeek =
    weeks[selectedWeekId] ||
    defaultWeek;


  /* =========================================
     MEMBERS BY HOUSE
  ========================================= */

  const houseMembers =
    Object.values(
      members || {}
    ).filter(
      (member) =>
        member.house === house
    );


  /* =========================================
     RESET MEMBER WHEN HOUSE CHANGES
  ========================================= */

  useEffect(() => {

    const exists =
      houseMembers.some(
        (member) =>
          member.id === selectedMemberId
      );

    if (!exists) {

      setSelectedMemberId("");

    }

  }, [
    houseMembers,
    selectedMemberId
  ]);


  /* =========================================
     REQUIRED ITEMS
  ========================================= */

  const displayedItems =
    useMemo(() => {

      const defaultItems =
        getCheckItemsByHouse(
          house
        );

      const saved =
        selectedWeek
          ?.requiredItemsByHouse
          ?.[house];


      if (!saved) {

        return defaultItems;

      }


      return defaultItems.filter(
        (item) =>
          saved[item.key] === true
      );

    }, [
      house,
      selectedWeek
    ]);


  /* =========================================
     MEMBERS TO SHOW
  ========================================= */

  const visibleMembers =
    selectedMemberId
      ? houseMembers.filter(
          (member) =>
            member.id ===
            selectedMemberId
        )
      : houseMembers;


  /* =========================================
     MEMBER STATUS
  ========================================= */

  const getMemberCompleted =
    (memberId) => {

      const member =
        submissions[
          memberId
        ] || {};

      return displayedItems.filter(
        (item) =>
          member[
            item.key
          ] === true
      ).length;

    };


  const isMemberComplete =
    (memberId) => {

      if (
        displayedItems.length === 0
      ) {

        return false;

      }

      return (
        getMemberCompleted(
          memberId
        ) ===
        displayedItems.length
      );

    };


  /* =========================================
     SUMMARY
  ========================================= */

  const completedCount =
    houseMembers.filter(
      (member) =>
        isMemberComplete(
          member.id
        )
    ).length;


  const incompleteCount =
    houseMembers.length -
    completedCount;


  /* =========================================
     RENDER
  ========================================= */

  return (

    <div className="check-page">

      {/* HEADER */}

      <div className="check-header">

        <span>
          MNINE / CHECK
        </span>

        <h1>
          CHECK
        </h1>

        <p>
          ระบบตรวจสอบการส่งของประจำสัปดาห์
        </p>

      </div>


      {/* HOUSE */}

      <div className="check-house-switch">

        <button
          type="button"
          className={
            house === "Black"
              ? "active black"
              : "black"
          }
          onClick={() =>
            setHouse("Black")
          }
        >
          🖤 BLACK HOUSE
        </button>


        <button
          type="button"
          className={
            house === "White"
              ? "active white"
              : "white"
          }
          onClick={() =>
            setHouse("White")
          }
        >
          🤍 WHITE HOUSE
        </button>

      </div>


      {/* MEMBER SELECT */}

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto 20px"
        }}
      >

        <div
          className="check-section-label"
          style={{
            marginBottom: "10px"
          }}
        >
          เลือกชื่อเพื่อดูประวัติ
        </div>


        <select
          value={selectedMemberId}
          onChange={(e) =>
            setSelectedMemberId(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "14px 15px",
            borderRadius: "12px",
            border:
              "1px solid #292929",
            background:
              "#101010",
            color: "#fff",
            outline: "none",
            fontFamily:
              "inherit",
            fontSize: "15px"
          }}
        >

          <option value="">
            -- ดูสมาชิกทั้งหมด --
          </option>

          {houseMembers.map(
            (member) => (

              <option
                key={member.id}
                value={member.id}
              >
                {member.name}
              </option>

            )
          )}

        </select>

      </div>


      {/* WEEK */}

      <div className="check-week">

        <button
          type="button"
          disabled={
            sortedWeekIds.indexOf(
              selectedWeekId
            ) <= 0
          }
          onClick={() => {

            const index =
              sortedWeekIds.indexOf(
                selectedWeekId
              );

            if (index > 0) {

              setSelectedWeekId(
                sortedWeekIds[
                  index - 1
                ]
              );

            }

          }}
        >
          ‹
        </button>


        <div className="check-week-info">

          <span>
            {selectedWeek.label}
          </span>

          <strong>
            {formatDate(
              selectedWeek.startDate
            )}
            {" - "}
            {formatDate(
              selectedWeek.endDate
            )}
          </strong>

        </div>


        <button
          type="button"
          disabled={
            sortedWeekIds.indexOf(
              selectedWeekId
            ) ===
            sortedWeekIds.length - 1
          }
          onClick={() => {

            const index =
              sortedWeekIds.indexOf(
                selectedWeekId
              );

            if (
              index >= 0 &&
              index <
                sortedWeekIds.length - 1
            ) {

              setSelectedWeekId(
                sortedWeekIds[
                  index + 1
                ]
              );

            }

          }}
        >
          ›
        </button>

      </div>


      {/* HISTORY */}

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto 20px"
        }}
      >

        <select
          value={selectedWeekId}
          onChange={(e) =>
            setSelectedWeekId(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "13px 15px",
            borderRadius: "12px",
            border:
              "1px solid #292929",
            background:
              "#101010",
            color: "#fff",
            outline: "none",
            fontFamily:
              "inherit"
          }}
        >

          {sortedWeekIds.map(
            (weekId) => (

              <option
                key={weekId}
                value={weekId}
              >

                {weeks[weekId].label}
                {" — "}
                {formatDate(
                  weeks[weekId].startDate
                )}
                {" - "}
                {formatDate(
                  weeks[weekId].endDate
                )}

              </option>

            )
          )}

        </select>

      </div>


      {/* REQUIRED ITEMS */}

      <div className="check-items">

        <div className="check-section-label">

          {house === "Black"
            ? "🖤 ของที่บ้านดำต้องส่ง"
            : "🤍 ของที่บ้านขาวต้องส่ง"}

        </div>


        <div className="check-item-list">

          {displayedItems.length > 0 ? (

            displayedItems.map(
              (item) => (

                <div
                  key={item.key}
                  className="check-item"
                  style={{
                    borderColor:
                      "#e50914",
                    color:
                      "#fff",
                    background:
                      "rgba(229,9,20,0.10)",
                    cursor:
                      "default"
                  }}
                >

                  ✓ {item.label}

                </div>

              )
            )

          ) : (

            <div
              style={{
                width: "100%",
                padding: "15px",
                border:
                  "1px solid #292929",
                borderRadius: "10px",
                color: "#666",
                textAlign: "center"
              }}
            >
              Admin ยังไม่ได้กำหนดรายการที่ต้องส่ง
            </div>

          )}

        </div>

      </div>


      {/* SUMMARY */}

      <div className="check-summary">

        <div className="check-summary-card">

          <span>
            MEMBERS
          </span>

          <strong>
            {houseMembers.length}
          </strong>

          <p>
            สมาชิก
          </p>

        </div>


        <div className="check-summary-card">

          <span>
            COMPLETE
          </span>

          <strong>
            {completedCount}
          </strong>

          <p>
            ส่งครบ
          </p>

        </div>


        <div className="check-summary-card">

          <span>
            INCOMPLETE
          </span>

          <strong>
            {incompleteCount}
          </strong>

          <p>
            ยังส่งไม่ครบ
          </p>

        </div>

      </div>


      {/* VIEW ONLY */}

      <div className="check-permission">

        <strong>
          VIEW ONLY
        </strong>

        <span>
          หน้านี้สามารถดูประวัติการ CHECK ได้อย่างเดียว
          ไม่สามารถแก้ไขสถานะ ✓ / ✕ ได้
        </span>

      </div>


      {/* TABLE */}

      <div className="check-table-wrapper">

        <table className="check-table">

          <thead>

            <tr>

              <th>
                #
              </th>

              <th>
                สมาชิก
              </th>

              <th>
                วันที่
              </th>

              {displayedItems.map(
                (item) => (

                  <th
                    key={item.key}
                  >
                    {item.label}
                  </th>

                )
              )}

              <th>
                STATUS
              </th>

            </tr>

          </thead>


          <tbody>

            {visibleMembers.map(
              (member, index) => {

                const completed =
                  getMemberCompleted(
                    member.id
                  );

                const complete =
                  isMemberComplete(
                    member.id
                  );


                return (

                  <tr
                    key={member.id}
                  >

                    <td>
                      {index + 1}
                    </td>


                    <td className="member-name">
                      {member.name}
                    </td>


                    <td>
                      {formatDate(
                        selectedWeek.startDate
                      )}
                    </td>


                    {displayedItems.map(
                      (item) => {

                        const checked =
                          submissions[
                            member.id
                          ]?.[
                            item.key
                          ] === true;


                        return (

                          <td
                            key={item.key}
                          >

                            {/* VIEW ONLY — ไม่สามารถกดได้ */}

                            <span
                              className={
                                `check-status ${
                                  checked
                                    ? "checked"
                                    : "unchecked"
                                }`
                              }
                              title="ดูสถานะเท่านั้น"
                            >

                              {checked
                                ? "✓"
                                : "✕"}

                            </span>

                          </td>

                        );

                      }
                    )}


                    <td>

                      <span
                        className={
                          `check-result ${
                            complete
                              ? "complete"
                              : "incomplete"
                          }`
                        }
                      >

                        {complete
                          ? "ส่งครบ"
                          : `${completed}/${displayedItems.length}`}

                      </span>

                    </td>

                  </tr>

                );

              }
            )}

          </tbody>

        </table>

      </div>


      {/* MOBILE */}

      <div className="check-mobile-list">

        {visibleMembers.map(
          (member, index) => {

            const completed =
              getMemberCompleted(
                member.id
              );

            const complete =
              isMemberComplete(
                member.id
              );


            return (

              <div
                className="check-mobile-card"
                key={member.id}
              >

                <div
                  className="check-mobile-header"
                >

                  <div>

                    <small>
                      #{index + 1}
                    </small>

                    <strong>
                      {member.name}
                    </strong>

                  </div>


                  <span
                    className={
                      `check-result ${
                        complete
                          ? "complete"
                          : "incomplete"
                      }`
                    }
                  >

                    {complete
                      ? "ส่งครบ"
                      : `${completed}/${displayedItems.length}`}

                  </span>

                </div>


                <div
                  className="check-mobile-date"
                >

                  {formatDate(
                    selectedWeek.startDate
                  )}

                </div>


                <div
                  className="check-mobile-items"
                >

                  {displayedItems.map(
                    (item) => {

                      const checked =
                        submissions[
                          member.id
                        ]?.[
                          item.key
                        ] === true;


                      return (

                        <div
                          className="check-mobile-item"
                          key={item.key}
                        >

                          <span>
                            {item.label}
                          </span>


                          {/* VIEW ONLY */}

                          <span
                            className={
                              `check-status ${
                                checked
                                  ? "checked"
                                  : "unchecked"
                              }`
                            }
                            title="ดูสถานะเท่านั้น"
                          >

                            {checked
                              ? "✓"
                              : "✕"}

                          </span>

                        </div>

                      );

                    }
                  )}

                </div>

              </div>

            );

          }
        )}

      </div>


      {/* FOOTER */}

      <div className="check-footer">

        <span>
          {house === "Black"
            ? "BLACK HOUSE"
            : "WHITE HOUSE"}
        </span>

        <p>
          ดูประวัติ CHECK ได้อย่างเดียว
        </p>

      </div>

    </div>

  );

}


export default Check;

