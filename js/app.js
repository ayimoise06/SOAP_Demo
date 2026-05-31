// ── TABS ──
function showTab(name) {
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('tab-'+name).classList.add('active');
  event.currentTarget.classList.add('active');
}

// ── ANATOMY DETAIL ──
const details = {
  envelope: {
    title: '&lt;soap:Envelope&gt; — Élément Racine',
    color: 'var(--blue)',
    content: `<strong>Rôle :</strong> Élément XML racine obligatoire de tout message SOAP. Identifie le document comme message SOAP et définit les espaces de noms utilisés.<br><br>
<strong>Attributs clés :</strong><br>
• <code style="color:var(--codecl)">xmlns:soap</code> — Déclare l'espace de noms SOAP (W3C)<br>
• <code style="color:var(--codecl)">soap:encodingStyle</code> — Règles d'encodage des données<br><br>
<strong>SOAP 1.1 :</strong> <code style="color:var(--codey)">http://schemas.xmlsoap.org/soap/envelope/</code><br>
<strong>SOAP 1.2 (W3C) :</strong> <code style="color:var(--codey)">http://www.w3.org/2003/05/soap-envelope</code><br><br>
<strong>Analogie :</strong> C'est l'enveloppe postale — elle identifie le contenu comme un courrier SOAP.`,
  },
  header: {
    title: '&lt;soap:Header&gt; — En-tête (métadonnées)',
    color: 'var(--teal)',
    content: `<strong>Rôle :</strong> Élément optionnel contenant les métadonnées du message. Si présent, il doit être le <strong>premier enfant</strong> de l'Envelope.<br><br>
<strong>Contenus typiques :</strong><br>
• 🔒 <strong>WS-Security</strong> — Token d'authentification, chiffrement<br>
• 🗺️ <strong>WS-Addressing</strong> — Adresses source/destination<br>
• ⚛️ <strong>WS-AtomicTransaction</strong> — Contexte de transaction<br>
• 📨 <strong>WS-ReliableMessaging</strong> — Numéros de séquence<br><br>
<strong>Analogie :</strong> Les informations d'acheminement sur l'enveloppe — destinataire, expéditeur, recommandé.`,
  },
  body: {
    title: '&lt;soap:Body&gt; — Corps du message',
    color: 'var(--green)',
    content: `<strong>Rôle :</strong> Élément <strong>obligatoire</strong> contenant la charge utile (payload) du message — l'appel de procédure distante ou le document de données.<br><br>
<strong>Deux styles :</strong><br>
• <strong>RPC style</strong> — Appel de procédure avec paramètres nommés<br>
• <strong>Document style</strong> — Échange de documents XML structurés<br><br>
<strong>Validation :</strong> Le contenu du Body est typiquement validé par un XSD défini dans le WSDL.<br><br>
<strong>Analogie :</strong> La lettre elle-même — le contenu réel de la communication.`,
  },
  fault: {
    title: '&lt;soap:Fault&gt; — Gestion des erreurs',
    color: 'var(--red)',
    content: `<strong>Rôle :</strong> Élément optionnel dans le Body signalant une erreur de traitement. Structure standardisée pour la gestion d'erreurs inter-systèmes.<br><br>
<strong>Codes SOAP 1.2 :</strong><br>
• <code style="color:var(--coderd)">soap:Sender</code> — Erreur côté client (données invalides)<br>
• <code style="color:var(--coderd)">soap:Receiver</code> — Erreur côté serveur (panne)<br>
• <code style="color:var(--coderd)">soap:VersionMismatch</code> — Version incompatible<br><br>
<strong>Éléments enfants :</strong> Code, Reason (message lisible), Detail (info spécifique à l'app).<br><br>
<strong>Avantage :</strong> Toute erreur est structurée en XML — pas de codes HTTP à interpréter.`,
  }
};

