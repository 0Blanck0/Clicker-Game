
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


/*****************************/
/* Onload actions */
/*****************************/

setTimeout(loadded, 100);

try {
    var gps_interv = setInterval(add_gps, 1000);
    var save_game = setInterval(saveData, 10000);
    var time_interv = setInterval(setTime, 100);
} catch {}

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
var save_btn = document.getElementById('save_btn');

try {

    click_btn.addEventListener('click', function() {
        addGold(player_power);
        score++;
        addFloor();
    });

    save_btn.addEventListener('click', function() {
        saveData();
        alert("you have save succes");
    });

} catch {}


/*****************************/
/* Security delete */
/*****************************/

var reset_btn = document.getElementById('reset_btn');
var rebirth_btn = document.getElementById('rebirth_btn');

try {

    reset_btn.addEventListener('click', function() {
        let reponse = confirm("Are you sure you want to delete all data? No backup can be made or restored.");

        if (reponse == true) {
            resetData();
        }
    });

    rebirth_btn.addEventListener('click', function() {
        let reponse = confirm("Are you sure you want to be rebirth? all data will be erased and minions above 50 will have a 10% bonus.");

        if (reponse == true) {
            rebirthData();
        }
    });

} catch {}


/*****************************/
/* Display datas */
/*****************************/

try {

    function displayGolds()
    {
        let target = document.getElementById('gold_section_id');

        try {
            target.innerHTML = Math.round(gold);
        } catch {}
    }

    function displayGPS()
    {
        let target = document.getElementById('gps_section_id');

        try {
            target.innerHTML = gps.toFixed(2);
        } catch {}
    }

    function displayFloor()
    {
        let target = document.getElementById('floor_section_id');

        try {
            target.innerHTML = floor;
        } catch {}
    }

    function displayMinions()
    {

        var target = document.getElementById('m_container');

        try {
            target.innerHTML = "";
        } catch {}

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

        try {
            target.innerHTML = "";
        } catch {}

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

            try {
                target.appendChild(parent);
            } catch {}
        });
    }

    function displayTime()
    {
        let time_1 = document.getElementById('current_time_id');
        let hours = new Date(current_time).getHours() - 1;
        let minutes = new Date(current_time).getMinutes();
        let second = new Date(current_time).getSeconds();

        if (second < 10)
            second = "0" + String(second);
        if (minutes < 10)
            minutes = "0" + String(minutes);
        if (minutes < 10)
            hours = "0" + String(hours);

        let time_2 = document.getElementById('total_time_id');
        let hours_z = new Date(game_time).getHours() - 1;
        let minutes_z = new Date(game_time).getMinutes();
        let second_z = new Date(game_time).getSeconds();

        if (second_z < 10)
            second_z = "0" + String(second_z);
        if (minutes_z < 10)
            minutes_z = "0" + String(minutes_z);
        if (minutes_z < 10)
            hours_z = "0" + String(hours_z);

        try {
            time_1.innerHTML = hours + ":" + minutes + ":" + second;
            time_2.innerHTML = hours_z + ":" + minutes_z + ":" + second_z;
        } catch {}
    }

} catch {}

/*********************/
/* Add / Update datas */
/*********************/

var add_btn = document.getElementById('submit_btn');

try {
    add_btn.addEventListener('click', function() {
        let form_name = document.getElementById('form_name').value;
        let form_cost = document.getElementById('form_cost').value;
        let form_gps = document.getElementById('form_gps').value;

        if (form_cost && form_gps && form_name) {
            let nb = 1;

            minions.forEach(element => {
                nb++;
            });
    
            let new_row = {id: nb, name: form_name, cost: form_cost, def_cost: form_cost, gps: form_gps, def_gps: form_gps, owned: 0};
            minions.push(new_row);

            alert("Add succes");

            document.location.reload();
        } else
            alert('Form empty...');
    });
} catch {}

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
    setTime();
    displayFloor();
    displayGolds();
    displayMinions();
    displayShop();
}

function setTime()
{
    let cur_time = new Date().getTime();
    game_time = (game_time - current_time) + (cur_time - time_to_start);
    current_time = cur_time - time_to_start;

    displayTime();
}

function rebirthData()
{
    if (floor > 50) {
        localStorage.clear();

        minions.forEach(element => {
            if (element['owned'] >= 50) {
                element['cost'] = element['def_cost'];
                element['def_gps'] = element['def_gps'] * 1.1;
                element['gps'] = element['def_gps'];
                element['owned'] = 0;
            } else {
                element['owned'] = 0;
            }
        });

        gold = 0;
        gps = 0;
        score = 0;
        floor = 0;
        next_floor = 100;
        player_power = 1;
        next_player_power = 50;

        updateData();
        saveData();
        document.location.reload();
    } else {
        alert("You can't rebirth if you have not exceeded level 50");
    }
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
    localStorage.setItem('game_time', game_time);
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
    game_time = Number(localStorage.getItem('game_time'));
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
