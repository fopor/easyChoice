choicesOptions = [];
let totalOfVotes = 0;

// our 'choice' class
function Choice (name) {
    this.name = name;
    this.numberOfVotes = 0;

    this.vote = function() {
        this.numberOfVotes += 1;
    };

    this.getNumberOfVotes = function() {
        return this.numberOfVotes;
    }

    this.getChoiceName = function(){
        return this.name;
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + (string.slice(1)).toLowerCase();
}

function insertOption(){
    let optionText = document.getElementById("choiceInput").value;
    document.getElementById("choiceInput").value = "";

    if (optionText === ""){
        console.log("Ignoring empty insertion...");
    }

    else {
        console.log("Formating entry");
        optionText = capitalizeFirstLetter(optionText);

        //check if we are putting the same choice twice
        let valid = true;
        for(let i = 0; (i < choicesOptions.length) && valid; i++){
            console.log(choicesOptions[i].getChoiceName() + "<>" + optionText);
            if(choicesOptions[i].getChoiceName() === optionText){
                console.log("Abort insertion: entry already exists!");
                valid = false;
            }
        }

        if(valid == true) {
            // creates a new choice
            let myChoice = new Choice(optionText);

            // adds the new choice to the vector
            choicesOptions.push(myChoice);

            updateChoiceList();
        }
    }

}

// updates the choice votingList
function updateChoiceList(){
    if(choicesOptions.length >= 1) {
        choicesList = document.getElementById("votingList");

        let choiceListString = choicesOptions[0].getChoiceName();

        for(let i = 1; i < choicesOptions.length; i++) {
            choiceListString = choiceListString + ", " + choicesOptions[i].getChoiceName();
        }

        choicesList.innerHTML = choiceListString + ".";
    }

    else{
        choicesList.innerHTML = "";
    }
}

function startVoting(){
    console.log("Starting voting...");
    if(choicesOptions.length <= 1) {
        console.log("Failed to start voting!");
        console.log("Invalid number of choices.");
        // alert("Invalid number of choices!");
    }

    else{
        console.log("Starting voting...");

        // hides the option insert buttons
        document.getElementById("optionCreator").style.display = "none";
        document.getElementById("votArea").style.display = "block";


        // creates the voting options
        let aChoice;
        for(let i = 0; i < choicesOptions.length; i++){
            aChoice = choicesOptions[i];

            // creates a radio button for the current choices
            let choiceLabel = document.createElement('label');
            let choiceSelection = document.createElement('input');
            let choiceLine = document.createElement('div');

            choiceLine.setAttribute('class', 'answerLine');

            // creates the radio selection element
            choiceSelection.setAttribute('type', 'radio');

            //give a name to it
            choiceSelection.setAttribute('name', 'voting-option');
            choiceSelection.setAttribute('id', "id"+(aChoice.getChoiceName()));

            choiceLabel.innerHTML=aChoice.getChoiceName();
            choiceLabel.setAttribute('for', "id"+(aChoice.getChoiceName()));

            choiceLine.appendChild(choiceSelection);
            choiceLine.appendChild(choiceLabel);
            document.getElementById('answersBox').appendChild(choiceLine);

        }
    }
}


//TODO implement this to remove last added
function deleteLastInsert(){
    if(choicesOptions.length >= 1) {
        choicesOptions.splice(-1,1);
        updateChoiceList();
    }
}

// vote on the selected item
function choiceVote() {
    let matched = false;
    let itemID;

    // search for the checked item
    for(let i = 0; i < choicesOptions.length && matched == false; i++){
        itemID = "id"+choicesOptions[i].getChoiceName();
        console.log("Searching for match of id>" + itemID);
        // found the checked item
        if(document.getElementById(itemID).checked == true){
                console.log("Voted on " + choicesOptions[i].getChoiceName());
                matched = true;

                // actually votes and update the Object
                totalOfVotes++;
                choicesOptions[i].vote();

                // updates the button name (for the number of votes)
                document.getElementById("votButton").innerHTML = "Vote (" + totalOfVotes +  ")";

                // unchecks the radio button box
                document.getElementById(itemID).checked = false;
        }
    }
}

// gets the result
function getResult(){
    let winnerName;
    let winnerPoints = -1;
    let currentName;
    let currentPoints;

    console.log("Getting result!");

    for(let i = 0; i < choicesOptions.length; i++){
        currentName   = choicesOptions[i].getChoiceName();
        currentPoints = choicesOptions[i].getNumberOfVotes();
        console.log("Reading: " + currentName + "-" + currentPoints + ".");

        //TODO resolve draw
        if(currentPoints == winnerPoints) {
            console.log("Draw!");
            winnerName = winnerName + " and " + currentName;
        }

        // new winner
        else if (currentPoints > winnerPoints) {
            winnerPoints = currentPoints;
            winnerName = currentName;
        }
    }

    console.log("Winner>" + winnerName);
    document.getElementById("winner-box").style.display = "block";
    document.getElementById("winner-name").innerHTML = winnerName;
}