function showLayer(id) {
  const d = details[id];
  document.getElementById('anatomy-detail').innerHTML = `
    <div class="anatomy-detail-title" style="color:${d.color}">${d.title}</div>
    <div style="font-size:12.5px;color:var(--muted);line-height:1.7">${d.content}</div>`;
  document.querySelectorAll('.anatomy-layer').forEach(l=>l.classList.remove('active-layer'));
}

// ── SIMULATOR ──
const scenarios = {
  solde: {
    p1label:"Numéro de compte", p2label:"Devise",
    p1default:"TG53TG8199802100040000000000", p2default:"XOF",
    explain: "🏦 <strong>Service bancaire : ConsulterSolde</strong><br>Le client envoie son numéro de compte et la devise souhaitée. Le serveur retourne le solde en temps réel. WS-Security protège les credentials dans le Header."
  },
  virement: {
    p1label:"Compte débiteur", p2label:"Montant (XOF)",
    p1default:"TG53TG8199802100040000000000", p2default:"150000",
    explain: "💸 <strong>Virement SOAP</strong><br>Opération critique nécessitant WS-AtomicTransaction — si la Banque B est indisponible lors du crédit, le débit de la Banque A est automatiquement annulé (rollback). PCI-DSS exige WS-Security."
  },
  meteo: {
    p1label:"Ville", p2label:"Unité",
    p1default:"Lomé", p2default:"Celsius",
    explain: "🌤 <strong>Service météo SOAP</strong><br>Exemple pédagogique classique pour comprendre SOAP. Simple : pas besoin de sécurité forte, mais illustre parfaitement la structure Envelope/Body."
  },
  patient: {
    p1label:"ID Patient", p2label:"Type document",
    p1default:"PAT-2025-00842", p2default:"Consultation",
    explain: "🏥 <strong>HL7 v3 — Dossier patient</strong><br>Standard médical mondial. WS-Security obligatoire (HIPAA). Opération stateful : session maintenue pendant toute la consultation. Un médecin accède → prescrit → confirme dans la même session sécurisée."
  },
  taxe: {
    p1label:"NIF (Numéro Fiscal)", p2label:"Exercice",
    p1default:"TG-2025-NIF-00459", p2default:"2025",
    explain: "🏛 <strong>Déclaration fiscale gouvernementale</strong><br>Le WSDL garantit que le format des données est exact — aucun système client ne peut envoyer une déclaration malformée. WS-Security authentifie le contribuable. Les erreurs retournent un Fault structuré."
  }
};

function updateScenario() {
  const sc = scenarios[document.getElementById('scenario').value];
  document.getElementById('param1').value = sc.p1default;
  document.getElementById('param1').placeholder = sc.p1label;
  document.getElementById('param2').value = sc.p2default;
  document.getElementById('param2').placeholder = sc.p2label;
  document.getElementById('explanation').innerHTML = sc.explain;
  document.getElementById('request-output').innerHTML = '<span style="color:var(--muted)">← Cliquez sur "Envoyer" pour générer le message SOAP</span>';
  document.getElementById('response-output').innerHTML = '<span style="color:var(--muted)">← La réponse apparaîtra ici</span>';
}

