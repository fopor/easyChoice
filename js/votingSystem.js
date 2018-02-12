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

    // appende all the choices to the list
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

    // dont show the start voting button if we only have one choice
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
        console.log("Prepare the pouop up confirmation...");
        
        document.getElementById("popup-message").innerHTML = "Start voting?";
        document.getElementById("pop-cancel").innerHTML = "Cancel";
        document.getElementById("pop-confirm").innerHTML = "Confirm";

        // add the logic to close the overlay
        document.getElementById("pop-cancel").addEventListener("click", () => {
            document.getElementById("overlay").style.display = "none";

            // removes the listner
            removeAllListners(document.getElementById('overlay'));
        });

        // confirm the option
        document.getElementById("pop-confirm").addEventListener("click", () => {
            document.getElementById("overlay").style.display = "none";
            
            // removes the listner
            removeAllListners(document.getElementById('overlay'));
            
            console.log("Starting voting...");

            // hides the option insert buttons
            document.getElementById("optionCreator").style.display = "none";
            document.getElementById("votArea").style.display = "block";

            // creates the voting options
            document.getElementById('answersBox').innerHTML = "";
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
        });

        // show the overlay
        document.getElementById("overlay").style.display = "block";
    }
}

function removeAllListners(old_element) {
    let new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);
}

// goes back to the insert page from the voting page
function backToInputList() {
    console.log("Prepare the pouop up confirmation...");
        
    document.getElementById("popup-message").innerHTML = "Going back resets current count";
    document.getElementById("pop-cancel").innerHTML = "Cancel";
    document.getElementById("pop-confirm").innerHTML = "Go back";

    // add the logic to close the overlay
    document.getElementById("pop-cancel").addEventListener("click", () => {
        document.getElementById("overlay").style.display = "none";

        // removes the listner
        removeAllListners(document.getElementById('overlay'));
    });

    // confirm the option
    document.getElementById("pop-confirm").addEventListener("click", () => {
        document.getElementById("overlay").style.display = "none";
        
        // removes the listner
        removeAllListners(document.getElementById('overlay'));

        document.getElementById("optionCreator").style.display = "block";
        document.getElementById("votArea").style.display = "none";

        // resets the number of votes
        totalOfVotes = 0;
        document.getElementById('votCount').innerHTML = String(totalOfVotes);
        for(choice of choicesOptions) {
            choice.numberOfVotes = 0;
        }
    });

    // show the overlay
    document.getElementById("overlay").style.display = "block";
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

    console.log("Prepare the pouop up confirmation...");
        
        document.getElementById("popup-message").innerHTML = "Show winner?";
        document.getElementById("pop-cancel").innerHTML = "Back";
        document.getElementById("pop-confirm").innerHTML = "Show";

        // add the logic to close the overlay
        document.getElementById("pop-cancel").addEventListener("click", () => {
            document.getElementById("overlay").style.display = "none";

            // removes the listner
            removeAllListners(document.getElementById('overlay'));
        });

        // confirm the option
        document.getElementById("pop-confirm").addEventListener("click", () => {
            document.getElementById("overlay").style.display = "none";

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
            
            // removes the listner
            removeAllListners(document.getElementById('overlay'));
        });

        // show the overlay
        document.getElementById("overlay").style.display = "block";
}
