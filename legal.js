/* Malhuayza Motors – Parte legal del catálogo web:
   identificación de la empresa, Libro de Reclamaciones virtual, Términos y condiciones, Política de privacidad,
   Política de cookies (Google Analytics solo con permiso), Garantía y registro trazable de cada aceptación.
   Se carga antes del código principal y expone window.MMLegal. */
(function(){
"use strict";
const CFG = {
  razon:"Inversiones Malhuayza E.I.R.L.", comercial:"Malhuayza Motors", ruc:"20534497351",
  domicilio:"Jr. Américo Oré 155, Huamanga, Ayacucho", referencia:"a 1 cuadra de la SUNAT",
  whatsapp:"51989005413", whatsappTxt:"989 005 413",
  correo:"",                 // correo para reclamos y datos personales (cuando lo tengan, se muestra solo)
  registroUrl:"",            // URL /exec de la aplicación web de Apps Script (registros-apps-script.gs)
  bancoDatos:"Clientes y consultas de Malhuayza Motors",
  bancoCodigo:"",            // código de inscripción en el Registro Nacional de Protección de Datos Personales
  gaId:"G-M87ZML5VDM",
  vTerminos:"1.0", vPrivacidad:"1.0", vCookies:"1.0", vGarantia:"1.0", fechaDocs:"24 de noviembre de 2026",
  aviso:"https://lh3.googleusercontent.com/d/13smrau8xIWO-TNT1aeBTD_QFNhMTRakY=w400"
};
const SEDES = ["Sede Américo Oré – Jr. Américo Oré 155 (tienda principal)","Taller – Jr. Américo Oré 145",
  "Sede La Victoria – Av. La Victoria 268","Sede Mariscal Cáceres – Av. Mariscal Cáceres 509",
  "Canal virtual – página web o WhatsApp"];
const VIEWS = ["terminos","privacidad","cookies","garantia","libro-reclamaciones"];

/* ---------- utilidades ---------- */
const st = { get(k,d){ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch(e){ return d; } },
             set(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} } };
const esc = s => String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const rnd = n => { const a="ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let s=""; const r=(window.crypto&&crypto.getRandomValues)?crypto.getRandomValues(new Uint32Array(n)):Array.from({length:n},()=>Math.random()*1e9|0); for(let i=0;i<n;i++) s+=a[r[i]%a.length]; return s; };
const ymd = d => String(d.getFullYear()).slice(2)+String(d.getMonth()+1).padStart(2,"0")+String(d.getDate()).padStart(2,"0");
const fmtFecha = iso => { try{ return new Date(iso).toLocaleString("es-PE",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}); }catch(e){ return iso; } };
function visitante(){ let v=st.get("mm-vid",""); if(!v){ v="V-"+rnd(12); st.set("mm-vid",v); } return v; }
const base = () => location.href.split("#")[0];
const link = (h,t) => `<a href="${base()}#${h}" target="_blank" rel="noopener">${t}</a>`;
function ctx(){ return { pagina:location.href, navegador:navigator.userAgent, idioma:navigator.language||"",
  pantalla:(screen&&screen.width?screen.width+"x"+screen.height:""), zona:(Intl.DateTimeFormat().resolvedOptions().timeZone||""),
  visitante:visitante(), fechaDispositivo:new Date().toISOString() }; }

/* Cola de registros: se guarda en el celular hasta que el servidor confirma que lo anotó */
function enviar(obj){ const q=st.get("mm-logq",[]); q.push(obj); st.set("mm-logq",q.slice(-50)); vaciar(); }
let enviando=false;
async function vaciar(){
  if(enviando||!CFG.registroUrl||navigator.onLine===false) return;
  enviando=true;
  try{
    let q=st.get("mm-logq",[]);
    while(q.length){
      const r=await fetch(CFG.registroUrl,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(q[0])});
      const j=await r.json().catch(()=>({}));
      if(!j.ok) break;
      q=st.get("mm-logq",[]); q.shift(); st.set("mm-logq",q);
    }
  }catch(e){}
  enviando=false;
}
window.addEventListener("online",vaciar);

