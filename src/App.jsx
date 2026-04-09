import { useState, useEffect } from "react";

const RANKING_API = "https://hiuclxudffbdtqtzlirc.supabase.co/functions/v1/meta-ad-ranking";
const THUMB_API = "https://hiuclxudffbdtqtzlirc.supabase.co/functions/v1/meta-thumbnail-proxy";

const ACCOUNTS = ["DA", "KLG", "星組", "shiroiro"];
const ACCT_COLORS = { DA: "#2563eb", KLG: "#7c3aed", "星組": "#dc2626", shiroiro: "#059669" };
const yen = n => "¥" + Number(n).toLocaleString();

const CATEGORIES = {
  hot:          { label: "好調", sub: "CV≥5 & 高CVR", icon: "🔥", color: "#16a34a", bg: "#dcfce7" },
  cold_low_cvr: { label: "不調", sub: "CV有 & 低CVR", icon: "⚠️", color: "#d97706", bg: "#fef3c7" },
  cold_zero_cv: { label: "不調", sub: "配信有 & CV=0", icon: "🚨", color: "#dc2626", bg: "#fef2f2" },
};

function VideoModal({ src, onClose }) {
  if (!src) return null;
  return (
    <div onClick={onClose} style={{
      position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,0.7)",
      display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(6px)",
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:"min(400px,90vw)",height:"min(720px,85vh)",borderRadius:14,
        overflow:"hidden",position:"relative",background:"#000",
        boxShadow:"0 20px 60px rgba(0,0,0,0.4)",
      }}>
        <button onClick={onClose} style={{
          position:"absolute",top:8,right:8,zIndex:10,background:"#0008",
          border:"none",color:"#fff",width:30,height:30,borderRadius:"50%",
          fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
        }}>✕</button>
        <iframe src={src} style={{width:"100%",height:"100%",border:"none"}}
          allow="autoplay; encrypted-media" sandbox="allow-scripts allow-same-origin allow-popups"/>
      </div>
    </div>
  );
}

