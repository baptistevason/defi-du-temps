/* Moteur d'évaluation : on répond à tout, puis on voit le score et le corrigé */
(function(){
 const P=new URLSearchParams(location.search);
 const t=EVALS[P.get("t")]?P.get("t"):"jours";
 const topic=EVALS[t];
 const test=topic.tests.find(x=>x.id===P.get("k"))||topic.tests[0];
 shell("evals","Évaluation : réponds à tout, tu verras le corrigé à la fin !");
 const main=$("#main");
 const Q=test.mk();
 const A=new Array(Q.length).fill(null);   // réponses
 let n=0;
 document.title=test.title+" – Évaluation – Le Défi du Temps";

 function bar(){return `<div class="progress">${Q.map((_,j)=>`<i class="${j<n?"on":j===n?"cur":""}"></i>`).join("")}</div>`}
 function frame(inner,nextLabel,enabled){
  main.innerHTML=`<a class="btn alt noprint" href="evaluations.html">← Quitter</a>
  <h1 style="color:${topic.col}">${topic.e} ${esc(test.title)}</h1>
  <p class="hint">Question ${n+1} sur ${Q.length}</p>${bar()}
  <div class="card">${inner}</div>
  <div class="row" style="margin-top:14px"><button class="btn big" id="next" ${enabled?"":"disabled"}>${nextLabel}</button></div>`;
  $("#next").onclick=()=>{if(n<Q.length-1){n++;ask()}else finish()};
  window.scrollTo(0,0);
 }
 function setReady(ok){const b=$("#next");if(b)b.disabled=!ok}
 const lbl=()=>n===Q.length-1?"Terminer l'évaluation 🏁":"Question suivante →";

 function ask(){
  const q=Q[n];
  if(q.type==="choice"){
   const ch=q.fixed?q.choices:shuffle(q.choices);
   frame(`<div class="prompt">${q.prompt}</div>${q.speak?'<div class="row"><button class="btn alt big" id="spk">🔊 Écouter</button></div>':""}<div class="choices">${ch.map((c,i)=>`<button class="choice" data-i="${i}">${esc(c)}</button>`).join("")}</div>`,lbl(),A[n]!==null);
   if(q.speak){speak(q.speak,q.lang||"en-GB");$("#spk").onclick=()=>speak(q.speak,q.lang||"en-GB")}
   $$(".choice").forEach((b,i)=>{b.onclick=()=>{$$(".choice").forEach(x=>x.classList.remove("sel"));b.classList.add("sel");A[n]=ch[i];setReady(true)}});
  }else if(q.type==="compose"){
   const free=!!q.free;
   let tiles=free?q.free.map((l,i)=>({id:i,l})):shuffle(q.items.map((l,i)=>({id:i,l})));
   let ans=[];
   frame(`<div class="prompt">${q.prompt}</div><div class="slots" id="slots" aria-label="Ta réponse"></div><p class="hint">${free?"Touche I, V ou X.":"Touche les cartes dans l'ordre."} Touche une lettre de ta réponse pour la retirer.</p><div class="tiles" id="tiles"></div>`,lbl(),false);
   const draw=()=>{
    $("#slots").innerHTML=ans.length?ans.map((x,i)=>`<button class="slot" data-r="${i}" aria-label="Retirer ${esc(x.l)}">${esc(x.l)}</button>`).join(""):'<span class="hint">Ta réponse apparaît ici…</span>';
    $("#tiles").innerHTML=tiles.map(x=>`<button class="tile ${!free&&ans.includes(x)?"used":""}" data-a="${x.id}" ${!free&&ans.includes(x)?"disabled":""} style="${free?"font-size:1.8rem;min-width:84px":""}">${esc(x.l)}</button>`).join("");
    $$("[data-a]").forEach(b=>b.onclick=()=>{const x=tiles.find(y=>y.id==b.dataset.a);if(free){if(ans.length<8)ans.push({id:x.id,l:x.l})}else ans.push(x);upd()});
    $$("[data-r]").forEach(b=>b.onclick=()=>{ans.splice(+b.dataset.r,1);upd()});
   };
   const upd=()=>{A[n]=ans.length?ans.map(x=>x.l):null;draw();setReady(ans.length>0)};
   if(Array.isArray(A[n])){ /* retour impossible, mais on garde la logique simple */ }
   draw();
  }else if(q.type==="type"){
   frame(`<div class="prompt">${q.prompt}</div>${q.silent?"":'<div class="row" style="margin:6px 0"><button class="btn alt" id="spk">🔊 Écouter le mot</button></div>'}<input id="ans" class="txt" ${q.numeric?'inputmode="numeric" pattern="[0-9]*" style="max-width:200px;font-size:1.6rem"':""} autocomplete="off" autocapitalize="none" spellcheck="false" aria-label="Ta réponse"><p class="hint">${q.silent?"Écris le résultat, sans aide.":"Écris sans aide. Les accents comptent !"}</p>`,lbl(),false);
   if(!q.silent)speak(q.answer);
   if($("#spk"))$("#spk").onclick=()=>speak(q.answer);
   const inp=$("#ans");inp.focus();
   inp.addEventListener("input",()=>{A[n]=inp.value.trim()||null;setReady(!!A[n])});
   inp.addEventListener("keydown",e=>{if(e.key==="Enter"&&A[n])$("#next").click()});
  }
 }

 function isOk(i){
  const q=Q[i],a=A[i];if(a===null)return false;
  if(q.type==="choice")return a===q.answer;
  if(q.type==="compose")return a.join("")===q.answer.join("");
  return a.toLowerCase()===q.answer;
 }
 function shown(i){const q=Q[i],a=A[i];if(a===null)return "(pas de réponse)";return q.type==="compose"?a.join(q.free?"":" "):a}
 function good(i){const q=Q[i];return q.type==="compose"?q.answer.join(q.free?"":" "):q.answer}

 function finish(){
  const total=Q.length;let sc=0;const rows=Q.map((q,i)=>{const ok=isOk(i);if(ok)sc++;
   let extra="";if(!ok&&q.type==="type"&&A[i]&&strip(A[i].toLowerCase())===strip(q.answer))extra=" (presque : pense aux accents !)";
   return `<div class="corr ${ok?"":"bad"}"><b>${i+1}. ${ok?"✅":"❌"}</b> ${q.prompt}<br>${ok?`Ta réponse : <b>${esc(shown(i))}</b>`:`Ta réponse : <b>${esc(shown(i))}</b>${extra}<br>Bonne réponse : <b>${esc(good(i))}</b>`}${!ok&&q.explain?`<br><span class="hint">${q.explain}</span>`:""}</div>`}).join("");
  const prev=S.scores[test.id];S=load();const bdg0=earned();
  const old=S.scores[test.id];
  S.scores[test.id]={best:Math.max(old?old.best:0,sc),n:total,last:sc,date:new Date().toISOString().slice(0,10)};save();recordAttempt(test.id,sc,total);const bdg1=earned();const newB=BADGES.filter(b=>bdg1[b[0]]&&!bdg0[b[0]]);const nb=newB.length?"<div class=\"card newb\"><h3>🎖️ "+(newB.length>1?"Nouvelles médailles":"Nouvelle médaille")+" !</h3><div class=\"bdgrow\">"+newB.map(b=>"<span class=\"bdg\"><i>"+b[1]+"</i><b>"+b[2]+"</b><small>"+b[3]+"</small></span>").join("")+"</div><p><a href=\"carnet.html\">Voir mon carnet →</a></p></div>":"";
  const r=sc/total,b=badge({best:sc,n:total});
  const msg=r>=.9?"INCROYABLE ! Tu maîtrises ce sujet !":r>=.6?"Bien joué ! Encore un petit entraînement et ce sera parfait.":"Pas de souci ! Retourne voir la leçon, puis refais l'évaluation.";
  say(r>=.9?"Bravo, champion !!! 🎉":r>=.6?"Bien joué !":"On revoit la leçon ensemble ?");if(r>=.9||newB.length)confetti();
  const again=`<a class="btn big" href="evaluation.html?t=${t}&k=${test.id}">🔁 Refaire</a>`;
  main.innerHTML=`<h1 style="color:${topic.col}">${topic.e} Résultat : ${esc(test.title)}</h1>
  <div class="card" style="text-align:center"><div class="score">${sc} / ${total}</div><p><span class="pill ${b.c}">${b.t.split(" (")[0]}</span></p><p class="prompt">${msg}</p>
  <div class="row" style="justify-content:center">${r<.6?`<a class="btn big green" href="${topic.lesson}">📖 Revoir la leçon</a>`:""}${again}<a class="btn alt big" href="evaluations.html">📝 Autres évaluations</a>${r>=.6?`<a class="btn alt big" href="${topic.lesson}">📖 Revoir la leçon</a>`:""}</div></div>
  ${nb}<h2>📋 Le corrigé</h2>${rows}`;
  window.scrollTo(0,0);
 }
 ask();
})();
