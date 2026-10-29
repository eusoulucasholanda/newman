/* New Man: armário interativo, lista e escolha da casa no WhatsApp. */
(function () {
  "use strict";

  document.documentElement.classList.add("js");
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Dados das casas (confirmar horário e endereço de Ponte Alta com o Ruan) ---------- */
  var CASAS = {
    pa: {
      nome: "New Man Barbearia",
      curto: "Ponte Alta",
      whatsapp: "5561986397543",
      endereco: "Ponte Alta, Gama, DF",
      horario: "Horário a confirmar",
      mapa: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("New Man Barbearia Ponte Alta Gama DF")
    },
    ac: {
      nome: "Studio New Man Men's Club",
      curto: "Águas Claras",
      whatsapp: "5561998038477",
      endereco: "Av. das Araucárias, Península, loja 37, Águas Claras, DF",
      horario: "Segunda a sábado, 10h às 20h",
      mapa: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Studio New Man Men's Club Av. das Araucárias Águas Claras DF")
    }
  };

  /* ---------- Ilustrações do armário (viewBox 120 x 150, base do objeto em y = 148) ---------- */
  function txt(x, y, tam, cor, t, fonte, esp) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-family="' + (fonte || "Rye, serif") + '" font-size="' + tam + '" fill="' + cor + '" letter-spacing="' + (esp || 0.6) + '">' + t + "</text>";
  }
  var sombra = '<ellipse cx="60" cy="147" rx="36" ry="3.5" fill="#000" opacity=".55"/>';
  var brilho = function (x, y, h) { return '<rect x="' + x + '" y="' + y + '" width="4" height="' + h + '" rx="2" fill="#fff" opacity=".18"/>'; };

  var DESENHOS = {
    tesoura:
      '<rect x="36" y="138" width="48" height="9" rx="2" fill="url(#gWood)"/>' +
      '<path d="M57 84 L41 14 L48.5 15 L63.5 82 Z" fill="url(#gSteel)"/>' +
      '<path d="M63 84 L79 14 L71.5 15 L56.5 82 Z" fill="url(#gSteel)"/>' +
      '<path d="M57 84 L49 116 M63 84 L71 116" stroke="url(#gBrass)" stroke-width="6" stroke-linecap="round" fill="none"/>' +
      '<circle cx="45" cy="126" r="11" fill="none" stroke="url(#gBrass)" stroke-width="5.5"/>' +
      '<circle cx="75" cy="126" r="11" fill="none" stroke="url(#gBrass)" stroke-width="5.5"/>' +
      '<circle cx="60" cy="82" r="4" fill="#271E15" stroke="#ecd0bb" stroke-width="1.5"/>',
    navalha:
      '<path d="M26 143 L36 147 L84 58 L75 53 Z" fill="#17120f"/>' +
      '<path d="M29 142 L77 55" stroke="#fff" stroke-opacity=".12" stroke-width="1.5"/>' +
      '<circle cx="33" cy="141" r="2.4" fill="#ecd0bb"/><circle cx="79" cy="57" r="2.6" fill="#ecd0bb"/>' +
      '<path d="M77 52 L89 56 L104 118 Q102 128 92 125 L80 64 Z" fill="url(#gSteel)"/>' +
      '<path d="M89 56 L104 118" stroke="#fff" stroke-opacity=".6" stroke-width=".8"/>',
    pincel:
      '<path d="M30 104 h52 v36 a6 6 0 0 1 -6 6 h-40 a6 6 0 0 1 -6 -6 Z" fill="url(#gBlack)"/>' +
      '<path d="M82 112 q16 0 16 12 q0 12 -16 12" fill="none" stroke="url(#gBlack)" stroke-width="6"/>' +
      '<rect x="30" y="118" width="52" height="14" fill="url(#gKraft)"/>' + txt(56, 128, 7, "#271E15", "NEWMAN") +
      '<ellipse cx="56" cy="104" rx="26" ry="5" fill="url(#gFoam)"/>' +
      '<g transform="rotate(14 66 80)"><rect x="57" y="66" width="18" height="34" rx="6" fill="url(#gWood)"/>' +
      '<rect x="56" y="64" width="20" height="5" rx="2" fill="url(#gBrass)"/>' +
      '<path d="M53 66 C50 46 56 30 66 28 C76 30 82 46 79 66 Z" fill="url(#gKraft)"/>' +
      '<path d="M57 60 C56 46 60 36 66 33" stroke="#fff" stroke-opacity=".45" stroke-width="2" fill="none"/></g>' + brilho(35, 108, 32),
    pinca:
      '<path d="M40 146 h40 l5 -50 h-50 Z" fill="url(#gGlass)" stroke="rgba(255,255,255,.28)"/>' +
      '<path d="M59 30 L52 132 L55.5 132 L61 34 Z" fill="url(#gBrass)"/>' +
      '<path d="M61 30 L69 132 L65.5 132 L59 34 Z" fill="url(#gBrass)"/>' +
      '<rect x="55" y="26" width="10" height="8" rx="3" fill="url(#gBrass)"/>' +
      '<g transform="rotate(-12 48 80)"><rect x="44" y="48" width="8" height="86" rx="3" fill="url(#gWood)"/></g>' +
      '<rect x="42" y="102" width="4" height="40" rx="2" fill="#fff" opacity=".2"/>',
    toalha:
      '<g class="vapor-svg" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-linecap="round">' +
      '<path d="M46 92 q-6 -10 0 -18 q6 -8 0 -18"/><path d="M60 88 q-6 -10 0 -18 q6 -8 0 -18"/><path d="M74 92 q-6 -10 0 -18 q6 -8 0 -18"/></g>' +
      '<rect x="14" y="122" width="46" height="24" rx="12" fill="url(#gCream)"/><circle cx="26" cy="134" r="10" fill="#f4ede4"/><path d="M26 134 m-6 0 a6 6 0 1 1 6 6 a3.5 3.5 0 1 1 -3.5 -3.5" fill="none" stroke="#a99d90" stroke-width="1.4"/>' +
      '<rect x="60" y="122" width="46" height="24" rx="12" fill="url(#gCream)"/><circle cx="72" cy="134" r="10" fill="#f4ede4"/><path d="M72 134 m-6 0 a6 6 0 1 1 6 6 a3.5 3.5 0 1 1 -3.5 -3.5" fill="none" stroke="#a99d90" stroke-width="1.4"/>' +
      '<rect x="37" y="99" width="46" height="24" rx="12" fill="url(#gCream)"/><circle cx="49" cy="111" r="10" fill="#f4ede4"/><path d="M49 111 m-6 0 a6 6 0 1 1 6 6 a3.5 3.5 0 1 1 -3.5 -3.5" fill="none" stroke="#a99d90" stroke-width="1.4"/>' +
      '<rect x="37" y="106" width="46" height="3" fill="#271E15" opacity=".8"/>',
    borrifador:
      '<rect x="40" y="82" width="40" height="64" rx="9" fill="url(#gAmber)"/>' +
      '<rect x="50" y="70" width="20" height="13" fill="url(#gBrass)"/>' +
      '<path d="M44 56 h40 l10 5 v7 h-13 v-4 h-37 Z" fill="url(#gBlack)"/>' +
      '<path d="M60 68 q-4 11 -11 14 l2 4 q9 -3 13 -16 Z" fill="url(#gBlack)"/>' +
      '<rect x="44" y="100" width="32" height="28" rx="2" fill="url(#gKraft)"/>' + txt(60, 113, 6.5, "#271E15", "TERAPIA") + txt(60, 121, 4.6, "#271E15", "CAPILAR", "General Sans, sans-serif", 1) +
      '<g fill="#fff" opacity=".5"><circle cx="100" cy="60" r="1.2"/><circle cx="106" cy="56" r="1"/><circle cx="104" cy="64" r=".9"/><circle cx="110" cy="61" r=".8"/></g>' + brilho(44, 86, 54),
    tigela:
      '<path d="M76 116 L100 54 L104 56 L82 117 Z" fill="#0d0b0a" stroke="url(#gBrass)" stroke-width="1"/>' +
      '<rect x="98" y="46" width="8" height="12" rx="2" transform="rotate(21 102 52)" fill="url(#gKraft)"/>' +
      '<path d="M26 116 h68 q-4 30 -34 30 q-30 0 -34 -30 Z" fill="url(#gBlack)"/>' +
      '<ellipse cx="60" cy="116" rx="34" ry="5.5" fill="#271E15"/>' +
      '<ellipse cx="60" cy="116.5" rx="29" ry="3.8" fill="#4a3324"/>' +
      '<path d="M32 122 q4 18 28 20" stroke="#fff" stroke-opacity=".14" stroke-width="2" fill="none"/>',
    cartao:
      '<g transform="rotate(-6 60 110)"><rect x="20" y="78" width="80" height="54" rx="6" fill="url(#gBlack)" stroke="#CDA78F" stroke-width="1"/>' +
      '<rect x="20" y="78" width="80" height="54" rx="6" fill="url(#gGlass)" opacity=".5"/>' +
      '<use href="#tesoura" x="28" y="86" width="16" height="16" color="#CDA78F"/>' +
      txt(60, 117, 8.5, "#CDA78F", "MEMBRO", null, 1.6) + txt(60, 126, 4.6, "#fff", "PONTE ALTA", "General Sans, sans-serif", 1.4) + "</g>" +
      '<rect x="32" y="132" width="56" height="14" rx="2" fill="url(#gWood)"/><rect x="36" y="132" width="48" height="2" fill="#000" opacity=".6"/>',
    pomada:
      '<rect x="28" y="98" width="64" height="48" rx="5" fill="url(#gBlack)"/>' +
      '<rect x="28" y="112" width="64" height="20" fill="url(#gKraft)"/>' + txt(60, 125.5, 8, "#271E15", "NEWMAN") +
      '<rect x="25" y="86" width="70" height="15" rx="4" fill="url(#gBrass)"/><rect x="27" y="87" width="66" height="2.5" rx="1.2" fill="#fff" opacity=".35"/>' + brilho(34, 100, 44),
    po:
      '<rect x="42" y="72" width="36" height="74" rx="6" fill="url(#gCream)"/>' +
      '<rect x="42" y="96" width="36" height="32" fill="#0a0807"/>' + txt(60, 112, 10, "#fff", "PÓ") + txt(60, 121, 4.8, "#CDA78F", "TEXTURIZADOR", "General Sans, sans-serif", .6) +
      '<rect x="40" y="58" width="40" height="16" rx="4" fill="url(#gBlack)"/>' +
      '<g stroke="#fff" stroke-opacity=".15"><path d="M46 60v12M52 60v12M58 60v12M64 60v12M70 60v12M76 60v12"/></g>' + brilho(46, 76, 66),
    oleo:
      '<rect x="38" y="80" width="44" height="66" rx="10" fill="url(#gAmber)"/>' +
      '<rect x="52" y="66" width="16" height="16" fill="url(#gAmber)"/>' +
      '<rect x="49" y="58" width="22" height="10" rx="2" fill="url(#gBrass)"/>' +
      '<rect x="53" y="34" width="14" height="26" rx="7" fill="url(#gBlack)"/>' +
      '<rect x="42" y="100" width="36" height="28" rx="2" fill="url(#gKraft)"/>' + txt(60, 113, 8, "#271E15", "ÓLEO") + txt(60, 121.5, 5, "#271E15", "BARBA", "General Sans, sans-serif", 1.2) + brilho(43, 84, 56),
    balm:
      '<rect x="26" y="126" width="68" height="20" rx="3" fill="url(#gBlack)"/>' +
      '<rect x="24" y="118" width="72" height="10" rx="3" fill="url(#gBrass)"/>' + txt(60, 141, 8, "#CDA78F", "BALM") +
      '<rect x="34" y="98" width="52" height="18" rx="3" fill="url(#gBlack)"/>' +
      '<rect x="32" y="92" width="56" height="8" rx="3" fill="url(#gBrass)"/>' + txt(60, 111, 5, "#CDA78F", "NEWMAN", null, 1),
    shampoo:
      '<rect x="38" y="62" width="44" height="84" rx="12" fill="url(#gCream)"/>' +
      '<rect x="42" y="88" width="36" height="38" fill="#0a0807"/>' + txt(60, 103, 6.5, "#CDA78F", "NEWMAN") + txt(60, 114, 5, "#fff", "SHAMPOO", "General Sans, sans-serif", 1.2) +
      '<rect x="52" y="50" width="16" height="13" fill="url(#gBlack)"/>' +
      '<rect x="57" y="44" width="6" height="7" fill="url(#gBlack)"/>' +
      '<rect x="46" y="38" width="28" height="8" rx="3" fill="url(#gBlack)"/><rect x="70" y="40" width="16" height="4" rx="2" fill="url(#gBlack)"/>' + brilho(43, 68, 72),
    locao:
      '<path d="M42 146h36a6 6 0 0 0 6-6V98c0-9-8-14-14-17V68H50v13c-6 3-14 8-14 17v42a6 6 0 0 0 6 6z" fill="url(#gAmber)"/>' +
      '<rect x="48" y="54" width="24" height="16" rx="3" fill="url(#gBrass)"/><ellipse cx="60" cy="53" rx="9" ry="4" fill="url(#gBrass)"/>' +
      '<rect x="44" y="104" width="32" height="26" rx="1" fill="url(#gKraft)"/>' + txt(60, 116, 6.5, "#271E15", "LOÇÃO") + txt(60, 124, 4.4, "#271E15", "PÓS-BARBA", "General Sans, sans-serif", .8) +
      '<path d="M41 100 c0-6 5-10 10-12" stroke="#fff" stroke-opacity=".35" stroke-width="2.5" fill="none" stroke-linecap="round"/>' + brilho(41, 104, 36),
    pente: (function () {
      var dentes = "";
      for (var x = 30; x <= 88; x += 4) dentes += '<rect x="' + x + '" y="72" width="2.4" height="' + (x > 60 ? 22 : 30) + '" rx="1" fill="url(#gWood)"/>';
      return '<g transform="rotate(-64 60 110)"><rect x="24" y="60" width="72" height="14" rx="5" fill="url(#gWood)"/>' + dentes +
        '<rect x="26" y="62" width="68" height="2" rx="1" fill="#fff" opacity=".2"/></g>' +
        '<rect x="34" y="134" width="52" height="12" rx="2" fill="url(#gBlack)"/>' + txt(60, 143, 5.5, "#CDA78F", "NEWMAN", null, 1);
    })(),
    kit:
      '<rect x="26" y="98" width="68" height="48" rx="3" fill="url(#gKraft)"/>' +
      '<rect x="23" y="90" width="74" height="13" rx="2" fill="#b48d74"/>' +
      '<rect x="56" y="90" width="8" height="56" fill="#0a0807"/>' +
      '<path d="M60 90 C48 78 40 84 46 90 Z M60 90 C72 78 80 84 74 90 Z" fill="#0a0807"/>' +
      '<rect x="66" y="112" width="20" height="13" rx="1.5" fill="#fff" transform="rotate(-8 76 118)"/>' + txt(76, 121, 4.4, "#271E15", "PRA VOCÊ", "General Sans, sans-serif", .4)
  };
  function desenho(chave) {
    return '<svg viewBox="0 0 120 150" aria-hidden="true" focusable="false">' + sombra + DESENHOS[chave] + "</svg>";
  }

  /* ---------- Itens do armário ----------
     Serviços vêm do menu do Studio (agosto/2026). Produtos são exemplos até a casa confirmar o que vende. */
  var ITENS = [
    { id: "corte", tipo: "servico", nome: "Corte New Man", etiqueta: "Corte", desenho: "tesoura", casas: ["pa", "ac"],
      desc: "Consultoria, corte sob medida, lavagem e finalização profissional.",
      rotulo: "O que inclui", inclui: ["Consultoria", "Corte personalizado", "Lavagem", "Finalização"] },
    { id: "barba", tipo: "servico", nome: "Barba New Man", etiqueta: "Barba", desenho: "navalha", casas: ["pa", "ac"],
      desc: "Desenho da barba, toalha quente e acabamento na navalha.",
      rotulo: "O que inclui", inclui: ["Desenho", "Toalha quente", "Navalha", "Balm e óleo"] },
    { id: "corte-barba", tipo: "servico", nome: "Corte + Barba", etiqueta: "Corte + barba", desenho: "pincel", casas: ["pa", "ac"], destaque: "Mais pedido",
      desc: "O atendimento completo: cabelo e barba lidos juntos, para um resultado que conversa.",
      rotulo: "O que inclui", inclui: ["Consultoria", "Corte", "Barba na toalha quente", "Lavagem", "Finalização"] },
    { id: "sobrancelha", tipo: "servico", nome: "Sobrancelha", etiqueta: "Sobrancelha", desenho: "pinca", casas: ["pa", "ac"],
      desc: "Alinhamento masculino que mantém a naturalidade do olhar.",
      rotulo: "Opções", inclui: ["Na navalha", "Com pinça, fio a fio"] },
    { id: "pele", tipo: "servico", nome: "Ritual de pele", etiqueta: "Pele", desenho: "toalha", casas: ["pa", "ac"],
      desc: "Limpeza, esfoliação, máscara e hidratação para a pele respirar.",
      rotulo: "Opções", inclui: ["Detox facial", "Máscara black", "Esfoliação"] },
    { id: "terapia", tipo: "servico", nome: "Terapia capilar", etiqueta: "Terapia", desenho: "borrifador", casas: ["pa", "ac"],
      desc: "Tratamento de verdade para o fio: diagnóstico antes, cuidado sob medida depois.",
      rotulo: "Opções", inclui: ["Hidratação", "Nutrição", "Reconstrução", "Detox capilar"] },
    { id: "cor", tipo: "servico", nome: "Cor e camuflagem", etiqueta: "Cor", desenho: "tigela", casas: ["pa", "ac"],
      desc: "Fios brancos disfarçados com resultado natural. O valor sai depois do diagnóstico.",
      rotulo: "Opções", inclui: ["Camuflagem de brancos", "Barba", "Coloração", "Luzes", "Platinado"] },
    { id: "assinatura", tipo: "servico", nome: "Assinatura", etiqueta: "Assinatura", desenho: "cartao", casas: ["pa"], exclusivo: "Ponte Alta",
      desc: "Seu horário fica marcado todo mês. Sem fila, sem imprevisto, sem precisar lembrar.",
      rotulo: "Como funciona", inclui: ["Horário fixo", "Mesmo padrão sempre", "Só em Ponte Alta"] },

    { id: "pomada", tipo: "produto", nome: "Pomada modeladora", etiqueta: "Pomada", desenho: "pomada", casas: ["pa", "ac"],
      desc: "Para o penteado durar o dia inteiro, do jeito que saiu da cadeira.",
      rotulo: "Acabamento", inclui: ["Efeito seco", "Fixação média", "Lava fácil"] },
    { id: "po", tipo: "produto", nome: "Pó texturizador", etiqueta: "Pó", desenho: "po", casas: ["pa", "ac"],
      desc: "Volume e textura na raiz sem pesar, ideal para cabelo fino.",
      rotulo: "Acabamento", inclui: ["Volume", "Efeito natural"] },
    { id: "oleo", tipo: "produto", nome: "Óleo para barba", etiqueta: "Óleo", desenho: "oleo", casas: ["pa", "ac"],
      desc: "Amacia os fios, hidrata a pele embaixo da barba e tira a coceira.",
      rotulo: "Para", inclui: ["Barba média e longa", "Uso diário"] },
    { id: "balm", tipo: "produto", nome: "Balm para barba", etiqueta: "Balm", desenho: "balm", casas: ["pa", "ac"],
      desc: "Alinha os fios rebeldes e mantém a barba no lugar.",
      rotulo: "Para", inclui: ["Modelar", "Hidratar"] },
    { id: "shampoo", tipo: "produto", nome: "Shampoo", etiqueta: "Shampoo", desenho: "shampoo", casas: ["pa", "ac"],
      desc: "Limpeza na medida para cabelo e barba, sem ressecar.",
      rotulo: "Para", inclui: ["Cabelo", "Barba"] },
    { id: "locao", tipo: "produto", nome: "Loção pós-barba", etiqueta: "Pós-barba", desenho: "locao", casas: ["pa", "ac"],
      desc: "Acalma a pele depois da navalha e deixa um perfume discreto.",
      rotulo: "Para", inclui: ["Pele sensível", "Depois de barbear"] },
    { id: "pente", tipo: "produto", nome: "Pente de madeira", etiqueta: "Pente", desenho: "pente", casas: ["pa", "ac"],
      desc: "Desembaraça sem eletricidade estática. Cabe no bolso.",
      rotulo: "Para", inclui: ["Cabelo", "Barba"] },
    { id: "kit", tipo: "produto", nome: "Kit presente", etiqueta: "Kit presente", desenho: "kit", casas: ["pa", "ac"],
      desc: "Uma seleção da casa embalada para presentear. Monte junto com o barbeiro.",
      rotulo: "Montado com", inclui: ["Produtos à escolha", "Embalagem da casa"] }
  ];
  var porId = {};
  ITENS.forEach(function (it) { porId[it.id] = it; });

  /* ---------- Utilidades ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var celular = function () { return window.matchMedia("(max-width: 900px)").matches; };
  var guardar = {
    ler: function (k, padrao) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : padrao; } catch (e) { return padrao; } },
    gravar: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento: segue sem salvar */ } }
  };
  function linkWa(casa, msg) { return "https://wa.me/" + CASAS[casa].whatsapp + "?text=" + encodeURIComponent(msg); }
  function vibra() { if (navigator.vibrate) { try { navigator.vibrate(10); } catch (e) { } } }
  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("on"); }, 2200);
  }
  var ICONE_CHECK = '<svg class="check" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICONE_X = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

  /* ---------- Dados das casas na página ---------- */
  $$("[data-campo]").forEach(function (el) {
    var p = el.dataset.campo.split("-");
    el.textContent = CASAS[p[1]][p[0]];
  });
  $$("[data-wa-casa]").forEach(function (a) {
    a.href = linkWa(a.dataset.waCasa, "Olá! Vim pelo site e quero agendar um horário na unidade " + CASAS[a.dataset.waCasa].curto + ".");
  });
  $$("[data-mapa]").forEach(function (a) { a.href = CASAS[a.dataset.mapa].mapa; });
  $$("[data-wa-assinatura]").forEach(function (a) {
    a.href = linkWa("pa", "Olá! Vim pelo site e quero conhecer a assinatura da New Man Barbearia.");
  });

  /* ---------- Abertura ---------- */
  var intro = $("#intro");
  function liberaHero() { document.body.classList.add("pronto"); }
  var jaViu = false;
  try { jaViu = sessionStorage.getItem("nm-intro") === "1"; } catch (e) { }
  if (reduz || jaViu || !intro) {
    if (intro) intro.remove();
    liberaHero();
  } else {
    var fechaIntro = function () {
      if (!intro.isConnected || intro.classList.contains("abre")) return;
      intro.classList.add("abre");
      liberaHero();
      try { sessionStorage.setItem("nm-intro", "1"); } catch (e) { }
      setTimeout(function () { intro.remove(); }, 1100);
    };
    setTimeout(fechaIntro, 1450);
    window.addEventListener("pointerdown", fechaIntro, { once: true });
    window.addEventListener("keydown", fechaIntro, { once: true });
  }

  /* ---------- Topo e pílula ---------- */
  var topo = $("#topo");
  var pilula = $("#pilula");
  function aoRolar() {
    var y = window.scrollY;
    topo.classList.toggle("rolou", y > 30);
    pilula.classList.toggle("visivel", y > window.innerHeight * 0.5 || lista.length > 0);
  }
  window.addEventListener("scroll", aoRolar, { passive: true });

  /* ---------- Lista ---------- */
  var lista = guardar.ler("nm-lista", []).filter(function (l) { return porId[l.id]; });
  function salvaLista() { guardar.gravar("nm-lista", lista); }
  function naLista(id) { return lista.some(function (l) { return l.id === id; }); }
  function totalItens() { return lista.reduce(function (s, l) { return s + l.qtd; }, 0); }

  function atualizaContador(pular) {
    var n = totalItens();
    var el = $("#pilulaN");
    el.textContent = n;
    pilula.setAttribute("aria-label", "Sua lista, " + n + (n === 1 ? " item" : " itens"));
    if (pular) {
      pilula.classList.remove("pulo");
      void pilula.offsetWidth;
      pilula.classList.add("pulo");
    }
    $$(".item").forEach(function (b) { b.classList.toggle("na-lista", naLista(b.dataset.id)); });
    aoRolar();
  }

  function adiciona(id, origem) {
    if (naLista(id)) return;
    lista.push({ id: id, qtd: 1 });
    salvaLista();
    vibra();
    voa(id, origem, function () { atualizaContador(true); });
    toast(porId[id].nome + " na sua lista");
    renderLista();
  }
  function remove(id) {
    lista = lista.filter(function (l) { return l.id !== id; });
    salvaLista();
    atualizaContador(false);
    renderLista();
    if (selecionado === id) renderFichaBotao();
  }
  function muda(id, d) {
    lista.forEach(function (l) { if (l.id === id) l.qtd = Math.max(1, Math.min(9, l.qtd + d)); });
    salvaLista();
    atualizaContador(false);
    renderLista();
  }

  /* o objeto voa do armário até a pílula */
  function voa(id, origem, fim) {
    if (reduz || !origem) { fim(); return; }
    var r = origem.getBoundingClientRect();
    var p = pilula.getBoundingClientRect();
    if (!r.width || p.width === 0) { fim(); return; }
    var clone = document.createElement("div");
    clone.className = "voando";
    clone.innerHTML = desenho(porId[id].desenho);
    clone.style.left = r.left + "px";
    clone.style.top = r.top + "px";
    clone.style.width = r.width + "px";
    clone.style.height = r.height + "px";
    document.body.appendChild(clone);
    var dx = p.left + p.width - 30 - (r.left + r.width / 2);
    var dy = p.top + p.height / 2 - (r.top + r.height / 2);
    var anim = clone.animate([
      { transform: "translate(0,0) scale(1) rotate(0)", opacity: 1 },
      { transform: "translate(" + dx * 0.45 + "px," + (dy * 0.25 - 120) + "px) scale(.75) rotate(-12deg)", opacity: 1, offset: 0.45 },
      { transform: "translate(" + dx + "px," + dy + "px) scale(.12) rotate(10deg)", opacity: 0.2 }
    ], { duration: 780, easing: "cubic-bezier(.5,0,.3,1)" });
    anim.onfinish = function () { clone.remove(); fim(); };
  }

  var elLista = $("#lista"), veu = $("#veu");
  function renderLista() {
    var ul = $("#listaItens");
    ul.innerHTML = "";
    lista.forEach(function (l) {
      var it = porId[l.id];
      var li = document.createElement("li");
      li.className = "lista__item";
      li.innerHTML =
        '<span class="lista__mini">' + desenho(it.desenho) + "</span>" +
        '<span><span class="lista__nome">' + it.nome + '</span><br><span class="lista__meta">' + (it.tipo === "servico" ? "Serviço" : "Produto") + (it.exclusivo ? ", só em " + it.exclusivo : "") + "</span></span>" +
        '<span class="lista__ctrl">' +
        (it.tipo === "produto"
          ? '<button class="qtd" type="button" data-menos aria-label="Diminuir quantidade de ' + it.nome + '">−</button><span class="qtd__n" aria-live="polite">' + l.qtd + '</span><button class="qtd" type="button" data-mais aria-label="Aumentar quantidade de ' + it.nome + '">+</button>'
          : "") +
        '<button class="tirar" type="button" data-tirar aria-label="Tirar ' + it.nome + ' da lista">' + ICONE_X + "</button></span>";
      li.querySelector("[data-tirar]").addEventListener("click", function () {
        li.classList.add("saindo");
        setTimeout(function () { remove(l.id); }, reduz ? 0 : 260);
      });
      var menos = li.querySelector("[data-menos]"), mais = li.querySelector("[data-mais]");
      if (menos) menos.addEventListener("click", function () { muda(l.id, -1); });
      if (mais) mais.addEventListener("click", function () { muda(l.id, 1); });
      ul.appendChild(li);
    });
    var vazia = lista.length === 0;
    $("#listaVazia").hidden = !vazia;
    $("#listaPe").hidden = vazia;
  }

  var ultimoFoco = null;
  function abreVeu() { veu.hidden = false; requestAnimationFrame(function () { veu.classList.add("on"); }); }
  function fechaVeu() {
    veu.classList.remove("on");
    setTimeout(function () { if (!veu.classList.contains("on")) veu.hidden = true; }, 350);
  }
  function abreLista() {
    ultimoFoco = document.activeElement;
    fechaFicha();
    renderLista();
    elLista.hidden = false;
    abreVeu();
    requestAnimationFrame(function () { elLista.classList.add("on"); });
    setTimeout(function () { $("[data-fechar-lista]", elLista).focus(); }, 60);
  }
  function fechaLista() {
    if (elLista.hidden) return;
    elLista.classList.remove("on");
    fechaVeu();
    setTimeout(function () { elLista.hidden = true; }, 500);
    if (ultimoFoco) ultimoFoco.focus();
  }
  pilula.addEventListener("click", abreLista);
  $$("[data-fechar-lista]").forEach(function (b) { b.addEventListener("click", fechaLista); });
  veu.addEventListener("click", function () { fechaLista(); fechaFicha(); });
  $("#listaEnviar").addEventListener("click", function () { abreEscolha({ modo: "lista" }); });

  /* ---------- Escolha da casa ---------- */
  var dlg = $("#escolha");
  function msgLista(casa) {
    var linhas = lista.filter(function (l) { return porId[l.id].casas.indexOf(casa) > -1; }).map(function (l) {
      var it = porId[l.id];
      return "• " + it.nome + (l.qtd > 1 ? " (" + l.qtd + "x)" : "");
    });
    return "Olá! Montei minha lista no site da New Man para a unidade " + CASAS[casa].curto + ":\n\n" + linhas.join("\n") + "\n\nPode me passar valores e horários?";
  }
  function abreEscolha(op) {
    var resumo = $("#escolhaResumo");
    ["pa", "ac"].forEach(function (casa) {
      var a = $('[data-opcao="' + casa + '"]', dlg);
      var aviso = $('[data-aviso="' + casa + '"]', dlg);
      var ok = true, txtAviso = "", href = "#";
      if (op.modo === "item") {
        var it = porId[op.id];
        ok = it.casas.indexOf(casa) > -1;
        txtAviso = ok ? "" : "Disponível só em " + it.exclusivo;
        href = linkWa(casa, "Olá! Vim pelo site da New Man e quero saber sobre: " + it.nome + ". Pode me passar valores e horários?");
        resumo.textContent = it.nome + ". Escolha a unidade e a conversa abre no WhatsApp.";
      } else if (op.modo === "lista") {
        var fora = lista.filter(function (l) { return porId[l.id].casas.indexOf(casa) === -1; });
        var dentro = lista.length - fora.length;
        ok = dentro > 0;
        if (fora.length) txtAviso = fora.map(function (l) { return porId[l.id].nome; }).join(", ") + " fica de fora: só em Ponte Alta.";
        href = ok ? linkWa(casa, msgLista(casa)) : "#";
        resumo.textContent = totalItens() + (totalItens() === 1 ? " item na lista." : " itens na lista.") + " A mensagem já vai pronta.";
      } else {
        href = linkWa(casa, "Olá! Vim pelo site e quero agendar um horário na unidade " + CASAS[casa].curto + ".");
        resumo.textContent = "A conversa abre no WhatsApp da unidade que você escolher.";
      }
      a.href = href;
      a.classList.toggle("off", !ok);
      a.setAttribute("aria-disabled", ok ? "false" : "true");
      a.tabIndex = ok ? 0 : -1;
      aviso.textContent = txtAviso;
    });
    // reinicia a animação de entrada das opções
    $$(".opcao", dlg).forEach(function (o) { o.style.animation = "none"; void o.offsetWidth; o.style.animation = ""; });
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  }
  $$(".opcao", dlg).forEach(function (a) {
    a.addEventListener("click", function () {
      if (a.classList.contains("off")) return;
      setTimeout(function () { dlg.close(); }, 150);
    });
  });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  $$("[data-agendar]").forEach(function (b) { b.addEventListener("click", function () { abreEscolha({ modo: "agendar" }); }); });

  /* ---------- Armário ---------- */
  var prateleiras = $("#prateleiras");
  var armarioEl = $("#armarioEl");
  var abaAtual = "servico";
  var selecionado = null;

  $$("[data-n]").forEach(function (s) {
    s.textContent = ITENS.filter(function (i) { return i.tipo === s.dataset.n; }).length;
  });

  function renderPrateleiras() {
    prateleiras.innerHTML = "";
    prateleiras.classList.toggle("tem-sel", !!selecionado && porId[selecionado].tipo === abaAtual);
    ITENS.filter(function (i) { return i.tipo === abaAtual; }).forEach(function (it, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "item" + (naLista(it.id) ? " na-lista" : "");
      b.dataset.id = it.id;
      b.style.setProperty("--i", i);
      b.style.setProperty("--giro", ((i * 37) % 7 - 3) + "deg");
      b.setAttribute("aria-pressed", selecionado === it.id ? "true" : "false");
      b.setAttribute("aria-label", it.nome + (it.exclusivo ? ", só em " + it.exclusivo : ""));
      b.innerHTML =
        '<span class="item__na-lista" aria-hidden="true">' + ICONE_CHECK + "</span>" +
        '<span class="item__obj">' + desenho(it.desenho) + "</span>" +
        '<span class="item__tabua" aria-hidden="true"></span>' +
        '<span class="item__barbante" aria-hidden="true"></span>' +
        '<span class="item__etiqueta">' + it.etiqueta + "</span>" +
        (it.exclusivo ? '<span class="item__exclusivo">só ' + it.exclusivo + "</span>" : "");
      b.addEventListener("click", function () { seleciona(it.id, true); });
      prateleiras.appendChild(b);
    });
    $("#lojaNota").hidden = abaAtual !== "produto";
  }

  function posicionaFoco() {
    var b = $('.item[aria-pressed="true"]', prateleiras);
    var miolo = $(".armario__miolo");
    if (!b) return;
    var r = b.getBoundingClientRect(), m = miolo.getBoundingClientRect();
    miolo.style.setProperty("--fx", (r.left + r.width / 2 - m.left) + "px");
    miolo.style.setProperty("--fy", (r.top + r.height * 0.4 - m.top) + "px");
  }

  function seleciona(id, peloUsuario) {
    selecionado = id;
    $$(".item", prateleiras).forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.id === id ? "true" : "false"); });
    prateleiras.classList.add("tem-sel");
    posicionaFoco();
    renderFicha(peloUsuario);
    if (peloUsuario) {
      vibra();
      if (celular()) abreFicha();
    }
  }

  /* troca de aba: as portas de vidro fecham, o conteúdo troca e elas abrem */
  var marca = $(".abas__marca");
  function moveMarca() {
    var ativa = $('.aba[aria-selected="true"]');
    marca.style.width = ativa.offsetWidth + "px";
    marca.style.transform = "translateX(" + ativa.offsetLeft + "px)";
  }
  $$(".aba").forEach(function (aba) {
    aba.addEventListener("click", function () {
      if (aba.dataset.aba === abaAtual) return;
      $$(".aba").forEach(function (a) { a.setAttribute("aria-selected", a === aba ? "true" : "false"); });
      prateleiras.setAttribute("aria-labelledby", aba.id);
      moveMarca();
      var troca = function () {
        abaAtual = aba.dataset.aba;
        var primeiro = ITENS.filter(function (i) { return i.tipo === abaAtual; })[0];
        selecionado = primeiro.id;
        renderPrateleiras();
        requestAnimationFrame(posicionaFoco);
        renderFicha(true);
      };
      if (reduz) { troca(); return; }
      armarioEl.classList.add("fechando");
      setTimeout(function () {
        troca();
        armarioEl.classList.remove("fechando");
      }, 440);
    });
    aba.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var outra = $$(".aba").filter(function (a) { return a !== aba; })[0];
      outra.focus();
      outra.click();
    });
  });

  /* ---------- Ficha ---------- */
  var ficha = $("#ficha");
  function renderFichaBotao() {
    var b = $("#fichaAdd");
    var dentro = naLista(selecionado);
    b.classList.toggle("ativo", dentro);
    b.innerHTML = dentro
      ? ICONE_CHECK + '<span class="btn--lista__txt">Na sua lista. Tocar para tirar</span>'
      : '<span class="btn--lista__txt">Adicionar à lista</span>';
  }
  function renderFicha(animar) {
    var it = porId[selecionado];
    if (!it) return;
    var obj = $("#fichaObj"), corpo = $(".ficha__corpo", ficha);
    obj.innerHTML = desenho(it.desenho);
    $("#fichaTipo").textContent = it.tipo === "servico" ? (it.destaque ? "Serviço, " + it.destaque.toLowerCase() : "Serviço") : "Produto";
    $("#fichaNome").textContent = it.nome;
    $("#fichaDesc").textContent = it.desc;
    $("#fichaRotulo").textContent = it.rotulo;
    $("#fichaLista").innerHTML = it.inclui.map(function (x) { return "<li>" + x + "</li>"; }).join("");
    $("#fichaCasas").innerHTML = ["pa", "ac"].map(function (c) {
      var tem = it.casas.indexOf(c) > -1;
      return '<span class="' + (tem ? "" : "nao") + '">' + CASAS[c].curto + (tem ? "" : ": não tem") + "</span>";
    }).join("");
    renderFichaBotao();
    if (animar && !reduz) {
      [obj, corpo].forEach(function (el) { el.classList.remove("troca"); void el.offsetWidth; el.classList.add("troca"); });
    }
  }
  $("#fichaAdd").addEventListener("click", function () {
    if (naLista(selecionado)) { remove(selecionado); toast(porId[selecionado].nome + " saiu da lista"); return; }
    adiciona(selecionado, $("#fichaObj"));
    renderFichaBotao();
  });
  $("#fichaWa").addEventListener("click", function () { abreEscolha({ modo: "item", id: selecionado }); });

  function abreFicha() {
    ficha.classList.add("on");
    abreVeu();
  }
  function fechaFicha() {
    if (!ficha.classList.contains("on")) return;
    ficha.classList.remove("on");
    fechaVeu();
  }
  $("[data-fechar-ficha]").addEventListener("click", fechaFicha);

  // arrastar a gaveta para baixo fecha
  var toqueY = null;
  ficha.addEventListener("touchstart", function (e) { toqueY = ficha.scrollTop <= 0 ? e.touches[0].clientY : null; }, { passive: true });
  ficha.addEventListener("touchmove", function (e) {
    if (toqueY === null || !celular()) return;
    var d = e.touches[0].clientY - toqueY;
    if (d > 0) { ficha.style.transition = "none"; ficha.style.transform = "translateY(" + d + "px)"; }
  }, { passive: true });
  ficha.addEventListener("touchend", function (e) {
    if (toqueY === null || !celular()) return;
    var d = e.changedTouches[0].clientY - toqueY;
    ficha.style.transition = "";
    ficha.style.transform = "";
    if (d > 90) fechaFicha();
    toqueY = null;
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { fechaLista(); fechaFicha(); }
  });

  /* ---------- Cartão da assinatura acompanha o dedo/mouse ---------- */
  var cartao = $("#cartao");
  if (cartao && !reduz) {
    var cena = cartao.parentElement;
    cena.addEventListener("pointermove", function (e) {
      var r = cartao.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      cartao.style.setProperty("--ry", ((x - 0.5) * 22) + "deg");
      cartao.style.setProperty("--rx", ((0.5 - y) * 16) + "deg");
      cartao.style.setProperty("--bx", (x * 100) + "%");
      cartao.style.setProperty("--by", (y * 100) + "%");
    });
    cena.addEventListener("pointerleave", function () {
      cartao.style.removeProperty("--rx");
      cartao.style.removeProperty("--ry");
    });
  }

  /* ---------- Galeria: duplica as fotos para a faixa rodar sem emenda ---------- */
  $$(".faixa__trilho").forEach(function (t) {
    $$("img", t).forEach(function (img) {
      var c = img.cloneNode(true);
      c.alt = "";
      c.setAttribute("aria-hidden", "true");
      t.appendChild(c);
    });
  });

  /* ---------- Início ---------- */
  selecionado = ITENS[0].id;
  renderPrateleiras();
  renderFicha(false);
  renderLista();
  atualizaContador(false);
  moveMarca();
  window.addEventListener("resize", function () { moveMarca(); posicionaFoco(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moveMarca(); posicionaFoco(); });
  window.addEventListener("load", posicionaFoco);
})();
