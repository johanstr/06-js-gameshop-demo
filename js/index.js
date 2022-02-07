// Winkelwagen daat structuur
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
            console.log(games);
        })
        .catch(error => console.log(error));
}