function buildRequest(scenario, p1, p2, security) {
  const ns = 'http://www.w3.org/2003/05/soap-envelope';
  const ts = new Date().toISOString();
  let header = '';
  if(security !== 'none') {
    header = `\n  <span class="c-tag">&lt;soap:Header&gt;</span>
    <span class="c-tag">&lt;wsse:Security</span> <span class="c-attr">xmlns:wsse</span>=<span class="c-val">"http://docs.oasis-open.org/wss/secext-1.0.xsd"</span><span class="c-tag">&gt;</span>
      <span class="c-tag">&lt;wsse:UsernameToken</span> <span class="c-attr">wsu:Id</span>=<span class="c-val">"UT-${Date.now()}"</span><span class="c-tag">&gt;</span>
        <span class="c-tag">&lt;wsse:Username&gt;</span><span class="c-str">koffi.ama@ul.tg</span><span class="c-tag">&lt;/wsse:Username&gt;</span>
        <span class="c-tag">&lt;wsse:Password</span> <span class="c-attr">Type</span>=<span class="c-val">"PasswordDigest"</span><span class="c-tag">&gt;</span><span class="c-str">••••••••</span><span class="c-tag">&lt;/wsse:Password&gt;</span>
        <span class="c-tag">&lt;wsu:Created&gt;</span><span class="c-str">${ts}</span><span class="c-tag">&lt;/wsu:Created&gt;</span>
      <span class="c-tag">&lt;/wsse:UsernameToken&gt;</span>
    <span class="c-tag">&lt;/wsse:Security&gt;</span>
  <span class="c-tag">&lt;/soap:Header&gt;</span>`;
  }

  const bodies = {
    solde: `    <span class="c-tag">&lt;bank:ConsulterSolde</span> <span class="c-attr">xmlns:bank</span>=<span class="c-val">"http://banque.tg/services/v2"</span><span class="c-tag">&gt;</span>
      <span class="c-tag">&lt;bank:NumeroCompte&gt;</span><span class="c-str">${p1}</span><span class="c-tag">&lt;/bank:NumeroCompte&gt;</span>
      <span class="c-tag">&lt;bank:Devise&gt;</span><span class="c-str">${p2}</span><span class="c-tag">&lt;/bank:Devise&gt;</span>
    <span class="c-tag">&lt;/bank:ConsulterSolde&gt;</span>`,
    virement: `    <span class="c-tag">&lt;bank:InitierVirement</span> <span class="c-attr">xmlns:bank</span>=<span class="c-val">"http://banque.tg/services/v2"</span><span class="c-tag">&gt;</span>
      <span class="c-tag">&lt;bank:CompteDebiteur&gt;</span><span class="c-str">${p1}</span><span class="c-tag">&lt;/bank:CompteDebiteur&gt;</span>
      <span class="c-tag">&lt;bank:CompteCrediteur&gt;</span><span class="c-str">CI0501000201789456300152</span><span class="c-tag">&lt;/bank:CompteCrediteur&gt;</span>
      <span class="c-tag">&lt;bank:Montant&gt;</span><span class="c-str">${p2}</span><span class="c-tag">&lt;/bank:Montant&gt;</span>
      <span class="c-tag">&lt;bank:Devise&gt;</span><span class="c-str">XOF</span><span class="c-tag">&lt;/bank:Devise&gt;</span>
      <span class="c-tag">&lt;bank:Reference&gt;</span><span class="c-str">VIR-${Date.now()}</span><span class="c-tag">&lt;/bank:Reference&gt;</span>
    <span class="c-tag">&lt;/bank:InitierVirement&gt;</span>`,
    meteo: `    <span class="c-tag">&lt;weather:GetMeteo</span> <span class="c-attr">xmlns:weather</span>=<span class="c-val">"http://meteo.tg/services"</span><span class="c-tag">&gt;</span>
      <span class="c-tag">&lt;weather:Ville&gt;</span><span class="c-str">${p1}</span><span class="c-tag">&lt;/weather:Ville&gt;</span>
      <span class="c-tag">&lt;weather:Unite&gt;</span><span class="c-str">${p2}</span><span class="c-tag">&lt;/weather:Unite&gt;</span>
    <span class="c-tag">&lt;/weather:GetMeteo&gt;</span>`,
    patient: `    <span class="c-tag">&lt;hl7:GetDossierPatient</span> <span class="c-attr">xmlns:hl7</span>=<span class="c-val">"urn:hl7-org:v3"</span><span class="c-tag">&gt;</span>
      <span class="c-tag">&lt;hl7:PatientId&gt;</span><span class="c-str">${p1}</span><span class="c-tag">&lt;/hl7:PatientId&gt;</span>
      <span class="c-tag">&lt;hl7:TypeDocument&gt;</span><span class="c-str">${p2}</span><span class="c-tag">&lt;/hl7:TypeDocument&gt;</span>
      <span class="c-tag">&lt;hl7:MedecinId&gt;</span><span class="c-str">MED-TG-00291</span><span class="c-tag">&lt;/hl7:MedecinId&gt;</span>
    <span class="c-tag">&lt;/hl7:GetDossierPatient&gt;</span>`,
    taxe: `    <span class="c-tag">&lt;dgi:SoumettreDeclaration</span> <span class="c-attr">xmlns:dgi</span>=<span class="c-val">"http://dgi.tg/services"</span><span class="c-tag">&gt;</span>
      <span class="c-tag">&lt;dgi:NIF&gt;</span><span class="c-str">${p1}</span><span class="c-tag">&lt;/dgi:NIF&gt;</span>
      <span class="c-tag">&lt;dgi:Exercice&gt;</span><span class="c-str">${p2}</span><span class="c-tag">&lt;/dgi:Exercice&gt;</span>
      <span class="c-tag">&lt;dgi:TypeDeclaration&gt;</span><span class="c-str">TVA</span><span class="c-tag">&lt;/dgi:TypeDeclaration&gt;</span>
    <span class="c-tag">&lt;/dgi:SoumettreDeclaration&gt;</span>`
  };

  return `<span class="c-cmt">&lt;?xml version="1.0" encoding="UTF-8"?&gt;</span>
<span class="c-tag">&lt;soap:Envelope</span>
  <span class="c-attr">xmlns:soap</span>=<span class="c-val">"http://www.w3.org/2003/05/soap-envelope"</span>
  <span class="c-attr">soap:encodingStyle</span>=<span class="c-val">"http://www.w3.org/2003/05/soap-encoding"</span><span class="c-tag">&gt;</span>${header}
  <span class="c-tag">&lt;soap:Body&gt;</span>
${bodies[scenario]}
  <span class="c-tag">&lt;/soap:Body&gt;</span>
<span class="c-tag">&lt;/soap:Envelope&gt;</span>`;
}

