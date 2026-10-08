import {
  ref,
  push,
  onValue,
  remove
} from "firebase/database";

import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";

import {
  database,
  storage
} from "../firebase";


// ========================================
// COMPRESS IMAGE
// ========================================

const compressImage = (
  file,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.6
) => {

  return new Promise((resolve, reject) => {

    const reader = new FileReader();

    reader.onload = (event) => {

      const img = new Image();

      img.onload = () => {

        let width = img.width;
        let height = img.height;


        // ========================================
        // ลดขนาดรูป
        // ========================================

        if (
          width > maxWidth ||
          height > maxHeight
        ) {

          const ratio = Math.min(
            maxWidth / width,
            maxHeight / height
          );

          width = Math.round(
            width * ratio
          );

          height = Math.round(
            height * ratio
          );

        }


        // ========================================
        // Canvas
        // ========================================

        const canvas =
          document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;


        const ctx =
          canvas.getContext("2d");

        ctx.drawImage(
          img,
          0,
          0,
          width,
          height
        );


        // ========================================
        // JPEG
        // ========================================

        canvas.toBlob(
          (blob) => {

            if (!blob) {

              reject(
                new Error(
                  "ไม่สามารถบีบอัดรูปภาพได้"
                )
              );

              return;
            }


            const compressedFile =
              new File(
                [blob],
                "absence.jpg",
                {
                  type: "image/jpeg",
                  lastModified: Date.now()
                }
              );


            resolve(
              compressedFile
            );

          },
          "image/jpeg",
          quality
        );

      };


      img.onerror = () => {

        reject(
          new Error(
            "ไม่สามารถอ่านรูปภาพได้"
          )
        );

      };


      img.src =
        event.target.result;

    };


    reader.onerror = () => {

      reject(
        new Error(
          "ไม่สามารถอ่านไฟล์ได้"
        )
      );

    };


    reader.readAsDataURL(file);

  });

};


// ========================================
// FILE → DATA URL
// ใช้เป็นระบบสำรอง
// ========================================

const fileToDataURL = (file) => {

  return new Promise(
    (resolve, reject) => {

      const reader =
        new FileReader();


      reader.onload = () => {

        resolve(
          reader.result
        );

      };


      reader.onerror = () => {

        reject(
          new Error(
            "ไม่สามารถเตรียมรูปภาพได้"
          )
        );

      };


      reader.readAsDataURL(file);

    }
  );

};


// ========================================
// GET BANGKOK DATE
// ใช้สำหรับตรวจสอบวันหมดอายุใบลา
// รูปแบบ YYYY-MM-DD
// ========================================

const getBangkokDateString = () => {

  const parts =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone: "Asia/Bangkok",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }
    ).formatToParts(
      new Date()
    );


  const year =
    parts.find(
      (part) =>
        part.type === "year"
    )?.value;


  const month =
    parts.find(
      (part) =>
        part.type === "month"
    )?.value;


  const day =
    parts.find(
      (part) =>
        part.type === "day"
    )?.value;


  return `${year}-${month}-${day}`;

};


// ========================================
// NORMALIZE DATE
// รองรับทั้ง ค.ศ. และ พ.ศ.
//
// 2026-10-07
// ↓
// 2026-10-07
//
// 2569-10-07
// ↓
// 2026-10-07
// ========================================

const normalizeDate = (dateString) => {

  if (!dateString) {
    return "";
  }


  const parts =
    String(dateString).split("-");


  if (
    parts.length !== 3
  ) {

    return "";

  }


  let year =
    Number(parts[0]);


  const month =
    parts[1];


  const day =
    parts[2];


  if (
    !Number.isFinite(year) ||
    !month ||
    !day
  ) {

    return "";

  }


  // ========================================
  // พ.ศ. → ค.ศ.
  // ========================================

  if (
    year >= 2400
  ) {

    year -= 543;

  }


  return `${String(year).padStart(4, "0")}-${month}-${day}`;

};


// ========================================
// UPLOAD STORAGE
// timeout 12 วินาที
// ========================================

