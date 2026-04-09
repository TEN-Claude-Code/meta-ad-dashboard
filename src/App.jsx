import { useState, useEffect } from "react";

const RANKING_API = "https://hiuclxudffbdtqtzlirc.supabase.co/functions/v1/meta-ad-ranking";
const THUMB_API = "https://hiuclxudffbdtqtzlirc.supabase.co/functions/v1/meta-thumbnail-proxy";

const ACCOUNTS = ["DA", "KLG", "星組", "shiroiro"];
const ACCT_COLORS = { DA: "#2563eb", KLG: "#7c3aed", "星組": "#dc2626", shiroiro: "#059669" };
const yen = n => "¥" + Number(n).toLocaleString();

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

function AdCard({ ad, rank, type, meta, onPlay }) {
  const isTop = type === "top";
  const m = meta || {};
  const imgSrc = m.image_url || m.thumbnail_url;
  const isVideo = m.is_video;
  const destUrl = m.destination_url;
  const [imgErr, setImgErr] = useState(false);

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
          background:isTop?"#22c55e":"#ef4444",color:"#fff",fontWeight:700,fontSize:11,
          padding:"2px 10px",borderRadius:12,fontFamily:"monospace",
        }}>{isTop ? "🏆" : "💀"} #{rank}</div>
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
          <div style={{color:"#bbb",fontSize:11}}>{imgSrc === undefined ? "読込中..." : "No thumbnail"}</div>
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
            🔗 {destUrl.replace(/^https?:\/\//,"").slice(0,60)}{destUrl.length>68?"...":""}
          </a>
        )}

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginTop:"auto"}}>
          {[
            {l:"CPO",v:yen(ad.cpo),hi:true},
            {l:"消化",v:yen(ad.spend)},
            {l:"CVR",v:ad.cvr+"%"},
            {l:"CV",v:ad.cv+"件"},
          ].map(({l,v,hi})=>(
            <div key={l} style={{background:"#f9fafb",borderRadius:6,padding:"5px 8px"}}>
              <div style={{fontSize:9,color:"#9ca3af"}}>{l}</div>
              <div style={{
                fontSize:hi?15:12,fontWeight:700,fontFamily:"monospace",
                color:hi?(isTop?"#16a34a":"#dc2626"):"#374151",
              }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function buildAccountData(rows) {
  const result = {};
  for (const acct of ACCOUNTS) {
    const acctRows = rows.filter(r => r.account === acct);
    result[acct] = {
      top: acctRows.filter(r => r.top_rank <= 3).sort((a,b) => a.top_rank - b.top_rank),
      worst: acctRows.filter(r => r.worst_rank <= 3).sort((a,b) => a.worst_rank - b.worst_rank),
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

  // Fetch ranking data
  useEffect(() => {
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await fetch(`${RANKING_API}?period=${period}`);
        const d = await res.json();
        if (d.error) { setError(d.error); return; }
        setSyncInfo({ latest_date: d.latest_date, latest_sync: d.latest_sync });
        const acctData = buildAccountData(d.data || []);
        setAccountData(acctData);

        // Fetch thumbnails for all ad_ids
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
              Meta広告 バナーTOP3 / WORST3
            </h1>
            <p style={{fontSize:12,color:"#9ca3af",margin:"4px 0 0"}}>
              アカウント別 · CPO順 · 動画は▶クリックで再生
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
            if (!d || (d.top.length === 0 && d.worst.length === 0)) return null;
            const acColor = ACCT_COLORS[acct];
            return (
              <div key={acct+period} style={{marginBottom:32}}>
                <div style={{
                  display:"flex",alignItems:"center",gap:8,marginBottom:14,
                  paddingBottom:8,borderBottom:"2px solid "+acColor+"22",
                }}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:acColor}}/>
                  <h2 style={{fontSize:16,fontWeight:700,margin:0,color:acColor}}>{acct}</h2>
                </div>

                {d.top.length > 0 && (
                  <div style={{marginBottom:16}}>
                    <h3 style={{fontSize:13,fontWeight:600,color:"#16a34a",margin:"0 0 10px",display:"flex",alignItems:"center",gap:6}}>
                      <span style={{background:"#dcfce7",padding:"2px 8px",borderRadius:6,fontSize:11}}>🏆 TOP 3</span>
                    </h3>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
                      {d.top.map((ad,i)=>(
                        <AdCard key={ad.ad_id+period} ad={ad} rank={i+1} type="top" meta={meta[ad.ad_id]} onPlay={setVideoSrc}/>
                      ))}
                    </div>
                  </div>
                )}

                {d.worst.length > 0 && (
                  <div>
                    <h3 style={{fontSize:13,fontWeight:600,color:"#dc2626",margin:"0 0 10px",display:"flex",alignItems:"center",gap:6}}>
                      <span style={{background:"#fef2f2",padding:"2px 8px",borderRadius:6,fontSize:11}}>💀 WORST 3</span>
                    </h3>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
                      {d.worst.map((ad,i)=>(
                        <AdCard key={ad.ad_id+period+"w"} ad={ad} rank={i+1} type="worst" meta={meta[ad.ad_id]} onPlay={setVideoSrc}/>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
