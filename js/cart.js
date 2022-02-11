/*
 * cart.js
 * =======
 * Winkelwagen management.
 * Klanten kunnen hier hun winkelwagen beheren.
*/
let winkelwagen = [];
let games = [];
let table_body = document.querySelector('#shopping-cart-table');


window.onload = function () {
    loadData();

    if (winkelwagen.length === 0) {
        let table_row = `
            <tr>
                <td colspan="6">Uw winkelwagen is leeg</td>
            </tr>
        `;

        table_body.innerHTML = table_row;
    } else {
        showShoppingCart();
    }
};

function loadData()
{
    if (localStorage.getItem('winkelwagen'))
        winkelwagen = JSON.parse(localStorage.getItem('winkelwagen'));

    if(localStorage.getItem('games'))
        games = JSON.parse(localStorage.getItem('games'));
}

function showShoppingCart()
{
    winkelwagen.forEach((item) => {
        // Hieronder hadden we de vergelijking game.id === item.id
        // Maar deze werkt niet omdat game.id van het type int is en item.id van het type string
        // Drie is-tekens vergelijkt niet alleen de waarde maar ook het type
        // Daarom moeten we hier twee is-tekens plaatsen
        // Of we veranderen de voorwaarde in: parseInt(game.id) === parseInt(item.id)
        let index = games.findIndex((game) => game.id == item.id);
        
        let game = {};

        if (index > -1) {
            game = games[index];

            let total = parseFloat(item.amount) * parseFloat(game.price);

            let table_row = `
            <tr>
                <td colspan="2" class="text-left">
                    <img 
                        class="mr-4 mt-2 mb-2 shopping-cart-image" 
                        alt="${game.title}" 
                        title="${game.title}" 
                        src="${game.image}" 
                        contain 
                    />
                    <span class="game-title">${game.title}</span>
                </td>
                <td class="text-center">
                    <!-- Onderstaande icon moeten we op kunnen klikken -->
                    <i id="shopping-cart-minus" class="fa-solid fa-circle-minus" data-game_id="${game.id}"></i>
                    <span id="shopping-cart-amount" class="ml-2 mr-2">${item.amount}</span>
                    <!-- Onderstaande icon moeten we op kunnen klikken -->
                    <i id="shopping-cart-plus" class="fa-solid fa-circle-plus" data-game_id="${game.id}"></i>
                </td>
                <td id="game-price" class="text-right">&euro; ${game.price}</td>
                <td id="game-total" class="text-right">&euro; ${total.toFixed(2)}</td>
                <td class="text-center">
                    <!-- Op onderstaande button moeten we kunnen klikken -->
                    <button id="shopping-cart-delete-btn" class="btn btn-danger btn-sm" data-game_id="${game.id}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>
            `;

            table_body.innerHTML += table_row;
        }
    });
}