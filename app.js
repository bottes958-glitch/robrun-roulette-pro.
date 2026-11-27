const $=id=>document.getElementById(id);
const RED=[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
let selected=7, history=[];
const money=n=>new Intl.NumberFormat('fr-FR',{maximumFractionDigits:2}).format(n);
const isRed=n=>RED.includes(n);
const numberColor=n=>n===0?'zero':isRed(n)?'red':'black';
function load(){try{history=JSON.parse(localStorage.getItem('rrp-history')||'[]');$('startingBalance').value=localStorage.getItem('rrp-start')||'25000';}catch{history=[]}}
function persist(){localStorage.setItem('rrp-history',JSON.stringify(history));localStorage.setItem('rrp-start',$('startingBalance').value)}
function makeGrid(){const g=$('numberGrid');g.innerHTML='';for(let n=0;n<=36;n++){const b=document.createElement('button');b.className=`number ${numberColor(n)} ${n===selected?'selected':''}`;b.textContent=n;b.setAttribute('aria-label',`Résultat ${n}`);b.onclick=()=>{selected=n;makeGrid();updatePreview()};g.append(b)}$('selectedNumber').textContent=selected}
function payout(){const type=$('betType').value, raw=$('betChoice').value.trim().toLowerCase(), nums=raw.split(/[ ,;/-]+/).map(Number), s=Number($('stake').value)||0;let mult=0,win=false;
 if(type==='straight'){mult=36;win=selected===Number(raw)}
 if(type==='split'){mult=18;win=nums.length===2&&nums.includes(selected)}
 if(type==='street'){mult=12;win=nums.length===3&&nums.includes(selected)}
 if(type==='corner'){mult=9;win=nums.length===4&&nums.includes(selected)}
 if(type==='sixline'){mult=6;win=nums.length===6&&nums.includes(selected)}
 if(type==='dozen'){mult=3;win=raw==='d1'?selected>=1&&selected<=12:raw==='d2'?selected>=13&&selected<=24:raw==='d3'?selected>=25&&selected<=36:false}
 if(type==='column'){mult=3;win=['c1','c2','c3'].includes(raw)&&selected!==0&&selected%3===Number(raw[1])%3}
 if(type==='evenmoney'){mult=2;win=raw==='rouge'?isRed(selected):raw==='noir'?selected!==0&&!isRed(selected):raw==='pair'?selected!==0&&selected%2===0:raw==='impair'?selected%2===1:raw==='manque'?selected>=1&&selected<=18:raw==='passe'?selected>=19&&selected<=36:false}
 return {s,mult,win,gross:win?s*mult:0,net:win?s*(mult-1):-s};
}
function updatePreview(){const p=payout();$('grossWin').textContent=money(p.gross);$('netWin').textContent=(p.net>0?'+':'')+money(p.net);$('netWin').className=p.net>=0?'positive':'negative';$('afterBalance').textContent=money(currentBalance()+p.net);$('saveRound').disabled=p.s<=0||p.s>currentBalance();$('feedback').textContent=p.s<=0?'Saisis une mise supérieure à zéro.':p.s>currentBalance()?'Mise supérieure au solde disponible.':p.mult===0?'Vérifie le choix du pari et le format des numéros.':'Paiement calculé selon les règles classiques.'}
function currentBalance(){return (Number($('startingBalance').value)||0)+history.reduce((a,h)=>a+h.net,0)}
function render(){const bal=currentBalance();$('balanceDisplay').textContent=money(bal);$('profitTotal').textContent=(history.reduce((a,h)=>a+h.net,0)>0?'+':'')+money(history.reduce((a,h)=>a+h.net,0));const recent=history.slice(0,Number($('windowSize').value));const nums=recent.map(h=>h.number);const count=f=>nums.filter(f).length;
 $('redCount').textContent=count(isRed);$('blackCount').textContent=count(n=>n!==0&&!isRed(n));$('zeroCount').textContent=count(n=>n===0);$('evenCount').textContent=count(n=>n!==0&&n%2===0);$('oddCount').textContent=count(n=>n%2===1);
 const freq=Array.from({length:37},(_,n)=>({n,c:count(x=>x===n)})).sort((a,b)=>b.c-a.c||a.n-b.n);
 $('hotNumbers').innerHTML=recent.length?freq.slice(0,5).map(x=>`<li>Numéro <b>${x.n}</b> — ${x.c} fois</li>`).join(''):'<li>Aucun tirage enregistré</li>';
 $('recentNumbers').innerHTML=recent.length?recent.map(h=>`<span class="recent-chip ${numberColor(h.number)}">${h.number}</span>`).join(''):'—';
 $('historyBody').innerHTML=history.length?history.slice(0,100).map((h,i)=>`<tr><td>${history.length-i}</td><td><span class="recent-chip ${numberColor(h.number)}">${h.number}</span></td><td>${h.betLabel}</td><td>${money(h.stake)}</td><td style="color:${h.net>=0?'#5bd49a':'#ff7885'}">${h.net>0?'+':''}${money(h.net)}</td></tr>`).join(''):'<tr><td colspan="5" class="muted">Aucun tour enregistré.</td></tr>';
 updatePreview();persist();
}
$('saveRound').onclick=()=>{const p=payout();if(!p.s||p.s>currentBalance()||!p.mult){$('feedback').textContent='Vérifie la mise et ton pari.';return}history.unshift({number:selected,stake:p.s,net:p.net,betLabel:$('betType').selectedOptions[0].text+' · '+$('betChoice').value});render()};
$('undoRound').onclick=()=>{history.shift();render()};
$('resetHistory').onclick=()=>{if(confirm('Effacer tout l’historique des tirages ?')){history=[];render()}};
$('startingBalance').oninput=render;$('stake').oninput=updatePreview;$('betType').onchange=updatePreview;$('betChoice').oninput=updatePreview;$('windowSize').onchange=render;
$('exportCsv').onclick=()=>{const rows=[['Numero','Type de pari','Mise','Net'],...history.map(h=>[h.number,h.betLabel,h.stake,h.net])];const csv=rows.map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(';')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));a.download='robrun-roulette-historique.csv';a.click();URL.revokeObjectURL(a.href)};
load();makeGrid();render();
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));