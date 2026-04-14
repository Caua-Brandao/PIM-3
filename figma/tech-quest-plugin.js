// =============================================================================
// TECH QUEST — Figma Plugin
// Cria 20 telas mobile Android (412 × 917 px) com identidade visual Tech Quest
// Como usar: Figma → Plugins → Development → New Plugin → cole este código em code.js
// =============================================================================

const FW = 412;
const FH = 917;
const NAV_H = 64;
const BOT_H = 64;

// ─── Paleta ──────────────────────────────────────────────────────────────────
const C = {
  bgTop:   { r: 0.192, g: 0.208, b: 0.667, a: 1 }, // #3135AA
  bgBot:   { r: 0.000, g: 0.000, b: 0.000, a: 1 }, // #000000
  navBg:   { r: 0.169, g: 0.184, b: 0.600, a: 1 }, // #2B2F99
  cardTop: { r: 0.102, g: 0.110, b: 0.357, a: 1 }, // #1A1C5B
  cardBot: { r: 0.051, g: 0.055, b: 0.176, a: 1 }, // #0D0E2D
  cyan:    { r: 0.000, g: 0.914, b: 1.000, a: 1 }, // #00E9FF
  blue:    { r: 0.114, g: 0.549, b: 1.000, a: 1 }, // #1D8CFF
  border:  { r: 0.000, g: 0.659, b: 0.722, a: 1 }, // #00A8B8
  white:   { r: 1.000, g: 1.000, b: 1.000, a: 1 },
  textSec: { r: 0.890, g: 0.890, b: 0.890, a: 1 }, // #E3E3E3
  dark:    { r: 0.051, g: 0.055, b: 0.176, a: 1 }, // #0D0E2D
  btnBg:   { r: 0.133, g: 0.141, b: 0.345, a: 1 }, // #222579
  red:     { r: 1.000, g: 0.267, b: 0.267, a: 1 },
  green:   { r: 0.200, g: 0.800, b: 0.400, a: 1 },
};

// ─── Preenchimentos ───────────────────────────────────────────────────────────
function sf(c) {
  return [{ type: 'SOLID', color: { r: c.r, g: c.g, b: c.b }, opacity: c.a ?? 1 }];
}
function lgV(c1, c2) { // gradiente vertical
  return [{ type: 'GRADIENT_LINEAR', gradientTransform: [[0, 1, 0], [-1, 0, 1]],
    gradientStops: [
      { position: 0, color: { r: c1.r, g: c1.g, b: c1.b, a: 1 } },
      { position: 1, color: { r: c2.r, g: c2.g, b: c2.b, a: 1 } }
    ]}];
}
function lgH(c1, c2) { // gradiente horizontal
  return [{ type: 'GRADIENT_LINEAR', gradientTransform: [[1, 0, 0], [0, 1, 0]],
    gradientStops: [
      { position: 0, color: { r: c1.r, g: c1.g, b: c1.b, a: 1 } },
      { position: 1, color: { r: c2.r, g: c2.g, b: c2.b, a: 1 } }
    ]}];
}
function brd(c, w = 1) { return { strokes: [{ type: 'SOLID', color: { r: c.r, g: c.g, b: c.b } }], strokeWeight: w, strokeAlign: 'INSIDE' }; }

// ─── Primitivos ───────────────────────────────────────────────────────────────
let FONT = 'Inter';

function mkRect(parent, x, y, w, h, fills, radius = 0) {
  const r = figma.createRectangle();
  r.x = x; r.y = y; r.resize(w, h);
  r.fills = fills;
  if (radius) r.cornerRadius = radius;
  parent.appendChild(r);
  return r;
}

function mkText(parent, x, y, str, size, color, maxW = null, align = 'LEFT') {
  const t = figma.createText();
  t.fontName = { family: FONT, style: 'Regular' };
  t.x = x; t.y = y;
  t.characters = str;
  t.fontSize = size;
  t.fills = sf(color);
  t.textAlignHorizontal = align;
  if (maxW) { t.textAutoResize = 'HEIGHT'; t.resize(maxW, 10); }
  parent.appendChild(t);
  return t;
}

function mkFrame(parent, name, x, y, w, h, fills, radius = 0) {
  const f = figma.createFrame();
  f.name = name; f.x = x; f.y = y;
  f.resize(w, h); f.fills = fills;
  if (radius) { f.cornerRadius = radius; f.clipsContent = true; }
  parent.appendChild(f);
  return f;
}

// ─── Componentes reutilizáveis ────────────────────────────────────────────────
function navbar(frame, showBack = false, centerTitle = null) {
  const nav = mkFrame(frame, 'Navbar', 0, 0, FW, NAV_H, sf(C.navBg));
  Object.assign(nav, brd(C.border));
  mkRect(nav, 0, NAV_H - 2, FW, 2, sf(C.border));

  const logoX = showBack ? 56 : 16;
  mkText(nav, logoX, 10, 'TECH', 20, C.cyan);
  mkText(nav, logoX, 33, 'QUEST', 13, C.white);

  if (centerTitle) mkText(nav, 0, 20, centerTitle, 15, C.white, FW, 'CENTER');
  if (showBack) {
    mkRect(nav, 12, 18, 28, 28, sf(C.cyan), 6);
    mkText(nav, 18, 19, '←', 16, C.dark);
  }

  const prof = figma.createEllipse();
  prof.x = FW - 48; prof.y = 16; prof.resize(32, 32);
  prof.fills = sf(C.cyan);
  nav.appendChild(prof);
  mkText(nav, FW - 38, 22, '♟', 14, C.dark);

  return nav;
}

function bottomNav(frame, active = 0) {
  const nav = mkFrame(frame, 'BottomNav', 0, FH - BOT_H, FW, BOT_H, sf(C.dark));
  Object.assign(nav, brd(C.border));
  const items = [['⌂','Home'], ['▤','Cursos'], ['◉','Desempenho'], ['♟','Perfil']];
  const iW = FW / 4;
  items.forEach(([icon, label], i) => {
    const c = i === active ? C.cyan : C.textSec;
    mkText(nav, i * iW + iW / 2 - 10, 8, icon, 20, c);
    mkText(nav, i * iW, 34, label, 9, c, iW, 'CENTER');
  });
}

