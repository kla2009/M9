import '../CSS/Work.css';
import '../CSS/WorkNotice.css';

function Work() {
  return (
    <div className="work-page">

      {/* NOTICE */}
      <div className="work-notice">

        <span className="notice-icon">
          !
        </span>

        <div>
          <strong>หมายเหตุ</strong>

          <p>
            ตารางงานอาจมีการเปลี่ยนแปลงได้ในอนาคต
            หากมีการเปลี่ยนแปลงจะแจ้งใน Discord
          </p>
        </div>

      </div>


      {/* HEADER */}
      <div className="work-header">

        <div className="work-icon">
          📅
        </div>

        <div>
          <p>MNINE / WORK</p>

          <h1>
            ตารางกิจกรรมประจำสัปดาห์
          </h1>

          <span>
            ทำตามนี้ แล้วไปถึงเป้าหมายแน่นอน!
          </span>
        </div>

      </div>


      {/* SCHEDULE */}

      <div className="schedule">

        {/* MONDAY */}
        <div className="day-row">

          <div className="day">
            <h2>จันทร์</h2>
            <span>Monday</span>
          </div>

          <div className="tasks">

            <div className="task robbery">
              <div className="task-icon">
                🥷
              </div>

              <div>
                <h3>งัดร้าน</h3>
                <p>◷ 19:30 - 22:30</p>
              </div>
            </div>

            <div className="task training">
              <div className="task-icon">
                🎯
              </div>

              <div>
                <h3>ซ้อมวอโซน</h3>
                <p>◷ หลัง 22:30 - 00:00</p>
              </div>
            </div>

          </div>

        </div>


        {/* TUESDAY */}
        <div className="day-row">

          <div className="day">
            <h2>อังคาร</h2>
            <span>Tuesday</span>
          </div>

          <div className="tasks">

            <div className="task drugs">

              <div className="task-icon">
                💊
              </div>

              <div>
                <h3>ขายยา</h3>
                <p>◷ 20:00 - 22:00</p>
              </div>

            </div>

          </div>

        </div>


        {/* WEDNESDAY */}
        <div className="day-row">

          <div className="day">
            <h2>พุธ</h2>
            <span>Wednesday</span>
          </div>

          <div className="tasks">

            <div className="task robbery">

              <div className="task-icon">
                🥷
              </div>

              <div>
                <h3>งัดร้าน</h3>
                <p>◷ 19:30 - 22:30</p>
              </div>

            </div>

            <div className="task training">

              <div className="task-icon">
                🎯
              </div>

              <div>
                <h3>ซ้อมวอโซน</h3>
                <p>◷ หลัง 22:30 - 00:00</p>
              </div>

            </div>

          </div>

        </div>


        {/* THURSDAY */}
        <div className="day-row">

          <div className="day">
            <h2>พฤหัส</h2>
            <span>Thursday</span>
          </div>

          <div className="tasks">

            <div className="task drugs">

              <div className="task-icon">
                💊
              </div>

              <div>
                <h3>ขายยา</h3>
                <p>◷ 20:00 - 22:00</p>
              </div>

            </div>

          </div>

        </div>


        {/* FRIDAY */}
        <div className="day-row">

          <div className="day">
            <h2>ศุกร์</h2>
            <span>Friday</span>
          </div>

          <div className="tasks">

            <div className="task rest">

              <div className="task-icon">
                🌴
              </div>

              <div>
                <h3>วันพักผ่อน</h3>
                <p>หาตัง / หาของส่งแก๊งค์</p>
              </div>

            </div>

          </div>

        </div>


        {/* SATURDAY */}
        <div className="day-row">

          <div className="day">
            <h2>เสาร์</h2>
            <span>Saturday</span>
          </div>

          <div className="tasks">

            <div className="task rest">

              <div className="task-icon">
                🌴
              </div>

              <div>
                <h3>วันพักผ่อน</h3>
                <p>หาตัง / หาของส่งแก๊งค์</p>
              </div>

            </div>

          </div>

        </div>


        {/* SUNDAY */}
        <div className="day-row">

          <div className="day">
            <h2>อาทิตย์</h2>
            <span>Sunday</span>
          </div>

          <div className="tasks">

            <div className="task rest">

              <div className="task-icon">
                🌴
              </div>

              <div>
                <h3>วันพักผ่อน</h3>
                <p>หาตัง / หาของส่งแก๊งค์</p>
              </div>

            </div>

          </div>

        </div>

      </div>


      {/* FOOTER */}

      <div className="work-footer">

        <div>
          <span className="dot robbery-dot"></span>
          งัดร้าน
        </div>

        <div>
          <span className="dot drugs-dot"></span>
          ขายยา
        </div>

        <div>
          <span className="dot training-dot"></span>
          ซ้อมวอโซน
        </div>

        <div>
          <span className="dot rest-dot"></span>
          พักผ่อน / หาของส่งแก๊งค์
        </div>

      </div>

    </div>
  );
}

export default Work;
