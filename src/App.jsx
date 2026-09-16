import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  LayoutDashboard,
  Boxes,
  FileText,
  Briefcase,
  Plus,
  X,
  ArrowUpFromLine,
  TrendingUp,
  Wallet,
  CheckCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

/* ---------------------------------------------------------------------- */
/* Design Tokens & CSS                                                    */
/* ---------------------------------------------------------------------- */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@500;600;700&family=Sarabun:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

:root{
  --black:#0F0D0B;
  --navy:#1C2126;
  --navy-soft:#241C17;
  --navy-line:#2C2119;
  --paper:#F3F1EC;
  --panel:#FFFFFF;
  --border:#E1DCD1;
  --amber:#AD8A32;
  --amber-dark:#8C6F24;
  --amber-ink:#1A1508;
  --green:#2E7D5B;
  --green-bg:rgba(46,125,91,.10);
  --red:#B3261E;
  --red-bg:rgba(179,38,30,.08);
  --text:#22262B;
  --muted:#6E6A63;
  --panel-hover:#EDE8DE;
}
.ca-root{
  font-family:'Sarabun',sans-serif;
  color:var(--text);
  background:var(--paper);
  min-height:100vh;
  width:100%;
  display:flex;
  font-size:14px;
  line-height:1.5;
}
.ca-root *{ box-sizing:border-box; }
.ca-display{ font-family:'Kanit',sans-serif; letter-spacing:.01em; }
.ca-mono{ font-family:'IBM Plex Mono',monospace; }

