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
  Wallet,
  Plus,
  X,
  ArrowUpFromLine,
  TrendingUp,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

/* ---------------------------------------------------------------------- */
/* CSS Styles                                                             */
/* ---------------------------------------------------------------------- */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700&family=Sarabun:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

:root {
  --black: #0F0D0B;
  --navy: #1C2126;
  --navy-soft: #241C17;
  --navy-line: #2C2119;
  --paper: #F5F3EE;
  --panel: #FFFFFF;
  --border: #E5E0D8;
  --amber: #C59B27;
  --amber-dark: #A37F1E;
  --amber-ink: #1A1508;
  --green: #237A57;
  --green-bg: rgba(35,122,87,0.08);
  --red: #B3261E;
  --red-bg: rgba(179,38,30,0.08);
  --text: #22262B;
  --muted: #78746D;
  --panel-hover: #F9F8F6;
}

.ca-root {
  font-family: 'Sarabun', sans-serif;
  color: var(--text);
  background: var(--paper);
  min-height: 100vh;
  width: 100%;
  display: flex;
  font-size: 14px;
}
.ca-root * { box-sizing: border-box; }

.ca-sidebar {
  width: 230px; flex-shrink: 0; background: var(--black);
  color: #fff; display: flex; flex-direction: column;
  padding: 20px 14px; min-height: 100vh;
}
.ca-brand { display: flex; align-items: center; gap: 10px; padding: 0 8px 20px; margin-bottom: 10px; }
.ca-brand-logo { width: 28px; height: 28px; background: var(--amber); clip-path: polygon(50% 0%, 100% 100%, 0% 100%); }
.ca-brand-name { font-family: 'Kanit', sans-serif; font-weight: 700; font-size: 16px; color: #fff; letter-spacing: 0.05em; }
.ca-brand-sub { font-size: 10px; color: #8A857C; line-height: 1.2; }

.ca-nav { display: flex; flex-direction: column; gap: 6px; }
.ca-nav-btn {
  display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 8px;
  background: transparent; border: none; color: #A09B93; cursor: pointer; text-align: left;
  font-family: 'Sarabun', sans-serif; font-size: 14px; font-weight: 500; transition: all 0.15s;
}
.ca-nav-btn:hover { background: #1A1714; color: #fff; }
.ca-nav-btn.active { background: var(--amber); color: var(--amber-ink); font-weight: 700; }

.ca-main { flex: 1; min-width: 0; padding: 24px 32px 60px; }

.ca-titleblock {
  background: var(--panel); border: 1px solid var(--border); border-radius: 6px;
  display: flex; align-items: stretch; margin-bottom: 20px;
}
.ca-tb-main { flex: 1; padding: 16px 20px; border-right: 1px solid var(--border); }
.ca-tb-eyebrow { font-size: 11px; color: var(--muted); font-weight: 600; margin-bottom: 4px; }
.ca-tb-title { font-family: 'Kanit', sans-serif; font-size: 22px; font-weight: 600; color: var(--navy); }
.ca-tb-fields { display: flex; }
.ca-tb-field { padding: 12px 20px; border-right: 1px solid var(--border); min-width: 110px; }
.ca-tb-field:last-child { border-right: none; }
.ca-tb-flabel { font-size: 10px; color: var(--muted); margin-bottom: 4px; }
.ca-tb-fvalue { font-family: 'Kanit', sans-serif; font-size: 15px; font-weight: 600; color: var(--navy); }
.ca-tb-fvalue.gold { color: var(--amber); }

.ca-cards { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-bottom: 20px; }
.ca-card { background: var(--panel); border: 1px solid var(--border); border-radius: 8px; padding: 16px; }
.ca-card-label { font-size: 12px; color: var(--muted); font-weight: 500; margin-bottom: 8px; }
.ca-card-value { font-family: 'Kanit', sans-serif; font-size: 22px; font-weight: 600; color: var(--navy); }
.ca-card-value.green { color: var(--green); }
.ca-card-sub { font-size: 11.5px; color: var(--muted); margin-top: 6px; }

.ca-panel { background: var(--panel); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 20px; }
.ca-panel-head { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); }
.ca-panel-title { font-family: 'Kanit', sans-serif; font-weight: 600; font-size: 16px; color: var(--navy); display: flex; align-items: center; gap: 8px; }
.ca-panel-body { padding: 20px; }

.ca-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

.ca-btn {
  display: inline-flex; align-items: center; gap: 6px; border-radius: 6px; border: 1px solid transparent;
  padding: 8px 14px; font-family: 'Sarabun', sans-serif; font-weight: 600; font-size: 13px; cursor: pointer;
}
.ca-btn-primary { background: var(--amber); color: var(--amber-ink); }
.ca-btn-outline { background: transparent; border-color: var(--border); color: var(--navy); }
.ca-btn-sm { padding: 4px 10px; font-size: 12px; border-radius: 4px; }

.ca-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.ca-table th { text-align: left; font-size: 11px; color: var(--muted); font-weight: 600; padding: 10px; border-bottom: 1px solid var(--border); }
.ca-table td { padding: 12px 10px; border-bottom: 1px solid var(--border); vertical-align: middle; }
.ca-num { font-family: 'IBM Plex Mono', monospace; text-align: right; }
.ca-empty { text-align: center; padding: 30px; color: var(--muted); }

.ca-badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
.ca-badge.green { background: var(--green-bg); color: var(--green); }
.ca-badge.red { background: var(--red-bg); color: var(--red); }

.ca-field { margin-bottom: 14px; }
.ca-field label { display: block; font-size: 12px; font-weight: 600; color: var(--navy); margin-bottom: 6px; }
.ca-input, .ca-select { width: 100%; padding: 8px 12px; border: 1px solid var(--border); border-radius: 6px; font-family: 'Sarabun', sans-serif; font-size: 13.5px; }
.ca-row { display: flex; gap: 12px; }
.ca-row > * { flex: 1; }

.ca-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 50; }
.ca-modal { background: var(--panel); border-radius: 8px; width: 100%; max-width: 500px; }
.ca-modal-head { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); }
.ca-modal-title { font-family: 'Kanit', sans-serif; font-weight: 600; font-size: 16px; }
.ca-modal-body { padding: 20px; }
.ca-modal-foot { display: flex; justify-content: flex-end; gap: 10px; padding: 14px 20px; border-top: 1px solid var(--border); }
`;

/* ---------------------------------------------------------------------- */
/* Helpers                                                                */
/* ---------------------------------------------------------------------- */

const fmtTHB = (n) =>
  new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(Number(n) || 0);

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
/* App Component                                                          */
/* ---------------------------------------------------------------------- */

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Real-time Cloud States
  const [stock, setStock] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [txns, setTxns] = useState([]);
  const [cashEntries, setCashEntries] = useState([]);
  const [tools, setTools] = useState([]);

  const [modal, setModal] = useState(null);

  // Sync Firebase Real-time
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
    const unsubTools = onSnapshot(collection(db, "tools"), (snap) =>
      setTools(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    );

    return () => {
      unsubStock();
      unsubQuotes();
      unsubJobs();
      unsubTxns();
      unsubCash();
      unsubTools();
    };
  }, []);

  /* Multi-device Firebase Handlers */
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

    await updateDoc(doc(db, "stock", itemId), { qty: item.qty - qty });
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

  // Calculations for Original Cards
  const totalStockValue = stock.reduce((s, i) => s + i.qty * i.unitCost, 0);
  const lowStockCount = stock.filter((i) => i.qty <= i.minQty).length;
  const activeJobsCount = jobs.filter((j) => j.status === "in_progress").length;
  const totalActualProfit = jobs.reduce(
    (s, j) => s + computeJobFinancials(j, txns, cashEntries).actualProfit,
    0
  );
  const issuedToolsCount = tools.filter((t) => t.status === "issued").length;

  return (
    <>
      <style>{CSS}</style>
      <div className="ca-root">
        {/* Sidebar */}
        <aside className="ca-sidebar">
          <div className="ca-brand">
            <div className="ca-brand-logo" />
            <div>
              <div className="ca-brand-name">FATERRA</div>
              <div className="ca-brand-sub">Building a Greater Tomorrow</div>
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
              <Briefcase size={18} /> งาน & กำไรขาดทุน
            </button>
            <button className={`ca-nav-btn ${activeTab === "cash" ? "active" : ""}`} onClick={() => setActiveTab("cash")}>
              <Wallet size={18} /> รายรับ-รายจ่าย
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="ca-main">
          {activeTab === "dashboard" && (
            <div>
              {/* Header Title Block */}
              <div className="ca-titleblock">
                <div className="ca-tb-main">
                  <div className="ca-tb-eyebrow">ภาพรวมกิจการ</div>
                  <div className="ca-tb-title">แดชบอร์ด</div>
                </div>
                <div className="ca-tb-fields">
                  <div className="ca-tb-field">
                    <div className="ca-tb-flabel">วันที่</div>
                    <div className="ca-tb-fvalue">16 ก.ย. 69</div>
                  </div>
                  <div className="ca-tb-field">
                    <div className="ca-tb-flabel">งานที่ดำเนินการ</div>
                    <div className="ca-tb-fvalue">{activeJobsCount}</div>
                  </div>
                  <div className="ca-tb-field">
                    <div className="ca-tb-flabel">สถานะ</div>
                    <div className="ca-tb-fvalue gold">ปกติ</div>
                  </div>
                </div>
              </div>

              {/* Top 5 Cards */}
              <div className="ca-cards">
                <div className="ca-card">
                  <div className="ca-card-label">มูลค่าสต๊อคคงเหลือ</div>
                  <div className="ca-card-value">{fmtTHB(totalStockValue)}</div>
                  <div className="ca-card-sub">{stock.length} รายการวัสดุ</div>
                </div>
                <div className="ca-card">
                  <div className="ca-card-label">วัสดุใกล้หมด</div>
                  <div className="ca-card-value">{lowStockCount}</div>
                  <div className="ca-card-sub">รายการต่ำกว่าจุดสั่งซื้อ</div>
                </div>
                <div className="ca-card">
                  <div className="ca-card-label">งานที่กำลังดำเนินการ</div>
                  <div className="ca-card-value">{activeJobsCount}</div>
                  <div className="ca-card-sub">จากทั้งหมด {jobs.length} งาน</div>
                </div>
                <div className="ca-card">
                  <div className="ca-card-label">กำไรรวม (ตามจริง)</div>
                  <div className="ca-card-value green">{fmtTHB(totalActualProfit)}</div>
                  <div className="ca-card-sub">ทุกงานสะสม</div>
                </div>
                <div className="ca-card">
                  <div className="ca-card-label">เครื่องมือเบิกใช้งานอยู่</div>
                  <div className="ca-card-value">{issuedToolsCount}</div>
                  <div className="ca-card-sub">จากทั้งหมด {tools.length || 32} รายการ</div>
                </div>
              </div>

              {/* Chart Panel */}
              <div className="ca-panel">
                <div className="ca-panel-head">
                  <div className="ca-panel-title">
                    <TrendingUp size={18} /> กำไร-ขาดทุนรายงาน (ตามงบ vs ตามจริง)
                  </div>
                </div>
                <div className="ca-panel-body" style={{ height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={jobs.map((j) => ({ name: j.name, ...computeJobFinancials(j, txns, cashEntries) }))}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(v) => fmtTHB(v)} />
                      <Bar dataKey="budgetProfit" name="กำไรตามงบ" fill="#C2B8A3" />
                      <Bar dataKey="actualProfit" name="กำไรจริง" fill="#237A57" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bottom Grid */}
              <div className="ca-grid-2">
                <div className="ca-panel">
                  <div className="ca-panel-head">
                    <div className="ca-panel-title"><AlertTriangle size={16} /> วัสดุใกล้หมด</div>
                    <button className="ca-btn ca-btn-outline ca-btn-sm" onClick={() => setActiveTab("stock")}>
                      ไปที่คลังสินค้า <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="ca-panel-body">
                    {stock.filter((i) => i.qty <= i.minQty).length === 0 ? (
                      <div className="ca-empty">ไม่มีวัสดุใกล้หมด</div>
                    ) : (
                      <table className="ca-table">
                        <thead>
                          <tr>
                            <th>รายการ</th>
                            <th className="ca-num">คงเหลือ</th>
                            <th>สถานะ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stock
                            .filter((i) => i.qty <= i.minQty)
                            .map((item) => (
                              <tr key={item.id}>
                                <td><b>{item.name}</b></td>
                                <td className="ca-num">{item.qty}</td>
                                <td><span className="ca-badge red">ต้องสั่งเพิ่ม</span></td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                <div className="ca-panel">
                  <div className="ca-panel-head">
                    <div className="ca-panel-title"><FileText size={16} /> ใบเสนอราคาที่ยังไม่ปิดงาน</div>
                    <button className="ca-btn ca-btn-outline ca-btn-sm" onClick={() => setActiveTab("quotes")}>
                      ไปที่ใบเสนอราคา <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="ca-panel-body">
                    {quotes.filter((q) => q.status === "pending").length === 0 ? (
                      <div className="ca-empty">ไม่มีใบเสนอราคาค้างอยู่</div>
                    ) : (
                      <table className="ca-table">
                        <thead>
                          <tr>
                            <th>โครงการ</th>
                            <th>ลูกค้า</th>
                            <th className="ca-num">ยอดรวม</th>
                            <th>สถานะ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quotes
                            .filter((q) => q.status === "pending")
                            .map((q) => (
                              <tr key={q.id}>
                                <td><b>{q.title}</b></td>
                                <td>{q.client}</td>
                                <td className="ca-num">{fmtTHB(q.amount)}</td>
                                <td><span className="ca-badge red">รอยืนยัน</span></td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "stock" && (
            <div className="ca-panel">
              <div className="ca-panel-head">
                <div className="ca-panel-title"><Boxes size={18} /> รายการพัสดุในคลัง</div>
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
                      <th className="ca-num">ราคาเสนอ</th>
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
                              <span className="ca-badge green">อนุมัติแล้ว</span>
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
                <div className="ca-panel-title"><Briefcase size={18} /> งาน & กำไรขาดทุน</div>
              </div>
              <div className="ca-panel-body">
                <table className="ca-table">
                  <thead>
                    <tr>
                      <th>โครงการ</th>
                      <th className="ca-num">มูลค่างาน</th>
                      <th className="ca-num">ต้นทุนวัสดุ</th>
                      <th className="ca-num">ค่าใช้จ่ายอื่น</th>
                      <th className="ca-num">กำไรตามจริง</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.length === 0 ? (
                      <tr><td colSpan="5" className="ca-empty">ไม่มีโครงการที่เริ่มทำงาน</td></tr>
                    ) : (
                      jobs.map((job) => {
                        const f = computeJobFinancials(job, txns, cashEntries);
                        return (
                          <tr key={job.id}>
                            <td><b>{job.name}</b><div style={{ fontSize: 11, color: "var(--muted)" }}>{job.client}</div></td>
                            <td className="ca-num">{fmtTHB(f.revenue)}</td>
                            <td className="ca-num">{fmtTHB(f.materialActual)}</td>
                            <td className="ca-num">{fmtTHB(f.linkedExpense)}</td>
                            <td className={`ca-num ${f.actualProfit >= 0 ? "ca-badge green" : "ca-badge red"}`}>{fmtTHB(f.actualProfit)}</td>
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
                <div className="ca-panel-title"><Wallet size={18} /> รายรับ-รายจ่าย</div>
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
                      <tr><td colSpan="5" className="ca-empty">ไม่มีรายการบันทึก</td></tr>
                    ) : (
                      cashEntries.map((c) => {
                        const job = jobs.find((j) => j.id === c.jobId);
                        return (
                          <tr key={c.id}>
                            <td>{c.date}</td>
                            <td><span className={`ca-badge ${c.type === "income" ? "green" : "red"}`}>{c.type === "income" ? "รายรับ" : "รายจ่าย"}</span></td>
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

      {/* Modals */}
      {modal === "addStock" && (
        <div className="ca-modal-backdrop">
          <form className="ca-modal" onSubmit={handleAddStockItem}>
            <div className="ca-modal-head">
              <div className="ca-modal-title">เพิ่มพัสดุใหม่</div>
              <button type="button" className="ca-btn" onClick={() => setModal(null)}><X size={16} /></button>
            </div>
            <div className="ca-modal-body">
              <div className="ca-field"><label>ชื่อวัสดุ</label><input name="name" className="ca-input" required /></div>
              <div className="ca-row">
                <div className="ca-field"><label>จำนวน</label><input type="number" name="qty" className="ca-input" defaultValue="1" required /></div>
                <div className="ca-field"><label>ต้นทุน/หน่วย</label><input type="number" name="unitCost" className="ca-input" defaultValue="0" required /></div>
              </div>
              <div className="ca-field"><label>จุดเตือนซื้อเพิ่ม (Min Qty)</label><input type="number" name="minQty" className="ca-input" defaultValue="5" required /></div>
            </div>
            <div className="ca-modal-foot">
              <button type="submit" className="ca-btn ca-btn-primary">บันทึก</button>
            </div>
          </form>
        </div>
      )}

      {modal === "issueStock" && (
        <div className="ca-modal-backdrop">
          <form className="ca-modal" onSubmit={handleIssueStock}>
            <div className="ca-modal-head">
              <div className="ca-modal-title">เบิกวัสดุเข้างาน</div>
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
                <label>เลือกโครงการ</label>
                <select name="jobId" className="ca-select" required>
                  {jobs.map((j) => <option key={j.id} value={j.id}>{j.name}</option>)}
                </select>
              </div>
              <div className="ca-field"><label>จำนวนเบิก</label><input type="number" name="qty" className="ca-input" defaultValue="1" min="1" required /></div>
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
                <div className="ca-field"><label>ราคาเสนอ</label><input type="number" name="amount" className="ca-input" defaultValue="0" required /></div>
                <div className="ca-field"><label>ประมาณการต้นทุน</label><input type="number" name="costEstimate" className="ca-input" defaultValue="0" required /></div>
              </div>
            </div>
            <div className="ca-modal-foot">
              <button type="submit" className="ca-btn ca-btn-primary">บันทึก</button>
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
                  <option value="">-- ไม่ระบุโครงการ --</option>
                  {jobs.map((j) => <option key={j.id} value={j.id}>{j.name}</option>)}
                </select>
              </div>
              <div className="ca-field"><label>รายการ</label><input name="note" className="ca-input" required /></div>
              <div className="ca-field"><label>จำนวนเงิน</label><input type="number" name="amount" className="ca-input" required /></div>
            </div>
            <div className="ca-modal-foot">
              <button type="submit" className="ca-btn ca-btn-primary">บันทึก</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
