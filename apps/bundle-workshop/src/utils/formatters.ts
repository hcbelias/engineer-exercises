// 30+ formatting utilities.
// BUNDLE ISSUE in DashboardPage: imported as `import * as fmt from "../utils/formatters"`
// which prevents bundlers from tree-shaking unused exports — all 30+ functions
// land in whatever chunk imports this file.
//
// Fix: replace with named imports for only what you use:
//   import { formatCurrency, formatDate, formatNumber } from "../utils/formatters";
//
// Why `import *` breaks tree-shaking:
//   Rollup/Vite can tree-shake named imports because it can statically determine
//   which exports are used. `import *` creates a namespace object — the bundler
//   cannot know at build time whether code will access `fmt["someKey"]` dynamically,
//   so it must keep every export to be safe. Even with Rollup's advanced analysis,
//   namespace objects inhibit dead-code elimination in many real-world scenarios
//   (e.g., when passed as props, used in test files, or processed by Babel/SWC
//   with CJS interop enabled).

const en = new Intl.NumberFormat("en-US");
const enCompact = new Intl.NumberFormat("en-US", { notation: "compact" });

export const formatNumber    = (v: number) => en.format(v);
export const formatCompact   = (v: number) => enCompact.format(v);
export const formatPercent   = (v: number, decimals = 1) => `${(v * 100).toFixed(decimals)}%`;
export const formatCurrency  = (v: number, code = "USD") => new Intl.NumberFormat("en-US", { style: "currency", currency: code }).format(v);
export const formatBytes     = (v: number) => { const u = ["B","KB","MB","GB","TB"]; let i=0; while(v>=1024&&i<u.length-1){v/=1024;i++;} return `${v.toFixed(1)} ${u[i]}`; };
export const formatDuration  = (ms: number) => { const s=Math.floor(ms/1000),m=Math.floor(s/60),h=Math.floor(m/60); return h?`${h}h ${m%60}m`:`${m}m ${s%60}s`; };
export const formatOrdinal   = (v: number) => `${v}${["th","st","nd","rd"][v%10>3||~~(v%100-v%10)===10?0:v%10]}`;

export const formatDate      = (d: Date | string | number) => new Date(d).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" });
export const formatDateTime  = (d: Date | string | number) => new Date(d).toLocaleString("en-US", { year:"numeric", month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" });
export const formatTime      = (d: Date | string | number) => new Date(d).toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" });
export const formatRelative  = (d: Date | string | number) => { const diff = Date.now() - new Date(d).getTime(); const s=diff/1000,m=s/60,h=m/60,dy=h/24; if(s<60)return`${Math.floor(s)}s ago`; if(m<60)return`${Math.floor(m)}m ago`; if(h<24)return`${Math.floor(h)}h ago`; if(dy<7)return`${Math.floor(dy)}d ago`; return formatDate(d); };
export const formatIso       = (d: Date | string | number) => new Date(d).toISOString();
export const formatMonth     = (d: Date | string | number) => new Date(d).toLocaleDateString("en-US", { year:"numeric", month:"long" });
export const formatQuarter   = (d: Date | string | number) => { const dt=new Date(d); return `Q${Math.floor(dt.getMonth()/3)+1} ${dt.getFullYear()}`; };
export const formatWeek      = (d: Date | string | number) => { const dt=new Date(d); const jan1=new Date(dt.getFullYear(),0,1); return `Week ${Math.ceil(((dt.getTime()-jan1.getTime())/86400000+jan1.getDay()+1)/7)}`; };

export const formatPhoneUs   = (v: string) => v.replace(/\D/g,"").replace(/^(\d{3})(\d{3})(\d{4})$/,"($1) $2-$3");
export const formatZip       = (v: string) => v.replace(/\D/g,"").slice(0,5);
export const formatCreditCard= (v: string) => v.replace(/\D/g,"").replace(/(.{4})/g,"$1 ").trim();
export const formatSsn       = (v: string) => v.replace(/\D/g,"").replace(/^(\d{3})(\d{2})(\d{4})$/,"$1-$2-$3");
export const formatEin       = (v: string) => v.replace(/\D/g,"").replace(/^(\d{2})(\d{7})$/,"$1-$2");

export const truncate        = (s: string, max: number, suffix="…") => s.length > max ? s.slice(0, max - suffix.length) + suffix : s;
export const titleCase       = (s: string) => s.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase());
export const camelToTitle    = (s: string) => s.replace(/([A-Z])/g," $1").replace(/^./,c=>c.toUpperCase()).trim();
export const slugify         = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
export const initials        = (name: string, max=2) => name.split(/\s+/).slice(0,max).map(w=>w[0].toUpperCase()).join("");
export const pluralize       = (n: number, singular: string, plural = singular+"s") => `${n} ${n===1?singular:plural}`;
export const highlight       = (text: string, query: string) => text.replace(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"gi"), "**$1**");
export const stripHtml        = (html: string) => html.replace(/<[^>]+>/g,"");
export const escapeHtml       = (s: string) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");

export const clampNumber     = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
export const roundTo         = (v: number, decimals: number) => Math.round(v * 10**decimals) / 10**decimals;
export const formatChange    = (v: number) => `${v >= 0 ? "+" : ""}${formatPercent(v)}`;
export const formatRatio     = (a: number, b: number) => b === 0 ? "—" : `${roundTo(a/b,2)}×`;