function card(parent, name, x, y, w, h, title = null, subtitle = null, radius = 24) {
  const f = mkFrame(parent, name, x, y, w, h, lgV(C.cardTop, C.cardBot), radius);
  Object.assign(f, brd(C.border));
  if (title) mkText(f, 16, 16, title, 15, C.cyan, w - 32);
  if (subtitle) mkText(f, 16, title ? 40 : 16, subtitle, 12, C.textSec, w - 32);
  return f;
}

function btn(parent, x, y, w, h, label, type = 'primary') {
  const f = mkFrame(parent, `Btn-${label}`, x, y, w, h, [], 12);
  if (type === 'primary') f.fills = lgH(C.cyan, C.blue);
  else if (type === 'secondary') { f.fills = sf(C.btnBg); Object.assign(f, brd(C.cyan)); }
  else { f.fills = lgV(C.cardTop, C.cardBot); Object.assign(f, brd(C.border)); }
  mkText(f, 0, (h - 20) / 2, label, 14, type === 'secondary' ? C.cyan : C.white, w, 'CENTER');
  return f;
}

function inputField(parent, x, y, w, label, ph, isPassword = false) {
  const g = mkFrame(parent, `Field-${label}`, x, y, w, 68, []);
  mkText(g, 0, 0, label, 11, C.textSec);
  const bg = mkRect(g, 0, 20, w, 40, sf(C.cardTop), 8);
  Object.assign(bg, brd(C.border));
  mkText(g, 10, 30, ph, 13, { r: 0.4, g: 0.4, b: 0.5, a: 1 });
  if (isPassword) mkText(g, w - 28, 30, '👁', 14, C.textSec);
  return g;
}

function xpBar(frame, x, y, w, pct) {
  mkRect(frame, x, y, w, 12, sf(C.cardTop), 6);
  mkRect(frame, x, y, w * pct, 12, lgH(C.cyan, C.blue), 6);
}

// =============================================================================
//  TELAS — ALUNO
// =============================================================================

function t01_home(page) {
  const f = mkFrame(page, 'T01 — Home', 0, 0, FW, FH, lgV(C.bgTop, C.bgBot));
  navbar(f);
  mkText(f, 24, NAV_H + 28, 'Aumente de nível', 28, C.cyan, FW - 48);
  mkText(f, 24, NAV_H + 68, 'Explore nossos desafios!', 22, C.white, FW - 48);
  btn(f, 24, NAV_H + 116, 172, 50, 'Iniciar jornada', 'primary');
  btn(f, 208, NAV_H + 116, 180, 50, 'Continuar jornada', 'secondary');
  mkText(f, 24, NAV_H + 188, 'Escolha sua trilha', 18, C.white);
  const trilhas = [['Frontend','◈'],['Backend','⊞'],['Mobile','◉'],['DevOps','⚙']];
  trilhas.forEach(([t, icon], i) => {
    const cx = 20 + (i % 2) * 200, cy = NAV_H + 220 + Math.floor(i / 2) * 168;
    const c2 = card(f, t, cx, cy, 184, 152, icon + '  ' + t, null, 20);
    btn(c2, 12, 100, 160, 38, 'Comece sua jornada', 'secondary');
  });
  bottomNav(f, 0);
  return f;
}

function t02_login(page) {
  const f = mkFrame(page, 'T02 — Login', 450, 0, FW, FH, lgV(C.bgTop, C.bgBot));
  navbar(f, true);
  mkText(f, 24, NAV_H + 36, 'Já começou sua\naventura com a gente?', 22, C.cyan, FW - 48);
  mkText(f, 24, NAV_H + 110, 'Faça login e boa jornada!', 14, C.textSec, FW - 48);
  const fc = mkFrame(f, 'FormCard', 16, NAV_H + 152, FW - 32, 360, lgV(C.cardTop, C.cardBot), 28);
  Object.assign(fc, brd(C.border));
  inputField(fc, 24, 24, FW - 80, 'E-mail', 'seu@email.com');
  inputField(fc, 24, 104, FW - 80, 'Senha', '••••••••', true);
  btn(fc, 24, 190, FW - 80, 52, 'ENTRAR', 'primary');
  mkText(fc, 24, 258, 'Primeiro acesso / Esqueci minha senha', 12, C.cyan, FW - 80);
  mkText(fc, 24, 286, 'Criar conta', 12, C.textSec, FW - 80);
  return f;
}

function t03_cadastro(page) {
  const f = mkFrame(page, 'T03 — Cadastro', 900, 0, FW, FH, lgV(C.bgTop, C.bgBot));
  navbar(f, true, 'Criar conta');
  const fc = mkFrame(f, 'FormCard', 16, NAV_H + 16, FW - 32, FH - NAV_H - 40, lgV(C.cardTop, C.cardBot), 28);
  Object.assign(fc, brd(C.border));
  const fields = [['Nome completo','Seu nome',false],['RA / Matrícula','2024001234',false],['E-mail','seu@email.com',false],['Senha','••••••••',true],['Confirmar senha','••••••••',true]];
  fields.forEach(([l, ph, pw], i) => inputField(fc, 24, 20 + i * 82, FW - 80, l, ph, pw));
  const cb = mkRect(fc, 24, 440, 20, 20, sf(C.cardTop), 4);
  Object.assign(cb, brd(C.cyan));
  mkText(fc, 52, 442, 'Aceito os termos de uso', 13, C.textSec);
  btn(fc, 24, 476, FW - 80, 52, 'CRIAR CONTA', 'primary');
  mkText(fc, 24, 544, 'Já tenho conta', 12, C.cyan);
  return f;
}

