/* Données et utilitaires communs – Le Défi du Temps */
const JOURS=["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"];
const MOIS=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
const NBJ=[31,28,31,30,31,30,31,31,30,31,30,31];
const ORD=["premier","deuxième","troisième","quatrième","cinquième","sixième","septième","huitième","neuvième","dixième","onzième","douzième"];
const TOPICS=[
 {k:"jours",t:"Les jours de la semaine",e:"📅",col:"var(--jours)",sub:"7 jours à connaître et à écrire",lesson:"lecon-jours.html"},
 {k:"mois",t:"Les mois de l'année",e:"🗓️",col:"var(--mois)",sub:"12 mois à connaître et à écrire",lesson:"lecon-mois.html"},
 {k:"annee",t:"Les jours de l'année",e:"🎂",col:"var(--annee)",sub:"365 jours, mois de 30 ou 31 jours",lesson:"lecon-annee.html"},
 {k:"romains",t:"Les chiffres romains",e:"🏛️",col:"var(--romains)",sub:"I, V, X… comme les Romains !",lesson:"lecon-romains.html"},
 {k:"alphabet",t:"English : the alphabet",e:"🔤",col:"var(--alphabet)",sub:"Les 26 lettres en anglais",lesson:"lecon-alphabet.html"},
 {k:"phrases",t:"English : basic phrases",e:"💬",col:"var(--phrases)",sub:"Dire bonjour, se présenter, être poli",lesson:"lecon-phrases.html"},
 {k:"nombres",t:"English : numbers & colours",e:"🔢",col:"var(--nombres)",sub:"Compter jusqu'à 20 et dire les couleurs",lesson:"lecon-nombres.html"},
 {k:"tables",t:"Maths : les tables de multiplication",e:"✖️",col:"var(--tables)",sub:"Apprendre les tables de 2 à 9 et les retenir",lesson:"lecon-tables.html"}
];
const BLAGUES=[
 "Pourquoi le calendrier est stressé ? Parce que ses jours sont comptés !",
 "Quel est le mois le plus fatigant ? Mars… il faut toujours marcher !",
 "Le I voulait passer devant le V. Résultat : IV. Il a perdu 1 point, mais il a gagné une place !",
 "Février est le plus petit mois. Alors tous les 4 ans, il s'offre un jour en plus !",
 "Pourquoi presque tous les jours finissent par « di » ? Parce que dimanche, lui, l'a mis au début !",
 "Quel jour les chiffres romains préfèrent ? Le X-trême dimanche !"
];
const $=(s,r)=>(r||document).querySelector(s);
const $$=(s,r)=>Array.from((r||document).querySelectorAll(s));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const strip=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"");
function toRoman(n){const m=[[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];let r="";for(const [v,s] of m){while(n>=v){r+=s;n-=v}}return r}
function speak(t,lang){try{const u=new SpeechSynthesisUtterance(t);u.lang=lang||"fr-FR";u.rate=.8;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}
function speakSeq(list,lang){try{speechSynthesis.cancel();list.forEach(t=>{const u=new SpeechSynthesisUtterance(t);u.lang=lang||"en-GB";u.rate=.7;speechSynthesis.speak(u)})}catch(e){}}
/* Alphabet anglais : lettre, prononciation (écrite à la française), son lu par la synthèse, mot, image */
const ALPHA=[["A","éï","ay","apple","🍎","pomme"],["B","bi","bee","ball","⚽","ballon"],["C","si","see","cat","🐱","chat"],["D","di","dee","dog","🐶","chien"],["E","i","ee","egg","🥚","œuf"],["F","èf","eff","fish","🐟","poisson"],["G","dji","jee","girl","👧","fille"],["H","éïtch","aitch","hat","🎩","chapeau"],["I","aï","eye","ice cream","🍦","glace"],["J","djéï","jay","juice","🧃","jus"],["K","kéï","kay","kite","🪁","cerf-volant"],["L","èl","el","lion","🦁","lion"],["M","èm","em","moon","🌙","lune"],["N","èn","en","nose","👃","nez"],["O","oh","oh","orange","🍊","orange"],["P","pi","pee","pen","🖊️","stylo"],["Q","kiou","queue","queen","👑","reine"],["R","ar","ar","rabbit","🐰","lapin"],["S","ès","ess","sun","☀️","soleil"],["T","ti","tee","tree","🌳","arbre"],["U","iou","you","umbrella","☂️","parapluie"],["V","vi","vee","van","🚐","camionnette"],["W","dabeul-iou","double you","water","💧","eau"],["X","èks","ex","xylophone","🎶","xylophone"],["Y","ouaï","why","yellow","💛","jaune"],["Z","zèd","zed","zebra","🦓","zèbre"]];
const EN="en-GB";
function say(t){const b=$("#bubble");if(b)b.textContent=t}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function confetti(){let c=$("#confetti");if(!c){c=document.createElement("div");c.id="confetti";c.className="confetti";c.setAttribute("aria-hidden","true");document.body.appendChild(c)}const e=["🎉","⭐","✨","🎈","🌟"];for(let i=0;i<24;i++){const s=document.createElement("span");s.textContent=pick(e);s.style.left=Math.random()*100+"%";s.style.animationDelay=Math.random()*.6+"s";c.appendChild(s)}setTimeout(()=>c.innerHTML="",3200)}

/* Sauvegarde locale (facultative) */
const KEY="defi-temps-v2";
function load(){const d={name:"",scores:{},plan:{},hist:[],lessons:{},days:[]};try{return Object.assign(d,JSON.parse(localStorage.getItem(KEY)||"{}"))}catch(e){return d}}
let S=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function badge(sc){ // sc = {best,n}
 if(!sc)return {c:"none",t:"Pas encore fait"};
 const r=sc.best/sc.n;
 if(r>=.9)return {c:"ok",t:"🌟 Maîtrisé ("+sc.best+"/"+sc.n+")"};
 if(r>=.6)return {c:"mid",t:"👍 En progrès ("+sc.best+"/"+sc.n+")"};
 return {c:"ko",t:"📚 À revoir ("+sc.best+"/"+sc.n+")"};
}

/* En-tête commun */
function shell(active,msg){try{var m=location.pathname.match(/lecon-([a-z]+)\.html/);if(active==="lecons"&&m)recordLesson(m[1])}catch(e){}
 const nav=[["index.html","home","🏠 Accueil"],["lecons.html","lecons","📖 Leçons"],["evaluations.html","evals","📝 Évaluations"],["fiches.html","fiches","✏️ Fiches"],["carnet.html","carnet","🏅 Mon carnet"],["parents.html","parents","👨‍👩‍👦 Parents"]];
 $("#shell").innerHTML=`<header>
  <svg id="mascot" viewBox="0 0 100 100" aria-hidden="true">
   <circle cx="24" cy="16" r="11" fill="#E63946" stroke="#1F2937" stroke-width="4"/><circle cx="76" cy="16" r="11" fill="#E63946" stroke="#1F2937" stroke-width="4"/>
   <circle cx="50" cy="56" r="40" fill="#FFD93D" stroke="#1F2937" stroke-width="4"/>
   <circle cx="37" cy="48" r="7" fill="#fff" stroke="#1F2937" stroke-width="3"/><circle cx="63" cy="48" r="7" fill="#fff" stroke="#1F2937" stroke-width="3"/>
   <circle cx="38" cy="49" r="3" fill="#1F2937"/><circle cx="64" cy="49" r="3" fill="#1F2937"/>
   <path d="M33 64 Q50 82 67 64" fill="#fff" stroke="#1F2937" stroke-width="4" stroke-linecap="round"/></svg>
  <div class="bubble" id="bubble" role="status" aria-live="polite">${esc(msg||"Salut ! Moi, c'est Tic-Tac.")}</div></header>
  <nav class="main" aria-label="Menu principal">${nav.map(([h,k,l])=>`<a href="${h}" ${active===k?'aria-current="page"':""}>${l}</a>`).join("")}</nav>`;
}

/* Éléments interactifs des leçons */
function wireLesson(){
 $$("[data-speak]").forEach(b=>b.addEventListener("click",()=>speak(b.dataset.speak,b.dataset.lang)));
 $$(".qa").forEach(q=>{const b=$("button",q),a=$(".ans",q);b.addEventListener("click",()=>{a.hidden=!a.hidden;b.setAttribute("aria-expanded",String(!a.hidden))})});
 $$(".cc").forEach(initCopycat);
}
/* Regarde – Cache – Écris – Vérifie (sans note) */
function initCopycat(el){
 const lang=el.dataset.lang||"fr-FR",en=lang.startsWith("en");
 const words=el.dataset.words.split(el.dataset.sep||",");let i=0,ph="look";
 const speak=t=>window.speak(t,lang);
 const norm=s=>en?s.toLowerCase().replace(/[’`]/g,"'").replace(/[.,!?]/g,"").replace(/\s+/g," ").trim():s;
 function draw(){
  const w=words[i];
  if(ph==="look"){el.innerHTML=`<div class="hint">Étape 1 – Je <b>regarde</b> bien le mot (mot ${i+1}/${words.length})</div><div class="cc-word">${w}</div><div class="row" style="justify-content:center"><button class="btn alt" data-s>🔊 Écouter</button><button class="btn big" data-n>🙈 Je cache le mot</button></div>`;
   $("[data-s]",el).onclick=()=>speak(w);$("[data-n]",el).onclick=()=>{ph="write";draw()}}
  else if(ph==="write"){el.innerHTML=`<div class="hint">Étape 2 – J'<b>écris</b> le mot de mémoire</div><div class="cc-word hid" style="font-size:${en?"1.6rem":"2.4rem"}">${w.split(" ").map(x=>"•".repeat(x.length)).join("&nbsp;&nbsp; ")}</div><input class="txt" autocomplete="off" autocapitalize="none" spellcheck="false" aria-label="Écris le mot"><div class="row" style="margin-top:10px"><button class="btn big" data-v>✔️ Vérifier</button><button class="btn alt" data-r>👀 Revoir le mot</button></div>`;
   const inp=$("input",el);inp.focus();const chk=()=>{if(inp.value.trim()){ph="check";el.dataset.v=inp.value.trim().toLowerCase();draw()}};
   $("[data-v]",el).onclick=chk;inp.addEventListener("keydown",e=>{if(e.key==="Enter")chk()});$("[data-r]",el).onclick=()=>{ph="look";draw()}}
  else{const v=el.dataset.v,ok=norm(v)===norm(w),acc=!ok&&!en&&strip(v)===strip(w);
   el.innerHTML=`<div class="hint">Étape 3 – Je <b>vérifie</b> lettre par lettre</div><div class="cc-word">${w}</div><div class="fb ${ok?"good":acc?"mid":"bad"}">${ok?"✅ Bravo, bien écrit !":acc?"Presque ! Il manque un accent ou il y en a un en trop.":"Tu as écrit « "+esc(v)+" ». Compare avec le modèle, puis réessaie !"}</div><div class="row" style="margin-top:10px">${ok?"":'<button class="btn alt" data-a>🔁 Réessayer ce mot</button>'}<button class="btn big" data-n>${i<words.length-1?"Mot suivant →":"Recommencer la liste 🔁"}</button></div>`;
   const a=$("[data-a]",el);if(a)a.onclick=()=>{ph="look";draw()};
   $("[data-n]",el).onclick=()=>{i=(i+1)%words.length;ph="look";draw()};if(ok)confetti()}
 }
 draw();
}
document.addEventListener("DOMContentLoaded",()=>{if($(".cc,[data-speak],.qa"))wireLesson()});

/* Phrases de base en anglais : [anglais, français] */
const PH_GROUPS=[
 {t:"👋 Dire bonjour et au revoir",items:[["Hello!","Bonjour !"],["Hi!","Salut !"],["Good morning!","Bonjour ! (le matin)"],["Good night!","Bonne nuit !"],["Goodbye!","Au revoir !"],["See you tomorrow!","À demain !"]]},
 {t:"🙏 Être poli",items:[["Please.","S'il te plaît."],["Thank you.","Merci."],["You're welcome.","De rien."],["Sorry.","Désolé."],["Excuse me.","Excusez-moi."]]},
 {t:"🙋 Se présenter",items:[["Hello, how are you?","Bonjour, comment vas-tu ?"],["I'm fine, thank you.","Ça va bien, merci."],["What's your name?","Comment tu t'appelles ?"],["My name is Tom.","Je m'appelle Tom."],["How old are you?","Quel âge as-tu ?"],["I'm eight years old.","J'ai huit ans."]]},
 {t:"🏫 En classe",items:[["Yes, please.","Oui, s'il te plaît."],["No, thank you.","Non, merci."],["I don't understand.","Je ne comprends pas."],["Can you help me?","Peux-tu m'aider ?"],["I like football.","J'aime le football."]]}
];
const PH=PH_GROUPS.flatMap(g=>g.items);

/* Nombres et couleurs en anglais */
const NUM=[["1","one","un"],["2","two","deux"],["3","three","trois"],["4","four","quatre"],["5","five","cinq"],["6","six","six"],["7","seven","sept"],["8","eight","huit"],["9","nine","neuf"],["10","ten","dix"],["11","eleven","onze"],["12","twelve","douze"],["13","thirteen","treize"],["14","fourteen","quatorze"],["15","fifteen","quinze"],["16","sixteen","seize"],["17","seventeen","dix-sept"],["18","eighteen","dix-huit"],["19","nineteen","dix-neuf"],["20","twenty","vingt"]];
const COL=[["red","rouge","#D32F2F"],["blue","bleu","#1976D2"],["green","vert","#2E7D32"],["yellow","jaune","#FBC02D"],["orange","orange","#F57C00"],["pink","rose","#EC407A"],["purple","violet","#7B1FA2"],["black","noir","#212121"],["white","blanc","#FFFFFF"],["brown","marron","#6D4C41"]];
const swatch=c=>`<span style="display:inline-block;width:56px;height:56px;border-radius:12px;border:3px solid #1F2937;background:${c};vertical-align:middle"></span>`;

/* ===== Progression : historique, série, niveaux, médailles ===== */
function today(){return new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,10)}
function markDay(){const t=today();if(S.days.indexOf(t)<0){S.days.push(t);if(S.days.length>400)S.days.shift()}}
function recordAttempt(id,sc,n){S=load();S.hist.push({id:id,sc:sc,n:n,d:today(),t:Date.now()});if(S.hist.length>600)S.hist.shift();markDay();save()}
function recordLesson(k){S=load();if(!S.lessons[k])S.lessons[k]=today();markDay();save()}
function streaks(){const ds=S.days.slice().sort();const day=s=>Math.round(Date.parse(s+"T12:00:00Z")/864e5);let best=0,run=0,prev=null;ds.forEach(s=>{const d=day(s);if(d===prev)return;run=(prev!==null&&d===prev+1)?run+1:1;prev=d;if(run>best)best=run});const cur=(prev!==null&&day(today())-prev<=1)?run:0;return {cur:cur,best:best}}
const LEVELS=["Apprenti du temps","Petit explorateur","Explorateur","Aventurier","Super élève","Maître du temps","Champion","Légende"];
function levelOf(){let x=0;for(const k in S.lessons)x+=20;for(const id in S.scores)x+=S.scores[id].best*10;x+=S.hist.length*5;const l=Math.min(Math.floor(x/150),LEVELS.length-1);return {xp:x,n:l+1,name:LEVELS[l],from:l*150,next:l>=LEVELS.length-1?null:(l+1)*150}}
function okTest(id){const c=S.scores[id];return !!c&&c.best/c.n>=.9}
function topicPct(k){const t=EVALS[k].tests;let s=0;t.forEach(x=>{const c=S.scores[x.id];if(c)s+=c.best/c.n});return Math.round(100*s/t.length)}
function topicMastered(k){return EVALS[k].tests.every(x=>okTest(x.id))}
function improved(){return Object.keys(S.scores).some(id=>{const h=S.hist.filter(x=>x.id===id);return h.length>1&&Math.max.apply(null,h.map(x=>x.sc))>h[0].sc})}
const BADGES=[
["pas","👣","Premier pas","Faire sa première évaluation",()=>S.hist.length>=1],
["lec","📖","Lecteur","Lire une première leçon",()=>Object.keys(S.lessons).length>=1],
["cur","🔭","Grand curieux","Lire les 8 leçons",()=>Object.keys(S.lessons).length>=8],
["jours","📅","Roi des jours","Maîtriser les jours de la semaine",()=>topicMastered("jours")],
["mois","🗓️","Roi des mois","Maîtriser les mois",()=>topicMastered("mois")],
["annee","🌍","Maître de l'année","Maîtriser les jours de l'année",()=>topicMastered("annee")],
["romains","🏛️","Romain","Maîtriser les chiffres romains",()=>topicMastered("romains")],
["alphabet","🔤","ABC","Maîtriser l'alphabet anglais",()=>topicMastered("alphabet")],
["phrases","💬","Bavard","Maîtriser les phrases de base",()=>topicMastered("phrases")],
["nombres","🎨","Compteur","Maîtriser nombres et couleurs",()=>topicMastered("nombres")],
["tables","✖️","Roi des tables","Maîtriser les tables de multiplication",()=>topicMastered("tables")],
["fe","🇬🇧","English champion","Maîtriser alphabet, phrases et nombres",()=>topicMastered("alphabet")&&topicMastered("phrases")&&topicMastered("nombres")],
["fin","🏆","Contrôle final","Réussir un contrôle final (90 % ou plus)",()=>okTest("final")||okTest("final-english")||okTest("final-maths")],
["par","💯","Sans faute","Obtenir 100 % à une évaluation",()=>Object.keys(S.scores).some(id=>S.scores[id].best===S.scores[id].n)],
["prog","📈","En progrès","Améliorer son score après un premier essai",()=>improved()],
["dix","🎯","10 évaluations","Faire 10 évaluations",()=>S.hist.length>=10],
["s3","🔥","3 jours de suite","S'entraîner 3 jours d'affilée",()=>streaks().best>=3],
["s7","🌋","7 jours de suite","S'entraîner 7 jours d'affilée",()=>streaks().best>=7]];
function earned(){const o={};BADGES.forEach(b=>{try{if(b[4]())o[b[0]]=1}catch(e){}});return o}
