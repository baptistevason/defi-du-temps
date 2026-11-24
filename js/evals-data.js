/* Banque de questions des évaluations */
const QA=[
 ["Combien y a-t-il de mois dans une année ?",["10","12","13"],"12","Janvier à décembre : 12 mois."],
 ["Combien de jours dans une année normale ?",["360","364","365"],"365","Une année normale a 365 jours."],
 ["Combien de jours dans une année bissextile ?",["365","366","367"],"366","Un jour de plus : le 29 février !"],
 ["Combien de jours a février pendant une année bissextile ?",["28","29","30"],"29","Tous les 4 ans, février a 29 jours."],
 ["Combien de jours dans une semaine ?",["5","6","7"],"7","Du lundi au dimanche : 7 jours."],
 ["Combien de jours dans 2 semaines ?",["12","14","16"],"14","7 + 7 = 14."],
 ["Combien y a-t-il de semaines dans une année ?",["12","30","52"],"52","52 semaines (et 1 jour en plus)."],
 ["Quel est le mois le plus court ?",["février","avril","juin"],"février","Février : 28 jours (29 les années bissextiles)."],
 ["Combien de mois ont 31 jours ?",["4","7","12"],"7","Janvier, mars, mai, juillet, août, octobre, décembre."],
 ["Combien de mois ont 30 jours ?",["4","7","8"],"4","Avril, juin, septembre et novembre."],
 ["Quelle est la prochaine année bissextile ?",["2027","2028","2030"],"2028","Après 2024, on ajoute 4 : 2028 !"],
 ["Combien de jours a le mois d'août ?",["30","31","28"],"31","Août a 31 jours, comme juillet juste avant."]
];
const QR=[
 ["Sur une horloge, le chiffre IV représente quelle heure ?",["2 h","4 h","6 h"],"4 h","IV = 4."],
 ["Un livre a un chapitre IX. C'est le chapitre numéro…",["6","9","11"],"9","IX = 10 − 1 = 9."],
 ["Le roi Louis XIV : quel est son numéro ?",["12","14","16"],"14","XIV = 10 + 5 − 1 = 14."],
 ["Nous sommes au XXI<sup>e</sup> siècle. Quel numéro est-ce ?",["12","20","21"],"21","XXI = 10 + 10 + 1 = 21."],
 ["Une horloge indique XII en haut. C'est…",["12","11","10"],"12","XII = 10 + 2 = 12."],
 ["Quel est le chiffre romain pour 5 ?",["I","V","X"],"V","V = 5, la main ouverte."],
 ["Sur une horloge, quelle heure est VIII ?",["6 h","7 h","8 h"],"8 h","VIII = 5 + 3 = 8."],
 ["Un film s'appelle « Épisode VI ». C'est l'épisode…",["4","6","7"],"6","VI = 5 + 1 = 6."]
];
function near(n,lo,hi){const s=new Set([n]);while(s.size<4){const v=n+Math.floor(Math.random()*7)-3;if(v>=lo&&v<=hi)s.add(v)}return shuffle([...s])}
function nearR(n){const s=new Set([toRoman(n)]);const fake={4:"IIII",9:"VIIII",14:"XIIII",19:"XVIIII",8:"IIX"};if(fake[n])s.add(fake[n]);for(const v of near(n,1,20)){if(s.size>=4)break;s.add(toRoman(v))}while(s.size<4)s.add(toRoman(1+Math.floor(Math.random()*20)));return shuffle([...s])}
const choiceQ=(prompt,choices,answer,explain,fixed)=>({type:"choice",prompt,choices,answer,explain,fixed});
const sub=(arr,n)=>shuffle(arr).slice(0,n);
function genJours(n){const q=[];for(let i=0;i<n;i++){const t=i%4,k=Math.floor(Math.random()*7);let p,a;
 if(t===0){p=`Quel jour vient <u>après</u> ${JOURS[k]} ?`;a=JOURS[(k+1)%7]}
 else if(t===1){p=`Quel jour vient <u>avant</u> ${JOURS[k]} ?`;a=JOURS[(k+6)%7]}
 else if(t===2){p=`Quel jour est <u>entre</u> ${JOURS[k]} et ${JOURS[(k+2)%7]} ?`;a=JOURS[(k+1)%7]}
 else{const r=Math.floor(Math.random()*7);p=`Quel est le ${r===0?"premier":ORD[r]} jour de la semaine ?`;a=JOURS[r]}
 q.push(choiceQ(p,shuffle([a,...sub(JOURS.filter(j=>j!==a),3)]),a,`Réponse : ${a}. (lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche)`))}return q}