const uploadImageToStorage = (
  file,
  onProgress
) => {

  return new Promise(
    (resolve, reject) => {

      let finished = false;


      const fileName =
        `${Date.now()}_absence.jpg`;


      const imageRef =
        storageRef(
          storage,
          `absence/${fileName}`
        );


      let uploadTask;


      try {

        uploadTask =
          uploadBytesResumable(
            imageRef,
            file,
            {
              contentType:
                "image/jpeg"
            }
          );

      } catch (error) {

        reject(error);
        return;

      }


      // ========================================
      // Timeout
      // ========================================

      const timeout =
        setTimeout(() => {

          if (finished) {
            return;
          }


          finished = true;


          try {

            uploadTask.cancel();

          } catch (error) {

            console.log(
              "Cancel upload:",
              error
            );

          }


          reject(
            new Error(
              "Firebase Storage ไม่ตอบสนอง"
            )
          );

        }, 12000);


      // ========================================
      // Upload events
      // ========================================

      uploadTask.on(

        "state_changed",

        (snapshot) => {

          if (finished) {
            return;
          }


          const progress =
            snapshot.totalBytes > 0
              ? Math.round(
                  (
                    snapshot.bytesTransferred /
                    snapshot.totalBytes
                  ) * 100
                )
              : 0;


          console.log(
            "Storage:",
            progress + "%"
          );


          if (onProgress) {

            onProgress(
              progress
            );

          }

        },


        (error) => {

          if (finished) {
            return;
          }


          finished = true;

          clearTimeout(
            timeout
          );


          console.error(
            "STORAGE ERROR:",
            error
          );


          reject(error);

        },


        async () => {

          if (finished) {
            return;
          }


          try {

            const url =
              await getDownloadURL(
                uploadTask.snapshot.ref
              );


            finished = true;

            clearTimeout(
              timeout
            );


            resolve(url);

          } catch (error) {

            finished = true;

            clearTimeout(
              timeout
            );


            reject(error);

          }

        }

      );

    }
  );

};


// ========================================
// ADD ABSENCE
// ========================================

export const addAbsence = async (
  absenceData,
  onProgress
) => {

  try {

    let imageUrl = "";
    let imageName = "";


    // ========================================
    // IMAGE
    // ========================================

    if (
      absenceData.imageFile
    ) {

      const originalFile =
        absenceData.imageFile;


      // ========================================
      // ตรวจสอบไฟล์
      // ========================================

      if (
        !originalFile.type.startsWith(
          "image/"
        )
      ) {

        throw new Error(
          "ไฟล์ที่เลือกต้องเป็นรูปภาพ"
        );

      }


      // ========================================
      // จำกัดไฟล์ 10 MB
      // ========================================

      if (
        originalFile.size >
        10 * 1024 * 1024
      ) {

        throw new Error(
          "รูปภาพต้องมีขนาดไม่เกิน 10 MB"
        );

      }


      // ========================================
      // เริ่ม
      // ========================================

      console.log(
        "กำลังบีบอัดรูป..."
      );


      if (onProgress) {
        onProgress(5);
      }


      // ========================================
      // Compress
      // ========================================

      const compressedFile =
        await compressImage(
          originalFile
        );


      console.log(
        "ขนาดก่อนบีบ:",
        (
          originalFile.size /
          1024 /
          1024
        ).toFixed(2),
        "MB"
      );


      console.log(
        "ขนาดหลังบีบ:",
        (
          compressedFile.size /
          1024 /
          1024
        ).toFixed(2),
        "MB"
      );


      if (onProgress) {
        onProgress(10);
      }


      imageName =
        originalFile.name;


      // ========================================
      // พยายาม Firebase Storage
      // ========================================

      try {

        console.log(
          "กำลังเชื่อมต่อ Firebase Storage..."
        );


        imageUrl =
          await uploadImageToStorage(
            compressedFile,
            (progress) => {

              const totalProgress =
                10 +
                Math.round(
                  progress * 0.8
                );


              if (onProgress) {

                onProgress(
                  totalProgress
                );

              }

            }
          );


        console.log(
          "อัปโหลด Storage สำเร็จ"
        );


        if (onProgress) {
          onProgress(90);
        }

      } catch (storageError) {

        // ========================================
        // STORAGE ใช้ไม่ได้
        // ========================================

        console.warn(
          "Firebase Storage ใช้งานไม่ได้"
        );

        console.warn(
          storageError
        );


        console.log(
          "กำลังใช้ระบบสำรอง..."
        );


        if (onProgress) {
          onProgress(50);
        }


        // ========================================
        // Fallback:
        // เก็บรูปใน Realtime Database
        // ========================================

        imageUrl =
          await fileToDataURL(
            compressedFile
          );


        console.log(
          "ใช้รูปแบบ Data URL สำเร็จ"
        );


        if (onProgress) {
          onProgress(90);
        }

      }

    }


    // ========================================
    // DATABASE DATA
    // ========================================

    const dataToSave = {

      name:
        absenceData.name || "",

      startDate:
        absenceData.startDate || "",

      endDate:
        absenceData.endDate || "",

      startTime:
        absenceData.startTime || "",

      endTime:
        absenceData.endTime || "",

      reason:
        absenceData.reason || "",

      image:
        imageUrl,

      imageName:
        imageName,

      // เวลาที่ผู้ใช้กดส่งใบลา
      submittedAt:
        absenceData.submittedAt ||
        new Date().toISOString()

    };


    // ========================================
    // SAVE REALTIME DATABASE
    // ========================================

    const absenceRef =
      ref(
        database,
        "absence"
      );


    const result =
      await push(
        absenceRef,
        dataToSave
      );


    // ========================================
    // COMPLETE
    // ========================================

    if (onProgress) {
      onProgress(100);
    }


    console.log(
      "ABSENCE SAVED:",
      result.key
    );


    return result.key;

  } catch (error) {

    console.error(
      "ABSENCE SAVE ERROR:",
      error
    );


    throw error;

  }

};


