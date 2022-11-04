console.log("This is coming from script.js");

const getDonationsData = async () => {
    const res = await fetch("http://localhost:3000/donations/");
    const donationsData = await res.json()

    for (const data in donationsData.donations) {
        console.log(donationsData.donations[data])
    }
    //document.getElementById('content').innerHTML = req.responseText;
    document.getElementById('cup').style.visibility = "hidden";
}
  
getDonationsData();