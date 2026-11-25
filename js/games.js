/* Jeux d'attention et de mémoire : une seule tâche à la fois, pas de chrono visible, pas d'écran d'échec */
(function(){
 const G=GAMES.find(g=>g.k===window.GAME_KEY);
 shell("jeux","Respire, regarde bien, prends ton temps !");
 const main=$("#main");
 const head=()=>`<a class="btn alt noprint" href="jeux.html">← Les jeux</a><h1>${G.e} ${G.t}</h1>`;
 const timers=[];const later=(f,ms)=>{const t=setTimeout(f,ms);timers.push(t);return t};
 const best=()=>((load().games||{})[G.k]||{best:0}).best;
 function endCard(title,msg,score,label,again,good){
  recordGame(G.k,score,label);if(good)confetti();say(good?"Bravo, champion !":"Bien essayé, on continue ?");
  main.innerHTML=head()+`<div class="card" style="text-align:center"><div class="bigemo">${good?"🎉":"💪"}</div><h2>${title}</h2><p class="prompt">${msg}</p>
  <p class="hint">Record : <b>${esc(((load().games||{})[G.k]||{}).bestLabel||"–")}</b></p>
  <div class="row" style="justify-content:center"><button class="btn big" id="again">🔁 Rejouer</button><a class="btn alt big" href="jeux.html">🧠 Autres jeux</a></div>
  <p class="hint">Astuce : après un jeu, une petite pause de 5 minutes aide le cerveau à se reposer ☕</p></div>`;
  $("#again").onclick=again;window.scrollTo(0,0);
 }
 const menuBtns=(items,cb)=>items.map((x,i)=>`<button class="btn big opt" data-i="${i}">${x}</button>`).join("");

 /* ---------- 1. MEMORY ---------- */
 const THEMES={
  animaux:{t:"🐶 Les animaux",mk:()=>shuffle(["🐶","🐱","🐰","🦊","🐼","🐸","🦁","🐵","🐧","🐢"]).map(e=>[e,e])},
  nombres:{t:"🔢 Chiffres et mots",mk:()=>shuffle([[2,"deux"],[3,"trois"],[4,"quatre"],[5,"cinq"],[6,"six"],[7,"sept"],[8,"huit"],[9,"neuf"],[10,"dix"],[12,"douze"]]).map(([n,w])=>[String(n),w])},
  couleurs:{t:"🎨 Les couleurs",mk:()=>shuffle([["🟥","rouge"],["🟦","bleu"],["🟩","vert"],["🟨","jaune"],["🟧","orange"],["🟪","violet"],["⬛","noir"],["⬜","blanc"]]).map(x=>x)},
  english:{t:"🇬🇧 Colours in English",mk:()=>shuffle([["🟥","red"],["🟦","blue"],["🟩","green"],["🟨","yellow"],["🟧","orange"],["🟪","purple"],["⬛","black"],["⬜","white"]]).map(x=>x)},
  formes:{t:"🔷 Les formes",mk:()=>shuffle(["⭐","❤️","🔺","🔵","🟢","🌙","☀️","🍀"]).map(e=>[e,e])}};
 const SIZES=[["Facile · 3 paires",3],["Moyen · 6 paires",6],["Difficile · 8 paires",8]];
 function memory(){
  main.innerHTML=head()+`<div class="card"><p class="prompt">Retourne deux cartes. Si elles vont ensemble, elles restent. Prends ton temps : il n'y a pas de chrono !</p>
  <h3>1. Choisis le thème</h3><div class="row" id="th"></div><h3>2. Choisis la taille</h3><div class="row" id="sz"></div><div class="row" style="margin-top:14px"><button class="btn big green" id="st" disabled>Jouer 🚀</button></div></div>`;
  let th=null,sz=null;const chk=()=>{$("#st").disabled=!(th&&sz)};
  $("#th").innerHTML=Object.keys(THEMES).map(k=>`<button class="btn big opt" data-k="${k}">${THEMES[k].t}</button>`).join("");
  $("#sz").innerHTML=SIZES.map(([l,n])=>`<button class="btn big opt" data-n="${n}">${l}</button>`).join("");
  $$("#th .opt").forEach(b=>b.onclick=()=>{$$("#th .opt").forEach(x=>x.classList.remove("sel"));b.classList.add("sel");th=b.dataset.k;chk()});
  $$("#sz .opt").forEach(b=>b.onclick=()=>{$$("#sz .opt").forEach(x=>x.classList.remove("sel"));b.classList.add("sel");sz=+b.dataset.n;chk()});
  $("#st").onclick=()=>memPlay(th,sz);
 }
 function memPlay(th,np){
  const pairs=THEMES[th].mk().slice(0,np);
  const cards=shuffle(pairs.flatMap((p,i)=>[{p:i,l:p[0]},{p:i,l:p[1]}]));
  const cols=np===3?3:4;let moves=0,found=0,open=[],lock=false;
  main.innerHTML=head()+`<p class="hint" id="st2">Coups : 0 · Paires trouvées : 0 / ${np}</p><div class="mem" style="grid-template-columns:repeat(${cols},1fr)">${cards.map((c,i)=>`<button class="mcard" data-i="${i}" aria-label="Carte cachée ${i+1}"><span class="face back">❓</span><span class="face front">${esc(c.l)}</span></button>`).join("")}</div>`;
  $$(".mcard").forEach(b=>b.onclick=()=>{
   const i=+b.dataset.i;if(lock||b.classList.contains("up")||b.classList.contains("done"))return;
   b.classList.add("up");b.setAttribute("aria-label","Carte : "+cards[i].l);open.push(i);
   if(open.length===2){moves++;lock=true;const[a,c]=open;const A=$$(".mcard")[a],B=$$(".mcard")[c];
    if(cards[a].p===cards[c].p){later(()=>{A.classList.add("done");B.classList.add("done");found++;open=[];lock=false;$("#st2").textContent=`Coups : ${moves} · Paires trouvées : ${found} / ${np}`;say(pick(["Bien vu !","Super mémoire !","Une paire de plus !"]));
      if(found===np)later(()=>endCard("Toutes les paires sont trouvées !",`Tu as réussi en <b>${moves} coups</b>. Bravo pour ton attention !`,np,np+" paires en "+moves+" coups",memory,true),700)},450)}
    else later(()=>{A.classList.remove("up");B.classList.remove("up");A.setAttribute("aria-label","Carte cachée");B.setAttribute("aria-label","Carte cachée");open=[];lock=false;$("#st2").textContent=`Coups : ${moves} · Paires trouvées : ${found} / ${np}`;say("Pas grave, regarde bien où elles sont !")},1100);
   }
  });
 }

 /* ---------- 2. SUITE DE COULEURS ---------- */
 const PADS=[["Rouge","#DC2626"],["Bleu","#2563EB"],["Vert","#16A34A"],["Jaune","#EAB308"]];
 function suite(){
  let len=2,lives=2,seq=[],pos=0,input=false,top=0;
  const draw=(msg)=>{main.innerHTML=head()+`<div class="card" style="text-align:center"><p class="hint">Vies : ${"❤️".repeat(lives)}${"🤍".repeat(2-lives)} · Suite de ${len} couleurs</p><p class="prompt" id="sm">${msg}</p>
   <div class="pads">${PADS.map(([n,c],i)=>`<button class="pad" data-i="${i}" style="--c:${c}" disabled><b>${n}</b></button>`).join("")}</div></div>`;
   $$(".pad").forEach(b=>b.onclick=()=>press(+b.dataset.i))};
  const flash=(i,ms)=>{const p=$$(".pad")[i];if(!p)return;p.classList.add("lit");later(()=>p.classList.remove("lit"),ms)};
  function round(){
   seq=Array.from({length:len},()=>Math.floor(Math.random()*4));pos=0;input=false;draw("👀 Regarde bien… ne touche pas encore");
   seq.forEach((v,k)=>later(()=>flash(v,550),900+k*900));
   later(()=>{input=true;$$(".pad").forEach(b=>b.disabled=false);$("#sm").textContent="✋ À toi ! Refais la même suite.";say("À ton tour !")},900+len*900);
  }
  function press(i){
   if(!input)return;flash(i,250);
   if(i===seq[pos]){pos++;if(pos===len){input=false;top=Math.max(top,len);$$(".pad").forEach(b=>b.disabled=true);
     if(len>=10){later(()=>endCard("Suite parfaite !","Tu as retenu 10 couleurs d'affilée : incroyable !",10,"10 couleurs",suite,true),600);return}
     $("#sm").textContent="✅ Bravo ! On ajoute une couleur.";say("Bien joué !");len++;later(round,1200)}}
   else{input=false;$$(".pad").forEach(b=>b.disabled=true);lives--;
    if(lives<=0){later(()=>endCard("Belle partie !",`Tu as retenu jusqu'à <b>${top||1} couleur${top>1?"s":""}</b>. À chaque partie, on progresse !`,top,top+" couleurs",suite,top>=6),500)}
    else{$("#sm").textContent="Oups ! On recommence tranquillement.";say("Pas grave, regarde encore !");later(round,1500)}}
  }
  main.innerHTML=head()+`<div class="card"><p class="prompt">Les couleurs s'allument une par une. Retiens l'ordre, puis refais la même suite. Tu as 2 vies ❤️❤️.</p><button class="btn big green" id="go">C'est parti ! 🚀</button></div>`;
  $("#go").onclick=round;
 }

 /* ---------- 3. LE CHEF A DIT ---------- */
 const SH=[["rond","le",false,"●"],["carré","le",false,"■"],["triangle","le",false,"▲"],["étoile","l'",true,"★"]];
 const CO=[["rouge","rouge","#DC2626"],["bleu","bleue","#2563EB"],["vert","verte","#16A34A"],["jaune","jaune","#CA8A04"]];
 const nm=(it)=>{const s=SH[it.s],c=CO[it.c];return `${s[1]}${s[1]==="l'"?"":" "}${s[0]} ${s[2]?c[1]:c[0]}`};
 function cBoard(extra){
  const all=[];SH.forEach((_,s)=>CO.forEach((_,c)=>all.push({s,c})));
  let b=extra||[];const left=shuffle(all.filter(x=>!b.some(y=>y.s===x.s&&y.c===x.c)));b=b.concat(left.slice(0,9-b.length));return shuffle(b);
 }
 const samei=(a,b)=>a.s===b.s&&a.c===b.c;
 function mkCons(level){
  if(level===1){const board=cBoard(),t=pick(board);return{board,text:`Touche ${nm(t)}.`,seq:[t],set:false}}
  if(level===2||level===4){const board=cBoard(),k=level===2?2:3,ts=shuffle(board).slice(0,k);
   return{board,text:"Touche "+ts.map(nm).join(", puis ")+".",seq:ts,set:false}}
  /* niveau 3 : tous les X sauf un */
  const s=Math.floor(Math.random()*4),cs=shuffle([0,1,2,3]),ex=cs[0];
  const base=[{s,c:cs[0]},{s,c:cs[1]},{s,c:cs[2]}];const board=cBoard(base);
  const plur={rond:"ronds","carré":"carrés",triangle:"triangles","étoile":"étoiles"}[SH[s][0]];
  const art=SH[s][2]?"toutes les":"tous les";
  return{board,text:`Touche ${art} ${plur} sauf ${nm({s,c:ex})}.`,seq:board.filter(x=>x.s===s&&x.c!==ex),set:true,forbid:board.filter(x=>x.s===s&&x.c===ex)};
 }
 function consignes(){
  const unlocked=Math.min(4,best()+1);
  main.innerHTML=head()+`<div class="card"><p class="prompt">Le chef donne une consigne. <b>Lis-la en entier</b>, puis fais exactement ce qui est demandé. 5 consignes par niveau.</p><p class="hint">Pour passer au niveau suivant, réussis au moins 4 consignes sur 5.</p>
  <div class="row">${[1,2,3,4].map(l=>`<button class="btn big opt" data-l="${l}" ${l>unlocked?"disabled":""}>${l>unlocked?"🔒":"⭐"} Niveau ${l}<small>${["1 action","2 actions à la suite","Tous sauf un","3 actions à la suite"][l-1]}</small></button>`).join("")}</div></div>`;
  $$(".opt").forEach(b=>b.onclick=()=>cLevel(+b.dataset.l));
 }
 function cLevel(level){
  let k=0,ok=0;
  const next=()=>{
   if(k===5){const pass=ok>=4;endCard(pass?`Niveau ${level} réussi !`:"Tu y es presque !",`${ok} consigne${ok>1?"s":""} réussie${ok>1?"s":""} sur 5. ${pass?(level<4?"Le niveau suivant est débloqué !":"Tu as fini tous les niveaux !"):"Relis bien chaque consigne et réessaie : il faut 4 sur 5."}`,pass?level:0,"Niveau "+level,consignes,pass);return}
   const c=mkCons(level);let step=0,tapped=[],done=false;
   main.innerHTML=head()+`<p class="hint">Niveau ${level} · Consigne ${k+1} sur 5</p><div class="card"><p class="prompt" id="ct">📋 ${esc(c.text)}</p><div class="row"><button class="btn alt" id="rd">🔊 Lire à voix haute</button></div></div>
   <div class="cboard">${c.board.map((it,i)=>`<button class="cit" data-i="${i}" aria-label="${esc(nm(it))}" style="color:${CO[it.c][2]}">${SH[it.s][3]}</button>`).join("")}</div><p id="cf" class="prompt" role="status"></p>`;
   $("#rd").onclick=()=>speak(c.text);
   const items=$$(".cit");
   const finish=(good,msg)=>{done=true;if(good)ok++;k++;$("#cf").innerHTML=msg;items.forEach(b=>b.disabled=true);
    if(!good)c.seq.forEach(t=>{const j=c.board.findIndex(x=>samei(x,t));items[j].classList.add("hint-it")});
    later(()=>{$("#cf").innerHTML+=`<br><button class="btn big" id="nx">${k===5?"Terminer":"Consigne suivante →"}</button>`;$("#nx").onclick=next},300)};
   items.forEach((b,i)=>b.onclick=()=>{
    if(done)return;const it=c.board[i];
    if(c.set){
     if(c.forbid.some(x=>samei(x,it)))return finish(false,"❌ Attention : il fallait <b>éviter</b> celle-là. Relis le mot « sauf » !");
     if(!c.seq.some(x=>samei(x,it))){return finish(false,"❌ Cette forme n'est pas demandée. Relis la consigne !")}
     if(tapped.includes(i))return;tapped.push(i);b.classList.add("good");
     if(tapped.length===c.seq.length)finish(true,"✅ Parfait, tu as tout trouvé !");
    }else{
     if(samei(it,c.seq[step])){b.classList.add("good");step++;if(step===c.seq.length)finish(true,"✅ Bravo, tu as bien suivi la consigne !")}
     else finish(false,step>0&&c.seq.some(x=>samei(x,it))?"❌ Attention à l'<b>ordre</b> : c'est « puis » qui le dit.":"❌ Ce n'est pas la bonne forme. Relis la consigne !");
    }
   });
  };
  next();
 }

 /* ---------- 4. LA GRANDE CHASSE ---------- */
 const LOOK=[["🍎","🍅"],["🐱","🐯"],["⭐","🌟"],["🟦","🟪"],["🍋","🍊"],["🐶","🐺"],["⬛","⬜"],["🟥","🟧"]];
 const CL=[[12,4,2,"Niveau 1 · 12 images, 2 intrus"],[16,4,3,"Niveau 2 · 16 images, 3 intrus"],[25,5,4,"Niveau 3 · 25 images, 4 intrus"],[36,6,5,"Niveau 4 · 36 images, 5 intrus"]];
 function chasse(){
  const unlocked=Math.min(4,best()+1);
  main.innerHTML=head()+`<div class="card"><p class="prompt">Une grille d'images presque toutes pareilles… mais quelques <b>intrus</b> sont cachés. Trouve-les tous, sans te presser !</p>
  <div class="row">${CL.map((c,i)=>`<button class="btn big opt" data-l="${i+1}" ${i+1>unlocked?"disabled":""}>${i+1>unlocked?"🔒 ":""}${c[3]}</button>`).join("")}</div></div>`;
  $$(".opt").forEach(b=>b.onclick=()=>cPlay(+b.dataset.l));
 }
 function cPlay(level){
  const[n,cols,ni]=CL[level-1];const[a,b]=pick(LOOK);const intr=new Set(shuffle([...Array(n).keys()]).slice(0,ni));
  let found=0,err=0;
  main.innerHTML=head()+`<p class="prompt" id="cs">Intrus trouvés : 0 / ${ni}</p><p class="hint">Cherche l'image qui n'est pas comme les autres, puis touche-la.</p><div class="chasse" style="grid-template-columns:repeat(${cols},1fr)">${[...Array(n).keys()].map(i=>`<button class="cell" data-i="${i}" aria-label="Image ${i+1}">${intr.has(i)?b:a}</button>`).join("")}</div>`;
  $$(".cell").forEach(c=>c.onclick=()=>{const i=+c.dataset.i;if(c.classList.contains("found"))return;
   if(intr.has(i)){c.classList.add("found");found++;$("#cs").textContent=`Intrus trouvés : ${found} / ${ni}`;say("Bien vu !");
    if(found===ni){const stars=err<=1?"⭐⭐⭐":err<=3?"⭐⭐":"⭐";later(()=>endCard("Tous les intrus sont trouvés !",`${stars}<br>${err===0?"Aucune erreur : œil de lynx !":err+" erreur"+(err>1?"s":"")+", mais tu as réussi !"}`,level,"Niveau "+level,chasse,true),600)}}
   else{err++;c.classList.add("shake");later(()=>c.classList.remove("shake"),500);say("Regarde bien : celle-ci est comme les autres.")}});
 }

 /* ---------- 5. LES NOMBRES SECRETS ---------- */
 function nombres(){
  main.innerHTML=head()+`<div class="card"><p class="prompt">Des chiffres apparaissent un par un. Retiens-les, puis tape-les. Tu as 2 vies ❤️❤️.</p><div class="row"><button class="btn big opt" data-m="0">➡️ Dans l'ordre</button><button class="btn big opt" data-m="1">⬅️ À l'envers (plus dur)</button></div></div>`;
  $$(".opt").forEach(b=>b.onclick=()=>nPlay(+b.dataset.m));
 }
 function nPlay(rev){
  let len=3,lives=2,top=0;
  const round=()=>{
   const seq=Array.from({length:len},()=>Math.floor(Math.random()*10));
   main.innerHTML=head()+`<div class="card" style="text-align:center"><p class="hint">Vies : ${"❤️".repeat(lives)}${"🤍".repeat(2-lives)} · ${len} chiffres${rev?" · à l'envers":""}</p><p class="prompt">👀 Regarde et écoute…</p><div class="bignum" id="bn">&nbsp;</div></div>`;
   seq.forEach((d,i)=>{later(()=>{$("#bn").textContent=d;speak(String(d),"fr-FR")},800+i*1100);later(()=>{$("#bn").innerHTML="&nbsp;"},800+i*1100+800)});
   later(()=>ask(seq),800+len*1100);
  };
  const ask=(seq)=>{
   const want=(rev?seq.slice().reverse():seq).join("");let cur="";
   main.innerHTML=head()+`<div class="card" style="text-align:center"><p class="prompt">✋ Tape les ${len} chiffres${rev?" <b>à l'envers</b> (le dernier d'abord)":" dans l'ordre"}.</p><div class="bignum" id="bn" aria-live="polite">&nbsp;</div>
   <div class="keypad">${[1,2,3,4,5,6,7,8,9].map(d=>`<button class="key" data-d="${d}">${d}</button>`).join("")}<button class="key alt" id="kc">⌫</button><button class="key" data-d="0">0</button><button class="key ok" id="kv" disabled>✔</button></div></div>`;
   const upd=()=>{$("#bn").textContent=cur||" ";$("#kv").disabled=cur.length!==len};
   $$(".key[data-d]").forEach(k=>k.onclick=()=>{if(cur.length<len){cur+=k.dataset.d;upd()}});
   $("#kc").onclick=()=>{cur=cur.slice(0,-1);upd()};
   $("#kv").onclick=()=>{
    if(cur===want){top=Math.max(top,len);if(len>=9)return endCard("Mémoire de champion !","Tu as retenu 9 chiffres !",9,"9 chiffres",nombres,true);
     len++;say("Bravo !");main.innerHTML=head()+`<div class="card" style="text-align:center"><div class="bigemo">✅</div><p class="prompt">Bravo ! On ajoute un chiffre.</p></div>`;later(round,1200)}
    else{lives--;if(lives<=0)return endCard("Belle partie !",`Tu as retenu jusqu'à <b>${top||2} chiffres</b>. La bonne réponse était <b>${want}</b>.`,top,top+" chiffres"+(rev?" (à l'envers)":""),nombres,top>=6);
     main.innerHTML=head()+`<div class="card" style="text-align:center"><div class="bigemo">🙂</div><p class="prompt">Pas grave ! C'était <b>${want}</b>. On réessaie avec de nouveaux chiffres.</p></div>`;later(round,2200)}
   };
  };
  round();
 }
 ({memory,suite,consignes,chasse,nombres})[G.k]();
})();
