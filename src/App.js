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
          <span>Modern.</span>
          <br />
          Powerful.
        </h1>

        <p className="description">
          A minimal digital experience designed with
          simplicity and creativity in mind.
        </p>

        <div className="buttons">

          {/* RULES */}

          <Link
            to="/rules"
            className="primary-btn"
          >
            Rules
          </Link>


          {/* VIEW */}

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
            NAVBAR
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


          {/* ADMIN LOGIN */}

          <Link
            to="/admin-login"
            className="nav-btn"
          >
            LOGIN ADMIN
          </Link>

        </nav>


        {/* =========================
            ROUTES
        ========================= */}

        <Routes>


          {/* HOME */}

          <Route
            path="/"
            element={<Home />}
          />


          {/* RULES */}

          <Route
            path="/rules"
            element={<Rules />}
          />


          {/* VIEW */}

          <Route
            path="/view"
            element={<View />}
          />


          {/* MEMBER */}

          <Route
            path="/member"
            element={<Member />}
          />

          <Route
            path="/member/bit-town"
            element={<BitTown />}
          />


          {/* WORK */}

          <Route
            path="/work"
            element={<Work />}
          />


          {/* ABSENCE */}

          <Route
            path="/absence"
            element={<Absence />}
          />


          {/* CHECK */}

          <Route
            path="/check"
            element={<Check />}
          />


          {/* BANK */}

          <Route
            path="/bank"
            element={<Bank />}
          />


          {/* WHEEL */}

          <Route
            path="/wheel"
            element={<Wheel />}
          />


          {/* REPORT */}

          <Route
            path="/report"
            element={<Report />}
          />


          {/* =========================
              ADMIN
          ========================= */}

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