const GROQ_API_KEY = "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";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "openai/gpt-oss-120b";

// Verified company facts only. Do not let the model override these with guesses.
const COMPANY_CONTEXT = `Kingsley is Executive Assistant to Engr. Uwem Udoh, Managing Director/CEO of Well Manned Company Ltd (WellManned), an indigenous Nigerian oil & gas service provider based at 1 Osita Onyenwe Close, Off African Lane, Lekki Phase 1, Lagos. WellManned has 19+ years of post-incorporation experience.

Leadership: Engr. Uwem Udoh (MD/CEO), Engr. Horace Enemugwem (Business Development Manager), Ofon Udoh (Accounts/Admin Manager).

Three business segments:
1. Oil & Gas services: Integrated Project Management (IPM)/Turnkey Well Delivery, Drill Bits Supply, Asset & Reservoir Studies, Technical Manpower Supply, Field Development and Rehabilitation, Production Management and Optimization.
2. Protective Coating: Protective Coatings & Decorative Paints consultancy and supply, Corrosion Protection & Asset Integrity Solutions. WellManned distributes Jotun paints (jotun.com) as an OEM partner, alongside Beste, FeiLong, and ROL.
3. Infrastructure: Maritime Infrastructure Consultancy & Feasibility Studies.

Clients/partners on record: Welbeck Electricity Distribution Ltd (WEDL - IPP project management, e.g. Amuwo Odofin and Ojota IPPs), Platform Petroleum, Afren Energy Resources, Oando, Newcross Petroleum, Seplat, Sahara Group, NNPC, Sapetro, Brittania-U, Pillar Oil, Enageed Resources, Excel E&P, AMNI International, CP Oil/Pillar, Team Energy/Sapetro.

WellManned also runs Bluecharge (bluecharge.com/www.blueecharge.com), a power bank rental service currently active in NYSC camps and universities (expanding focus toward Jos, Keffi, Abuja, Nasarawa NYSC camps and Jos/Nasarawa state universities), where participants use ID cards to access power banks, with hubs planned to include free Wi-Fi.

Kingsley's own background before this role: 4+ years in Customer Success/CX across fintech, SaaS, and healthcare tech (Branch International, RxAll International, Sendme Food Technology).

CRITICAL: only use the facts given here and whatever the user provides in their question. If something is not covered here or in what the user typed, say plainly that it is not something you have confirmed, and ask rather than inventing a plausible-sounding answer. Never invent contract values, dates, regulatory percentages, or specific figures. When discussing oil & gas, IPP, or maritime concepts generally (not WellManned-specific), plain industry knowledge is fine, but flag anything you are not fully certain of instead of stating it with false confidence.`;

function renderMarkdown(el, text){
  if(window.marked){
    el.innerHTML = marked.parse(text);
  } else {
    el.textContent = text;
  }
}

function historyKey(page){ return 'history_' + page; }

function saveHistory(page, question, answer){
  try{
    const key = historyKey(page);
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    list.unshift({ q: question, a: answer, t: Date.now() });
    localStorage.setItem(key, JSON.stringify(list.slice(0, 25)));
  }catch(e){}
}

function loadHistory(page){
  try{ return JSON.parse(localStorage.getItem(historyKey(page)) || '[]'); }
  catch(e){ return []; }
}

function clearHistory(page){
  try{ localStorage.removeItem(historyKey(page)); }catch(e){}
}

function renderHistory(page, container, onSelect){
  const list = loadHistory(page);
  if(!list.length){ container.innerHTML = '<p class="hist-empty">Nothing asked yet on this page.</p>'; return; }
  container.innerHTML = list.map((item,i)=>{
    const d = new Date(item.t);
    const when = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    const preview = item.q.length > 70 ? item.q.slice(0,70) + '...' : item.q;
    return `<div class="hist-item" data-i="${i}"><span class="hist-when">${when}</span><span class="hist-q">${preview}</span></div>`;
  }).join('');
  container.querySelectorAll('.hist-item').forEach(elm=>{
    elm.addEventListener('click', ()=>{
      const item = list[parseInt(elm.dataset.i,10)];
      onSelect(item);
    });
  });
}