/* ---------- Aceptación de Términos y Privacidad ---------- */
function consentimiento(){ const c=st.get("mm-consent",null); return c&&c.tv===CFG.vTerminos&&c.pv===CFG.vPrivacidad?c:null; }
function aceptar(promo,origen){
  const at=new Date();
  const c={code:"MM-"+ymd(at)+"-"+rnd(5),at:at.toISOString(),tv:CFG.vTerminos,pv:CFG.vPrivacidad,promo:!!promo};
  st.set("mm-consent",c);
  document.querySelectorAll("[data-cs]:not(.done)").forEach(x=>{ x.outerHTML=`<div class="cs-box done" data-cs>${okHtml(c)}</div>`; });
  enviar(Object.assign({tipo:"consentimiento",codigo:c.code,terminos:true,vTerminos:c.tv,privacidad:true,vPrivacidad:c.pv,promociones:c.promo,origen:origen||""},ctx()));
  return c;
}
const okHtml = c => `<p class="cs-ok">✓ Aceptaste los ${link("terminos","Términos y condiciones")} (v${esc(c.tv)}) y la ${link("privacidad","Política de privacidad")} (v${esc(c.pv)}) el ${esc(fmtFecha(c.at))}. Código: <b>${esc(c.code)}</b></p>`;
function consentBlock(){
  const c=consentimiento(); if(c) return `<div class="cs-box done" data-cs>${okHtml(c)}</div>`;
  return `<div class="cs-box" data-cs>
    <p class="cs-t">Antes de escribirnos por WhatsApp, marca las dos casillas obligatorias:</p>
    <label class="cs-row"><input type="checkbox" data-cs-t><span>He leído y acepto los ${link("terminos","Términos y condiciones de uso")}.</span></label>
    <label class="cs-row"><input type="checkbox" data-cs-p><span>He leído la ${link("privacidad","Política de privacidad")} y autorizo el tratamiento de mis datos para atender mi consulta.</span></label>
    <label class="cs-row opt"><input type="checkbox" data-cs-m><span>Opcional: quiero recibir promociones de Malhuayza Motors por WhatsApp.</span></label>
    <p class="cs-err" role="alert" hidden>Marca las dos casillas obligatorias para continuar.</p>
  </div>`;
}
/* Agrega al mensaje de WhatsApp el código de aceptación (queda como prueba en el chat) */
function conCodigo(href,c){
  try{
    const u=new URL(href); const t=u.searchParams.get("text")||"";
    if(t.includes("Código de aceptación")) return href;
    const nt=(t?t+"\n\n":"")+`(Código de aceptación ${c.code} · Términos v${c.tv} · Privacidad v${c.pv})`;
    return u.origin+u.pathname+"?text="+encodeURIComponent(nt);
  }catch(e){ return href; }
}
/* Ningún enlace de WhatsApp se abre sin las dos aceptaciones */
document.addEventListener("click",e=>{
  const a=e.target.closest&&e.target.closest('a[href^="https://wa.me/"]'); if(!a) return;
  let c=consentimiento();
  const scope=a.closest(".sheet,.cs-gate,[data-cs-scope]"), box=scope&&scope.querySelector("[data-cs]:not(.done)");
  if(!c&&box){
    const t=box.querySelector("[data-cs-t]").checked, p=box.querySelector("[data-cs-p]").checked;
    if(!(t&&p)){ e.preventDefault(); const er=box.querySelector(".cs-err"); er.hidden=false; box.classList.remove("shake"); void box.offsetWidth; box.classList.add("shake"); box.scrollIntoView({block:"center",behavior:"smooth"}); return; }
    c=aceptar(box.querySelector("[data-cs-m]").checked, a.dataset.origen||[...scope.querySelectorAll("#mTitle,.sheet-head .sub,.cs-gate h3")].map(x=>x.textContent.trim()).filter(Boolean).join(" · ")||(scope.matches("[data-cs-scope]")?"Pestaña Contacto":""));
  }
  if(!c){ e.preventDefault(); abrirPuerta(a.href,(a.querySelector("b")||{}).textContent||"WhatsApp"); return; }
  a.href=conCodigo(a.href,c);
},true);
/* Ventana de aceptación para los enlaces de WhatsApp fuera de un formulario (Contacto, sedes) */
function abrirPuerta(href,quien){
  cerrarPuerta();
  const d=document.createElement("div"); d.className="cs-gate"; d.setAttribute("role","dialog"); d.setAttribute("aria-modal","true"); d.setAttribute("aria-labelledby","csGateT");
  d.innerHTML=`<div class="cs-card"><h3 id="csGateT">Escribir a ${esc(quien)}</h3>${consentBlock()}
    <div class="cs-actions"><a class="wa" href="${esc(href)}" target="_blank" rel="noopener" data-origen="${esc("Contacto: "+quien)}">Continuar a WhatsApp</a>
    <button class="ghost" type="button" data-cs-close>Cancelar</button></div></div>`;
  document.body.appendChild(d);
  d.addEventListener("click",ev=>{ if(ev.target===d||ev.target.closest("[data-cs-close]")) cerrarPuerta(); if(ev.target.closest(".wa")&&consentimiento()) setTimeout(cerrarPuerta,300); });
  const f=d.querySelector("input"); if(f) f.focus();
}
function cerrarPuerta(){ document.querySelectorAll(".cs-gate").forEach(x=>x.remove()); }
document.addEventListener("keydown",e=>{ if(e.key==="Escape"&&document.querySelector(".cs-gate")){ e.stopPropagation(); cerrarPuerta(); } },true);

/* ---------- Cookies: Google Analytics solo con permiso ---------- */
let gaCargado=false;
function cargarGA(){
  if(gaCargado||!CFG.gaId) return; gaCargado=true;
  window.dataLayer=window.dataLayer||[]; window.gtag=function(){ dataLayer.push(arguments); };
  gtag("js",new Date()); gtag("config",CFG.gaId);
  const s=document.createElement("script"); s.async=true; s.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(CFG.gaId); document.head.appendChild(s);
}
function borrarCookiesGA(){
  document.cookie.split(";").map(c=>c.split("=")[0].trim()).filter(n=>/^_ga/.test(n)).forEach(n=>{
    const h=location.hostname; [h,"."+h,"."+h.split(".").slice(-2).join(".")].forEach(dom=>{ document.cookie=n+"=; Max-Age=0; path=/; domain="+dom; }); document.cookie=n+"=; Max-Age=0; path=/"; });
}
function decidirCookies(ok){
  const at=new Date().toISOString(); st.set("mm-cookies",{v:CFG.vCookies,ok:!!ok,at});
  enviar(Object.assign({tipo:"cookies",codigo:"CK-"+ymd(new Date())+"-"+rnd(5),analitica:!!ok,vCookies:CFG.vCookies,origen:"Aviso de cookies"},ctx()));
  const b=document.getElementById("cookieBar"); if(b) b.remove();
  if(ok) cargarGA(); else if(gaCargado){ borrarCookiesGA(); location.reload(); } else borrarCookiesGA();
}
function avisoCookies(forzar){
  const c=st.get("mm-cookies",null);
  if(!forzar&&c&&c.v===CFG.vCookies){ if(c.ok) cargarGA(); return; }
  if(document.getElementById("cookieBar")) return;
  const b=document.createElement("div"); b.id="cookieBar"; b.className="ck-bar"; b.setAttribute("role","region"); b.setAttribute("aria-label","Aviso de cookies");
  b.innerHTML=`<p><b>¿Nos ayudas a mejorar?</b> Con tu permiso usamos cookies de Google Analytics para contar visitas y saber qué modelos se ven más. No las usamos para publicidad. ${link("cookies","Política de cookies")}${c?` · Hoy: ${c.ok?"aceptadas":"rechazadas"}`:""}</p>
    <div class="ck-btns"><button type="button" class="ghost" data-ck="0">Rechazar</button><button type="button" class="primary" data-ck="1">Aceptar</button></div>`;
  b.addEventListener("click",e=>{ const x=e.target.closest("[data-ck]"); if(x) decidirCookies(x.dataset.ck==="1"); });
  document.body.appendChild(b);
}
document.addEventListener("click",e=>{ if(e.target.closest("[data-cookie-settings]")){ e.preventDefault(); avisoCookies(true); } });