function buildResponse(scenario, p1, p2) {
  const ts = new Date().toISOString();
  const responses = {
    solde: `<span class="c-cmt">&lt;?xml version="1.0" encoding="UTF-8"?&gt;</span>
<span class="c-tag">&lt;soap:Envelope</span> <span class="c-attr">xmlns:soap</span>=<span class="c-val">"http://www.w3.org/2003/05/soap-envelope"</span><span class="c-tag">&gt;</span>
  <span class="c-tag">&lt;soap:Body&gt;</span>
    <span class="c-tag">&lt;bank:ConsulterSoldeResponse</span> <span class="c-attr">xmlns:bank</span>=<span class="c-val">"http://banque.tg/services/v2"</span><span class="c-tag">&gt;</span>
      <span class="c-tag">&lt;bank:Solde&gt;</span><span class="c-ok">125 000.00</span><span class="c-tag">&lt;/bank:Solde&gt;</span>
      <span class="c-tag">&lt;bank:Devise&gt;</span><span class="c-str">${p2}</span><span class="c-tag">&lt;/bank:Devise&gt;</span>
      <span class="c-tag">&lt;bank:DateMaj&gt;</span><span class="c-str">${ts}</span><span class="c-tag">&lt;/bank:DateMaj&gt;</span>
      <span class="c-tag">&lt;bank:Statut&gt;</span><span class="c-ok">ACTIF</span><span class="c-tag">&lt;/bank:Statut&gt;</span>
    <span class="c-tag">&lt;/bank:ConsulterSoldeResponse&gt;</span>
  <span class="c-tag">&lt;/soap:Body&gt;</span>
<span class="c-tag">&lt;/soap:Envelope&gt;</span>`,
    virement: `<span class="c-tag">&lt;soap:Envelope</span> <span class="c-attr">xmlns:soap</span>=<span class="c-val">"http://www.w3.org/2003/05/soap-envelope"</span><span class="c-tag">&gt;</span>
  <span class="c-tag">&lt;soap:Body&gt;</span>
    <span class="c-tag">&lt;bank:VirementResponse</span> <span class="c-attr">xmlns:bank</span>=<span class="c-val">"http://banque.tg/services/v2"</span><span class="c-tag">&gt;</span>
      <span class="c-tag">&lt;bank:RefTransaction&gt;</span><span class="c-ok">TXN-${Date.now()}</span><span class="c-tag">&lt;/bank:RefTransaction&gt;</span>
      <span class="c-tag">&lt;bank:Statut&gt;</span><span class="c-ok">EXECUTED</span><span class="c-tag">&lt;/bank:Statut&gt;</span>
      <span class="c-tag">&lt;bank:Montant&gt;</span><span class="c-str">${p2} XOF</span><span class="c-tag">&lt;/bank:Montant&gt;</span>
      <span class="c-tag">&lt;bank:DateExecution&gt;</span><span class="c-str">${ts}</span><span class="c-tag">&lt;/bank:DateExecution&gt;</span>
      <span class="c-tag">&lt;bank:Message&gt;</span><span class="c-ok">Virement exécuté avec succès — WS-AT validé</span><span class="c-tag">&lt;/bank:Message&gt;</span>
    <span class="c-tag">&lt;/bank:VirementResponse&gt;</span>
  <span class="c-tag">&lt;/soap:Body&gt;</span>
<span class="c-tag">&lt;/soap:Envelope&gt;</span>`,
    meteo: `<span class="c-tag">&lt;soap:Envelope</span> <span class="c-attr">xmlns:soap</span>=<span class="c-val">"http://www.w3.org/2003/05/soap-envelope"</span><span class="c-tag">&gt;</span>
  <span class="c-tag">&lt;soap:Body&gt;</span>
    <span class="c-tag">&lt;weather:GetMeteoResponse</span> <span class="c-attr">xmlns:weather</span>=<span class="c-val">"http://meteo.tg/services"</span><span class="c-tag">&gt;</span>
      <span class="c-tag">&lt;weather:Ville&gt;</span><span class="c-str">${p1}</span><span class="c-tag">&lt;/weather:Ville&gt;</span>
      <span class="c-tag">&lt;weather:Temperature&gt;</span><span class="c-ok">34</span><span class="c-tag">&lt;/weather:Temperature&gt;</span>
      <span class="c-tag">&lt;weather:Unite&gt;</span><span class="c-str">${p2}</span><span class="c-tag">&lt;/weather:Unite&gt;</span>
      <span class="c-tag">&lt;weather:Conditions&gt;</span><span class="c-str">Ensoleillé, humidité 78%</span><span class="c-tag">&lt;/weather:Conditions&gt;</span>
      <span class="c-tag">&lt;weather:Vent&gt;</span><span class="c-str">18 km/h direction SW</span><span class="c-tag">&lt;/weather:Vent&gt;</span>
    <span class="c-tag">&lt;/weather:GetMeteoResponse&gt;</span>
  <span class="c-tag">&lt;/soap:Body&gt;</span>
<span class="c-tag">&lt;/soap:Envelope&gt;</span>`,
    patient: `<span class="c-tag">&lt;soap:Envelope</span> <span class="c-attr">xmlns:soap</span>=<span class="c-val">"http://www.w3.org/2003/05/soap-envelope"</span><span class="c-tag">&gt;</span>
  <span class="c-tag">&lt;soap:Body&gt;</span>
    <span class="c-tag">&lt;hl7:DossierPatientResponse</span> <span class="c-attr">xmlns:hl7</span>=<span class="c-val">"urn:hl7-org:v3"</span><span class="c-tag">&gt;</span>
      <span class="c-tag">&lt;hl7:PatientId&gt;</span><span class="c-str">${p1}</span><span class="c-tag">&lt;/hl7:PatientId&gt;</span>
      <span class="c-tag">&lt;hl7:Nom&gt;</span><span class="c-str">AMAVI Kossi</span><span class="c-tag">&lt;/hl7:Nom&gt;</span>
      <span class="c-tag">&lt;hl7:Age&gt;</span><span class="c-str">34</span><span class="c-tag">&lt;/hl7:Age&gt;</span>
      <span class="c-tag">&lt;hl7:GroupeSanguin&gt;</span><span class="c-str">O+</span><span class="c-tag">&lt;/hl7:GroupeSanguin&gt;</span>
      <span class="c-tag">&lt;hl7:Allergies&gt;</span><span class="c-str">Pénicilline</span><span class="c-tag">&lt;/hl7:Allergies&gt;</span>
      <span class="c-tag">&lt;hl7:DerniereDiag&gt;</span><span class="c-str">Paludisme simple — 2025-03-14</span><span class="c-tag">&lt;/hl7:DerniereDiag&gt;</span>
    <span class="c-tag">&lt;/hl7:DossierPatientResponse&gt;</span>
  <span class="c-tag">&lt;/soap:Body&gt;</span>
<span class="c-tag">&lt;/soap:Envelope&gt;</span>`,
    taxe: `<span class="c-tag">&lt;soap:Envelope</span> <span class="c-attr">xmlns:soap</span>=<span class="c-val">"http://www.w3.org/2003/05/soap-envelope"</span><span class="c-tag">&gt;</span>
  <span class="c-tag">&lt;soap:Body&gt;</span>
    <span class="c-tag">&lt;dgi:DeclarationResponse</span> <span class="c-attr">xmlns:dgi</span>=<span class="c-val">"http://dgi.tg/services"</span><span class="c-tag">&gt;</span>
      <span class="c-tag">&lt;dgi:NumeroRecepisse&gt;</span><span class="c-ok">DGI-TVA-${Date.now()}</span><span class="c-tag">&lt;/dgi:NumeroRecepisse&gt;</span>
      <span class="c-tag">&lt;dgi:Statut&gt;</span><span class="c-ok">ACCEPTEE</span><span class="c-tag">&lt;/dgi:Statut&gt;</span>
      <span class="c-tag">&lt;dgi:NIF&gt;</span><span class="c-str">${p1}</span><span class="c-tag">&lt;/dgi:NIF&gt;</span>
      <span class="c-tag">&lt;dgi:DateDepot&gt;</span><span class="c-str">${ts}</span><span class="c-tag">&lt;/dgi:DateDepot&gt;</span>
      <span class="c-tag">&lt;dgi:Message&gt;</span><span class="c-ok">Déclaration TVA ${p2} enregistrée — Aucune anomalie</span><span class="c-tag">&lt;/dgi:Message&gt;</span>
    <span class="c-tag">&lt;/dgi:DeclarationResponse&gt;</span>
  <span class="c-tag">&lt;/soap:Body&gt;</span>
<span class="c-tag">&lt;/soap:Envelope&gt;</span>`
  };
  return responses[scenario];
}

