import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from "firebase/firestore";

export default function App() {
  const [reports, setReports] = useState([]);
  const [defectDetail, setDefectDetail] = useState("");
  const [quantity, setQuantity] = useState(1);

  // ดึงข้อมูล Realtime จาก Cloud
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "defects"), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReports(docs);
    });

    return () => unsubscribe();
  }, []);

  // บันทึกข้อมูลขึ้น Cloud
  const handleAddReport = async (e) => {
    e.preventDefault();
    if (!defectDetail) return;

    await addDoc(collection(db, "defects"), {
      defectDetail,
      quantity: Number(quantity),
      createdAt: serverTimestamp()
    });

    setDefectDetail("");
    setQuantity(1);
  };

  // ลบข้อมูลบน Cloud
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "defects", id));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "700px", margin: "0 auto" }}>
      <h2>Defect Intelligence System</h2>
      
      {/* ฟอร์มกรอกข้อมูล */}
      <form onSubmit={handleAddReport} style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input 
          type="text" 
          placeholder="รายละเอียด Defect" 
          value={defectDetail}
          onChange={(e) => setDefectDetail(e.target.value)}
          style={{ padding: "10px", flex: 1, borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <input 
          type="number" 
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={{ padding: "10px", width: "70px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ padding: "10px 16px", background: "#0070f3", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          บันทึก
        </button>
      </form>

      <h3>รายการบันทึก (Realtime Sync)</h3>

      {/* ตารางแสดงผลรายการ */}
      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #dcd7cd" }}>
        <thead>
          <tr style={{ backgroundColor: "#f9f6f0", borderBottom: "1px solid #dcd7cd" }}>
            <th style={{ padding: "10px", borderRight: "1px solid #dcd7cd", width: "80px", textAlign: "center" }}>ลำดับที่</th>
            <th style={{ padding: "10px", borderRight: "1px solid #dcd7cd", textAlign: "left" }}>รายการ</th>
            <th style={{ padding: "10px", borderRight: "1px solid #dcd7cd", width: "80px", textAlign: "center" }}>จำนวน</th>
            <th style={{ padding: "10px", width: "80px", textAlign: "center" }}>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {reports.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                ยังไม่มีข้อมูลรายการ
              </td>
            </tr>
          ) : (
            reports.map((item, index) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #dcd7cd" }}>
                {/* รันลำดับที่อัตโนมัติ */}
                <td style={{ textAlign: "center", padding: "10px", borderRight: "1px solid #dcd7cd" }}>
                  {index + 1}
                </td>
                <td style={{ padding: "10px", borderRight: "1px solid #dcd7cd" }}>
                  {item.defectDetail}
                </td>
                <td style={{ textAlign: "center", padding: "10px", borderRight: "1px solid #dcd7cd" }}>
                  {item.quantity}
                </td>
                <td style={{ textAlign: "center", padding: "10px" }}>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    style={{ background: "#ff4d4f", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