function t04_dashboard(page) {
  const f = mkFrame(page, 'T04 — Dashboard Aluno', 1350, 0, FW, FH, lgV(C.bgTop, C.bgBot));
  navbar(f);
  let y = NAV_H + 20;
  mkText(f, 24, y, 'Olá, João!', 24, C.white); y += 36;
  mkText(f, 24, y, '✦ Nível 7 — Aprendiz Hacker', 13, C.cyan); y += 24;
  xpBar(f, 24, y, FW - 48, 0.67); y += 16;
  mkText(f, 24, y, '1.340 / 2.000 XP', 11, C.textSec); y += 28;
  mkText(f, 24, y, 'Acesso rápido', 16, C.white); y += 28;
  [['◈ Meus Cursos',0],['✎ Atividades',1],['◉ Desempenho',2],['★ Medalhas',3]].forEach(([lbl, i]) => {
    card(f, lbl, 24 + (i%2)*196, y + Math.floor(i/2)*108, 184, 96, lbl, null, 16);
  }); y += 232;
  mkText(f, 24, y, 'Continue de onde parou', 16, C.white); y += 28;
  const cc = card(f, 'Último curso', 24, y, FW - 48, 88, 'JavaScript Avançado', 'Módulo 4 — Promises & Async', 16);
  xpBar(cc, 16, 68, FW - 80, 0.6);
  bottomNav(f, 0);
  return f;
}

function t05_conteudo(page) {
  const f = mkFrame(page, 'T05 — Visualizar Conteúdo', 1800, 0, FW, FH, lgV(C.bgTop, C.bgBot));
  navbar(f, true, 'JavaScript Avançado');
  let y = NAV_H + 16;
  mkText(f, 24, y, 'Progresso do curso: 60%', 13, C.cyan); y += 22;
  xpBar(f, 24, y, FW - 48, 0.6); y += 22;
  const mods = [
    ['Módulo 1 — Introdução ao JS','done',100],
    ['Módulo 2 — ES6+','done',100],
    ['Módulo 3 — DOM Manipulation','done',100],
    ['Módulo 4 — Promises','active',45],
    ['Módulo 5 — APIs e Fetch','locked',0],
    ['Módulo 6 — Testes','locked',0],
  ];
  mods.forEach(([title, status, pct]) => {
    const c2 = mkFrame(f, title, 16, y, FW - 32, 78, lgV(C.cardTop, C.cardBot), 14);
    Object.assign(c2, brd(C.border));
    if (status === 'locked') c2.opacity = 0.5;
    const sc = status === 'done' ? C.green : status === 'active' ? C.cyan : C.textSec;
    const si = status === 'done' ? '✓' : status === 'active' ? '▶' : '⊘';
    mkText(c2, 14, 18, si, 22, sc);
    mkText(c2, 48, 12, title, 13, status === 'locked' ? C.textSec : C.white, FW - 120);
    if (status !== 'locked') {
      mkRect(c2, 48, 36, FW - 120, 6, lgH(C.cyan, C.blue), 3);
      mkText(c2, 48, 46, `${pct}%`, 10, C.textSec);
    }
    if (status === 'active') btn(c2, FW - 148, 24, 120, 36, 'Iniciar aula', 'primary');
    y += 86;
  });
  bottomNav(f, 1);
  return f;
}

function t06_atividade(page) {
  const f = mkFrame(page, 'T06 — Realizar Atividade', 2250, 0, FW, FH, lgV(C.bgTop, C.bgBot));
  navbar(f, true, 'Prova Final — JS');
  let y = NAV_H + 16;
  mkText(f, 24, y, 'Questão 3 de 10', 13, C.textSec);
  mkText(f, FW - 104, y, '⏱ 12:45', 13, C.cyan);
  y += 24;
  mkRect(f, 24, y, FW - 48, 8, sf(C.cardTop), 4);
  mkRect(f, 24, y, (FW - 48) * 0.3, 8, lgH(C.cyan, C.blue), 4);
  y += 20;
  const qc = card(f, 'Questão', 16, y, FW - 32, 116, null, null, 16);
  mkText(qc, 20, 16, 'Qual método JavaScript é usado para criar uma Promise que resolve imediatamente com um valor?', 14, C.white, FW - 72);
  y += 132;
  const opts = [['A','Promise.resolve()','selected'],['B','Promise.reject()','default'],['C','new Promise()','default'],['D','async function()','default']];
  opts.forEach(([lbl, text, state]) => {
    const sel = state === 'selected';
    const oc = mkFrame(f, `Opt-${lbl}`, 16, y, FW - 32, 58, lgV(C.cardTop, C.cardBot), 14);
    oc.strokes = [{ type: 'SOLID', color: sel ? { r: C.cyan.r, g: C.cyan.g, b: C.cyan.b } : { r: C.border.r, g: C.border.g, b: C.border.b } }];
    oc.strokeWeight = sel ? 2 : 1; oc.strokeAlign = 'INSIDE';
    const ec = figma.createEllipse(); ec.x = 14; ec.y = 13; ec.resize(32, 32);
    ec.fills = sel ? sf(C.cyan) : sf(C.cardTop);
    ec.strokes = [{ type: 'SOLID', color: { r: C.cyan.r, g: C.cyan.g, b: C.cyan.b } }]; ec.strokeWeight = 1;
    oc.appendChild(ec);
    mkText(oc, 22, 20, lbl, 14, sel ? C.dark : C.cyan);
    mkText(oc, 58, 18, text, 14, C.white, FW - 90);
    y += 66;
  });
  y += 8;
  btn(f, 16, y, FW - 32, 52, 'Confirmar resposta', 'primary');
  return f;
}

function t07_desempenho(page) {
  const f = mkFrame(page, 'T07 — Desempenho', 2700, 0, FW, FH, lgV(C.bgTop, C.bgBot));
  navbar(f, true, 'Meu Desempenho');
  let y = NAV_H + 20;
  const mW = Math.floor((FW - 48) / 3);
  [['Média Geral','8.7'],['Atividades','24'],['Provas','6']].forEach(([lbl, val], i) => {
    const c2 = card(f, lbl, 16 + i * (mW + 8), y, mW, 88, val, lbl, 14);
  }); y += 104;
  mkText(f, 16, y, 'Cursos', 18, C.white); y += 32;
  const courses = [
    ['JavaScript Avançado','8.5','Em andamento'],
    ['React Fundamentals','9.2','Aprovado'],
    ['Node.js & APIs','7.8','Aprovado'],
    ['TypeScript Pro','—','Não iniciado'],
    ['SQL & PostgreSQL','6.4','Reprovado'],
  ];
  courses.forEach(([nm, grade, status]) => {
    const sc = status === 'Aprovado' ? C.green : status === 'Reprovado' ? C.red : C.cyan;
    const c2 = mkFrame(f, nm, 16, y, FW - 32, 64, lgV(C.cardTop, C.cardBot), 14);
    Object.assign(c2, brd(C.border));
    mkText(c2, 16, 10, nm, 13, C.white, FW - 100);
    mkText(c2, 16, 34, status, 12, sc);
    mkText(c2, FW - 80, 16, grade, 22, C.cyan);
    y += 72;
  });
  btn(f, 16, y + 8, FW - 32, 48, 'Ver histórico completo', 'tertiary');
  bottomNav(f, 2);
  return f;
}

