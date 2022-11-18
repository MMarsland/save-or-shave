//console.log("This is coming from script.js");

async function getDonationsData(uri) {
    const res = await fetch(`http://localhost:3000/${uri}`);
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