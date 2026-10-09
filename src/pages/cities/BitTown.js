import { useState } from "react";
import "../../CSS/BitTown.css";
import Kla from '../../images/Kla.jpg';
import lilana from '../../images/liliana.jpg';
import tiger from '../../images/TIGER.jpg';
import Mafai from '../../images/Mafai.png';
//import { Link } from "react-router-dom";

const members = [
  {
    id: "phayu-real",
    name: "PHAYU REAL",
    role: "Leader",
    image: "",
    icPhone: "ยังไม่ได้ระบุ",
    face: "ยังไม่ได้ระบุ",
    instagram: "ยังไม่ได้ระบุ",
    motto: "ยังไม่ได้ระบุ",
  },
  {
    id: "ma fai-stayyungforever",
    name: "MAFAI STAYYUNGFOREVER",
    role: "Sub-Leader",
    image: Mafai,
    icPhone: "960150",
    face: "Mafai Trixielynn",
    instagram: "_dabirdhitmeflow",
    instagramUrl:"https://www.instagram.com/_dabirdhitmeflow/",
    motto: "Stayyungforever บ้านนี้มีเเต่คนลาย",
  },
  {
    id: "x-ray-real",
    name: "X-RAY REAL",
    role: "Sub-Leader",
    image: "",
    icPhone: "ยังไม่ได้ระบุ",
    face: "ยังไม่ได้ระบุ",
    instagram: "ยังไม่ได้ระบุ",
    motto: "ยังไม่ได้ระบุ",
  },
  {
    id: "lee-stayyungforever",
    name: "LEE STAYYUNGFOREVER",
    role: "Member",
    image: "",
    icPhone: "ยังไม่ได้ระบุ",
    face: "ยังไม่ได้ระบุ",
    instagram: "ยังไม่ได้ระบุ",
    motto: "ยังไม่ได้ระบุ",
  },
  {
    id: "yuto-real",
    name: "YUTO REAL",
    role: "Member",
    image: "",
    icPhone: "ยังไม่ได้ระบุ",
    face: "ยังไม่ได้ระบุ",
    instagram: "ยังไม่ได้ระบุ",
    motto: "ยังไม่ได้ระบุ",
  },
  {
    id: "feat-senferz",
    name: "FEAT SENFERZ",
    role: "Member",
    image: "",
    icPhone: "ยังไม่ได้ระบุ",
    face: "ยังไม่ได้ระบุ",
    instagram: "ยังไม่ได้ระบุ",
    motto: "ยังไม่ได้ระบุ",
  },
  {
    id: "essence-mg",
    name: "ESSENCE MG",
    role: "Member",
    image: "",
    icPhone: "ยังไม่ได้ระบุ",
    face: "ยังไม่ได้ระบุ",
    instagram: "ยังไม่ได้ระบุ",
    motto: "ยังไม่ได้ระบุ",
  },
  {
    id: "hatari-nightingale",
    name: "HATARI NIGHTINGALE",
    role: "Member",
    image: "",
    icPhone: "ยังไม่ได้ระบุ",
    face: "ยังไม่ได้ระบุ",
    instagram: "ยังไม่ได้ระบุ",
    motto: "ยังไม่ได้ระบุ",
  },
  {
    id: "dar-stayyungforever",
    name: "DAR STAYYUNGFOREVER",
    role: "Member",
    image: "",
    icPhone: "ยังไม่ได้ระบุ",
    face: "ยังไม่ได้ระบุ",
    instagram: "ยังไม่ได้ระบุ",
    motto: "ยังไม่ได้ระบุ",
  },
  {
    id: "jeff-stayyungforever",
    name: "JEFF STAYYUNGFOREVER",
    role: "Member",
    image: "",
    icPhone: "ยังไม่ได้ระบุ",
    face: "ยังไม่ได้ระบุ",
    instagram: "ยังไม่ได้ระบุ",
    motto: "ยังไม่ได้ระบุ",
  },
  {
    id: "blue-stayyungforever",
    name: "BLUE STAYYUNGFOREVER",
    role: "Member",
    image: "",
    icPhone: "ยังไม่ได้ระบุ",
    face: "ยังไม่ได้ระบุ",
    instagram: "ยังไม่ได้ระบุ",
    motto: "ยังไม่ได้ระบุ",
  },
  {
    id: "tiger-real",
    name: "TIGER REAL",
    role: "Member",
    image: tiger,
    icPhone: "500448",
    face: "-",
    instagram: "xm_tigerrrx",
    instagramUrl: "https://www.instagram.com/xm_tigerrrx?stkn=MWFuNHRrM3N0azg0ZQ==",
    motto: "ดูดหรรมมันคับคอ เลยต้องดูดพอตแทน",
  },
  {
    id: "khom-tawin",
    name: "KHOM TAWIN",
    role: "Member",
    image: "",
    icPhone: "ยังไม่ได้ระบุ",
    face: "ยังไม่ได้ระบุ",
    instagram: "ยังไม่ได้ระบุ",
    motto: "ยังไม่ได้ระบุ",
  },
  {
    id: "unknown-soybad",
    name: "UNKNOWN SOYBAD",
    role: "Member",
    image: "",
    icPhone: "ยังไม่ได้ระบุ",
    face: "ยังไม่ได้ระบุ",
    instagram: "ยังไม่ได้ระบุ",
    motto: "ยังไม่ได้ระบุ",
  },
  {
    id: "taaum-mmz",
    name: "TAAUM MMZ",
    role: "Member",
    image: "",
    icPhone: "ยังไม่ได้ระบุ",
    face: "ยังไม่ได้ระบุ",
    instagram: "ยังไม่ได้ระบุ",
    motto: "ยังไม่ได้ระบุ",
  },
  {
    id: "nori-seaweed",
    name: "NORI SEAWEED",
    role: "Member",
    image: "",
    icPhone: "ยังไม่ได้ระบุ",
    face: "ยังไม่ได้ระบุ",
    instagram: "ยังไม่ได้ระบุ",
    motto: "ยังไม่ได้ระบุ",
  },
  {
    id: "chopper-head",
    name: "CHOPPER HEAD",
    role: "Member",
    image: "",
    icPhone: "ยังไม่ได้ระบุ",
    face: "ยังไม่ได้ระบุ",
    instagram: "ยังไม่ได้ระบุ",
    motto: "ยังไม่ได้ระบุ",
  },
  {
    id: "melon-stayyungforever",
    name: "MELON STAYYUNGFOREVER",
    role: "Member",
    image: "",
    icPhone: "ยังไม่ได้ระบุ",
    face: "ยังไม่ได้ระบุ",
    instagram: "ยังไม่ได้ระบุ",
    motto: "ยังไม่ได้ระบุ",
  },
  {
    id: "kla-stayyungforever",
    name: "KLA STAYYUNGFOREVER",
    role: "Member",
    image: Kla,
    icPhone: "356539",
    face: "Kla Losemamind",
    instagram: "_shrbc",
    instagramUrl: "https://www.instagram.com/_shrbc/",
    motto: "ขวารู็ใจ ซ้ายรู้มือ",
  },
  {
    id: "thid-deftfox",
    name: "THID DEFTFOX",
    role: "Member",
    image: "",
    icPhone: "ยังไม่ได้ระบุ",
    face: "ยังไม่ได้ระบุ",
    instagram: "ยังไม่ได้ระบุ",
    motto: "ยังไม่ได้ระบุ",
  },
  {
    id: "kaiser-kenway",
    name: "KAISER KENWAY",
    role: "Member",
    image: "",
    icPhone: "ยังไม่ได้ระบุ",
    face: "ยังไม่ได้ระบุ",
    instagram: "ยังไม่ได้ระบุ",
    motto: "ยังไม่ได้ระบุ",
  },
  {
    id: "demon-lord",
    name: "DEMON LORD",
    role: "SUB-MEMBER",
    image: "",
    icPhone: "ยังไม่ได้ระบุ",
    face: "ยังไม่ได้ระบุ",
    instagram: "ยังไม่ได้ระบุ",
    motto: "ยังไม่ได้ระบุ",
  },
  {
    id: "liliana-hawkins",
    name: "LILIANA HAWKINS",
    role: "SUB-MEMBER",
    image: lilana,
    icPhone: "221686",
    face: "Pxint Nw",
    instagram: "pxint_24",
    instagramUrl: "https://www.instagram.com/pxint_24?rpxt=NHMyZHZieXZiYXFm",
    motto: "หมาล่ายังอร่อยขนาดนี้ หมาจริงจะอร่อยขนาดไหน",
  },
  {
    id: "godzilla-real",
    name: "GODZILLA REAL",
    role: "SUB-MEMBER",
    image: "",
    icPhone: "ยังไม่ได้ระบุ",
    face: "ยังไม่ได้ระบุ",
    instagram: "ยังไม่ได้ระบุ",
    motto: "ยังไม่ได้ระบุ",
  },
];