function t08_medalhas(page) {
  const f = mkFrame(page, 'T08 — Medalhas & Títulos', 3150, 0, FW, FH, lgV(C.bgTop, C.bgBot));
  navbar(f, true, 'Minhas Conquistas');
  let y = NAV_H + 20;
  mkText(f, 16, y, 'Medalhas', 18, C.white); y += 36;
  const mW = Math.floor((FW - 48) / 3);
  const medals = [['Explorador',true],['Persistente',true],['Ninja JS',true],['Mestre React',false],['Guru Backend',false],['Lenda Full',false]];
  medals.forEach(([nm, ok], i) => {
    const cx = 16 + (i % 3) * (mW + 8), cy = y + Math.floor(i / 3) * 126;
    const mc = mkFrame(f, nm, cx, cy, mW, 114, lgV(C.cardTop, C.cardBot), 18);
    mc.strokes = [{ type: 'SOLID', color: ok ? { r: C.cyan.r, g: C.cyan.g, b: C.cyan.b } : { r: C.border.r, g: C.border.g, b: C.border.b } }];
    mc.strokeWeight = 1; mc.strokeAlign = 'INSIDE';
    if (!ok) mc.opacity = 0.4;
    const e = figma.createEllipse(); e.x = mW/2-24; e.y = 8; e.resize(48, 48);
    e.fills = ok ? lgH(C.cyan, C.blue) : sf(C.cardTop);
    mc.appendChild(e);
    mkText(mc, mW/2 - 10, 20, ok ? '★' : '⊘', 22, ok ? C.dark : C.textSec);
    mkText(mc, 0, 68, nm, 10, ok ? C.cyan : C.textSec, mW, 'CENTER');
  });
  y += 264;
  mkText(f, 16, y, 'Títulos desbloqueados', 18, C.white); y += 32;
  ['Aprendiz Hacker','Mago do Frontend'].forEach((t) => {
    const tc = card(f, t, 16, y, FW - 32, 52, null, null, 14);
    mkText(tc, 16, 14, '✦  ' + t, 15, C.cyan);
    y += 60;
  });
  bottomNav(f, 3);
  return f;
}

function t09_certificado(page) {
  const f = mkFrame(page, 'T09 — Certificado', 3600, 0, FW, FH, lgV(C.bgTop, C.bgBot));
  navbar(f, true, 'Meus Certificados');
  let y = NAV_H + 24;
  const cc = mkFrame(f, 'CertCard', 16, y, FW - 32, 410, lgV(C.cardTop, C.cardBot), 24);
  cc.strokes = [{ type: 'SOLID', color: { r: C.cyan.r, g: C.cyan.g, b: C.cyan.b } }];
  cc.strokeWeight = 2; cc.strokeAlign = 'INSIDE';
  mkRect(cc, 20, 20, FW - 72, 2, sf(C.cyan));
  mkRect(cc, 20, 388, FW - 72, 2, sf(C.cyan));
  mkText(cc, 0, 36, 'CERTIFICADO DE CONCLUSÃO', 13, C.cyan, FW - 32, 'CENTER');
  mkText(cc, 0, 66, '★', 36, C.cyan, FW - 32, 'CENTER');
  const fields = [['Aluno','João Silva'],['Curso','JavaScript Avançado'],['Data de emissão','14/04/2026'],['Nota final','8.5 / 10']];
  fields.forEach(([lbl, val], i) => {
    mkText(cc, 24, 122 + i * 56, lbl, 12, C.textSec);
    mkText(cc, 24, 142 + i * 56, val, 18, C.cyan);
  });
  y += 426;
  btn(f, 16, y, FW - 32, 52, 'Baixar certificado', 'primary');
  bottomNav(f, 3);
  return f;
}

function t10_perfil(page) {
  const f = mkFrame(page, 'T10 — Editar Perfil', 4050, 0, FW, FH, lgV(C.bgTop, C.bgBot));
  navbar(f, true, 'Meu Perfil');
  let y = NAV_H + 30;
  const av = figma.createEllipse(); av.x = FW/2 - 50; av.y = y; av.resize(100, 100);
  av.fills = lgH(C.cyan, C.blue); av.strokes = [{ type: 'SOLID', color: { r: C.cyan.r, g: C.cyan.g, b: C.cyan.b } }]; av.strokeWeight = 3;
  f.appendChild(av);
  mkText(f, FW/2 - 14, y + 36, 'JS', 28, C.dark);
  const eb = figma.createEllipse(); eb.x = FW/2 + 26; eb.y = y + 68; eb.resize(28, 28);
  eb.fills = sf(C.cyan); f.appendChild(eb);
  mkText(f, FW/2 + 33, y + 74, '✎', 14, C.dark);
  y += 132;
  mkText(f, 0, y, 'João Silva', 20, C.white, FW, 'CENTER'); y += 32;
  mkText(f, 0, y, '✦ Nível 7 — Aprendiz Hacker', 13, C.cyan, FW, 'CENTER'); y += 52;
  inputField(f, 16, y, FW - 32, 'Nome', 'João Silva'); y += 82;
  const ei = inputField(f, 16, y, FW - 32, 'E-mail (read-only)', 'joao@escola.com'); ei.opacity = 0.6; y += 82;
  const ri = inputField(f, 16, y, FW - 32, 'RA / Matrícula (read-only)', '2024001234'); ri.opacity = 0.6; y += 94;
  btn(f, 16, y, FW - 32, 52, 'Salvar alterações', 'primary'); y += 66;
  const lb = mkFrame(f, 'Btn-Logout', 16, y, FW - 32, 48, [], 12);
  lb.strokes = [{ type: 'SOLID', color: { r: C.red.r, g: C.red.g, b: C.red.b } }]; lb.strokeWeight = 1;
  mkText(lb, 0, 13, 'Sair / Logout', 15, C.red, FW - 32, 'CENTER');
  bottomNav(f, 3);
  return f;
}