.ca-sidebar{
  width:220px; flex-shrink:0; background:var(--black);
  color:#fff; display:flex; flex-direction:column;
  padding:20px 14px; min-height:100vh;
  border-right:1px solid var(--navy-line);
}
.ca-brand{ display:flex; align-items:center; gap:9px; padding:0 6px 18px; border-bottom:1px solid var(--navy-line); margin-bottom:14px;}
.ca-brand-name{ font-family:'Kanit',sans-serif; font-weight:600; font-size:16px; color:#fff;}
.ca-brand-sub{ font-size:10.5px; color:#8A7370; letter-spacing:.06em;}
.ca-nav{ display:flex; flex-direction:column; gap:4px; }
.ca-nav-btn{
  display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:7px;
  background:transparent; border:none; color:#C7B4B1; cursor:pointer; text-align:left;
  font-family:'Sarabun',sans-serif; font-size:14px; font-weight:500; transition:all .12s;
}
.ca-nav-btn:hover{ background:var(--navy-soft); color:#fff; }
.ca-nav-btn.active{ background:var(--amber); color:var(--amber-ink); font-weight:600; }

.ca-main{ flex:1; min-width:0; padding:26px 32px 60px; }

.ca-titleblock{
  background:var(--panel); border:1px solid var(--border); border-radius:4px;
  display:flex; align-items:stretch; margin-bottom:22px; overflow:hidden;
}
.ca-tb-main{ flex:1; padding:14px 18px; border-right:1px solid var(--border); }
.ca-tb-eyebrow{ font-size:10.5px; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); font-weight:600; margin-bottom:3px;}
.ca-tb-title{ font-family:'Kanit',sans-serif; font-size:21px; font-weight:600; color:var(--navy); }
.ca-tb-fields{ display:flex; }
.ca-tb-field{ padding:10px 16px; border-right:1px solid var(--border); min-width:108px; }
.ca-tb-field:last-child{ border-right:none; }
.ca-tb-flabel{ font-size:9.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin-bottom:3px;}
.ca-tb-fvalue{ font-family:'IBM Plex Mono',monospace; font-size:14px; font-weight:600; color:var(--amber);}

.ca-cards{ display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:14px; margin-bottom:22px; }
.ca-card{ background:var(--panel); border:1px solid var(--border); border-radius:8px; padding:15px 16px; }
.ca-card-label{ font-size:11.5px; color:var(--muted); font-weight:600; text-transform:uppercase; letter-spacing:.05em; margin-bottom:8px;}
.ca-card-value{ font-family:'IBM Plex Mono',monospace; font-size:20px; font-weight:600; color:var(--navy); }
.ca-card-sub{ font-size:12px; color:var(--muted); margin-top:4px; }
.ca-card.warn{ border-color:rgba(173,138,50,.5); }
.ca-card.warn .ca-card-value{ color:var(--amber); }
.ca-card.good{ border-color:rgba(46,125,91,.35); }
.ca-card.good .ca-card-value{ color:var(--green); }

.ca-panel{ background:var(--panel); border:1px solid var(--border); border-radius:8px; margin-bottom:20px; }
.ca-panel-head{ display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-bottom:1px solid var(--border); }
.ca-panel-title{ font-family:'Kanit',sans-serif; font-weight:600; font-size:15.5px; color:var(--navy); display:flex; align-items:center; gap:8px;}
.ca-panel-body{ padding:16px 18px; }

.ca-btn{
  display:inline-flex; align-items:center; gap:6px; border-radius:6px; border:1px solid transparent;
  padding:8px 14px; font-family:'Sarabun',sans-serif; font-weight:600; font-size:13.5px; cursor:pointer;
  transition:all .12s;
}
.ca-btn-primary{ background:var(--amber); color:var(--amber-ink); font-weight:700; }
.ca-btn-primary:hover{ background:var(--amber-dark); color:#fff; }
.ca-btn-outline{ background:transparent; border-color:var(--border); color:var(--navy); }
.ca-btn-outline:hover{ background:var(--panel-hover); border-color:var(--amber); }
.ca-btn-sm{ padding:5px 9px; font-size:12.5px; border-radius:5px; }

.ca-table{ width:100%; border-collapse:collapse; font-size:13.5px; }
.ca-table th{ text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:.05em; color:var(--muted); font-weight:600; padding:10px; border-bottom:1px solid var(--border); white-space:nowrap;}
.ca-table td{ padding:10px; border-bottom:1px solid var(--border); vertical-align:middle; color:var(--text); }
.ca-table tr:hover td{ background:var(--panel-hover); }
.ca-num{ font-family:'IBM Plex Mono',monospace; text-align:right; }
.ca-empty{ text-align:center; padding:34px 10px; color:var(--muted); }

.ca-badge{ display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:20px; font-size:11.5px; font-weight:600; }
.ca-badge.green{ background:var(--green-bg); color:var(--green); }
.ca-badge.red{ background:var(--red-bg); color:var(--red); }

.ca-field{ margin-bottom:13px; }
.ca-field label{ display:block; font-size:12px; font-weight:600; color:var(--navy); margin-bottom:5px; }
.ca-input, .ca-select{
  width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:6px;
  font-family:'Sarabun',sans-serif; font-size:13.5px; background:var(--paper); color:var(--text);
}
.ca-row{ display:flex; gap:10px; }
.ca-row > *{ flex:1; }

.ca-modal-backdrop{ position:fixed; inset:0; background:rgba(5,3,3,.6); display:flex; align-items:center; justify-content:center; padding:20px; z-index:50; }
.ca-modal{ background:var(--panel); border:1px solid var(--border); border-radius:10px; width:100%; max-width:540px; box-shadow:0 8px 24px rgba(0,0,0,.2); }
.ca-modal-head{ display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid var(--border); }
.ca-modal-title{ font-family:'Kanit',sans-serif; font-weight:600; font-size:17px; color:var(--navy); }
.ca-modal-body{ padding:20px; max-height:75vh; overflow-y:auto; }
.ca-modal-foot{ display:flex; justify-content:flex-end; gap:8px; padding:14px 20px; border-top:1px solid var(--border); }
`;

/* ---------------------------------------------------------------------- */
/* Helpers                                                                */
/* ---------------------------------------------------------------------- */

const fmtTHB = (n) => new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(Number(n) || 0);
const todayISO = () => new Date().toISOString().slice(0, 10);

function computeJobFinancials(job, txns = [], cashEntries = []) {
  const materialActual = txns
    .filter((t) => t.jobId === job.id && t.type === "issue")
    .reduce((s, t) => s + Number(t.qty) * Number(t.unitCost), 0);

  const linkedExpense = cashEntries
    .filter((e) => e.jobId === job.id && e.type === "expense")
    .reduce((s, e) => s + (Number(e.amount) || 0), 0);

  const totalBudget = Number(job.budget) || 0;
  const totalActual = materialActual + linkedExpense;
  const revenue = Number(job.revenue) || 0;
  const actualProfit = revenue - totalActual;
  const budgetProfit = revenue - totalBudget;

  return { materialActual, linkedExpense, totalBudget, totalActual, revenue, actualProfit, budgetProfit };
}

/* ---------------------------------------------------------------------- */
/* App Component with Cloud Sync                                          */
/* ---------------------------------------------------------------------- */

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Multi-device Cloud State
  const [stock, setStock] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [txns, setTxns] = useState([]);
  const [cashEntries, setCashEntries] = useState([]);

  const [modal, setModal] = useState(null);

  // Real-time Cloud Listeners (ซิงก์ตรงกันทุกอุปกรณ์ทันทีที่มีการเปลี่ยนแปลง)
  useEffect(() => {
    const unsubStock = onSnapshot(collection(db, "stock"), (snap) =>
      setStock(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    );
    const unsubQuotes = onSnapshot(collection(db, "quotes"), (snap) =>
      setQuotes(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    );
    const unsubJobs = onSnapshot(collection(db, "jobs"), (snap) =>
      setJobs(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    );
    const unsubTxns = onSnapshot(collection(db, "txns"), (snap) =>
      setTxns(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    );
    const unsubCash = onSnapshot(collection(db, "cashEntries"), (snap) =>
      setCashEntries(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    );

    return () => {
      unsubStock();
      unsubQuotes();
      unsubJobs();
      unsubTxns();
      unsubCash();
    };
  }, []);

  /* Handlers: Multi-device sync actions */
  const handleAddStockItem = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    await addDoc(collection(db, "stock"), {
      name: fd.get("name"),
      qty: Number(fd.get("qty")),
      unitCost: Number(fd.get("unitCost")),
      minQty: Number(fd.get("minQty")),
    });
    setModal(null);
  };

  const handleIssueStock = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const itemId = fd.get("itemId");
    const jobId = fd.get("jobId");
    const qty = Number(fd.get("qty"));

    const item = stock.find((s) => s.id === itemId);
    if (!item || item.qty < qty) return alert("สินค้าในคลังมีไม่พอให้เบิก!");

    // 1. ตัด Stock บน Cloud
    await updateDoc(doc(db, "stock", itemId), { qty: item.qty - qty });

    // 2. บันทึก Transaction บน Cloud
    await addDoc(collection(db, "txns"), {
      type: "issue",
      itemId,
      jobId,
      qty,
      unitCost: item.unitCost,
      date: todayISO(),
    });
    setModal(null);
  };

  const handleAddQuote = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    await addDoc(collection(db, "quotes"), {
      title: fd.get("title"),
      client: fd.get("client"),
      amount: Number(fd.get("amount")),
      costEstimate: Number(fd.get("costEstimate")),
      status: "pending",
    });
    setModal(null);
  };

  const convertQuoteToJob = async (q) => {
    await addDoc(collection(db, "jobs"), {
      name: q.title,
      client: q.client,
      revenue: q.amount,
      budget: q.costEstimate,
      status: "in_progress",
    });
    await updateDoc(doc(db, "quotes", q.id), { status: "approved" });
  };

  const handleAddCash = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    await addDoc(collection(db, "cashEntries"), {
      type: fd.get("type"),
      jobId: fd.get("jobId") || null,
      amount: Number(fd.get("amount")),
      note: fd.get("note"),
      date: todayISO(),
    });
    setModal(null);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="ca-root">
        <aside className="ca-sidebar">
          <div className="ca-brand">
            <div>
              <div className="ca-brand-name">FATERRA Cloud</div>
              <div className="ca-brand-sub">Multi-Device Live Sync</div>
            </div>
          </div>
          <nav className="ca-nav">
            <button className={`ca-nav-btn ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>
              <LayoutDashboard size={18} /> แดชบอร์ด
            </button>
            <button className={`ca-nav-btn ${activeTab === "stock" ? "active" : ""}`} onClick={() => setActiveTab("stock")}>
              <Boxes size={18} /> คลังพัสดุ
            </button>
            <button className={`ca-nav-btn ${activeTab === "quotes" ? "active" : ""}`} onClick={() => setActiveTab("quotes")}>
              <FileText size={18} /> ใบเสนอราคา
            </button>
            <button className={`ca-nav-btn ${activeTab === "jobs" ? "active" : ""}`} onClick={() => setActiveTab("jobs")}>
              <Briefcase size={18} /> ติดตามโครงการ
            </button>
            <button className={`ca-nav-btn ${activeTab === "cash" ? "active" : ""}`} onClick={() => setActiveTab("cash")}>
              <Wallet size={18} /> รายรับ-รายจ่าย
            </button>
          </nav>
        </aside>

        <main className="ca-main">
          {activeTab === "dashboard" && (
            <div>
              <div className="ca-titleblock">
                <div className="ca-tb-main">
                  <div className="ca-tb-eyebrow">Real-time Overview</div>
                  <div className="ca-tb-title">ระบบบริหารภาพรวม (ซิงก์ Cloud)</div>
                </div>
                <div className="ca-tb-fields">
                  <div className="ca-tb-field">
                    <div className="ca-tb-flabel">งานกำลังทำ</div>
                    <div className="ca-tb-fvalue">{jobs.filter((j) => j.status === "in_progress").length}</div>
                  </div>
                </div>
              </div>

              <div className="ca-cards">
                <div className="ca-card">
                  <div className="ca-card-label">มูลค่าสต๊อคในคลัง</div>
                  <div className="ca-card-value">{fmtTHB(stock.reduce((s, i) => s + i.qty * i.unitCost, 0))}</div>
                  <div className="ca-card-sub">{stock.length} รายการ</div>
                </div>
                <div className="ca-card warn">
                  <div className="ca-card-label">พัสดุใกล้หมด</div>
                  <div className="ca-card-value">{stock.filter((i) => i.qty <= i.minQty).length}</div>
                  <div className="ca-card-sub">ต่ำกว่าจุดสั่งซื้อ</div>
                </div>
                <div className="ca-card good">
                  <div className="ca-card-label">กำไรรวมโครงการ (ตามจริง)</div>
                  <div className="ca-card-value">
                    {fmtTHB(jobs.reduce((s, j) => s + computeJobFinancials(j, txns, cashEntries).actualProfit, 0))}
                  </div>
                  <div className="ca-card-sub">คำนวณตัดวัสดุ+ค่าใช้จ่ายจริง</div>
                </div>
              </div>

              <div className="ca-panel">
                <div className="ca-panel-head">
                  <div className="ca-panel-title"><TrendingUp size={18} /> เปรียบเทียบกำไรตามงบ vs กำไรจริง</div>
                </div>
                <div className="ca-panel-body" style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={jobs.map((j) => ({ name: j.name, ...computeJobFinancials(j, txns, cashEntries) }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(v) => fmtTHB(v)} />
                      <Legend />
                      <Bar dataKey="budgetProfit" name="กำไรตามงบ" fill="#AD8A32" />
                      <Bar dataKey="actualProfit" name="กำไรตามจริง" fill="#2E7D5B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === "stock" && (
            <div className="ca-panel">
              <div className="ca-panel-head">
                <div className="ca-panel-title"><Boxes size={18} /> รายการพัสดุในคลัง (Cloud Sync)</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="ca-btn ca-btn-outline" onClick={() => setModal("issueStock")}><ArrowUpFromLine size={16} /> เบิกวัสดุเข้างาน</button>
                  <button className="ca-btn ca-btn-primary" onClick={() => setModal("addStock")}><Plus size={16} /> เพิ่มพัสดุใหม่</button>
                </div>
              </div>
              <div className="ca-panel-body">
                <table className="ca-table">
                  <thead>
                    <tr>
                      <th>ชื่อรายการ</th>
                      <th className="ca-num">จำนวนคงเหลือ</th>
                      <th className="ca-num">ต้นทุน/หน่วย</th>
                      <th className="ca-num">มูลค่ารวม</th>
                      <th>สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stock.length === 0 ? (
                      <tr><td colSpan="5" className="ca-empty">ไม่มีรายการพัสดุ</td></tr>
                    ) : (
                      stock.map((item) => (
                        <tr key={item.id}>
                          <td><b>{item.name}</b></td>
                          <td className="ca-num">{item.qty}</td>
                          <td className="ca-num">{fmtTHB(item.unitCost)}</td>
                          <td className="ca-num">{fmtTHB(item.qty * item.unitCost)}</td>
                          <td>
                            {item.qty <= item.minQty ? (
                              <span className="ca-badge red">ต้องสั่งเพิ่ม</span>
                            ) : (
                              <span className="ca-badge green">ปกติ</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "quotes" && (
            <div className="ca-panel">
              <div className="ca-panel-head">
                <div className="ca-panel-title"><FileText size={18} /> ใบเสนอราคา</div>
                <button className="ca-btn ca-btn-primary" onClick={() => setModal("addQuote")}><Plus size={16} /> สร้างใบเสนอราคา</button>
              </div>
              <div className="ca-panel-body">
                <table className="ca-table">
                  <thead>
                    <tr>
                      <th>ชื่อโครงการ</th>
                      <th>ลูกค้า</th>
                      <th className="ca-num">ราคาเสนอ (รายรับ)</th>
                      <th className="ca-num">ประมาณการต้นทุน</th>
                      <th>จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotes.length === 0 ? (
                      <tr><td colSpan="5" className="ca-empty">ไม่มีใบเสนอราคา</td></tr>
                    ) : (
                      quotes.map((q) => (
                        <tr key={q.id}>
                          <td><b>{q.title}</b></td>
                          <td>{q.client}</td>
                          <td className="ca-num">{fmtTHB(q.amount)}</td>
                          <td className="ca-num">{fmtTHB(q.costEstimate)}</td>
                          <td>
                            {q.status === "approved" ? (
                              <span className="ca-badge green"><CheckCircle size={12} /> อนุมัติแล้ว</span>
                            ) : (
                              <button className="ca-btn ca-btn-sm ca-btn-outline" onClick={() => convertQuoteToJob(q)}>
                                อนุมัติ & เริ่มงาน
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "jobs" && (
            <div className="ca-panel">
              <div className="ca-panel-head">
                <div className="ca-panel-title"><Briefcase size={18} /> รายชื่อโครงการ & สรุปต้นทุนจริง</div>
              </div>
              <div className="ca-panel-body">
                <table className="ca-table">
                  <thead>
                    <tr>
                      <th>โครงการ</th>
                      <th className="ca-num">มูลค่างาน (รายรับ)</th>
                      <th className="ca-num">ต้นทุนวัสดุที่เบิก</th>
                      <th className="ca-num">ค่าใช้จ่ายอื่นๆ</th>
                      <th className="ca-num">กำไรตามจริง</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.length === 0 ? (
                      <tr><td colSpan="5" className="ca-empty">ยังไม่มีโครงการที่เริ่มทำงาน</td></tr>
                    ) : (
                      jobs.map((job) => {
                        const f = computeJobFinancials(job, txns, cashEntries);
                        return (
                          <tr key={job.id}>
                            <td>
                              <b>{job.name}</b>
                              <div style={{ fontSize: 11, color: "var(--muted)" }}>{job.client}</div>
                            </td>
                            <td className="ca-num">{fmtTHB(f.revenue)}</td>
                            <td className="ca-num">{fmtTHB(f.materialActual)}</td>
                            <td className="ca-num">{fmtTHB(f.linkedExpense)}</td>
                            <td className={`ca-num ${f.actualProfit >= 0 ? "ca-badge green" : "ca-badge red"}`}>
                              {fmtTHB(f.actualProfit)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "cash" && (
            <div className="ca-panel">
              <div className="ca-panel-head">
                <div className="ca-panel-title"><Wallet size={18} /> บันทึก รายรับ - รายจ่าย</div>
                <button className="ca-btn ca-btn-primary" onClick={() => setModal("addCash")}><Plus size={16} /> บันทึกรายการ</button>
              </div>
              <div className="ca-panel-body">
                <table className="ca-table">
                  <thead>
                    <tr>
                      <th>วันที่</th>
                      <th>ประเภท</th>
                      <th>เชื่อมโยงโครงการ</th>
                      <th>รายการ</th>
                      <th className="ca-num">จำนวนเงิน</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashEntries.length === 0 ? (
                      <tr><td colSpan="5" className="ca-empty">ไม่มีรายการบันทึกรายรับ-รายจ่าย</td></tr>
                    ) : (
                      cashEntries.map((c) => {
                        const job = jobs.find((j) => j.id === c.jobId);
                        return (
                          <tr key={c.id}>
                            <td>{c.date}</td>
                            <td>
                              <span className={`ca-badge ${c.type === "income" ? "green" : "red"}`}>
                                {c.type === "income" ? "รายรับ" : "รายจ่าย"}
                              </span>
                            </td>
                            <td>{job ? job.name : "-"}</td>
                            <td>{c.note}</td>
                            <td className="ca-num"><b>{fmtTHB(c.amount)}</b></td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODALS */}
      {modal === "addStock" && (
        <div className="ca-modal-backdrop">
          <form className="ca-modal" onSubmit={handleAddStockItem}>
            <div className="ca-modal-head">
              <div className="ca-modal-title">เพิ่มพัสดุใหม่</div>
              <button type="button" className="ca-btn" onClick={() => setModal(null)}><X size={16} /></button>
            </div>
            <div className="ca-modal-body">
              <div className="ca-field"><label>ชื่อวัสดุ/พัสดุ</label><input name="name" className="ca-input" required /></div>
              <div className="ca-row">
                <div className="ca-field"><label>จำนวนเริ่มต้น</label><input type="number" name="qty" className="ca-input" defaultValue="1" required /></div>
                <div className="ca-field"><label>ต้นทุน/หน่วย (บาท)</label><input type="number" name="unitCost" className="ca-input" defaultValue="0" required /></div>
              </div>
              <div className="ca-field"><label>จุดเตือนซื้อเติม (Min Qty)</label><input type="number" name="minQty" className="ca-input" defaultValue="5" required /></div>
            </div>
            <div className="ca-modal-foot">
              <button type="submit" className="ca-btn ca-btn-primary">บันทึกเข้า Cloud</button>
            </div>
          </form>
        </div>
      )}

      {modal === "issueStock" && (
        <div className="ca-modal-backdrop">
          <form className="ca-modal" onSubmit={handleIssueStock}>
            <div className="ca-modal-head">
              <div className="ca-modal-title">เบิกพัสดุเข้าโครงการ</div>
              <button type="button" className="ca-btn" onClick={() => setModal(null)}><X size={16} /></button>
            </div>
            <div className="ca-modal-body">
              <div className="ca-field">
                <label>เลือกรายการพัสดุ</label>
                <select name="itemId" className="ca-select" required>
                  {stock.map((s) => <option key={s.id} value={s.id}>{s.name} (คงเหลือ: {s.qty})</option>)}
                </select>
              </div>
              <div className="ca-field">
                <label>เลือกโครงการที่เบิกไปใช้</label>
                <select name="jobId" className="ca-select" required>
                  {jobs.map((j) => <option key={j.id} value={j.id}>{j.name}</option>)}
                </select>
              </div>
              <div className="ca-field"><label>จำนวนที่เบิก</label><input type="number" name="qty" className="ca-input" defaultValue="1" min="1" required /></div>
            </div>
            <div className="ca-modal-foot">
              <button type="submit" className="ca-btn ca-btn-primary">ยืนยันการเบิก</button>
            </div>
          </form>
        </div>
      )}

      {modal === "addQuote" && (
        <div className="ca-modal-backdrop">
          <form className="ca-modal" onSubmit={handleAddQuote}>
            <div className="ca-modal-head">
              <div className="ca-modal-title">สร้างใบเสนอราคา</div>
              <button type="button" className="ca-btn" onClick={() => setModal(null)}><X size={16} /></button>
            </div>
            <div className="ca-modal-body">
              <div className="ca-field"><label>ชื่อโครงการ</label><input name="title" className="ca-input" required /></div>
              <div className="ca-field"><label>ชื่อลูกค้า</label><input name="client" className="ca-input" required /></div>
              <div className="ca-row">
                <div className="ca-field"><label>ราคาเสนอ (รายรับ)</label><input type="number" name="amount" className="ca-input" defaultValue="0" required /></div>
                <div className="ca-field"><label>ประมาณการต้นทุน</label><input type="number" name="costEstimate" className="ca-input" defaultValue="0" required /></div>
              </div>
            </div>
            <div className="ca-modal-foot">
              <button type="submit" className="ca-btn ca-btn-primary">บันทึกเข้า Cloud</button>
            </div>
          </form>
        </div>
      )}

      {modal === "addCash" && (
        <div className="ca-modal-backdrop">
          <form className="ca-modal" onSubmit={handleAddCash}>
            <div className="ca-modal-head">
              <div className="ca-modal-title">บันทึก รายรับ-รายจ่าย</div>
              <button type="button" className="ca-btn" onClick={() => setModal(null)}><X size={16} /></button>
            </div>
            <div className="ca-modal-body">
              <div className="ca-field">
                <label>ประเภท</label>
                <select name="type" className="ca-select">
                  <option value="expense">รายจ่าย (Expense)</option>
                  <option value="income">รายรับ (Income)</option>
                </select>
              </div>
              <div className="ca-field">
                <label>เชื่อมโยงกับโครงการ (ถ้ามี)</label>
                <select name="jobId" className="ca-select">
                  <option value="">-- ไม่ระบุโครงการ (ส่วนกลาง) --</option>
                  {jobs.map((j) => <option key={j.id} value={j.id}>{j.name}</option>)}
                </select>
              </div>
              <div className="ca-field"><label>รายละเอียด</label><input name="note" className="ca-input" required /></div>
              <div className="ca-field"><label>จำนวนเงิน (บาท)</label><input type="number" name="amount" className="ca-input" required /></div>
            </div>
            <div className="ca-modal-foot">
              <button type="submit" className="ca-btn ca-btn-primary">บันทึกเข้า Cloud</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
