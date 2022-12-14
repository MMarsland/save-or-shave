async function getDonationsData(uri, username, url) {
    console.log(uri, username)

    //URL = "http://192.168.1.89:8080"; // DEV
    //URL = "https://save-or-shave.herokuapp.com" // Production
    let res = null;
    let donationsData = null;
    try {
        res = await fetch(`${url}/${uri}?username=${username}`);
        donationsData = await res.json();
    } catch (error) {
        // Show Error Div
        console.log("ERROR")
        document.querySelector(".loadingText ").innerHTML = `An error has occurred, please try again with a different username`;
        document.querySelector(".loadingStash").classList.add("errorStash");
        document.querySelector(".loadingStash").classList.remove("loadingStash");
        //res = await fetch(`${url}/`);
        return
    }
    
    console.log("Got Data");
    console.log(donationsData);

    document.getElementById('loadingContent').style.display = "none";
    document.getElementById('content').style.display = "flex";

    saveAmount = donationsData.saveAmount;
    shaveAmount = donationsData.shaveAmount;

    dollarsPerLevel = 5;

    unboundLevel = 7 + Math.ceil(((saveAmount - shaveAmount)/dollarsPerLevel));

    level = Math.min(Math.max(unboundLevel, 0), 14)

    console.log("Save Amount: "+saveAmount);
    console.log("Shave Amount: "+shaveAmount);
    console.log("Level: "+level);

    setSaveAmount(saveAmount);
    setShaveAmount(shaveAmount);
    setDonationLevel(level);
}
  
function setDonationLevel(level) { //15 levels: 0 -> 14
    shaveDate = ""

    //DAYS_IN_NOV = 30;
    //startDayInNov = 30;
    //if (level <= (DAYS_IN_NOV-startDayInNov)) {
    //    shaveDate = "Nov " + getWithOrdinalSuffix(startDayInNov+level);
    //} else {
    //    shaveDate = "Dec " + getWithOrdinalSuffix(((startDayInNov+level)%DAYS_IN_NOV));
    //}

    shaveDate = "Dec " + getWithOrdinalSuffix((level+1));

    shaveDateLabel = document.querySelector("#shaveDate")
    shaveDateLabel.lastElementChild.innerHTML = `${shaveDate}`;

    // Position Shave Date Label
    percentage = level * 6.667 - 3.334;
    shaveDateLabel.style.bottom = `${percentage}%`;

    // Add Moustashes
    thermometerDiv = document.querySelector("#thermometer");
    thermometerDiv.innerHTML = "";
    for (let i = 0; i < level+1; i++) {
        thermometerDiv.innerHTML += `<div class="stackStashContainer"></div>`;
    }
}

function setSaveAmount(amount) {
    console.log("Setting Save Amount to $"+amount);
    console.log({div: (document.querySelector("#saveLabel"))})
    document.querySelector(".saveAmount").lastElementChild.innerHTML = `$${amount}`;
}

function setShaveAmount(amount) {
    console.log("Setting Shave Amount to $"+amount);
    console.log(document.querySelector("#shaveLabel"))
    document.querySelector(".shaveAmount ").lastElementChild.innerHTML = `$${amount}`;
}

// Helper Functions
function getWithOrdinalSuffix(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}




/* Old content mod functions 
async function getDonationsData(uri, username) {
    console.log(uri, username)
    const res = await fetch(`http://localhost:8080/${uri}?username=${username}`);
    const donationsData = await res.json();

    console.log("Got Data");
    console.log(donationsData);

    document.getElementById('loadingContent').style.display = "none";
    document.getElementById('content').style.display = "flex";

    saveAmount = donationsData.saveAmount;
    shaveAmount = donationsData.shaveAmount;

    dollarsPerLevel = 5;

    unboundLevel = 15 + Math.ceil(((saveAmount - shaveAmount)/dollarsPerLevel));

    level = Math.min(Math.max(unboundLevel, 0), 30)

    console.log("Save Amount: "+saveAmount);
    console.log("Shave Amount: "+shaveAmount);
    console.log("Level: "+level);

    setSaveAmount(saveAmount);
    setShaveAmount(shaveAmount);
    setDonationLevel(level);
}
  
function setDonationLevel(level) { //30 levels: 0 -> 30
    endDate = ""
    if (level < 15) {
        endDate = "Nov " + getWithOrdinalSuffix(15+level);
    } else {
        endDate = "Dec " + getWithOrdinalSuffix(((15+level)%30));
    }

    endDateLabel = document.getElementById("endDateLabel")
    endDateLabel.lastElementChild.innerHTML = `${endDate}`;
    labelWidth = endDateLabel.offsetWidth;
    percentage = level / 30 * 100;
    endDateLabel.style.left = `${percentage}%`;

    document.getElementById("wave").style.left = `calc(${percentage}% + 5px)`
    document.getElementById("fill").style.width = `calc(${percentage}% - 10px)`

}

function setSaveAmount(amount) {
    console.log("Setting Save Amount to $"+amount);
    console.log({div: (document.querySelector("#saveLabel"))})
    document.querySelector("#saveLabel").lastElementChild.innerHTML = `$${amount}`;
}

function setShaveAmount(amount) {
    console.log("Setting Shave Amount to $"+amount);
    console.log(document.querySelector("#shaveLabel"))
    document.querySelector("#shaveLabel").lastElementChild.innerHTML = `$${amount}`;
}
*/