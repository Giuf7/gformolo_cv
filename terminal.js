const outputEl  = document.getElementById('output');
const inputEl   = document.getElementById('cmd-input');
const termOutEl = document.getElementById('term-output');

let cmdHistory = [];
let histIdx = -1;

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function append(html) {
  outputEl.insertAdjacentHTML('beforeend', html);
  termOutEl.scrollTop = termOutEl.scrollHeight;
}

function promptHtml(raw) {
  const parts = raw.trim().split(/\s+/);
  const cmd = parts[0];
  const rest = parts.slice(1);
  let html = `<div class="prompt-line" style="margin-bottom:4px;">
    <span class="p-user">giuseppe</span><span class="p-at">@</span><span class="p-host">formolo</span><span class="p-colon">:</span><span class="p-path">~</span><span class="p-dollar">$</span>
    <span class="p-cmd" style="margin-left:6px;">${esc(cmd)}</span>`;
  for (const a of rest) {
    html += ` <span class="${a.startsWith('-') ? 'p-flag' : 'p-arg'}">${esc(a)}</span>`;
  }
  return html + `</div>`;
}

function retHtml(code) {
  return `<div class="return-code">exit status <span class="${code === 0 ? 'ok' : 'err'}">${code}</span> &nbsp;·&nbsp; 0.002s</div>`;
}

