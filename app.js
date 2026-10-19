const $=id=>document.getElementById(id);const key='virtud_nombre';let entries=[];
// Revalidar los archivos de la aplicación cuando haya conexión.
function dayIndex(){const d=new Date();const n=Math.round((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-Date.UTC(d.getFullYear(),0,1))/86400000);return n;}
function render(){const name=localStorage.getItem(key);$('welcome').style.display=name?'none':'block';$('daily').hidden=!name;if(!name||!entries.length)return;const d=new Date(),index=dayIndex(),q=entries[index % entries.length];$('greet').textContent='Hola, '+name;$('date').textContent=new Intl.DateTimeFormat('es',{day:'numeric',month:'long',year:'numeric'}).format(d)+' · '+entries.length+' pasajes clásicos (ciclo repetible)';$('quote').textContent='“'+q.text+'”';$('author').textContent=q.author+' · '+q.source;$('type').textContent=q.kind;const fav=JSON.parse(localStorage.getItem('virtud_favs_v2')||'[]');$('favorite').textContent=fav.includes(index % entries.length)?'♥ Guardada':'♡ Guardar';$('favorite').onclick=()=>{const a=JSON.parse(localStorage.getItem('virtud_favs_v2')||'[]');localStorage.setItem('virtud_favs_v2',JSON.stringify(a.includes(index % entries.length)?a.filter(x=>x!==index % entries.length):[...a,index % entries.length]));render()};$('share').onclick=()=>{const text=q.text+' — '+q.author;if(navigator.share)navigator.share({text}).catch(()=>{});else navigator.clipboard?.writeText(text).then(()=>alert('Texto copiado'))};}
$('save').onclick=()=>{const n=$('name').value.trim();if(n){localStorage.setItem(key,n);render()}};
$('rename').onclick=()=>{const n=prompt('¿Cómo te llamas?',localStorage.getItem(key)||'');if(n?.trim()){localStorage.setItem(key,n.trim());render()}};
fetch('frases.json', {cache:'no-store'}).then(r=>r.json()).then(data=>{entries=data;render()}).catch(()=>{$('status').textContent='No se pudieron cargar las frases. Comprueba la conexión la primera vez.'});
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});

// Actualizar al volver a la app y al cambiar el día.
document.addEventListener('visibilitychange',()=>{if(!document.hidden)render()});
window.addEventListener('focus',render);
setInterval(()=>{if(!document.hidden)render()},60000);
