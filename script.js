//Getting DOM elements

//hide and show
const topshow = document.getElementById("topshow");
const pokeballShow = document.getElementById("pokeballShow");

//
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const pokeballBtn = document.getElementById("pokeball");
const backBtn = document.getElementById("backBtn")

//UL
const displayPokemonUl = document.getElementById("displayPokemonUl");
const displayPokeballUl = document.getElementById("displayPokeballUl");

//---------
//storage
//---------

let state = {
    searchedPokemon: [],
    caughtPokemon: []
}

//---------
// Load caught pokemon from local storage
//---------

const savedPokemon = localStorage.getItem("caughtPokemon");

if(savedPokemon){
    state.caughtPokemon = JSON.parse(savedPokemon);
}



//---------
// search input validation (function)
//---------
function searchInputValidation(){
    if(searchInput.value.trim() === "" || !isNaN(searchInput.value.trim())){
        alert("Please type pokemon name to search");
        return false;
    }
    return true;
}

//---------
//Fetch pokemon from API (search function)
//---------

async function searchedPokemonData(){

if(!searchInputValidation()){
    return;
}

const query = searchInput.value.trim().toLowerCase();

let found  = false;

try{
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);

    if(!response.ok){
        throw new Error("Pokemon not found")
    }

    const data = await response.json();

    state.searchedPokemon = [data]

    renderSearchedPokemon();

}catch(error){
    alert("Pokemon not found");
}

}

//---------
//Render searched pokemon (function)
//---------

function renderSearchedPokemon(){
    displayPokemonUl.innerHTML = "";

    state.searchedPokemon.forEach(function(pokemon){
        const li = document.createElement("li");

        li.innerHTML = `<h3>${pokemon.name}</h3>
        <img src="${pokemon.sprites.front_default}">
        <button class="catch">Catch</button>`

        const catchBtn = li.querySelector(".catch")

        catchBtn.addEventListener("click", function(){
            
            const alreadyCaught = state.caughtPokemon.some(function(p){
                return p.name === pokemon.name;
            })

            if (alreadyCaught) {
            alert(pokemon.name + " is already in your Pokeball!");
            return; 
         }
            
        // Add Pokémon
        state.caughtPokemon.push(pokemon);
        localStorage.setItem("caughtPokemon", JSON.stringify(state.caughtPokemon));
        alert("You caught " + pokemon.name + "!");
        })

        displayPokemonUl.appendChild(li);
    })
}

//---------
//Render caught pokemon (function)
//---------

function renderCaughtPokemon(){
    displayPokeballUl.innerHTML = "";

    state.caughtPokemon.forEach(function(pokemon){
        const li = document.createElement("li");

        li.innerHTML = `<h3>${pokemon.name}</h3>
        <img src="${pokemon.sprites.front_default}">`

        const backBtn = li.querySelector(".backBtn");

        displayPokeballUl.appendChild(li);
    })
}


//---------
//Event listeners
//---------

backBtn.addEventListener("click", function(){
    topshow.style.display = "block";
    pokeballShow.style.display = "none";
    window.location.reload();
})

pokeballBtn.addEventListener("click", function(){
    topshow.style.display = "none";
    pokeballShow.style.display = "block";
    renderCaughtPokemon();
});


searchBtn.addEventListener("click", searchedPokemonData);