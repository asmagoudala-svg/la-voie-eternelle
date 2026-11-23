/* ---------- Invocations ---------- */
const hour=()=>new Date().getHours();
const CC={maison:['house',['#1b1f5e','#4a4fa6']],priere:['rugobj',['#164a5c','#2c7286']],purification:['fountain',['#1c3a8c','#3456b0']],mosquee:['mosque',['#155a4a','#2f8a6c'],'translate(110 30) scale(.85)'],nourriture:['dates',['#2a1f66','#5a4fae']],maladie:['honey',['#1d5566','#2f7b8a']],protection:['shield',['#123d33','#2b6b55']],humeur:['sunburst',['#2a5d8f','#6aa0c8']],peur:['lantern',['#101a38','#2a3d6e'],'translate(130 30) scale(.9)'],mariage:['rings',['#6b2d52','#c26a8a']],jeune:['crescentobj',['#241a4a','#5a3f7e']],salutation:['dove',['#1f5c7a','#4a96b0'],'translate(70 20) scale(.9)'],assemblee:['tea',['#5a2f1a','#a8673a']],hajj:['kaaba',['#6a4a1c','#c08f4a']],omra:['kaaba',['#155a6a','#3a8fa0']],deces:['tree',['#3b3550','#7a6d8f'],'translate(60 20) scale(.9)'],evenements:['hourglass',['#5a3a1a','#b07a3c']],nature:['cloudrain',['#1e5a46','#4f9a7a']],biens:['wheat',['#6b4c12','#c79a3a']],rabbana:['book',['#5a2a6e','#d06a90'],'translate(150 40) scale(.8)'],coran:['hands',['#1f3d6b','#4f7fb8'],'translate(140 20) scale(.9)']};
const WIDE={rabbana:1,coran:1};
const CHEV='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>';
function suggestCats(){const h=hour(),first=h>=3&&h<12?'matin':h>=21||h<3?'sommeil':'soir';return [first,...['matin','soir','sommeil'].filter(x=>x!==first)].map(i=>CATS.find(c=>c.id===i))}
const LBL={matin:'Matin',soir:'Soir',sommeil:'Nuit'};
function sqCard(c){return `<a class="sq" href="#cat-${c.id}">${pic(c.sc)}<span>${LBL[c.id]||c.name}</span></a>`}
function tile(c){const [m,col,t]=CC[c.id]||['none',['#294735','#3f6b52']];const w=WIDE[c.id];
  return `<a class="tl ${w?'w':''}" href="#cat-${c.id}">${cardArt(m,col,{t:t||(w?'translate(150 30) scale(.8)':undefined)})}<b>${c.name.replace(/^(Le |La |Les |L')/,'').replace(/^./,x=>x.toUpperCase())}</b>${w?`<em>${c.sub}</em>`:''}</a>`}
function treasure(){return `<a class="tl w tr" href="#cat-recompenses">${cardArt('chest',['#0f3b3a','#3fa596'],{t:'translate(120 40) scale(.85)'})}<b>Les trésors</b><em>Découvre les récompenses inestimables de l'invocation au quotidien</em></a>`}
let IQ='';
function invocations(){const fv=Object.keys(S.fav).filter(k=>S.fav[k]&&duaByKey(k));
  return `<div class="ih"><h1 class="bc">Invocations</h1><a class="ib" href="#cat-favoris" aria-label="Mes favorites" style="color:#f3efe6;text-decoration:none">${SVGS.heart(fv.length)}</a></div>
  <div class="hs">${suggestCats().map(sqCard).join('')}</div>
  <div class="search" style="position:static;background:transparent"><input type="search" id="iq" value="${esc(IQ)}" placeholder="Rechercher : pluie, colère, voyage, dette…" aria-label="Rechercher une invocation"></div>
  <div id="ires"></div>
  <div id="igrid"><h2 class="bc sec">Récompenses inestimables</h2><div class="tls">${treasure()}</div>
  <h2 class="bc sec">Catégories</h2><div class="tls">${CATS.filter(c=>!['matin','soir','sommeil','recompenses'].includes(c.id)).map(tile).join('')}</div></div>
  <p class="small muted pad" style="margin-top:18px">Textes du Coran et de hadiths authentiques (sahîh) ou bons (hasan), avec leur référence. Traductions proches du sens.</p>`}
function fillInv(){const q=norm(IQ),r=$('#ires'),g=$('#igrid');if(!q){r.innerHTML='';g.style.display='';return}g.style.display='none';
  const out=[];CATS.forEach(c=>c.items.forEach((d,i)=>{if([d.t,d.h,d.fr,d.f,c.name,d.ar].some(v=>norm(v).includes(q)))out.push(row(c.id,i,d,out.length+1,c.name))}));
  r.innerHTML=`<div class="rows">${out.join('')||'<p class="muted pad">Aucune invocation trouvée.</p>'}</div>`}
