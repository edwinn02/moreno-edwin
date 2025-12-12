/* =========================================================
   Módulo Compartido: Storage, Caché y Utilidades
   Patrón: IIFE
   ========================================================= */

const Storage = (() => {

    const TTL = 24 * 60 * 60 * 1000; // 24h

    function save(key, value) {
        localStorage.setItem(key, JSON.stringify({
            timestamp: Date.now(),
            data: value
        }));
    }

    function load(key) {
        const item = JSON.parse(localStorage.getItem(key));
        if (!item) return null;

        const expired = (Date.now() - item.timestamp) > TTL;
        return {
            expired,
            data: item.data
        };
    }

    function remove(key) {
        localStorage.removeItem(key);
    }

    function clearAll() {
        localStorage.clear();
    }

    // Histórico
    function addHistory(name) {
        let hist = JSON.parse(localStorage.getItem("hist")) || [];
        hist.unshift(name);
        localStorage.setItem("hist", JSON.stringify(hist));
    }

    function getHistory() {
        return JSON.parse(localStorage.getItem("hist")) || [];
    }

    function clearHistory() {
        localStorage.removeItem("hist");
    }

    // Favoritos
    function addFavorite(id) {
        let fav = JSON.parse(localStorage.getItem("fav")) || [];
        if (!fav.includes(id)) fav.push(id);
        localStorage.setItem("fav", JSON.stringify(fav));
    }

    function removeFavorite(id) {
        let fav = JSON.parse(localStorage.getItem("fav")) || [];
        fav = fav.filter(x => x !== id);
        localStorage.setItem("fav", JSON.stringify(fav));
    }

    function getFavorites() {
        return JSON.parse(localStorage.getItem("fav")) || [];
    }

    function clearFavorites() {
        localStorage.removeItem("fav");
    }

    return {
        save, load, remove, clearAll,
        addHistory, getHistory, clearHistory,
        addFavorite, removeFavorite, getFavorites, clearFavorites,
        TTL
    };
})();

/* ===============================
   🌑 Tema Oscuro / Claro
   =============================== */

(function(){
    const btn = document.getElementById("themeToggle");
    if (!btn) return;

    // cargar preferencia
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
        btn.textContent = "Modo Claro";
    }

    btn.addEventListener("click", () => {
        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            localStorage.setItem("theme", "dark");
            btn.textContent = "Modo Claro";
        } else {
            localStorage.setItem("theme", "light");
            btn.textContent = "Modo Oscuro";
        }
    });

})();

