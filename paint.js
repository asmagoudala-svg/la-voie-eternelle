/* Peintures « réalistes » : lumière, brume, profondeur, reflets, grain. viewBox 400×240 */
(function(){
let N=0;
const RN=s=>()=>(s=(s*16807)%2147483647)/2147483647;
const f1=n=>n.toFixed(1);
function ridge(R,y,amp,step=40,w=400){let pts=[];for(let x=-20;x<=w+20;x+=step)pts.push([x,y-R()*amp]);let d=`M${pts[0][0]} ${f1(pts[0][1])}`;for(let i=1;i<pts.length;i++){const [x0,y0]=pts[i-1],[x1,y1]=pts[i];const mx=(x0+x1)/2;d+=` Q${x0+step*.25} ${f1(y0)} ${mx} ${f1((y0+y1)/2)} T${x1} ${f1(y1)}`}return d+` V260 H-20Z`}
function P(spec){
 const id='p'+(++N),R=RN(spec.seed||(7+N*13));let defs='',o='';
 const G=(n,stops,v=1)=>{defs+=`<linearGradient id="${id}${n}" x1="0" y1="0" x2="${v?0:1}" y2="${v?1:0}">${stops.map(([of,c,op])=>`<stop offset="${of}" stop-color="${c}"${op!=null?` stop-opacity="${op}"`:''}/>`).join('')}</linearGradient>`;return `url(#${id}${n})`};
 const RG=(n,stops,cx=.5,cy=.5,r=.5)=>{defs+=`<radialGradient id="${id}${n}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([of,c,op])=>`<stop offset="${of}" stop-color="${c}"${op!=null?` stop-opacity="${op}"`:''}/>`).join('')}</radialGradient>`;return `url(#${id}${n})`};
 defs+=`<filter id="${id}b1"><feGaussianBlur stdDeviation="1"/></filter><filter id="${id}b3"><feGaussianBlur stdDeviation="3"/></filter><filter id="${id}b8" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter><filter id="${id}b20" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="20"/></filter>
 <filter id="${id}gr"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="${N}"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .55 0"/></filter>`;
 const B=k=>`filter="url(#${id}b${k})"`;
 const t=spec.time||'day';
 const sky=spec.sky||({day:['#7fb4d6','#cfe3ea','#f3ecd8'],dawn:['#7d8fb0','#e9b38a','#fbe1b0'],dusk:['#3d4f7a','#c9766a','#f3b46d'],night:['#050b1c','#10223f','#233a5c']})[t];
 o+=`<rect width="400" height="240" fill="${G('s',sky.map((c,i)=>[i/(sky.length-1),c]))}"/>`;
 // étoiles
 if(t==='night'){o+=`<path d="M-20 30Q140 90 420 150" stroke="#9fb6e0" stroke-opacity=".18" stroke-width="40" fill="none" ${B(20)}/>`;for(let i=0;i<120;i++){const r=R();o+=`<circle cx="${f1(R()*400)}" cy="${f1(R()*170)}" r="${f1(r*r*1.4+.25)}" fill="#fff" opacity="${f1(.35+R()*.65)}"/>`}}
 // astre
 const L=spec.light||({day:[300,52],dawn:[200,170],dusk:[110,168],night:[305,48]})[t];
 if(t==='night'){o+=`<circle cx="${L[0]}" cy="${L[1]}" r="46" fill="#dfe8ff" opacity=".18" ${B(20)}/>${spec.crescent?`<mask id="${id}cm"><rect width="400" height="240" fill="#fff"/><circle cx="${L[0]+9}" cy="${L[1]-6}" r="16" fill="#000"/></mask>`:''}<circle cx="${L[0]}" cy="${L[1]}" r="17" fill="${RG('mo',[[0,'#fffdf2'],[1,'#e8e2c8']],.4,.4,.7)}" ${spec.crescent?`mask="url(#${id}cm)"`:''}/><circle cx="${L[0]+5}" cy="${L[1]-3}" r="3" fill="#d8d0b0" opacity=".5"/><circle cx="${L[0]-6}" cy="${L[1]+5}" r="2" fill="#d8d0b0" opacity=".5"/>`;}
 else{const sc=t==='day'?'#fff8de':'#ffd08a';o+=`<circle cx="${L[0]}" cy="${L[1]}" r="${t==='day'?90:120}" fill="${sc}" opacity=".55" ${B(20)}/><circle cx="${L[0]}" cy="${L[1]}" r="${t==='day'?16:24}" fill="#fffbe9"/>`;
  if(spec.rays!==false)for(let i=0;i<7;i++){const a=(i-3)*.22+Math.PI/2,x2=L[0]+Math.cos(a)*420,y2=L[1]+Math.sin(a)*420,x3=L[0]+Math.cos(a+.05)*420,y3=L[1]+Math.sin(a+.05)*420;o+=`<path d="M${L[0]} ${L[1]}L${f1(x2)} ${f1(y2)}L${f1(x3)} ${f1(y3)}Z" fill="#fff6d8" opacity=".09" ${B(3)}/>`}}
 // nuages
 if(spec.clouds){const cc=t==='dusk'||t==='dawn'?'#f7c9a6':t==='night'?'#3a4d70':'#ffffff';for(let i=0;i<spec.clouds;i++){const x=R()*400,y=20+R()*70,s=.6+R()*.9;o+=`<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s)})" opacity=".85" ${B(3)}><ellipse rx="60" ry="12" fill="${cc}"/><ellipse cx="-18" cy="-8" rx="26" ry="14" fill="${cc}"/><ellipse cx="14" cy="-12" rx="30" ry="17" fill="${cc}"/><ellipse cx="0" cy="4" rx="56" ry="7" fill="#000" opacity=".06"/></g>`}}
 if(spec.rainbow)o+=`<g fill="none" stroke-width="9" opacity=".33" ${B(3)}>${['#ff6b5b','#ffb24a','#ffe66a','#7fd17a','#5aa8e6','#8a6fd1'].map((c,i)=>{const r=190-i*8;return `<path d="M${200-r} 220A${r} ${r} 0 0 1 ${200+r} 220" stroke="${c}"/>`}).join('')}</g>`;
 const haze=spec.haze||({day:'#dfe9e6',dawn:'#f4d2b0',dusk:'#e3a083',night:'#1b2d4a'})[t];
 // relief
 const land=spec.land||'hills';
 const LC=spec.lc||({day:[['#8fae9a','#a9c3a9'],['#5f8f5d','#7fa86b'],['#3f6f3e','#5c8a4c']],dawn:[['#9b8fa0','#c0a7a0'],['#6f7f5e','#93936a'],['#3f5f38','#62784a']],dusk:[['#6a5a78','#8a6a7a'],['#4a4f5a','#6a5a5a'],['#2a3530','#3d4438']],night:[['#1a2a44','#243656'],['#132238','#1b2c48'],['#0b1628','#0f1d33']]})[t];
 let world='';
 if(land==='dunes'){const DC=spec.dc||({day:['#e9c48a','#d8a868','#c48c4e'],dawn:['#e7b07c','#cf9160','#b47447'],dusk:['#c98a5e','#a8683f','#7f4a2c'],night:['#2a3350','#202840','#151c30']})[t];
  DC.forEach((c,i)=>{const y=168+i*22;world+=`<path d="M-20 ${y}Q${60+i*40} ${y-26} ${150+i*20} ${y-4}T${330-i*20} ${y-8}T440 ${y-2}V260H-20Z" fill="${G('d'+i,[[0,c],[1,DC[Math.min(i+1,2)]]])}"/><path d="M${150+i*20} ${y-4}Q${240-i*10} ${y-22} ${330-i*20} ${y-8}" stroke="#fff" stroke-opacity="${t==='night'?.05:.18}" stroke-width="2" fill="none"/>`})}
 else if(land==='sea'||land==='lake'||land==='none'){}
 else{const mount=land==='mount';LC.forEach((c,i)=>{const y=(mount?150:172)+i*24,amp=mount&&i===0?90:mount&&i===1?40:i===0?28:18;world+=`<path d="${ridge(R,y,amp,mount&&i===0?55:60)}" fill="${G('h'+i,[[0,c[1]],[1,c[0]]])}" ${i===0?B(1):''}/>`;if(mount&&i===0&&t!=='night')world+=`<path d="${ridge(RN(99),y-10,amp*.5,55)}" fill="#fff" opacity=".0"/>`;world+=`<rect y="${y-60}" width="400" height="120" fill="${G('z'+i,[[0,haze,0],[.5,haze,.22-i*.07],[1,haze,0]])}"/>`;
   if(spec.trees&&i===1)for(let k=0;k<14;k++){const x=R()*400,s=3+R()*4;world+=`<ellipse cx="${f1(x)}" cy="${f1(y-6-R()*10)}" rx="${f1(s)}" ry="${f1(s*1.3)}" fill="${c[0]}" opacity=".9" style="filter:brightness(.7)"/>`}})}
 // eau
 const wy=spec.water;
 if(wy){const wc=spec.wc||({day:['#7fa9bf','#3f6f86'],dawn:['#d9a98e','#5d6f86'],dusk:['#b5767a','#3a3f5a'],night:['#1b2c4a','#09121f']})[t];
  o+=world;world='';
  const above=`<g id="${id}above">${spec.subj&&spec.reflect?SUB[spec.subj](spec,G,RG,B,R,t):''}</g>`;
  o+=`<rect y="${wy}" width="400" height="${240-wy}" fill="${G('w',[[0,wc[0]],[1,wc[1]]])}"/>`;
  if(t==='night'||t==='dusk'||t==='dawn')o+=`<rect x="${L[0]-14}" y="${wy}" width="28" height="${240-wy}" fill="#fff3c8" opacity="${t==='night'?.25:.45}" ${B(3)}/>`;
  if(spec.subj&&spec.reflect)o+=`<g transform="translate(0 ${2*wy}) scale(1 -1)" opacity=".45" ${B(1)}><use href="#${id}above"/></g>`;
  for(let i=0;i<26;i++){const y=wy+4+R()*(236-wy),x=R()*400,w=10+R()*40;o+=`<path d="M${f1(x)} ${f1(y)}h${f1(w)}" stroke="#fff" stroke-opacity="${f1(.1+R()*.25)}" stroke-width="1"/>`}
  if(spec.subj&&spec.reflect){o+=above;spec._done=1}}
 o+=world;
 if(spec.rain){o+=`<g stroke="#e8f1f5" stroke-opacity=".5" stroke-width="1">${Array.from({length:70},()=>`<path d="M${f1(R()*420)} ${f1(R()*220)}l-6 16"/>`).join('')}</g>`}
 if(spec.subj&&!spec._done)o+=SUB[spec.subj](spec,G,RG,B,R,t);
 if(spec.fg==='grass'){for(let i=0;i<140;i++){const x=R()*400,h=6+R()*16,c=['#2f5a2c','#3e6e34','#4f8040','#24461f'][i%4];o+=`<path d="M${f1(x)} 242q${f1((R()-.5)*6)} -${f1(h/2)} ${f1((R()-.5)*8)} -${f1(h)}" stroke="${c}" stroke-width="1.4" fill="none"/>`}}
 if(spec.fg==='flowers'){for(let i=0;i<70;i++){const x=R()*400,y=190+R()*50,s=.5+(y-190)/40,c=['#f2a7b8','#ffffff','#f7d36b','#e9897c','#c8a2e0'][i%5];o+=`<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s)})" ${y<205?B(1):''}><path d="M0 0v14" stroke="#4f7a3c" stroke-width="1.5"/>${[0,72,144,216,288].map(a=>`<ellipse rx="3" ry="5" transform="rotate(${a}) translate(0 -4)" fill="${c}"/>`).join('')}<circle r="2" fill="#e8a83a"/></g>`}}
 if(spec.birds)o+=[[70,70],[88,62],[104,74],[260,92],[276,84]].map(([a,b])=>`<path d="M${a} ${b}q5-5 10 0q5-5 10 0" stroke="#2b2b2b" stroke-opacity=".55" stroke-width="1.6" fill="none"/>`).join('');
 // vignette + grain
 o+=`<rect width="400" height="240" fill="${RG('vg',[[.55,'#000',0],[1,'#000',.38]],.5,.45,.75)}"/><rect width="400" height="240" filter="url(#${id}gr)" opacity=".16"/>`;
 return `<svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>${defs}</defs>${o}</svg>`;
}
const SUB={
 mosque:(s,G,RG,B,R,t)=>{const x=s.mx||200,y=s.my||200,k=s.ms||1,lit=t==='night'||t==='dusk';const wall=G('mw',t==='night'?[[0,'#c9cfdc'],[1,'#8790a8']]:[[0,'#ffffff'],[1,'#d9d4c8']]),dome=RG('md',t==='night'?[[0,'#e6ebf5'],[1,'#7a849c']]:[[0,'#ffffff'],[.6,'#e8e3d8'],[1,'#b9b2a2']],.35,.3,.8),gold='#d8b25a',win=lit?'#ffd78a':'#5f6d7a';
  return `<g transform="translate(${x} ${y}) scale(${k})"><ellipse cx="0" cy="2" rx="120" ry="8" fill="#000" opacity=".25" ${B(3)}/>
  ${[-82,82].map(m=>`<rect x="${m-6}" y="-150" width="12" height="150" fill="${wall}"/><rect x="${m-9}" y="-112" width="18" height="5" fill="${gold}"/><rect x="${m-9}" y="-64" width="18" height="4" fill="${gold}"/><path d="M${m-7} -150q7-26 14 0z" fill="${dome}"/><path d="M${m} -176v-8" stroke="${gold}" stroke-width="1.5"/><rect x="${m-2}" y="-140" width="4" height="10" rx="2" fill="${win}"/>`).join('')}
  <rect x="-66" y="-52" width="132" height="52" fill="${wall}"/><rect x="-66" y="-56" width="132" height="5" fill="${gold}" opacity=".8"/>
  ${[-40,40].map(m=>`<path d="M${m-16} -56q0-22 16-28q16 6 16 28z" fill="${dome}"/><path d="M${m} -84v-8" stroke="${gold}" stroke-width="1.2"/>`).join('')}
  <rect x="-30" y="-74" width="60" height="20" fill="${wall}"/><path d="M-30 -74q0-44 30-56q30 12 30 56z" fill="${dome}"/><path d="M0 -130v-14" stroke="${gold}" stroke-width="2"/><circle cx="0" cy="-146" r="3" fill="${gold}"/>
  ${[-48,-28,-8,12,32].map(m=>`<path d="M${m+2} -8v-22a6 6 0 0 1 12 0v22z" fill="${win}" opacity=".9"/>`).join('')}
  <path d="M-12 0v-30a12 12 0 0 1 24 0v30z" fill="${lit?'#ffcf72':'#3b4652'}"/>${lit?`<rect x="-66" y="-40" width="132" height="40" fill="#ffd27a" opacity=".18" ${B(8)}/>`:''}</g>`},
 tree:(s,G,RG,B,R,t)=>{const x=s.tx||250,y=s.ty||212,k=s.ts||1,dark=t==='night'||t==='dusk';const cols=dark?['#1d3326','#2c4a34','#3c5f40']:['#2f5a2c','#4a7d3c','#79a85a'];let c='';for(let i=0;i<34;i++){const a=R()*Math.PI*2,r=R()*52,cx=Math.cos(a)*r*1.25,cy=-118+Math.sin(a)*r*.8,rr=14+R()*14;c+=`<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(rr)}" fill="${RG('t'+i,[[0,cols[2]],[.6,cols[1]],[1,cols[0]]],.35,.3,.7)}"/>`}
  return `<g transform="translate(${x} ${y}) scale(${k})"><ellipse cx="10" cy="2" rx="90" ry="9" fill="#000" opacity=".25" ${B(3)}/><path d="M-8 0q2-40-4-62q-14-14-20-26l6-2q10 12 20 20q4-20 0-36h8q4 22 2 40q12-10 22-24l6 4q-12 20-28 32q-2 26 4 54z" fill="${G('tk',[[0,'#3b2a1c'],[1,'#6b4a30']],0)}"/>${c}</g>`},
 palm:(s,G,RG,B,R,t)=>{const x=s.px||300,y=s.py||214,k=s.pk||1,dark=t==='night'||t==='dusk';let f='';for(let i=0;i<9;i++){const a=-160+i*36+(R()-.5)*14;let l='';for(let j=0;j<12;j++){const d=10+j*6;l+=`<path d="M${d} ${-j*.6}l${4} ${10-j*.5}" stroke="${dark?'#1c3022':'#3f6b2e'}" stroke-width="2.2"/><path d="M${d} ${-j*.6}l${4} -${10-j*.5}" stroke="${dark?'#26402c':'#5b8a3a'}" stroke-width="2.2"/>`}f+=`<g transform="translate(4 -150) rotate(${f1(a)})"><path d="M0 0q40-12 84 6" stroke="${dark?'#1c3022':'#4a7a30'}" stroke-width="3" fill="none"/>${l}</g>`}
  return `<g transform="translate(${x} ${y}) scale(${k})"><ellipse cx="20" cy="2" rx="60" ry="6" fill="#000" opacity=".25" ${B(3)}/><path d="M-6 0q-8-80 6-150h10q-10 70-2 150z" fill="${G('pt',[[0,'#5a4128'],[.5,'#8a6a44'],[1,'#4a3420']],0)}"/>${Array.from({length:16},(_,i)=>`<path d="M${-6+i*.6} ${-i*9}h12" stroke="#3a2a18" stroke-opacity=".5"/>`).join('')}${f}<circle cx="0" cy="-146" r="5" fill="#7a4a20"/><circle cx="8" cy="-144" r="4" fill="#6a3a18"/></g>`},
 lanterns:(s,G,RG,B,R,t)=>(s.lp||[[110,30,.8],[290,18,1],[200,8,.6]]).map(([x,y,k])=>`<g transform="translate(${x} ${y}) scale(${k})"><path d="M0 -40v40" stroke="#8a6a3a" stroke-width="1.5"/><circle cx="0" cy="44" r="60" fill="#ffc96a" opacity=".35" ${B(20)}/><path d="M-9 0h18l-3 10h-12z" fill="${G('lg'+x,[[0,'#f0d08a'],[1,'#9a7434']],0)}"/><path d="M-20 10h40l-6 64h-28z" fill="${RG('lgg'+x,[[0,'#fff3c4'],[.6,'#ffc45a'],[1,'#d98a2a']],.5,.45,.7)}"/><path d="M-20 10h40l-6 64h-28zM0 10v64M-10 10l3 64M10 10l-3 64" fill="none" stroke="#8a6a3a" stroke-width="1.6"/><path d="M-16 74h32l-7 11h-18z" fill="#b48a44"/><circle cy="90" r="3" fill="#b48a44"/></g>`).join(''),
 book:(s,G,RG,B,R,t)=>{let lines='';for(let i=0;i<9;i++){lines+=`<path d="M-78 ${-58+i*7}q34-6 66 4" stroke="#6a5a40" stroke-opacity=".45" stroke-width="1.1" stroke-dasharray="${2+R()*3} ${1+R()*2}" fill="none"/><path d="M12 ${-54+i*7}q32-10 66-4" stroke="#6a5a40" stroke-opacity=".45" stroke-width="1.1" stroke-dasharray="${2+R()*3} ${1+R()*2}" fill="none"/>`}
  return `<g transform="translate(200 214)"><ellipse rx="150" ry="14" fill="#000" opacity=".3" ${B(3)}/><circle cx="0" cy="-70" r="110" fill="#ffd98a" opacity=".3" ${B(20)}/>
  <path d="M-70 0l140-70M70 0l-140-70" stroke="${G('wd',[[0,'#7a4a24'],[1,'#3e2512']])}" stroke-width="9" stroke-linecap="round"/>
  <path d="M0-50q-44-20-94-10v58q50-10 94 12z" fill="${G('pg1',[[0,'#fffaf0'],[1,'#e6d8b8']],0)}"/><path d="M0-50q44-20 94-10v58q-50-10-94 12z" fill="${G('pg2',[[0,'#e9dcbd'],[1,'#fffaf0']],0)}"/>
  <path d="M-94-60v58M94-60v58" stroke="#2a5a40" stroke-width="5"/><path d="M0-50v60" stroke="#c9a45c" stroke-width="2"/>${lines}<path d="M-90-56q40-12 86 4" stroke="#c9a45c" stroke-width="1.5" fill="none"/></g>`},
 door:(s,G,RG,B,R,t)=>{let z='';for(let i=0;i<10;i++)for(let j=0;j<4;j++)z+=`<path d="M${-150+i*30} ${-30+j*14}l7 7-7 7-7-7z" fill="${(i+j)%2?'#2a6a58':'#c9a45c'}" opacity=".55"/>`;
  return `<g transform="translate(200 240)"><rect x="-210" y="-240" width="420" height="240" fill="${G('wl',[[0,'#e9dcc4'],[1,'#c9b494']])}"/>${z}<path d="M-80 0v-130q0-62 80-84q80 22 80 84v130z" fill="${G('dw',[[0,'#fff1c8'],[1,'#ffd27a']])}"/><path d="M-80 0v-130q0-62 80-84q80 22 80 84v130" fill="none" stroke="#a9884c" stroke-width="8"/><path d="M-80 0v-130q0-62 80-84v214z" fill="${G('dl',[[0,'#3a2414'],[1,'#6a4428']],0)}"/>${Array.from({length:5},(_,i)=>`<circle cx="-18" cy="${-150+i*30}" r="3" fill="#c9a45c"/>`).join('')}<path d="M0 0L60 -8 260 40 -40 40z" fill="#ffe3a0" opacity=".35" ${B(8)}/></g>`},
 rose:(s,G,RG,B,R,t)=>{let bk='';for(let i=0;i<18;i++)bk+=`<circle cx="${f1(R()*400)}" cy="${f1(R()*180)}" r="${f1(8+R()*22)}" fill="${['#f6d6c8','#fff1d6','#d7e8c8','#f3c3c8'][i%4]}" opacity=".45" ${B(8)}/>`;
  const pet=(r,c1,c2,n,ro)=>Array.from({length:n},(_,i)=>`<ellipse rx="${r}" ry="${r*.75}" transform="rotate(${ro+i*360/n}) translate(0 -${r*.55})" fill="${RG('rp'+r+i,[[0,c1],[1,c2]],.5,.3,.8)}"/>`).join('');
  return bk+`<g transform="translate(220 240)"><path d="M0 0q-8-70 6-130" stroke="${G('st',[[0,'#2c4a24'],[1,'#4f7a3a']],0)}" stroke-width="6" fill="none"/>${[-40,-74,-104].map((y,i)=>`<path d="M${i%2?4:-3} ${y}l${i%2?11:-11} -5l${i%2?-8:8} 10z" fill="#3a5a2c"/>`).join('')}<path d="M4-70q36-30 60-6q-34 16-60 6z" fill="${G('lf',[[0,'#5f8f45'],[1,'#2f5a28']])}"/><path d="M2-96q-36-20-56 2q30 12 56-2z" fill="${G('lf2',[[0,'#6a9a4f'],[1,'#335f2a']])}"/>
  <g transform="translate(6 -150)">${pet(30,'#e8566e','#8a1830',7,0)}${pet(22,'#f06a80','#a42040',6,25)}${pet(14,'#f88a9a','#b82a48',5,10)}<circle r="7" fill="#9a1c36"/></g></g>`},
 caravan:(s,G,RG,B,R,t)=>`<g fill="#2a1a14">${[[110,198,.95],[180,192,.8],[240,186,.65],[290,182,.5]].map(([x,y,k],i)=>`<g transform="translate(${x} ${y}) scale(${k})"><path d="M-44 0l2-30q2-16 18-18q8-18 22-6q10-12 22 2q14-2 16 12l14-12q10-4 12 4l-10 8v10q-4 6-10 0v30h-6v-26h-34v26h-6v-26h-6z"/>${i%2?'':`<path d="M-30-46v-14h10v14" />`}<ellipse cx="40" cy="2" rx="70" ry="4" fill="#000" opacity=".25"/></g>`).join('')}</g>`,
 village:(s,G,RG,B,R,t)=>{let h='';[[40,60,50],[95,46,70],[150,70,44],[210,52,60],[265,64,50],[320,48,66],[372,58,46]].forEach(([x,w,hh],i)=>{h+=`<rect x="${x-w/2}" y="${222-hh}" width="${w}" height="${hh}" fill="${G('vh'+i,[[0,'#f6ecd8'],[1,'#d8c4a0']],0)}"/><rect x="${x-w/2}" y="${222-hh}" width="${w*.35}" height="${hh}" fill="#000" opacity=".08"/><rect x="${x-w/2-2}" y="${222-hh-4}" width="${w+4}" height="5" fill="#c9b08a"/>${[0,1].map(j=>`<path d="M${x-w/4+j*w/2-4} ${222-hh*.55}v-10a4 4 0 0 1 8 0v10z" fill="${t==='dawn'||t==='dusk'?'#ffcf7a':'#6a7a84'}"/>`).join('')}`});
  return `<rect x="200" y="96" width="8" height="126" fill="#f4ead6"/><path d="M198 96q6-22 12 0z" fill="#d8b25a"/>${h}<rect y="220" width="400" height="20" fill="#6a7a4a"/>`},
 arafat:(s,G,RG,B,R,t)=>{let c='';for(let i=0;i<260;i++){const x=R()*400,y=196+R()*44;c+=`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(.8+(y-196)/30)}" fill="#fffdf6" opacity=".9"/>`}
  return `<path d="M60 206q70-90 140-100q70 10 140 100z" fill="${G('af',[[0,'#c9a77a'],[1,'#8a6a46']])}"/><path d="M200 106q50 20 140 100h-60q-40-60-80-100z" fill="#000" opacity=".15"/>${Array.from({length:40},()=>`<circle cx="${f1(100+R()*200)}" cy="${f1(150+R()*50)}" r="1.3" fill="#a5855a"/>`).join('')}<rect x="195" y="70" width="10" height="38" fill="#fbf8f0"/><path d="M193 70h14l-7-10z" fill="#fbf8f0"/>${c}`},
 path:(s,G,RG,B,R,t)=>`<path d="M140 242Q190 200 205 180T214 150" stroke="${G('pa',[[0,'#e9d6a8'],[1,'#c9b27c']])}" stroke-width="40" stroke-linecap="round" fill="none" opacity=".9"/><path d="M140 242Q190 200 205 180T214 150" stroke="#fff" stroke-opacity=".25" stroke-width="2" stroke-dasharray="5 9" fill="none"/>`,
 river:(s,G,RG,B,R,t)=>`<path d="M160 242Q120 210 200 192T214 166Q200 160 222 156" stroke="${G('rv',[[0,'#9fd0e0'],[1,'#5a8fa8']])}" stroke-width="34" stroke-linecap="round" fill="none"/><path d="M160 242Q120 210 200 192T214 166" stroke="#fff" stroke-opacity=".45" stroke-width="2" fill="none"/>`,
 kaaba:(s,G,RG,B,R,t)=>{let c='';for(let i=0;i<220;i++){const a=R()*Math.PI*2,r=110+R()*70;c+=`<circle cx="${f1(200+Math.cos(a)*r*1.3)}" cy="${f1(206+Math.sin(a)*r*.18)}" r="1.6" fill="#fff" opacity=".9"/>`}
  return `<ellipse cx="200" cy="206" rx="200" ry="30" fill="#f6f2ea"/>${c}<path d="M154 200v-80l46-14v104z" fill="#111"/><path d="M200 106l52 10v80l-52 10z" fill="#232323"/><path d="M154 136l46-12 52 10v9l-52-10-46 12z" fill="#d8b25a"/>`}
};
SUB.lake=SUB.none=()=>'';
window.paint=P;
})();
