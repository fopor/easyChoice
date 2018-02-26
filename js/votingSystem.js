choicesOptions = [];
let totalOfVotes = 0;
let secondRound = true;

let secondRoundButton = document.getElementById("second-round-check");

console.log("Reading saved lists...");
let savedLists = localStorage.getItem('savedLists');
console.log("Read:");
console.log(savedLists);

// TODO: add option to delete saved lists

if(savedLists) {
    // we have a list saved
    document.getElementById("load-button").classList.remove('disabled');

    // TODO refactor this to not use the variable
    savedLists = JSON.parse(savedLists);

} else {
    // we dont have a list saved
    document.getElementById("load-button").classList.add('disabled');
    savedLists = {};
}

// add listner to toggle button
secondRoundButton.addEventListener('change', function() {
    if(this.checked) {
        // Checkbox is checked..
        console.log('Checked!');
        secondRound = true;
    } else {
        // Checkbox is not checked..
        console.log('Unchecked!');
        secondRound = false;
    }
});

function loadOption(){
    //builds the choicesOptions object
    choicesOptions = [];

    for(loadedChoice of savedLists){
        console.log(loadedChoice);
     
        // creates a new choice
        let myChoice = new Choice(loadedChoice.name);

        // adds the new choice to the vector
        choicesOptions.push(myChoice);
    }
    
    updateChoiceList();
}

function saveOption(){
    savedLists = choicesOptions;
    localStorage.setItem('savedLists', JSON.stringify(savedLists));
    visualFeedback("LIST SAVED");
}

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
    let words = string.split(' ');
    let res = '';

    // cataplize first letter of every word
    for (word of words) {
        word = word.charAt(0).toUpperCase() + (word.slice(1)).toLowerCase();
        res += ' ' + word;
    }

    // removes the first white space
    return res.slice(1);
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
        document.getElementById("save-list-button").style.display = "block";

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

        document.getElementById("load-button").style.display = "none";
    }

    // dont show the start voting button if we only have one choice
    if (choicesOptions.length == 1) {
        document.getElementById("voting-list-desc").style.display = "block";
        document.getElementById("vote-start-button").style.display = "none";
        document.getElementById("save-list-button").style.display = "none";
        document.getElementById("load-button").style.display = "none";
    }

    if (choicesOptions.length == 0) {
        document.getElementById("voting-list-desc").style.display = "none";
        document.getElementById("vote-start-button").style.display = "none";
        document.getElementById("save-list-button").style.display = "none";
        document.getElementById("load-button").style.display = "";
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
        for (choice of choicesOptions) {
            choice.numberOfVotes = 0;
        }
    });

    // show the overlay
    document.getElementById("overlay").style.display = "block";
}

function visualFeedback(text) {
    document.getElementById("alertText").innerHTML = text;
    document.getElementById("overlay").style.display = "block";
    document.getElementById("textOnOver").style.display = "block";
    document.getElementById("popUp").style.display = "none";
    // removes the vote feedback message
    setTimeout(function () {
        document.getElementById("textOnOver").style.display = "none";
        document.getElementById("overlay").style.display = "none";
        document.getElementById("popUp").style.display = "block";
    }, 1500);
}

function voteOn(info) {
    let flag = true;
    let index;

    // gives visual feedback of the vote
    visualFeedback("VOTE COUNTED");

    // counts the vote
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

// gets random number within interval
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// checks if we can second-turn and chose a winner
function canSecondTurn(drawVector) {
    // it only makes sense to second turn if there are votes
    // outside the 'winners'
    let winnerVotes = 0;
    let losersVotes = 0;
    let totalCountedVotes = 0; // TODO: check if we can use the
                               // global counter

    for(let candidate of choicesOptions) {
        totalCountedVotes += candidate.getNumberOfVotes();
    }

    for(let candidate of drawVector) {
        winnerVotes += candidate.getNumberOfVotes();
    }

    losersVotes = totalCountedVotes - winnerVotes;

    console.log("Second-round validator:");
    console.log("total of votes    > " + totalCountedVotes);
    console.log("winnersVotes      > " + winnerVotes);
    console.log("votes to relocate > " + losersVotes);

    if(losersVotes > 0) {
        console.log("We can try a second-round!");
        return true;
    }

    console.log("We cant second-round...");
    return false;
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

        let draw = false;
        let drawVector = [];
        let currentWinner;

        for (let i = 0; i < choicesOptions.length; i++) {
            currentName = choicesOptions[i].getChoiceName();
            currentPoints = choicesOptions[i].getNumberOfVotes();
            console.log("Reading: " + currentName + "-" + currentPoints + ".");

            //TODO resolve draw
            if (currentPoints == winnerPoints) {
                console.log("Draw!");

                // new draw
                if (!draw) {
                    drawVector = [];

                    //pushes the drawing mate
                    drawVector.push(currentWinner);
                }

                // add people drawing to vector
                drawVector.push(choicesOptions[i]);
                console.log(drawVector);

                winnerName = winnerName + " and " + currentName;
                draw = true;
            }

            // new winner
            else if (currentPoints > winnerPoints) {
                winnerPoints = currentPoints;
                winnerName = currentName;
                currentWinner = choicesOptions[i];
                draw = false;
            }
        }

        // removes the listners
        removeAllListners(document.getElementById('overlay'));

        if (draw) {
            console.log("We had a draw...");

            if(secondRound){
                // create second round
                // if there are no votes to reallocate, just RANDOM IT
                console.log("Checking if our distribution allows to second-round...");
                
                if(canSecondTurn(drawVector)){
                    console.log("Second-turn is possible!");
                    console.log("Reopening voting...");

                    choicesOptions = drawVector.slice();
                    totalOfVotes = 0;
                    document.getElementById('votCount').innerHTML = String(totalOfVotes);
                    updateChoiceList();

                    console.log("Starting voting...");

                    // re-do the choice list
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


                } else {
                    // just random, no votes to relocate
                    console.log("Second-turn is not viable!...");
                    console.log("getting random winner");
                    
                    // TODO: refactor this block (same as the one below)
                    let winnerNumber = getRandomInt(0, drawVector.length - 1);
                    document.getElementById("winner-name").innerHTML = drawVector[winnerNumber].getChoiceName();
                    document.getElementById("optionCreator").style.display = "none";
                    document.getElementById("votArea").style.display = "none";
                    document.getElementById("winner-box").style.display = "block";
                    document.getElementById("help-message-winner").innerHTML = "There were no votes outside the ones on the winners. Second-round was therefore not possible! A winner was chosen randomly.";
                }

            } else {
                // just random a winner
                let winnerNumber = getRandomInt(0, drawVector.length - 1);
                document.getElementById("winner-name").innerHTML = drawVector[winnerNumber].getChoiceName();
                document.getElementById("optionCreator").style.display = "none";
                document.getElementById("votArea").style.display = "none";
                document.getElementById("winner-box").style.display = "block";
                document.getElementById("help-message-winner").innerHTML = "Since second-round was disabled, the draw was solved using an adicional random vote.";
            }
            
        } else {
            console.log("Winner>" + winnerName);
            document.getElementById("optionCreator").style.display = "none";
            document.getElementById("votArea").style.display = "none";
            document.getElementById("winner-box").style.display = "block";
            document.getElementById("winner-name").innerHTML = winnerName;
        }
    });

    // show the overlay
    document.getElementById("overlay").style.display = "block";
}
