import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";

export default function App() {
  const [reports, setReports] = useState([]);
  const [defectDetail, setDefectDetail] = useState("");
  const [quantity, setQuantity] = useState(1);

  // ดึงข้อมูล Realtime
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "defects"), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReports(docs);
    });
    return () => unsubscribe();
  }, []);

  // บันทึกขึ้น Cloud
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

  // ลบข้อมูล
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "defects", id));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Defect Intelligence System</h2>
      <form onSubmit={handleAddReport} style={{ marginBottom: "20px" }}>
        <input 
          type="text" 
          placeholder="รายละเอียด Defect" 
          value={defectDetail}
          onChange={(e) => setDefectDetail(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <input 
          type="number" 
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={{ padding: "8px", marginRight: "10px", width: "60px" }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>บันทึกข้อมูล</button>
      </form>

      <h3>รายการบันทึก (Realtime Sync)</h3>
      <ul>
        {reports.map((item) => (
          <li key={item.id} style={{ marginBottom: "8px" }}>
            {item.defectDetail} - จำนวน: {item.quantity}
            <button onClick={() => handleDelete(item.id)} style={{ marginLeft: "10px", color: "red" }}>ลบ</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