function genMois(n){const q=[];for(let i=0;i<n;i++){const t=i%4,k=Math.floor(Math.random()*12);let p,a;
 if(t===0){p=`Quel mois vient <u>après</u> ${MOIS[k]} ?`;a=MOIS[(k+1)%12]}
 else if(t===1){p=`Quel mois vient <u>avant</u> ${MOIS[k]} ?`;a=MOIS[(k+11)%12]}
 else if(t===2){p=`Quel mois est <u>entre</u> ${MOIS[k]} et ${MOIS[(k+2)%12]} ?`;a=MOIS[(k+1)%12]}
 else{p=`Quel est le ${k===0?"premier":ORD[k]} mois de l'année ?`;a=MOIS[k]}
 q.push(choiceQ(p,shuffle([a,...sub(MOIS.filter(j=>j!==a),3)]),a,`Réponse : ${a}.`))}return q}
const pool=(prompt,items,explain)=>({type:"compose",prompt,items,answer:items,explain});
const letters=(prompt,w)=>({type:"compose",prompt,items:w.split(""),answer:w.split(""),explain:`Le mot s'écrit : ${w}.`});
const typed=(prompt,w)=>({type:"type",prompt,answer:w,explain:`Le mot s'écrit : ${w}.`});
const joursMois=n=>sub(MOIS,n).map(m=>{const x=NBJ[MOIS.indexOf(m)];const a=x===28?"28 ou 29":String(x);return choiceQ(`Combien de jours a le mois de ${m} ?`,["28 ou 29","30","31"],a,`${m} a ${a} jours.`,true)});
const qaQ=n=>sub(QA,n).map(q=>choiceQ(q[0],q[1],q[2],q[3]));
const qrQ=n=>sub(QR,n).map(q=>choiceQ(q[0],q[1],q[2],q[3]));
const lire=n=>sub([...Array(20).keys()].map(i=>i+1),n).map(v=>choiceQ(`Que vaut ${toRoman(v)} ?`,near(v,1,20).map(String),String(v),`${toRoman(v)} = ${v}`));
const ecrireR=n=>sub([...Array(20).keys()].map(i=>i+1),n).map(v=>choiceQ(`Comment écrit-on ${v} en chiffres romains ?`,nearR(v),toRoman(v),`${v} = ${toRoman(v)}`));
const construire=n=>sub([...Array(20).keys()].map(i=>i+1),n).map(v=>({type:"compose",free:["I","V","X"],prompt:`Construis le nombre ${v} avec les lettres :`,answer:toRoman(v).split(""),explain:`${v} = ${toRoman(v)}`}));

/* ----- Anglais : alphabet ----- */
const AL=ALPHA.map(a=>a[0]);
const alphaQuiz=n=>{const q=[];for(let i=0;i<n;i++){const t=i%4,k=Math.floor(Math.random()*24)+(t===1?1:0);let p,a;
 if(t===0){p=`Dans l'alphabet, quelle lettre vient <u>après</u> ${AL[k]} ?`;a=AL[k+1]}
 else if(t===1){p=`Dans l'alphabet, quelle lettre vient <u>avant</u> ${AL[k]} ?`;a=AL[k-1]}
 else if(t===2){const w=ALPHA[Math.floor(Math.random()*26)];p=`Avec quelle lettre commence le mot anglais « ${w[3]} » ${w[4]} ?`;a=w[0]}
 else{const w=ALPHA[Math.floor(Math.random()*26)];p=`Quel mot anglais commence par la lettre ${w[0]} ?`;const others=sub(ALPHA.filter(x=>x[0]!==w[0]),3);q.push(choiceQ(p,shuffle([w[3],...others.map(x=>x[3])]),w[3],`${w[3]} commence par ${w[0]}.`));continue}
 q.push(choiceQ(p,shuffle([a,...sub(AL.filter(l=>l!==a),3)]),a,`Réponse : ${a}.`))}return q};