// =============================================================================
//  TELAS — TUTOR
// =============================================================================

function t11_tutorDash(page) {
  const f = mkFrame(page, 'T11 — Dashboard Tutor', 0, 0, FW, FH, lgV(C.bgTop, C.bgBot));
  navbar(f);
  const badge = mkRect(f, FW - 82, NAV_H + 14, 66, 26, sf(C.btnBg), 12);
  Object.assign(badge, brd(C.cyan));
  mkText(f, FW - 68, NAV_H + 20, 'TUTOR', 10, C.cyan);
  let y = NAV_H + 20;
  mkText(f, 16, y, 'Olá, Prof. Ana!', 22, C.white); y += 48;
  const mW = Math.floor((FW - 48) / 2);
  [['Total de Alunos','48'],['Correções Pendentes','7']].forEach(([lbl, val], i) => {
    card(f, lbl, 16 + i * (mW + 16), y, mW, 88, val, lbl, 16);
  }); y += 104;
  mkText(f, 16, y, 'Ações rápidas', 16, C.white); y += 32;
  const actions = [['✎','Criar Conteúdo'],['📋','Gerenciar Provas'],['✓','Corrigir Atividades'],['👥','Ver Alunos']];
  actions.forEach(([icon, lbl], i) => {
    card(f, lbl, 16 + (i%2) * 200, y + Math.floor(i/2) * 120, 184, 108, icon + '  ' + lbl, null, 16);
  });
  bottomNav(f, 0);
  return f;
}

function t12_gerenciarConteudo(page) {
  const f = mkFrame(page, 'T12 — Gerenciar Conteúdo', 450, 0, FW, FH, lgV(C.bgTop, C.bgBot));
  navbar(f, true, 'Gerenciar Conteúdo');
  let y = NAV_H + 16;
  const items = [
    ['Introdução ao React','10/04/2026','publicado'],
    ['Hooks Avançados','08/04/2026','publicado'],
    ['Context API','07/04/2026','rascunho'],
    ['Next.js Básico','05/04/2026','rascunho'],
    ['Testes com Jest','02/04/2026','publicado'],
    ['Deploy & CI/CD','28/03/2026','rascunho'],
  ];
  items.forEach(([title, date, status]) => {
    const sc = status === 'publicado' ? C.green : C.cyan;
    const c2 = mkFrame(f, title, 16, y, FW - 32, 72, lgV(C.cardTop, C.cardBot), 14);
    Object.assign(c2, brd(C.border));
    mkText(c2, 16, 10, title, 14, C.white, FW - 100);
    mkText(c2, 16, 34, date, 11, C.textSec);
    mkText(c2, 16, 52, status.toUpperCase(), 10, sc);
    mkText(c2, FW - 78, 22, '✎', 16, C.cyan);
    mkText(c2, FW - 52, 22, '🗑', 16, C.red);
    y += 80;
  });
  const fab = figma.createEllipse(); fab.x = FW - 72; fab.y = FH - BOT_H - 72; fab.resize(56, 56);
  fab.fills = lgH(C.cyan, C.blue); f.appendChild(fab);
  mkText(f, FW - 58, FH - BOT_H - 54, '+', 28, C.dark);
  bottomNav(f, 0);
  return f;
}

function t13_criarProva(page) {
  const f = mkFrame(page, 'T13 — Criar / Editar Prova', 900, 0, FW, FH, lgV(C.bgTop, C.bgBot));
  navbar(f, true, 'Nova Prova');
  const fc = mkFrame(f, 'FormCard', 16, NAV_H + 16, FW - 32, FH - NAV_H - BOT_H - 32, lgV(C.cardTop, C.cardBot), 24);
  Object.assign(fc, brd(C.border));
  let y = 20;
  inputField(fc, 20, y, FW - 72, 'Título da prova', 'Ex: Prova Final JS'); y += 82;
  inputField(fc, 20, y, FW - 72, 'Descrição', 'Descrição da atividade...'); y += 82;
  inputField(fc, 20, y, FW - 72, 'Data limite', '14/05/2026'); y += 98;
  mkText(fc, 20, y, 'Questões adicionadas', 14, C.white); y += 28;
  ['Q1: O que é closure em JavaScript?','Q2: Diferença entre == e ===?'].forEach((q) => {
    const qc = mkFrame(fc, q.slice(0,20), 20, y, FW - 72, 48, sf(C.cardTop), 8);
    Object.assign(qc, brd(C.border));
    mkText(qc, 12, 14, q, 12, C.textSec, FW - 110);
    mkText(qc, FW - 96, 14, '✕', 14, C.red);
    y += 56;
  });
  btn(fc, 20, y, FW - 72, 44, '+ Adicionar questão', 'secondary'); y += 56;
  btn(fc, 20, y, FW - 72, 52, 'Salvar prova', 'primary');
  bottomNav(f, 0);
  return f;
}