function AdCard({ ad, rank, catKey, meta, onPlay }) {
  const cat = CATEGORIES[catKey];
  const m = meta || {};
  const imgSrc = m.image_url || m.thumbnail_url;
  const isVideo = m.is_video;
  const destUrl = m.destination_url;
  const [imgErr, setImgErr] = useState(false);
  const isHot = catKey === "hot";
  const isZero = catKey === "cold_zero_cv";

  return (
    <div style={{
      background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,overflow:"hidden",
      display:"flex",flexDirection:"column",transition:"transform .12s,box-shadow .12s",
    }}
    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.08)";}}
    onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}
    >
      <div style={{position:"relative",height:180,background:"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
        <div style={{
          position:"absolute",top:8,left:8,zIndex:2,
          background:cat.color,color:"#fff",fontWeight:700,fontSize:11,
          padding:"2px 10px",borderRadius:12,fontFamily:"monospace",
        }}>{cat.icon} #{rank}</div>
        {isVideo && (
          <span style={{
            position:"absolute",top:8,right:8,zIndex:2,
            background:"#6366f1",color:"#fff",fontSize:9,fontWeight:700,
            padding:"2px 7px",borderRadius:10,fontFamily:"monospace",
          }}>▶ VIDEO</span>
        )}
        {imgSrc && !imgErr ? (
          <>
            <img src={imgSrc} alt="" onError={()=>setImgErr(true)}
              style={{width:"100%",height:"100%",objectFit:"contain"}}/>
            {isVideo && m.preview_iframe && (
              <div onClick={()=>onPlay(m.preview_iframe)} style={{
                position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",
                background:"rgba(0,0,0,0.2)",cursor:"pointer",
              }}>
                <div style={{
                  width:48,height:48,borderRadius:"50%",background:"rgba(99,102,241,0.9)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  boxShadow:"0 4px 16px rgba(99,102,241,0.4)",
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{color:"#bbb",fontSize:11}}>読込中...</div>
        )}
      </div>

      <div style={{padding:"12px 14px",flex:1,display:"flex",flexDirection:"column",gap:8}}>
        <div style={{
          fontSize:12,fontWeight:600,color:"#374151",lineHeight:1.4,
          overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",
          WebkitLineClamp:2,WebkitBoxOrient:"vertical",minHeight:34,
        }}>{ad.ad_name}</div>

        {destUrl && (
          <a href={destUrl} target="_blank" rel="noopener noreferrer" style={{
            fontSize:10,color:"#6b7280",textDecoration:"none",
            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
            display:"block",padding:"4px 8px",background:"#f9fafb",borderRadius:6,
            border:"1px solid #f3f4f6",
          }} title={destUrl}>
            🔗 {destUrl.replace(/^https?:\/\//,"").slice(0,55)}{destUrl.length>63?"...":""}
          </a>
        )}

        <div style={{display:"grid",gridTemplateColumns: isZero ? "1fr 1fr" : "1fr 1fr",gap:4,marginTop:"auto"}}>
          {isZero ? (
            <>
              <div style={{background:"#fef2f2",borderRadius:6,padding:"5px 8px"}}>
                <div style={{fontSize:9,color:"#9ca3af"}}>消化</div>
                <div style={{fontSize:15,fontWeight:700,fontFamily:"monospace",color:"#dc2626"}}>{yen(ad.spend)}</div>
              </div>
              <div style={{background:"#f9fafb",borderRadius:6,padding:"5px 8px"}}>
                <div style={{fontSize:9,color:"#9ca3af"}}>クリック</div>
                <div style={{fontSize:13,fontWeight:700,fontFamily:"monospace",color:"#374151"}}>{ad.clicks}回</div>
              </div>
              <div style={{background:"#fef2f2",borderRadius:6,padding:"5px 8px",gridColumn:"1/3"}}>
                <div style={{fontSize:9,color:"#9ca3af"}}>CV</div>
                <div style={{fontSize:15,fontWeight:700,fontFamily:"monospace",color:"#dc2626"}}>0件（金が燃えてる）</div>
              </div>
            </>
          ) : (
            [
              {l:"CVR",v:ad.cvr+"%",hi:true},
              {l:"CV",v:ad.cv+"件"},
              {l:"CPO",v:ad.cpo ? yen(ad.cpo) : "-"},
              {l:"消化",v:yen(ad.spend)},
            ].map(({l,v,hi})=>(
              <div key={l} style={{background: hi ? (isHot ? "#dcfce7" : "#fef3c7") : "#f9fafb",borderRadius:6,padding:"5px 8px"}}>
                <div style={{fontSize:9,color:"#9ca3af"}}>{l}</div>
                <div style={{
                  fontSize:hi?15:12,fontWeight:700,fontFamily:"monospace",
                  color:hi? cat.color :"#374151",
                }}>{v}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function CategorySection({ catKey, ads, meta, onPlay }) {
  const cat = CATEGORIES[catKey];
  if (!ads || ads.length === 0) return null;
  return (
    <div style={{marginBottom:16}}>
      <h3 style={{fontSize:13,fontWeight:600,color:cat.color,margin:"0 0 10px",display:"flex",alignItems:"center",gap:6}}>
        <span style={{background:cat.bg,padding:"2px 8px",borderRadius:6,fontSize:11}}>
          {cat.icon} {cat.label}
        </span>
        <span style={{fontSize:10,color:"#9ca3af",fontWeight:400}}>{cat.sub}</span>
      </h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
        {ads.map((ad,i)=>(
          <AdCard key={ad.ad_id+catKey} ad={ad} rank={i+1} catKey={catKey} meta={meta[ad.ad_id]} onPlay={onPlay}/>
        ))}
      </div>
    </div>
  );
}

function buildAccountData(rows) {
  const result = {};
  for (const acct of ACCOUNTS) {
    const acctRows = rows.filter(r => r.account === acct);
    result[acct] = {
      hot: acctRows.filter(r => r.category === "hot").sort((a,b) => a.rank - b.rank),
      cold_low_cvr: acctRows.filter(r => r.category === "cold_low_cvr").sort((a,b) => a.rank - b.rank),
      cold_zero_cv: acctRows.filter(r => r.category === "cold_zero_cv").sort((a,b) => a.rank - b.rank),
    };
  }
  return result;
}

export default function App() {
  const [period, setPeriod] = useState("30d");
  const [accountData, setAccountData] = useState({});
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [videoSrc, setVideoSrc] = useState(null);
  const [syncInfo, setSyncInfo] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await fetch(`${RANKING_API}?period=${period}`);
        const d = await res.json();
        if (d.error) { setError(d.error); setLoading(false); return; }
        setSyncInfo({ latest_date: d.latest_date, latest_sync: d.latest_sync });
        const acctData = buildAccountData(d.data || []);
        setAccountData(acctData);

        const adIds = [...new Set((d.data || []).map(r => r.ad_id))];
        if (adIds.length > 0) {
          const thumbRes = await fetch(THUMB_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ad_ids: adIds }),
          });
          const thumbData = await thumbRes.json();
          if (!thumbData.error) setMeta(thumbData);
        }
      } catch (e) { setError(String(e)); }
      setLoading(false);
    })();
  }, [period]);

  return (
    <div style={{
      background:"#fafafa",minHeight:"100vh",padding:"24px 16px",
      fontFamily:"'Noto Sans JP',-apple-system,BlinkMacSystemFont,sans-serif",color:"#1f2937",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;600;700;800&display=swap" rel="stylesheet"/>
      {videoSrc && <VideoModal src={videoSrc} onClose={()=>setVideoSrc(null)}/>}

      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:24}}>
          <div>
            <h1 style={{fontSize:22,fontWeight:800,margin:0,color:"#111827"}}>
              Meta広告 クリエイティブ分析
            </h1>
            <p style={{fontSize:12,color:"#9ca3af",margin:"4px 0 0"}}>
              好調 / 不調 · アカウント別 · 動画は▶クリックで再生
              {syncInfo.latest_date && <span> · データ: {syncInfo.latest_date}まで</span>}
            </p>
          </div>
          <div style={{display:"flex",background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,overflow:"hidden"}}>
            {[{k:"30d",label:"直近30日"},{k:"90d",label:"直近90日"}].map(({k,label})=>(
              <button key={k} onClick={()=>setPeriod(k)} style={{
                padding:"8px 20px",fontSize:13,fontWeight:period===k?700:400,
                background:period===k?"#111827":"transparent",
                color:period===k?"#fff":"#6b7280",
                border:"none",cursor:"pointer",transition:"all .15s",
              }}>{label}</button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:20,padding:"10px 16px",background:"#fff",borderRadius:10,border:"1px solid #e5e7eb"}}>
          {Object.entries(CATEGORIES).map(([k,c])=>(
            <div key={k} style={{display:"flex",alignItems:"center",gap:6,fontSize:12}}>
              <span style={{background:c.bg,padding:"1px 6px",borderRadius:4,fontSize:11}}>{c.icon}</span>
              <span style={{fontWeight:600,color:c.color}}>{c.label}</span>
              <span style={{color:"#9ca3af",fontSize:10}}>{c.sub}</span>
            </div>
          ))}
        </div>

        {error && <p style={{color:"#dc2626",fontSize:12,background:"#fef2f2",padding:"8px 12px",borderRadius:8,marginBottom:16}}>⚠ {error}</p>}

        {loading ? (
          <div style={{textAlign:"center",padding:60,color:"#9ca3af"}}>
            <div style={{width:32,height:32,border:"3px solid #e5e7eb",borderTop:"3px solid #111827",borderRadius:"50%",margin:"0 auto 12px",animation:"spin 1s linear infinite"}}/>
            データ取得中...
            <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
          </div>
        ) : (
          ACCOUNTS.map(acct => {
            const d = accountData[acct];
            if (!d) return null;
            const hasData = d.hot.length + d.cold_low_cvr.length + d.cold_zero_cv.length > 0;
            if (!hasData) return null;
            const acColor = ACCT_COLORS[acct];
            return (
              <div key={acct+period} style={{marginBottom:36}}>
                <div style={{
                  display:"flex",alignItems:"center",gap:8,marginBottom:14,
                  paddingBottom:8,borderBottom:"2px solid "+acColor+"22",
                }}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:acColor}}/>
                  <h2 style={{fontSize:16,fontWeight:700,margin:0,color:acColor}}>{acct}</h2>
                  <span style={{fontSize:11,color:"#9ca3af"}}>
                    好調{d.hot.length} / 不調(低CVR){d.cold_low_cvr.length} / 不調(CV0){d.cold_zero_cv.length}
                  </span>
                </div>
                <CategorySection catKey="hot" ads={d.hot} meta={meta} onPlay={setVideoSrc}/>
                <CategorySection catKey="cold_low_cvr" ads={d.cold_low_cvr} meta={meta} onPlay={setVideoSrc}/>
                <CategorySection catKey="cold_zero_cv" ads={d.cold_zero_cv} meta={meta} onPlay={setVideoSrc}/>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