const alphaEcoute=n=>sub(ALPHA,n).map(a=>({type:"choice",prompt:"🔊 Écoute bien, puis choisis la lettre :",speak:a[2],lang:"en-GB",choices:shuffle([a[0],...sub(AL.filter(l=>l!==a[0]),3)]),answer:a[0],explain:`C'est la lettre ${a[0]} (on dit « ${a[1]} »).`}));
const alphaOrdre=()=>[pool("Range ces lettres dans l'ordre de l'alphabet :",AL.slice(0,5)),pool("Range ces lettres dans l'ordre de l'alphabet :",AL.slice(10,15)),pool("Range ces lettres dans l'ordre de l'alphabet :",AL.slice(21,26)),
 letters("Remets les lettres dans l'ordre pour écrire le mot anglais « cat » 🐱 (chat) :","cat"),letters("Remets les lettres dans l'ordre pour écrire le mot anglais « fish » 🐟 (poisson) :","fish"),letters("Remets les lettres dans l'ordre pour écrire le mot anglais « apple » 🍎 (pomme) :","apple")];
/* ----- Anglais : phrases ----- */
const phQuiz=n=>sub(PH,n).map((p,i)=>{const o=sub(PH.filter(x=>x!==p),3);
 return i%2===0?choiceQ(`Comment dit-on « ${p[1]} » en anglais ?`,shuffle([p[0],...o.map(x=>x[0])]),p[0],`${p[1]} se dit : ${p[0]}`)
  :choiceQ(`Que veut dire « ${p[0]} » ?`,shuffle([p[1],...o.map(x=>x[1])]),p[1],`${p[0]} veut dire : ${p[1]}`)});
const phEcoute=n=>sub(PH,n).map(p=>{const o=sub(PH.filter(x=>x!==p),3);return {type:"choice",prompt:"🔊 Écoute la phrase, puis choisis ce qu'elle veut dire :",speak:p[0].replace(/ Tom/," Tom"),lang:"en-GB",choices:shuffle([p[1],...o.map(x=>x[1])]),answer:p[1],explain:`${p[0]} = ${p[1]}`}});
const phOrdre=n=>sub(["Hello, how are you?","I'm fine, thank you.","What's your name?","My name is Tom.","How old are you?","I'm eight years old.","Good morning!","See you tomorrow!","Can you help me?","I don't understand."],n).map(s=>({type:"compose",prompt:"Remets les mots dans l'ordre pour faire une phrase :",items:s.split(" "),answer:s.split(" "),explain:`La phrase : ${s}`}));
const DLG=[["Quelqu'un te dit : « Thank you. » Tu réponds :",["You're welcome.","Goodbye!","Good night!"],"You're welcome."],
 ["Quelqu'un te demande : « How are you? » Tu réponds :",["I'm fine, thank you.","My name is Tom.","Good night!"],"I'm fine, thank you."],
 ["Quelqu'un te demande : « What's your name? » Tu réponds :",["My name is Tom.","I'm eight years old.","Thank you."],"My name is Tom."],
 ["Quelqu'un te demande : « How old are you? » Tu réponds :",["I'm eight years old.","I'm fine, thank you.","See you tomorrow!"],"I'm eight years old."],
 ["Tu quittes un ami. Tu dis :",["Goodbye!","Good morning!","Please."],"Goodbye!"],
 ["Tu as marché sur le pied de quelqu'un. Tu dis :",["Sorry.","You're welcome.","Hello!"],"Sorry."],
 ["Le matin, tu arrives à l'école. Tu dis :",["Good morning!","Good night!","Goodbye!"],"Good morning!"],
 ["Tu ne comprends pas la question du professeur. Tu dis :",["I don't understand.","Thank you.","See you tomorrow!"],"I don't understand."]];