const COMMANDS = {

  help() {
    return `
      <div class="stdout-div">──────────────────────────────────────────────────────────</div>
      <div style="color:var(--muted); font-size:11px; text-transform:uppercase; letter-spacing:.08em; margin-bottom:10px;"># commandes disponibles</div>
      <div style="display:grid; grid-template-columns:120px 1fr; gap:4px 16px; font-size:12.5px; margin:6px 0 12px;">
        <span style="color:var(--cyan);">whoami</span>    <span style="color:var(--muted);">Identité &amp; informations de contact</span>
        <span style="color:var(--cyan);">about</span>     <span style="color:var(--muted);">À propos de moi</span>
        <span style="color:var(--cyan);">skills</span>    <span style="color:var(--muted);">Compétences techniques</span>
        <span style="color:var(--cyan);">education</span> <span style="color:var(--muted);">Formation</span>
        <span style="color:var(--cyan);">experience</span><span style="color:var(--muted);">Expériences professionnelles</span>
        <span style="color:var(--cyan);">env</span>       <span style="color:var(--muted);">Langues &amp; soft skills</span>
        <span style="color:var(--cyan);">all</span>       <span style="color:var(--muted);">Afficher toutes les sections</span>
        <span style="color:var(--cyan);">clear</span>     <span style="color:var(--muted);">Effacer le terminal</span>
        <span style="color:var(--cyan);">help</span>      <span style="color:var(--muted);">Afficher cette aide</span>
      </div>
      <div style="color:var(--muted2); font-size:11px;">Astuce : ↑ ↓ pour naviguer dans l'historique · Tab pour l'autocomplétion</div>
      <div class="stdout-div" style="margin-top:8px;">──────────────────────────────────────────────────────────</div>
    `;
  },

  whoami() {
    return `
      <div class="hero">
        <div class="hero-name">Giuseppe Formolo</div>
        <div class="hero-title">Full Stack Developer &nbsp;<span class="badge badge-green">● OPEN TO WORK</span></div>
        <div class="hero-subtitle">Python · Flask · SQLAlchemy · TypeScript · Angular</div>
      </div>
      <div style="margin-top:12px;" class="kv-table">
        <div class="kv-row"><span class="kv-key">location</span>       <span class="kv-val">La Louvière, Belgique</span></div>
        <div class="kv-row"><span class="kv-key">phone</span>          <span class="kv-val">+32 486 826 481</span></div>
        <div class="kv-row"><span class="kv-key">email</span>          <span class="kv-val"><a href="mailto:giuseppe.formolo@hotmail.be">giuseppe.formolo@hotmail.be</a></span></div>
        <div class="kv-row"><span class="kv-key">nationality</span>    <span class="kv-val">Belge</span></div>
        <div class="kv-row"><span class="kv-key">driving_license</span><span class="kv-val">Permis B — Véhiculé</span></div>
      </div>
    `;
  },

  about() {
    return `
      <div class="stdout-div">─────────────────────────────────────────────────────────────────────</div>
      <div style="color:var(--white); font-size:12.5px; line-height:1.9; max-width:680px;">
        En reconversion vers le <span style="color:var(--green);">développement full stack</span>, je construis des applications web
        avec <span style="color:var(--cyan);">Python</span> (Flask, SQLAlchemy) côté back-end et <span style="color:var(--yellow);">TypeScript</span>/<span style="color:var(--red);">Angular</span> côté front.
        <br><br>
        Mon parcours en <span style="color:var(--purple);">gestion de clientèle</span> et en administration m'a forgé une rigueur
        opérationnelle que j'applique directement à l'écriture de code propre, structuré
        et maintenable. Orienté résolution de problèmes, je cherche à intégrer une équipe
        de développement où contribuer dès le premier jour.
      </div>
      <div class="stdout-div" style="margin-top:12px;">─────────────────────────────────────────────────────────────────────</div>
    `;
  },

  skills() {
    return `
      <div class="section-header">Back-end</div>
      <div class="tags">
        <span class="tag tag-py">Python</span>
        <span class="tag tag-py">Flask</span>
        <span class="tag tag-db">SQLAlchemy</span>
        <span class="tag tag-db">API REST</span>
        <span class="tag tag-db">PostgreSQL</span>
        <span class="tag tag-db">SQLite</span>
      </div>
      <div class="section-header" style="margin-top:12px;">Front-end</div>
      <div class="tags">
        <span class="tag tag-ts">TypeScript</span>
        <span class="tag tag-ng">Angular</span>
        <span class="tag tag-js">JavaScript</span>
        <span class="tag tag-html">HTML5</span>
        <span class="tag tag-html">CSS3</span>
      </div>
      <div class="section-header" style="margin-top:12px;">Outils &amp; méthodes</div>
      <div class="tags">
        <span class="tag tag-git">Git</span>
        <span class="tag tag-git">GitHub</span>
        <span class="tag tag-git">VS Code</span>
        <span class="tag tag-git">Linux</span>
        <span class="tag tag-git">Agile / Scrum</span>
      </div>
      <div class="section-header" style="margin-top:16px;">Niveaux</div>
      <div class="skill-row"><span class="skill-name">Python</span><div class="skill-bar-wrap"><div class="skill-bar bar-blue" style="width:72%"></div></div><span class="skill-label">en formation</span></div>
      <div class="skill-row"><span class="skill-name">Flask</span><div class="skill-bar-wrap"><div class="skill-bar bar-blue" style="width:65%"></div></div><span class="skill-label">en formation</span></div>
      <div class="skill-row"><span class="skill-name">SQLAlchemy</span><div class="skill-bar-wrap"><div class="skill-bar bar-purple" style="width:60%"></div></div><span class="skill-label">en formation</span></div>
      <div class="skill-row"><span class="skill-name">TypeScript</span><div class="skill-bar-wrap"><div class="skill-bar bar-blue" style="width:62%"></div></div><span class="skill-label">en formation</span></div>
      <div class="skill-row"><span class="skill-name">Angular</span><div class="skill-bar-wrap"><div class="skill-bar bar-yellow" style="width:58%"></div></div><span class="skill-label">en formation</span></div>
      <div class="skill-row"><span class="skill-name">Git</span><div class="skill-bar-wrap"><div class="skill-bar bar-green" style="width:75%"></div></div><span class="skill-label">opérationnel</span></div>
      <div class="skill-row"><span class="skill-name">Word / Excel</span><div class="skill-bar-wrap"><div class="skill-bar bar-green" style="width:88%"></div></div><span class="skill-label">avancé</span></div>
      <div class="skill-row"><span class="skill-name">Outlook</span><div class="skill-bar-wrap"><div class="skill-bar bar-green" style="width:96%"></div></div><span class="skill-label">expert</span></div>
    `;
  },

  education() {
    return `
      <div style="font-size:12px; line-height:2.1;">
        <div>
          <span style="color:var(--yellow);">a4f3c2e</span>
          <span style="color:var(--muted); margin:0 10px;">2025 – en cours</span>
          <span style="color:var(--green); font-weight:700;">Full Stack Développeur Python</span>
          <span class="badge badge-green" style="margin-left:8px;">CURRENT</span>
        </div>
        <div style="padding-left:20px; color:var(--muted); font-size:11px; margin-bottom:4px;">
          Technofutur TIC · Gosselies · 135 jours intensifs
        </div>
        <div style="padding-left:20px; margin-bottom:2px;">
          <div style="color:var(--cyan); margin-bottom:3px;"><span style="color:var(--muted2);">+</span> Python · Flask · SQLAlchemy · API REST · PostgreSQL</div>
          <div style="color:var(--yellow);"><span style="color:var(--muted2);">+</span> TypeScript · Angular · JavaScript · HTML5 · CSS3</div>
          <div style="color:var(--orange); margin-top:2px;"><span style="color:var(--muted2);">+</span> Git · GitHub · VS Code · Linux · Agile / Scrum</div>
        </div>
        <div style="margin-top:14px;">
          <span style="color:var(--yellow);">b2e9d1f</span>
          <span style="color:var(--muted); margin:0 10px;">2009 – 2011</span>
          <span style="color:var(--white);">C.E.S.S. – Agent d'éducation A2</span>
        </div>
        <div style="padding-left:20px; color:var(--muted); font-size:11px;">
          IPNC · La Louvière
        </div>
      </div>
    `;
  },

  experience() {
    return `
      <div class="exp-entry">
        <div class="exp-title">Transport &amp; Gestion Clientèle</div>
        <div class="exp-meta">
          <span class="exp-company">Indépendant</span>
          <span class="exp-period">2021 – Actuel</span>
          <span class="exp-status"><span class="badge badge-green">● RUNNING</span></span>
        </div>
        <div class="exp-item">Pilotage autonome de l'agenda, des tournées et de la priorisation des missions</div>
        <div class="exp-item">Suivi, communication et fidélisation d'un portefeuille de clients réguliers</div>
        <div class="exp-item">Administration complète : devis, facturation, suivi des dossiers et archivage</div>
        <div class="exp-item">Coordination avec entreprises partenaires et acteurs de la chaîne logistique</div>
      </div>
      <div class="exp-entry past">
        <div class="exp-title">Commercial – Vendeur/Acheteur</div>
        <div class="exp-meta">
          <span class="exp-company">Terroirs d'Avenir</span>
          <span class="exp-period">2016 – 2021</span>
          <span class="exp-status"><span class="badge badge-blue">MERGED</span></span>
        </div>
        <div class="exp-item">Conseil client, négociation et gestion des achats auprès des producteurs</div>
        <div class="exp-item">Traitement des bons de livraison, organisation et optimisation des stocks</div>
        <div class="exp-item">Suivi des clients professionnels, prise de rendez-vous et relation fournisseurs</div>
      </div>
    `;
  },

  all() {
    outputEl.innerHTML = '';
    for (const cmd of ['whoami', 'about', 'skills', 'education', 'experience', 'env']) {
      append(promptHtml(cmd));
      append(`<div class="output">${COMMANDS[cmd]()}</div>`);
      append(retHtml(0));
    }
    return null;
  },

  env() {
    return `
      <div class="kv-table">
        <div class="kv-row"><span class="kv-key">FRANCAIS</span>    <span class="kv-val">"Langue maternelle"</span></div>
        <div class="kv-row"><span class="kv-key">ANGLAIS</span>     <span class="kv-val">"Niveau opérationnel (B2)"</span></div>
        <div class="kv-row"><span class="kv-key">NEERLANDAIS</span> <span class="kv-val">"Notions"</span></div>
      </div>
      <div style="margin-top:12px;" class="kv-table">
        <div class="kv-row"><span class="kv-key">RIGUEUR</span>       <span class="kv-val" style="color:var(--green);">true</span></div>
        <div class="kv-row"><span class="kv-key">AUTONOMIE</span>     <span class="kv-val" style="color:var(--green);">true</span></div>
        <div class="kv-row"><span class="kv-key">ANALYTIQUE</span>    <span class="kv-val" style="color:var(--green);">true</span></div>
        <div class="kv-row"><span class="kv-key">SERVICE_CLIENT</span><span class="kv-val" style="color:var(--green);">true</span></div>
        <div class="kv-row"><span class="kv-key">ADAPTABILITE</span> <span class="kv-val" style="color:var(--green);">true</span></div>
      </div>
    `;
  },
};

