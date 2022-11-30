const express = require("express");
const path = require("path");
const got = require('got');
const { JSDOM } = require("jsdom");

const app = express();

const developmentMode = !(process.env.NODE_ENV === 'production')

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));


let data = null;
let donations = [];

let saveKeyword = "SAVE" //"SAVE"
let shaveKeyword = "SHAVE" //"SHAVE"

async function scrapeDonations(username) {
    try {
        const URL = `https://movember.com/m/${username}`

        await got(URL).then(response => {

            const dom = new JSDOM(response.body);

            console.log("Evaluating")

            donation_elements = dom.window.document.querySelectorAll("div.partial_newsfeed-post_donation:not(previousCampaign)") // TODO: Not blocking previous campaign messages

            parsed_donations = []
            for (donation of donation_elements) {
                donator = donation.querySelector("div.post-donation-info--from-name")
                amount = donation.querySelector(".post-donation-info--amount")
                message = donation.querySelector(".post-donation-info--message")
                trimmed_name = ""
                trimmed_amount = ""
                trimmed_message = ""
                try {
                    trimmed_name = donator.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()
                    trimmed_amount = amount.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()
                    if(message) {
                        trimmed_message = message.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()
                    }
                } catch(error) {
                    //pass
                    console.log("Error in the trimming")
                    console.log(error)

                }
                console.log("Returning item")
                parsed_donations.push({
                    donator: trimmed_name,
                    amount: trimmed_amount,
                    message: trimmed_message
                })
            }                          
            console.log("Returning all donations")
            console.log(parsed_donations)
            donations = parsed_donations;
            return parsed_donations;

        }).catch(err => {
            console.log(err);
        });
    } catch (error) {
        console.log("ERROR SCRAPING DONATIONS")
        console.error(error)
    }
}

async function getShaveAndSaveAmount(username) {
    console.log("Getting Amounts")
    await scrapeDonations(username)
    console.log("Donations Scraped")
    saveAmount = 0
    shaveAmount = 0

    for (donation of donations) {
        if (donation.message.includes(saveKeyword)) {
            saveAmount += parseFloat(donation.amount.replace("$", ""))
        } else if (donation.message.includes(shaveKeyword)) {
            shaveAmount += parseFloat(donation.amount.replace("$", ""))
        }
    }
    console.log("Amounts Got")
    console.log({saveAmount: saveAmount, shaveAmount: shaveAmount})
    return {saveAmount: saveAmount, shaveAmount: shaveAmount}
}

/* DEV */
/*
app.get('/fetchPreloaded', async (req, res) => {
    if (data == null) {
        data = await getShaveAndSaveAmount(req.query.username)
    }
    res.json(data);
});

app.get('/preloaded/:username', async (req, res) => {
    username = req.params.username;
    res.render("pre-loaded", {username: username});
});

app.get('/content', async (req, res) => {
    res.render("justContent", {username: "exampleuser"});
});
*/

/* MAIN */
app.get("/", async (req, res) => {
    res.render("welcome");
});

app.get("/m", async (req, res) => {
    if (req.query.username) {
        res.redirect(`/m/${req.query.username}`);
    } else {
        res.redirect(`/`);
    }
});


app.get('/fetch', async (req, res) => {
    data = await getShaveAndSaveAmount(req.query.username)
    res.json(data);
});

app.get("/instructions", async (req, res) => {
    res.render("instructions");
});

app.get("/m/:username", async (req, res) => {
    username = req.params.username;

    let protocol = req.protocol;
    if ( protocol == "http" && (!developmentMode)) {
        protocol = "https"
    }
    const host = req.hostname;
    //const path = req.originalUrl;
    const port = process.env.PORT || 3000;

    let url = `${protocol}://${host}` //${path}
    console.log(developmentMode)
    if (developmentMode) {
        url = url + `:${port}`
    }
    console.log(url)

    res.render("main", {username: username, url: url});
});

/* EXTRAS */
/*
app.get("/reloadDonations", async (req, res) => {
    await scrapeDonations()
    res.render("donations", { donations: donations });
});

app.get("/donations", async (req, res) => {
    res.render("donations", { donations: donations });
});
*/

// Main starting function for the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});