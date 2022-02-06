/** CONSTANTEN */
const api_url = "https://games-api.ao-alfacollege.nl/api/games";

/** VARIABELEN */
let games = [];
let game_list_element = document.querySelector('#game-list');

/** ONLOAD */
window.onload = function() {
    getAllGames();
};


/** FUNCTIONS */
async function getAllGames()
{
    await fetch(api_url)
            .then(response => response.json())
            .then(data => {
                games = data;

                // Now show all games
                showGameCards();
            })
            .catch(error => console.error(error));
}

function showGameCards()
{
    games.forEach( (game) => {
        let game_card = `
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

        game_list_element.innerHTML += game_card;
    });
}