choicesOptions = [];
let totalOfVotes = 0;

// our 'choice' class
function Choice(name) {
    this.name = name;
    this.numberOfVotes = 0;

    this.vote = function () {
        this.numberOfVotes += 1;
        console.log("voted on: " + this.name);
    };

    this.getNumberOfVotes = function () {
        return this.numberOfVotes;
    }

    this.getChoiceName = function () {
        return this.name;
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + (string.slice(1)).toLowerCase();
}

function insertOption() {
    let optionText = document.getElementById("choiceInput").value;
    document.getElementById("choiceInput").value = "";

    if (optionText === "") {
        console.log("Ignoring empty insertion...");
    }

    else {
        console.log("Formating entry");
        optionText = capitalizeFirstLetter(optionText);

        //check if we are putting the same choice twice
        let valid = true;
        for (let i = 0; (i < choicesOptions.length) && valid; i++) {
            console.log(choicesOptions[i].getChoiceName() + "<>" + optionText);
            if (choicesOptions[i].getChoiceName() === optionText) {
                console.log("Abort insertion: entry already exists!");
                valid = false;
            }
        }

        if (valid == true) {
            // creates a new choice
            let myChoice = new Choice(optionText);

            // adds the new choice to the vector
            choicesOptions.push(myChoice);

            updateChoiceList();
        }
    }
}

// updates the choice votingList
function updateChoiceList() {
    let choicesList = document.getElementById("votingList");

    // clears the choice list before rebuilding
    choicesList.innerHTML = "";

    if (choicesOptions.length >= 1) {
        document.getElementById("voting-list-desc").style.display = "block";
        document.getElementById("vote-start-button").style.display = "block";

        for (let choice of choicesOptions) {
            let el = document.createElement("LI");
            let tex = document.createTextNode("  " + choice.getChoiceName());
            let btn = document.createElement("BUTTON");
            btn.className = "btn-danger";
            let t = document.createTextNode("X");
            btn.onclick = function () {
                deleteMe(choice.getChoiceName())
            };
            btn.appendChild(t);
            el.className = "list-group-item";
            el.appendChild(btn);
            el.appendChild(tex);

            choicesList.appendChild(el);
        }
    }  

    if (choicesOptions.length == 1){
        document.getElementById("voting-list-desc").style.display = "block"; 
        document.getElementById("vote-start-button").style.display = "none";
    }
    if (choicesOptions.length == 0){
        document.getElementById("voting-list-desc").style.display = "none"; 
        document.getElementById("vote-start-button").style.display = "none";
    }
}

function startVoting() {
    console.log("Starting voting...");
    if (choicesOptions.length <= 1) {
        console.log("Failed to start voting!");
        console.log("Invalid number of choices.");
    }

    else {
        console.log("Starting voting...");

        // hides the option insert buttons
        document.getElementById("optionCreator").style.display = "none";
        document.getElementById("votArea").style.display = "block";


        // creates the voting options
        for (let choice of choicesOptions) {
            let el = document.createElement("LI");
            let tex = document.createTextNode("  " + choice.getChoiceName());
            let btn = document.createElement("BUTTON");
            btn.className = "btn-success";
            el.onclick = function () {
                voteOn(choice.getChoiceName());
                totalOfVotes += 1;
                document.getElementById('votCount').innerHTML = String(totalOfVotes);

                // visual click feedback
                el.style.transition = "300ms";
                el.style.backgroundColor = "grey";
                setTimeout(function () {
                    el.style.backgroundColor = "white";
                  }, 300);
            };
            let t = document.createTextNode("Vote");
            btn.appendChild(t);
            // TODO: change this buttons style
            // el.appendChild(btn);
            el.className = "list-group-item";
            el.appendChild(tex);

            document.getElementById('answersBox').appendChild(el);
        }
    }
}

function voteOn(info) {
    let flag = true;
    let index;

    for (index = 0; index < choicesOptions.length && flag; index++) {
        if (choicesOptions[index].name === info) flag = false;
    }

    choicesOptions[index - 1].vote();
}

function deleteMe(info) {
    let flag = true;
    let index;

    for (index = 0; index < choicesOptions.length && flag; index++) {
        if (choicesOptions[index].name === info) flag = false;
    }



    choicesOptions.splice(index - 1, 1);


    updateChoiceList();
}

// gets the result
function getResult() {
    let winnerName;
    let winnerPoints = -1;
    let currentName;
    let currentPoints;

    console.log("Getting result!");

    for (let i = 0; i < choicesOptions.length; i++) {
        currentName = choicesOptions[i].getChoiceName();
        currentPoints = choicesOptions[i].getNumberOfVotes();
        console.log("Reading: " + currentName + "-" + currentPoints + ".");

        //TODO resolve draw
        if (currentPoints == winnerPoints) {
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
    document.getElementById("optionCreator").style.display = "none";
    document.getElementById("votArea").style.display = "none";
    document.getElementById("winner-box").style.display = "block";
    
    document.getElementById("winner-name").innerHTML = winnerName;
}
