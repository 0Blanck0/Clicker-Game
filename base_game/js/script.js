
/*****************************/
/* Globals variables */
/*****************************/

var gold = 0;
var score = 0;
var gps = 0;
var next_floor = 100;
var floor = 1;
var player_power = 1;
var next_player_power = 50;

var minions = [
    { id: 1, name: "Slime", cost: 10, def_cost: 10, gps: 0.1, def_gps: 0.1, owned: 0 },
    { id: 2, name: "Undead", cost: 100, def_cost: 100, gps: 1, def_gps: 1, owned: 0 },
    { id: 3, name: "Imp", cost: 500, def_cost: 500, gps: 5, def_gps: 5, owned: 0 },
    { id: 4, name: "Vortex", cost: 80000, def_cost: 80000, gps: 80, def_gps: 80, owned: 3 }
];


/*****************************/
/* Onload actions */
/*****************************/

setTimeout(loadded, 100);

var gps_interv = setInterval(add_gps, 1000);
var save_game = setInterval(saveData, 10000);

function loadded()
{
    if (localStorage.getItem('save') == "1")
        getData();

    updateData();
}


/*****************************/
/* Event Listener */
/*****************************/

var click_btn = document.getElementById('click_btn');

click_btn.addEventListener('click', function() {
    addGold(player_power);
    score++;
    addFloor();
});


/*****************************/
/* Display datas */
/*****************************/

function displayGolds()
{
    let target = document.getElementById('gold_section_id');
    target.innerHTML = Math.round(gold);
}

function displayGPS()
{
    let target = document.getElementById('gps_section_id');
    target.innerHTML = gps.toFixed(2);
}

function displayFloor()
{
    let target = document.getElementById('floor_section_id');
    target.innerHTML = floor;
}

function displayMinions()
{

    var target = document.getElementById('m_container');
    target.innerHTML = "";

    minions.forEach(element => {
        if (element['owned'] >= 1)
        {
            let parent = document.createElement('tr');
            let node = document.createElement('td');
            let text = document.createTextNode(element['name']);

            node.appendChild(text);
            parent.appendChild(node);

            node = document.createElement('td');
            text = document.createTextNode(element['gps'].toFixed(2));

            node.appendChild(text);
            parent.appendChild(node);

            node = document.createElement('td');
            text = document.createTextNode(element['owned']);

            node.appendChild(text);
            parent.appendChild(node);

            target.appendChild(parent);
        }
    });
}

function displayShop()
{

    var target = document.getElementById('s_container');
    target.innerHTML = "";

    minions.forEach(element => {
        let parent = document.createElement('tr');
        let node = document.createElement('td');
        let text = document.createTextNode(element['name']);

        node.appendChild(text);
        parent.appendChild(node);

        node = document.createElement('td');
        text = document.createTextNode(element['gps'].toFixed(2));

        node.appendChild(text);
        parent.appendChild(node);

        node = document.createElement('td');
        text = document.createTextNode(element['cost'].toFixed(2));

        node.appendChild(text);
        parent.appendChild(node);

        node = document.createElement('td');
        btn = document.createElement('button');
        btn.setAttribute('alt', 'Buy');
        btn.setAttribute('class', 'buy_btn');

        btn.onclick = function(){
            if (gold >= element['cost'])
                buyMinion(element['id']);
            else
                alert('you don’t have enough money for this');
        };

        node.appendChild(btn);
        parent.appendChild(node);

        target.appendChild(parent);
    });
}


/*********************/
/* Add / Update datas */
/*********************/

function add_gps()
{
    getGPS();
    addGold(gps);
}

function addGold(x)
{
    gold += x;
    displayGolds();
}

function addFloor()
{
    if (score >= next_floor) {
        floor++;
        next_floor = score * 2;
    }

    displayFloor();
}

function calcPlayerPower(nb)
{
    if (nb >= next_player_power) {
        next_player_power += 50;
        player_power *= 2;
    }
}

function upMinion(id)
{
    minions.forEach(element => {
        if (element['id'] == Number(id)){
            let calc = (element['owned'] / 25) + 1;
            element['gps'] = element['def_gps'] * calc;
        }
    });
}

function updateData()
{
    getGPS();
    displayFloor();
    displayGolds();
    displayMinions();
    displayShop();
}


/***********************/
/* Get datas on script */
/***********************/

function getGPS()
{
    var current_gps = 0;
    var numb = 0;

    minions.forEach(element => {
        if (element['owned'] >= 1){
            current_gps += element['gps'] * element['owned'];
            numb += element['owned'];

            if (element['owned'] >= 25) {
                upMinion(element['id']);
            }
        }
    });

    gps = current_gps;

    calcPlayerPower(numb);
    displayGPS();
}


/****************/
/* Buy function */
/****************/

function buyMinion(id)
{
    minions.forEach(element => {
        if (element['id'] == id){
            if (element['cost'] <= gold){
                gold -= element['cost'];
                element['owned'] += 1;
                element['cost'] = element['cost'] * 1.15;
            } else {
                console.log("you don't have money");
            }
        }
    });

    updateData();
}


/*****************************/
/* Save / Get / Delete datas */
/*****************************/

function saveData()
{
    localStorage.minions = JSON.stringify(minions);
    localStorage.setItem('gold', gold);
    localStorage.setItem('score', score);
    localStorage.setItem('next_floor', next_floor);
    localStorage.setItem('floor', floor);
    localStorage.setItem('player_power', player_power);
    localStorage.setItem('next_player_power', next_player_power);
    localStorage.setItem('save', 1);
}

function getData()
{
    gold = Number(localStorage.getItem('gold'));
    score = Number(localStorage.getItem('score'));
    next_floor = Number(localStorage.getItem('next_floor'));
    floor = Number(localStorage.getItem('floor'));
    player_power = Number(localStorage.getItem('player_power'));
    next_player_power = Number(localStorage.getItem('next_player_power'));
    minions = JSON.parse(localStorage.minions);

    minions.forEach(element => {
        element['cost'] = Number(element['cost']);
        element['def_cost'] = Number(element['def_cost']);
        element['def_gps'] = Number(element['def_gps']);
        element['gps'] = Number(element['gps']);
        element['id'] = Number(element['id']);
        element['owned'] = Number(element['owned']);
    });

}

function resetData()
{
    localStorage.clear();
    document.location.reload();
}
