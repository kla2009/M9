import React, { useState } from 'react';
import '../CSS/Absence.css';

import { addAbsence } from '../utils/absence';

function Absence() {

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // เวลาไม่บังคับ
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [reason, setReason] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {

    e.preventDefault();


    // บังคับเฉพาะข้อมูลหลัก
    if (
      !name ||
      !startDate ||
      !endDate ||
      !reason
    ) {
      alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบ');
      return;
    }


    // ตรวจสอบวันที่
    if (endDate < startDate) {

      alert(
        'วันสิ้นสุดต้องไม่ก่อนวันเริ่มลา'
      );

      return;
    }


    // ถ้ากรอกเวลา ต้องกรอกให้ครบทั้งสองช่อง
    if (
      (startTime && !endTime) ||
      (!startTime && endTime)
    ) {

      alert(
        'หากต้องการระบุเวลา กรุณากรอกเวลาเริ่มและเวลาสิ้นสุด'
      );

      return;
    }


    // ถ้าวันเดียวกันและกรอกเวลา
    if (
      startDate === endDate &&
      startTime &&
      endTime &&
      endTime <= startTime
    ) {

      alert(
        'เวลาสิ้นสุดต้องมากกว่าเวลาเริ่ม'
      );

      return;
    }


    try {

      setLoading(true);


      const absenceData = {

        name: name,

        startDate: startDate,

        endDate: endDate,

        // ถ้าไม่กรอกจะเป็นค่าว่าง
        startTime: startTime || '',

        endTime: endTime || '',

        reason: reason,

        image: image
          ? image.name
          : '',

        createdAt:
          new Date().toISOString()

      };


      await addAbsence(
        absenceData
      );


      alert(
        'แจ้งลาเรียบร้อยแล้ว'
      );


      // ล้างข้อมูล

      setName('');
      setStartDate('');
      setEndDate('');
      setStartTime('');
      setEndTime('');
      setReason('');
      setImage(null);


    } catch (error) {

      console.error(
        'ABSENCE ERROR:',
        error
      );

      alert(
        'ไม่สามารถบันทึกข้อมูลได้'
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="absence-page">

      <div className="absence-container">


        <div className="absence-header">

          <span>
            MNINE / ABSENCE
          </span>

          <h1>
            แจ้งการลา
          </h1>

          <p>
            แจ้งวันที่และเวลาที่ไม่สามารถเข้าร่วมงานได้
          </p>

        </div>


        <form
          className="absence-form"
          onSubmit={handleSubmit}
        >


          {/* ชื่อ */}

          <div className="absence-group">

            <label>
              ชื่อ
            </label>

            <input
              type="text"
              placeholder="กรอกชื่อ"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>


          {/* วันที่ */}

          <div className="absence-row">

            <div className="absence-group">

              <label>
                วันเริ่มลา
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(
                    e.target.value
                  )
                }
              />

            </div>


            <div className="absence-group">

              <label>
                วันสิ้นสุด
              </label>

              <input
                type="date"
                min={startDate}
                value={endDate}
                onChange={(e) =>
                  setEndDate(
                    e.target.value
                  )
                }
              />

            </div>

          </div>


          {/* เวลา */}

          <div className="absence-row">

            <div className="absence-group">

              <label>
                เวลาเริ่ม
                <span> (ไม่บังคับ)</span>
              </label>

              <input
                type="time"
                value={startTime}
                onChange={(e) =>
                  setStartTime(
                    e.target.value
                  )
                }
              />

            </div>


            <div className="absence-group">

              <label>
                เวลาสิ้นสุด
                <span> (ไม่บังคับ)</span>
              </label>

              <input
                type="time"
                value={endTime}
                onChange={(e) =>
                  setEndTime(
                    e.target.value
                  )
                }
              />

            </div>

          </div>


          {/* เหตุผล */}

          <div className="absence-group">

            <label>
              เหตุผล
            </label>

            <textarea
              placeholder="กรอกเหตุผลในการลา"
              value={reason}
              onChange={(e) =>
                setReason(
                  e.target.value
                )
              }
            />

          </div>


          {/* รูปภาพ */}

          <div className="absence-group">

            <label>
              รูปภาพประกอบ
              <span> (ถ้ามี)</span>
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(
                  e.target.files[0] || null
                )
              }
            />

          </div>


          {/* ปุ่ม */}

          <button
            type="submit"
            className="absence-submit"
            disabled={loading}
          >

            {loading
              ? 'กำลังบันทึก...'
              : 'แจ้งลา'}

          </button>


        </form>

      </div>

    </div>

  );
}

export default Absence;