import './App.css';
import M9Image from './M9(1).png';
import M9Image1 from './M9(2).png';

import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from 'react-router-dom';

import Member from './pages/Member';
import BitTown from './pages/cities/BitTown';

import Work from './pages/Work';
import Absence from './pages/Absence';
import Check from './pages/Check';
import Bank from './pages/Bank';
import Wheel from './pages/Wheel';
import Report from './pages/Report';

import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import AdminBank from './pages/AdminBank';

import Rules from './pages/Rules';
import View from './pages/View';


function Home() {
  return (
    <main id="home" className="hero">

      <div className="hero-content">

        <p className="tag">
          WELCOME TO MNINE
        </p>

        <h1>
          Spirit.
          <br />
          <span>Unity.</span>
          <br />
          <h1 className="never-give-up">
            Never Give Up.
          </h1>
        </h1>

        <p className="description">
          A minimal digital experience designed with
          simplicity and creativity in mind.
        </p>

        <div className="buttons">

          <Link
            to="/rules"
            className="primary-btn"
          >
            Rules
          </Link>

          <Link
            to="/view"
            className="secondary-btn"
          >
            View
          </Link>

        </div>

      </div>


      <div className="hero-image">

        <img
          src={M9Image1}
          alt="M9"
        />

      </div>

    </main>
  );
}


function App() {

  return (
    <BrowserRouter>

      <div className="app">


        {/* =========================
            DESKTOP NAVBAR
        ========================= */}

        <nav className="navbar">

          <Link
            to="/"
            className="logo"
          >
            <img
              src={M9Image}
              alt="M9"
            />
          </Link>


          <div className="menu">

            <Link to="/">
              Home
            </Link>

            <Link to="/member">
              Member
            </Link>

            <Link to="/work">
              Work
            </Link>

            <Link to="/absence">
              Absence
            </Link>

            <Link to="/check">
              Check
            </Link>

            <Link to="/bank">
              BANK
            </Link>

            <Link to="/wheel">
              Wheel
            </Link>

            <Link to="/report">
              Report
            </Link>

          </div>


          <Link
            to="/admin-login"
            className="nav-btn"
          >
            LOGIN ADMIN
          </Link>

        </nav>


        {/* =========================
            MOBILE BOTTOM NAV
        ========================= */}

        <nav className="mobile-nav">

          <Link to="/">
            <span className="mobile-nav-icon">⌂</span>
            <span>Home</span>
          </Link>

          <Link to="/member">
            <span className="mobile-nav-icon">♟</span>
            <span>Member</span>
          </Link>

          <Link to="/work">
            <span className="mobile-nav-icon">▣</span>
            <span>Work</span>
          </Link>

          <Link to="/absence">
            <span className="mobile-nav-icon">📋</span>
            <span>Absence</span>
          </Link>

          <Link to="/check">
            <span className="mobile-nav-icon">✓</span>
            <span>Check</span>
          </Link>

          <Link to="/bank">
            <span className="mobile-nav-icon">฿</span>
            <span>BANK</span>
          </Link>

          <Link to="/report">
            <span className="mobile-nav-icon">≡</span>
            <span>Report</span>
          </Link>

        </nav>


        {/* =========================
            ROUTES
        ========================= */}

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/rules"
            element={<Rules />}
          />

          <Route
            path="/view"
            element={<View />}
          />

          <Route
            path="/member"
            element={<Member />}
          />

          <Route
            path="/member/bit-town"
            element={<BitTown />}
          />

          <Route
            path="/work"
            element={<Work />}
          />

          <Route
            path="/absence"
            element={<Absence />}
          />

          <Route
            path="/check"
            element={<Check />}
          />

          <Route
            path="/bank"
            element={<Bank />}
          />

          <Route
            path="/wheel"
            element={<Wheel />}
          />

          <Route
            path="/report"
            element={<Report />}
          />

          {/* ADMIN */}

          <Route
            path="/admin-login"
            element={<AdminLogin />}
          />

          <Route
            path="/admin"
            element={<Admin />}
          />

          <Route
            path="/admin/bank"
            element={<AdminBank />}
          />

        </Routes>

      </div>

    </BrowserRouter>
  );
}


export default App;