// ========================================
// DELETE EXPIRED ABSENCE
// ลบใบลาที่เลยวันสิ้นสุดแล้ว
// ========================================

const deleteExpiredAbsences = async (
  data
) => {

  const todayString =
    getBangkokDateString();


  const expiredIds = [];


  Object.entries(
    data || {}
  ).forEach(
    ([id, item]) => {

      if (
        !item ||
        !item.endDate
      ) {
        return;
      }


      // ========================================
      // แปลงวันที่ให้เป็น ค.ศ. ก่อนเปรียบเทียบ
      // ========================================

      const normalizedEndDate =
        normalizeDate(
          item.endDate
        );


      if (!normalizedEndDate) {

        console.warn(
          "ไม่สามารถอ่าน endDate:",
          id,
          item.endDate
        );

        return;

      }


      console.log(
        "CHECK EXPIRE:",
        id,
        "endDate:",
        item.endDate,
        "→",
        normalizedEndDate,
        "| today:",
        todayString
      );


      // ========================================
      // ถ้า endDate < วันนี้
      // แปลว่าเลยวันสุดท้ายของการลาแล้ว
      // ========================================

      if (
        normalizedEndDate <
        todayString
      ) {

        expiredIds.push(id);

      }

    }
  );


  if (
    expiredIds.length === 0
  ) {

    console.log(
      "ไม่มีใบลาที่หมดอายุ"
    );

    return;

  }


  console.log(
    "พบใบลาที่หมดอายุ:",
    expiredIds
  );


  await Promise.all(
    expiredIds.map(
      async (id) => {

        try {

          await remove(
            ref(
              database,
              `absence/${id}`
            )
          );


          console.log(
            "ลบใบลาหมดอายุสำเร็จ:",
            id
          );

        } catch (error) {

          console.error(
            "ไม่สามารถลบใบลา:",
            id,
            error
          );

        }

      }
    )
  );

};


// ========================================
// REALTIME ABSENCE
// ========================================

export const listenAbsence = (
  callback
) => {

  const absenceRef =
    ref(
      database,
      "absence"
    );


  return onValue(
    absenceRef,
    async (snapshot) => {

      const data =
        snapshot.val() || {};


      console.log(
        "ABSENCE REALTIME:",
        data
      );


      const todayString =
        getBangkokDateString();


      console.log(
        "วันนี้:",
        todayString
      );


      // ========================================
      // ตรวจสอบและกรองใบลาที่ยังไม่หมดอายุ
      // ========================================

      const activeData = {};


      Object.entries(
        data
      ).forEach(
        ([id, item]) => {

          if (!item) {
            return;
          }


          // ========================================
          // ไม่มี endDate
          // ให้เก็บไว้ตามปกติ
          // ========================================

          if (!item.endDate) {

            activeData[id] =
              item;

            return;

          }


          // ========================================
          // แปลงวันที่ พ.ศ. / ค.ศ.
          // ========================================

          const normalizedEndDate =
            normalizeDate(
              item.endDate
            );


          if (!normalizedEndDate) {

            // ถ้าอ่านวันที่ไม่ได้
            // ป้องกันข้อมูลหาย
            activeData[id] =
              item;

            return;

          }


          console.log(
            "CHECK DISPLAY:",
            id,
            item.endDate,
            "→",
            normalizedEndDate,
            "| today:",
            todayString
          );


          // ========================================
          // ยังไม่หมดอายุ
          //
          // endDate = วันนี้
          // ยังแสดง
          //
          // endDate > วันนี้
          // ยังแสดง
          // ========================================

          if (
            normalizedEndDate >=
            todayString
          ) {

            activeData[id] =
              item;

          }

        }
      );


      // ========================================
      // แสดงเฉพาะใบลาที่ยังไม่หมดอายุ
      // ========================================

      callback(
        activeData
      );


      // ========================================
      // ลบใบลาที่หมดอายุจาก Firebase
      // ========================================

      await deleteExpiredAbsences(
        data
      );

    },

    (error) => {

      console.error(
        "ABSENCE REALTIME ERROR:",
        error
      );

    }

  );

};