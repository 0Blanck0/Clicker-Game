/*********************/
/* Globals variables */
/*********************/

var gold = 0;
var score = 0;
var gps = 0;
var next_floor = 100;
var floor = 1;
var player_power = 1;
var next_player_power = 50;
var game_time = 0;
var current_time = 0;
var time_to_start = new Date().getTime();

var minions = [
    { id: 1, name: "Slime", cost: 10, def_cost: 10, gps: 0.1, def_gps: 0.1, owned: 0 },
    { id: 2, name: "Undead", cost: 100, def_cost: 100, gps: 1, def_gps: 1, owned: 0 },
    { id: 3, name: "Imp", cost: 500, def_cost: 500, gps: 5, def_gps: 5, owned: 0 },
    { id: 4, name: "Vortex", cost: 80000, def_cost: 80000, gps: 80, def_gps: 80, owned: 0 },
    { id: 5, name: "Lich", cost: 10, def_cost: 10, gps: 0.1, def_gps: 0.1, owned: 0 },
    { id: 6, name: "Dead", cost: 100, def_cost: 100, gps: 1, def_gps: 1, owned: 0 },
    { id: 7, name: "Over", cost: 80000, def_cost: 80000, gps: 80, def_gps: 80, owned: 0 }
];


/******************/
/* Onload actions */
/******************/

setTimeout(loadded, 100);

var gpsInterval = setInterval(addGPS, 1000);
var saveGameInterval = setInterval(saveData, 10000);
var timeInterval = setInterval(setTime, 100);

/**
 * Function called when the page is loaded.
 * It retrieves saved data if available and updates the game state.
 */
function loadded() {
    if (localStorage.getItem('save') == "1") {
        getData();
    }

    updateData();
}


/*******************/
/* Event Listeners */
/*******************/

/**
 * Event listener for the click button.
 * Increases gold and score, and updates the floor.
 */
document.getElementById('click_btn').addEventListener('click', () => {
    addGold(player_power);
    score++;
    addFloor();
});

/**
 * Event listener for the save button.
 * Saves the game data and alerts the user.
 */
document.getElementById('save_btn').addEventListener('click', () => {
    saveData();
    alert("You have saved successfully");
});

/**
 * Event listener for the reset button.
 * Resets the game data after user confirmation.
 */
document.getElementById('reset_btn').addEventListener('click', () => {
    if (confirm("Are you sure you want to delete all data? No backup can be made or restored.")) {
        resetData();
    }
});

/**
 * Event listener for the rebirth button.
 * Rebirths the game data after user confirmation.
 */
document.getElementById('rebirth_btn').addEventListener('click', () => {
    if (confirm("Are you sure you want to rebirth? All data will be erased and minions above 50 will have a 10% bonus.")) {
        rebirthData();
    }
});

/**
 * Event listener for the submit button.
 * Adds a new minion based on form input.
 */
document.getElementById('submit_btn').addEventListener('click', () => {
    let formName = document.getElementById('form_name').value;
    let formCost = document.getElementById('form_cost').value;
    let formGPS = document.getElementById('form_gps').value;

    if (formName && formCost && formGPS) {
        let newId = minions.length + 1;
        let newMinion = { id: newId, name: formName, cost: formCost, def_cost: formCost, gps: formGPS, def_gps: formGPS, owned: 0 };

        minions.push(newMinion);
        alert("Add success");

        document.location.reload();
    } else {
        alert('Form empty...');
    }
});


/*****************/
/* Display datas */
/*****************/

/**
 * Displays the current amount of gold.
 */
function displayGolds() {
    document.getElementById('gold_section_id').innerHTML = Math.round(gold);
}

/**
 * Displays the current floor.
 */
function displayFloor() {
    document.getElementById('floor_section_id').innerHTML = floor;
}

/**
 * Displays the minions owned by the player.
 */
function displayMinions() {
    document.getElementById('m_container').innerHTML = "";

    minions.forEach(element => {
        if (element.owned >= 1) {
            let parent = document.createElement('tr');

            parent.appendChild(createTableCell(element.name));
            parent.appendChild(createTableCell(element.gps.toFixed(2)));
            parent.appendChild(createTableCell(element.owned));
            target.appendChild(parent);
        }
    });
}

/**
 * Displays the shop with available minions to buy.
 */
function displayShop() {
    document.getElementById('s_container').innerHTML = "";

    minions.forEach(element => {
        let parent = document.createElement('tr');
        let btn = document.createElement('button');
        let btnCell = document.createElement('td');

        parent.appendChild(createTableCell(element.name));
        parent.appendChild(createTableCell(element.gps.toFixed(2)));
        parent.appendChild(createTableCell(element.cost.toFixed(2)));

        btn.setAttribute('alt', 'Buy');
        btn.setAttribute('class', 'buy_btn');

        btn.onclick = () => {
            if (gold >= element.cost) {
                buyMinion(element.id);
            } else {
                alert('You don\'t have enough money for this');
            }
        };

        btnCell.appendChild(btn);
        parent.appendChild(btnCell);
        target.appendChild(parent);
    });
}

/**
 * Displays the current and total game time.
 */
function displayTime() {
    document.getElementById('current_time_id').innerHTML = formatTime(current_time);
    document.getElementById('total_time_id').innerHTML = formatTime(game_time);
}

/**
 * Creates a table cell with the given text.
 * 
 * @param {string} text - The text to display in the cell.
 * @returns {HTMLElement} The created table cell.
 */