const phDialogue=n=>sub(DLG,n).map(d=>choiceQ(d[0],shuffle(d[1]),d[2],`La bonne phrase : ${d[2]}`));

/* ----- Anglais : nombres et couleurs ----- */
const numQuiz=n=>sub(NUM,n).map((x,i)=>{const o=sub(NUM.filter(y=>y!==x),3);
 return i%2===0?choiceQ(`Comment dit-on ${x[0]} en anglais ?`,shuffle([x[1],...o.map(y=>y[1])]),x[1],`${x[0]} = ${x[1]}`)
  :choiceQ(`Que veut dire « ${x[1]} » ?`,shuffle([x[0],...o.map(y=>y[0])]),x[0],`${x[1]} = ${x[0]}`)});
const numEcoute=n=>sub(NUM,n).map(x=>{const o=sub(NUM.filter(y=>y!==x),3);return {type:"choice",prompt:"🔊 Écoute le nombre, puis choisis-le :",speak:x[1],lang:"en-GB",choices:shuffle([x[0],...o.map(y=>y[0])]),answer:x[0],explain:`${x[1]} = ${x[0]}`}});
const colQuiz=n=>sub(COL,n).map((c,i)=>{const o=sub(COL.filter(y=>y!==c),3);
 if(i%3===0)return choiceQ(`De quelle couleur est ce carré ? ${swatch(c[2])}`,shuffle([c[0],...o.map(y=>y[0])]),c[0],`${c[0]} = ${c[1]}`);
 if(i%3===1)return choiceQ(`Comment dit-on « ${c[1]} » en anglais ?`,shuffle([c[0],...o.map(y=>y[0])]),c[0],`${c[1]} se dit : ${c[0]}`);
 return choiceQ(`Que veut dire « ${c[0]} » ?`,shuffle([c[1],...o.map(y=>y[1])]),c[1],`${c[0]} = ${c[1]}`)});
const colEcoute=n=>sub(COL,n).map(c=>{const o=sub(COL.filter(y=>y!==c),3);return {type:"choice",prompt:"🔊 Écoute la couleur, puis choisis-la :",speak:c[0],lang:"en-GB",choices:shuffle([c[1],...o.map(y=>y[1])]),answer:c[1],explain:`${c[0]} = ${c[1]}`}});
const nbOrdre=()=>[pool("Range ces nombres du plus petit au plus grand :",NUM.slice(0,5).map(x=>x[1])),pool("Range ces nombres du plus petit au plus grand :",NUM.slice(5,10).map(x=>x[1])),pool("Range ces nombres du plus petit au plus grand :",NUM.slice(9,13).map(x=>x[1])),
 letters("Remets les lettres dans l'ordre pour écrire « three » (3) :","three"),letters("Remets les lettres dans l'ordre pour écrire « green » (vert) :","green"),letters("Remets les lettres dans l'ordre pour écrire « yellow » (jaune) :","yellow")];

/* ===== Maths : tables de multiplication ===== */
const rndi=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
function mulTip(a,b){const lo=Math.min(a,b),hi=Math.max(a,b);let t=`${a} × ${b} = ${a*b}, et ${b} × ${a} = ${a*b} aussi !`;
 if(lo===9)t+=` Astuce du 9 : ${String(a*b).split("").join(" + ")} = 9.`;
 else if(lo===5)t+=" Les résultats de la table de 5 finissent par 0 ou 5.";
 else if(lo===2)t+=` Multiplier par 2, c'est le double : ${hi} + ${hi} = ${a*b}.`;
 else if(lo===4)t+=` Multiplier par 4, c'est le double du double : ${hi*2} puis ${a*b}.`;
 else if(lo===10)t+=" Multiplier par 10, c'est écrire un zéro à droite.";
 return t}