/* ---------- Documentos ---------- */
const empresa = `<p><b>${CFG.razon}</b> (nombre comercial <b>${CFG.comercial}</b>), RUC ${CFG.ruc}, con domicilio en ${CFG.domicilio} (${CFG.referencia}). Contacto: WhatsApp ${CFG.whatsappTxt}${CFG.correo?`, correo ${esc(CFG.correo)}`:""}, o en cualquiera de nuestras tiendas.</p>`;
const head = (t,v) => `<p class="lg-kick">Documento legal</p><h1>${t}</h1><p class="lg-ver">Versión ${v} · Vigente desde el ${CFG.fechaDocs}</p>`;
const placaTxt = "La Tarjeta de Identificación Vehicular Electrónica (TIVE) sale en aproximadamente 15 días hábiles (puede salir antes, según los plazos de la SUNARP). La placa está lista unos 7 días hábiles después de emitida la TIVE.";

const DOCS = {
terminos: () => head("Términos y condiciones de uso",CFG.vTerminos)+`
<h2>1. Quiénes somos</h2>${empresa}
<h2>2. Para qué sirve esta página</h2>
<p>Es un catálogo informativo de los vehículos que vendemos (motos, scooters, trimotos y cuatrimotos), con sus precios, colores referenciales, disponibilidad, tiendas y una simulación de cuotas. La página no cobra ni cierra ventas: la compra se concreta en nuestras tiendas o coordinándola por WhatsApp, donde se emite el comprobante de pago correspondiente.</p>
<p>Al usar los botones de WhatsApp de la página aceptas estos términos. Para escribirnos te pedimos aceptar por separado estos términos y la ${link("privacidad","Política de privacidad")}; guardamos la fecha, la hora y la versión aceptada como constancia.</p>
<h2>3. Precios</h2>
<ul><li>Todos los precios están en soles (S/) e <b>incluyen el IGV</b>.</li>
<li><b>El SOAT no está incluido</b> en el precio del vehículo. Puedes contratarlo aparte o incluirlo en el financiamiento.</li>
<li>Los precios se actualizan desde nuestra lista oficial; la fecha de la última actualización aparece al pie de la página. El precio que respetamos es el publicado al momento de tu consulta.</li>
<li><b>Precio especial:</b> aplica a unidades nuevas de años de fabricación anteriores y es válido <b>hasta agotar stock</b> de esas unidades. Junto al precio especial mostramos el precio de lista.</li></ul>
<h2>4. Disponibilidad, colores e imágenes</h2>
<ul><li>"En tienda" indica las unidades registradas en nuestro inventario al momento de la última actualización. Como también vendemos en tienda, te confirmamos la disponibilidad al consultar.</li>
<li>"A pedido" significa que el modelo no está ahora en tienda y lo pedimos para ti; te informamos el tiempo de llegada antes de cualquier pago.</li>
<li>Las fotos, videos y vistas 360° son referenciales. El color real puede variar ligeramente según la pantalla.</li></ul>
<h2>5. Lo que incluye la compra</h2>
<ul><li>Trámite de placa y de la TIVE. ${placaTxt}</li>
<li>1 casco básico (según modelo).</li>
<li>Garantía de 12 meses de la marca por defectos de fábrica, en las condiciones de nuestra ${link("garantia","Política de garantía")}.</li></ul>
<h2>6. Financiamiento</h2>
<p>El financiamiento lo otorga <b>Global Go</b>, una entidad independiente de ${CFG.comercial}, y está sujeto a su evaluación crediticia. La pestaña "Cuotas" es una <b>simulación referencial</b> preparada por nosotros a partir de simulaciones reales de Global Go: no es una oferta de crédito. La cuota, la tasa de costo efectivo anual (TCEA), los cargos y el cronograma definitivos son los que figuran en la hoja resumen y el contrato que te entrega Global Go antes de firmar.</p>
<h2>7. Uso correcto de la página</h2>
<p>Te comprometes a usar la página de buena fe, a no intentar dañarla ni acceder a sus sistemas, y a dar datos verdaderos cuando nos escribas o registres un reclamo.</p>
<h2>8. Propiedad intelectual</h2>
<p>Las marcas, logotipos, fotos y videos de los vehículos pertenecen a sus fabricantes o titulares y se muestran como distribuidores, con fines informativos. El diseño y los textos de la página pertenecen a ${CFG.razon}. No está permitido copiarlos con fines comerciales sin autorización.</p>
<h2>9. Servicios de terceros</h2>
<p>La página usa servicios de terceros: WhatsApp (Meta) para los mensajes, Google Drive y Google Sheets para fotos y precios, Google Maps para las direcciones, Google Fonts para la tipografía y, solo si lo aceptas, Google Analytics. Al usarlos se aplican también sus propias condiciones.</p>
<h2>10. Libro de Reclamaciones</h2>
<p>Contamos con un ${link("libro-reclamaciones","Libro de Reclamaciones virtual")} y uno físico en cada tienda. Respondemos en un plazo máximo de 15 días hábiles. Presentar un reclamo no te impide acudir a otras vías ni es requisito para denunciar ante el INDECOPI.</p>
<h2>11. Cambios</h2>
<p>Podemos actualizar estos términos; la versión y la fecha vigentes figuran arriba. Si cambian, te pediremos aceptarlos de nuevo antes de escribirnos.</p>
<h2>12. Ley aplicable</h2>
<p>Se rigen por las leyes del Perú, en particular el Código de Protección y Defensa del Consumidor (Ley 29571).</p>`,

privacidad: () => head("Política de privacidad",CFG.vPrivacidad)+`
<p>Cumplimos la Ley 29733, Ley de Protección de Datos Personales, y su Reglamento (D.S. 016-2024-JUS). Aquí te contamos qué datos tratamos, para qué y cómo ejercer tus derechos.</p>
<h2>1. Responsable</h2>${empresa}
<h2>2. Qué datos tratamos</h2>
<ul><li><b>Cuando nos escribes por WhatsApp:</b> tu nombre, número de celular, el modelo que te interesa y lo que nos cuentes en el chat.</li>
<li><b>Si pides una evaluación de financiamiento:</b> los datos que Global Go necesite para evaluarte (por ejemplo, tu DNI e ingresos), que se entregan a Global Go solo si tú lo pides.</li>
<li><b>Si compras:</b> los datos necesarios para el comprobante de pago, la placa, la TIVE y la garantía.</li>
<li><b>Si registras un reclamo o queja:</b> nombre, documento de identidad, domicilio, teléfono, correo y el detalle del reclamo.</li>
<li><b>Constancia de tus aceptaciones:</b> fecha y hora, un código de aceptación, la versión de los documentos aceptados, tu decisión sobre cookies, el tipo de navegador, el idioma, el tamaño de pantalla y un identificador anónimo aleatorio. No registramos tu dirección IP.</li>
<li><b>Solo si aceptas cookies de analítica:</b> los datos de navegación que recoge Google Analytics (identificadores en línea, páginas vistas, tipo de dispositivo, ciudad aproximada). Más detalle en la ${link("cookies","Política de cookies")}.</li>
<li><b>En tu propio celular o computadora (no nos llegan):</b> tus favoritos "Me interesa", una copia del catálogo para verlo sin señal y tus preferencias.</li></ul>
<h2>3. Para qué los usamos</h2>
<ul><li>Responder tus consultas, enviarte cotizaciones y coordinar visitas.</li>
<li>Realizar la venta, emitir el comprobante, tramitar la placa y la TIVE, y atender la garantía.</li>
<li>Derivar tu solicitud a Global Go, solo si pides una evaluación de financiamiento.</li>
<li>Atender reclamos y quejas del Libro de Reclamaciones (obligación legal).</li>
<li>Guardar la constancia de tus aceptaciones para poder acreditarlas ante las autoridades.</li>
<li>Contar visitas y mejorar la página, solo si aceptas las cookies de analítica.</li>
<li>Enviarte promociones por WhatsApp, solo si marcas la casilla opcional. Puedes darte de baja cuando quieras escribiéndonos "BAJA".</li></ul>
<h2>4. Base legal</h2>
<p>Tu consentimiento (las casillas que marcas), la ejecución de la compra o de los pasos previos que tú pides, y el cumplimiento de obligaciones legales (comprobantes, Libro de Reclamaciones, requerimientos de autoridades).</p>
<h2>5. Con quién los compartimos</h2>
<ul><li><b>Global Go:</b> solo si solicitas una evaluación de financiamiento.</li>
<li><b>Meta Platforms (WhatsApp):</b> el canal por el que nos escribes.</li>
<li><b>Google LLC:</b> guardamos los registros en Google Sheets y Google Drive (Google Workspace), y usamos Google Analytics solo si lo aceptas.</li>
<li><b>Autoridades</b> como INDECOPI, SUNAT, SUNARP o la Autoridad Nacional de Protección de Datos Personales, cuando la ley lo exige.</li></ul>
<p>No vendemos ni alquilamos tus datos.</p>
<h2>6. Transferencia internacional</h2>
<p>Google y Meta pueden guardar los datos en servidores fuera del Perú (por ejemplo, en Estados Unidos). Son proveedores que aplican medidas de seguridad y confidencialidad. Al aceptar esta política autorizas ese flujo transfronterizo, necesario para usar estos servicios.</p>
<h2>7. Banco de datos</h2>
<p>Tus datos forman parte del banco de datos "${esc(CFG.bancoDatos)}", de titularidad de ${CFG.razon}${CFG.bancoCodigo?`, inscrito en el Registro Nacional de Protección de Datos Personales con el código ${esc(CFG.bancoCodigo)}`:""}.</p>
<h2>8. Cuánto tiempo los guardamos</h2>
<ul><li>Consultas que no terminan en compra: hasta 2 años desde el último contacto.</li>
<li>Clientes: mientras dure la relación comercial y la garantía, y luego durante los plazos que exigen las normas tributarias.</li>
<li>Reclamos y quejas: como mínimo 2 años, como exige el Reglamento del Libro de Reclamaciones.</li>
<li>Constancias de aceptación: mientras tratemos tus datos y hasta 5 años después, para poder acreditarlas.</li>
<li>Google Analytics: 14 meses.</li></ul>
<h2>9. Tus derechos</h2>
<p>Puedes pedir información sobre el uso de tus datos y ejercer tus derechos de <b>acceso, rectificación, cancelación y oposición</b> (derechos ARCO), así como <b>revocar tu consentimiento</b> en cualquier momento, sin costo. Escríbenos por WhatsApp al ${CFG.whatsappTxt}${CFG.correo?` o al correo ${esc(CFG.correo)}`:""}, o acércate a ${CFG.domicilio}, indicando tu nombre, tu DNI y lo que pides. Respondemos en los plazos del Reglamento. Si no estás conforme con nuestra respuesta, puedes presentar una reclamación ante la Autoridad Nacional de Protección de Datos Personales del Ministerio de Justicia y Derechos Humanos.</p>
<h2>10. Si no nos das tus datos</h2>
<p>No es obligatorio. Si no aceptas, no podremos atenderte por WhatsApp desde la página, pero puedes visitarnos en cualquiera de nuestras tiendas.</p>
<h2>11. Menores de edad</h2>
<p>La página no está dirigida a menores de 18 años. Si eres menor, pide a tu padre, madre o tutor que nos contacte. En el Libro de Reclamaciones, un menor puede reclamar indicando los datos de su padre, madre o apoderado.</p>
<h2>12. Seguridad</h2>
<p>Limitamos el acceso a los datos a las personas de la empresa que los necesitan, guardamos los registros en cuentas protegidas y cada constancia lleva una huella digital encadenada que permite detectar si alguien la modifica.</p>
<h2>13. Cambios</h2>
<p>Si cambiamos esta política, publicaremos la nueva versión aquí y te pediremos aceptarla de nuevo antes de escribirnos.</p>`,

cookies: () => head("Política de cookies",CFG.vCookies)+`
<p>Las cookies y el almacenamiento local son pequeños datos que la página guarda en tu navegador. Esta política explica cuáles usamos.</p>
<h2>1. Cookies de analítica (solo con tu permiso)</h2>
<p>Usamos <b>Google Analytics 4</b> (de Google LLC) para contar visitas y saber qué modelos y secciones se ven más. <b>No se activan hasta que pulsas "Aceptar"</b> en el aviso de cookies, y no las usamos para publicidad.</p>
<div class="lg-table"><table><thead><tr><th>Cookie</th><th>Para qué</th><th>Duración</th></tr></thead><tbody>
<tr><td>_ga</td><td>Distingue visitantes de forma anónima</td><td>2 años</td></tr>
<tr><td>_ga_${esc(CFG.gaId.replace(/^G-/,""))}</td><td>Mantiene el estado de la visita</td><td>2 años</td></tr></tbody></table></div>
<p>Los datos de Analytics se conservan 14 meses y pueden procesarse fuera del Perú. Más información en la política de privacidad de Google.</p>
<h2>2. Almacenamiento necesario para que la página funcione</h2>
<p>Se guarda solo en tu dispositivo, no nos llega y no requiere permiso porque es necesario para el funcionamiento que tú pides:</p>
<div class="lg-table"><table><thead><tr><th>Dato</th><th>Para qué</th></tr></thead><tbody>
<tr><td>Copia del catálogo y de las fotos</td><td>Ver precios y fotos con poca o ninguna señal</td></tr>
<tr><td>Favoritos "Me interesa"</td><td>Recordar los modelos que marcaste</td></tr>
<tr><td>Tus aceptaciones y tu decisión sobre cookies</td><td>No volver a preguntarte cada vez</td></tr>
<tr><td>Identificador anónimo y registros pendientes</td><td>Enviar la constancia de tus aceptaciones aunque se corte la señal</td></tr>
<tr><td>Avisos ya vistos y colores de marcas</td><td>No repetir avisos y mostrar la página más rápido</td></tr></tbody></table></div>
<h2>3. Servicios de terceros</h2>
<p>Para mostrar las fotos (Google Drive), la tipografía (Google Fonts) y abrir WhatsApp o Google Maps, tu navegador se conecta a esos servicios, que pueden recibir datos técnicos como tu dirección IP según sus propias políticas.</p>
<h2>4. Cómo cambiar tu decisión</h2>
<p>Usa el botón <button type="button" class="lg-inline" data-cookie-settings>Configurar cookies</button> (también está al pie de la página). Si rechazas, borramos las cookies de Analytics. También puedes borrar las cookies desde la configuración de tu navegador.</p>`,

garantia: () => head("Política de garantía",CFG.vGarantia)+`
<h2>1. Qué cubre</h2>
<p>Todos los vehículos nuevos que vendemos tienen una <b>garantía de la marca de 12 meses</b>, contados desde la fecha de compra que figura en tu comprobante de pago.</p>
<p>La garantía cubre los <b>defectos de fábrica</b> que se presenten durante un uso adecuado del vehículo por parte de su dueño.</p>
<h2>2. Qué no cubre</h2>
<p>No cubre los daños o fallas causados por errores humanos en el uso o en la manipulación del vehículo, es decir, los que no se deben a un defecto de fábrica.</p>
<h2>3. Cómo hacerla efectiva</h2>
<ul><li>Acércate a nuestro taller en Jr. Américo Oré 145 (al frente de la tienda principal) o escríbenos al WhatsApp de repuestos y taller, 948 741 018.</li>
<li>Lleva tu comprobante de pago y tu documento de identidad.</li>
<li>Revisamos el vehículo y te informamos si la falla está cubierta y los pasos a seguir con la marca.</li></ul>
<h2>4. Tus derechos</h2>
<p>Esta garantía no limita los derechos que te reconoce el Código de Protección y Defensa del Consumidor (Ley 29571), incluida la garantía legal. Si no estás conforme, puedes registrar tu caso en nuestro ${link("libro-reclamaciones","Libro de Reclamaciones")}.</p>`
};