function BitTown() {
  const [selectedMember, setSelectedMember] = useState(null);

  // ========================================
  // MEMBER PROFILE
  // ========================================

  if (selectedMember) {
    return (
      <div className="bit-town-page">

        <div className="member-profile">

          <button
            className="member-back-button"
            onClick={() => setSelectedMember(null)}
          >
            ← BACK TO MEMBERS
          </button>


          <div className="member-profile-header">

            <div className="member-profile-image">

              {selectedMember.image ? (
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                />
              ) : (
                <div className="member-profile-placeholder">
                  {selectedMember.name.charAt(0)}
                </div>
              )}

            </div>


            <div className="member-profile-title">

              <p>BIT TOWN MEMBER</p>

              <h1>
                {selectedMember.name}
              </h1>

              <span>
                {selectedMember.role}
              </span>

            </div>

          </div>


          <div className="member-profile-info">

            <div className="profile-info-card">

              <span>
                เบอร์ IC
              </span>

              <strong>
                {selectedMember.icPhone || "ยังไม่ได้ระบุ"}
              </strong>

            </div>


            <div className="profile-info-card">

              <span>
                FACE IC / OC
              </span>

              <strong>
                {selectedMember.face || "ยังไม่ได้ระบุ"}
              </strong>

            </div>


            <div className="profile-info-card">

              <span>
                INSTAGRAM
              </span>

              {selectedMember.instagramUrl ? (
                <a
                  href={selectedMember.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="instagram-link"
                >
                  {selectedMember.instagram}
                </a>
              ) : (
                <strong>
                  {selectedMember.instagram || "ยังไม่ได้ระบุ"}
                </strong>
              )}

            </div>

            <div className="profile-info-card profile-motto">

              <span>
                คติประจำตัว
              </span>

              <strong>
                "{selectedMember.motto || "ยังไม่ได้ระบุ"}"
              </strong>

            </div>

          </div>

        </div>

      </div>
    );
  }


  // ========================================
  // MEMBERS
  // ========================================

  return (
    <div className="bit-town-page">

      <div className="bit-town-header">

        <p>
          BIT TOWN
        </p>

        <h1>
          MEMBERS
        </h1>

        <span>
          รายชื่อสมาชิกที่เล่นในเมือง BIT TOWN
        </span>

      </div>


      <div className="member-list">

        {members.map((member) => (

          <button
            key={member.id}
            className="member-item"
            onClick={() =>
              setSelectedMember(member)
            }
          >

            <div className="member-item-left">

              <div className="member-small-avatar">

                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                  />
                ) : (
                  member.name.charAt(0)
                )}

              </div>


              <div>

                <h2>
                  {member.name}
                </h2>

                <p>
                  Click to view profile
                </p>

              </div>

            </div>


            <span className="status">
              {member.role}
            </span>

          </button>

        ))}

      </div>

    </div>
  );
}

export default BitTown;