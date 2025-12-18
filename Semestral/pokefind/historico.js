/* historico.js - listado con opción de borrar individual */

window.onload = () => {
    renderHist();
};

function renderHist() {
    const lista = Storage.getHistory();

    if (lista.length === 0) {
        document.querySelector("#lista").innerHTML = `<div class="brut-card">No hay búsquedas</div>`;
        return;
    }

    // crear elementos con botón eliminar
    const html = lista.map((x, idx) => `
        <li class="brut-card" style="display:flex; justify-content:space-between; align-items:center;">
            <div style="flex:1;">
                <button class="button" onclick="goto('${x}')">${x}</button>
            </div>
            <div>
                <button class="button" onclick="borrarItem(${idx})">Eliminar</button>
            </div>
        </li>
    `).join("");

    document.querySelector("#lista").innerHTML = html;
}

function goto(x) {
    location.href = "index.html?buscar=" + encodeURIComponent(x);
}

function borrarItem(index) {
    let hist = JSON.parse(localStorage.getItem("hist")) || [];
    // índice 0 es el más reciente — eliminamos el índice recibido
    if (index >= 0 && index < hist.length) {
        hist.splice(index, 1);
        localStorage.setItem("hist", JSON.stringify(hist));
    }
    renderHist();
}
