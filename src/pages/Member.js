import '../CSS/Member.css';
import BITLogo from '../LOGO_BIT.png';

import { Link } from 'react-router-dom';

function Member() {
  return (
    <div className="member-page">

      <div className="city-grid">

        <div className="city-card">

          <div className="city-info">
            <h2>BIT TOWN</h2>

            <p>
              สมาชิกที่เล่นในเมือง BIT TOWN
            </p>

            <Link
              to="/member/bit-town"
              className="view-members"
            >
              ดูสมาชิก
            </Link>
          </div>

          <div className="city-logo">
            <img src={BITLogo} alt="BIT TOWN Logo" />
          </div>

        </div>

      </div>

    </div>
  );
}

export default Member;