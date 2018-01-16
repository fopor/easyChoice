choicesOptions = [];
choicesNo = 0;

function insertOption(){
    optionText = document.getElementById("choiceInput").value;
    console.log("Inserting option...");

    if (optionText === ""){
        console.log("Ignoring empty insertion...");
    }

    else {
        console.log("Creating option...");
        choicesNo += 1;

        
    }

}

function startVoting(){
    console.log("Starting voting...");
    if(choicesNo <= 1) {
        console.log("Failed to start voting!");
        console.log("Invalid number of choices.");
        // alert("Invalid number of choices!");
    }

    else{
        console.log("Starting voting...");

    }
}
