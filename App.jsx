import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  LayoutDashboard,
  Boxes,
  FileText,
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  X,
  ArrowDownToLine,
  ArrowUpFromLine,
  AlertTriangle,
  Printer,
  TrendingUp,
  TrendingDown,
  Search,
  ChevronRight,
  Check,
  Loader2,
  ClipboardList,
  Wrench,
  Camera,
  Image as ImageIcon,
  PackageCheck,
  Settings,
  Link2,
  Wallet,
  Receipt,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

/* ---------------------------------------------------------------------- */
/* Design tokens & global styles                                          */
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
  min-height:100%;
  width:100%;
  display:flex;
  font-size:14px;
  line-height:1.5;
}
.ca-root *{ box-sizing:border-box; }
.ca-display{ font-family:'Kanit',sans-serif; letter-spacing:.01em; }
.ca-mono{ font-family:'IBM Plex Mono',monospace; }

/* ---- sidebar ---- */
.ca-sidebar{
  width:216px; flex-shrink:0; background:var(--black);
  color:#fff; display:flex; flex-direction:column;
  padding:20px 14px;
  min-height:100vh;
  border-right:1px solid var(--navy-line);
}
.ca-brand{ display:flex; align-items:center; gap:9px; padding:0 6px 18px; border-bottom:1px solid var(--navy-line); margin-bottom:14px;}
.ca-brand-mark{ width:32px; height:32px; object-fit:contain; flex-shrink:0;}
.ca-brand-name{ font-family:'Kanit',sans-serif; font-weight:600; font-size:15px; line-height:1.2; color:#fff;}
.ca-brand-sub{ font-size:10.5px; color:#8A7370; letter-spacing:.06em;}
.ca-nav{ display:flex; flex-direction:column; gap:3px; }
.ca-nav-btn{
  display:flex; align-items:center; gap:10px; padding:9px 10px; border-radius:7px;
  background:transparent; border:none; color:#C7B4B1; cursor:pointer; text-align:left;
  font-family:'Sarabun',sans-serif; font-size:14px; font-weight:500; transition:background .12s, color .12s;
}
.ca-nav-btn:hover{ background:var(--navy-soft); color:#fff; }
.ca-nav-btn.active{ background:var(--amber); color:var(--amber-ink); font-weight:600; }
.ca-nav-spacer{ flex:1; }
.ca-nav-foot{ font-size:10.5px; color:#6B5754; padding:10px 6px 0; border-top:1px solid var(--navy-line); margin-top:8px;}

/* ---- main ---- */
.ca-main{ flex:1; min-width:0; padding:26px 32px 60px; }

/* title block - signature element, echoes an architectural drawing title block */
.ca-titleblock{
  background:var(--panel); border:1px solid var(--border); border-radius:2px;
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

/* ---- cards / grid ---- */
.ca-cards{ display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:22px; }
.ca-card{ background:var(--panel); border:1px solid var(--border); border-radius:8px; padding:15px 16px; }
.ca-card-label{ font-size:11.5px; color:var(--muted); font-weight:600; text-transform:uppercase; letter-spacing:.05em; margin-bottom:8px;}
.ca-card-value{ font-family:'IBM Plex Mono',monospace; font-size:22px; font-weight:600; color:var(--navy); }
.ca-card-sub{ font-size:12px; color:var(--muted); margin-top:4px; }
.ca-card.warn{ border-color:rgba(173,138,50,.5); }
.ca-card.warn .ca-card-value{ color:var(--amber); }
.ca-card.bad{ border-color:rgba(255,93,93,.35); }
.ca-card.bad .ca-card-value{ color:var(--red); }
.ca-card.good{ border-color:rgba(52,199,123,.35); }
.ca-card.good .ca-card-value{ color:var(--green); }

.ca-panel{ background:var(--panel); border:1px solid var(--border); border-radius:8px; margin-bottom:20px; }
.ca-panel-head{ display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-bottom:1px solid var(--border); }
.ca-panel-title{ font-family:'Kanit',sans-serif; font-weight:600; font-size:15.5px; color:var(--navy); display:flex; align-items:center; gap:8px;}
.ca-panel-body{ padding:16px 18px; }

/* ---- buttons ---- */
.ca-btn{
  display:inline-flex; align-items:center; gap:6px; border-radius:6px; border:1px solid transparent;
  padding:8px 14px; font-family:'Sarabun',sans-serif; font-weight:600; font-size:13.5px; cursor:pointer;
  transition:filter .12s, background .12s;
}
.ca-btn:active{ filter:brightness(.94); }
.ca-btn-primary{ background:var(--amber); color:var(--amber-ink); font-weight:700; }
.ca-btn-primary:hover{ background:var(--amber-dark); }
.ca-btn-outline{ background:transparent; border-color:var(--border); color:var(--navy); }
.ca-btn-outline:hover{ background:var(--panel-hover); border-color:var(--amber); }
.ca-btn-ghost{ background:transparent; color:var(--muted); border:none; padding:6px 8px; }
.ca-btn-ghost:hover{ color:var(--navy); background:var(--panel-hover); }
.ca-btn-danger{ background:transparent; color:var(--red); border:1px solid var(--red-bg); }
.ca-btn-danger:hover{ background:var(--red-bg); }
.ca-btn-sm{ padding:5px 9px; font-size:12.5px; border-radius:5px; }
.ca-icon-btn{ background:transparent; border:none; cursor:pointer; color:var(--muted); padding:5px; border-radius:5px; display:inline-flex;}
.ca-icon-btn:hover{ background:var(--panel-hover); color:var(--navy); }

/* ---- tables ---- */
.ca-table{ width:100%; border-collapse:collapse; font-size:13.5px; }
.ca-table th{ text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:.05em; color:var(--muted); font-weight:600; padding:8px 10px; border-bottom:1px solid var(--border); white-space:nowrap;}
.ca-table td{ padding:10px 10px; border-bottom:1px solid var(--navy-line); vertical-align:middle; color:var(--text); }
.ca-table tr:last-child td{ border-bottom:none; }
.ca-table tbody tr:hover{ background:var(--panel-hover); }
.ca-num{ font-family:'IBM Plex Mono',monospace; text-align:right; }
.ca-empty{ text-align:center; padding:34px 10px; color:var(--muted); }
.ca-empty svg{ opacity:.4; margin-bottom:8px; }

/* ---- badges ---- */
.ca-badge{ display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:20px; font-size:11.5px; font-weight:600; }
.ca-badge.grey{ background:rgba(34,38,43,.06); color:var(--muted); }
.ca-badge.amber{ background:rgba(173,138,50,.14); color:#8C6F24; }
.ca-badge.green{ background:var(--green-bg); color:var(--green); }
.ca-badge.red{ background:var(--red-bg); color:var(--red); }
.ca-badge.navy{ background:rgba(34,38,43,.08); color:var(--navy); }

/* ---- forms ---- */
.ca-field{ margin-bottom:13px; }
.ca-field label{ display:block; font-size:12px; font-weight:600; color:var(--navy); margin-bottom:5px; }
.ca-input, .ca-select, textarea.ca-input{
  width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:6px;
  font-family:'Sarabun',sans-serif; font-size:13.5px; background:var(--paper); color:var(--text);
}
.ca-input:focus, .ca-select:focus, textarea.ca-input:focus{ outline:2px solid var(--amber); outline-offset:0; border-color:var(--amber); }
.ca-row{ display:flex; gap:10px; }
.ca-row > *{ flex:1; }

/* ---- modal ---- */
.ca-modal-backdrop{ position:fixed; inset:0; background:rgba(5,3,3,.72); display:flex; align-items:flex-start; justify-content:center; padding:40px 16px; z-index:50; overflow-y:auto; }
.ca-modal{ background:var(--panel); border:1px solid var(--border); border-radius:10px; width:100%; max-width:640px; box-shadow:0 8px 24px rgba(0,0,0,.4); }
.ca-modal.wide{ max-width:840px; }
.ca-modal-head{ display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid var(--border); }
.ca-modal-title{ font-family:'Kanit',sans-serif; font-weight:600; font-size:17px; color:var(--navy); }
.ca-modal-body{ padding:20px; max-height:70vh; overflow-y:auto; }
.ca-modal-foot{ display:flex; justify-content:flex-end; gap:8px; padding:14px 20px; border-top:1px solid var(--border); }

/* ---- misc ---- */
.ca-toolbar{ display:flex; align-items:center; gap:10px; margin-bottom:14px; }
.ca-search{ position:relative; flex:1; max-width:280px; }
.ca-search svg{ position:absolute; left:9px; top:50%; transform:translateY(-50%); color:var(--muted); }
.ca-search input{ padding-left:30px; }
.ca-tabs{ display:flex; gap:4px; border-bottom:1px solid var(--border); margin-bottom:16px; }
.ca-tab{ padding:8px 4px; margin-bottom:-1px; border-bottom:2px solid transparent; background:none; border-top:none; border-left:none; border-right:none; font-family:'Sarabun',sans-serif; font-weight:600; font-size:13.5px; color:var(--muted); cursor:pointer; }
.ca-tab.active{ color:var(--navy); border-bottom-color:var(--amber); }
.ca-inline-confirm{ display:flex; align-items:center; gap:4px; font-size:12px; }
.ca-loading{ display:flex; align-items:center; justify-content:center; gap:8px; padding:80px 0; color:var(--muted); }
.ca-divider{ height:1px; background:var(--border); margin:16px 0; }
.ca-hint{ font-size:12px; color:var(--muted); margin-top:4px; }
.ca-line-remove{ color:var(--muted); background:none; border:none; cursor:pointer; }
.ca-line-remove:hover{ color:var(--red); }
.ca-totals{ margin-left:auto; width:260px; }
.ca-totals-row{ display:flex; justify-content:space-between; padding:4px 0; font-size:13.5px; }
.ca-totals-row.grand{ font-weight:700; font-size:16px; border-top:1px solid var(--border); margin-top:6px; padding-top:8px; color:var(--amber); }

/* ---- photos ---- */
.ca-photo-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(112px,1fr)); gap:8px; }
.ca-photo-thumb{ position:relative; border-radius:7px; overflow:hidden; border:1px solid var(--border); aspect-ratio:1/1; background:var(--panel-hover); }
.ca-photo-thumb img{ width:100%; height:100%; object-fit:cover; cursor:pointer; display:block; }
.ca-photo-remove{ position:absolute; top:3px; right:3px; background:rgba(11,9,8,.78); border:none; color:#fff; border-radius:5px; padding:3px; cursor:pointer; display:flex; }
.ca-photo-remove:hover{ background:var(--red); }
.ca-photo-add{ display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; border:1.5px dashed var(--border); border-radius:7px; aspect-ratio:1/1; background:transparent; color:var(--muted); cursor:pointer; font-size:11.5px; }
.ca-photo-add:hover{ border-color:var(--amber); color:var(--amber-dark); background:rgba(173,138,50,.08); }
.ca-lightbox{ position:fixed; inset:0; background:rgba(5,3,3,.92); z-index:70; display:flex; align-items:center; justify-content:center; padding:34px; cursor:zoom-out; }
.ca-lightbox img{ max-width:100%; max-height:100%; border-radius:8px; box-shadow:0 10px 40px rgba(0,0,0,.6); }

.ca-file-input{ font-family:'Sarabun',sans-serif; font-size:12.5px; color:var(--muted); }
.ca-file-input::file-selector-button{
  font-family:'Sarabun',sans-serif; font-weight:600; font-size:13px; color:var(--amber-ink);
  background:var(--amber); border:none; border-radius:6px; padding:8px 14px; margin-right:10px; cursor:pointer;
}
.ca-file-input::file-selector-button:hover{ background:var(--amber-dark); }
.ca-upload-error{ font-size:12px; color:var(--red); margin-top:6px; }

/* ---- print / PDF output ---- */
.ca-print-hint{ font-size:11.5px; color:var(--muted); display:flex; align-items:center; gap:5px; margin-right:auto; }
@media print{
  @page{ size:A4; margin:14mm; }
  html, body{ background:#fff !important; }
  .ca-sidebar, .ca-no-print{ display:none !important; }
  .ca-main{ padding:0; }
  .ca-modal-backdrop{ position:static !important; background:none !important; padding:0 !important; display:block !important; overflow:visible !important; }
  .ca-modal{ box-shadow:none !important; max-width:none !important; width:100% !important; border-radius:0 !important; background:#fff !important; }
  .ca-modal-head, .ca-modal-foot{ display:none !important; }
  .ca-modal-body{ max-height:none !important; overflow:visible !important; padding:0 !important; color:#111 !important; }
  .ca-modal-body *{ color:#111 !important; border-color:#ccc !important; }
  .ca-table{ font-size:12.5px; }
  .ca-table thead{ display:table-header-group; }
  .ca-table tr{ break-inside:avoid; }
}
`;

/* ---------------------------------------------------------------------- */
/* Helpers                                                                 */
/* ---------------------------------------------------------------------- */

// Embedded FATERRA brand mark (small WebP, no external file dependency)
const FATERRA_LOGO =
  'data:image/webp;base64,UklGRrAJAABXRUJQVlA4IKQJAABwKwCdASqAAIAAPj0ai0OiIaETyq40IAPEtIArwTgMXHsk6tLeHPk290e0OgX9efyP5Z8p/AI9hf6j8qOMtsb31/9xx4+IB/G/6j/reRr+wf7P2A/5n/cP+D9wHyB/7v+O/LD29fl/+F/8n+Q+Af+Xf0v/V/3z97PjD9i37Uex3+yJ9rk8i3U1vUFriFvl2NZv8iLkJGBu0gTmrAyKiRxomNFPO7e1QoQHJy5OOXrnQXc2H0ThBQjq6ijdudiAGJFZO2/PFRaqnHyqXSZ9rMrTQYL4eSUft2YOLbw3XXZljz9ghqee5+f2UN9eYJ8nCOepoQuKPbSh/PjGccK7Eu33z9pWqIWWahXqwMyBP6N4HU+v+nREbTyn/3EXX8KUK/Qdk3IAuE7UZqJ7BWk8ba4HNXZhEeVrIYkbf/r9Y5r83WFkPN8zNeHbWKLyn48wSGBY1C9vPHdLLuRLDETnQ4rFH+hoAAD+/nrwMIQ79usXpMOVigaYgDbNBQOcuPl1v/v+7MvUCikhqDwmo4ixBFr/3gAq5NvvVFc5mBZuVnHgn7pJZlwZC3IZ7G94I6+V4XXfqWLHOBY+qq/Hor9gFgAUyQGEwdfUrw67xUcajyMbuZ3Bifcnohi+13UPPoleAroAdvBtU32L7FT8Kn7kDv2swe83uf171UTLw8AbkPasfwimfVnTvai9g9YWUyY9oh9Hn7HJ5l4xPE9Nm69Yo9fGzU64uqKc35pO51eL/iZUz7cAog0Gr47ko5QqBjSyrOEf5y3yUvGIsqD4AF+inYABzTfpD8c7zyHBeqn5//AyaDvJlcvNqUtCZ0z/9XMHAhDUuvFhsD7ZcsnC6Yu8PKoFl8kqWq6vYstmDSOHJqErrgL1sI2d2wCsZLh2dQHessBt+4kj4A8X64ogu7CCMRy/x7Y0o1jemcvLXFawuUtKEoE4jKtxNVYdSzefKgCYc4/rxvrplgihIRPWFE5tVVB/G9SeoMeAYtfTxwtIPvWnq+Lch8w9p/y+Rp2fDcEXQ1X+G4D/HZKl5UmAI8YARXcfgobwh6x+ZOJbu16m3pzhwmD1rwVe4U1H2wmkFWSi+9fo+p7P0WM0/Pv8i+k1S3srJ7Oc+2Nq1gWPwVw4T1+6K5urQCp75V40PY2+D5MLJ9levWZ6JgrhiKj1VhGivY5fKv+Gth5kx7rQLSiv3X59hE9gsiOeJQ9Gb+8DNO9UlQPqe+v5sYXhh/f5pgEtkJujf/fPxtmjNCdYaeti6nAnzOP0Mgss3kaArO4gZKbSbXWO0j8S5AgmP/L9iyx9swM61VQ6q7KXzzOr/+om2YZiqSU35+0O6lWubT/Aqffk8dCslg7zqU15p+vcpo6g3X50syGzzZ0iQa4cPN/+iSahxjPXiFaf03yceN6gzvQR1d5zY8/jw5K9dyiMi/zRNSitZOw3Bz6FQ8kt0Gu4MA+V+UkjkwQ56X17JGci6jaEZ0lbu5N1UMQaa5cdRY6Ix9w/wCZFbRz7w0M6MTzowf4Zfz1+QQVunhJ8tVr17/Nkgg4Wk1F/vo13dm/ZRVfpKt+86HqXv+If8yNkGd5An5wRv4cTUInog8bUfoSoym5/FLWrJ5EiQaTK1mBxm3tgoix1JHdk7eRrKXmkVGiaZukRjau1Sp3P9zxcpEBYoR6VkU0uCToU+w6WmfZHS5/2UN2KJI1N25rpOGejxFZs9lxCKHclUYO7AWhRoLrowTqzG10zuQhqlYMFzNysqGlkPnLKnLAwGfEIvHtlfd14eys+u5/B04x8OHtJW31dBDO97CF5af90wrLtQbIt05k8KhEZAFmN99Uk5wriYVe9chcSkzcJK0Cw1se41iVMg9LY4+7P9iVBDxH4f5FjJpoBH4zr1rt6+cMGbKIpKSPV41cPMY6z4COf41DcDzshABLBbNUcNf1rqu7wTmy+310XQvHhjp6Y+N0qU3SJmypDK2BS3wNDVxtoah32ju3z9q/XNi+ipPP1LoL2+gxva5jYRa4/58UO702qTU2sUPOrJRbCWRSu3Mhn50SzjWXFLH0FmJTnp99GFr1IYAevEu/NhA1D+CioZBfuSwfPS5O+ECYcpttuDtAhYmLqtY+Xe89ofp1zwZeCJa+5a3qPdsYseHjtZ2YLbgefN7jrY77HWi3bEbXQR9mwJOQFoiXeNztZ5aSahUgf2lrBGgMdpS3vbb0Yx3t3Ydng9yltb5+MKWXVOGFse/oOzLrGD7+lClBtIF7AJ0I5ll1NYqcbcP5uJCZon/r3DbYtLrxcFxCgF5d0Im7eSNnmXLH64gohYeCqcaCK+i9aS0Zt4/8vuRVTC7jxqSx4VVFDbrt2JMdyqMThSNQo0FLEXslmarTm5Utvak7fUmhtkZ5FhdqqdR42HHihZeM6SM9vhLRaaqoKEypB9EvC5woPcIR1Q+pNd2gUu9j1mrX+fvXoxkwf8elldjhPLiPAZ6FyQcVC3y5lwO5dp7+01Op0rYT3k3nbOTuokWLAIUwSbMMsiu6nGS/WpqHV+eOgL6XsWzgr25bY7qh5idzbaxC0QsOil4Wlf0RBjf5nHbwTpHtM4PUs6I8e3af1rk4JSCXjMHJA53gV0dQPg0NccSAolga6Upy5cA7iXLC5rQh7qVGfW0tW8HfDt/ICe2ZvFdmmBdfzNbw9q6hJ9aCg7OZcQ9/Mhdf7onxZf52B4V7K88T0YR1mmhyonz/gkBBR+tUz/H75hQcQh3z8riQvQSLBruGWkGAHTKbXBDEEcIuYk6mc5ro5mp5ynhgq/bxlw9bd/LOpAg0GuzJW8sQawhzgUBqsdLTGWPl4QzxXcCGncy5bVFm07ZSzarSpalNpZVgYWwF0VmQMAXKflNAwRY7Jf4mzBod5aCmrgQhZqqIR0JGSxWPjtWVHmjvfZKvWUeG6ylZyTIWVPogHKb0Im2nhZeyxAcdCUGlJ8VT2Kpc3A55AxaqzAbxWI/IEGSK2wuiSzjGBNfgyci+jIaPwfRHjytdq5tAjlg8gTNijSP91O3eJeKXvgomWz/7Gj9iVUJ+Nirzj9HTqvv8HooGvgDxXB7T+8r5CCuw8BODBK01iai6gM76mTP4/+LPbdB3DWxXIYG2v9wdyLVDxLZv8OTf0XzXG9xVRQvmhtWStCyh3f1obiMQ/0tXlWchRLVVysi2thO+Nc/AnztDi/mpSBiQEU8Qkfrd5lylIShMsHYVcbL5fZkxXhdbgt0FM42g4i/mGMyGMgZb274nsmCIJuCr+w1QkvrpK/u+C90PM5mbLJyQHoyt2yGR2dcl2gAAAAA==';

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const fmtTHB = (n) =>
  new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 2,
  }).format(Number(n) || 0);
const fmtNum = (n) =>
  new Intl.NumberFormat('th-TH', { maximumFractionDigits: 2 }).format(
    Number(n) || 0
  );
const fmtBaht = (n) =>
  `${new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(n) || 0)} บาท`;
const todayISO = () => new Date().toISOString().slice(0, 10);
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('th-TH', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
      })
    : '-';

const STOCK_CATEGORIES = [
  'ปูน-คอนกรีต',
  'เหล็ก-โครงสร้าง',
  'ไม้',
  'ไฟฟ้า',
  'ประปา',
  'สี-เคมีภัณฑ์',
  'อุปกรณ์ทั่วไป',
  'อื่นๆ',
];
const BUDGET_CATEGORIES = [
  'วัสดุ (ประมาณการ)',
  'ค่าแรง',
  'ค่าเช่าเครื่องมือ',
  'ผู้รับเหมาช่วง',
  'ค่าขนส่ง',
  'อื่นๆ',
];
const INCOME_CATEGORIES = [
  'รายได้จากงาน',
  'เงินมัดจำ',
  'ดอกเบี้ย/เงินปันผล',
  'รายได้อื่นๆ',
];
const EXPENSE_CATEGORIES = [
  'ค่าน้ำมัน/เดินทาง',
  'ค่าเช่าสถานที่',
  'เงินเดือนพนักงาน',
  'ค่าใช้จ่ายสำนักงาน',
  'ค่าน้ำ-ไฟ-โทรศัพท์',
  'ภาษี',
  'ค่าซ่อมบำรุง',
  'ค่าใช้จ่ายอื่นๆ',
];
const UNITS = [
  'ชิ้น',
  'อัน',
  'ถุง',
  'ลิตร',
  'กก.',
  'ม.',
  'ม2',
  'ม3',
  'เส้น',
  'แผ่น',
  'ม้วน',
  'คัน',
  'งาน',
];

const EQUIPMENT_CATEGORIES = [
  'เครื่องมือไฟฟ้า',
  'เครื่องมือช่าง',
  'นั่งร้าน-อุปกรณ์ก่อสร้าง',
  'เครื่องจักรกล',
  'ยานพาหนะ',
  'อุปกรณ์เซฟตี้',
  'อื่นๆ',
];
const EQUIPMENT_UNITS = ['ชิ้น', 'เครื่อง', 'ชุด', 'ตัว', 'คัน', 'อัน'];
const EQUIPMENT_CONDITIONS = {
  good: 'ปกติ',
  repair: 'รอซ่อมบำรุง',
  damaged: 'ชำรุด',
};

function guessEquipmentCategory(name) {
  const rules = [
    [/หมวกเชื่อม|หน้ากาก|เซฟตี้|safety|ถุงมือ|แว่นตา|กันตก/i, 'อุปกรณ์เซฟตี้'],
    [
      /ดอกสว่าน|ดอกเจาะ|หัวเชื่อม|ลวดเชื่อม|ตลับเมตร|เหล็กกวนสี|มีดพับ|มีด|ชุดเครื่องมือช่าง|ประแจ|ค้อน|เทป|แคลมป์|แคล้ม|กบไส|แบบมือ|ไกด์นำตัด/i,
      'เครื่องมือช่าง',
    ],
    [
      /สว่าน|ไขควง|เครื่องพ่นสี|ปืนยิงตะปู|เครื่องยิงตะปู|ตู้เชื่อม|เครื่องเชื่อม|สกรูขัน|เลเซอร์|เลื่อย|แม็ค|ทริมเมอร์|เซาะร่อง|เป่าลม|ดูดฝุ่น/i,
      'เครื่องมือไฟฟ้า',
    ],
    [/นั่งร้าน|บันได|เพดาน|ผนัง/i, 'นั่งร้าน-อุปกรณ์ก่อสร้าง'],
    [/รถ|เทรลเลอร์|รถเข็น/i, 'ยานพาหนะ'],
  ];
  for (const [re, cat] of rules) if (re.test(name)) return cat;
  return 'อื่นๆ';
}

function makeBulkRow(name, price) {
  return {
    id: uid(),
    name,
    price,
    category: guessEquipmentCategory(name),
    unit: 'ชิ้น',
    qtyTotal: 1,
  };
}

// Parses pasted marketplace/quotation lists in either shape:
//   "ชื่อสินค้า ราคา 1,234 บาท"  (name and price inline)
//   "ชื่อสินค้า" then "1,234" on the next line  (name and price on separate lines)
function parseBulkEquipmentText(text) {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const pureNumber = /^[\d]{1,3}(?:,\d{3})*(?:\.\d+)?$/;
  const rows = [];
  let pendingName = null;
  for (const line of lines) {
    if (pureNumber.test(line) && pendingName) {
      rows.push(makeBulkRow(pendingName, parseFloat(line.replace(/,/g, ''))));
      pendingName = null;
      continue;
    }
    if (line.includes('ราคา')) {
      const idx = line.indexOf('ราคา');
      const namePart = line.slice(0, idx).trim();
      const m = line.slice(idx).match(/([\d]{1,3}(?:,\d{3})*(?:\.\d+)?)/);
      rows.push(
        makeBulkRow(
          namePart || pendingName || line,
          m ? parseFloat(m[1].replace(/,/g, '')) : 0
        )
      );
      pendingName = null;
      continue;
    }
    if (pendingName) rows.push(makeBulkRow(pendingName, 0)); // previous name never got a price — keep it anyway
    pendingName = line;
  }
  if (pendingName) rows.push(makeBulkRow(pendingName, 0));
  return rows;
}

// Pre-loaded on first run so pasted marketplace/quotation tool lists show up
// immediately in the Equipment tab without the user re-entering them by hand.
// Each batch has its own storage flag so later batches don't re-trigger earlier ones.
const SEED_EQUIPMENT_BATCHES = [
  {
    flag: 'equipment-seed-v1',
    items: [
      ['MAKITA 16 Lines', 2292],
      ['(แพ็ค4) MOLITA สว่านไร้สาย 3 ระบบ 299V', 3063],
      ['ชุดเครื่องมือช่างอเนกประสงค์ประจำครัวเรือน', 159],
      ['2 ชิ้น / เซต เพดาน ลาด ผนัง ตำแหน่ง แผ่น', 118],
      ['14 ชิ้น 15AK หัวเชื่อมสิ้นเปลือง', 148],
      ['ลวดเชื่อมฟลักซ์ลวด 0.8 มม.- 1 มม.', 269],
      ['หน้ากากและหมวกเชื่อมอัตโนมัติ', 537],
      ['ตลับเมตร', 80],
      ['YOKOMO เหล็กกวนสี เหล็กผสมสี เหล็กปั่นปูน', 103],
      ['ปืนยิงตะปูไฟฟ้า สกรูขันโซ่อัตโนมัติ', 266],
      ['ปลั๊กพ่วง 4 ที่ (4x4) หุ้มยางต่อสายไฟ', 684],
      ['ดอกสว่าน ทรงเจดีย์ เดอกสเต็ป', 185],
      ['InnTech เครื่องพ่นสี กาพ่นสี เครื่องพ่นสีไฟฟ้า', 645],
      ['TOOLKING เครื่องยิงตะปูแรงดันสูง', 502],
      ['SA ตู้เชื่อมไฟฟ้า อาร์กอน 3 ระบบ', 2300],
      ['INGCO ดอกสว่านเจาะเหล็ก 2 -8 มม.', 105],
      ['Makita สว่าน ไขควง สว่านไร้สาย', 1013],
      ['FOLDING KNIFF EDC มีดพับพกพาเล็ก', 102],
    ],
  },
  {
    flag: 'equipment-seed-v2',
    items: [
      ['MAKITA เลื่อยวงเดือน 7นิ้ว ตัดไม้', 988],
      ['ปืนยิงตะปู แม็คไฟฟ้าขาเดี่ยว', 1248],
      ['MakTec เครื่องเซาะร่อง ทริมเมอร์', 973],
      ['ไกด์นำตัด เครื่องตัดไม้', 692],
      ['ปืนยิงตะปูแบบมือ', 347],
      ['Molina เครื่องเป่าลมดูดฝุ่น', 276],
      ['Total แคล้มจับชิ้นงาน', 280],
      ['Shizi มีดตัดแต่งงานไม้', 151],
      ['กบไสไม้', 56],
      ['แคลมป์หนีบมุมขวา 90 องศา', 134],
      ['ดอกเจาะบานพับถ้วย 5ชิ้น', 145],
      ['เครื่องเจาะกระดาษแข็ง', 222],
      ['ชุดเพลารางเชิงเส้น', 856],
      ['ดอกสว่านเจาะนำแบบมีแหวน', 93],
    ],
  },
];
function buildSeedEquipmentBatch(items, startIndex) {
  return items.map(([name, price], i) => ({
    id: uid(),
    code: `TL-${String(startIndex + i + 1).padStart(3, '0')}`,
    name,
    category: guessEquipmentCategory(name),
    unit: 'ชิ้น',
    qtyTotal: 1,
    qtyAvailable: 1,
    purchasePrice: price,
    condition: 'good',
    notes: '',
  }));
}

const STORAGE_KEYS = {
  stock: 'stock-items',
  quotes: 'quotations',
  jobs: 'jobs',
  txns: 'stock-transactions',
  equipment: 'equipment-items',
  equipTxns: 'equipment-transactions',
  settings: 'company-settings',
  cashEntries: 'cash-entries',
};

// Running outside claude.ai, so persistence uses the browser's localStorage
// instead of Claude's built-in window.storage API. Data is saved per-browser/device.
async function storageLoad(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
async function storageSave(key, arr) {
  try {
    localStorage.setItem(key, JSON.stringify(arr));
  } catch (e) {
    console.error('storage save failed', key, e);
  }
}

// Job site photos are kept under their own per-job key so opening the app doesn't
// have to load every photo from every job up front.
const jobPhotosKey = (jobId) => `job-photos:${jobId}`;
async function loadJobPhotos(jobId) {
  try {
    const raw = localStorage.getItem(jobPhotosKey(jobId));
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
async function saveJobPhotos(jobId, photos) {
  try {
    localStorage.setItem(jobPhotosKey(jobId), JSON.stringify(photos));
  } catch (e) {
    console.error('photo save failed', e);
  }
}

// Resize + compress a picked image file client-side before turning it into a
// base64 data URL, so a handful of phone photos don't blow past storage limits.
function fileToCompressedDataURL(file, maxDim = 1280, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const rawDataUrl = reader.result;
      try {
        const img = new Image();
        img.onload = () => {
          try {
            let { width, height } = img;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
          } catch (canvasErr) {
            // Canvas processing unavailable/restricted — fall back to the original image.
            resolve(rawDataUrl);
          }
        };
        img.onerror = () => resolve(rawDataUrl);
        img.src = rawDataUrl;
      } catch (imgErr) {
        resolve(rawDataUrl);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function computeJobFinancials(job, txns, cashEntries = []) {
  const materialActual = txns
    .filter((t) => t.jobId === job.id && t.type === 'issue')
    .reduce((s, t) => s + Number(t.qty) * Number(t.unitCost), 0);
  const otherActual = (job.budgetItems || []).reduce(
    (s, b) => s + (Number(b.actualCost) || 0),
    0
  );
  const linkedExpense = cashEntries
    .filter((e) => e.jobId === job.id && e.type === 'expense')
    .reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const collectedIncome = cashEntries
    .filter((e) => e.jobId === job.id && e.type === 'income')
    .reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const totalBudget = (job.budgetItems || []).reduce(
    (s, b) => s + (Number(b.budgetedCost) || 0),
    0
  );
  const totalActual = materialActual + otherActual + linkedExpense;
  const revenue = Number(job.revenue) || 0;
  const actualProfit = revenue - totalActual;
  const budgetProfit = revenue - totalBudget;
  const margin = revenue ? (actualProfit / revenue) * 100 : 0;
  return {
    materialActual,
    otherActual,
    linkedExpense,
    collectedIncome,
    totalBudget,
    totalActual,
    revenue,
    actualProfit,
    budgetProfit,
    margin,
  };
}

function computeQuoteTotals(q) {
  const subtotal = (q.items || []).reduce(
    (s, it) => s + Number(it.qty) * Number(it.unitPrice),
    0
  );
  const costTotal = (q.items || []).reduce(
    (s, it) => s + Number(it.qty) * Number(it.unitCost || 0),
    0
  );
  const discount = Number(q.discount) || 0;
  const vat = q.vatEnabled ? (subtotal - discount) * 0.07 : 0;
  const grandTotal = subtotal - discount + vat;
  const estMargin = subtotal - discount - costTotal;
  const estMarginPct = subtotal ? (estMargin / subtotal) * 100 : 0;
  return {
    subtotal,
    costTotal,
    discount,
    vat,
    grandTotal,
    estMargin,
    estMarginPct,
  };
}

/* ---------------------------------------------------------------------- */
/* Small reusable UI                                                      */
/* ---------------------------------------------------------------------- */

function Modal({ title, onClose, children, footer, wide }) {
  return (
    <div
      className="ca-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={'ca-modal' + (wide ? ' wide' : '')}>
        <div className="ca-modal-head">
          <div className="ca-modal-title">{title}</div>
          <button className="ca-icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="ca-modal-body">{children}</div>
        {footer && <div className="ca-modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <div className="ca-field">
      <label>{label}</label>
      {children}
      {hint && <div className="ca-hint">{hint}</div>}
    </div>
  );
}

function Badge({ tone = 'grey', children }) {
  return <span className={'ca-badge ' + tone}>{children}</span>;
}

function ConfirmDelete({ onConfirm }) {
  const [confirming, setConfirming] = useState(false);
  if (confirming) {
    return (
      <span className="ca-inline-confirm">
        <button className="ca-btn ca-btn-danger ca-btn-sm" onClick={onConfirm}>
          ยืนยันลบ
        </button>
        <button className="ca-icon-btn" onClick={() => setConfirming(false)}>
          <X size={14} />
        </button>
      </span>
    );
  }
  return (
    <button
      className="ca-icon-btn"
      title="ลบ"
      onClick={() => setConfirming(true)}
    >
      <Trash2 size={15} />
    </button>
  );
}

function EmptyState({ icon: Icon, text, action }) {
  return (
    <div className="ca-empty">
      <Icon size={30} />
      <div>{text}</div>
      {action}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Dashboard                                                               */
/* ---------------------------------------------------------------------- */

function Dashboard({
  stock,
  quotes,
  jobs,
  txns,
  equipment,
  equipTxns,
  cashEntries,
  setTab,
}) {
  const stockValue = stock.reduce(
    (s, it) => s + Number(it.qty) * Number(it.costPrice),
    0
  );
  const lowStock = stock.filter(
    (it) => Number(it.qty) <= Number(it.minQty || 0)
  );
  const activeJobs = jobs.filter((j) => j.status !== 'completed');
  const pendingQuotes = quotes.filter(
    (q) => q.status === 'sent' || q.status === 'draft'
  );
  const equipmentOut = equipment.filter(
    (e) => Number(e.qtyAvailable) < Number(e.qtyTotal)
  );
  const netCash =
    cashEntries
      .filter((e) => e.type === 'income')
      .reduce((s, e) => s + (Number(e.amount) || 0), 0) -
    cashEntries
      .filter((e) => e.type === 'expense')
      .reduce((s, e) => s + (Number(e.amount) || 0), 0);

  const chartData = jobs.slice(0, 8).map((j) => {
    const f = computeJobFinancials(j, txns, cashEntries);
    return {
      name: j.name.length > 12 ? j.name.slice(0, 12) + '…' : j.name,
      กำไรจริง: Math.round(f.actualProfit),
      กำไรตามงบ: Math.round(f.budgetProfit),
    };
  });

  const totalActualProfit = jobs.reduce(
    (s, j) => s + computeJobFinancials(j, txns, cashEntries).actualProfit,
    0
  );

  return (
    <div>
      <TitleBlock
        eyebrow="ภาพรวมกิจการ"
        title="แดชบอร์ด"
        fields={[
          ['วันที่', fmtDate(todayISO())],
          ['งานที่ดำเนินการ', activeJobs.length],
          ['สถานะ', 'ปกติ'],
        ]}
      />

      <div
        className="ca-cards"
        style={{ gridTemplateColumns: 'repeat(5,1fr)' }}
      >
        <div className="ca-card">
          <div className="ca-card-label">มูลค่าสต๊อคคงเหลือ</div>
          <div className="ca-card-value">{fmtTHB(stockValue)}</div>
          <div className="ca-card-sub">{stock.length} รายการวัสดุ</div>
        </div>
        <div className={'ca-card' + (lowStock.length ? ' warn' : '')}>
          <div className="ca-card-label">วัสดุใกล้หมด</div>
          <div className="ca-card-value">{lowStock.length}</div>
          <div className="ca-card-sub">รายการต่ำกว่าจุดสั่งซื้อ</div>
        </div>
        <div className="ca-card">
          <div className="ca-card-label">งานที่กำลังดำเนินการ</div>
          <div className="ca-card-value">{activeJobs.length}</div>
          <div className="ca-card-sub">จากทั้งหมด {jobs.length} งาน</div>
        </div>
        <div
          className={'ca-card' + (totalActualProfit >= 0 ? ' good' : ' bad')}
        >
          <div className="ca-card-label">กำไรรวม (ตามจริง)</div>
          <div className="ca-card-value">{fmtTHB(totalActualProfit)}</div>
          <div className="ca-card-sub">ทุกงานสะสม</div>
        </div>
        <div className={'ca-card' + (equipmentOut.length ? ' warn' : '')}>
          <div className="ca-card-label">เครื่องมือเบิกใช้งานอยู่</div>
          <div className="ca-card-value">{equipmentOut.length}</div>
          <div className="ca-card-sub">
            จากทั้งหมด {equipment.length} รายการ
          </div>
        </div>
      </div>

      <div className="ca-panel">
        <div className="ca-panel-head">
          <div className="ca-panel-title">
            <TrendingUp size={16} /> กำไร-ขาดทุนรายงาน (ตามงบ vs ตามจริง)
          </div>
        </div>
        <div className="ca-panel-body">
          {jobs.length === 0 ? (
            <EmptyState icon={Briefcase} text="ยังไม่มีข้อมูลงาน" />
          ) : (
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ left: 4, right: 8 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E1DCD1"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 11.5,
                      fontFamily: 'Sarabun',
                      fill: '#6E6A63',
                    }}
                    stroke="#E1DCD1"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#6E6A63' }}
                    tickFormatter={(v) => fmtNum(v)}
                    width={70}
                    stroke="#E1DCD1"
                  />
                  <Tooltip
                    formatter={(v) => fmtTHB(v)}
                    contentStyle={{
                      fontFamily: 'Sarabun',
                      fontSize: 12.5,
                      borderRadius: 8,
                      background: '#FFFFFF',
                      border: '1px solid #E1DCD1',
                      color: '#22262B',
                    }}
                    labelStyle={{ color: '#22262B' }}
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: 12.5,
                      fontFamily: 'Sarabun',
                      color: '#6E6A63',
                    }}
                  />
                  <Bar
                    dataKey="กำไรตามงบ"
                    fill="#C9C2B4"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="กำไรจริง"
                    fill="#2E7D5B"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="ca-row" style={{ alignItems: 'flex-start' }}>
        <div className="ca-panel" style={{ flex: 1 }}>
          <div className="ca-panel-head">
            <div className="ca-panel-title">
              <AlertTriangle size={16} /> วัสดุใกล้หมด
            </div>
            <button
              className="ca-btn ca-btn-outline ca-btn-sm"
              onClick={() => setTab('stock')}
            >
              ไปที่คลังสินค้า <ChevronRight size={14} />
            </button>
          </div>
          <div className="ca-panel-body">
            {lowStock.length === 0 ? (
              <EmptyState icon={Boxes} text="สต๊อคทุกรายการอยู่ในเกณฑ์ปกติ" />
            ) : (
              <table className="ca-table">
                <thead>
                  <tr>
                    <th>รายการ</th>
                    <th>คงเหลือ</th>
                    <th>จุดสั่งซื้อ</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.slice(0, 6).map((it) => (
                    <tr key={it.id}>
                      <td>{it.name}</td>
                      <td className="ca-num" style={{ color: 'var(--red)' }}>
                        {fmtNum(it.qty)} {it.unit}
                      </td>
                      <td className="ca-num">
                        {fmtNum(it.minQty)} {it.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="ca-panel" style={{ flex: 1 }}>
          <div className="ca-panel-head">
            <div className="ca-panel-title">
              <FileText size={16} /> ใบเสนอราคาที่ยังไม่ปิดงาน
            </div>
            <button
              className="ca-btn ca-btn-outline ca-btn-sm"
              onClick={() => setTab('quotes')}
            >
              ไปที่ใบเสนอราคา <ChevronRight size={14} />
            </button>
          </div>
          <div className="ca-panel-body">
            {pendingQuotes.length === 0 ? (
              <EmptyState icon={FileText} text="ไม่มีใบเสนอราคาค้าง" />
            ) : (
              <table className="ca-table">
                <thead>
                  <tr>
                    <th>เลขที่</th>
                    <th>ลูกค้า</th>
                    <th>ยอดรวม</th>
                    <th>สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingQuotes.slice(0, 6).map((q) => {
                    const t = computeQuoteTotals(q);
                    return (
                      <tr key={q.id}>
                        <td className="ca-mono">{q.docNo}</td>
                        <td>{q.customerName || '-'}</td>
                        <td className="ca-num">{fmtTHB(t.grandTotal)}</td>
                        <td>
                          <StatusBadge status={q.status} kind="quote" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <div className="ca-panel">
        <div className="ca-panel-head">
          <div className="ca-panel-title">
            <Wallet size={16} /> รายรับ-รายจ่าย
          </div>
          <button
            className="ca-btn ca-btn-outline ca-btn-sm"
            onClick={() => setTab('cashflow')}
          >
            ไปที่รายรับ-รายจ่าย <ChevronRight size={14} />
          </button>
        </div>
        <div className="ca-panel-body">
          <div style={{ display: 'flex', gap: 24, alignItems: 'baseline' }}>
            <div>
              <div
                style={{
                  fontSize: 11.5,
                  color: 'var(--muted)',
                  fontWeight: 600,
                  marginBottom: 3,
                }}
              >
                คงเหลือสุทธิสะสม
              </div>
              <div
                className="ca-mono"
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: netCash >= 0 ? 'var(--green)' : 'var(--red)',
                }}
              >
                {fmtTHB(netCash)}
              </div>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>
              {cashEntries.length} รายการบันทึกไว้
            </div>
          </div>
        </div>
      </div>

      {equipmentOut.length > 0 && (
        <div className="ca-panel">
          <div className="ca-panel-head">
            <div className="ca-panel-title">
              <Wrench size={16} /> เครื่องมือ-อุปกรณ์ที่เบิกใช้งานอยู่
            </div>
            <button
              className="ca-btn ca-btn-outline ca-btn-sm"
              onClick={() => setTab('stock')}
            >
              ไปที่คลังพัสดุ <ChevronRight size={14} />
            </button>
          </div>
          <div className="ca-panel-body">
            <table className="ca-table">
              <thead>
                <tr>
                  <th>อุปกรณ์</th>
                  <th>เบิกใช้งานอยู่</th>
                  <th>พร้อมใช้งาน</th>
                </tr>
              </thead>
              <tbody>
                {equipmentOut.slice(0, 6).map((e) => (
                  <tr key={e.id}>
                    <td>{e.name}</td>
                    <td
                      className="ca-num"
                      style={{ color: 'var(--amber-dark)' }}
                    >
                      {fmtNum(e.qtyTotal - e.qtyAvailable)} {e.unit}
                    </td>
                    <td className="ca-num">
                      {fmtNum(e.qtyAvailable)} / {fmtNum(e.qtyTotal)} {e.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function TitleBlock({ eyebrow, title, fields = [] }) {
  return (
    <div className="ca-titleblock">
      <div className="ca-tb-main">
        <div className="ca-tb-eyebrow">{eyebrow}</div>
        <div className="ca-tb-title">{title}</div>
      </div>
      <div className="ca-tb-fields">
        {fields.map(([label, value], i) => (
          <div className="ca-tb-field" key={i}>
            <div className="ca-tb-flabel">{label}</div>
            <div className="ca-tb-fvalue">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status, kind }) {
  const map = {
    quote: {
      draft: ['ร่าง', 'grey'],
      sent: ['ส่งแล้ว', 'amber'],
      accepted: ['ตอบรับแล้ว', 'green'],
      rejected: ['ปฏิเสธ', 'red'],
    },
    job: {
      ongoing: ['กำลังดำเนินการ', 'amber'],
      completed: ['เสร็จสิ้น', 'green'],
      onhold: ['พักงาน', 'grey'],
    },
  };
  const [label, tone] = (map[kind] && map[kind][status]) || [status, 'grey'];
  return <Badge tone={tone}>{label}</Badge>;
}

/* ---------------------------------------------------------------------- */
/* Company / payment settings — shown on every quotation                  */
/* ---------------------------------------------------------------------- */

function SettingsModal({ settings, saveSettings, onClose }) {
  const [s, setS] = useState(settings);
  return (
    <Modal
      title="ข้อมูลบริษัท & บัญชีรับเงิน"
      onClose={onClose}
      footer={
        <>
          <button className="ca-btn ca-btn-outline" onClick={onClose}>
            ยกเลิก
          </button>
          <button
            className="ca-btn ca-btn-primary"
            onClick={() => {
              saveSettings(s);
              onClose();
            }}
          >
            บันทึก
          </button>
        </>
      }
    >
      <div className="ca-hint" style={{ marginBottom: 12 }}>
        ข้อมูลนี้จะแสดงบนใบเสนอราคาทุกใบโดยอัตโนมัติ (หัวเอกสาร +
        เลขที่บัญชีสำหรับให้ลูกค้าโอนเงิน)
      </div>
      <Field label="ชื่อกิจการ / บริษัท">
        <input
          className="ca-input"
          value={s.companyName || ''}
          onChange={(e) => setS({ ...s, companyName: e.target.value })}
          placeholder="เช่น ห้างหุ้นส่วน ช.การช่าง"
        />
      </Field>
      <div className="ca-row">
        <Field label="ที่อยู่">
          <input
            className="ca-input"
            value={s.companyAddress || ''}
            onChange={(e) => setS({ ...s, companyAddress: e.target.value })}
          />
        </Field>
        <Field label="เบอร์โทร">
          <input
            className="ca-input"
            value={s.companyPhone || ''}
            onChange={(e) => setS({ ...s, companyPhone: e.target.value })}
          />
        </Field>
      </div>
      <Field label="เลขประจำตัวผู้เสียภาษี">
        <input
          className="ca-input"
          value={s.companyTaxId || ''}
          onChange={(e) => setS({ ...s, companyTaxId: e.target.value })}
        />
      </Field>
      <div className="ca-divider" />
      <div className="ca-panel-title" style={{ fontSize: 14, marginBottom: 8 }}>
        บัญชีรับชำระเงิน
      </div>
      <div className="ca-row">
        <Field label="ธนาคาร">
          <input
            className="ca-input"
            value={s.bankName || ''}
            onChange={(e) => setS({ ...s, bankName: e.target.value })}
            placeholder="เช่น ธนาคารกสิกรไทย"
          />
        </Field>
        <Field label="ชื่อบัญชี">
          <input
            className="ca-input"
            value={s.bankAccountName || ''}
            onChange={(e) => setS({ ...s, bankAccountName: e.target.value })}
          />
        </Field>
      </div>
      <Field label="เลขที่บัญชี">
        <input
          className="ca-input ca-mono"
          value={s.bankAccountNo || ''}
          onChange={(e) => setS({ ...s, bankAccountNo: e.target.value })}
          placeholder="xxx-x-xxxxx-x"
        />
      </Field>
    </Modal>
  );
}

/* ---------------------------------------------------------------------- */
/* Stock view                                                              */
/* ---------------------------------------------------------------------- */

function StockView({
  stock,
  saveStock,
  txns,
  saveTxns,
  jobs,
  equipment,
  saveEquipment,
  equipTxns,
  saveEquipTxns,
}) {
  const [query, setQuery] = useState('');
  const [editItem, setEditItem] = useState(null); // object or null
  const [showForm, setShowForm] = useState(false);
  const [txnFor, setTxnFor] = useState(null); // stock item for adjust modal
  const [activeSubTab, setActiveSubTab] = useState('items');

  const filtered = stock.filter((it) =>
    (it.name + it.code + it.category)
      .toLowerCase()
      .includes(query.toLowerCase())
  );
  const stockValue = stock.reduce(
    (s, it) => s + Number(it.qty) * Number(it.costPrice),
    0
  );
  const equipValue = equipment.reduce(
    (s, it) => s + Number(it.qtyTotal) * Number(it.purchasePrice || 0),
    0
  );

  function openNew() {
    setEditItem({
      id: uid(),
      code: '',
      name: '',
      category: STOCK_CATEGORIES[0],
      unit: UNITS[0],
      qty: 0,
      minQty: 0,
      costPrice: 0,
      sellPrice: 0,
    });
    setShowForm(true);
  }
  function openEdit(it) {
    setEditItem({ ...it });
    setShowForm(true);
  }
  function remove(id) {
    saveStock(stock.filter((s) => s.id !== id));
  }
  function submitForm(e) {
    e.preventDefault();
    const exists = stock.some((s) => s.id === editItem.id);
    const next = exists
      ? stock.map((s) => (s.id === editItem.id ? editItem : s))
      : [...stock, editItem];
    saveStock(next);
    setShowForm(false);
  }

  return (
    <div>
      <TitleBlock
        eyebrow="วัสดุ-เครื่องมือคงคลัง"
        title="คลังพัสดุ"
        fields={[
          ['วัสดุ', stock.length + ' รายการ'],
          ['เครื่องมือ', equipment.length + ' รายการ'],
          ['มูลค่ารวม', fmtTHB(stockValue + equipValue)],
        ]}
      />

      <div className="ca-tabs ca-no-print">
        <button
          className={'ca-tab' + (activeSubTab === 'items' ? ' active' : '')}
          onClick={() => setActiveSubTab('items')}
        >
          วัสดุสิ้นเปลือง
        </button>
        <button
          className={'ca-tab' + (activeSubTab === 'equipment' ? ' active' : '')}
          onClick={() => setActiveSubTab('equipment')}
        >
          เครื่องมือ-อุปกรณ์
        </button>
        <button
          className={'ca-tab' + (activeSubTab === 'log' ? ' active' : '')}
          onClick={() => setActiveSubTab('log')}
        >
          ประวัติเคลื่อนไหว
        </button>
      </div>

      {activeSubTab === 'items' && (
        <>
          <div className="ca-toolbar">
            <div className="ca-search">
              <Search size={15} />
              <input
                className="ca-input"
                placeholder="ค้นหาวัสดุ..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }} />
            <button className="ca-btn ca-btn-primary" onClick={openNew}>
              <Plus size={15} /> เพิ่มวัสดุ
            </button>
          </div>

          <div className="ca-panel">
            <div className="ca-panel-body" style={{ padding: 0 }}>
              {filtered.length === 0 ? (
                <div style={{ padding: 20 }}>
                  <EmptyState
                    icon={Boxes}
                    text="ยังไม่มีรายการวัสดุ"
                    action={
                      <button
                        className="ca-btn ca-btn-primary ca-btn-sm"
                        onClick={openNew}
                      >
                        เพิ่มวัสดุแรก
                      </button>
                    }
                  />
                </div>
              ) : (
                <table className="ca-table">
                  <thead>
                    <tr>
                      <th>รหัส</th>
                      <th>ชื่อวัสดุ</th>
                      <th>หมวดหมู่</th>
                      <th>คงเหลือ</th>
                      <th>ต้นทุน/หน่วย</th>
                      <th>ราคาขาย/หน่วย</th>
                      <th>มูลค่ารวม</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((it) => {
                      const low = Number(it.qty) <= Number(it.minQty || 0);
                      return (
                        <tr key={it.id}>
                          <td className="ca-mono">{it.code || '-'}</td>
                          <td>{it.name}</td>
                          <td>
                            <Badge tone="grey">{it.category}</Badge>
                          </td>
                          <td
                            className="ca-num"
                            style={
                              low
                                ? { color: 'var(--red)', fontWeight: 700 }
                                : undefined
                            }
                          >
                            {fmtNum(it.qty)} {it.unit}{' '}
                            {low && (
                              <AlertTriangle
                                size={12}
                                style={{ verticalAlign: -1, marginLeft: 3 }}
                              />
                            )}
                          </td>
                          <td className="ca-num">{fmtTHB(it.costPrice)}</td>
                          <td className="ca-num">{fmtTHB(it.sellPrice)}</td>
                          <td className="ca-num">
                            {fmtTHB(it.qty * it.costPrice)}
                          </td>
                          <td>
                            <div
                              style={{
                                display: 'flex',
                                gap: 2,
                                justifyContent: 'flex-end',
                              }}
                            >
                              <button
                                className="ca-icon-btn"
                                title="รับเข้า/เบิกใช้"
                                onClick={() => setTxnFor(it)}
                              >
                                <ArrowDownToLine size={15} />
                              </button>
                              <button
                                className="ca-icon-btn"
                                title="แก้ไข"
                                onClick={() => openEdit(it)}
                              >
                                <Pencil size={15} />
                              </button>
                              <ConfirmDelete onConfirm={() => remove(it.id)} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}

      {activeSubTab === 'equipment' && (
        <EquipmentPanel
          equipment={equipment}
          saveEquipment={saveEquipment}
          equipTxns={equipTxns}
          saveEquipTxns={saveEquipTxns}
          jobs={jobs}
        />
      )}

      {activeSubTab === 'log' && (
        <MovementLog txns={txns} equipTxns={equipTxns} jobs={jobs} />
      )}

      {showForm && (
        <Modal
          title={
            stock.some((s) => s.id === editItem.id)
              ? 'แก้ไขวัสดุ'
              : 'เพิ่มวัสดุใหม่'
          }
          onClose={() => setShowForm(false)}
          footer={
            <>
              <button
                className="ca-btn ca-btn-outline"
                onClick={() => setShowForm(false)}
              >
                ยกเลิก
              </button>
              <button className="ca-btn ca-btn-primary" onClick={submitForm}>
                บันทึก
              </button>
            </>
          }
        >
          <form onSubmit={submitForm}>
            <div className="ca-row">
              <Field label="รหัสวัสดุ">
                <input
                  className="ca-input"
                  value={editItem.code}
                  onChange={(e) =>
                    setEditItem({ ...editItem, code: e.target.value })
                  }
                  placeholder="เช่น CEM-001"
                />
              </Field>
              <Field label="หมวดหมู่">
                <select
                  className="ca-select"
                  value={editItem.category}
                  onChange={(e) =>
                    setEditItem({ ...editItem, category: e.target.value })
                  }
                >
                  {STOCK_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="ชื่อวัสดุ">
              <input
                className="ca-input"
                required
                value={editItem.name}
                onChange={(e) =>
                  setEditItem({ ...editItem, name: e.target.value })
                }
                placeholder="เช่น ปูนซีเมนต์ปอร์ตแลนด์"
              />
            </Field>
            <div className="ca-row">
              <Field label="หน่วยนับ">
                <select
                  className="ca-select"
                  value={editItem.unit}
                  onChange={(e) =>
                    setEditItem({ ...editItem, unit: e.target.value })
                  }
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="จำนวนคงเหลือ">
                <input
                  type="number"
                  step="any"
                  className="ca-input"
                  value={editItem.qty}
                  onChange={(e) =>
                    setEditItem({ ...editItem, qty: e.target.value })
                  }
                />
              </Field>
              <Field label="จุดสั่งซื้อ (แจ้งเตือน)">
                <input
                  type="number"
                  step="any"
                  className="ca-input"
                  value={editItem.minQty}
                  onChange={(e) =>
                    setEditItem({ ...editItem, minQty: e.target.value })
                  }
                />
              </Field>
            </div>
            <div className="ca-row">
              <Field label="ต้นทุนต่อหน่วย (บาท)">
                <input
                  type="number"
                  step="any"
                  className="ca-input"
                  value={editItem.costPrice}
                  onChange={(e) =>
                    setEditItem({ ...editItem, costPrice: e.target.value })
                  }
                />
              </Field>
              <Field label="ราคาขายต่อหน่วย (บาท)">
                <input
                  type="number"
                  step="any"
                  className="ca-input"
                  value={editItem.sellPrice}
                  onChange={(e) =>
                    setEditItem({ ...editItem, sellPrice: e.target.value })
                  }
                />
              </Field>
            </div>
          </form>
        </Modal>
      )}

      {txnFor && (
        <TxnModal
          item={txnFor}
          jobs={jobs}
          onClose={() => setTxnFor(null)}
          onSubmit={(txn) => {
            const delta =
              txn.type === 'receive' ? Number(txn.qty) : -Number(txn.qty);
            saveStock(
              stock.map((s) =>
                s.id === txnFor.id ? { ...s, qty: Number(s.qty) + delta } : s
              )
            );
            saveTxns([
              {
                ...txn,
                id: uid(),
                stockId: txnFor.id,
                stockName: txnFor.name,
                unit: txnFor.unit,
                date: todayISO(),
              },
              ...txns,
            ]);
            setTxnFor(null);
          }}
        />
      )}
    </div>
  );
}

function TxnModal({ item, jobs, onClose, onSubmit }) {
  const [type, setType] = useState('receive');
  const [qty, setQty] = useState('');
  const [unitCost, setUnitCost] = useState(item.costPrice);
  const [jobId, setJobId] = useState('');
  const [note, setNote] = useState('');

  function submit(e) {
    e.preventDefault();
    if (!qty || Number(qty) <= 0) return;
    onSubmit({
      type,
      qty: Number(qty),
      unitCost: Number(unitCost) || 0,
      jobId: type === 'issue' ? jobId || null : null,
      note,
    });
  }

  return (
    <Modal
      title={`ปรับสต๊อค: ${item.name}`}
      onClose={onClose}
      footer={
        <>
          <button className="ca-btn ca-btn-outline" onClick={onClose}>
            ยกเลิก
          </button>
          <button className="ca-btn ca-btn-primary" onClick={submit}>
            บันทึกรายการ
          </button>
        </>
      }
    >
      <form onSubmit={submit}>
        <div className="ca-row" style={{ marginBottom: 13 }}>
          <button
            type="button"
            className={
              'ca-btn ' +
              (type === 'receive' ? 'ca-btn-primary' : 'ca-btn-outline')
            }
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => setType('receive')}
          >
            <ArrowDownToLine size={15} /> รับเข้า
          </button>
          <button
            type="button"
            className={
              'ca-btn ' +
              (type === 'issue' ? 'ca-btn-primary' : 'ca-btn-outline')
            }
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => setType('issue')}
          >
            <ArrowUpFromLine size={15} /> เบิกใช้
          </button>
        </div>
        <div className="ca-row">
          <Field label={`จำนวน (${item.unit})`}>
            <input
              autoFocus
              type="number"
              step="any"
              className="ca-input"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </Field>
          <Field label="ต้นทุนต่อหน่วย ณ ขณะนี้">
            <input
              type="number"
              step="any"
              className="ca-input"
              value={unitCost}
              onChange={(e) => setUnitCost(e.target.value)}
            />
          </Field>
        </div>
        {type === 'issue' && (
          <Field
            label="เบิกให้กับงาน (ไม่บังคับ)"
            hint="หากระบุงาน ต้นทุนวัสดุนี้จะถูกนำไปรวมในกำไร-ขาดทุนของงานนั้นโดยอัตโนมัติ"
          >
            <select
              className="ca-select"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
            >
              <option value="">-- ไม่ระบุงาน --</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.name}
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field label="หมายเหตุ">
          <input
            className="ca-input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Field>
      </form>
    </Modal>
  );
}

function MovementLog({ txns, equipTxns, jobs }) {
  const combined = [
    ...txns.map((t) => ({ ...t, kind: 'material', itemName: t.stockName })),
    ...equipTxns.map((t) => ({
      ...t,
      kind: 'equipment',
      itemName: t.equipmentName,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (combined.length === 0)
    return (
      <div className="ca-panel">
        <div className="ca-panel-body">
          <EmptyState
            icon={ClipboardList}
            text="ยังไม่มีประวัติการเคลื่อนไหว"
          />
        </div>
      </div>
    );

  const ACTION = {
    receive: ['รับเข้า', 'green'],
    issue: ['เบิกใช้', 'amber'],
    checkout: ['เบิกไปใช้งาน', 'amber'],
    return: ['คืนเข้าคลัง', 'green'],
  };

  return (
    <div className="ca-panel">
      <div className="ca-panel-body" style={{ padding: 0 }}>
        <table className="ca-table">
          <thead>
            <tr>
              <th>วันที่</th>
              <th>ประเภทพัสดุ</th>
              <th>รายการ</th>
              <th>การเคลื่อนไหว</th>
              <th>จำนวน</th>
              <th>มูลค่า</th>
              <th>งานที่เกี่ยวข้อง</th>
              <th>หมายเหตุ</th>
            </tr>
          </thead>
          <tbody>
            {combined.map((t) => {
              const job = jobs.find((j) => j.id === t.jobId);
              const [label, tone] = ACTION[t.type] || [t.type, 'grey'];
              return (
                <tr key={t.kind + t.id}>
                  <td className="ca-mono">{fmtDate(t.date)}</td>
                  <td>
                    <Badge tone={t.kind === 'material' ? 'navy' : 'grey'}>
                      {t.kind === 'material' ? 'วัสดุ' : 'เครื่องมือ'}
                    </Badge>
                  </td>
                  <td>{t.itemName}</td>
                  <td>
                    <Badge tone={tone}>{label}</Badge>
                  </td>
                  <td className="ca-num">
                    {fmtNum(t.qty)} {t.unit}
                  </td>
                  <td className="ca-num">
                    {t.kind === 'material' ? fmtTHB(t.qty * t.unitCost) : '-'}
                  </td>
                  <td>{job ? job.name : '-'}</td>
                  <td style={{ color: 'var(--muted)' }}>{t.note || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Equipment / tools panel                                                */
/* ---------------------------------------------------------------------- */

function EquipmentPanel({
  equipment,
  saveEquipment,
  equipTxns,
  saveEquipTxns,
  jobs,
}) {
  const [query, setQuery] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [txnFor, setTxnFor] = useState(null);
  const [showBulkImport, setShowBulkImport] = useState(false);

  const filtered = equipment.filter((it) =>
    (it.name + it.code + it.category)
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  function openNew() {
    setEditItem({
      id: uid(),
      code: '',
      name: '',
      category: EQUIPMENT_CATEGORIES[0],
      unit: EQUIPMENT_UNITS[0],
      qtyTotal: 1,
      purchasePrice: 0,
      condition: 'good',
      notes: '',
    });
    setShowForm(true);
  }
  function openEdit(it) {
    setEditItem({ ...it });
    setShowForm(true);
  }
  function remove(id) {
    saveEquipment(equipment.filter((e) => e.id !== id));
  }

  function submitForm(e) {
    e.preventDefault();
    const existing = equipment.find((x) => x.id === editItem.id);
    if (existing) {
      const deltaTotal = Number(editItem.qtyTotal) - Number(existing.qtyTotal);
      const updated = {
        ...editItem,
        qtyAvailable: Math.max(0, Number(existing.qtyAvailable) + deltaTotal),
      };
      saveEquipment(equipment.map((x) => (x.id === editItem.id ? updated : x)));
    } else {
      saveEquipment([
        ...equipment,
        { ...editItem, qtyAvailable: Number(editItem.qtyTotal) },
      ]);
    }
    setShowForm(false);
  }

  function submitTxn(txn) {
    const item = txnFor;
    const delta = txn.type === 'checkout' ? -Number(txn.qty) : Number(txn.qty);
    saveEquipment(
      equipment.map((e) =>
        e.id === item.id
          ? {
              ...e,
              qtyAvailable: Math.max(
                0,
                Math.min(Number(e.qtyTotal), Number(e.qtyAvailable) + delta)
              ),
              condition:
                txn.type === 'return' && txn.condition
                  ? txn.condition
                  : e.condition,
            }
          : e
      )
    );
    saveEquipTxns([
      {
        ...txn,
        id: uid(),
        equipmentId: item.id,
        equipmentName: item.name,
        unit: item.unit,
        date: todayISO(),
      },
      ...equipTxns,
    ]);
    setTxnFor(null);
  }

  function importItems(items) {
    const newItems = items.map((it, i) => ({
      id: uid(),
      code: `TL-${String(equipment.length + i + 1).padStart(3, '0')}`,
      name: it.name,
      category: it.category,
      unit: it.unit,
      qtyTotal: Number(it.qtyTotal) || 1,
      qtyAvailable: Number(it.qtyTotal) || 1,
      purchasePrice: Number(it.price) || 0,
      condition: 'good',
      notes: '',
    }));
    saveEquipment([...equipment, ...newItems]);
    setShowBulkImport(false);
  }

  return (
    <>
      <div className="ca-toolbar">
        <div className="ca-search">
          <Search size={15} />
          <input
            className="ca-input"
            placeholder="ค้นหาเครื่องมือ..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div style={{ flex: 1 }} />
        <button
          className="ca-btn ca-btn-outline"
          onClick={() => setShowBulkImport(true)}
        >
          <ClipboardList size={15} /> นำเข้าหลายรายการ
        </button>
        <button className="ca-btn ca-btn-primary" onClick={openNew}>
          <Plus size={15} /> เพิ่มเครื่องมือ/อุปกรณ์
        </button>
      </div>

      <div className="ca-panel">
        <div className="ca-panel-body" style={{ padding: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 20 }}>
              <EmptyState
                icon={Wrench}
                text="ยังไม่มีรายการเครื่องมือ-อุปกรณ์"
                action={
                  <button
                    className="ca-btn ca-btn-primary ca-btn-sm"
                    onClick={openNew}
                  >
                    เพิ่มรายการแรก
                  </button>
                }
              />
            </div>
          ) : (
            <table className="ca-table">
              <thead>
                <tr>
                  <th>รหัส</th>
                  <th>ชื่ออุปกรณ์</th>
                  <th>หมวดหมู่</th>
                  <th>พร้อมใช้งาน / ทั้งหมด</th>
                  <th>สภาพ</th>
                  <th>มูลค่า/ชิ้น</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((it) => {
                  const out = Number(it.qtyTotal) - Number(it.qtyAvailable);
                  return (
                    <tr key={it.id}>
                      <td className="ca-mono">{it.code || '-'}</td>
                      <td>{it.name}</td>
                      <td>
                        <Badge tone="grey">{it.category}</Badge>
                      </td>
                      <td
                        className="ca-num"
                        style={
                          out > 0
                            ? { color: 'var(--amber-dark)', fontWeight: 700 }
                            : undefined
                        }
                      >
                        {fmtNum(it.qtyAvailable)} / {fmtNum(it.qtyTotal)}{' '}
                        {it.unit}
                      </td>
                      <td>
                        <Badge
                          tone={
                            it.condition === 'damaged'
                              ? 'red'
                              : it.condition === 'repair'
                              ? 'amber'
                              : 'green'
                          }
                        >
                          {EQUIPMENT_CONDITIONS[it.condition] ||
                            EQUIPMENT_CONDITIONS.good}
                        </Badge>
                      </td>
                      <td className="ca-num">{fmtTHB(it.purchasePrice)}</td>
                      <td>
                        <div
                          style={{
                            display: 'flex',
                            gap: 2,
                            justifyContent: 'flex-end',
                          }}
                        >
                          <button
                            className="ca-icon-btn"
                            title="เบิก/คืน"
                            onClick={() => setTxnFor(it)}
                          >
                            <PackageCheck size={15} />
                          </button>
                          <button
                            className="ca-icon-btn"
                            title="แก้ไข"
                            onClick={() => openEdit(it)}
                          >
                            <Pencil size={15} />
                          </button>
                          <ConfirmDelete onConfirm={() => remove(it.id)} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showForm && (
        <Modal
          title={
            equipment.some((s) => s.id === editItem.id)
              ? 'แก้ไขเครื่องมือ/อุปกรณ์'
              : 'เพิ่มเครื่องมือ/อุปกรณ์ใหม่'
          }
          onClose={() => setShowForm(false)}
          footer={
            <>
              <button
                className="ca-btn ca-btn-outline"
                onClick={() => setShowForm(false)}
              >
                ยกเลิก
              </button>
              <button className="ca-btn ca-btn-primary" onClick={submitForm}>
                บันทึก
              </button>
            </>
          }
        >
          <form onSubmit={submitForm}>
            <div className="ca-row">
              <Field label="รหัสอุปกรณ์">
                <input
                  className="ca-input"
                  value={editItem.code}
                  onChange={(e) =>
                    setEditItem({ ...editItem, code: e.target.value })
                  }
                  placeholder="เช่น TL-001"
                />
              </Field>
              <Field label="หมวดหมู่">
                <select
                  className="ca-select"
                  value={editItem.category}
                  onChange={(e) =>
                    setEditItem({ ...editItem, category: e.target.value })
                  }
                >
                  {EQUIPMENT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="ชื่ออุปกรณ์">
              <input
                className="ca-input"
                required
                value={editItem.name}
                onChange={(e) =>
                  setEditItem({ ...editItem, name: e.target.value })
                }
                placeholder="เช่น สว่านโรตารี่"
              />
            </Field>
            <div className="ca-row">
              <Field label="หน่วยนับ">
                <select
                  className="ca-select"
                  value={editItem.unit}
                  onChange={(e) =>
                    setEditItem({ ...editItem, unit: e.target.value })
                  }
                >
                  {EQUIPMENT_UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="จำนวนที่มีทั้งหมด">
                <input
                  type="number"
                  step="any"
                  className="ca-input"
                  value={editItem.qtyTotal}
                  onChange={(e) =>
                    setEditItem({ ...editItem, qtyTotal: e.target.value })
                  }
                />
              </Field>
              <Field label="สภาพ">
                <select
                  className="ca-select"
                  value={editItem.condition}
                  onChange={(e) =>
                    setEditItem({ ...editItem, condition: e.target.value })
                  }
                >
                  {Object.entries(EQUIPMENT_CONDITIONS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="ca-row">
              <Field label="มูลค่าซื้อ/ชิ้น (บาท)">
                <input
                  type="number"
                  step="any"
                  className="ca-input"
                  value={editItem.purchasePrice}
                  onChange={(e) =>
                    setEditItem({ ...editItem, purchasePrice: e.target.value })
                  }
                />
              </Field>
              <Field label="หมายเหตุ">
                <input
                  className="ca-input"
                  value={editItem.notes}
                  onChange={(e) =>
                    setEditItem({ ...editItem, notes: e.target.value })
                  }
                />
              </Field>
            </div>
          </form>
        </Modal>
      )}

      {txnFor && (
        <EquipmentTxnModal
          item={txnFor}
          jobs={jobs}
          onClose={() => setTxnFor(null)}
          onSubmit={submitTxn}
        />
      )}
      {showBulkImport && (
        <BulkImportModal
          onClose={() => setShowBulkImport(false)}
          onImport={importItems}
        />
      )}
    </>
  );
}

function BulkImportModal({ onClose, onImport }) {
  const [text, setText] = useState('');
  const [rows, setRows] = useState(null); // null = not parsed yet

  function parse() {
    setRows(parseBulkEquipmentText(text));
  }
  function updateRow(id, patch) {
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function removeRow(id) {
    setRows(rows.filter((r) => r.id !== id));
  }

  return (
    <Modal
      wide
      title="นำเข้าเครื่องมือ/อุปกรณ์หลายรายการ"
      onClose={onClose}
      footer={
        rows ? (
          <>
            <button
              className="ca-btn ca-btn-outline"
              onClick={() => setRows(null)}
            >
              ย้อนกลับ
            </button>
            <button
              className="ca-btn ca-btn-primary"
              onClick={() => onImport(rows)}
            >
              เพิ่มทั้งหมด ({rows.length} รายการ)
            </button>
          </>
        ) : (
          <>
            <button className="ca-btn ca-btn-outline" onClick={onClose}>
              ยกเลิก
            </button>
            <button
              className="ca-btn ca-btn-primary"
              onClick={parse}
              disabled={!text.trim()}
            >
              แยกรายการ
            </button>
          </>
        )
      }
    >
      {!rows ? (
        <>
          <div className="ca-hint" style={{ marginBottom: 8 }}>
            วางรายการที่คัดลอกมา บรรทัดละ 1 รายการ
            ระบบจะพยายามแยกชื่อสินค้าและราคาให้อัตโนมัติ (รองรับรูปแบบ
            "ชื่อสินค้า ราคา 1,234 บาท")
          </div>
          <textarea
            className="ca-input"
            rows={12}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              'MAKITA 16 Linesราคา 2,292 บาท\n(แพ็ค4) MOLITA สว่านไร้สาย 3 ระบบ 299Vราคา3,063บาท\n...'
            }
          />
        </>
      ) : (
        <>
          <div className="ca-hint" style={{ marginBottom: 10 }}>
            ตรวจสอบและแก้ไขรายการก่อนเพิ่มเข้าคลัง (แก้ชื่อ/ราคา/หมวดหมู่ได้)
          </div>
          {rows.length === 0 ? (
            <EmptyState
              icon={Wrench}
              text="ไม่พบรายการที่แยกได้ ลองย้อนกลับไปแก้ข้อความ"
            />
          ) : (
            <table className="ca-table">
              <thead>
                <tr>
                  <th>ชื่อรายการ</th>
                  <th style={{ width: 150 }}>หมวดหมู่</th>
                  <th style={{ width: 110 }}>ราคา</th>
                  <th style={{ width: 90 }}>จำนวน</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <input
                        className="ca-input"
                        value={r.name}
                        onChange={(e) =>
                          updateRow(r.id, { name: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <select
                        className="ca-select"
                        value={r.category}
                        onChange={(e) =>
                          updateRow(r.id, { category: e.target.value })
                        }
                      >
                        {EQUIPMENT_CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        step="any"
                        className="ca-input ca-num"
                        value={r.price}
                        onChange={(e) =>
                          updateRow(r.id, { price: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="any"
                        className="ca-input ca-num"
                        value={r.qtyTotal}
                        onChange={(e) =>
                          updateRow(r.id, { qtyTotal: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="ca-line-remove"
                        onClick={() => removeRow(r.id)}
                      >
                        <X size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </Modal>
  );
}

function EquipmentTxnModal({ item, jobs, onClose, onSubmit }) {
  const [type, setType] = useState('checkout');
  const [qty, setQty] = useState('');
  const [jobId, setJobId] = useState('');
  const [condition, setCondition] = useState(item.condition || 'good');
  const [note, setNote] = useState('');

  function submit(e) {
    e.preventDefault();
    if (!qty || Number(qty) <= 0) return;
    onSubmit({
      type,
      qty: Number(qty),
      jobId: jobId || null,
      condition: type === 'return' ? condition : undefined,
      note,
    });
  }

  return (
    <Modal
      title={`เบิก/คืน: ${item.name}`}
      onClose={onClose}
      footer={
        <>
          <button className="ca-btn ca-btn-outline" onClick={onClose}>
            ยกเลิก
          </button>
          <button className="ca-btn ca-btn-primary" onClick={submit}>
            บันทึกรายการ
          </button>
        </>
      }
    >
      <form onSubmit={submit}>
        <div className="ca-row" style={{ marginBottom: 13 }}>
          <button
            type="button"
            className={
              'ca-btn ' +
              (type === 'checkout' ? 'ca-btn-primary' : 'ca-btn-outline')
            }
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => setType('checkout')}
          >
            <ArrowUpFromLine size={15} /> เบิกไปใช้งาน
          </button>
          <button
            type="button"
            className={
              'ca-btn ' +
              (type === 'return' ? 'ca-btn-primary' : 'ca-btn-outline')
            }
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => setType('return')}
          >
            <ArrowDownToLine size={15} /> คืนเข้าคลัง
          </button>
        </div>
        <div className="ca-row">
          <Field
            label={`จำนวน (${item.unit})`}
            hint={
              type === 'checkout'
                ? `พร้อมใช้งาน ${fmtNum(item.qtyAvailable)} ${item.unit}`
                : undefined
            }
          >
            <input
              autoFocus
              type="number"
              step="any"
              className="ca-input"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </Field>
          <Field label="งานที่เกี่ยวข้อง (ไม่บังคับ)">
            <select
              className="ca-select"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
            >
              <option value="">-- ไม่ระบุงาน --</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        {type === 'return' && (
          <Field label="สภาพเมื่อคืน">
            <select
              className="ca-select"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              {Object.entries(EQUIPMENT_CONDITIONS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field label="หมายเหตุ">
          <input
            className="ca-input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Field>
      </form>
    </Modal>
  );
}

/* ---------------------------------------------------------------------- */
/* Quotations view                                                        */
/* ---------------------------------------------------------------------- */

function nextDocNo(quotes) {
  const year = new Date().getFullYear() + 543; // Thai Buddhist year, common on Thai documents
  const prefix = `QT${year}-`;
  const nums = quotes
    .filter((q) => q.docNo && q.docNo.startsWith(prefix))
    .map((q) => parseInt(q.docNo.slice(prefix.length), 10))
    .filter((n) => !isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `${prefix}${String(next).padStart(4, '0')}`;
}

function blankQuote(quotes) {
  return {
    id: uid(),
    docNo: nextDocNo(quotes),
    date: todayISO(),
    customerName: '',
    customerAddress: '',
    jobName: '',
    items: [],
    vatEnabled: true,
    discount: 0,
    status: 'draft',
    notes: '',
  };
}

function QuotationsView({
  quotes,
  saveQuotes,
  stock,
  jobs,
  saveJobs,
  settings,
  onOpenSettings,
}) {
  const [editQuote, setEditQuote] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [printQuote, setPrintQuote] = useState(null);

  function openNew() {
    setEditQuote(blankQuote(quotes));
    setShowForm(true);
  }
  function openEdit(q) {
    setEditQuote(JSON.parse(JSON.stringify(q)));
    setShowForm(true);
  }
  function remove(id) {
    saveQuotes(quotes.filter((q) => q.id !== id));
  }
  function submit(q) {
    const exists = quotes.some((x) => x.id === q.id);
    saveQuotes(
      exists ? quotes.map((x) => (x.id === q.id ? q : x)) : [...quotes, q]
    );
    setShowForm(false);
  }
  // Every line of the quotation becomes its own budget line in the job — each one
  // keeps a reference back to its stock item (if any) and to the quotation line it
  // came from, so material/labor planned here can be traced through to actual P&L.
  function convertToJob(q) {
    const t = computeQuoteTotals(q);
    const budgetItems = (q.items || []).map((it) => ({
      id: uid(),
      category:
        it.type === 'material'
          ? 'วัสดุ (ประมาณการ)'
          : it.type === 'labor'
          ? 'ค่าแรง'
          : 'อื่นๆ',
      description: it.description || ITEM_TYPE_LABEL[it.type],
      budgetedCost: (Number(it.qty) || 0) * (Number(it.unitCost) || 0),
      actualCost: 0,
      stockId: it.stockId || null,
      quoteItemId: it.id,
    }));
    const job = {
      id: uid(),
      name: q.jobName || q.customerName || 'งานใหม่',
      customer: q.customerName,
      quotationId: q.id,
      revenue: t.subtotal - t.discount,
      status: 'ongoing',
      startDate: todayISO(),
      budgetItems,
    };
    saveJobs([...jobs, job]);
    saveQuotes(
      quotes.map((x) => (x.id === q.id ? { ...x, status: 'accepted' } : x))
    );
  }

  return (
    <div>
      <TitleBlock
        eyebrow="เอกสารเสนองาน"
        title="ใบเสนอราคา"
        fields={[
          ['จำนวนใบเสนอราคา', quotes.length],
          ['ตอบรับแล้ว', quotes.filter((q) => q.status === 'accepted').length],
        ]}
      />

      <div className="ca-toolbar">
        <div style={{ flex: 1 }} />
        <button className="ca-btn ca-btn-primary" onClick={openNew}>
          <Plus size={15} /> สร้างใบเสนอราคา
        </button>
      </div>

      <div className="ca-panel">
        <div className="ca-panel-body" style={{ padding: 0 }}>
          {quotes.length === 0 ? (
            <div style={{ padding: 20 }}>
              <EmptyState
                icon={FileText}
                text="ยังไม่มีใบเสนอราคา"
                action={
                  <button
                    className="ca-btn ca-btn-primary ca-btn-sm"
                    onClick={openNew}
                  >
                    สร้างใบแรก
                  </button>
                }
              />
            </div>
          ) : (
            <table className="ca-table">
              <thead>
                <tr>
                  <th>เลขที่</th>
                  <th>วันที่</th>
                  <th>ลูกค้า / งาน</th>
                  <th>ยอดรวม</th>
                  <th>กำไรโดยประมาณ</th>
                  <th>สถานะ</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {quotes
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.date) - new Date(a.date) ||
                      (b.docNo || '').localeCompare(a.docNo || '')
                  )
                  .map((q) => {
                    const t = computeQuoteTotals(q);
                    const linkedJob = jobs.find((j) => j.quotationId === q.id);
                    return (
                      <tr key={q.id}>
                        <td className="ca-mono">{q.docNo}</td>
                        <td className="ca-mono">{fmtDate(q.date)}</td>
                        <td>
                          {q.customerName || '-'}
                          <div
                            style={{ fontSize: 11.5, color: 'var(--muted)' }}
                          >
                            {q.jobName}
                          </div>
                          {linkedJob && (
                            <div style={{ marginTop: 3 }}>
                              <Badge tone="green">
                                <Link2 size={11} /> เชื่อมกับงาน:{' '}
                                {linkedJob.name}
                              </Badge>
                            </div>
                          )}
                        </td>
                        <td className="ca-num">{fmtTHB(t.grandTotal)}</td>
                        <td
                          className="ca-num"
                          style={{
                            color:
                              t.estMargin >= 0 ? 'var(--green)' : 'var(--red)',
                          }}
                        >
                          {fmtTHB(t.estMargin)} ({fmtNum(t.estMarginPct)}%)
                        </td>
                        <td>
                          <StatusBadge status={q.status} kind="quote" />
                        </td>
                        <td>
                          <div
                            style={{
                              display: 'flex',
                              gap: 2,
                              justifyContent: 'flex-end',
                            }}
                          >
                            {q.status === 'accepted' && !linkedJob && (
                              <button
                                className="ca-btn ca-btn-outline ca-btn-sm"
                                onClick={() => convertToJob(q)}
                              >
                                <Link2 size={13} /> แปลงเป็นงาน
                              </button>
                            )}
                            <button
                              className="ca-icon-btn"
                              title="พิมพ์"
                              onClick={() => setPrintQuote(q)}
                            >
                              <Printer size={15} />
                            </button>
                            <button
                              className="ca-icon-btn"
                              title="แก้ไข"
                              onClick={() => openEdit(q)}
                            >
                              <Pencil size={15} />
                            </button>
                            <ConfirmDelete onConfirm={() => remove(q.id)} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showForm && (
        <QuoteForm
          quote={editQuote}
          stock={stock}
          settings={settings}
          onOpenSettings={onOpenSettings}
          onCancel={() => setShowForm(false)}
          onSave={submit}
        />
      )}
      {printQuote && (
        <QuotePrintView
          quote={printQuote}
          settings={settings}
          onClose={() => setPrintQuote(null)}
        />
      )}
    </div>
  );
}

const ITEM_TYPE_LABEL = { material: 'วัสดุ', labor: 'ค่าแรง', other: 'อื่นๆ' };

function QuoteForm({
  quote,
  stock,
  settings,
  onOpenSettings,
  onCancel,
  onSave,
}) {
  const [q, setQ] = useState(quote);
  const totals = computeQuoteTotals(q);
  const s = settings || {};
  const hasBank = s.bankName || s.bankAccountNo || s.bankAccountName;

  function addItem(fromStock) {
    const base = {
      id: uid(),
      type: 'material',
      description: '',
      unit: 'ชิ้น',
      qty: 1,
      unitCost: 0,
      unitPrice: 0,
    };
    if (fromStock) {
      const item = stock.find((s) => s.id === fromStock);
      if (item)
        Object.assign(base, {
          description: item.name,
          unit: item.unit,
          unitCost: item.costPrice,
          unitPrice: item.sellPrice || item.costPrice,
          stockId: item.id,
        });
    }
    setQ({ ...q, items: [...q.items, base] });
  }
  function updateItem(id, patch) {
    setQ({
      ...q,
      items: q.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    });
  }
  function removeItem(id) {
    setQ({ ...q, items: q.items.filter((it) => it.id !== id) });
  }

  return (
    <Modal
      wide
      title={quote.docNo}
      onClose={onCancel}
      footer={
        <>
          <button className="ca-btn ca-btn-outline" onClick={onCancel}>
            ยกเลิก
          </button>
          <button className="ca-btn ca-btn-primary" onClick={() => onSave(q)}>
            บันทึกใบเสนอราคา
          </button>
        </>
      }
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: hasBank ? 'rgba(173,138,50,.08)' : 'var(--panel-hover)',
          border:
            '1px solid ' + (hasBank ? 'rgba(173,138,50,.3)' : 'var(--border)'),
          borderRadius: 6,
          padding: '8px 12px',
          marginBottom: 14,
          fontSize: 12.5,
        }}
      >
        {hasBank ? (
          <span>
            บัญชีรับเงินที่จะแสดงบนใบนี้: <b>{s.bankName}</b>{' '}
            {s.bankAccountName ? `· ${s.bankAccountName}` : ''} ·{' '}
            <span className="ca-mono">{s.bankAccountNo}</span>
          </span>
        ) : (
          <span style={{ color: 'var(--muted)' }}>
            ยังไม่ได้ตั้งค่าบัญชีรับเงิน — ใบเสนอราคาจะไม่แสดงเลขที่บัญชี
          </span>
        )}
        {onOpenSettings && (
          <button
            type="button"
            className="ca-btn ca-btn-outline ca-btn-sm"
            onClick={onOpenSettings}
          >
            {hasBank ? 'แก้ไข' : 'ตั้งค่าเลย'}
          </button>
        )}
      </div>
      <div className="ca-row">
        <Field label="ชื่อลูกค้า">
          <input
            className="ca-input"
            value={q.customerName}
            onChange={(e) => setQ({ ...q, customerName: e.target.value })}
          />
        </Field>
        <Field label="ชื่องาน / โครงการ">
          <input
            className="ca-input"
            value={q.jobName}
            onChange={(e) => setQ({ ...q, jobName: e.target.value })}
          />
        </Field>
      </div>
      <div className="ca-row">
        <Field label="ที่อยู่ลูกค้า">
          <input
            className="ca-input"
            value={q.customerAddress}
            onChange={(e) => setQ({ ...q, customerAddress: e.target.value })}
          />
        </Field>
        <Field label="วันที่">
          <input
            type="date"
            className="ca-input"
            value={q.date}
            onChange={(e) => setQ({ ...q, date: e.target.value })}
          />
        </Field>
        <Field label="สถานะ">
          <select
            className="ca-select"
            value={q.status}
            onChange={(e) => setQ({ ...q, status: e.target.value })}
          >
            <option value="draft">ร่าง</option>
            <option value="sent">ส่งแล้ว</option>
            <option value="accepted">ตอบรับแล้ว</option>
            <option value="rejected">ปฏิเสธ</option>
          </select>
        </Field>
      </div>

      <div className="ca-divider" />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <div className="ca-panel-title" style={{ fontSize: 14 }}>
          รายการ
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <select
            className="ca-select"
            style={{ width: 240 }}
            onChange={(e) => {
              if (e.target.value) {
                addItem(e.target.value);
                e.target.value = '';
              }
            }}
          >
            <option value="">+ เลือกจากสต๊อค...</option>
            {stock.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (คงเหลือ {fmtNum(s.qty)} {s.unit})
              </option>
            ))}
          </select>
          <button
            type="button"
            className="ca-btn ca-btn-outline ca-btn-sm"
            onClick={() => addItem(null)}
          >
            <Plus size={14} /> เพิ่มรายการ
          </button>
        </div>
      </div>

      {q.items.length === 0 ? (
        <EmptyState
          icon={FileText}
          text={'ยังไม่มีรายการ กด "เพิ่มรายการ" เพื่อเริ่ม'}
        />
      ) : (
        <table className="ca-table">
          <thead>
            <tr>
              <th>ประเภท</th>
              <th>รายละเอียด</th>
              <th>หน่วย</th>
              <th style={{ width: 70 }}>จำนวน</th>
              <th style={{ width: 100 }}>ต้นทุน/หน่วย</th>
              <th style={{ width: 100 }}>ราคาขาย/หน่วย</th>
              <th style={{ width: 100 }}>รวม</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {q.items.map((it) => {
              const linkedStock = it.stockId
                ? stock.find((s) => s.id === it.stockId)
                : null;
              const overStock =
                linkedStock && Number(it.qty) > Number(linkedStock.qty);
              return (
                <tr key={it.id}>
                  <td>
                    <select
                      className="ca-select"
                      value={it.type}
                      onChange={(e) =>
                        updateItem(it.id, { type: e.target.value })
                      }
                    >
                      {Object.entries(ITEM_TYPE_LABEL).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      className="ca-input"
                      value={it.description}
                      onChange={(e) =>
                        updateItem(it.id, { description: e.target.value })
                      }
                    />
                    {linkedStock && (
                      <div
                        style={{
                          fontSize: 11,
                          marginTop: 3,
                          color: overStock ? 'var(--red)' : 'var(--muted)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        <Link2 size={10} /> เชื่อมกับสต๊อค — คงเหลือ{' '}
                        {fmtNum(linkedStock.qty)} {linkedStock.unit}
                        {overStock && <> — เกินสต๊อคที่มี!</>}
                      </div>
                    )}
                  </td>
                  <td>
                    <input
                      className="ca-input"
                      value={it.unit}
                      onChange={(e) =>
                        updateItem(it.id, { unit: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="any"
                      className="ca-input ca-num"
                      value={it.qty}
                      onChange={(e) =>
                        updateItem(it.id, { qty: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="any"
                      className="ca-input ca-num"
                      value={it.unitCost}
                      onChange={(e) =>
                        updateItem(it.id, { unitCost: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="any"
                      className="ca-input ca-num"
                      value={it.unitPrice}
                      onChange={(e) =>
                        updateItem(it.id, { unitPrice: e.target.value })
                      }
                    />
                  </td>
                  <td className="ca-num">{fmtTHB(it.qty * it.unitPrice)}</td>
                  <td>
                    <button
                      type="button"
                      className="ca-line-remove"
                      onClick={() => removeItem(it.id)}
                    >
                      <X size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className="ca-divider" />
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <Field label="หมายเหตุ">
            <textarea
              className="ca-input"
              rows={3}
              value={q.notes}
              onChange={(e) => setQ({ ...q, notes: e.target.value })}
            />
          </Field>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              fontSize: 13.5,
              fontWeight: 600,
              color: 'var(--navy)',
            }}
          >
            <input
              type="checkbox"
              checked={q.vatEnabled}
              onChange={(e) => setQ({ ...q, vatEnabled: e.target.checked })}
            />{' '}
            คิดภาษีมูลค่าเพิ่ม 7%
          </label>
        </div>
        <div className="ca-totals">
          <div className="ca-totals-row">
            <span>ยอดรวมก่อนภาษี</span>
            <span className="ca-mono">{fmtTHB(totals.subtotal)}</span>
          </div>
          <div className="ca-totals-row">
            <span>ส่วนลด</span>
            <span className="ca-mono">
              <input
                type="number"
                step="any"
                style={{
                  width: 90,
                  textAlign: 'right',
                  border: '1px solid var(--border)',
                  borderRadius: 5,
                  padding: '2px 6px',
                }}
                value={q.discount}
                onChange={(e) => setQ({ ...q, discount: e.target.value })}
              />
            </span>
          </div>
          {q.vatEnabled && (
            <div className="ca-totals-row">
              <span>ภาษีมูลค่าเพิ่ม 7%</span>
              <span className="ca-mono">{fmtTHB(totals.vat)}</span>
            </div>
          )}
          <div className="ca-totals-row grand">
            <span>ยอดสุทธิ</span>
            <span className="ca-mono">{fmtTHB(totals.grandTotal)}</span>
          </div>
          <div
            className="ca-totals-row"
            style={{
              color: totals.estMargin >= 0 ? 'var(--green)' : 'var(--red)',
            }}
          >
            <span>กำไรโดยประมาณ</span>
            <span className="ca-mono">{fmtTHB(totals.estMargin)}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function escapeHTML(s) {
  return String(s ?? '').replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[
        c
      ])
  );
}

// Builds a fully standalone HTML document (fonts + styles inline/linked, no app
// dependencies) so it can be downloaded and opened directly in any browser —
// completely outside the artifact preview — and printed to PDF from there.
function buildQuotePrintHTML(quote, settings = {}) {
  const t = computeQuoteTotals(quote);
  const rows = (quote.items || [])
    .map(
      (it, i) => `
    <tr>
      <td style="text-align:center">${i + 1}</td>
      <td style="text-align:center">${escapeHTML(it.description)}</td>
      <td style="text-align:center">${fmtNum(it.qty)}</td>
      <td style="text-align:center">${escapeHTML(it.unit)}</td>
      <td style="text-align:center">${fmtBaht(it.unitPrice)}</td>
      <td style="text-align:center">${fmtBaht(it.qty * it.unitPrice)}</td>
    </tr>`
    )
    .join('');

  const hasBank =
    settings.bankName || settings.bankAccountNo || settings.bankAccountName;

  return `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<title>ใบเสนอราคา ${escapeHTML(quote.docNo)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700&family=Kanit:wght@600;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 16mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Sarabun', sans-serif; color: #1C2530; margin: 0; padding: 24px; max-width: 820px; margin: 0 auto; }
  .head { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #1C2530; padding-bottom:14px; margin-bottom:18px; }
  .head-left { display:flex; gap:12px; align-items:flex-start; }
  .head-logo { width:44px; height:44px; object-fit:contain; flex-shrink:0; }
  .company { font-family:'Kanit',sans-serif; font-size:17px; font-weight:700; }
  .company-sub { color:#65727A; font-size:12px; margin-top:2px; }
  .title { font-family:'Kanit',sans-serif; font-size:20px; font-weight:700; margin-top:8px; }
  .sub { color:#65727A; font-size:12.5px; }
  .meta { text-align:right; font-size:13px; white-space:nowrap; }
  .parties { display:flex; gap:24px; margin-bottom:18px; }
  .parties > div { flex:1; }
  .label { font-size:11.5px; color:#65727A; font-weight:600; margin-bottom:2px; }
  table { width:100%; border-collapse:collapse; font-size:13.5px; border:1px solid #C9C2B4; }
  th { text-align:center; font-size:11px; text-transform:uppercase; color:#453B2E; background:#F3F1EC; border:1px solid #C9C2B4; padding:8px 6px; }
  td { padding:8px 6px; border:1px solid #DAD4C6; text-align:center; }
  .totals { width:280px; margin-left:auto; margin-top:12px; }
  .totals .row { display:flex; justify-content:space-between; padding:3px 0; font-size:13.5px; }
  .totals .grand { font-weight:700; font-size:17px; border-top:1px solid #C9C2B4; margin-top:6px; padding-top:8px; }
  .payment { margin-top:22px; border:1px solid #AD8A32; border-radius:8px; padding:12px 16px; background:#FBF7EC; }
  .payment .label { color:#8C6F24; }
  .validity { margin-top:16px; font-size:12px; color:#65727A; border-top:1px dashed #C9C2B4; padding-top:10px; }
  .notes { margin-top:14px; font-size:12.5px; }
  .signatures { display:flex; gap:40px; margin-top:56px; }
  .signatures > div { flex:1; text-align:center; }
  .sig-line { border-top:1px solid #8A8272; margin-bottom:6px; padding-top:34px; }
  .sig-role { font-size:12.5px; font-weight:600; }
  .sig-sub { font-size:11px; color:#65727A; margin-top:2px; }
  .print-bar { text-align:center; margin-bottom:20px; }
  .print-bar button { font-family:'Sarabun',sans-serif; font-weight:600; background:#1C2126; color:#fff; border:none; padding:10px 20px; border-radius:6px; cursor:pointer; font-size:14px; }
  @media print { .print-bar { display:none; } body { padding:0; } }
</style>
</head>
<body>
  <div class="print-bar"><button onclick="window.print()">🖨️ พิมพ์ / บันทึกเป็น PDF</button></div>
  <div class="head">
    <div class="head-left">
      <img class="head-logo" src="${FATERRA_LOGO}" alt="" />
      <div>
        <div class="company">${
          escapeHTML(settings.companyName) || 'ใบเสนอราคา'
        }</div>
        ${
          settings.companyAddress
            ? `<div class="company-sub">${escapeHTML(
                settings.companyAddress
              )}</div>`
            : ''
        }
        ${
          settings.companyPhone || settings.companyTaxId
            ? `<div class="company-sub">${[
                settings.companyPhone &&
                  `โทร ${escapeHTML(settings.companyPhone)}`,
                settings.companyTaxId &&
                  `เลขผู้เสียภาษี ${escapeHTML(settings.companyTaxId)}`,
              ]
                .filter(Boolean)
                .join(' · ')}</div>`
            : ''
        }
        <div class="title">ใบเสนอราคา</div><div class="sub">QUOTATION</div>
      </div>
    </div>
    <div class="meta"><div>เลขที่: <b>${escapeHTML(
      quote.docNo
    )}</b></div><div>วันที่: <b>${fmtDate(quote.date)}</b></div></div>
  </div>
  <div class="parties">
    <div><div class="label">เสนอราคาให้</div><div style="font-weight:600">${
      escapeHTML(quote.customerName) || '-'
    }</div><div class="sub">${escapeHTML(quote.customerAddress)}</div></div>
    <div><div class="label">งาน / โครงการ</div><div style="font-weight:600">${
      escapeHTML(quote.jobName) || '-'
    }</div></div>
  </div>
  <table>
    <thead><tr><th>#</th><th>รายการ</th><th>จำนวน</th><th>หน่วย</th><th>ราคาต่อหน่วย</th><th>รวม</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="totals">
    <div class="row"><span>ยอดรวม</span><span>${fmtBaht(
      t.subtotal
    )}</span></div>
    ${
      t.discount > 0
        ? `<div class="row"><span>ส่วนลด</span><span>-${fmtBaht(
            t.discount
          )}</span></div>`
        : ''
    }
    ${
      quote.vatEnabled
        ? `<div class="row"><span>VAT 7%</span><span>${fmtBaht(
            t.vat
          )}</span></div>`
        : ''
    }
    <div class="row grand"><span>รวมทั้งสิ้น</span><span>${fmtBaht(
      t.grandTotal
    )}</span></div>
  </div>
  ${
    hasBank
      ? `<div class="payment">
    <div class="label">ชำระเงินโดยโอนเข้าบัญชี</div>
    <div style="font-weight:600; margin-top:3px;">${
      escapeHTML(settings.bankName) || '-'
    } ${
          settings.bankAccountName
            ? `· ${escapeHTML(settings.bankAccountName)}`
            : ''
        }</div>
    ${
      settings.bankAccountNo
        ? `<div style="font-family:'Sarabun',sans-serif; font-size:15px; font-weight:700; margin-top:2px; letter-spacing:.03em;">เลขที่บัญชี ${escapeHTML(
            settings.bankAccountNo
          )}</div>`
        : ''
    }
  </div>`
      : ''
  }
  ${
    quote.notes
      ? `<div class="notes"><b>หมายเหตุ:</b> ${escapeHTML(quote.notes)}</div>`
      : ''
  }
  <div class="validity">1. ต้องชำระมัดจำก่อนใช้บริการ 50%<br>2. ไม่สามารถขอเงินคืนได้</div>
  <div class="signatures">
    <div><div class="sig-line"></div><div class="sig-role">ผู้เสนอราคา</div><div class="sig-sub">วันที่ ....../....../......</div></div>
    <div><div class="sig-line"></div><div class="sig-role">ผู้อนุมัติ / ลูกค้า</div><div class="sig-sub">วันที่ ....../....../......</div></div>
  </div>
</body>
</html>`;
}

function downloadTextFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function QuotePrintView({ quote, settings, onClose }) {
  const t = computeQuoteTotals(quote);
  const s = settings || {};
  const hasBank = s.bankName || s.bankAccountNo || s.bankAccountName;
  return (
    <Modal
      wide
      title={`พิมพ์ใบเสนอราคา ${quote.docNo}`}
      onClose={onClose}
      footer={
        <>
          <button
            className="ca-btn ca-btn-outline ca-no-print"
            onClick={onClose}
          >
            ปิด
          </button>
          <button
            className="ca-btn ca-btn-outline ca-no-print"
            onClick={() => window.print()}
          >
            <Printer size={15} /> ลองพิมพ์ตรงนี้
          </button>
          <button
            className="ca-btn ca-btn-primary ca-no-print"
            onClick={() =>
              downloadTextFile(
                `${quote.docNo || 'quotation'}.html`,
                buildQuotePrintHTML(quote, s),
                'text/html'
              )
            }
          >
            <FileText size={15} /> ดาวน์โหลดไฟล์ (เปิด &amp; พิมพ์เป็น PDF)
          </button>
        </>
      }
    >
      <div
        className="ca-hint ca-no-print"
        style={{
          marginBottom: 14,
          background: 'rgba(173,138,50,.10)',
          border: '1px solid rgba(173,138,50,.35)',
          padding: '8px 12px',
          borderRadius: 6,
          color: 'var(--text)',
        }}
      >
        แนะนำให้กด <b>"ดาวน์โหลดไฟล์"</b> แล้วเปิดไฟล์ที่ได้ในเบราว์เซอร์
        (ดับเบิลคลิก หรือเปิดจากโฟลเดอร์ดาวน์โหลด)
        จากนั้นกดปุ่มพิมพ์ในหน้านั้นแล้วเลือกปลายทางเป็น "Save as PDF" —
        วิธีนี้ใช้ได้แน่นอนเพราะไม่ผูกกับหน้าต่างแชทนี้ ส่วนปุ่ม
        "ลองพิมพ์ตรงนี้" อาจใช้ไม่ได้ในบางอุปกรณ์เพราะข้อจำกัดของหน้าต่างแสดงผล
      </div>
      <div style={{ fontFamily: 'Sarabun' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '2px solid var(--navy)',
            paddingBottom: 12,
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <img
              src={FATERRA_LOGO}
              alt=""
              style={{
                width: 40,
                height: 40,
                objectFit: 'contain',
                flexShrink: 0,
              }}
            />
            <div>
              {s.companyName && (
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
                  {s.companyName}
                </div>
              )}
              {(s.companyPhone || s.companyTaxId) && (
                <div
                  style={{
                    fontSize: 11.5,
                    color: 'var(--muted)',
                    marginBottom: 6,
                  }}
                >
                  {[
                    s.companyPhone && `โทร ${s.companyPhone}`,
                    s.companyTaxId && `เลขผู้เสียภาษี ${s.companyTaxId}`,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </div>
              )}
              <div
                className="ca-display"
                style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy)' }}
              >
                ใบเสนอราคา
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 12.5 }}>
                QUOTATION
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 13 }}>
            <div>
              เลขที่: <b className="ca-mono">{quote.docNo}</b>
            </div>
            <div>
              วันที่: <b className="ca-mono">{fmtDate(quote.date)}</b>
            </div>
          </div>
        </div>
        <div className="ca-row" style={{ marginBottom: 16 }}>
          <div>
            <div
              style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 600 }}
            >
              เสนอราคาให้
            </div>
            <div style={{ fontWeight: 600 }}>{quote.customerName || '-'}</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>
              {quote.customerAddress}
            </div>
          </div>
          <div>
            <div
              style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 600 }}
            >
              งาน / โครงการ
            </div>
            <div style={{ fontWeight: 600 }}>{quote.jobName || '-'}</div>
          </div>
        </div>
        <table
          className="ca-table"
          style={{ border: '1px solid var(--border)' }}
        >
          <thead>
            <tr>
              <th
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--panel-hover)',
                  textAlign: 'center',
                }}
              >
                #
              </th>
              <th
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--panel-hover)',
                  textAlign: 'center',
                }}
              >
                รายการ
              </th>
              <th
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--panel-hover)',
                  textAlign: 'center',
                }}
              >
                จำนวน
              </th>
              <th
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--panel-hover)',
                  textAlign: 'center',
                }}
              >
                หน่วย
              </th>
              <th
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--panel-hover)',
                  textAlign: 'center',
                }}
              >
                ราคาต่อหน่วย
              </th>
              <th
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--panel-hover)',
                  textAlign: 'center',
                }}
              >
                รวม
              </th>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((it, i) => (
              <tr key={it.id}>
                <td
                  style={{
                    border: '1px solid var(--border)',
                    textAlign: 'center',
                  }}
                >
                  {i + 1}
                </td>
                <td
                  style={{
                    border: '1px solid var(--border)',
                    textAlign: 'center',
                  }}
                >
                  {it.description}
                </td>
                <td
                  style={{
                    border: '1px solid var(--border)',
                    textAlign: 'center',
                  }}
                >
                  {fmtNum(it.qty)}
                </td>
                <td
                  style={{
                    border: '1px solid var(--border)',
                    textAlign: 'center',
                  }}
                >
                  {it.unit}
                </td>
                <td
                  style={{
                    border: '1px solid var(--border)',
                    textAlign: 'center',
                  }}
                >
                  {fmtBaht(it.unitPrice)}
                </td>
                <td
                  style={{
                    border: '1px solid var(--border)',
                    textAlign: 'center',
                  }}
                >
                  {fmtBaht(it.qty * it.unitPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="ca-totals" style={{ marginTop: 10 }}>
          <div className="ca-totals-row">
            <span>ยอดรวม</span>
            <span className="ca-mono">{fmtBaht(t.subtotal)}</span>
          </div>
          {t.discount > 0 && (
            <div className="ca-totals-row">
              <span>ส่วนลด</span>
              <span className="ca-mono">-{fmtBaht(t.discount)}</span>
            </div>
          )}
          {quote.vatEnabled && (
            <div className="ca-totals-row">
              <span>VAT 7%</span>
              <span className="ca-mono">{fmtBaht(t.vat)}</span>
            </div>
          )}
          <div className="ca-totals-row grand">
            <span>รวมทั้งสิ้น</span>
            <span className="ca-mono">{fmtBaht(t.grandTotal)}</span>
          </div>
        </div>
        {hasBank && (
          <div
            style={{
              marginTop: 18,
              border: '1px solid var(--amber)',
              borderRadius: 8,
              padding: '10px 14px',
              background: 'rgba(173,138,50,.08)',
            }}
          >
            <div
              style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--amber)' }}
            >
              ชำระเงินโดยโอนเข้าบัญชี
            </div>
            <div style={{ fontWeight: 600, marginTop: 2 }}>
              {s.bankName || '-'}{' '}
              {s.bankAccountName ? `· ${s.bankAccountName}` : ''}
            </div>
            {s.bankAccountNo && (
              <div
                className="ca-mono"
                style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}
              >
                เลขที่บัญชี {s.bankAccountNo}
              </div>
            )}
          </div>
        )}
        {quote.notes && (
          <div style={{ marginTop: 18, fontSize: 12.5 }}>
            <b>หมายเหตุ:</b> {quote.notes}
          </div>
        )}
        <div
          style={{
            marginTop: 16,
            fontSize: 11.5,
            color: 'var(--muted)',
            borderTop: '1px dashed var(--border)',
            paddingTop: 10,
            lineHeight: 1.8,
          }}
        >
          1. ต้องชำระมัดจำก่อนใช้บริการ 50%
          <br />
          2. ไม่สามารถขอเงินคืนได้
        </div>
        <div style={{ display: 'flex', gap: 40, marginTop: 48 }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div
              style={{
                borderTop: '1px solid var(--muted)',
                paddingTop: 34,
                marginBottom: 6,
              }}
            />
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>ผู้เสนอราคา</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
              วันที่ ....../....../......
            </div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div
              style={{
                borderTop: '1px solid var(--muted)',
                paddingTop: 34,
                marginBottom: 6,
              }}
            />
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>
              ผู้อนุมัติ / ลูกค้า
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
              วันที่ ....../....../......
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ---------------------------------------------------------------------- */
/* Jobs / P&L view                                                        */
/* ---------------------------------------------------------------------- */

function JobsView({
  jobs,
  saveJobs,
  txns,
  equipTxns,
  quotes,
  stock,
  cashEntries,
}) {
  const [showForm, setShowForm] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [detailJob, setDetailJob] = useState(null);

  function openNew() {
    setEditJob({
      id: uid(),
      name: '',
      customer: '',
      revenue: 0,
      status: 'ongoing',
      startDate: todayISO(),
      budgetItems: [],
    });
    setShowForm(true);
  }
  function openEdit(j) {
    setEditJob(JSON.parse(JSON.stringify(j)));
    setShowForm(true);
  }
  function remove(id) {
    saveJobs(jobs.filter((j) => j.id !== id));
  }
  function submit(j) {
    const exists = jobs.some((x) => x.id === j.id);
    saveJobs(exists ? jobs.map((x) => (x.id === j.id ? j : x)) : [...jobs, j]);
    setShowForm(false);
  }

  const totalRevenue = jobs.reduce((s, j) => s + (Number(j.revenue) || 0), 0);
  const totalProfit = jobs.reduce(
    (s, j) => s + computeJobFinancials(j, txns, cashEntries).actualProfit,
    0
  );

  return (
    <div>
      <TitleBlock
        eyebrow="งบประมาณกำไร-ขาดทุนรายงาน"
        title="งาน & กำไรขาดทุน"
        fields={[
          ['รายได้รวม', fmtTHB(totalRevenue)],
          ['กำไรรวม', fmtTHB(totalProfit)],
        ]}
      />

      <div className="ca-toolbar">
        <div style={{ flex: 1 }} />
        <button className="ca-btn ca-btn-primary" onClick={openNew}>
          <Plus size={15} /> เพิ่มงานใหม่
        </button>
      </div>

      <div className="ca-panel">
        <div className="ca-panel-body" style={{ padding: 0 }}>
          {jobs.length === 0 ? (
            <div style={{ padding: 20 }}>
              <EmptyState
                icon={Briefcase}
                text="ยังไม่มีงาน"
                action={
                  <button
                    className="ca-btn ca-btn-primary ca-btn-sm"
                    onClick={openNew}
                  >
                    เพิ่มงานแรก
                  </button>
                }
              />
            </div>
          ) : (
            <table className="ca-table">
              <thead>
                <tr>
                  <th>ชื่องาน</th>
                  <th>ลูกค้า</th>
                  <th>สถานะ</th>
                  <th>รายได้</th>
                  <th>ต้นทุนจริง</th>
                  <th>กำไร/ขาดทุน</th>
                  <th>มาร์จิ้น</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => {
                  const f = computeJobFinancials(j, txns, cashEntries);
                  const srcQuote = j.quotationId
                    ? quotes.find((q) => q.id === j.quotationId)
                    : null;
                  return (
                    <tr
                      key={j.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setDetailJob(j)}
                    >
                      <td style={{ fontWeight: 600 }}>
                        {j.name}
                        {srcQuote && (
                          <div style={{ marginTop: 3 }}>
                            <Badge tone="grey">
                              <Link2 size={11} /> จากใบเสนอราคา {srcQuote.docNo}
                            </Badge>
                          </div>
                        )}
                      </td>
                      <td>{j.customer || '-'}</td>
                      <td>
                        <StatusBadge status={j.status} kind="job" />
                      </td>
                      <td className="ca-num">{fmtTHB(f.revenue)}</td>
                      <td className="ca-num">{fmtTHB(f.totalActual)}</td>
                      <td
                        className="ca-num"
                        style={{
                          color:
                            f.actualProfit >= 0 ? 'var(--green)' : 'var(--red)',
                          fontWeight: 700,
                        }}
                      >
                        {f.actualProfit >= 0 ? (
                          <TrendingUp size={12} style={{ verticalAlign: -1 }} />
                        ) : (
                          <TrendingDown
                            size={12}
                            style={{ verticalAlign: -1 }}
                          />
                        )}{' '}
                        {fmtTHB(f.actualProfit)}
                      </td>
                      <td className="ca-num">{fmtNum(f.margin)}%</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div
                          style={{
                            display: 'flex',
                            gap: 2,
                            justifyContent: 'flex-end',
                          }}
                        >
                          <button
                            className="ca-icon-btn"
                            title="แก้ไข"
                            onClick={() => openEdit(j)}
                          >
                            <Pencil size={15} />
                          </button>
                          <ConfirmDelete onConfirm={() => remove(j.id)} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showForm && (
        <JobForm
          job={editJob}
          stock={stock}
          onCancel={() => setShowForm(false)}
          onSave={submit}
        />
      )}
      {detailJob && (
        <JobDetail
          job={jobs.find((j) => j.id === detailJob.id) || detailJob}
          txns={txns}
          equipTxns={equipTxns}
          quotes={quotes}
          stock={stock}
          cashEntries={cashEntries}
          onClose={() => setDetailJob(null)}
          onEdit={() => {
            setEditJob(JSON.parse(JSON.stringify(detailJob)));
            setShowForm(true);
            setDetailJob(null);
          }}
        />
      )}
    </div>
  );
}

function JobForm({ job, stock, onCancel, onSave }) {
  const [j, setJ] = useState(job);
  function addBudgetItem() {
    setJ({
      ...j,
      budgetItems: [
        ...j.budgetItems,
        {
          id: uid(),
          category: BUDGET_CATEGORIES[0],
          description: '',
          budgetedCost: 0,
          actualCost: 0,
          stockId: null,
        },
      ],
    });
  }
  function updateBudgetItem(id, patch) {
    setJ({
      ...j,
      budgetItems: j.budgetItems.map((b) =>
        b.id === id ? { ...b, ...patch } : b
      ),
    });
  }
  function removeBudgetItem(id) {
    setJ({ ...j, budgetItems: j.budgetItems.filter((b) => b.id !== id) });
  }

  return (
    <Modal
      wide
      title={job.name ? `แก้ไขงาน: ${job.name}` : 'เพิ่มงานใหม่'}
      onClose={onCancel}
      footer={
        <>
          <button className="ca-btn ca-btn-outline" onClick={onCancel}>
            ยกเลิก
          </button>
          <button className="ca-btn ca-btn-primary" onClick={() => onSave(j)}>
            บันทึก
          </button>
        </>
      }
    >
      <div className="ca-row">
        <Field label="ชื่องาน">
          <input
            className="ca-input"
            required
            value={j.name}
            onChange={(e) => setJ({ ...j, name: e.target.value })}
          />
        </Field>
        <Field label="ลูกค้า">
          <input
            className="ca-input"
            value={j.customer}
            onChange={(e) => setJ({ ...j, customer: e.target.value })}
          />
        </Field>
      </div>
      <div className="ca-row">
        <Field label="รายได้ตามงบ / มูลค่างาน (บาท)">
          <input
            type="number"
            step="any"
            className="ca-input"
            value={j.revenue}
            onChange={(e) => setJ({ ...j, revenue: e.target.value })}
          />
        </Field>
        <Field label="วันที่เริ่มงาน">
          <input
            type="date"
            className="ca-input"
            value={j.startDate}
            onChange={(e) => setJ({ ...j, startDate: e.target.value })}
          />
        </Field>
        <Field label="สถานะ">
          <select
            className="ca-select"
            value={j.status}
            onChange={(e) => setJ({ ...j, status: e.target.value })}
          >
            <option value="ongoing">กำลังดำเนินการ</option>
            <option value="completed">เสร็จสิ้น</option>
            <option value="onhold">พักงาน</option>
          </select>
        </Field>
      </div>
      <div className="ca-divider" />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <div className="ca-panel-title" style={{ fontSize: 14 }}>
          รายการต้นทุน (งบประมาณ / ตามจริง)
        </div>
        <button
          type="button"
          className="ca-btn ca-btn-outline ca-btn-sm"
          onClick={addBudgetItem}
        >
          <Plus size={14} /> เพิ่มรายการต้นทุน
        </button>
      </div>
      <div className="ca-hint" style={{ marginBottom: 8 }}>
        ต้นทุนวัสดุที่เบิกจากคลังสินค้าจะถูกคำนวณอัตโนมัติ ไม่ต้องกรอกซ้ำที่นี่
      </div>
      {j.budgetItems.length === 0 ? (
        <EmptyState icon={ClipboardList} text="ยังไม่มีรายการต้นทุน" />
      ) : (
        <table className="ca-table">
          <thead>
            <tr>
              <th>หมวด</th>
              <th>รายละเอียด</th>
              <th style={{ width: 150 }}>เชื่อมกับสต๊อค</th>
              <th style={{ width: 110 }}>งบประมาณ</th>
              <th style={{ width: 110 }}>ตามจริง</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {j.budgetItems.map((b) => (
              <tr key={b.id}>
                <td>
                  <select
                    className="ca-select"
                    value={b.category}
                    onChange={(e) =>
                      updateBudgetItem(b.id, { category: e.target.value })
                    }
                  >
                    {BUDGET_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    className="ca-input"
                    value={b.description}
                    onChange={(e) =>
                      updateBudgetItem(b.id, { description: e.target.value })
                    }
                  />
                </td>
                <td>
                  <select
                    className="ca-select"
                    value={b.stockId || ''}
                    onChange={(e) =>
                      updateBudgetItem(b.id, {
                        stockId: e.target.value || null,
                      })
                    }
                  >
                    <option value="">-- ไม่เชื่อม --</option>
                    {stock.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    step="any"
                    className="ca-input ca-num"
                    value={b.budgetedCost}
                    onChange={(e) =>
                      updateBudgetItem(b.id, { budgetedCost: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="any"
                    className="ca-input ca-num"
                    value={b.actualCost}
                    onChange={(e) =>
                      updateBudgetItem(b.id, { actualCost: e.target.value })
                    }
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="ca-line-remove"
                    onClick={() => removeBudgetItem(b.id)}
                  >
                    <X size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Modal>
  );
}

function JobDetail({
  job,
  txns,
  equipTxns,
  quotes,
  stock,
  cashEntries,
  onClose,
  onEdit,
}) {
  const f = computeJobFinancials(job, txns, cashEntries);
  const materialTxns = txns.filter(
    (t) => t.jobId === job.id && t.type === 'issue'
  );
  const srcQuote = job.quotationId
    ? (quotes || []).find((q) => q.id === job.quotationId)
    : null;
  const linkedCash = (cashEntries || []).filter((e) => e.jobId === job.id);

  // Equipment currently checked out to this job (checkouts minus returns tagged to it).
  const equipNet = {};
  equipTxns
    .filter((t) => t.jobId === job.id)
    .forEach((t) => {
      const key = t.equipmentId;
      if (!equipNet[key])
        equipNet[key] = { name: t.equipmentName, unit: t.unit, net: 0 };
      equipNet[key].net +=
        t.type === 'checkout' ? Number(t.qty) : -Number(t.qty);
    });
  const equipInUse = Object.values(equipNet).filter((x) => x.net > 0);

  const [photos, setPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    let active = true;
    setLoadingPhotos(true);
    loadJobPhotos(job.id).then((p) => {
      if (active) {
        setPhotos(p);
        setLoadingPhotos(false);
      }
    });
    return () => {
      active = false;
    };
  }, [job.id]);

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setUploadError('');
    try {
      const compressed = await Promise.all(
        files.map((f) => fileToCompressedDataURL(f))
      );
      const next = [
        ...photos,
        ...compressed.map((dataUrl) => ({
          id: uid(),
          dataUrl,
          date: todayISO(),
        })),
      ];
      setPhotos(next);
      await saveJobPhotos(job.id, next);
    } catch (err) {
      console.error('upload failed', err);
      setUploadError(
        'เพิ่มรูปภาพไม่สำเร็จ ลองใหม่อีกครั้ง หรือลองไฟล์รูปอื่น (' +
          (err && err.message ? err.message : 'unknown error') +
          ')'
      );
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }
  function removePhoto(id) {
    const next = photos.filter((p) => p.id !== id);
    setPhotos(next);
    saveJobPhotos(job.id, next);
  }

  return (
    <Modal
      wide
      title={job.name}
      onClose={onClose}
      footer={
        <>
          <button className="ca-btn ca-btn-outline" onClick={onClose}>
            ปิด
          </button>
          <button className="ca-btn ca-btn-primary" onClick={onEdit}>
            <Pencil size={14} /> แก้ไขงาน
          </button>
        </>
      }
    >
      {srcQuote && (
        <div style={{ marginBottom: 14 }}>
          <Badge tone="green">
            <Link2 size={12} /> สร้างจากใบเสนอราคา {srcQuote.docNo} ·{' '}
            {srcQuote.customerName || '-'}
          </Badge>
        </div>
      )}
      <div
        className="ca-cards"
        style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 18 }}
      >
        <div className="ca-card">
          <div className="ca-card-label">รายได้</div>
          <div className="ca-card-value" style={{ fontSize: 18 }}>
            {fmtTHB(f.revenue)}
          </div>
        </div>
        <div className="ca-card">
          <div className="ca-card-label">ต้นทุนจริงรวม</div>
          <div className="ca-card-value" style={{ fontSize: 18 }}>
            {fmtTHB(f.totalActual)}
          </div>
        </div>
        <div className={'ca-card' + (f.actualProfit >= 0 ? ' good' : ' bad')}>
          <div className="ca-card-label">กำไร/ขาดทุนจริง</div>
          <div className="ca-card-value" style={{ fontSize: 18 }}>
            {fmtTHB(f.actualProfit)}
          </div>
        </div>
        <div className="ca-card">
          <div className="ca-card-label">มาร์จิ้น</div>
          <div className="ca-card-value" style={{ fontSize: 18 }}>
            {fmtNum(f.margin)}%
          </div>
        </div>
      </div>

      <div className="ca-panel-title" style={{ fontSize: 14, marginBottom: 8 }}>
        รายการต้นทุน (งบประมาณ vs ตามจริง)
      </div>
      <table className="ca-table" style={{ marginBottom: 18 }}>
        <thead>
          <tr>
            <th>หมวด</th>
            <th>รายละเอียด</th>
            <th>งบประมาณ</th>
            <th>ตามจริง</th>
            <th>ผลต่าง</th>
          </tr>
        </thead>
        <tbody>
          {job.budgetItems.map((b) => {
            const diff =
              (Number(b.budgetedCost) || 0) - (Number(b.actualCost) || 0);
            const linkedStock = b.stockId
              ? (stock || []).find((s) => s.id === b.stockId)
              : null;
            return (
              <tr key={b.id}>
                <td>
                  <Badge tone="grey">{b.category}</Badge>
                </td>
                <td>
                  {b.description || '-'}
                  {linkedStock && (
                    <div
                      style={{
                        fontSize: 11,
                        marginTop: 2,
                        color: 'var(--muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                      }}
                    >
                      <Link2 size={10} /> เชื่อมกับสต๊อค: {linkedStock.name}{' '}
                      (คงเหลือ {fmtNum(linkedStock.qty)} {linkedStock.unit})
                    </div>
                  )}
                </td>
                <td className="ca-num">{fmtTHB(b.budgetedCost)}</td>
                <td className="ca-num">{fmtTHB(b.actualCost)}</td>
                <td
                  className="ca-num"
                  style={{ color: diff >= 0 ? 'var(--green)' : 'var(--red)' }}
                >
                  {fmtTHB(diff)}
                </td>
              </tr>
            );
          })}
          <tr>
            <td>
              <Badge tone="amber">วัสดุ (จากคลัง)</Badge>
            </td>
            <td>เบิกจากสต๊อคจริง {materialTxns.length} รายการ</td>
            <td className="ca-num">-</td>
            <td className="ca-num">{fmtTHB(f.materialActual)}</td>
            <td className="ca-num">-</td>
          </tr>
          {f.linkedExpense > 0 && (
            <tr>
              <td>
                <Badge tone="red">รายจ่าย (บัญชี)</Badge>
              </td>
              <td>เชื่อมจากเมนูรายรับ-รายจ่าย</td>
              <td className="ca-num">-</td>
              <td className="ca-num">{fmtTHB(f.linkedExpense)}</td>
              <td className="ca-num">-</td>
            </tr>
          )}
        </tbody>
      </table>

      {materialTxns.length > 0 && (
        <>
          <div
            className="ca-panel-title"
            style={{ fontSize: 14, marginBottom: 8 }}
          >
            วัสดุที่เบิกใช้ในงานนี้
          </div>
          <table className="ca-table" style={{ marginBottom: 18 }}>
            <thead>
              <tr>
                <th>วันที่</th>
                <th>วัสดุ</th>
                <th>จำนวน</th>
                <th>ต้นทุนรวม</th>
              </tr>
            </thead>
            <tbody>
              {materialTxns.map((t) => (
                <tr key={t.id}>
                  <td className="ca-mono">{fmtDate(t.date)}</td>
                  <td>{t.stockName}</td>
                  <td className="ca-num">
                    {fmtNum(t.qty)} {t.unit}
                  </td>
                  <td className="ca-num">{fmtTHB(t.qty * t.unitCost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {equipInUse.length > 0 && (
        <>
          <div
            className="ca-panel-title"
            style={{ fontSize: 14, marginBottom: 8 }}
          >
            <Wrench size={15} /> เครื่องมือ-อุปกรณ์ที่เบิกใช้ในงานนี้ขณะนี้
          </div>
          <table className="ca-table" style={{ marginBottom: 18 }}>
            <thead>
              <tr>
                <th>อุปกรณ์</th>
                <th>จำนวนที่เบิก</th>
              </tr>
            </thead>
            <tbody>
              {equipInUse.map((e, i) => (
                <tr key={i}>
                  <td>{e.name}</td>
                  <td className="ca-num">
                    {fmtNum(e.net)} {e.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {linkedCash.length > 0 && (
        <>
          <div
            className="ca-panel-title"
            style={{ fontSize: 14, marginBottom: 8 }}
          >
            <Wallet size={15} /> รายรับ-รายจ่ายที่เชื่อมกับงานนี้
          </div>
          <table className="ca-table" style={{ marginBottom: 18 }}>
            <thead>
              <tr>
                <th>วันที่</th>
                <th>ประเภท</th>
                <th>รายละเอียด</th>
                <th>จำนวนเงิน</th>
              </tr>
            </thead>
            <tbody>
              {linkedCash.map((e) => (
                <tr key={e.id}>
                  <td className="ca-mono">{fmtDate(e.date)}</td>
                  <td>
                    {e.type === 'income' ? (
                      <Badge tone="green">รายรับ</Badge>
                    ) : (
                      <Badge tone="red">รายจ่าย</Badge>
                    )}
                  </td>
                  <td>{e.description || '-'}</td>
                  <td
                    className="ca-num"
                    style={{
                      color:
                        e.type === 'income' ? 'var(--green)' : 'var(--red)',
                      fontWeight: 700,
                    }}
                  >
                    {e.type === 'income' ? '+' : '-'}
                    {fmtTHB(e.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="ca-hint" style={{ marginBottom: 18, marginTop: -8 }}>
            เก็บเงินจริงแล้ว {fmtTHB(f.collectedIncome)} จากรายได้ทั้งหมด{' '}
            {fmtTHB(f.revenue)}
          </div>
        </>
      )}

      <div className="ca-divider ca-no-print" />
      <div className="ca-no-print">
        <div
          className="ca-panel-title"
          style={{ fontSize: 14, marginBottom: 10 }}
        >
          <Camera size={15} /> รูปภาพหน้างาน
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          className="ca-file-input"
          onChange={handleFiles}
          disabled={uploading}
          style={{ marginBottom: 12 }}
        />
        {uploading && (
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>
            กำลังประมวลผลรูปภาพ...
          </div>
        )}
        {uploadError && <div className="ca-upload-error">{uploadError}</div>}
        {loadingPhotos ? (
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>
            กำลังโหลดรูปภาพ...
          </div>
        ) : photos.length === 0 ? (
          <EmptyState
            icon={ImageIcon}
            text="ยังไม่มีรูปภาพหน้างาน — เลือกไฟล์รูปด้านบนเพื่อเพิ่ม"
          />
        ) : (
          <div className="ca-photo-grid">
            {photos.map((p) => (
              <div className="ca-photo-thumb" key={p.id}>
                <img
                  src={p.dataUrl}
                  onClick={() => setLightbox(p.dataUrl)}
                  alt="รูปหน้างาน"
                />
                <button
                  className="ca-photo-remove"
                  title="ลบรูปภาพ"
                  onClick={() => removePhoto(p.id)}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="ca-lightbox ca-no-print"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="รูปหน้างานขยาย" />
        </div>
      )}
    </Modal>
  );
}

/* ---------------------------------------------------------------------- */
/* Income / expense ledger                                                */
/* ---------------------------------------------------------------------- */

function CashFlowView({ entries, saveEntries, jobs }) {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [editEntry, setEditEntry] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const totalIncome = entries
    .filter((e) => e.type === 'income')
    .reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const totalExpense = entries
    .filter((e) => e.type === 'expense')
    .reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const net = totalIncome - totalExpense;

  const filtered = entries
    .filter((e) => typeFilter === 'all' || e.type === typeFilter)
    .filter((e) =>
      (e.description + e.category).toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  function openNew(type) {
    setEditEntry({
      id: uid(),
      date: todayISO(),
      type: type || 'income',
      category: (type === 'expense'
        ? EXPENSE_CATEGORIES
        : INCOME_CATEGORIES)[0],
      description: '',
      amount: 0,
      jobId: '',
      note: '',
    });
    setShowForm(true);
  }
  function openEdit(e) {
    setEditEntry({ ...e });
    setShowForm(true);
  }
  function remove(id) {
    saveEntries(entries.filter((e) => e.id !== id));
  }
  function submit(e) {
    const exists = entries.some((x) => x.id === e.id);
    saveEntries(
      exists ? entries.map((x) => (x.id === e.id ? e : x)) : [...entries, e]
    );
    setShowForm(false);
  }

  return (
    <div>
      <TitleBlock
        eyebrow="บัญชีกระแสเงินสด"
        title="รายรับ-รายจ่าย"
        fields={[
          ['รายรับรวม', fmtTHB(totalIncome)],
          ['รายจ่ายรวม', fmtTHB(totalExpense)],
          ['คงเหลือสุทธิ', fmtTHB(net)],
        ]}
      />

      <div className="ca-cards">
        <div className="ca-card good">
          <div className="ca-card-label">รายรับรวม</div>
          <div className="ca-card-value">{fmtTHB(totalIncome)}</div>
          <div className="ca-card-sub">
            {entries.filter((e) => e.type === 'income').length} รายการ
          </div>
        </div>
        <div className="ca-card bad">
          <div className="ca-card-label">รายจ่ายรวม</div>
          <div className="ca-card-value">{fmtTHB(totalExpense)}</div>
          <div className="ca-card-sub">
            {entries.filter((e) => e.type === 'expense').length} รายการ
          </div>
        </div>
        <div className={'ca-card' + (net >= 0 ? ' good' : ' bad')}>
          <div className="ca-card-label">คงเหลือสุทธิ</div>
          <div className="ca-card-value">{fmtTHB(net)}</div>
          <div className="ca-card-sub">รายรับ - รายจ่าย</div>
        </div>
      </div>

      <div className="ca-toolbar">
        <div className="ca-search">
          <Search size={15} />
          <input
            className="ca-input"
            placeholder="ค้นหารายการ..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="ca-select"
          style={{ maxWidth: 160 }}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">ทั้งหมด</option>
          <option value="income">รายรับ</option>
          <option value="expense">รายจ่าย</option>
        </select>
        <div style={{ flex: 1 }} />
        <button
          className="ca-btn ca-btn-outline"
          onClick={() => openNew('expense')}
        >
          <TrendingDown size={15} /> บันทึกรายจ่าย
        </button>
        <button
          className="ca-btn ca-btn-primary"
          onClick={() => openNew('income')}
        >
          <TrendingUp size={15} /> บันทึกรายรับ
        </button>
      </div>

      <div className="ca-panel">
        <div className="ca-panel-body" style={{ padding: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 20 }}>
              <EmptyState
                icon={Wallet}
                text="ยังไม่มีรายการรายรับ-รายจ่าย"
                action={
                  <button
                    className="ca-btn ca-btn-primary ca-btn-sm"
                    onClick={() => openNew('income')}
                  >
                    บันทึกรายการแรก
                  </button>
                }
              />
            </div>
          ) : (
            <table className="ca-table">
              <thead>
                <tr>
                  <th>วันที่</th>
                  <th>ประเภท</th>
                  <th>หมวด</th>
                  <th>รายละเอียด</th>
                  <th>งานที่เกี่ยวข้อง</th>
                  <th>จำนวนเงิน</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => {
                  const job = e.jobId
                    ? jobs.find((j) => j.id === e.jobId)
                    : null;
                  return (
                    <tr key={e.id}>
                      <td className="ca-mono">{fmtDate(e.date)}</td>
                      <td>
                        {e.type === 'income' ? (
                          <Badge tone="green">
                            <TrendingUp size={11} /> รายรับ
                          </Badge>
                        ) : (
                          <Badge tone="red">
                            <TrendingDown size={11} /> รายจ่าย
                          </Badge>
                        )}
                      </td>
                      <td>
                        <Badge tone="grey">{e.category}</Badge>
                      </td>
                      <td>{e.description || '-'}</td>
                      <td>
                        {job ? (
                          <Badge tone="navy">
                            <Link2 size={10} /> {job.name}
                          </Badge>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td
                        className="ca-num"
                        style={{
                          color:
                            e.type === 'income' ? 'var(--green)' : 'var(--red)',
                          fontWeight: 700,
                        }}
                      >
                        {e.type === 'income' ? '+' : '-'}
                        {fmtTHB(e.amount)}
                      </td>
                      <td>
                        <div
                          style={{
                            display: 'flex',
                            gap: 2,
                            justifyContent: 'flex-end',
                          }}
                        >
                          <button
                            className="ca-icon-btn"
                            title="แก้ไข"
                            onClick={() => openEdit(e)}
                          >
                            <Pencil size={15} />
                          </button>
                          <ConfirmDelete onConfirm={() => remove(e.id)} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showForm && (
        <CashEntryForm
          entry={editEntry}
          jobs={jobs}
          onCancel={() => setShowForm(false)}
          onSave={submit}
        />
      )}
    </div>
  );
}

function CashEntryForm({ entry, jobs, onCancel, onSave }) {
  const [e, setE] = useState(entry);
  const categories =
    e.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  function setType(type) {
    const cats = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    setE({
      ...e,
      type,
      category: cats.includes(e.category) ? e.category : cats[0],
    });
  }

  return (
    <Modal
      title={entry.description ? 'แก้ไขรายการ' : 'บันทึกรายการใหม่'}
      onClose={onCancel}
      footer={
        <>
          <button className="ca-btn ca-btn-outline" onClick={onCancel}>
            ยกเลิก
          </button>
          <button className="ca-btn ca-btn-primary" onClick={() => onSave(e)}>
            บันทึก
          </button>
        </>
      }
    >
      <div className="ca-row" style={{ marginBottom: 13 }}>
        <button
          type="button"
          className={
            'ca-btn ' +
            (e.type === 'income' ? 'ca-btn-primary' : 'ca-btn-outline')
          }
          style={{ flex: 1, justifyContent: 'center' }}
          onClick={() => setType('income')}
        >
          <TrendingUp size={15} /> รายรับ
        </button>
        <button
          type="button"
          className={
            'ca-btn ' +
            (e.type === 'expense' ? 'ca-btn-primary' : 'ca-btn-outline')
          }
          style={{ flex: 1, justifyContent: 'center' }}
          onClick={() => setType('expense')}
        >
          <TrendingDown size={15} /> รายจ่าย
        </button>
      </div>
      <div className="ca-row">
        <Field label="วันที่">
          <input
            type="date"
            className="ca-input"
            value={e.date}
            onChange={(ev) => setE({ ...e, date: ev.target.value })}
          />
        </Field>
        <Field label="หมวดหมู่">
          <select
            className="ca-select"
            value={e.category}
            onChange={(ev) => setE({ ...e, category: ev.target.value })}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="รายละเอียด">
        <input
          className="ca-input"
          value={e.description}
          onChange={(ev) => setE({ ...e, description: ev.target.value })}
          placeholder={
            e.type === 'income'
              ? 'เช่น รับเงินมัดจำงานต่อเติมบ้าน'
              : 'เช่น ค่าน้ำมันรถกระบะ'
          }
        />
      </Field>
      <div className="ca-row">
        <Field label="จำนวนเงิน (บาท)">
          <input
            type="number"
            step="any"
            className="ca-input"
            value={e.amount}
            onChange={(ev) => setE({ ...e, amount: ev.target.value })}
          />
        </Field>
        <Field
          label="เชื่อมกับงาน (ไม่บังคับ)"
          hint={
            e.type === 'expense'
              ? 'ถ้าเลือกงาน ยอดนี้จะถูกนับรวมเป็นต้นทุนจริงของงานนั้นด้วย'
              : 'ถ้าเลือกงาน จะถูกบันทึกเป็นยอดเงินที่เก็บได้จริงของงานนั้น'
          }
        >
          <select
            className="ca-select"
            value={e.jobId}
            onChange={(ev) => setE({ ...e, jobId: ev.target.value })}
          >
            <option value="">-- ไม่ระบุงาน --</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.name}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="หมายเหตุ">
        <input
          className="ca-input"
          value={e.note}
          onChange={(ev) => setE({ ...e, note: ev.target.value })}
        />
      </Field>
    </Modal>
  );
}

/* ---------------------------------------------------------------------- */
/* App shell                                                               */
/* ---------------------------------------------------------------------- */

const NAV = [
  { id: 'dashboard', label: 'แดชบอร์ด', icon: LayoutDashboard },
  { id: 'stock', label: 'คลังพัสดุ', icon: Boxes },
  { id: 'quotes', label: 'ใบเสนอราคา', icon: FileText },
  { id: 'jobs', label: 'งาน & กำไรขาดทุน', icon: Briefcase },
  { id: 'cashflow', label: 'รายรับ-รายจ่าย', icon: Wallet },
];

export default function ContractorApp() {
  const [tab, setTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stock, setStock] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [txns, setTxns] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [equipTxns, setEquipTxns] = useState([]);
  const [settings, setSettings] = useState({});
  const [cashEntries, setCashEntries] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    (async () => {
      const [s, q, j, t, eq, et, cfg, ce] = await Promise.all([
        storageLoad(STORAGE_KEYS.stock),
        storageLoad(STORAGE_KEYS.quotes),
        storageLoad(STORAGE_KEYS.jobs),
        storageLoad(STORAGE_KEYS.txns),
        storageLoad(STORAGE_KEYS.equipment),
        storageLoad(STORAGE_KEYS.equipTxns),
        storageLoad(STORAGE_KEYS.settings, {}),
        storageLoad(STORAGE_KEYS.cashEntries),
      ]);
      let eqFinal = eq;
      for (const batch of SEED_EQUIPMENT_BATCHES) {
        const done = await storageLoad(batch.flag, false);
        if (!done) {
          eqFinal = [
            ...eqFinal,
            ...buildSeedEquipmentBatch(batch.items, eqFinal.length),
          ];
          await storageSave(batch.flag, true);
        }
      }
      if (eqFinal !== eq) await storageSave(STORAGE_KEYS.equipment, eqFinal);
      setStock(s);
      setQuotes(q);
      setJobs(j);
      setTxns(t);
      setEquipment(eqFinal);
      setEquipTxns(et);
      setSettings(cfg);
      setCashEntries(ce);
      setLoading(false);
    })();
  }, []);

  const saveStock = useCallback((next) => {
    setStock(next);
    storageSave(STORAGE_KEYS.stock, next);
  }, []);
  const saveQuotes = useCallback((next) => {
    setQuotes(next);
    storageSave(STORAGE_KEYS.quotes, next);
  }, []);
  const saveJobs = useCallback((next) => {
    setJobs(next);
    storageSave(STORAGE_KEYS.jobs, next);
  }, []);
  const saveTxns = useCallback((next) => {
    setTxns(next);
    storageSave(STORAGE_KEYS.txns, next);
  }, []);
  const saveEquipment = useCallback((next) => {
    setEquipment(next);
    storageSave(STORAGE_KEYS.equipment, next);
  }, []);
  const saveEquipTxns = useCallback((next) => {
    setEquipTxns(next);
    storageSave(STORAGE_KEYS.equipTxns, next);
  }, []);
  const saveSettings = useCallback((next) => {
    setSettings(next);
    storageSave(STORAGE_KEYS.settings, next);
  }, []);
  const saveCashEntries = useCallback((next) => {
    setCashEntries(next);
    storageSave(STORAGE_KEYS.cashEntries, next);
  }, []);

  return (
    <div className="ca-root">
      <style>{CSS}</style>
      <aside className="ca-sidebar ca-no-print">
        <div className="ca-brand">
          <img src={FATERRA_LOGO} alt="FATERRA" className="ca-brand-mark" />
          <div>
            <div className="ca-brand-name">FATERRA</div>
            <div className="ca-brand-sub">Building a Greater Tomorrow</div>
          </div>
        </div>
        <nav className="ca-nav">
          {NAV.map((n) => (
            <button
              key={n.id}
              className={'ca-nav-btn' + (tab === n.id ? ' active' : '')}
              onClick={() => setTab(n.id)}
            >
              <n.icon size={16} /> {n.label}
            </button>
          ))}
        </nav>
        <div className="ca-nav-spacer" />
        <button className="ca-nav-btn" onClick={() => setShowSettings(true)}>
          <Settings size={16} /> ข้อมูลบริษัท/บัญชี
        </button>
        <div className="ca-nav-foot">
          ข้อมูลบันทึกอัตโนมัติ
          <br />
          ในเบราว์เซอร์ของคุณ
        </div>
      </aside>

      <main className="ca-main">
        {loading ? (
          <div className="ca-loading">
            <Loader2
              size={20}
              className="ca-spin"
              style={{ animation: 'spin 1s linear infinite' }}
            />{' '}
            กำลังโหลดข้อมูล...
          </div>
        ) : tab === 'dashboard' ? (
          <Dashboard
            stock={stock}
            quotes={quotes}
            jobs={jobs}
            txns={txns}
            equipment={equipment}
            equipTxns={equipTxns}
            cashEntries={cashEntries}
            setTab={setTab}
          />
        ) : tab === 'stock' ? (
          <StockView
            stock={stock}
            saveStock={saveStock}
            txns={txns}
            saveTxns={saveTxns}
            jobs={jobs}
            equipment={equipment}
            saveEquipment={saveEquipment}
            equipTxns={equipTxns}
            saveEquipTxns={saveEquipTxns}
          />
        ) : tab === 'quotes' ? (
          <QuotationsView
            quotes={quotes}
            saveQuotes={saveQuotes}
            stock={stock}
            jobs={jobs}
            saveJobs={saveJobs}
            settings={settings}
            onOpenSettings={() => setShowSettings(true)}
          />
        ) : tab === 'jobs' ? (
          <JobsView
            jobs={jobs}
            saveJobs={saveJobs}
            txns={txns}
            equipTxns={equipTxns}
            quotes={quotes}
            stock={stock}
            cashEntries={cashEntries}
          />
        ) : (
          <CashFlowView
            entries={cashEntries}
            saveEntries={saveCashEntries}
            jobs={jobs}
          />
        )}
      </main>
      {showSettings && (
        <SettingsModal
          settings={settings}
          saveSettings={saveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
