import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../CSS/Admin.css';

import {
  listenAdminStatus,
  setAdminOffline
} from '../utils/adminPresence';

import {
  listenAbsence
} from '../utils/absence';

import {
  listenReport
} from '../utils/report';

import {
  DEFAULT_MEMBERS,
  listenMembers,
  listenWeeks,
  listenSubmissions,
  saveWeek,
  updateCheckStatus,
  getCheckItemsByHouse
} from '../utils/check';


function Admin() {

  const navigate = useNavigate();

  const [admins, setAdmins] = useState({});
  const [absences, setAbsences] = useState({});
  const [reports, setReports] = useState({});

  // =========================
  // CHECK DATA
  // =========================

  const [checkMembers, setCheckMembers] =
    useState(DEFAULT_MEMBERS);

  const [checkWeeks, setCheckWeeks] =
    useState({});

  const [selectedCheckWeekId, setSelectedCheckWeekId] =
    useState('');

  const [checkSubmissions, setCheckSubmissions] =
    useState({});

  const [checkHouse, setCheckHouse] =
    useState('Black');

  const [checkSaving, setCheckSaving] =
    useState(false);

  const [showCheckPanel, setShowCheckPanel] =
    useState(true);


  // =========================
  // ADMIN ONLINE
  // =========================

  useEffect(() => {

    const unsubscribe =
      listenAdminStatus((data) => {
        setAdmins(data);
      });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };

  }, []);


  // =========================
  // ABSENCE REALTIME
  // =========================

  useEffect(() => {

    const unsubscribe =
      listenAbsence((data) => {
        setAbsences(data);
      });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };

  }, []);


  // =========================
  // REPORT REALTIME
  // =========================

  useEffect(() => {

    const unsubscribe =
      listenReport((data) => {
        setReports(data);
      });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };

  }, []);


  // =========================
  // CHECK MEMBERS REALTIME
  // =========================

  useEffect(() => {

    const unsubscribe =
      listenMembers((data) => {

        setCheckMembers(
          data || DEFAULT_MEMBERS
        );

      });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };

  }, []);


  // =========================
  // CHECK WEEKS REALTIME
  // =========================

  useEffect(() => {

    const unsubscribe =
      listenWeeks((data) => {

        setCheckWeeks(
          data || {}
        );

      });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };

  }, []);


  // =========================
  // SORT WEEKS
  // =========================

  const sortedWeekIds =
    useMemo(() => {

      return Object.keys(
        checkWeeks || {}
      ).sort((a, b) => {

        const dateA =
          checkWeeks[a]?.startDate || '';

        const dateB =
          checkWeeks[b]?.startDate || '';

        return dateA.localeCompare(
          dateB
        );

      });

    }, [
      checkWeeks
    ]);


  // =========================
  // SELECT CHECK WEEK
  // =========================

  useEffect(() => {

    if (sortedWeekIds.length === 0) {

      setSelectedCheckWeekId('');

      return;

    }

    const currentExists =
      sortedWeekIds.includes(
        selectedCheckWeekId
      );

    if (
      !selectedCheckWeekId ||
      !currentExists
    ) {

      setSelectedCheckWeekId(
        sortedWeekIds[
          sortedWeekIds.length - 1
        ]
      );

    }

  }, [
    sortedWeekIds,
    selectedCheckWeekId
  ]);


  // =========================
  // CHECK SUBMISSIONS
  // =========================

  useEffect(() => {

    if (!selectedCheckWeekId) {

      setCheckSubmissions({});

      return;

    }

    setCheckSubmissions({});

    const unsubscribe =
      listenSubmissions(
        selectedCheckWeekId,
        (data) => {

          setCheckSubmissions(
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
    selectedCheckWeekId
  ]);


  // =========================
  // ADMIN LIST
  // =========================

  const adminList = [
    {
      username: 'PHAYU',
      name: 'PHAYU'
    },
    {
      username: 'MAFAI',
      name: 'MAFAI'
    },
    {
      username: 'X-RAY',
      name: 'X-RAY'
    }
  ];


  // =========================
  // TODAY
  // =========================

  const now = new Date();

  const todayString =
    `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')}`;


  // =========================
  // ABSENCE LIST
  // =========================

  const absenceList =
    Object.entries(
      absences || {}
    );


  // =========================
  // TODAY ABSENCE
  // =========================

  const todayAbsences =
    absenceList.filter(([id, item]) => {

      if (
        !item ||
        !item.startDate ||
        !item.endDate
      ) {
        return false;
      }

      return (
        todayString >= item.startDate &&
        todayString <= item.endDate
      );

    });


  // =========================
  // REPORT LIST
  // =========================

  const reportList =
    Object.entries(
      reports || {}
    );


  // =========================
  // CHECK MEMBERS
  // =========================

  const checkMemberList =
    Object.values(
      checkMembers || {}
    );

  const blackMembers =
    checkMemberList.filter(
      (member) =>
        member.house === 'Black'
    );

  const whiteMembers =
    checkMemberList.filter(
      (member) =>
        member.house === 'White'
    );


  // =========================
  // CURRENT WEEK
  // =========================

  const currentCheckWeek =
    checkWeeks[
      selectedCheckWeekId
    ] || null;


  // =========================
  // HOUSE MEMBERS
  // =========================

  const checkHouseMembers =
    checkMemberList.filter(
      (member) =>
        member.house === checkHouse
    );


  // =========================
  // DEFAULT ITEMS BY HOUSE
  // =========================

  const defaultHouseItems =
    useMemo(() => {

      return getCheckItemsByHouse(
        checkHouse
      );

    }, [
      checkHouse
    ]);


  // =========================
  // REQUIRED ITEMS
  // =========================

  const checkRequiredItems =
    useMemo(() => {

      if (!currentCheckWeek) {
        return defaultHouseItems;
      }

      const saved =
        currentCheckWeek
          ?.requiredItemsByHouse
          ?.[checkHouse];

      if (!saved) {
        return defaultHouseItems;
      }

      return defaultHouseItems.filter(
        (item) =>
          saved[item.key] === true
      );

    }, [
      currentCheckWeek,
      defaultHouseItems,
      checkHouse
    ]);


  // =========================
  // CHECK COMPLETE
  // =========================

  const getCheckCompleted =
    (memberId) => {

      const submission =
        checkSubmissions[
          memberId
        ] || {};

      return checkRequiredItems.filter(
        (item) =>
          submission[
            item.key
          ] === true
      ).length;

    };


  const isCheckComplete =
    (memberId) => {

      if (
        checkRequiredItems.length === 0
      ) {
        return false;
      }

      return (
        getCheckCompleted(
          memberId
        ) ===
        checkRequiredItems.length
      );

    };


  const checkCompletedCount =
    checkHouseMembers.filter(
      (member) =>
        isCheckComplete(
          member.id
        )
    ).length;


  const checkIncompleteCount =
    checkHouseMembers.length -
    checkCompletedCount;


  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {

    if (!date) {
      return '-';
    }

    const parts =
      date.split('-');

    if (parts.length !== 3) {
      return date;
    }

    return `${parts[2]}/${parts[1]}/${parts[0]}`;

  };


  // =========================
  // FORMAT SUBMITTED TIME
  // =========================

  const formatSubmittedTime = (submittedAt) => {

    if (!submittedAt) {
      return '-';
    }

    const date =
      new Date(submittedAt);

    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    return date.toLocaleTimeString(
      'th-TH',
      {
        timeZone: 'Asia/Bangkok',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }
    );

  };


  // =========================
  // FORMAT REPORT TYPE
  // =========================

  const formatReportType = (type) => {

    switch (type) {

      case 'website':
        return 'ปัญหาเว็บไซต์';

      case 'member':
        return 'ปัญหาสมาชิก';

      case 'work':
        return 'ปัญหาเกี่ยวกับงาน';

      case 'other':
        return 'อื่น ๆ';

      default:
        return type || '-';

    }

  };


  // =========================
  // FORMAT REPORT STATUS
  // =========================

  const formatReportStatus = (status) => {

    switch (status) {

      case 'pending':
        return 'รอดำเนินการ';

      case 'checking':
        return 'กำลังตรวจสอบ';

      case 'done':
        return 'ดำเนินการเสร็จแล้ว';

      default:
        return status || 'รอดำเนินการ';

    }

  };


  // =========================
  // CREATE NEW CHECK WEEK
  // =========================

  const handleCreateCheckWeek =
    async () => {

      const label =
        window.prompt(
          'ชื่อ Week เช่น Week 2'
        );

      if (!label) {
        return;
      }

      const startDate =
        window.prompt(
          'วันเริ่ม เช่น 2026-10-12'
        );

      if (!startDate) {
        return;
      }

      const endDate =
        window.prompt(
          'วันสิ้นสุด เช่น 2026-10-18'
        );

      if (!endDate) {
        return;
      }

      if (endDate < startDate) {

        alert(
          'วันสิ้นสุดต้องไม่ก่อนวันเริ่ม'
        );

        return;

      }

      const weekId =
        `week-${Date.now()}`;

      try {

        await saveWeek({

          id: weekId,

          label:
            label.trim(),

          startDate,

          endDate,

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

          createdAt:
            new Date().toISOString()

        });

        setSelectedCheckWeekId(
          weekId
        );

        alert(
          `${label} สร้างเรียบร้อยแล้ว`
        );

      } catch (error) {

        console.error(
          'CREATE WEEK ERROR:',
          error
        );

        alert(
          'ไม่สามารถสร้าง Week ได้'
        );

      }

    };


  // =========================
  // TOGGLE CHECK STATUS
  // =========================

  const handleAdminCheckToggle =
    async (
      memberId,
      itemKey
    ) => {

      if (!selectedCheckWeekId) {
        return;
      }

      const current =
        checkSubmissions[
          memberId
        ]?.[
          itemKey
        ] === true;

      try {

        setCheckSaving(true);

        await updateCheckStatus(
          selectedCheckWeekId,
          memberId,
          itemKey,
          !current
        );

      } catch (error) {

        console.error(
          'ADMIN CHECK ERROR:',
          error
        );

        alert(
          'ไม่สามารถเปลี่ยนสถานะ CHECK ได้'
        );

      } finally {

        setCheckSaving(false);

      }

    };


  // =========================
  // TOGGLE REQUIRED ITEM
  // =========================

  const handleToggleRequiredItem =
    async (itemKey) => {

      if (!selectedCheckWeekId) {

        alert(
          'กรุณาเลือก Week ก่อน'
        );

        return;

      }

      if (!currentCheckWeek) {
        return;
      }

      const currentSaved =
        currentCheckWeek
          ?.requiredItemsByHouse
          ?.[checkHouse] || {};

      const currentValue =
        currentSaved[itemKey] === true;

      const newRequired = {
        ...currentSaved,
        [itemKey]: !currentValue
      };

      const updatedRequiredItemsByHouse = {

        ...(currentCheckWeek
          .requiredItemsByHouse || {}),

        [checkHouse]:
          newRequired

      };

      try {

        setCheckSaving(true);

        await saveWeek({

          ...currentCheckWeek,

          id:
            selectedCheckWeekId,

          requiredItemsByHouse:
            updatedRequiredItemsByHouse

        });

      } catch (error) {

        console.error(
          'TOGGLE REQUIRED ITEM ERROR:',
          error
        );

        alert(
          'ไม่สามารถบันทึกรายการที่ต้องส่งได้'
        );

      } finally {

        setCheckSaving(false);

      }

    };


  // =========================
  // LOGOUT
  // =========================

  const handleLogout =
    async () => {

      const username =
        localStorage.getItem(
          'm9-admin-user'
        );

      if (username) {

        await setAdminOffline(
          username
        );

      }

      localStorage.removeItem(
        'm9-admin-login'
      );

      localStorage.removeItem(
        'm9-admin-user'
      );

      navigate(
        '/admin-login'
      );

    };


  // =========================
  // RENDER
  // =========================

  return (

    <div className="admin-page">


      {/* =========================
          HEADER
      ========================= */}

      <div className="admin-header">

        <span>
          MNINE / ADMIN
        </span>

        <h1>
          ADMIN DASHBOARD
        </h1>

        <p>
          ระบบจัดการสำหรับผู้ดูแล
        </p>

      </div>


      {/* =========================
          ADMIN ONLINE
      ========================= */}

      <div className="admin-section">

        <div className="section-title">

          <span>
            ADMIN ONLINE
          </span>

          <h2>
            ผู้ดูแลระบบ
          </h2>

        </div>


        <div className="admin-online-list">

          {adminList.map((item) => {

            const admin =
              admins[item.username];

            const isOnline =
              admin?.online === true;


            return (

              <div
                className="admin-online-card"
                key={item.username}
              >

                <div
                  className={`online-dot ${
                    isOnline
                      ? 'online'
                      : 'offline'
                  }`}
                />


                <div className="admin-online-info">

                  <strong>
                    {item.name}
                  </strong>

                  <span
                    className={
                      isOnline
                        ? 'status-online'
                        : 'status-offline'
                    }
                  >
                    {isOnline
                      ? 'Online'
                      : 'Offline'}
                  </span>

                </div>

              </div>

            );

          })}

        </div>

      </div>


      {/* =========================
          STATISTICS
      ========================= */}

      <div className="admin-grid">


        <div className="admin-card">

          <span>
            ABSENCE
          </span>

          <strong>
            {todayAbsences.length}
          </strong>

          <p>
            สมาชิกที่กำลังลา
          </p>

        </div>


        <div className="admin-card">

          <span>
            MEMBERS
          </span>

          <strong>
            {checkMemberList.length}
          </strong>

          <p>
            สมาชิกทั้งหมด
          </p>

        </div>


        <div className="admin-card">

          <span>
            REPORT
          </span>

          <strong>
            {reportList.length}
          </strong>

          <p>
            รายงานทั้งหมด
          </p>

        </div>

      </div>


      {/* =========================
          CHECK DASHBOARD
      ========================= */}

      <div className="admin-section">

        <div className="section-title">

          <span>
            CHECK MANAGEMENT
          </span>

          <h2>
            ระบบตรวจสอบการส่งของ
          </h2>

        </div>


        <button
          type="button"
          className="check-admin-button"
          onClick={() =>
            setShowCheckPanel(
              !showCheckPanel
            )
          }
          style={{
            marginBottom: '20px'
          }}
        >
          {showCheckPanel
            ? '▲ ซ่อน CHECK'
            : '▼ แสดง CHECK'}
        </button>


        {showCheckPanel && (

          <>


            {/* =========================
                CHECK SUMMARY
            ========================= */}

            <div className="admin-grid">

              <div className="admin-card">

                <span>
                  CHECK MEMBERS
                </span>

                <strong>
                  {checkMemberList.length}
                </strong>

                <p>
                  สมาชิกทั้งหมด
                </p>

              </div>


              <div className="admin-card">

                <span>
                  BLACK HOUSE
                </span>

                <strong>
                  {blackMembers.length}
                </strong>

                <p>
                  สมาชิก Black
                </p>

              </div>


              <div className="admin-card">

                <span>
                  WHITE HOUSE
                </span>

                <strong>
                  {whiteMembers.length}
                </strong>

                <p>
                  สมาชิก White
                </p>

              </div>


              <div className="admin-card">

                <span>
                  COMPLETE
                </span>

                <strong>
                  {checkCompletedCount}
                </strong>

                <p>
                  ส่งครบ
                </p>

              </div>


              <div className="admin-card">

                <span>
                  INCOMPLETE
                </span>

                <strong>
                  {checkIncompleteCount}
                </strong>

                <p>
                  ยังส่งไม่ครบ
                </p>

              </div>

            </div>


            {/* =========================
                WEEK SELECT
            ========================= */}

            <div
              style={{
                marginTop: '25px',
                marginBottom: '20px'
              }}
            >

              <label
                style={{
                  display: 'block',
                  color: '#777',
                  fontSize: '11px',
                  fontWeight: '800',
                  marginBottom: '8px',
                  letterSpacing: '1px'
                }}
              >
                SELECT WEEK
              </label>


              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center'
                }}
              >

                <select
                  value={
                    selectedCheckWeekId
                  }
                  onChange={(e) =>
                    setSelectedCheckWeekId(
                      e.target.value
                    )
                  }
                  style={{
                    flex: 1,
                    width: '100%',
                    padding: '13px 15px',
                    borderRadius: '12px',
                    border:
                      '1px solid #292929',
                    background: '#101010',
                    color: '#fff',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                >

                  {sortedWeekIds.map(
                    (weekId) => {

                      const week =
                        checkWeeks[
                          weekId
                        ];

                      return (

                        <option
                          key={weekId}
                          value={weekId}
                        >

                          {week?.label ||
                            weekId}

                          {' — '}

                          {formatDate(
                            week?.startDate
                          )}

                          {' - '}

                          {formatDate(
                            week?.endDate
                          )}

                        </option>

                      );

                    }
                  )}

                </select>


                <button
                  type="button"
                  className="check-admin-button"
                  onClick={
                    handleCreateCheckWeek
                  }
                  style={{
                    whiteSpace:
                      'nowrap'
                  }}
                >
                  + เพิ่ม Week
                </button>

              </div>


              {sortedWeekIds.length === 0 && (

                <p
                  style={{
                    marginTop: '10px',
                    color: '#777',
                    fontSize: '12px'
                  }}
                >
                  ยังไม่มี Week กรุณากด
                  "+ เพิ่ม Week"
                </p>

              )}

            </div>


            {/* =========================
                CURRENT WEEK
            ========================= */}

            {currentCheckWeek && (

              <div
                style={{
                  marginBottom: '20px',
                  padding: '15px',
                  border:
                    '1px solid #292929',
                  borderRadius: '12px',
                  background: '#0a0a0a'
                }}
              >

                <strong
                  style={{
                    display: 'block',
                    color: '#fff',
                    marginBottom: '5px'
                  }}
                >
                  {currentCheckWeek.label}
                </strong>

                <span
                  style={{
                    color: '#666',
                    fontSize: '12px'
                  }}
                >

                  {formatDate(
                    currentCheckWeek.startDate
                  )}

                  {' - '}

                  {formatDate(
                    currentCheckWeek.endDate
                  )}

                </span>

              </div>

            )}


            {/* =========================
                HOUSE SWITCH
            ========================= */}

            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '20px',
                flexWrap: 'wrap'
              }}
            >

              <button
                type="button"
                className="check-admin-button"
                onClick={() =>
                  setCheckHouse(
                    'Black'
                  )
                }
                style={{
                  borderColor:
                    checkHouse === 'Black'
                      ? '#e50914'
                      : '#292929'
                }}
              >
                🖤 BLACK HOUSE
              </button>


              <button
                type="button"
                className="check-admin-button"
                onClick={() =>
                  setCheckHouse(
                    'White'
                  )
                }
                style={{
                  borderColor:
                    checkHouse === 'White'
                      ? '#e50914'
                      : '#292929'
                }}
              >
                🤍 WHITE HOUSE
              </button>

            </div>


            {/* =========================
                REQUIRED ITEMS
            ========================= */}

            <div
              style={{
                marginBottom: '25px'
              }}
            >

              <div className="section-title">

                <span>
                  REQUIRED ITEMS
                </span>

                <h2>
                  รายการที่ต้องส่ง
                </h2>

              </div>


              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}
              >

                {defaultHouseItems.map(
                  (item) => {

                    const isSelected =
                      checkRequiredItems.some(
                        (selectedItem) =>
                          selectedItem.key ===
                          item.key
                      );

                    return (

                      <button
                        key={item.key}
                        type="button"
                        disabled={
                          checkSaving
                        }
                        onClick={() =>
                          handleToggleRequiredItem(
                            item.key
                          )
                        }
                        style={{
                          minHeight: '42px',
                          padding:
                            '0 16px',
                          display:
                            'flex',
                          alignItems:
                            'center',
                          borderRadius:
                            '10px',
                          border:
                            `1px solid ${
                              isSelected
                                ? '#e50914'
                                : '#292929'
                            }`,
                          background:
                            isSelected
                              ? 'rgba(229,9,20,0.15)'
                              : '#101010',
                          color:
                            isSelected
                              ? '#fff'
                              : '#666',
                          fontSize:
                            '11px',
                          fontWeight:
                            '800',
                          cursor:
                            checkSaving
                              ? 'wait'
                              : 'pointer',
                          transition:
                            '0.2s'
                        }}
                      >

                        {isSelected
                          ? '✓ '
                          : '＋ '}

                        {item.label}

                      </button>

                    );

                  }
                )}

              </div>


              <p
                style={{
                  marginTop: '10px',
                  color: '#666',
                  fontSize: '11px'
                }}
              >
                กดรายการเพื่อเปิด/ปิดสิ่งที่สมาชิกต้องส่งใน Week นี้
              </p>

            </div>


            {/* =========================
                HOUSE SUMMARY
            ========================= */}

            <div className="admin-grid">

              <div className="admin-card">

                <span>
                  HOUSE
                </span>

                <strong>
                  {checkHouse}
                </strong>

                <p>
                  บ้านที่กำลังดู
                </p>

              </div>


              <div className="admin-card">

                <span>
                  MEMBERS
                </span>

                <strong>
                  {checkHouseMembers.length}
                </strong>

                <p>
                  สมาชิกในบ้าน
                </p>

              </div>


              <div className="admin-card">

                <span>
                  COMPLETE
                </span>

                <strong>
                  {checkCompletedCount}
                </strong>

                <p>
                  ส่งครบ
                </p>

              </div>


              <div className="admin-card">

                <span>
                  INCOMPLETE
                </span>

                <strong>
                  {checkIncompleteCount}
                </strong>

                <p>
                  ยังส่งไม่ครบ
                </p>

              </div>

            </div>


            {/* =========================
                CHECK TABLE
            ========================= */}

            {currentCheckWeek && (

              <div
                style={{
                  marginTop: '25px',
                  overflowX: 'auto',
                  border:
                    '1px solid #292929',
                  borderRadius: '12px'
                }}
              >

                <table
                  style={{
                    width: '100%',
                    minWidth: '850px',
                    borderCollapse:
                      'collapse',
                    fontSize: '11px'
                  }}
                >

                  <thead>

                    <tr>

                      <th
                        style={{
                          padding: '13px',
                          textAlign:
                            'left',
                          borderBottom:
                            '1px solid #292929',
                          color: '#777'
                        }}
                      >
                        #
                      </th>


                      <th
                        style={{
                          padding: '13px',
                          textAlign:
                            'left',
                          borderBottom:
                            '1px solid #292929',
                          color: '#777'
                        }}
                      >
                        สมาชิก
                      </th>


                      {checkRequiredItems.map(
                        (item) => (

                          <th
                            key={item.key}
                            style={{
                              padding:
                                '13px',
                              textAlign:
                                'center',
                              borderBottom:
                                '1px solid #292929',
                              color:
                                '#777'
                            }}
                          >
                            {item.label}
                          </th>

                        )
                      )}


                      <th
                        style={{
                          padding:
                            '13px',
                          textAlign:
                            'center',
                          borderBottom:
                            '1px solid #292929',
                          color:
                            '#777'
                        }}
                      >
                        STATUS
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {checkHouseMembers.map(
                      (member, index) => {

                        const completed =
                          getCheckCompleted(
                            member.id
                          );

                        const complete =
                          isCheckComplete(
                            member.id
                          );

                        return (

                          <tr
                            key={member.id}
                          >

                            <td
                              style={{
                                padding:
                                  '10px 13px',
                                borderBottom:
                                  '1px solid #1c1c1c',
                                color:
                                  '#555'
                              }}
                            >
                              {index + 1}
                            </td>


                            <td
                              style={{
                                padding:
                                  '10px 13px',
                                borderBottom:
                                  '1px solid #1c1c1c',
                                color:
                                  '#fff',
                                fontWeight:
                                  '700'
                              }}
                            >
                              {member.name}
                            </td>


                            {checkRequiredItems.map(
                              (item) => {

                                const checked =
                                  checkSubmissions[
                                    member.id
                                  ]?.[
                                    item.key
                                  ] === true;

                                return (

                                  <td
                                    key={
                                      item.key
                                    }
                                    style={{
                                      padding:
                                        '10px',
                                      textAlign:
                                        'center',
                                      borderBottom:
                                        '1px solid #1c1c1c'
                                    }}
                                  >

                                    <button
                                      type="button"
                                      disabled={
                                        checkSaving
                                      }
                                      onClick={() =>
                                        handleAdminCheckToggle(
                                          member.id,
                                          item.key
                                        )
                                      }
                                      style={{
                                        width:
                                          '32px',
                                        height:
                                          '32px',
                                        borderRadius:
                                          '8px',
                                        border:
                                          `1px solid ${
                                            checked
                                              ? '#e50914'
                                              : '#292929'
                                          }`,
                                        background:
                                          checked
                                            ? 'rgba(229,9,20,0.12)'
                                            : '#101010',
                                        color:
                                          checked
                                            ? '#fff'
                                            : '#555',
                                        cursor:
                                          checkSaving
                                            ? 'wait'
                                            : 'pointer',
                                        fontWeight:
                                          '900'
                                      }}
                                    >

                                      {checked
                                        ? '✓'
                                        : '✕'}

                                    </button>

                                  </td>

                                );

                              }
                            )}


                            <td
                              style={{
                                padding:
                                  '10px',
                                textAlign:
                                  'center',
                                borderBottom:
                                  '1px solid #1c1c1c'
                              }}
                            >

                              <span
                                style={{
                                  display:
                                    'inline-block',
                                  padding:
                                    '6px 10px',
                                  borderRadius:
                                    '20px',
                                  border:
                                    `1px solid ${
                                      complete
                                        ? '#e50914'
                                        : '#292929'
                                    }`,
                                  color:
                                    complete
                                      ? '#fff'
                                      : '#777',
                                  fontSize:
                                    '10px',
                                  fontWeight:
                                    '800'
                                }}
                              >

                                {complete
                                  ? 'ส่งครบ'
                                  : `${completed}/${checkRequiredItems.length}`}

                              </span>

                            </td>

                          </tr>

                        );

                      }
                    )}

                  </tbody>

                </table>

              </div>

            )}


            {/* =========================
                OPEN CHECK + BANK MANAGEMENT
            ========================= */}

            <div
              style={{
                marginTop: '20px',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                flexWrap: 'wrap'
              }}
            >

              <button
                type="button"
                className="check-admin-button"
                onClick={() =>
                  navigate('/check')
                }
              >
                เปิดหน้า CHECK →
              </button>


              <button
                type="button"
                className="check-admin-button"
                onClick={() =>
                  navigate('/admin/bank')
                }
              >
                เปิด BANK MANAGEMENT →
              </button>

            </div>

          </>

        )}

      </div>


      {/* =========================
          ABSENCE NOTIFICATION
      ========================= */}

      <div className="admin-section">

        <div className="section-title">

          <span>
            ABSENCE NOTIFICATION
          </span>

          <h2>
            แจ้งเตือนการลา
          </h2>

        </div>


        {absenceList.length === 0 && (

          <div className="no-absence">
            ยังไม่มีรายการแจ้งลา
          </div>

        )}


        {absenceList.length > 0 &&
          todayAbsences.length === 0 && (

            <div className="no-absence">

              วันนี้ไม่มีสมาชิกลา

              <br />

              <small>

                มีรายการลาในระบบทั้งหมด {
                  absenceList.length
                } รายการ

              </small>

            </div>

        )}


        {todayAbsences.length > 0 && (

          <div className="absence-notification-list">

            {todayAbsences.map(
              ([id, item]) => (

                <div
                  className="absence-notification-card"
                  key={id}
                >

                  <div className="absence-notification-icon">
                    !
                  </div>


                  <div className="absence-notification-info">

                    <strong>
                      วันนี้ {item.name} ไม่อยู่
                    </strong>

                    <span>

                      {formatDate(
                        item.startDate
                      )}

                      {' - '}

                      {formatDate(
                        item.endDate
                      )}

                    </span>


                    {/* เวลาที่ส่งใบลา */}
                    {item.submittedAt && (
                      <span>
                        ส่งใบลาเมื่อ: {formatSubmittedTime(item.submittedAt)} น.
                      </span>
                    )}


                    {item.startTime &&
                      item.endTime && (

                        <span>

                          เวลา {item.startTime}
                          {' - '}
                          {item.endTime}

                        </span>

                    )}


                    <p>
                      เหตุผล: {item.reason}
                    </p>


                    {item.image && (
                      <div className="absence-image-wrapper">

                        <img
                          src={item.image}
                          alt={`หลักฐานการลาของ ${item.name}`}
                          className="absence-image"
                          onClick={() =>
                            window.open(
                              item.image,
                              '_blank'
                            )
                          }
                        />

                        <span className="absence-image-hint">
                          คลิกที่รูปเพื่อดูภาพขนาดใหญ่
                        </span>

                      </div>
                    )}

                  </div>

                </div>

              )
            )}

          </div>

        )}


        {absenceList.length > 0 && (

          <div
            style={{
              marginTop: '25px'
            }}
          >

            <div className="section-title">

              <span>
                ALL ABSENCE
              </span>

              <h2>
                รายการลาทั้งหมด
              </h2>

            </div>


            <div className="absence-notification-list">

              {absenceList.map(
                ([id, item]) => (

                  <div
                    className="absence-notification-card"
                    key={id}
                  >

                    <div className="absence-notification-icon">
                      ✓
                    </div>


                    <div className="absence-notification-info">

                      <strong>
                        {item.name}
                      </strong>

                      <span>

                        {formatDate(
                          item.startDate
                        )}

                        {' - '}

                        {formatDate(
                          item.endDate
                        )}

                      </span>


                      {/* เวลาที่ส่งใบลา */}
                      {item.submittedAt && (
                        <span>
                          ส่งใบลาเมื่อ: {formatSubmittedTime(item.submittedAt)} น.
                        </span>
                      )}


                      {item.startTime &&
                        item.endTime && (

                          <span>

                            เวลา {item.startTime}
                            {' - '}
                            {item.endTime}

                          </span>

                      )}


                      <p>
                        เหตุผล: {item.reason}
                      </p>


                      {item.image && (
                        <div className="absence-image-wrapper">

                          <img
                            src={item.image}
                            alt={`หลักฐานการลาของ ${item.name}`}
                            className="absence-image"
                            onClick={() =>
                              window.open(
                                item.image,
                                '_blank'
                              )
                            }
                          />

                          <span className="absence-image-hint">
                            คลิกที่รูปเพื่อดูภาพขนาดใหญ่
                          </span>

                        </div>
                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        )}

      </div>


      {/* =========================
          REPORT
      ========================= */}

      <div className="admin-section">

        <div className="section-title">

          <span>
            REPORT
          </span>

          <h2>
            รายงานจากสมาชิก
          </h2>

        </div>


        {reportList.length === 0 && (

          <div className="no-absence">
            ยังไม่มีรายงาน
          </div>

        )}


        {reportList.length > 0 && (

          <div className="absence-notification-list">

            {reportList
              .slice()
              .reverse()
              .map(([id, item]) => (

                <div
                  className="absence-notification-card"
                  key={id}
                >

                  <div className="absence-notification-icon">
                    !
                  </div>


                  <div className="absence-notification-info">

                    <strong>
                      {item.title}
                    </strong>

                    <span>
                      ผู้รายงาน: {item.name}
                    </span>

                    <span>
                      ประเภท: {
                        formatReportType(
                          item.type
                        )
                      }
                    </span>

                    <p>
                      {item.detail}
                    </p>

                    <span>
                      สถานะ: {
                        formatReportStatus(
                          item.status
                        )
                      }
                    </span>

                  </div>

                </div>

              ))}

          </div>

        )}

      </div>


      {/* =========================
          LOGOUT
      ========================= */}

      <div className="admin-logout-area">

        <button
          className="admin-logout-button"
          onClick={handleLogout}
        >
          LOGOUT
        </button>

      </div>


    </div>

  );

}


export default Admin;

