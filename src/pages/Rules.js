import React from "react";
import { Link } from "react-router-dom";
import "../CSS/Rules.css";
import M9Image from "../M9(1).png";

function Rules() {
  return (
    <div className="rules-page">

      <div className="rules-container">

        {/* HEADER */}
        <div className="rules-header">
          <p className="rules-label">
            M9 GANG
          </p>

          <h1>
            RULES
          </h1>

          <p>
            กฎและข้อกำหนดของแก๊ง M9
          </p>
        </div>


        {/* ข้อ 1 */}
        <div className="rule-item">
          <h2>
            ข้อ 1 — ความรับผิดชอบ
          </h2>

          <p>
            สมาชิกทุกคนต้องมีความรับผิดชอบในตัวเอง
            และรับผิดชอบต่อหน้าที่ของตนเองภายในแก๊ง
          </p>
        </div>


        {/* ข้อ 2 */}
        <div className="rule-item">
          <h2>
            ข้อ 2 — การลา
          </h2>

          <p>
            หากมีเหตุจำเป็นต้องไปทำธุระหรือไม่สามารถมาเล่นเกมได้
            ให้จัดการเรื่องภายนอกให้เรียบร้อยก่อน
            แล้วค่อยกลับมาเล่นเกม
          </p>
        </div>


        {/* ข้อ 3 */}
        <div className="rule-item">
          <h2>
            ข้อ 3 — ความซื่อสัตย์
          </h2>

          <p>
            อย่าโกหกกัน หากมีปัญหา มีอะไรเกิดขึ้น
            หรือมีเรื่องที่ต้องแจ้ง ขอให้พูดกันตรง ๆ
            และพูดความจริง
          </p>
        </div>

        <div className="rule-item">
          <h2>
            ข้อ 4 — กฎการลา
          </h2>

           <p>
              • ห้ามแจ้งลาหลังเวลา 20:00 น.
              <br />
              • แจ้งลาหลังเวลา 20:00 น. ปรับ 150K
              <br />
              • หากหายโดยไม่แจ้งลาเกิน 7 วัน
              <br />
              • เตะออกจากสล๊อตทันที
            </p>
          </div>


        {/* ข้อ 4 */}
        <div className="rule-item">
          <h2>
            ข้อ 5 — กฎของพี่พายุ
          </h2>

          <p>
            <strong>
              พี่พายุคือกฎแก๊ง
            </strong>
          </p>

          <p>
            สมาชิกทุกคนต้องเคารพกฎและคำตัดสิน
            ของพี่พายุในเรื่องต่าง ๆ ภายในแก๊ง
          </p>
        </div>


        {/* กฎข้อสุดท้าย */}
        <div className="rule-item final-rule">

          <div className="final-rule-label">
            กฎข้อสุดท้าย
          </div>

          <h2>
            การออกจากแก๊ง
          </h2>

          <p>
            หากสมาชิกต้องการออกจากแก๊ง M9
            ต้องทำตามขั้นตอนดังต่อไปนี้
          </p>


          <ol>
            <li>
              เปิดกล้องสด
            </li>

            <li>
              ปะแป้งหน้าขาว
            </li>

            <li>
              ปะแป้งที่ก้น
            </li>

            <li>
              ให้สมาชิกในแก๊งช่วยกันร้องเพลง
              และเต้นจำนวน <strong>3 เพลง</strong>
            </li>

            <li>
              จากนั้นตะโกนเสียงดังว่า
            </li>
          </ol>


          <div className="rule-quote">
            “ผมขอออกจากแก๊ง M9 ครับ”
          </div>

          <p className="rule-center">
            พูดทั้งหมด <strong>3 รอบ</strong>
          </p>


          <p>
            จากนั้น หากสมาชิกทุกคนที่อยู่ใน Discord
            พร้อมใจกันพูดว่า
          </p>


          <div className="rule-quote">
            “ก้นขาวมาก”
          </div>


          <p>
            พี่พายุจะอนุญาตให้ออกจากแก๊งได้
          </p>

        </div>


        {/* FOOTER */}
        <div className="rules-footer">

          <Link
            to="/"
            className="logo"
          >
            <img
              src={M9Image}
              alt="M9"
            />
          </Link>

          <p>
            อยู่ด้วยกัน เคารพกัน รับผิดชอบ
            และพูดความจริงต่อกัน
          </p>

        </div>

      </div>

    </div>
  );
}

export default Rules;