/* ---------- Libro de Reclamaciones virtual ---------- */
function libroHtml(){
  return `<p class="lg-kick">Conforme al Código de Protección y Defensa del Consumidor</p><h1>Libro de Reclamaciones</h1>
  <div class="lr-head"><img src="${CFG.aviso}" alt="Libro de Reclamaciones" width="200" height="145">
    <div><p><b>Proveedor:</b> ${CFG.razon} (${CFG.comercial})<br><b>RUC:</b> ${CFG.ruc}<br><b>Domicilio:</b> ${CFG.domicilio}</p>
    <p class="lg-ver">Hoja de reclamación virtual. También tenemos un Libro de Reclamaciones físico en cada tienda.</p></div></div>
  <form class="lr-form" id="lrForm" novalidate>
    <fieldset><legend>Datos de la hoja</legend>
      <div class="lr-grid"><label>Fecha<input type="text" value="${esc(new Date().toLocaleDateString("es-PE"))}" readonly></label>
      <label>Establecimiento *<select name="establecimiento" required>${SEDES.map(s=>`<option>${esc(s)}</option>`).join("")}</select></label></div>
    </fieldset>
    <fieldset><legend>1. Identificación del consumidor reclamante</legend>
      <label>Nombres y apellidos *<input name="nombre" required maxlength="120" autocomplete="name"></label>
      <div class="lr-grid"><label>Tipo de documento *<select name="tipoDoc"><option>DNI</option><option>Carné de extranjería</option><option>Pasaporte</option></select></label>
      <label>N° de documento *<input name="numDoc" required maxlength="20" inputmode="numeric"></label></div>
      <label>Domicilio *<input name="domicilio" required maxlength="200" autocomplete="street-address"></label>
      <div class="lr-grid"><label>Teléfono *<input name="telefono" required maxlength="30" inputmode="tel" autocomplete="tel"></label>
      <label>Correo electrónico <small>(para enviarte la copia)</small><input name="correo" type="email" maxlength="120" autocomplete="email"></label></div>
      <label class="lr-check"><input type="checkbox" name="menor" data-lr-menor> Soy menor de edad</label>
      <label data-lr-apo hidden>Nombre del padre, madre o apoderado *<input name="apoderado" maxlength="120"></label>
    </fieldset>
    <fieldset><legend>2. Identificación del bien contratado</legend>
      <div class="lr-grid"><label>Bien *<select name="bien"><option>Producto</option><option>Servicio</option></select></label>
      <label>Monto reclamado (S/)<input name="monto" inputmode="decimal" maxlength="20" placeholder="0.00"></label></div>
      <label>Descripción *<input name="descripcion" required maxlength="500" placeholder="Ej.: moto JCH MT200 negra, comprada el 10/11/2026"></label>
    </fieldset>
    <fieldset><legend>3. Detalle de la reclamación y pedido del consumidor</legend>
      <div class="lr-tipo">
        <label class="lr-radio"><input type="radio" name="tipoReclamo" value="Reclamo" required><span><b>Reclamo</b>: disconformidad relacionada a los productos o servicios.</span></label>
        <label class="lr-radio"><input type="radio" name="tipoReclamo" value="Queja"><span><b>Queja</b>: disconformidad no relacionada a los productos o servicios, o malestar o descontento respecto a la atención al público.</span></label>
      </div>
      <label>Detalle *<textarea name="detalle" required maxlength="3000" rows="5"></textarea></label>
      <label>Pedido *<textarea name="pedido" required maxlength="1500" rows="3"></textarea></label>
    </fieldset>
    <p class="lr-note">Usaremos estos datos solo para atender tu reclamo o queja, como exige la ley, y los conservaremos al menos 2 años. Más información en nuestra ${link("privacidad","Política de privacidad")}. Presentar el reclamo no requiere aceptar ningún otro documento.</p>
    <p class="lr-note">* La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.<br>* El proveedor debe dar respuesta al reclamo o queja en un plazo no mayor a quince (15) días hábiles, el cual es improrrogable.</p>
    <p class="cs-err" id="lrErr" role="alert" hidden></p>
    <button class="primary lr-send" type="submit">Enviar hoja de reclamación</button>
  </form>
  <div id="lrDone" hidden></div>`;
}
function copiaHtml(d,num,fecha,limite,estado){
  const r=(k,v)=>v?`<tr><th>${k}</th><td>${esc(v)}</td></tr>`:"";
  return `<div class="lr-copy" id="lrCopy"><h2>Hoja de reclamación N° ${esc(num)}</h2><p class="lg-ver">Registrada el ${esc(fecha)}${limite?` · Respuesta a más tardar el ${esc(limite)}`:""}</p>
  ${estado}
  <div class="lg-table"><table><tbody>
  ${r("Proveedor",CFG.razon+" ("+CFG.comercial+")")}${r("RUC",CFG.ruc)}${r("Domicilio",CFG.domicilio)}${r("Establecimiento",d.establecimiento)}
  ${r("Consumidor",d.nombre)}${r("Documento",d.tipoDoc+" "+d.numDoc)}${r("Domicilio del consumidor",d.domicilio)}${r("Teléfono",d.telefono)}${r("Correo",d.correo)}
  ${d.menor?r("Padre, madre o apoderado",d.apoderado):""}${r("Bien contratado",d.bien)}${r("Monto reclamado",d.monto?"S/ "+d.monto:"")}${r("Descripción",d.descripcion)}
  ${r("Tipo",d.tipoReclamo)}${r("Detalle",d.detalle)}${r("Pedido",d.pedido)}</tbody></table></div>
  <p class="lr-note">* La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI. * El proveedor debe dar respuesta al reclamo o queja en un plazo no mayor a quince (15) días hábiles, el cual es improrrogable.</p>
  <div class="lr-acts"><button class="primary" type="button" data-lr-print>Descargar o imprimir copia</button></div></div>`;
}
function textoWhatsApp(d,num){
  return `HOJA DE RECLAMACIÓN N° ${num}\nProveedor: ${CFG.razon} · RUC ${CFG.ruc}\nEstablecimiento: ${d.establecimiento}\nConsumidor: ${d.nombre} · ${d.tipoDoc} ${d.numDoc}\nDomicilio: ${d.domicilio}\nTeléfono: ${d.telefono}${d.correo?"\nCorreo: "+d.correo:""}${d.menor?"\nPadre/madre/apoderado: "+d.apoderado:""}\nBien: ${d.bien}${d.monto?" · Monto: S/ "+d.monto:""}\nDescripción: ${d.descripcion}\nTipo: ${d.tipoReclamo}\nDetalle: ${d.detalle}\nPedido: ${d.pedido}`;
}
function bindLibro(root){
  const f=root.querySelector("#lrForm"); if(!f) return;
  const menor=f.querySelector("[data-lr-menor]"), apo=f.querySelector("[data-lr-apo]");
  menor.addEventListener("change",()=>{ apo.hidden=!menor.checked; apo.querySelector("input").required=menor.checked; });
  f.addEventListener("submit",async e=>{
    e.preventDefault();
    const err=root.querySelector("#lrErr"), fd=new FormData(f), d={};
    fd.forEach((v,k)=>d[k]=String(v).trim()); d.menor=menor.checked;
    const faltan=["nombre","numDoc","domicilio","telefono","descripcion","tipoReclamo","detalle","pedido"].filter(k=>!d[k]);
    if(d.menor&&!d.apoderado) faltan.push("apoderado");
    if(d.correo&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.correo)) faltan.push("correo");
    if(faltan.length){ err.textContent="Completa los campos marcados con * (y revisa el correo si lo escribiste)."; err.hidden=false; const x=f.querySelector(`[name="${faltan[0]}"]`); if(x) x.focus(); return; }
    err.hidden=true;
    const btn=f.querySelector(".lr-send"); btn.disabled=true; btn.textContent="Enviando…";
    const payload=Object.assign({tipo:"reclamo"},d,ctx());
    let res=null;
    if(CFG.registroUrl){ try{ const r=await fetch(CFG.registroUrl,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload)}); res=await r.json(); }catch(x){ res=null; } }
    const done=root.querySelector("#lrDone");
    if(res&&res.ok){
      done.innerHTML=copiaHtml(d,res.numero,res.fecha,res.limite,`<p class="cs-ok">✓ Tu ${esc(d.tipoReclamo.toLowerCase())} quedó registrado.${res.copiaCorreo?` Te enviamos una copia a ${esc(d.correo)}.`:" Guarda esta copia con el botón de abajo."}</p>`);
    }else{
      /* Respaldo si el registro en línea no responde: la hoja se envía a la empresa por WhatsApp */
      const num="WEB-"+ymd(new Date())+"-"+rnd(4), fecha=new Date().toLocaleString("es-PE");
      const wa=`https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(textoWhatsApp(d,num))}`;
      st.set("mm-lr-pend",{num,d,at:new Date().toISOString()});
      done.innerHTML=copiaHtml(d,num,fecha,"",`<div class="cs-box"><p class="cs-t">Último paso: envíanos tu hoja</p><p>No pudimos registrarla en línea en este momento. Pulsa el botón para enviárnosla por WhatsApp (ya está escrita) y guarda tu copia. La fecha de tu mensaje cuenta como fecha de presentación.</p><a class="wa lr-wa" href="${wa}" target="_blank" rel="noopener" data-lr-raw>Enviar mi hoja por WhatsApp</a><p class="lr-note">También puedes registrarla en el libro físico de cualquiera de nuestras tiendas.</p></div>`);
    }
    f.hidden=true; done.hidden=false; done.scrollIntoView({block:"start",behavior:"smooth"});
  });
  root.addEventListener("click",e=>{ if(e.target.closest("[data-lr-print]")) window.print(); });
}
/* El envío del reclamo por WhatsApp no depende de aceptar los Términos (no se puede condicionar el Libro) */
document.addEventListener("click",e=>{ const a=e.target.closest&&e.target.closest("a[data-lr-raw]"); if(a){ e.stopImmediatePropagation(); } },true);

