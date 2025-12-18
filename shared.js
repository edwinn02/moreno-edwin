/* shared.js - Storage y utilidades (IIFE) */

const Storage = (() => {
  const TTL = 24 * 60 * 60 * 1000; // 24h

  function save(key, value) {
    localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data: value }));
  }
  function load(key) {
    const item = localStorage.getItem(key);
    if (!item) return null;
    try {
      const parsed = JSON.parse(item);
      return { expired: (Date.now() - parsed.timestamp) > TTL, data: parsed.data };
    } catch(e){ return null; }
  }
  function remove(key){ localStorage.removeItem(key); }
  function clearAll(){ localStorage.clear(); }

  function addHistory(name){
    let hist = JSON.parse(localStorage.getItem("hist")||"[]");
    hist.unshift(name);
    localStorage.setItem("hist", JSON.stringify(hist));
  }
  function getHistory(){ return JSON.parse(localStorage.getItem("hist")||"[]"); }
  function clearHistory(){ localStorage.removeItem("hist"); }

  function addFavorite(id){
    let fav = JSON.parse(localStorage.getItem("fav")||"[]");
    if (!fav.includes(id)) fav.push(id);
    localStorage.setItem("fav", JSON.stringify(fav));
  }
  function removeFavorite(id){
    let fav = JSON.parse(localStorage.getItem("fav")||"[]");
    fav = fav.filter(x=>x!==id);
    localStorage.setItem("fav", JSON.stringify(fav));
  }
  function getFavorites(){ return JSON.parse(localStorage.getItem("fav")||"[]"); }
  function clearFavorites(){ localStorage.removeItem("fav"); }

  return { save, load, remove, clearAll, TTL,
           addHistory, getHistory, clearHistory,
           addFavorite, removeFavorite, getFavorites, clearFavorites };
})();

/* Theme toggle */
(function(){
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  const root = document.documentElement;
  // default light; dark toggles CSS variables
  if (localStorage.getItem("theme")==="dark"){
    document.body.classList.add("dark");
    btn.textContent = "Modo Claro";
  }
  btn.addEventListener("click", ()=>{
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")){
      localStorage.setItem("theme","dark"); btn.textContent = "Modo Claro";
    } else {
      localStorage.setItem("theme","light"); btn.textContent = "Modo Oscuro";
    }
  });
})();

/* Small helper for nav-sticker navigation - redirect to pages (basic) */
document.addEventListener("click", (e)=>{
  const target = e.target.closest && e.target.closest('.nav-sticker');
  if (target && target.dataset && target.dataset.target){
    const t = target.dataset.target;
    // mapping to pages - adjust names to your files
    if (t==="buscar") location.href = "index.html";
    if (t==="historico") location.href = "historico.html";
    if (t==="favoritos") location.href = "favoritos.html";
    if (t==="vs") location.href = "vs.html";
  }
});
