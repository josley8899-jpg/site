import { createClient } from '@supabase/supabase-js'
import './style.css'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY
const sb = url && key ? createClient(url,key) : null

const statuses=['AGENDADO','CONFIRMADO','RECEBIDO','EM DIAGNÓSTICO','AGUARDANDO ORÇAMENTO','AGUARDANDO AUTORIZAÇÃO','EM SERVIÇO','AGUARDANDO PEÇA/FERRAMENTA','EM CONFERÊNCIA','PRONTO','ENTREGUE','CANCELADO','NÃO COMPARECEU']
let clientes=[], veiculos=[], agendamentos=[], os=[], mecanicos=[]
let user=null

const app=document.querySelector('#app')
function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function shell(){app.innerHTML=`
<header><b>OFICINA <span>SHINERAY</span></b><span id="user"></span></header>
<div class="layout"><aside>
<button data-p="dashboard">📊 Painel</button><button data-p="clientes">👤 Clientes e veículos</button>
<button data-p="agendamentos">📅 Agendamentos</button><button data-p="os">🔧 O.S.</button><button data-p="dia">📋 Agenda do dia</button>
<button data-p="config">⚙️ Configurações</button><button id="logout">Sair</button></aside><main id="content"></main></div>`}
async function load(){
 if(!sb){login();return}
 const {data:{session}}=await sb.auth.getSession()
 if(!session){login();return}
 user=session.user;shell();document.querySelector('#user').textContent=user.email
 document.querySelectorAll('aside button[data-p]').forEach(b=>b.onclick=()=>route(b.dataset.p))
 document.querySelector('#logout').onclick=async()=>{await sb.auth.signOut();login()}
 await refresh();route('dashboard')
}
function login(){app.innerHTML=`<div class="login"><div class="box"><h1>OFICINA <span>SHINERAY</span></h1><p>Versão 2 — acesso multiusuário</p><input id="email" placeholder="E-mail"><input id="pass" type="password" placeholder="Senha"><button id="login">Entrar</button><div id="msg"></div></div></div>`;document.querySelector('#login').onclick=async()=>{if(!sb){msg.textContent='Configure o .env com as credenciais do Supabase.';return}const {error}=await sb.auth.signInWithPassword({email:email.value,password:pass.value});if(error)msg.textContent=error.message;else load()}}
async function refresh(){
 const q=async(t)=>{const r=await sb.from(t).select('*');return r.data||[]}
 clientes=await q('clientes');veiculos=await q('veiculos');agendamentos=await q('v_agendamentos');os=await q('ordens_servico');mecanicos=await q('mecanicos')
}
function route(p){
 const c=document.querySelector('#content')
 if(p==='dashboard') c.innerHTML=dashboard()
 if(p==='clientes') c.innerHTML=clientesPage()
 if(p==='agendamentos') c.innerHTML=agendaPage()
 if(p==='os') c.innerHTML=osPage()
 if(p==='dia') c.innerHTML=dayPage()
 if(p==='config') c.innerHTML=configPage()
 bind(p)
}
function dashboard(){const d=new Date().toISOString().slice(0,10),a=agendamentos.filter(x=>x.data===d),cap=8,p=(a.length/cap*100).toFixed(1)
return `<h1>Painel de Gestão</h1><div class="cards">${[['Agendamentos hoje',a.length],['Em serviço',os.filter(x=>x.status==='EM SERVIÇO').length],['Prontas',os.filter(x=>x.status==='PRONTO').length],['Entregues',os.filter(x=>x.status==='ENTREGUE').length],['Aguardando peça',os.filter(x=>x.impedimento==='Falta de peça').length],['Atrasadas',os.filter(x=>x.previsao_entrega&&new Date(x.previsao_entrega)<new Date()&&!['ENTREGUE','CANCELADO'].includes(x.status)).length]].map(x=>`<div class="card"><small>${x[0]}</small><strong>${x[1]}</strong></div>`).join('')}</div><div class="panel"><b>Capacidade × Demanda</b><p>Capacidade: ${cap} | Demanda: ${a.length} | Ocupação: ${p}%</p><span class="badge ${a.length>cap?'red':'green'}">${a.length>cap?'ACIMA DA CAPACIDADE':'DENTRO DA CAPACIDADE'}</span></div>`}
function clientesPage(){return `<h1>Clientes e Veículos</h1><div class="panel"><h3>Novo cliente</h3><div class="grid"><input id="cn" placeholder="Nome *"><input id="cd" placeholder="CPF/CNPJ"><input id="cw" placeholder="WhatsApp"><input id="ce" placeholder="E-mail"><input id="cend" placeholder="Endereço"></div><h3>Veículo</h3><div class="grid"><input id="cp" placeholder="Placa *"><input id="cm" placeholder="Marca"><input id="cmo" placeholder="Modelo"><input id="cy" placeholder="Ano" type="number"></div><button id="saveClient">Cadastrar</button><div id="msg"></div></div><div class="panel"><table><tr><th>Cliente</th><th>WhatsApp</th><th>Placa</th><th>Veículo</th><th>Ano</th></tr>${veiculos.map(v=>{let c=clientes.find(x=>x.id===v.cliente_id)||{};return `<tr><td>${esc(c.nome)}</td><td>${esc(c.whatsapp)}</td><td><b>${esc(v.placa)}</b></td><td>${esc(v.marca)} ${esc(v.modelo)}</td><td>${v.ano||''}</td></tr>`}).join('')}</table></div>`}
function agendaPage(){
return `<h1>Agendamentos</h1>
<div class="panel">
<div class="grid">
<input id="ad" type="date">
<input id="ah" type="time">
<select id="ap">
<option value="">Placa</option>
${veiculos.map(v=>`<option value="${v.id}">${v.placa}</option>`).join('')}
</select>
<input id="acl" placeholder="Cliente" readonly>
<input id="aw" placeholder="WhatsApp" readonly>
<input id="am" placeholder="Marca" readonly>
<input id="amo" placeholder="Modelo" readonly>
<input id="as" placeholder="Serviço">
<select id="ast">
${statuses.map(s=>`<option>${s}</option>`).join('')}
</select>
</div>
<button id="saveAppt">Salvar</button>
</div>

<div class="panel">
<table>
<tr>
<th>Data</th>
<th>Hora</th>
<th>Placa</th>
<th>Marca</th>
<th>Modelo</th>
<th>Cliente</th>
<th>Serviço</th>
<th>Observações</th>
<th>Status</th>
<th>Ação</th>
</tr>

${agendamentos.map(a=>{
  const v=veiculos.find(v=>v.id===a.veiculo_id)||{};
  return `
<tr>
<td>${a.data}</td>
<td>${a.horario}</td>
<td>${esc(a.placa)}</td>
<td>${esc(v.marca)}</td>
<td>${esc(v.modelo)}</td>
<td>${esc(a.cliente_nome)}</td>
<td>${esc(a.servico)}</td>
<td>${esc(a.observacoes||'')}</td>
<td>
<select id="status-appt-${a.id}">
${statuses.map(s=>`<option value="${s}" ${s===a.status?'selected':''}>${s}</option>`).join('')}
</select>
</td>
<td>
<button class="saveApptStatus" data-id="${a.id}">Salvar</button>
</td>
</tr>
`;
}).join('')}
</select>
</td>

<td>
<button class="saveApptStatus" data-id="${a.id}">
Salvar
</button>
</td>
</tr>
`).join('')}

