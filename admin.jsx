import React, {useState, useEffect} from 'react';

export default function AdminPage() {
  const [logged, setLogged] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ads, setAds] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(()=>{ checkSession(); fetchAds(); fetchStats(); }, []);

  async function checkSession(){
    const r = await fetch('/api/check-session');
    const j = await r.json();
    setLogged(j.logged);
  }

  async function fetchAds(){
    const r = await fetch('/api/ads');
    const j = await r.json();
    setAds(j.ads || []);
  }

  async function fetchStats(){
    const r = await fetch('/api/admin/stats');
    const j = await r.json();
    if (j.ok) setStats(j.rows || []);
  }

  async function register(e){
    e.preventDefault();
    const r = await fetch('/api/admin/register', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email,password})});
    const j = await r.json();
    if (j.ok) alert('Admin criado. Faça login.'); else alert('Erro');
  }

  async function login(e){
    e.preventDefault();
    const r = await fetch('/api/admin-login', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email,password})});
    const j = await r.json();
    if(j.ok) { setLogged(true); fetchAds(); fetchStats(); } else alert('Credenciais inválidas');
  }

  async function logout(){
    await fetch('/api/admin-logout');
    setLogged(false);
  }

  async function deleteAd(id){
    if(!confirm('Apagar anúncio?')) return;
    const r = await fetch('/api/admin/delete-ad', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({id})});
    const j = await r.json();
    if(j.ok) fetchAds(); else alert('Erro');
  }

  async function approveAd(id){
    const r = await fetch('/api/admin/approve-ad', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({id})});
    const j = await r.json();
    if(j.ok) fetchAds(); else alert('Erro');
  }

  async function createConnect(){
    const r = await fetch('/api/create-connect-account', {method:'POST'});
    const j = await r.json();
    if(j.url) window.location = j.url; else alert('Erro');
  }

  async function makeTransfer(e){
    e.preventDefault();
    const form = e.target;
    const amount = form.amount.value;
    const dest = form.dest.value;
    const r = await fetch('/api/admin/transfer', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({amount_cents: parseInt(amount), connectedAccountId: dest})});
    const j = await r.json();
    if(j.ok) alert('Transfer realizado'); else alert('Erro: '+(j.error||''));
  }

  if(!logged) return (
    <div style={{padding:20}}>
      <h2>Admin — Registre ou Faça Login</h2>
      <form onSubmit={register} style={{marginBottom:12}}>
        <input placeholder='email' value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder='senha' value={password} onChange={e=>setPassword(e.target.value)} type='password' />
        <button type='submit'>Registrar admin</button>
      </form>
      <form onSubmit={login}>
        <input placeholder='email' value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder='senha' value={password} onChange={e=>setPassword(e.target.value)} type='password' />
        <button type='submit'>Login</button>
      </form>
    </div>
  );

  return (
    <div style={{padding:20}}>
      <h2>Painel Admin</h2>
      <button onClick={logout}>Logout</button>
      <h3>Conectar conta Stripe</h3>
      <button onClick={createConnect}>Conectar Stripe</button>

      <h3 style={{marginTop:20}}>Estatísticas</h3>
      <table border='1' cellPadding='6'>
        <thead><tr><th>ID</th><th>Título</th><th>Pago</th><th>Impressões</th><th>Receita ($)</th></tr></thead>
        <tbody>
          {stats.map(s=> (
            <tr key={s.id}><td>{s.id}</td><td>{s.title}</td><td>{s.paid? 'Sim':'Não'}</td><td>{s.impressions}</td><td>{s.revenue}</td></tr>
          ))}
        </tbody>
      </table>

      <h3 style={{marginTop:20}}>Anúncios</h3>
      <table border='1' cellPadding='6'>
        <thead><tr><th>ID</th><th>Título</th><th>URL</th><th>Pago</th><th>Ações</th></tr></thead>
        <tbody>
          {ads.map(ad => (
            <tr key={ad.id}>
              <td>{ad.id}</td>
              <td>{ad.title}</td>
              <td><a href={ad.url} target='_blank' rel='noreferrer'>{ad.url}</a></td>
              <td>{ad.paid ? 'Sim' : 'Não'}</td>
              <td>
                <button onClick={()=>approveAd(ad.id)}>Aprovar</button>
                <button onClick={()=>deleteAd(ad.id)}>Apagar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{marginTop:20}}>Fazer transferência para conta conectada</h3>
      <form onSubmit={makeTransfer}>
        <label>Amount (cents): <input name='amount' /></label>
        <label>Connected Account ID: <input name='dest' /></label>
        <button type='submit'>Transferir</button>
      </form>
    </div>
  );
}
