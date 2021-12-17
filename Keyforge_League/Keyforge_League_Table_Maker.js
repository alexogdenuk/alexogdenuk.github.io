/*
  Generate a Keyforge League Table.
  Table ranked by points, then key difference, then keys forged.
  3 points for a win, one for draw, zero for a loss.
*/

var rawData = [
  ["Alfie",	"Oscar",	"Marks, Vikingsplace's Marshall",	     "Painire Murphy, the Slow and Supreme",	3,	2,	"Yes"],
  ["Alfie",	"Oscar",	"Painire Murphy, the Slow and Supreme",	 "Marks, Vikingsplace's Marshall",	3,	1,	"Yes"],
  ["Alfie",	"Oscar",	"Painire Murphy, the Slow and Supreme",	 "Marks, Vikingsplace's Marshall",	3,	1,	"No"],
  ["Alfie",	"Sam",	"Painire Murphy, the Slow and Supreme",	 "Marks, Vikingsplace's Marshall",	3,	2,	"Yes"],
  ["Alfie",	"Freya",	"Deck1",	     "Deck2",	3,	2,	"Yes"],
  ["Alfie",	"Freya",	"Deck2",	 "Deck1",	3,	2,	"Yes"],
  ["Oscar",	"Freya",	"Deck1",	     "Deck2",	2,	3,	"Yes"],
  ["Oscar",	"Freya",	"Deck2",	 "Deck1",	2,	3,	"Yes"],
];


//Fetch games with League = "Yes"
let leagueData = rawData.filter(x => x[6] == "Yes")
//Function that returns a list of unique player names for given data
function collapsePlayers(data){
    var player1Names = data.map(x => x[0]);
    var player2Names = data.map(x => x[1]);
    var playerNamesLong = player1Names.concat(player2Names);
    return playerNamesLong.filter((index,pos) => playerNamesLong.indexOf(index)==pos);
}

//Cool League Table Array of format: [Position, Name, No. Played, Won, Drawn, Lost, Keys For, Keys Against, Key Difference, Points]
var league = [];
//Get all unique player names
var playerNames = collapsePlayers(leagueData)
for(let name of playerNames){
    //Fetch games that current player was in
    var playerGames = leagueData.filter(x => x.slice(0,2).includes(name))
    
    //console.log(name, playerGames)
    //Fetch competitors of current player
    var competitors = collapsePlayers(playerGames).filter(x => x != name)
    //Storing data
    var played = competitors.length
    var wins = 0
    var draws = 0
    var losses = 0
    var keysFor = 0
    var keysAgainst = 0
    for (let competitor of competitors){
        //Storing data for pair of games against one competitor
        var localWins = 0
        var localKeysFor = 0
        var localKeysAgainst = 0
        //Fetch games that competitor was in, i.e. get pair of games
        var compGames =  playerGames.filter(x => x.slice(0,2).includes(competitor))
        //Search through the pair of games
        for (let index of [0,1]){
            for (let game of compGames){
                //Skip this iteration if the index isnt the current player name
                if (name != game[index]){continue}
                //Update keys for/against depending on index
                localKeysFor += parseInt(game[4+index])
                localKeysAgainst += parseInt(game[5-index])
                console.log(localKeysFor)
                //Update wins if forged 3 keys
                if (game[4+index] == 3){localWins += 1}}}
        console.log(name, "forged", localKeysFor, "against", competitor)
        //Update global stats from the pair of matches
        if (localWins == 2){wins += 1}
        if (localWins == 1){draws += 1}
        if (localWins == 0){losses += 1}
        keysFor += localKeysFor
        keysAgainst += localKeysAgainst}
    var points = 3*wins + draws
    var entry = [name, played, wins, draws, losses, keysFor, keysAgainst, keysFor-keysAgainst, points]
    league.push(entry)}
console.log("League Table", league)

//Sort league by points, then key difference, then keys forged, then alphabetical
var sortedLeague = league.sort(function (a,b){
    if      (a[8] != b[8]){return a[8] > b[8] ? -1:+1}
    else if (a[7] != b[7]){return a[7] > b[7] ? -1:+1}
    else if (a[5] != b[5]){return a[5] > b[5] ? -1:+1}
})
console.log(sortedLeague)