</table>
</div>`
}function osPage(){
return `<h1>Controle de Serviços / O.S.</h1>
<div class="panel">
<div class="grid">
<select id="op">
<option value="">Placa</option>
${veiculos.map(v=>`<option value="${v.id}">${v.placa}</option>`).join('')}
</select>

<input id="ocl" readonly placeholder="Cliente">

<input id="osv" placeholder="Serviço">

<select id="ost">
${statuses.map(s=>`<option>${s}</option>`).join('')}
</select>

<input id="oi" placeholder="Impedimento">

<input id="oprazo" type="datetime-local">
</div>

<button id="saveOs">Salvar O.S.</button>
</div>

<div class="panel">
<table>
<tr>
<th>Nº</th>
<th>Placa</th>
<th>Cliente</th>
<th>Serviço</th>
<th>Status</th>
<th>Impedimento</th>
<th>Ação</th>
</tr>

${os.map(x=>{
const v=veiculos.find(v=>v.id===x.veiculo_id)||{};
const c=clientes.find(c=>c.id===x.cliente_id)||{};

return `
<tr>
<td>${x.numero||''}</td>
<td>${esc(v.placa)}</td>
<td>${esc(c.nome)}</td>
<td>${esc(x.servico)}</td>

<td>
<select class="status-os" data-id="${x.id}">
${statuses.map(s=>`
<option value="${esc(s)}" ${x.status===s?'selected':''}>
${esc(s)}
</option>
`).join('')}
</select>
</td>

<td>${esc(x.impedimento)}</td>

<td>
<button class="update-status" data-id="${x.id}">
Salvar
</button>
</td>
</tr>
`
}).join('')}

