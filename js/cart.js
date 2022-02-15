/*
 * cart.js
 * =======
 * Winkelwagen management.
 * Klanten kunnen hier hun winkelwagen beheren.
*/
let winkelwagen = [];
let games = [];
let table_body = document.querySelector('#shopping-cart-table');
let minus_buttons = [];
let plus_buttons = [];

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
        activateEventHandlers();
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
                    <button data-game_id="${game.id}">-</button>
                    <span class="ml-2 mr-2">${item.amount}</span>
                    <button data-game_id="${game.id}">+</button>
                </td>
                <td class="text-right">&euro; ${game.price}</td>
                <td class="text-right">&euro; ${total.toFixed(2)}</td>
                <td class="text-center">
                    <button class="btn btn-danger btn-sm" data-game_id="${game.id}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>
            `;

            table_body.innerHTML += table_row;
        }
    });
}

function activateEventHandlers()
{
    minus_buttons = document.querySelectorAll('#shopping-cart-table tr td:nth-child(2) button:first-child');
    plus_buttons = document.querySelectorAll('#shopping-cart-table tr td:nth-child(2) button:last-child');
    
    minus_buttons.forEach( button => {
        button.addEventListener('click', decreaseAmount);
    });
    plus_buttons.forEach( button => {
        button.addEventListener('click', increaseAmount);
    });
}

function decreaseAmount(event)
{
    let total = 0.0;
    let element_total = document.querySelector('#shopping-cart-table tr td:nth-child(4)');
    let element_amount = event.target.parentElement.children[1];
    let game_id = event.target.dataset.game_id;
    let item_index = winkelwagen.findIndex(item => item.id == game_id);
    let game_index = games.findIndex(game => game.id == game_id);

    console.log(event);

    if(item_index > -1) {
        console.log('Index > -1');
        if(winkelwagen[item_index].amount > 1) {
            winkelwagen[item_index].amount--;
            console.log(winkelwagen[item_index]);

            total = parseFloat(games[game_index].price) * parseFloat(winkelwagen[item_index].amount); 
            element_total.innerHTML = `&euro; ${total.toFixed(2)}`;
            element_amount.innerHTML = winkelwagen[item_index].amount;
        }
    }


}

function increaseAmount(event)
{
    let total = 0.0;
    let element_total = document.querySelector('#shopping-cart-table tr td:nth-child(4)');
    let element_amount = document.querySelector('#shopping-cart-table tr td:nth-child(2) span');
    let game_id = event.target.dataset.game_id;
    let item_index = winkelwagen.findIndex(item => item.id == game_id);
    let game_index = games.findIndex(game => game.id == game_id);

    if(item_index > -1) {        
        winkelwagen[item_index].amount++;

        total = parseFloat(games[game_index].price) * parseFloat(winkelwagen[item_index].amount); 
        element_total.innerHTML = `&euro; ${total.toFixed(2)}`;
        element_amount.innerHTML = winkelwagen[item_index].amount;
    }
}