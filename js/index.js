// Winkelwagen data structuur
let winkelwagen = [];

// Constanten
const api_url = 'https://games-api.ao-alfacollege.nl/api/games';

// Elementen op de pagina
let shopping_cart_badge = document.querySelector('#cart-amount');
let gamecard_container = document.querySelector('#game-list');

let games = [];

window.onload = function () {
    loadGames();
};

/**
 * Asynchrone functie die bedoeld is om via het internet
 * een API aan te roepen met het verzoek om gegevens van alle
 * games in de database van de API te krijgen
 */
async function loadGames()
{
    /**
     * fetch
     * Dit is een standaard functie in JavaScript die in ons in staat
     * stelt een API aan te roepen.
     * 
     * Je ziet hieronder de fetch opdracht, de volgende zaken vallen op:
     * await    Hiermee geven we aan dat dit een aanroep is waar we op de
     *          achtergrond op moeten wachten. We wachten dan op een reactie
     *          van de API
     * .then 1  De eerste .then wordt geactiveerd zodra er een reactie is van de API
     *          De data die we van de API binnenkrijgen is nog in de vorm van een string
     *          om deze data in onze code te kunnen gebruiken transformeren we de ontvangen
     *          data eerst JSON-format (JavaScript Object Notation) naar een array met objecten
     *          in ons geval. Als dat klaar is zetten we de nieuwe format van data terug in de
     *          pijplijn voor een tweede .then. Dit is eigenlijk een standaard eerste stap.
     * .then 2  De tweede .then vangt nu data op die we bij de vorige .then terug in de pijplijn
     *          hebben geplaatst. Bij de tweede .then weten we nu dat de data in een format is die we
     *          in JavaScript kunnen gebruiken. Dus kennen we de ontvangen data nu toe aan een
     *          globale variabele in onze code.
     * .catch   Dit is het gedeelte van de call die eventuele fouten, die onvoorzien, kunnen optreden
     *          in de communicatie met een API opvangt. Zonder dat onze programma crashed kunnen we nu
     *          zelf bepalen wat we met zo'n fout willen doen.
     */
    await fetch(api_url)
        .then(response => response.json())
        .then(data => {
            // We weten nu zeker dat we de data in de juiste format hebben
            games = data;
            // Nadat we de data in de globale variabele hebben opgeslagen
            // willen we deze nu ook in de localstorage opslaan voor andere
            // html-bestanden van ons project.
            // Maar dit kan alleen in string format, dus met JSON.stringify
            // transformeren we de array met objecten om naar een JSON-format
            // string, zodat we deze later weer zonder problemen kunnen terug
            // transformeren
            localStorage.setItem('games', JSON.stringify(games));

            // Nu pas is de tijd aangebroken om de ontvangen games te laten zien
            showGames();

        })
        .catch(error => console.log(error));
}


/**
 * Laat alle games zien in de pagina
 */
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
                                    data-game_id="${game.id}"
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

    let buttons = document.querySelectorAll('.btn-group button:last-child');
    buttons.forEach( (button) => {
        button.addEventListener('click', handleBuyButtonClick);
    });
}

function handleBuyButtonClick(event)
{
    let game_id = event.target.dataset.game_id;
    let index = -1;

    // Stap 1 - Controleren of de game met de gegeven ID al in de array winkelwagen
    if(winkelwagen.length > 0) {
        index = winkelwagen.findIndex( item => {
            return item.id === game_id;
        });
    }

    if(index > -1) {
        // Stap 2
        winkelwagen[index].amount++;
    } else {
        // Stap 3
        let item = {
            id: game_id,
            amount: 1
        };

        winkelwagen.push(item);
    }

    // Stap 4 - We gaan daarna de badge gaan we het aantal bijwerken
    let total_amount = 0;
    winkelwagen.forEach( (item) => total_amount += item.amount);
    shopping_cart_badge.innerHTML = total_amount;
}