</table>
</div>`
}
function dayPage(){
  const d=new Date().toISOString().slice(0,10);

  return `
    <h1>Agenda do Dia</h1>

    <div class="panel">
      <input id="day" type="date" value="${d}">
      <div id="dayt"></div>
    </div>
  `;
}

function configPage(){
  return `
    <h1>Configurações</h1>

    <div class="panel">
      <h3>Configurações do sistema</h3>

      <p>
        Usuário conectado:
        <b>${esc(user?.email||'')}</b>
      </p>

      <p>
        Perfis, permissões, mecânicos, serviços,
        prioridades e parâmetros ficam no banco Supabase.
      </p>
    </div>
  `;
}

function bind(p){
 if(p==='clientes')document.querySelector('#saveClient').onclick=async()=>{const nome=cn.value.trim(),placa=cp.value.trim().toUpperCase();if(!nome||!placa)return msg.textContent='Nome e placa são obrigatórios.';const {data:c,error:e}=await sb.from('clientes').insert({nome,cpf_cnpj:cd.value,whatsapp:cw.value,email:ce.value,endereco:cend.value}).select().single();if(e)return msg.textContent=e.message;const {error:e2}=await sb.from('veiculos').insert({cliente_id:c.id,placa,marca:cm.value,modelo:cmo.value,ano:cy.value?Number(cy.value):null});if(e2){await sb.from('clientes').delete().eq('id',c.id);return msg.textContent=e2.message}await refresh();route('clientes')}
if(p==='agendamentos'){
  ap.onchange=()=>{
  const v=veiculos.find(v=>v.id===ap.value),
  c=clientes.find(c=>c.id===v?.cliente_id);

  acl.value=c?.nome||'';
  aw.value=c?.whatsapp||'';
  am.value=v?.marca||'';
  amo.value=v?.modelo||'';
};

  saveAppt.onclick=async()=>{
    const {error}=await sb.from('agendamentos').insert({
      veiculo_id:ap.value,
      data:ad.value,
      horario:ah.value,
      servico:as.value,
      status:ast.value
    });

    if(error)return alert(error.message);

    await refresh();
    route('agendamentos');
  };

  document.querySelectorAll('.saveApptStatus').forEach(btn=>{
    btn.onclick=async()=>{
      const id=btn.dataset.id;
      const select=document.querySelector(`#status-appt-${id}`);
      const status=select.value;

      const {error}=await sb
        .from('agendamentos')
        .update({status})
        .eq('id',id);

      if(error){
        alert('Erro ao atualizar status: '+error.message);
        return;
      }

      await refresh();
      route('agendamentos');
    };
  });
}if(p==='os'){

document.querySelector('#op').onchange=()=>{
const v=veiculos.find(v=>v.id===document.querySelector('#op').value);
const c=clientes.find(c=>c.id===v?.cliente_id);

document.querySelector('#ocl').value=c?.nome||'';
};

document.querySelector('#saveOs').onclick=async()=>{

const v=veiculos.find(v=>v.id===document.querySelector('#op').value);
const c=clientes.find(c=>c.id===v?.cliente_id);

if(!v||!c){
alert('Selecione uma placa.');
return;
}

const {error}=await sb
.from('ordens_servico')
.insert({
cliente_id:c.id,
veiculo_id:v.id,
servico:document.querySelector('#osv').value,
status:document.querySelector('#ost').value,
impedimento:document.querySelector('#oi').value,
previsao_entrega:document.querySelector('#oprazo').value||null
});

if(error){
alert(error.message);
return;
}

await refresh();
route('os');
};


document.querySelectorAll('.update-status').forEach(btn=>{

btn.onclick=async()=>{

const id=btn.dataset.id;

const select=document.querySelector(
`.status-os[data-id="${id}"]`
);

const novoStatus=select.value;

const {error}=await sb
.from('ordens_servico')
.update({
status:novoStatus
})
.eq('id',id);

if(error){
alert('Erro ao atualizar status: '+error.message);
return;
}

await refresh();
route('os');

};

});

}

if(p==='dia'){
const render=()=>{
const day=document.querySelector('#day')
const dayt=document.querySelector('#dayt')

if(!day || !dayt)return

const d=day.value
const a=agendamentos
.filter(x=>x.data===d)
.sort((x,y)=>x.horario.localeCompare(y.horario))

dayt.innerHTML=`
<table>
<tr>
<th>Hora</th>
<th>Cliente</th>
<th>Placa</th>
<th>Serviço</th>
<th>Status</th>
<th>Ação</th>
</tr>

${a.map(x=>`
<tr>
<td>${x.horario}</td>
<td>${esc(x.cliente_nome)}</td>
<td>${esc(x.placa)}</td>
<td>${esc(x.servico)}</td>

<td>
<select class="dayStatus" data-id="${x.id}">
${statuses.map(s=>`
<option value="${s}" ${s===x.status?'selected':''}>${s}</option>
`).join('')}
</select>
</td>

<td>
<button class="saveDayStatus" data-id="${x.id}">Salvar</button>
</td>

</tr>
`).join('')}

</table>
`

document.querySelectorAll('.saveDayStatus').forEach(btn=>{
btn.onclick=async()=>{
const id=btn.dataset.id
const select=document.querySelector(`.dayStatus[data-id="${id}"]`)
const status=select.value

const {error}=await sb
.from('agendamentos')
.update({status})
.eq('id',id)

if(error){
alert('Erro ao atualizar status: '+error.message)
return
}

await refresh()
route('dia')
}
})
}

document.querySelector('#day').onchange=render
render()
}
}
load()