function mulPairs(tables,n){const all=[];tables.forEach(a=>{for(let b=2;b<=10;b++)all.push([a,b])});return sub(all,n).map(([a,b])=>Math.random()<.5?[a,b]:[b,a])}
const mulType=(tables,n)=>mulPairs(tables,n).map(([a,b])=>({type:"type",silent:true,numeric:true,prompt:`${a} × ${b} = ?`,answer:String(a*b),explain:mulTip(a,b)}));
function mulFake(a,b){const r=a*b,s=new Set();[a*(b+1),a*(b-1),(a+1)*b,(a-1)*b,r+10,r-10,r+1,r-1,a+b,Number(String(r).split("").reverse().join(""))].forEach(v=>{if(v>0&&v!==r)s.add(v)});return sub([...s],3)}
const mulChoix=(tables,n)=>mulPairs(tables,n).map(([a,b])=>choiceQ(`${a} × ${b} = ?`,shuffle([a*b,...mulFake(a,b)]).map(String),String(a*b),mulTip(a,b),false));
const mulTrous=(tables,n)=>mulPairs(tables,n).map(([a,b])=>{const r=a*b,left=Math.random()<.5;return {type:"type",silent:true,numeric:true,prompt:left?`${a} × ? = ${r}`:`? × ${b} = ${r}`,answer:String(left?b:a),explain:`${left?`${a} × ${b}`:`${a} × ${b}`} = ${r}. Cherche dans la table : ${r} = ${a} × ${b}.`}});
const PB=[["Un chat a 4 pattes. Combien de pattes ont {n} chats ?",4],["Une boîte contient 6 œufs. Combien d'œufs y a-t-il dans {n} boîtes ?",6],["Un paquet contient 5 cartes. Combien de cartes y a-t-il dans {n} paquets ?",5],["Une araignée a 8 pattes. Combien de pattes ont {n} araignées ?",8],["Un vélo a 2 roues. Combien de roues ont {n} vélos ?",2],["Une main a 5 doigts. Combien de doigts ont {n} mains ?",5],["Un trèfle porte-bonheur a 4 feuilles. Combien de feuilles y a-t-il sur {n} trèfles ?",4],["Une barquette contient 10 fraises. Combien de fraises y a-t-il dans {n} barquettes ?",10],["Une semaine a 7 jours. Combien de jours y a-t-il dans {n} semaines ?",7],["Un tricycle a 3 roues. Combien de roues ont {n} tricycles ?",3],["Un sachet contient 9 billes. Combien de billes y a-t-il dans {n} sachets ?",9]];
const problemes=n=>sub(PB,n).map(([t,m])=>{const k=rndi(3,9),r=k*m,f=[...new Set([r+m,r-m,r+k,k+m,r+10].filter(v=>v>0&&v!==r))];return choiceQ(t.replace("{n}",k),shuffle([r,...sub(f,3)]).map(String),String(r),`${k} groupes de ${m}, c'est ${k} × ${m} = ${r}.`,false)});
const tablesOrdre=()=>[pool("Range les résultats de la table de 3, du plus petit au plus grand :",[3,6,9,12,15].map(String),"Table de 3 : 3, 6, 9, 12, 15."),pool("Range les résultats de la table de 4, du plus petit au plus grand :",[4,8,12,16,20].map(String),"Table de 4 : 4, 8, 12, 16, 20."),pool("Range les résultats de la table de 6, du plus petit au plus grand :",[6,12,18,24,30].map(String),"Table de 6 : 6, 12, 18, 24, 30."),
 {type:"type",silent:true,numeric:true,prompt:"Complète la suite de la table de 7 : 7, 14, 21, ?",answer:"28",explain:"21 + 7 = 28."},
 {type:"type",silent:true,numeric:true,prompt:"Complète la suite de la table de 9 : 9, 18, 27, ?",answer:"36",explain:"27 + 9 = 36."},
 {type:"type",silent:true,numeric:true,prompt:"Complète la suite de la table de 8 : 8, 16, 24, ?",answer:"32",explain:"24 + 8 = 32."}];

