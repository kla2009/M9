
import React, { useState } from 'react';
import '../CSS/Report.css';

import { addReport } from '../utils/report';

function Report() {

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !type || !title || !detail) {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    try {
      setLoading(true);

      const reportData = {
        name,
        type,
        title,
        detail,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await addReport(reportData);

      alert('ส่งรายงานเรียบร้อยแล้ว');

      setName('');
      setType('');
      setTitle('');
      setDetail('');

    } catch (error) {
      console.error('REPORT ERROR:', error);
      alert('ไม่สามารถส่งรายงานได้');

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-page">
      <div className="report-container">

        <div className="report-header">
          <span>MNINE / REPORT</span>

          <h1>แจ้งรายงาน</h1>

          <p>
            แจ้งปัญหา เหตุการณ์ หรือข้อมูล
            ที่ต้องการให้ผู้ดูแลตรวจสอบ
          </p>
        </div>

        <form
          className="report-form"
          onSubmit={handleSubmit}
        >

          <div className="report-group">
            <label>ชื่อผู้รายงาน</label>

            <input
              type="text"
              placeholder="กรอกชื่อ"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </div>

          <div className="report-group">
            <label>ประเภทการรายงาน</label>

            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
            >
              <option value="">
                เลือกประเภท
              </option>

              <option value="website">
                ปัญหาเว็บไซต์
              </option>

              <option value="member">
                ปัญหาสมาชิก
              </option>

              <option value="work">
                ปัญหาเกี่ยวกับงาน
              </option>

              <option value="other">
                อื่น ๆ
              </option>
            </select>
          </div>

          <div className="report-group">
            <label>หัวข้อรายงาน</label>

            <input
              type="text"
              placeholder="เช่น เว็บไซต์มีปัญหา"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />
          </div>

          <div className="report-group">
            <label>รายละเอียด</label>

            <textarea
              placeholder="อธิบายรายละเอียดที่ต้องการรายงาน"
              value={detail}
              onChange={(e) =>
                setDetail(e.target.value)
              }
            />
          </div>

          <button
            type="submit"
            className="report-submit"
            disabled={loading}
          >
            {loading
              ? 'กำลังส่ง...'
              : 'ส่งรายงาน'}
          </button>

        </form>

      </div>
    </div>
  );
}

export default Report;