function t14_corrigir(page) {
  const f = mkFrame(page, 'T14 — Corrigir Atividade', 1350, 0, FW, FH, lgV(C.bgTop, C.bgBot));
  navbar(f, true, 'Corrigir Atividades');
  let y = NAV_H + 16;
  mkText(f, 16, y, 'Pendentes de correção', 16, C.cyan); y += 32;
  [['Ana Souza','Atividade 3 — Hooks','há 2h'],['Carlos Lima','Atividade 3 — Hooks','há 3h'],['Mariana Costa','Prova Final JS','há 5h']].forEach(([nm, act, tm]) => {
    const c2 = mkFrame(f, nm, 16, y, FW - 32, 80, lgV(C.cardTop, C.cardBot), 14);
    Object.assign(c2, brd(C.border));
    const av = figma.createEllipse(); av.x = 14; av.y = 16; av.resize(48, 48); av.fills = lgH(C.cyan, C.blue); c2.appendChild(av);
    mkText(c2, 72, 10, nm, 14, C.white);
    mkText(c2, 72, 32, act, 12, C.textSec);
    mkText(c2, 72, 52, tm, 11, C.border);
    btn(c2, FW - 130, 22, 102, 36, 'Corrigir', 'primary');
    y += 88;
  });
  y += 8;
  const dc = card(f, 'Resposta aluno', 16, y, FW - 32, 200, 'Resposta do aluno', null, 16);
  mkText(dc, 20, 44, 'const [count, setCount] = useState(0);\nuseEffect(() => {\n  document.title = count;\n}, [count]);', 12, C.textSec, FW - 72);
  mkText(dc, 20, 148, 'Nota (0-10):', 13, C.white);
  const ni = mkRect(dc, 136, 144, 60, 32, sf(C.cardTop), 8);
  Object.assign(ni, brd(C.cyan));
  y += 216;
  btn(f, 16, y, FW - 32, 52, 'Confirmar correção', 'primary');
  bottomNav(f, 0);
  return f;
}

function t15_aprovar(page) {
  const f = mkFrame(page, 'T15 — Aprovar / Reprovar Aluno', 1800, 0, FW, FH, lgV(C.bgTop, C.bgBot));
  navbar(f, true, 'Aprovações');
  let y = NAV_H + 16;
  [['Ana Souza',8.7,'aprovado'],['Carlos Lima',6.2,'pendente'],['Mariana Costa',5.1,'reprovado'],['Pedro Alves',9.3,'aprovado'],['Julia Ramos',7.5,'pendente']].forEach(([nm, avg, status]) => {
    const sc = status === 'aprovado' ? C.green : status === 'reprovado' ? C.red : C.cyan;
    const c2 = mkFrame(f, nm, 16, y, FW - 32, 88, lgV(C.cardTop, C.cardBot), 14);
    Object.assign(c2, brd(C.border));
    const av = figma.createEllipse(); av.x = 14; av.y = 20; av.resize(40, 40); av.fills = lgH(C.cyan, C.blue); c2.appendChild(av);
    mkText(c2, 62, 10, nm, 14, C.white);
    mkText(c2, 62, 30, `Média: ${avg}`, 13, C.cyan);
    mkText(c2, 62, 50, status.toUpperCase(), 11, sc);
    if (status === 'pendente') {
      const ab = mkFrame(c2, 'Aprovar', FW - 164, 24, 62, 36, sf(C.green), 8);
      mkText(ab, 8, 10, 'Aprovar', 11, C.dark);
      const rb = mkFrame(c2, 'Reprovar', FW - 96, 24, 62, 36, sf(C.red), 8);
      mkText(rb, 6, 10, 'Reprovar', 11, C.white);
    }
    y += 96;
  });
  bottomNav(f, 0);
  return f;
}

// =============================================================================
//  TELAS — ADMIN
// =============================================================================

function t16_adminDash(page) {
  const f = mkFrame(page, 'T16 — Dashboard Admin', 0, 0, FW, FH, lgV(C.bgTop, C.bgBot));
  navbar(f);
  const badge = mkRect(f, FW - 82, NAV_H + 14, 66, 26, sf(C.btnBg), 12);
  badge.strokes = [{ type: 'SOLID', color: { r: C.red.r, g: C.red.g, b: C.red.b } }]; badge.strokeWeight = 1;
  mkText(f, FW - 68, NAV_H + 20, 'ADMIN', 10, C.red);
  let y = NAV_H + 20;
  mkText(f, 16, y, 'Painel Administrativo', 20, C.white); y += 44;
  const kW = Math.floor((FW - 48) / 3);
  [['Usuários','342'],['Cursos ativos','18'],['Média geral','7.8']].forEach(([lbl, val], i) => {
    card(f, lbl, 16 + i * (kW + 8), y, kW, 82, val, lbl, 14);
  }); y += 98;
  const ch = mkFrame(f, 'Chart', 16, y, FW - 32, 148, lgV(C.cardTop, C.cardBot), 20);
  Object.assign(ch, brd(C.border));
  mkText(ch, 16, 10, 'Atividade semanal', 13, C.cyan);
  [40,70,55,90,65,80,45].forEach((h, i) => mkRect(ch, 20 + i * 52, 148 - h - 8, 36, h, lgH(C.cyan, C.blue), 4));
  y += 164;
  ['Gerenciar Usuários','Gerenciar Cursos','Parâmetros de Pontuação'].forEach((lbl) => {
    btn(f, 16, y, FW - 32, 50, lbl, 'secondary'); y += 60;
  });
  bottomNav(f, 0);
  return f;
}

function t17_usuarios(page) {
  const f = mkFrame(page, 'T17 — Gerenciar Usuários', 450, 0, FW, FH, lgV(C.bgTop, C.bgBot));
  navbar(f, true, 'Usuários');
  let y = NAV_H + 12;
  const ff = mkFrame(f, 'Filters', 16, y, FW - 32, 40, []); y += 52;
  ['Todos','Aluno','Tutor','Admin'].forEach((lbl, i) => {
    const active = i === 0;
    const p = mkFrame(ff, lbl, i * 92, 0, 82, 32, active ? lgH(C.cyan, C.blue) : sf(C.cardTop), 16);
    Object.assign(p, brd(active ? C.cyan : C.border));
    mkText(p, 8, 8, lbl, 12, active ? C.dark : C.textSec);
  });
  const roleC = (r) => r === 'Admin' ? C.red : r === 'Tutor' ? C.blue : C.cyan;
  [['João Silva','Aluno','ativo'],['Ana Souza','Aluno','ativo'],['Prof. Ana Lima','Tutor','ativo'],['Carlos Costa','Aluno','inativo'],['Roberto Melo','Tutor','ativo'],['Admin Master','Admin','ativo']].forEach(([nm, role, status]) => {
    const sc = status === 'ativo' ? C.green : C.red;
    const c2 = mkFrame(f, nm, 16, y, FW - 32, 72, lgV(C.cardTop, C.cardBot), 14);
    Object.assign(c2, brd(C.border));
    const av = figma.createEllipse(); av.x = 12; av.y = 12; av.resize(48, 48); av.fills = sf(roleC(role)); av.opacity = 0.3; c2.appendChild(av);
    mkText(c2, 26, 22, nm[0], 18, roleC(role));
    mkText(c2, 70, 8, nm, 14, C.white);
    mkText(c2, 70, 28, role, 12, roleC(role));
    mkText(c2, 70, 48, status, 11, sc);
    mkText(c2, FW - 78, 24, '✎', 16, C.cyan);
    mkText(c2, FW - 52, 24, '⊘', 16, C.red);
    y += 80;
  });
  const fab = figma.createEllipse(); fab.x = FW - 72; fab.y = FH - BOT_H - 72; fab.resize(56, 56); fab.fills = lgH(C.cyan, C.blue); f.appendChild(fab);
  mkText(f, FW - 58, FH - BOT_H - 54, '+', 28, C.dark);
  bottomNav(f, 0);
  return f;
}

