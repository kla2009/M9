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

  // สถานะการอัปโหลด
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);


  const handleSubmit = async (e) => {

    e.preventDefault();


    // ========================================
    // ตรวจสอบข้อมูล
    // ========================================

    if (
      !name ||
      !startDate ||
      !endDate ||
      !reason
    ) {

      alert(
        'กรุณากรอกข้อมูลที่จำเป็นให้ครบ'
      );

      return;
    }


    // ========================================
    // ตรวจสอบวันที่
    // ========================================

    if (endDate < startDate) {

      alert(
        'วันสิ้นสุดต้องไม่ก่อนวันเริ่มลา'
      );

      return;
    }


    // ========================================
    // ตรวจสอบเวลา
    // ========================================

    if (
      (startTime && !endTime) ||
      (!startTime && endTime)
    ) {

      alert(
        'หากต้องการระบุเวลา กรุณากรอกเวลาเริ่มและเวลาสิ้นสุด'
      );

      return;
    }


    // ========================================
    // วันเดียวกัน + เวลา
    // ========================================

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
      setUploadProgress(0);


      // ========================================
      // ข้อมูลการลา
      // ========================================

      const absenceData = {

        name:
          name,

        startDate:
          startDate,

        endDate:
          endDate,

        startTime:
          startTime || '',

        endTime:
          endTime || '',

        reason:
          reason,

        // ส่งไฟล์จริง
        imageFile:
          image || null,

        // เวลาที่กดส่งใบลาอัตโนมัติ
        submittedAt:
          new Date().toISOString()

      };


      // ========================================
      // บันทึกข้อมูล + Upload รูป
      // ========================================

      await addAbsence(
        absenceData,
        (progress) => {

          setUploadProgress(
            progress
          );

        }
      );


      // ========================================
      // สำเร็จ
      // ========================================

      setUploadProgress(100);


      alert(
        'แจ้งลาเรียบร้อยแล้ว'
      );


      // ========================================
      // ล้างข้อมูล
      // ========================================

      setName('');
      setStartDate('');
      setEndDate('');
      setStartTime('');
      setEndTime('');
      setReason('');
      setImage(null);


      // รอให้เห็น 100%
      setTimeout(() => {

        setUploadProgress(0);

      }, 500);


    } catch (error) {

      console.error(
        'ABSENCE ERROR:',
        error
      );


      alert(
        error?.message ||
        'ไม่สามารถบันทึกข้อมูลได้'
      );


      setUploadProgress(0);

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="absence-page">

      <div className="absence-container">


        {/* ========================================
            HEADER
        ======================================== */}

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


        {/* ========================================
            FORM
        ======================================== */}

        <form
          className="absence-form"
          onSubmit={handleSubmit}
        >


          {/* ========================================
              ชื่อ
          ======================================== */}

          <div className="absence-group">

            <label>
              ชื่อ
            </label>

            <input
              type="text"
              placeholder="กรอกชื่อ"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
            />

          </div>


          {/* ========================================
              วันที่
          ======================================== */}

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


          {/* ========================================
              เวลา
          ======================================== */}

          <div className="absence-row">

            <div className="absence-group">

              <label>

                เวลาเริ่ม

                <span>
                  {' '}
                  (ไม่บังคับ)
                </span>

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

                <span>
                  {' '}
                  (ไม่บังคับ)
                </span>

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


          {/* ========================================
              เหตุผล
          ======================================== */}

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


          {/* ========================================
              รูปภาพ
          ======================================== */}

          <div className="absence-group">

            <label>

              รูปภาพประกอบ

              <span>
                {' '}
                (ถ้ามี)
              </span>

            </label>


            <input
              type="file"
              accept="image/*"
              disabled={loading}
              onChange={(e) =>
                setImage(
                  e.target.files[0] ||
                  null
                )
              }
            />


            {image && (

              <small
                style={{
                  color: '#888',
                  marginTop: '4px'
                }}
              >

                เลือกไฟล์:
                {' '}
                {image.name}

              </small>

            )}

          </div>


          {/* ========================================
              PROGRESS
          ======================================== */}

          {loading && (

            <div
              style={{
                marginTop: '10px',
                marginBottom: '10px'
              }}
            >

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '6px'
                }}
              >

                <span
                  style={{
                    color: '#aaa',
                    fontSize: '13px'
                  }}
                >

                  {uploadProgress < 10
                    ? 'กำลังเตรียมรูป...'
                    : uploadProgress < 95
                      ? 'กำลังอัปโหลดรูป...'
                      : 'กำลังบันทึกข้อมูล...'}

                </span>


                <span
                  style={{
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}
                >

                  {uploadProgress}%

                </span>

              </div>


              <div
                style={{
                  width: '100%',
                  height: '6px',
                  background: '#222',
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}
              >

                <div
                  style={{
                    width: `${uploadProgress}%`,
                    height: '100%',
                    background: '#e50914',
                    borderRadius: '10px',
                    transition: 'width 0.2s ease'
                  }}
                />

              </div>

            </div>

          )}


          {/* ========================================
              ปุ่ม
          ======================================== */}

          <button
            type="submit"
            className="absence-submit"
            disabled={loading}
          >

            {loading
              ? `กำลังอัปโหลด ${uploadProgress}%...`
              : 'แจ้งลา'}

          </button>


        </form>

      </div>

    </div>

  );

}

export default Absence;