import { useState, useEffect, useCallback } from "react";

const PROXY = "https://hiuclxudffbdtqtzlirc.supabase.co/functions/v1/meta-thumbnail-proxy";

const DATA = {
  "30d": {
    DA: {
      top: [
        { ad_id:"120240150900670697", ad_name:"広告文２×クリエイティブ３_VIO", cpo:2752, spend:5503, cv:2, ctr:1.51, cvr:10.0 },
        { ad_id:"120241935650690697", ad_name:"広告文２×動画_61_VIO", cpo:3701, spend:7402, cv:2, ctr:1.62, cvr:10.53 },
        { ad_id:"120240150900690697", ad_name:"広告文２×動画_47_VIO", cpo:4780, spend:4780, cv:1, ctr:0.93, cvr:10.0 },
      ],
      worst: [
        { ad_id:"120240578717660697", ad_name:"広告文２×クリエイティブ63 2250", cpo:26560, spend:26560, cv:1, ctr:0.75, cvr:2.56 },
        { ad_id:"120240701389380697", ad_name:"広告文２×動画56 2250", cpo:25774, spend:25774, cv:1, ctr:1.16, cvr:1.92 },
        { ad_id:"120240701335350697", ad_name:"広告文２×動画_54_VIO", cpo:22934, spend:45867, cv:2, ctr:1.37, cvr:1.64 },
      ],
    },
    KLG: {
      top: [
        { ad_id:"120241927245870660", ad_name:"1019_PTL_体毛-fv2_FV暗転修正.mov", cpo:3294, spend:3294, cv:1, ctr:1.13, cvr:3.85 },
        { ad_id:"120241934542860660", ad_name:"108108_PTL_静止画5_修正1.png", cpo:3972, spend:23830, cv:6, ctr:0.97, cvr:6.74 },
        { ad_id:"120240318547810660", ad_name:"1019_PTL_ひげ+@.mov", cpo:4826, spend:48263, cv:10, ctr:4.18, cvr:0.86 },
      ],
      worst: [
        { ad_id:"120241980183910660", ad_name:"1019_PTL_体毛-明るめbgm×fv2_FV暗転修正.mov", cpo:24377, spend:24377, cv:1, ctr:1.01, cvr:0.45 },
        { ad_id:"120240244297090660", ad_name:"1019_PTL_眉毛-+@.mov", cpo:16869, spend:67477, cv:4, ctr:0.99, cvr:1.04 },
        { ad_id:"120241927671290660", ad_name:"1019_PTL_体毛-明るめbgm×fv2_FV暗転修正.mov", cpo:16645, spend:33290, cv:2, ctr:1.09, cvr:0.73 },
      ],
    },
    "星組": {
      top: [
        { ad_id:"120241848735840726", ad_name:"OG_責任感じてる_1111.mov", cpo:6927, spend:27707, cv:4, ctr:1.07, cvr:3.54 },
        { ad_id:"120233611561180726", ad_name:"251018_②子どもとお風呂", cpo:9745, spend:58471, cv:6, ctr:1.31, cvr:1.81 },
        { ad_id:"120241902508370726", ad_name:"251018_②子どもとお風呂", cpo:10293, spend:72054, cv:7, ctr:1.24, cvr:1.82 },
      ],
      worst: [
        { ad_id:"120234731695350726", ad_name:"OG_責任感じてる_1111.mov", cpo:27553, spend:495960, cv:18, ctr:1.08, cvr:0.71 },
        { ad_id:"120241903051740726", ad_name:"251018_④遺伝で体毛濃い.mov", cpo:13357, spend:53428, cv:4, ctr:1.33, cvr:1.33 },
      ],
    },
    shiroiro: {
      top: [
        { ad_id:"120247871464380595", ad_name:"cr007_岩月岩月岩月_PAローション.png", cpo:12842, spend:51369, cv:4, ctr:1.01, cvr:2.63 },
        { ad_id:"120247621410090595", ad_name:"cr004_己瀬熊田_PAローション.png", cpo:15343, spend:61373, cv:4, ctr:0.79, cvr:3.25 },
        { ad_id:"120246972023450595", ad_name:"cr001_己瀬熊田_PAローション.png", cpo:43067, spend:43067, cv:1, ctr:0.77, cvr:1.02 },
      ],
      worst: [
        { ad_id:"120246972023450595", ad_name:"cr001_己瀬熊田_PAローション.png", cpo:43067, spend:43067, cv:1, ctr:0.77, cvr:1.02 },
        { ad_id:"120247621410090595", ad_name:"cr004_己瀬熊田_PAローション.png", cpo:15343, spend:61373, cv:4, ctr:0.79, cvr:3.25 },
        { ad_id:"120247871464380595", ad_name:"cr007_岩月岩月岩月_PAローション.png", cpo:12842, spend:51369, cv:4, ctr:1.01, cvr:2.63 },
      ],
    },
  },
  "90d": {
    DA: {
      top: [
        { ad_id:"120240150900670697", ad_name:"広告文２×クリエイティブ３_VIO", cpo:3029, spend:6058, cv:2, ctr:1.55, cvr:9.09 },
        { ad_id:"120239102711020697", ad_name:"広告文２×動画44 2250", cpo:3120, spend:6239, cv:2, ctr:1.03, cvr:14.29 },
        { ad_id:"120239933835760697", ad_name:"広告文２×クリエイティブ58 2250", cpo:3363, spend:3363, cv:1, ctr:0.98, cvr:11.11 },
      ],
      worst: [
        { ad_id:"120240401915320697", ad_name:"広告文２×クリエイティブ61 2250", cpo:34269, spend:34269, cv:1, ctr:1.58, cvr:0.97 },
        { ad_id:"120239773588000697", ad_name:"広告文２×動画53 2250", cpo:32131, spend:32131, cv:1, ctr:0.93, cvr:1.39 },
        { ad_id:"120240578717660697", ad_name:"広告文２×クリエイティブ63 2250", cpo:26560, spend:26560, cv:1, ctr:0.75, cvr:2.56 },
      ],
    },
    KLG: {
      top: [
        { ad_id:"120240414348250660", ad_name:"1019_PTL_眉毛-明るめbgm×fv2_修正1.mov", cpo:2875, spend:5749, cv:2, ctr:0.90, cvr:7.41 },
        { ad_id:"120241927245870660", ad_name:"1019_PTL_体毛-fv2_FV暗転修正.mov", cpo:3294, spend:3294, cv:1, ctr:1.13, cvr:3.85 },
        { ad_id:"120241934542860660", ad_name:"108108_PTL_静止画5_修正1.png", cpo:3972, spend:23830, cv:6, ctr:0.97, cvr:6.74 },
      ],
      worst: [
        { ad_id:"120241980183910660", ad_name:"1019_PTL_体毛-明るめbgm×fv2_FV暗転修正.mov", cpo:24377, spend:24377, cv:1, ctr:1.01, cvr:0.45 },
        { ad_id:"120240414348200660", ad_name:"1019_PTL_ひげ+@.mov", cpo:20009, spend:20009, cv:1, ctr:0.90, cvr:0.84 },
        { ad_id:"120241927671290660", ad_name:"1019_PTL_体毛-明るめbgm×fv2_FV暗転修正.mov", cpo:16645, spend:33290, cv:2, ctr:1.09, cvr:0.73 },
      ],
    },
    "星組": {
      top: [
        { ad_id:"120241848735840726", ad_name:"OG_責任感じてる_1111.mov", cpo:6927, spend:27707, cv:4, ctr:1.07, cvr:3.54 },
        { ad_id:"120233611561180726", ad_name:"251018_②子どもとお風呂", cpo:9745, spend:58471, cv:6, ctr:1.31, cvr:1.81 },
        { ad_id:"120241902508370726", ad_name:"251018_②子どもとお風呂", cpo:10293, spend:72054, cv:7, ctr:1.24, cvr:1.82 },
      ],
      worst: [
        { ad_id:"120241903051740726", ad_name:"251018_④遺伝で体毛濃い.mov", cpo:13357, spend:53428, cv:4, ctr:1.33, cvr:1.33 },
        { ad_id:"120234731695350726", ad_name:"OG_責任感じてる_1111.mov", cpo:11184, spend:1487425, cv:133, ctr:0.79, cvr:1.75 },
      ],
    },
    shiroiro: {
      top: [
        { ad_id:"120246972023450595", ad_name:"cr001_己瀬熊田_PAローション.png", cpo:7927, spend:150618, cv:19, ctr:0.84, cvr:5.25 },
        { ad_id:"120247621410090595", ad_name:"cr004_己瀬熊田_PAローション.png", cpo:7931, spend:71378, cv:9, ctr:0.79, cvr:6.38 },
        { ad_id:"120246972172370595", ad_name:"cr003_己瀬熊田_PAローション.png", cpo:10381, spend:124577, cv:12, ctr:0.99, cvr:3.77 },
      ],
      worst: [
        { ad_id:"120247871464380595", ad_name:"cr007_岩月岩月岩月_PAローション.png", cpo:13422, spend:53686, cv:4, ctr:1.02, cvr:2.53 },
        { ad_id:"120246972172370595", ad_name:"cr003_己瀬熊田_PAローション.png", cpo:10381, spend:124577, cv:12, ctr:0.99, cvr:3.77 },
      ],
    },
  },
};

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
          <div style={{color:"#bbb",fontSize:11}}>Loading...</div>
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
            {"🔗"} {destUrl.replace(/^https?:\/\//,"").slice(0,60)}{destUrl.length>68?"...":""}
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

export default function App() {
  const [period, setPeriod] = useState("30d");
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    (async () => {
      const ids = new Set();
      for (const p of ["30d","90d"]) {
        for (const acct of ACCOUNTS) {
          const d = DATA[p]?.[acct];
          if (d) {
            [...(d.top||[]),...(d.worst||[])].forEach(a=>ids.add(a.ad_id));
          }
        }
      }
      try {
        const res = await fetch(PROXY, {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({ad_ids:[...ids]}),
        });
        const data = await res.json();
        if (!data.error) setMeta(data);
      } catch(e) { console.error(e); }
      setLoading(false);
    })();
  }, []);

  const periodData = DATA[period] || {};

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

        {ACCOUNTS.map(acct => {
          const d = periodData[acct];
          if (!d) return null;
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

              <div style={{marginBottom:16}}>
                <h3 style={{fontSize:13,fontWeight:600,color:"#16a34a",margin:"0 0 10px",display:"flex",alignItems:"center",gap:6}}>
                  <span style={{background:"#dcfce7",padding:"2px 8px",borderRadius:6,fontSize:11}}>🏆 TOP 3</span>
                </h3>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
                  {(d.top||[]).map((ad,i)=>(
                    <AdCard key={ad.ad_id+period} ad={ad} rank={i+1} type="top" meta={meta[ad.ad_id]} onPlay={setVideoSrc}/>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{fontSize:13,fontWeight:600,color:"#dc2626",margin:"0 0 10px",display:"flex",alignItems:"center",gap:6}}>
                  <span style={{background:"#fef2f2",padding:"2px 8px",borderRadius:6,fontSize:11}}>💀 WORST 3</span>
                </h3>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
                  {(d.worst||[]).map((ad,i)=>(
                    <AdCard key={ad.ad_id+period+"w"} ad={ad} rank={i+1} type="worst" meta={meta[ad.ad_id]} onPlay={setVideoSrc}/>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