function t18_cursos(page) {
  const f = mkFrame(page, 'T18 — Gerenciar Cursos', 900, 0, FW, FH, lgV(C.bgTop, C.bgBot));
  navbar(f, true, 'Cursos');
  let y = NAV_H + 16;
  btn(f, 16, y, FW - 32, 48, '+ Novo curso', 'primary'); y += 64;
  [['JavaScript Avançado','Prof. Ana Lima',48,'ativo'],['React Fundamentals','Prof. Ana Lima',32,'ativo'],['Node.js & APIs','Prof. Roberto Melo',27,'ativo'],['TypeScript Pro','Prof. Roberto Melo',15,'rascunho'],['SQL & PostgreSQL','Prof. Ana Lima',41,'ativo']].forEach(([nm, tutor, students, status]) => {
    const sc = status === 'ativo' ? C.green : C.cyan;
    const c2 = mkFrame(f, nm, 16, y, FW - 32, 96, lgV(C.cardTop, C.cardBot), 14);
    Object.assign(c2, brd(C.border));
    mkText(c2, 16, 10, nm, 14, C.cyan, FW - 80);
    mkText(c2, 16, 34, tutor, 12, C.textSec);
    mkText(c2, 16, 54, `👥 ${students} alunos`, 12, C.textSec);
    mkText(c2, 16, 74, status.toUpperCase(), 10, sc);
    mkText(c2, FW - 78, 36, '✎', 16, C.cyan);
    mkText(c2, FW - 52, 36, '🗑', 16, C.red);
    y += 104;
  });
  bottomNav(f, 0);
  return f;
}

function t19_parametros(page) {
  const f = mkFrame(page, 'T19 — Parâmetros de Pontuação', 1350, 0, FW, FH, lgV(C.bgTop, C.bgBot));
  navbar(f, true, 'Parâmetros');
  const fc = mkFrame(f, 'FormCard', 16, NAV_H + 16, FW - 32, FH - NAV_H - BOT_H - 32, lgV(C.cardTop, C.cardBot), 24);
  Object.assign(fc, brd(C.border));
  mkText(fc, 20, 22, 'Configuração de gamificação', 16, C.cyan);
  let y = 60;
  [['Pontos por atividade concluída','50 pts'],['Pontos por prova aprovada','150 pts'],['XP para subir de nível','2.000 XP'],['Nota mínima para certificado','7.0 / 10']].forEach(([lbl, val]) => {
    mkText(fc, 20, y, lbl, 13, C.textSec, FW - 72); y += 24;
    const ib = mkRect(fc, 20, y, FW - 72, 52, sf(C.cardTop), 10);
    Object.assign(ib, brd(C.border));
    mkText(fc, 36, y + 14, val, 22, C.cyan);
    y += 68;
  });
  y += 8;
  btn(fc, 20, y, FW - 72, 52, 'Salvar parâmetros', 'primary');
  bottomNav(f, 0);
  return f;
}

function t20_relatorio(page) {
  const f = mkFrame(page, 'T20 — Relatório Geral', 1800, 0, FW, FH, lgV(C.bgTop, C.bgBot));
  navbar(f, true, 'Visão Geral');
  let y = NAV_H + 16;
  mkText(f, 16, y, 'Visão geral da plataforma', 20, C.cyan); y += 44;
  const kW = Math.floor((FW - 48) / 3);
  [['Média geral','7.8'],['% aprovação','72%'],['Certificados','89']].forEach(([lbl, val], i) => {
    card(f, lbl, 16 + i * (kW + 8), y, kW, 88, val, lbl, 14);
  }); y += 104;
  mkText(f, 16, y, 'Desempenho por curso', 16, C.white); y += 32;
  [['JavaScript Avançado',8.2,'87%'],['React Fundamentals',7.9,'75%'],['Node.js & APIs',7.1,'68%'],['TypeScript Pro',8.5,'90%'],['SQL & PostgreSQL',6.8,'61%']].forEach(([nm, avg, ap]) => {
    const c2 = mkFrame(f, nm, 16, y, FW - 32, 68, lgV(C.cardTop, C.cardBot), 14);
    Object.assign(c2, brd(C.border));
    mkText(c2, 16, 10, nm, 13, C.white, FW - 80);
    mkText(c2, 16, 36, `Média: ${avg}   |   Aprovação: ${ap}`, 12, C.cyan);
    y += 76;
  });
  y += 8;
  btn(f, 16, y, FW - 32, 52, 'Exportar relatório', 'primary');
  bottomNav(f, 0);
  return f;
}

// =============================================================================
//  PÁGINA DE TOKENS
// =============================================================================

