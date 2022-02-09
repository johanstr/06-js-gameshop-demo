// Winkelwagen data structuur
let winkelwagen = [
    {
        id: 1,
        amount: 1
    }
];

// Constanten
const api_url = 'https://games-api.ao-alfacollege.nl/api/games';

// Elementen op de pagina
let shopping_cart_badge = document.querySelector('#cart-amount');
let gamecard_container = document.querySelector('#game-list');

let games = [];

window.onload = function () {
    loadGames();
};

async function loadGames()
{
    await fetch(api_url)
        .then(response => response.json())
        .then(data => {
            games = data;
            localStorage.setItem('games', JSON.stringify(games));

            showGames();
        })
        .catch(error => console.log(error));
}


function showGames()
{
    games.forEach((game) => {
        let gamecard = `
            <div class="col-md-4">
                <div class="card mb-4 shadow-sm">
                    <img
                        class="bd-placeholder-img card-img-top game-img-top" 
                        src="${game.image}"
                        alt="${game.title}"
                        title="${game.title}"
                    />
                    <div class="card-body">
                        <p class="card-text">
                            ${game.description}
                        </p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                                <button type="button" class="btn btn-primary">
                                    <i class="fa fa-info"></i>&nbsp;Info
                                </button>
                                <button
                                    type="button"
                                    class="btn btn-success"
                                >
                                    <i class="fas fa-shopping-cart"></i>&nbsp;Kopen
                                </button>
                            </div>
                            <small class="text-muted price-tag">
                                &euro; ${game.price}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        `; 

        gamecard_container.innerHTML += gamecard;
    });
}