function show(key,el){
  if(key==="libro-reclamaciones"){ el.innerHTML=`<div class="lg-doc">${libroHtml()}</div>`; bindLibro(el); }
  else if(DOCS[key]) el.innerHTML=`<article class="lg-doc">${DOCS[key]()}</article>`;
  document.title=(el.querySelector("h1")||{}).textContent+" · "+CFG.comercial;
}

/* ---------- Estilos ---------- */
const css=`
.foot-legal{max-width:1180px;margin:0 auto 12px;display:flex;flex-wrap:wrap;gap:14px 20px;align-items:center;justify-content:center;text-align:left}
.lr-badge{display:block;background:#fff;border:1px solid var(--line);border-radius:12px;padding:6px 10px;line-height:0;box-shadow:var(--shadow)}
.lr-badge img{width:132px;height:auto}
.foot-id{font-size:12.5px;color:var(--muted);line-height:1.5}
.foot-id b{color:var(--ink)}
.foot-links{display:flex;flex-wrap:wrap;gap:6px 14px;justify-content:center;width:100%}
.foot-links a,.foot-links button{font-size:13px;font-weight:600;color:var(--ink);text-decoration:underline;text-underline-offset:3px;background:none;border:0;padding:6px 0;cursor:pointer}
.legal-back{display:inline-flex;align-items:center;gap:6px;font-weight:700;text-decoration:none;color:var(--brand);margin:4px 0 12px;min-height:44px}
.lg-doc{max-width:760px;background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:20px 18px 24px;box-shadow:var(--shadow);margin-bottom:24px}
.lg-doc h1{font-family:var(--font-display);font-weight:800;font-size:clamp(30px,7vw,42px);line-height:.95;text-transform:uppercase;margin:4px 0 6px}
.lg-doc h2{font-family:var(--font-display);font-weight:700;font-size:21px;text-transform:uppercase;letter-spacing:.02em;margin:22px 0 6px}
.lg-doc p,.lg-doc li{font-size:15px;line-height:1.55;max-width:68ch}
.lg-doc ul{padding-left:20px;margin:6px 0}
.lg-doc li{margin:4px 0}
.lg-doc a{color:var(--brand);font-weight:600}
.lg-kick{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--brand);margin:0}
.lg-ver{font-size:13px;color:var(--muted);margin:0}
.lg-table{overflow-x:auto;margin:8px 0}
.lg-table table{border-collapse:collapse;width:100%;font-size:14px}
.lg-table th,.lg-table td{border:1px solid var(--line);padding:8px;text-align:left;vertical-align:top}
.lg-table thead th{background:var(--brand);color:#fff}
.lg-table tbody th{background:var(--bg);width:36%}
.lg-inline{font:inherit;font-weight:700;color:var(--brand);background:none;border:0;padding:0;text-decoration:underline;cursor:pointer}
.lr-head{display:flex;gap:16px;align-items:center;flex-wrap:wrap;margin:12px 0 4px}
.lr-head img{background:#fff;border-radius:10px;border:1px solid var(--line);padding:4px}
.lr-form fieldset{border:1px solid var(--line);border-radius:12px;padding:12px 14px 14px;margin:14px 0;display:flex;flex-direction:column;gap:10px}
.lr-form legend{font-weight:800;font-size:14px;padding:0 6px}
.lr-form label{display:flex;flex-direction:column;gap:4px;font-size:13px;font-weight:600;color:var(--muted)}
.lr-form input:not([type=checkbox]):not([type=radio]),.lr-form select,.lr-form textarea{font-size:16px;color:var(--ink);border:1px solid var(--line);background:var(--bg);border-radius:10px;padding:10px;width:100%}
.lr-form textarea{resize:vertical}
.lr-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}
.lr-check,.lr-radio{flex-direction:row!important;align-items:flex-start;gap:10px!important;color:var(--ink)!important;font-weight:500!important;font-size:14px!important}
.lr-check input,.lr-radio input{width:20px;height:20px;flex:none;margin-top:1px;accent-color:var(--brand)}
.lr-tipo{display:flex;flex-direction:column;gap:8px}
.lr-note{font-size:12.5px;color:var(--muted)}
.lr-send{width:100%;min-height:50px;font-size:16px}
.lr-copy h2{margin-top:6px}
.lr-acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
.lr-wa{margin:6px 0}
.cs-box{border:1px solid var(--line);background:var(--bg);border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:8px}
.cs-box.done{padding:10px 12px}
.cs-t{margin:0;font-weight:800;font-size:14px;color:var(--ink)}
.cs-row{display:flex;gap:10px;align-items:flex-start;font-size:14px;line-height:1.4;cursor:pointer;color:var(--ink)}
.cs-row input{width:22px;height:22px;flex:none;margin:0;accent-color:var(--brand)}
.cs-row a,.cs-ok a{color:var(--brand);font-weight:700}
.cs-row.opt{color:var(--muted)}
.cs-err{margin:0;color:var(--brand);font-weight:700;font-size:13px}
.cs-ok{margin:0;font-size:13px;color:var(--ok);font-weight:600}
.cs-box.shake{animation:csShake 360ms ease}
@keyframes csShake{0%,100%{transform:none}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
.cs-gate{position:fixed;inset:0;z-index:95;background:var(--scrim);display:flex;align-items:flex-end;justify-content:center;padding:16px}
.cs-card{background:var(--surface);border-radius:20px;padding:18px;width:min(520px,100%);display:flex;flex-direction:column;gap:12px;box-shadow:0 20px 60px rgba(0,0,0,.35);margin-bottom:env(safe-area-inset-bottom)}
.cs-card h3{font-family:var(--font-display);font-weight:800;font-size:26px;text-transform:uppercase;margin:0}
.cs-actions{display:grid;grid-template-columns:1fr auto;gap:8px}
@media (min-width:640px){.cs-gate{align-items:center}}
.ck-bar{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(var(--tabbar-h) + env(safe-area-inset-bottom) + 10px);z-index:70;width:min(720px,calc(100% - 20px));background:var(--surface);color:var(--ink);border:1px solid var(--line);border-radius:16px;padding:12px 14px;box-shadow:0 14px 40px rgba(0,0,0,.28);display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.ck-bar p{margin:0;font-size:13.5px;line-height:1.45;flex:1 1 300px}
.ck-bar a{color:var(--brand);font-weight:700}
.ck-btns{display:flex;gap:8px;flex:none}
@media print{body *{visibility:hidden!important}#lrCopy,#lrCopy *{visibility:visible!important}#lrCopy{position:absolute;left:0;top:0;width:100%;color:#000}.lr-acts{display:none!important}}
`;
const s=document.createElement("style"); s.textContent=css; document.head.appendChild(s);

/* Al cargar: aviso de cookies y envío de registros pendientes */
function init(){ avisoCookies(false); vaciar(); }
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init); else init();

window.MMLegal={CFG,VIEWS,show,consentBlock,consentimiento,avisoCookies};
})();