function createTokensPage(page) {
  mkText(page, 0, -60, 'TECH QUEST — Design Tokens', 24, C.cyan);
  const swatches = [
    ['Fundo Primário Top',C.bgTop],['Fundo Primário Bot',C.bgBot],['Navbar',C.navBg],['Card Top',C.cardTop],
    ['Card Bot',C.cardBot],['Destaque Ciano',C.cyan],['Destaque Azul',C.blue],['Borda / Glow',C.border],
    ['Texto Principal',C.white],['Texto Secundário',C.textSec],['Botão Secundário',C.btnBg],
    ['Erro / Reprovado',C.red],['Sucesso / Aprovado',C.green],
  ];
  swatches.forEach((s, i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const sw = mkRect(page, col * 188, row * 104, 172, 68, sf(s[1]), 10);
    Object.assign(sw, brd(C.border));
    mkText(page, col * 188, row * 104 + 74, s[0], 11, C.textSec);
  });

  // Font sample
  const fontY = Math.ceil(swatches.length / 4) * 104 + 24;
  mkText(page, 0, fontY, 'Fonte: Monomaniac One', 22, C.cyan);
  mkText(page, 0, fontY + 36, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789', 16, C.white);

  // Button samples
  const bY = fontY + 90;
  mkText(page, 0, bY, 'Botões', 18, C.white);
  btn(page, 0, bY + 30, 200, 52, 'Primário', 'primary');
  btn(page, 216, bY + 30, 200, 52, 'Secundário', 'secondary');
  btn(page, 432, bY + 30, 200, 52, 'Terciário', 'tertiary');
}

// =============================================================================
//  PÁGINA DE FLUXO (overview)
// =============================================================================

function createFlowPage(page) {
  mkText(page, 0, -80, 'TECH QUEST — Fluxo de Navegação', 28, C.cyan);

  const screens = [
    // row 0 — Aluno
    ['T01 — Home',0,0],['T02 — Login',200,0],['T03 — Cadastro',400,0],
    ['T04 — Dashboard Aluno',0,280],['T05 — Visualizar Conteúdo',200,280],['T06 — Realizar Atividade',400,280],
    ['T07 — Desempenho',600,280],['T08 — Medalhas & Títulos',800,280],
    ['T09 — Certificado',1000,280],['T10 — Editar Perfil',1200,280],
    // row 1 — Tutor
    ['T11 — Dashboard Tutor',0,560],['T12 — Gerenciar Conteúdo',200,560],['T13 — Criar / Editar Prova',400,560],
    ['T14 — Corrigir Atividade',600,560],['T15 — Aprovar / Reprovar Aluno',800,560],
    // row 2 — Admin
    ['T16 — Dashboard Admin',0,840],['T17 — Gerenciar Usuários',200,840],['T18 — Gerenciar Cursos',400,840],
    ['T19 — Parâmetros de Pontuação',600,840],['T20 — Relatório Geral',800,840],
  ];

  screens.forEach(([name, x, y]) => {
    const th = mkFrame(page, name, x, y, 182, 264, lgV(C.bgTop, C.bgBot), 16);
    Object.assign(th, brd(C.border));
    mkRect(th, 0, 0, 182, 28, sf(C.navBg), 0);
    mkText(th, 8, 6, 'TECH', 10, C.cyan);
    mkText(th, 8, 32, name, 9, C.cyan, 166);
    for (let i = 0; i < 5; i++) {
      const lineW = 60 + (i * 23) % 80;
      mkRect(th, 8, 58 + i * 34, lineW, 12, sf(C.cardTop), 4);
    }
    mkRect(th, 0, 236, 182, 28, sf(C.dark), 0);
  });

  // Arrow labels for main flow
  const arrows = [
    [91, 136, 'Home → Login'],
    [541, 136, 'Login → Dashboard Aluno'],
    [741, 136, 'Login → Dashboard Tutor'],
    [941, 136, 'Login → Dashboard Admin'],
  ];
  arrows.forEach(([ax, ay, lbl]) => {
    mkText(page, ax, 270, '↓', 20, C.cyan);
  });
}

// =============================================================================
//  MAIN
// =============================================================================

async function main() {
  // Carrega a fonte
  try {
    await figma.loadFontAsync({ family: 'Monomaniac One', style: 'Regular' });
    FONT = 'Monomaniac One';
  } catch (_) {
    try {
      await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
      FONT = 'Inter';
    } catch (e) {
      figma.closePlugin('Erro ao carregar fonte: ' + e.message);
      return;
    }
  }

  const doc = figma.root;

  function getOrCreate(name) {
    return doc.children.find(p => p.name === name) || (() => { const p = figma.createPage(); p.name = name; return p; })();
  }

  const tokensPage = getOrCreate('🎨 Tokens');
  const alunoPage  = getOrCreate('📱 Telas — Aluno');
  const tutorPage  = getOrCreate('🧑‍🏫 Telas — Tutor');
  const adminPage  = getOrCreate('⚙️ Telas — Admin');
  const flowPage   = getOrCreate('🔗 Fluxo');

  // Tokens
  await figma.setCurrentPageAsync(tokensPage);
  createTokensPage(tokensPage);

  // Telas Aluno
  await figma.setCurrentPageAsync(alunoPage);
  t01_home(alunoPage);
  t02_login(alunoPage);
  t03_cadastro(alunoPage);
  t04_dashboard(alunoPage);
  t05_conteudo(alunoPage);
  t06_atividade(alunoPage);
  t07_desempenho(alunoPage);
  t08_medalhas(alunoPage);
  t09_certificado(alunoPage);
  t10_perfil(alunoPage);

  // Telas Tutor
  await figma.setCurrentPageAsync(tutorPage);
  t11_tutorDash(tutorPage);
  t12_gerenciarConteudo(tutorPage);
  t13_criarProva(tutorPage);
  t14_corrigir(tutorPage);
  t15_aprovar(tutorPage);

  // Telas Admin
  await figma.setCurrentPageAsync(adminPage);
  t16_adminDash(adminPage);
  t17_usuarios(adminPage);
  t18_cursos(adminPage);
  t19_parametros(adminPage);
  t20_relatorio(adminPage);

  // Fluxo
  await figma.setCurrentPageAsync(flowPage);
  createFlowPage(flowPage);

  // Remove Page 1 vazia se existir
  const p1 = doc.children.find(p => p.name === 'Page 1');
  if (p1 && p1.children.length === 0) {
    try { figma.removePage(p1); } catch (_) {}
  }

  figma.closePlugin(`✅ Tech Quest criado! 20 telas em 5 páginas. Fonte: ${FONT}`);
}

main().catch(err => figma.closePlugin('❌ Erro: ' + err.message));
