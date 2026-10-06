import React, { useEffect, useRef, useState } from "react";
import "../CSS/Wheel.css";

const DEFAULT_MEMBERS = [
  "PHAYU REAL",
  "MAFAI HAWTHORNE",
  "X-RAY REAL",
  "LEE HAWTHORNE",
  "YUTO REAL",
  "FEAT SENFERZ",
  "ESSENCE MG",
  "HATARI NIGHTINGALE",
  "DAR LOSEMAMIND",
  "JEFF HAWKINS",
  "BLUE HAWAII",
  "TIGER REAL",
  "KHOM TAWIN",
  "UNKNOWN SOYBAD",
  "TAAUM MMZ",
  "NORI SEAWEED",
  "SOMBUT ZELIE",
  "CHOPPER HEAD",
  "MELON LIE",
  "KLA LOSEMAMIND",
  "THID DEFTFOX",
  "KAISER KENWAY",
  "DEMON LORD",
  "LILIANA HAWKINS",
  "GODZILLA REAL",
];

const STORAGE_KEY = "m9-wheel-members";

function Wheel() {
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_MEMBERS;
      }
    }

    return DEFAULT_MEMBERS;
  });

  const [displayName, setDisplayName] = useState("READY");
  const [newName, setNewName] = useState("");
  const [winner, setWinner] = useState("");
  const [spinning, setSpinning] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const addMember = () => {
    const name = newName.trim();

    if (!name || spinning) return;

    const exists = members.some(
      (member) => member.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      alert("มีชื่อนี้อยู่แล้ว");
      return;
    }

    setMembers((prev) => [...prev, name]);
    setNewName("");
  };

  const deleteMember = (name) => {
    if (spinning) return;

    setMembers((prev) => prev.filter((member) => member !== name));

    if (displayName === name) {
      setDisplayName("READY");
    }
  };

  const resetMembers = () => {
    if (spinning) return;

    const confirmReset = window.confirm(
      "ต้องการรีเซ็ตรายชื่อทั้งหมดกลับเป็นค่าเริ่มต้นหรือไม่?"
    );

    if (!confirmReset) return;

    setMembers(DEFAULT_MEMBERS);
    setDisplayName("READY");
    setWinner("");
  };

  const spin = () => {
    if (spinning || members.length === 0) return;

    if (members.length === 1) {
      const lastWinner = members[0];

      setSpinning(true);
      setDisplayName(lastWinner);

      timerRef.current = setTimeout(() => {
        setWinner(lastWinner);
        setMembers([]);
        setSpinning(false);
      }, 900);

      return;
    }

    setWinner("");
    setSpinning(true);

    const selectedWinner =
      members[Math.floor(Math.random() * members.length)];

    const totalSteps = 30;
    let step = 0;

    const runSelector = () => {
      if (step < totalSteps - 1) {
        const randomName =
          members[Math.floor(Math.random() * members.length)];

        setDisplayName(randomName);
        step++;

        let delay = 55;

        if (step > 15) delay = 80;
        if (step > 20) delay = 120;
        if (step > 24) delay = 180;
        if (step > 27) delay = 300;

        timerRef.current = setTimeout(runSelector, delay);
      } else {
        setDisplayName(selectedWinner);
        setWinner(selectedWinner);
        setSpinning(false);

        setMembers((prev) =>
          prev.filter((member) => member !== selectedWinner)
        );
      }
    };

    runSelector();
  };

  return (
    <div className="wheel-page">
      <div className="wheel-container">

        {/* LEFT */}
        <section className="selector-card">

          <div className="selector-top">
            <div>
              <span className="selector-label">M9 / RANDOM SELECTOR</span>
              <h1>WHEEL</h1>
              <p>สุ่มสมาชิกแบบสุ่มจริง พร้อมนำผู้ชนะออกจากรายการ</p>
            </div>

            <div className="member-count">
              <strong>{members.length}</strong>
              <span>MEMBERS</span>
            </div>
          </div>

          <div className={`selector-box ${spinning ? "is-spinning" : ""} ${winner ? "has-winner" : ""}`}>

            <div className="selector-status">
              {spinning
                ? "SELECTING..."
                : winner
                ? "WINNER"
                : "READY"}
            </div>

            <div className="selector-line top-line"></div>

            <div className="selector-name">
              {displayName}
            </div>

            <div className="selector-line bottom-line"></div>

            {spinning && (
              <div className="selector-loading">
                RANDOMIZING
              </div>
            )}

          </div>

          {winner && (
            <div className="winner-result">
              <span>SELECTED MEMBER</span>
              <strong>{winner}</strong>
              <small>ชื่อถูกนำออกจากรายการแล้ว</small>
            </div>
          )}

          <button
            className="spin-button"
            onClick={spin}
            disabled={spinning || members.length === 0}
          >
            {spinning
              ? "SELECTING..."
              : members.length === 0
              ? "NO MEMBERS"
              : "START RANDOM"}
          </button>

        </section>

        {/* RIGHT */}
        <section className="members-card">

          <div className="members-header">
            <div>
              <span>MEMBER MANAGEMENT</span>
              <h2>สมาชิกทั้งหมด</h2>
            </div>

            <button
              className="reset-button"
              onClick={resetMembers}
              disabled={spinning}
            >
              RESET
            </button>
          </div>

          <div className="add-member">
            <input
              type="text"
              placeholder="เพิ่มชื่อสมาชิก..."
              value={newName}
              disabled={spinning}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addMember();
                }
              }}
            />

            <button
              onClick={addMember}
              disabled={spinning || !newName.trim()}
            >
              +
            </button>
          </div>

          <div className="members-list">

            {members.length === 0 ? (
              <div className="empty-members">
                <span>NO MEMBERS</span>
                <p>ไม่มีสมาชิกเหลืออยู่</p>
              </div>
            ) : (
              members.map((member, index) => (
                <div className="member-row" key={member}>

                  <div className="member-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="member-name">
                    {member}
                  </div>

                  <button
                    className="delete-member"
                    onClick={() => deleteMember(member)}
                    disabled={spinning}
                  >
                    ×
                  </button>

                </div>
              ))
            )}

          </div>

        </section>

      </div>
    </div>
  );
}

export default Wheel;