function execute(rawInput) {
  const trimmed = rawInput.trim();
  if (!trimmed) return;

  cmdHistory.unshift(trimmed);
  histIdx = -1;

  const cmd = trimmed.split(/\s+/)[0].toLowerCase();

  if (cmd === 'clear') {
    outputEl.innerHTML = '';
    return;
  }

  append(promptHtml(trimmed));

  const handler = COMMANDS[cmd];
  if (handler) {
    const out = handler();
    if (out !== null) {
      append(`<div class="output">${out}</div>`);
      append(retHtml(0));
    }
  } else {
    append(`
      <div style="color:var(--red); margin:4px 0 4px;">bash: <span style="color:var(--white);">${esc(cmd)}</span>: commande introuvable</div>
      <div style="color:var(--muted); font-size:12px; margin-bottom:16px;">Tapez <span style="color:var(--cyan);">help</span> pour la liste des commandes disponibles.</div>
    `);
    append(retHtml(127));
  }
}

inputEl.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const val = inputEl.value;
    inputEl.value = '';
    execute(val);

  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (histIdx < cmdHistory.length - 1) {
      histIdx++;
      inputEl.value = cmdHistory[histIdx];
      setTimeout(() => inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length), 0);
    }

  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (histIdx > 0) {
      histIdx--;
      inputEl.value = cmdHistory[histIdx];
    } else {
      histIdx = -1;
      inputEl.value = '';
    }

  } else if (e.key === 'Tab') {
    e.preventDefault();
    const partial = inputEl.value.trim().toLowerCase();
    if (!partial) return;
    const matches = Object.keys(COMMANDS).filter(c => c.startsWith(partial));
    if (matches.length === 1) {
      inputEl.value = matches[0];
    } else if (matches.length > 1) {
      append(promptHtml(inputEl.value));
      append(`<div style="color:var(--muted); font-size:12px; margin-bottom:16px;">${matches.map(m => `<span style="color:var(--cyan); margin-right:16px;">${m}</span>`).join('')}</div>`);
    }

  } else if (e.key === 'l' && e.ctrlKey) {
    e.preventDefault();
    outputEl.innerHTML = '';

  } else if (e.key === 'c' && e.ctrlKey) {
    if (inputEl.value) {
      append(promptHtml(inputEl.value + ' ^C'));
      inputEl.value = '';
    }
  }
});

document.getElementById('term').addEventListener('click', () => inputEl.focus());

(function init() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-BE', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  });

  append(`
    <div style="animation: fadeIn .4s .1s both;">
      <div style="color:var(--muted2); font-size:11px; margin-bottom:16px;">
        Last login: ${dateStr} on ttys000
      </div>
      <div style="border-left:3px solid var(--green); padding-left:14px; margin-bottom:4px;">
        <div style="color:var(--green); font-weight:700; font-size:14px; margin-bottom:3px;">
          Bienvenue sur le CV interactif de Giuseppe Formolo.
        </div>
        <div style="color:var(--white); font-size:12.5px;">
          Tapez <span style="color:var(--cyan);">help</span> pour afficher la liste des commandes disponibles.
        </div>
      </div>
      <div style="color:var(--muted2); font-size:11px; margin-top:20px; margin-bottom:4px;">
        ────────────────────────────────────────────────────
      </div>
    </div>
  `);

  inputEl.focus();
})();
