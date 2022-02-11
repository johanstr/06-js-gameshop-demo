/**
 * VRAAG:
 * ======
 * Stel de pagina wordt herladen op de een of andere manier, de localstorage 
 * is voor het herladen al gevuld met een aantal games, wat gebeurd er dan
 * met de vorige inhoud van de winkelwagen na het herladen?
 */

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

/**
 * Deze functie handelt een klik op de KOPEN-button af
 * Wat doet deze functie wanneer er geklikt wordt:
 * Stap 1a.     Eerst controleren of er al iets in de winkelwagen zit
 * Stap 1b.     Zo ja, dan zoeken we of in de winkelwagen of de game er al in zit en
 *              geven we de index waarde terug als dat zo is
 * 
 * Stap 2a.     We controleren op basis van de index waarde of de game
 *              al in de winkelwagen zit.
 * Stap 2b.     Zo ja, dan verhogen we alleen het aantal in de winkelwagen.
 * Stap 2c.     Zo nee, dan voegen we de game als nog toe aan de winkelwagen en zetten
 *              het aantal op 1
 * 
 * Stap 3.      We laten het juiste aantal producten/items zien in de badge van de
 *              winkelwagen link in de header.
 * @param {informatie over het event gevuld door de browser} event 
 */
function handleBuyButtonClick(event)
{
    /**
     * Iedere button-tag heeft een data-..... attribuut waarin de game_id zit
     * Deze halen we hieronder binnen in een lokale variabele
     */
    let game_id = event.target.dataset.game_id;
    /**
     * We zetten de index waarde standaard op -1, wat betekent 'NIKS GEVONDEN'
     */
    let index = -1;

    // Stap 1a
    if (winkelwagen.length > 0) {
        // Stap 1b
        // Als de game al in de winkelwagen zit vullen we hier de lokale variabel index
        // met de juiste waarde, anders blijft deze -1
        index = winkelwagen.findIndex( item => item.id === game_id );
    }

    // Stap 2a
    if(index > -1) {
        // Stap 2b
        winkelwagen[index].amount++;
    } else {
        // Stap 2c

        /**
         * We maken een oject voor de winkelwagen
         * en vullen deze met de game_id uit de data-.... attribuut van de button
         */
        let item = {
            id: game_id,
            amount: 1
        };

        // Nu voegen we dit object aan het eind van de winkelwagen array toe
        winkelwagen.push(item);
    }

    /*
        We lopen met de method forEach door de winkelwagen heen en 
        tellen per game het aantal op bij de waarde in total_amount
    
        IS DIT WEL EEN GOEDE PLEK VOOR DE ONDERSTAANDE FUNCTIONALITEIT
        OF WAS HET BETER GEWEEST ONDERSTAANDE REGELS IN EEN EIGEN
        FUNCTIE TE PLAATSEN?
    */
    // Stap 3
    let total_amount = 0;   // Dit is een lokale hulpvariabele
    
    winkelwagen.forEach((item) => total_amount += item.amount);
    
    // Nu overschijven we de waarde in de badge metde berekende waarde in total_amount 
    shopping_cart_badge.innerHTML = total_amount;
}