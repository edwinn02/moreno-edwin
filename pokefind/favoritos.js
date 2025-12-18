window.onload = async () => {

    const fav = Storage.getFavorites();
    let html = "";

    for (let id of fav) {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon/" + id);
        const p = await res.json();

        html += `
        <div class="brut-card">
            <h3>${p.name}</h3>
            <img src="${p.sprites.front_default}">
            <button onclick="Storage.removeFavorite(${p.id}); location.reload()">❌</button>
        </div>
        `;
    }

    document.querySelector("#contenido").innerHTML = html;
};