function setStatus(type, text, timing='') {
  const dot = document.getElementById('status-dot');
  dot.className = 'status-dot '+type;
  document.getElementById('status-text').textContent = text;
  document.getElementById('timing').textContent = timing;
}

async function sendSOAP() {
  const scenario = document.getElementById('scenario').value;
  const p1 = document.getElementById('param1').value || scenarios[scenario].p1default;
  const p2 = document.getElementById('param2').value || scenarios[scenario].p2default;
  const security = document.getElementById('security').value;
  const btn = document.getElementById('sendBtn');

  btn.innerHTML = '<span class="loader"></span> Envoi...';
  btn.className = 'sim-btn loading';
  setStatus('loading', 'Génération du message SOAP...', '');

  document.getElementById('request-output').innerHTML = buildRequest(scenario, p1, p2, security);
  document.getElementById('response-output').innerHTML = '<span style="color:var(--muted)">Traitement en cours...</span>';

  const sc = scenarios[scenario];
  document.getElementById('explanation').innerHTML = sc.explain;

  const delay = 800 + Math.random()*600;
  await new Promise(r=>setTimeout(r,delay));

  document.getElementById('response-output').innerHTML = buildResponse(scenario, p1, p2);

  const titleEl = document.getElementById('res-title');
  titleEl.innerHTML = '📥 Réponse du serveur <span class="pill pill-res">200 OK</span>';
  setStatus('success', `Requête SOAP traitée avec succès — ${scenario.toUpperCase()}`, `${Math.round(delay)}ms`);
  btn.innerHTML = '<span>▶</span> Envoyer requête SOAP';
  btn.className = 'sim-btn';
}

