console.log("This is coming from script.js");

const getDonationsData = async () => {
    const res = await fetch("http://localhost:3000/fetch");
    const donationsData = await res.json()

    // Use Donation Data to populate HTML data visualization
    for (const data in donationsData.donations) {
        console.log(donationsData.donations[data])
    }
    document.getElementById('cup').style.visibility = "hidden";
}
  
getDonationsData();