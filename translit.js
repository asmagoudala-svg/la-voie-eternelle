/* Phonétique automatique à partir de l'arabe vocalisé (lecture liée, style francophone) */
(function(){
const C={'ب':'b','ت':'t','ث':'th','ج':'j','ح':'h','خ':'kh','د':'d','ذ':'dh','ر':'r','ز':'z','س':'s','ش':'sh','ص':'s','ض':'d','ط':'t','ظ':'z','ع':"'",'غ':'gh','ف':'f','ق':'q','ك':'k','ل':'l','م':'m','ن':'n','ه':'h','و':'w','ي':'y','ء':"'",'أ':"'",'إ':"'",'ؤ':"'",'ئ':"'",'ة':'t'};
const SUN='تثدذرزسشصضطظلن';
const V={'َ':'a','ِ':'i','ُ':'u'},TAN={'ً':'an','ٍ':'in','ٌ':'un'};
const SH='ّ',SK='ْ',DAG='ٰ';
const isMark=c=>/[ً-ٰٟ]/.test(c);
function word(w,first){
 w=w.replace(/[ۖ-ۭ]/g,'');
 const ch=[...w];let o='',i=0,skipSh=-1;
 const marks=j=>{let m='';j++;while(j<ch.length&&isMark(ch[j])){m+=ch[j];j++}return m};
 const next=j=>{j++;while(j<ch.length&&isMark(ch[j]))j++;return j};
 const bare=ch.filter(c=>!isMark(c)).join('');
 const allah=/لل(ه|هم)$/.test(bare)||bare.includes('للهم');
 // préfixe d'une lettre + article
 let p=0;if('وفبكل'.includes(ch[0])&&V[ch[1]]&&ch[2]==='ا'&&ch[3]==='ل'){o+=C[ch[0]]+V[ch[1]];p=2}
 if(ch[p]==='ا'&&ch[p+1]==='ل'&&(p>0||!V[ch[p+2]])){
  let j=p+2;if(ch[j]===SK)j++;const c2=ch[j],m2=marks(j);
  if(c2==='ل'&&m2.includes(SH)){o+=(first&&!p?'a':'');i=j;}
  else if(SUN.includes(c2)&&m2.includes(SH)){o+=(first&&!p?'a':'')+C[c2]+'-';i=j;skipSh=j;}
  else{o+=(first&&!p?'al-':'l-');i=j;}
 }else if(ch[0]==='ا'&&!V[ch[1]]){if(first)o+='i';i=1;}
 for(;i<ch.length;i++){
  const c=ch[i];if(isMark(c))continue;
  const m=marks(i),ni=next(i),nc=ch[ni],nm=nc?marks(ni):'';
  if(c==='آ'){o+=(o&&!o.endsWith('-')?"'":'')+'â';continue}
  if(c==='ا'||c==='ى')continue;
  let cons=C[c];if(cons===undefined){o+=c;continue}
  if((c==='أ'||c==='إ')&&(o===''||o.endsWith('-')))cons='';
  if((c==='أ'||c==='إ')&&['wa','fa','bi','li','ka','la'].includes(o)){o+='-';cons=''}
  if(c==='ة'&&!/[ً-ِ]/.test(m)){o+='h';continue}
  if((c==='و'||c==='ي')&&!m.replace(SK,'')&&i>0){const pv=o.slice(-1);if((c==='و'&&pv==='u')||(c==='ي'&&pv==='i')){o=o.slice(0,-1)+(c==='و'?'û':'î');continue}}
  if(m.includes(SH)&&i!==skipSh)cons=cons.length>1?cons[0]+cons:cons+cons;
  o+=cons;
  let v='';for(const k of m){if(V[k])v=V[k];if(TAN[k])v=TAN[k]}
  if(m.includes(DAG))v='â';
  if(c==='إ'&&!v)v='i';if(c==='أ'&&!v)v='a';
  if(v==='a'&&(nc==='ا'||nc==='ى')&&!V[nm[0]||''])v='â';
  if(allah&&c==='ل'&&m.includes(SH)&&nc==='ه')v='â';
  o+=v;
 }
 return o;
}
window.translit=function(ar){if(!ar)return '';
 return ar.split(/\n/).map(line=>{let first=true;return line.split(/\s+/).filter(Boolean).map(w=>{
   if(/^[،,.:؟!…·۝()«»"]+$/.test(w)){first=/[.:؟!·۝،…]/.test(w);return w.replace('،',',').replace('؟','?').replace('۝','·')}
   const p=w.match(/[،.:؟!]+$/);const core=p?w.slice(0,-p[0].length):w;
   let t=word(core,first);first=!!(p&&/[.:؟!،]/.test(p[0]));
   return t+(p?p[0].replace('،',',').replace('؟','?'):'');
 }).join(' ')}).join('\n').replace(/\s+,/g,',');
};
})();