function simulateFault(type) {
  const faults = {
    sender: `<span class="c-tag">&lt;soap:Envelope</span> <span class="c-attr">xmlns:soap</span>=<span class="c-val">"http://www.w3.org/2003/05/soap-envelope"</span><span class="c-tag">&gt;</span>
  <span class="c-tag">&lt;soap:Body&gt;</span>
    <span class="c-err">&lt;soap:Fault&gt;</span>
      <span class="c-err">&lt;soap:Code&gt;</span>
        <span class="c-err">&lt;soap:Value&gt;</span><span class="c-coderd">soap:Sender</span><span class="c-err">&lt;/soap:Value&gt;</span>
      <span class="c-err">&lt;/soap:Code&gt;</span>
      <span class="c-err">&lt;soap:Reason&gt;</span>
        <span class="c-err">&lt;soap:Text</span> <span class="c-attr">xml:lang</span>=<span class="c-val">"fr"</span><span class="c-err">&gt;</span><span class="c-coderd">Numéro de compte invalide</span><span class="c-err">&lt;/soap:Text&gt;</span>
      <span class="c-err">&lt;/soap:Reason&gt;</span>
      <span class="c-err">&lt;soap:Detail&gt;</span>
        <span class="c-err">&lt;err:Code&gt;</span><span class="c-coderd">COMPTE_INEXISTANT</span><span class="c-err">&lt;/err:Code&gt;</span>
        <span class="c-err">&lt;err:Champ&gt;</span><span class="c-coderd">NumeroCompte</span><span class="c-err">&lt;/err:Champ&gt;</span>
      <span class="c-err">&lt;/soap:Detail&gt;</span>
    <span class="c-err">&lt;/soap:Fault&gt;</span>
  <span class="c-tag">&lt;/soap:Body&gt;</span>
<span class="c-tag">&lt;/soap:Envelope&gt;</span>`,
    receiver: `<span class="c-tag">&lt;soap:Envelope</span> <span class="c-attr">xmlns:soap</span>=<span class="c-val">"http://www.w3.org/2003/05/soap-envelope"</span><span class="c-tag">&gt;</span>
  <span class="c-tag">&lt;soap:Body&gt;</span>
    <span class="c-err">&lt;soap:Fault&gt;</span>
      <span class="c-err">&lt;soap:Code&gt;</span>
        <span class="c-err">&lt;soap:Value&gt;</span><span class="c-coderd">soap:Receiver</span><span class="c-err">&lt;/soap:Value&gt;</span>
        <span class="c-err">&lt;soap:Subcode&gt;&lt;soap:Value&gt;</span><span class="c-coderd">tns:DatabaseUnavailable</span><span class="c-err">&lt;/soap:Value&gt;&lt;/soap:Subcode&gt;</span>
      <span class="c-err">&lt;/soap:Code&gt;</span>
      <span class="c-err">&lt;soap:Reason&gt;</span>
        <span class="c-err">&lt;soap:Text</span> <span class="c-attr">xml:lang</span>=<span class="c-val">"fr"</span><span class="c-err">&gt;</span><span class="c-coderd">Erreur interne — base de données indisponible</span><span class="c-err">&lt;/soap:Text&gt;</span>
      <span class="c-err">&lt;/soap:Reason&gt;</span>
      <span class="c-err">&lt;soap:Detail&gt;</span>
        <span class="c-err">&lt;err:RetryAfter&gt;</span><span class="c-coderd">30</span><span class="c-err">&lt;/err:RetryAfter&gt;</span><span class="c-cmt"> &lt;!-- secondes --&gt;</span>
      <span class="c-err">&lt;/soap:Detail&gt;</span>
    <span class="c-err">&lt;/soap:Fault&gt;</span>
  <span class="c-tag">&lt;/soap:Body&gt;</span>
<span class="c-tag">&lt;/soap:Envelope&gt;</span>`,
    auth: `<span class="c-tag">&lt;soap:Envelope</span> <span class="c-attr">xmlns:soap</span>=<span class="c-val">"http://www.w3.org/2003/05/soap-envelope"</span><span class="c-tag">&gt;</span>
  <span class="c-tag">&lt;soap:Body&gt;</span>
    <span class="c-err">&lt;soap:Fault&gt;</span>
      <span class="c-err">&lt;soap:Code&gt;</span>
        <span class="c-err">&lt;soap:Value&gt;</span><span class="c-coderd">soap:Sender</span><span class="c-err">&lt;/soap:Value&gt;</span>
        <span class="c-err">&lt;soap:Subcode&gt;&lt;soap:Value&gt;</span><span class="c-coderd">wsse:InvalidSecurityToken</span><span class="c-err">&lt;/soap:Value&gt;&lt;/soap:Subcode&gt;</span>
      <span class="c-err">&lt;/soap:Code&gt;</span>
      <span class="c-err">&lt;soap:Reason&gt;</span>
        <span class="c-err">&lt;soap:Text&gt;</span><span class="c-coderd">Token de sécurité invalide ou expiré</span><span class="c-err">&lt;/soap:Text&gt;</span>
      <span class="c-err">&lt;/soap:Reason&gt;</span>
      <span class="c-err">&lt;soap:Detail&gt;</span>
        <span class="c-err">&lt;wsse:ErrorCode&gt;</span><span class="c-coderd">TOKEN_EXPIRED</span><span class="c-err">&lt;/wsse:ErrorCode&gt;</span>
      <span class="c-err">&lt;/soap:Detail&gt;</span>
    <span class="c-err">&lt;/soap:Fault&gt;</span>
  <span class="c-tag">&lt;/soap:Body&gt;</span>
<span class="c-tag">&lt;/soap:Envelope&gt;</span>`
  };

  document.getElementById('request-output').innerHTML = '<span style="color:var(--muted)">← Requête mal formée ou token expiré envoyé...</span>';
  document.getElementById('response-output').innerHTML = faults[type];
  const labels = {sender:'Erreur client (Sender)', receiver:'Erreur serveur (Receiver)', auth:'Erreur authentification WS-Security'};
  document.getElementById('res-title').innerHTML = `📥 Réponse du serveur <span class="pill pill-err">SOAP Fault</span>`;
  setStatus('error', `Fault SOAP — ${labels[type]}`, '');

  document.getElementById('explanation').innerHTML = `⚠️ <strong>SOAP Fault — ${labels[type]}</strong><br>
Contrairement à REST qui utilise les codes HTTP (404, 500…), SOAP retourne toujours <strong>un Fault XML structuré</strong> dans le Body. 
Code = type d'erreur (Sender=client, Receiver=serveur), Reason = message lisible, Detail = infos spécifiques à l'application. 
Cela permet une gestion d'erreurs précise et inter-opérable entre systèmes hétérogènes.`;
}

// ── COPY ──
function copyCode(id) {
  const el = document.getElementById(id);
  const text = el.innerText || el.textContent;
  navigator.clipboard.writeText(text).then(()=>{
    const btn = event.currentTarget;
    btn.textContent = '✓ Copié !';
    btn.className = 'copy-btn copied';
    setTimeout(()=>{btn.textContent='Copier';btn.className='copy-btn';},2000);
  });
}