const SVGS={play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z"/></svg>',copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h3"/></svg>',heart:f=>`<svg viewBox="0 0 24 24" width="22" height="22" fill="${f?'currentColor':'none'}" stroke="currentColor" stroke-width="1.8"><path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z"/></svg>`};
const duaByKey=k=>{const i=k.lastIndexOf('-');const c=CATS.find(x=>x.id===k.slice(0,i));return c&&c.items[+k.slice(i+1)]};
function row(cid,i,d,num,sub){const k=cid+'-'+i,c=S.cnt[today()+'|'+k]||0,ok=d.n&&c>=d.n;
  return `<a class="ri" href="#dua-${k}"><span class="num ${ok?'ok':''}">${ok?'✓':num}</span><span class="tt">${esc(d.t)}${sub||d.n||d.f?`<small>${sub?esc(sub):''}${d.n&&!sub?`À répéter ${d.n} fois`:''}${d.f&&!sub?`${d.n?' · ':''}<span class="gold">★ Récompense</span>`:''}</small>`:''}</span>${S.fav[k]?'<span class="fv">♥</span>':''}${CHEV}</a>`}
const RC=['#5aa79c','#244b5a','#98bd95','#3b7478','#e6c86e','#2f6f78','#6f8fb0','#c98f6a'];
function hero(c,title){return `<div class="chh">${pic(c.sc,'chero')}<button class="ib back" data-back aria-label="Retour">${I.back}</button><h1 class="bc">${title}</h1></div>`}
function catView(id){
  if(id==='favoris'){const ks=Object.keys(S.fav).filter(k=>S.fav[k]&&duaByKey(k));
    return `${hero({sc:{s:['#3a1d2e','#8a3d5a','#e08aa0'],c:'none',l:'none',m:'rose',x:['stars','glow']}},'MES FAVORITES')}<div class="sheet">${ks.length?`<div class="rows">${ks.map((k,n)=>{const j=k.lastIndexOf('-'),c=CATS.find(x=>x.id===k.slice(0,j));return row(c.id,+k.slice(j+1),duaByKey(k),n+1,c.name)}).join('')}</div>`:'<p class="muted pad">Touche le cœur d\'une invocation pour la retrouver ici.</p>'}</div>`}
  const c=CATS.find(x=>x.id===id);if(!c)return invocations();
  if(id==='recompenses')return `${hero({sc:{s:['#08201f','#145150','#3fa596'],c:'none',l:'none',m:'chest',x:['stars','glow']}},'RÉCOMPENSES<br>INESTIMABLES')}<div class="sheet"><div class="rcs">${c.items.map((d,i)=>{const bg=RC[i%RC.length],lt=['#98bd95','#e6c86e','#5aa79c'].includes(bg);return `<a class="rc" href="#dua-recompenses-${i}" style="background:${bg};color:${lt?'#12261f':'#fff'}">${esc(d.h||d.t)}</a>`}).join('')}</div></div>`;
  const done=c.items.filter((d,i)=>d.n&&(S.cnt[today()+'|'+c.id+'-'+i]||0)>=d.n).length,withN=c.items.filter(d=>d.n).length;
  return `${hero(c,c.name.replace(/^(Le |La |Les |L')/,'').toUpperCase())}<div class="sheet"><p class="lead">${c.sub} · ${c.items.length} invocation${c.items.length>1?'s':''}${withN?` · ${done}/${withN} répétées aujourd'hui`:''}</p><div class="rows">${c.items.map((d,i)=>row(c.id,i,d,i+1)).join('')}</div></div>`}
function duaView(cid,i){const c=CATS.find(x=>x.id===cid),d=c&&c.items[i];if(!d)return invocations();
  const key=cid+'-'+i,cnt=S.cnt[today()+'|'+key]||0,n=d.n||0;
  return `<div class="chh sm">${pic(c.sc,'chero')}<button class="ib back" data-go="cat-${cid}" aria-label="Retour à ${c.name}">${I.back}</button><div class="dh"><span>${c.name} · ${i+1}/${c.items.length}</span><h1 class="bc">${esc(d.h||d.t)}</h1></div></div>
  <div class="sheet">
   <div class="ar dar" lang="ar">${d.ar}</div>
   <div class="blk"><div class="bl">Traduction</div><p>${esc(d.fr)}</p></div>
   ${d.f?`<div class="fadl"><b>${STAR.replace(/22/g,'14')} Récompense</b>${esc(d.f)}</div>`:''}
   <div class="blk"><div class="bl">Source</div>${gb(d.g)}<p class="small muted" style="margin-top:6px">${esc(d.src)}</p></div>
   ${n?`<button class="tap ${cnt>=n?'full':''}" data-cnt="${key}" data-n="${n}"><b>${Math.min(cnt,n)}<small> / ${n}</small></b><span>${cnt>=n?'Accompli aujourd\'hui · touche pour recommencer':'Touche à chaque répétition'}</span></button>`:''}
   <div class="acts"><button class="cbtn" data-say="${key}">${SVGS.play} Écouter</button><button class="cbtn fav" data-fav="${key}" aria-label="Favorite">${SVGS.heart(S.fav[key])}</button><button class="cbtn" data-dcopy="${key}">${SVGS.copy} Copier</button></div>
   <div class="pn">${i>0?`<a class="cbtn" href="#dua-${cid}-${i-1}">‹ Précédente</a>`:'<span></span>'}${i<c.items.length-1?`<a class="cbtn" href="#dua-${cid}-${i+1}">Suivante ›</a>`:''}</div>
   <p class="small muted" style="margin-top:14px">Audio : voix de synthèse (prototype) ; la version finale utilisera une récitation enregistrée.</p></div>`}