function createTableCell(text) {
    let cell = document.createElement('td');
    cell.appendChild(document.createTextNode(text));

    return cell;
}

/**
 * Formats the given time in hours, minutes, and seconds.
 * 
 * @param {number} time - The time to format.
 * @returns {string} The formatted time.
 */
function formatTime(time) {
    let date = new Date(time);
    let hours = date.getHours() - 1;
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    return `${hours}:${minutes}:${seconds}`;
}


/**********************/
/* Add / Update datas */
/**********************/

/**
 * Adds the current GPS (gold per second) to the total gold.
 */
function addGPS() {
    getGPS();
    addGold(gps);
}

/**
 * Adds the given amount of gold to the total gold.
 * 
 * @param {number} amount - The amount of gold to add.
 */
function addGold(amount) {
    gold += amount;
    displayGolds();
}

/**
 * Updates the floor based on the current score.
 */
function addFloor() {
    if (score >= next_floor) {
        floor++;
        next_floor = score * 2;
    }

    displayFloor();
}

/**
 * Calculates the player's power based on the total minions owned.
 * 
 * @param {number} totalOwned - The total number of minions owned.
 */
function calcPlayerPower(totalOwned) {
    if (totalOwned >= next_player_power) {
        next_player_power += 50;
        player_power *= 2;
    }
}

/**
 * Updates the GPS of a minion based on its ID.
 * 
 * @param {number} id - The ID of the minion to update.
 */
function upMinion(id) {
    minions.forEach(element => {
        if (element.id == id) {
            let calc = (element.owned / 25) + 1;
            element.gps = element.def_gps * calc;
        }
    });
}

/**
 * Updates the game data and displays the updated values.
 */
function updateData() {
    getGPS();
    setTime();
    displayFloor();
    displayGolds();
    displayMinions();
    displayShop();
}

/**
 * Sets the current game time and updates the display.
 */
function setTime() {
    let curTime = new Date().getTime();

    game_time = (game_time - current_time) + (curTime - time_to_start);
    current_time = curTime - time_to_start;

    displayTime();
}

/**
 * Resets the game data for a rebirth, applying bonuses if applicable.
 */
function rebirthData() {
    if (floor > 50) {
        localStorage.clear();

        minions.forEach(element => {
            if (element.owned >= 50) {
                element.cost = element.def_cost;
                element.def_gps *= 1.1;
                element.gps = element.def_gps;
                element.owned = 0;
            } else {
                element.owned = 0;
            }
        });

        resetGameVariables();
        updateData();
        saveData();

        document.location.reload();
    } else {
        alert("You can't rebirth if you have not exceeded level 50");
    }
}

/**
 * Resets the game variables to their initial values.
 */
function resetGameVariables() {
    gold = 0;
    gps = 0;
    score = 0;
    floor = 0;
    next_floor = 100;
    player_power = 1;
    next_player_power = 50;
}


/***********************/
/* Get datas on script */
/***********************/

/**
 * Calculates the total GPS and updates the player's power.
 */
function getGPS() {
    let currentGPS = 0;
    let totalOwned = 0;

    minions.forEach(element => {
        if (element.owned >= 1) {
            currentGPS += element.gps * element.owned;
            totalOwned += element.owned;

            if (element.owned >= 25) {
                upMinion(element.id);
            }
        }
    });

    gps = currentGPS;
    calcPlayerPower(totalOwned);
    document.getElementById('gps_section_id').innerHTML = gps.toFixed(2);
}


/****************/
/* Buy function */
/****************/

/**
 * Buys a minion based on its ID, if the player has enough gold.
 * 
 * @param {number} id - The ID of the minion to buy.
 */
function buyMinion(id) {
    minions.forEach(element => {
        if (element.id == id) {
            if (element.cost <= gold) {
                gold -= element.cost;
                element.owned += 1;
                element.cost *= 1.15;
            } else {
                console.log("You don't have enough money");
            }
        }
    });

    updateData();
}


/*****************************/
/* Save / Get / Delete datas */
/*****************************/

/**
 * Saves the current game data to local storage.
 */
function saveData() {
    localStorage.minions = JSON.stringify(minions);
    localStorage.setItem('gold', gold);
    localStorage.setItem('score', score);
    localStorage.setItem('next_floor', next_floor);
    localStorage.setItem('floor', floor);
    localStorage.setItem('player_power', player_power);
    localStorage.setItem('next_player_power', next_player_power);
    localStorage.setItem('game_time', game_time);
    localStorage.setItem('save', 1);
}

/**
 * Retrieves the saved game data from local storage.
 */
function getData() {
    gold = Number(localStorage.getItem('gold'));
    score = Number(localStorage.getItem('score'));
    next_floor = Number(localStorage.getItem('next_floor'));
    floor = Number(localStorage.getItem('floor'));
    player_power = Number(localStorage.getItem('player_power'));
    next_player_power = Number(localStorage.getItem('next_player_power'));
    game_time = Number(localStorage.getItem('game_time'));
    minions = JSON.parse(localStorage.minions);

    minions.forEach(element => {
        element.cost = Number(element.cost);
        element.def_cost = Number(element.def_cost);
        element.def_gps = Number(element.def_gps);
        element.gps = Number(element.gps);
        element.id = Number(element.id);
        element.owned = Number(element.owned);
    });
}

/**
 * Resets the game data and reloads the page.
 */
function resetData() {
    localStorage.clear();
    document.location.reload();
}