const EVALS={
 jours:{title:"Les jours de la semaine",e:"📅",col:"var(--jours)",lesson:"lecon-jours.html",tests:[
  {id:"jours-quiz",title:"Quiz : avant, après, entre",desc:"10 questions",mk:()=>genJours(10)},
  {id:"jours-ordre",title:"Remets dans l'ordre",desc:"5 exercices d'ordre et de lettres",mk:()=>[
    pool("Range les 7 jours, du lundi au dimanche :",JOURS),
    pool("Range les jours d'école, du premier au dernier :",JOURS.slice(0,5)),
    pool("Range les jours de mercredi à dimanche :",JOURS.slice(2)),
    letters("Remets les lettres dans l'ordre pour écrire le jour :","mercredi"),
    letters("Remets les lettres dans l'ordre pour écrire le jour :","vendredi")]},
  {id:"jours-ecriture",title:"Écris les jours",desc:"7 mots à écrire sans modèle",mk:()=>shuffle(JOURS).map(w=>typed("Écris le jour que tu entends (clique sur 🔊) :",w))}]},
 mois:{title:"Les mois de l'année",e:"🗓️",col:"var(--mois)",lesson:"lecon-mois.html",tests:[
  {id:"mois-quiz",title:"Quiz : avant, après, entre",desc:"10 questions",mk:()=>genMois(10)},
  {id:"mois-ordre",title:"Remets dans l'ordre",desc:"5 exercices d'ordre et de lettres",mk:()=>[
    pool("Range les 6 premiers mois :",MOIS.slice(0,6)),
    pool("Range les 6 derniers mois :",MOIS.slice(6)),
    pool("Range les 12 mois, de janvier à décembre :",MOIS),
    letters("Remets les lettres dans l'ordre pour écrire le mois :","septembre"),
    letters("Remets les lettres dans l'ordre pour écrire le mois :","décembre")]},
  {id:"mois-ecriture",title:"Écris les mois",desc:"12 mots à écrire (attention aux accents)",mk:()=>shuffle(MOIS).map(w=>typed("Écris le mois que tu entends (clique sur 🔊) :",w))}]},
 annee:{title:"Les jours de l'année",e:"🎂",col:"var(--annee)",lesson:"lecon-annee.html",tests:[
  {id:"annee-mois",title:"31, 30 ou 28 jours ?",desc:"12 mois à classer",mk:()=>joursMois(12)},
  {id:"annee-quiz",title:"Le quiz de l'année",desc:"10 questions : semaines, bissextile…",mk:()=>qaQ(10)}]},
 romains:{title:"Les chiffres romains",e:"🏛️",col:"var(--romains)",lesson:"lecon-romains.html",tests:[
  {id:"romains-lire",title:"Je lis les chiffres romains",desc:"10 questions",mk:()=>lire(10)},
  {id:"romains-ecrire",title:"J'écris en chiffres romains",desc:"10 questions",mk:()=>ecrireR(10)},
  {id:"romains-construire",title:"Je construis des nombres",desc:"6 exercices avec I, V, X",mk:()=>construire(6)},
  {id:"romains-vie",title:"Dans la vraie vie",desc:"6 questions : horloges, rois, siècles",mk:()=>qrQ(6)}]},
 alphabet:{title:"English : the alphabet",e:"🔤",col:"var(--alphabet)",lesson:"lecon-alphabet.html",tests:[
  {id:"alphabet-quiz",title:"Quiz de l'alphabet",desc:"10 questions : avant, après, premières lettres",mk:()=>alphaQuiz(10)},
  {id:"alphabet-ecoute",title:"J'écoute les lettres",desc:"10 lettres à reconnaître en écoutant",mk:()=>alphaEcoute(10)},
  {id:"alphabet-ordre",title:"Ordre et mots",desc:"6 exercices : ranger les lettres, écrire des mots",mk:()=>alphaOrdre()}]},
 phrases:{title:"English : basic phrases",e:"💬",col:"var(--phrases)",lesson:"lecon-phrases.html",tests:[
  {id:"phrases-quiz",title:"Français ↔ English",desc:"10 questions de traduction",mk:()=>phQuiz(10)},
  {id:"phrases-ecoute",title:"J'écoute les phrases",desc:"8 phrases à comprendre en écoutant",mk:()=>phEcoute(8)},
  {id:"phrases-ordre",title:"Je construis des phrases",desc:"6 phrases à remettre en ordre",mk:()=>phOrdre(6)},
  {id:"phrases-dialogue",title:"Que répondre ?",desc:"8 petites situations",mk:()=>phDialogue(8)}]},
 nombres:{title:"English : numbers & colours",e:"🔢",col:"var(--nombres)",lesson:"lecon-nombres.html",tests:[
  {id:"nombres-quiz",title:"Les nombres : quiz",desc:"10 questions de 1 à 20",mk:()=>numQuiz(10)},
  {id:"nombres-ecoute",title:"J'écoute les nombres",desc:"10 nombres à reconnaître en écoutant",mk:()=>numEcoute(10)},
  {id:"couleurs-quiz",title:"Les couleurs : quiz",desc:"10 questions avec des carrés de couleur",mk:()=>colQuiz(10)},
  {id:"couleurs-ecoute",title:"J'écoute les couleurs",desc:"8 couleurs à reconnaître en écoutant",mk:()=>colEcoute(8)},
  {id:"nombres-ordre",title:"Ordre et mots",desc:"6 exercices : ranger les nombres, écrire des mots",mk:()=>nbOrdre()}]},
 tables:{title:"Maths : les tables de multiplication",e:"✖️",col:"var(--tables)",lesson:"lecon-tables.html",tests:[
  {id:"tables-2-5",title:"Les tables de 2, 3, 4 et 5",desc:"10 calculs à écrire",mk:()=>mulType([2,3,4,5],10)},
  {id:"tables-6-9",title:"Les tables de 6, 7, 8 et 9",desc:"10 calculs à écrire",mk:()=>mulType([6,7,8,9],10)},
  {id:"tables-qcm",title:"Choisis le bon résultat",desc:"10 questions, toutes les tables",mk:()=>mulChoix([2,3,4,5,6,7,8,9],10)},
  {id:"tables-trous",title:"Calcul à trous",desc:"8 calculs : trouve le nombre qui manque",mk:()=>mulTrous([2,3,4,5,6,7,8,9],8)},
  {id:"tables-ordre",title:"Ordre et suites",desc:"6 exercices : ranger et continuer les tables",mk:()=>tablesOrdre()},
  {id:"tables-problemes",title:"Petits problèmes",desc:"6 problèmes de la vie de tous les jours",mk:()=>problemes(6)}]},
 final:{title:"Le contrôle final",e:"🏆",col:"var(--final)",lesson:"lecons.html",tests:[
  {id:"final",title:"Contrôle final (tout mélangé)",desc:"20 questions : jours, mois, année, chiffres romains",mk:()=>[...genJours(5),...genMois(5),...qaQ(5),...lire(3),...ecrireR(2)]},
  {id:"final-english",title:"Contrôle final English (tout mélangé)",desc:"15 questions : alphabet, phrases, nombres, couleurs",mk:()=>[...alphaQuiz(3),...alphaEcoute(2),...phQuiz(3),...phEcoute(2),...phDialogue(2),...numQuiz(2),...colQuiz(1)]},
  {id:"final-maths",title:"Contrôle final Maths (tout mélangé)",desc:"15 questions : les tables de multiplication",mk:()=>[...mulType([2,3,4,5],4),...mulType([6,7,8,9],4),...mulChoix([2,3,4,5,6,7,8,9],3),...mulTrous([2,3,4,5,6,7,8,9],2),...problemes(2)]}]}
};
