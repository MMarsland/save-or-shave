const express = require("express");
const path = require("path");
const puppeteer = require('puppeteer')
const https = require('https');
const app = express();
const fs = require('fs');


console.log(process.env.NODE_ENV)
const developmentMode = !(process.env.NODE_ENV === 'production')
console.log(developmentMode)


app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

let data = null;
let donations = [];

let saveKeyword = "target"//"SAVE";
let shaveKeyword = "h"//"SHAVE"

async function scrapeDonations(username) {
    try {
        const URL = `https://movember.com/m/${username}`
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(URL)

        const DONATIONS_SELECTOR = "div.post-donation-info"
        await page.waitForSelector(DONATIONS_SELECTOR)
        donations = await page.evaluate(() => {
            donations_elements = document.querySelectorAll("div.partial_newsfeed-post_donation")
            donations_array = Array.from(donations_elements)
            for (donation of donations_array) {
                print_donation = donation
            }
            donations_parsed = donations_array.map(donation => {
                donator = donation.querySelector("div.post-donation-info--from-name")
                amount = donation.querySelector(".post-donation-info--amount")
                message = donation.querySelector(".post-donation-info--message")
                trimmed_name = ""
                trimmed_amount = ""
                trimmed_message = ""
                try {
                    trimmed_name = donator.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()
                    trimmed_amount = amount.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()
                    trimmed_message = message.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()
                } catch {
                    //pass
                }
                    
                return {
                    donator: trimmed_name,
                    amount: trimmed_amount,
                    message: trimmed_message
                }
            })
            return donations_parsed
        });
    } catch (error) {
        console.error(error)
    }
}

async function getShaveAndSaveAmount(username) {
    await scrapeDonations(username)
    console.log(donations)
    saveAmount = 0
    shaveAmount = 0

    for (donation of donations) {
        if (donation.message.toLowerCase().includes(saveKeyword)) {
            saveAmount += parseFloat(donation.amount.replace("$", ""))
        } else if (donation.message.toLowerCase().includes(shaveKeyword)) {
            shaveAmount += parseFloat(donation.amount.replace("$", ""))
        }
    }
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
    if (req.query.username) {
        res.redirect(`/${req.query.username}`);
    } else {
        res.render("welcome");
    }
});

app.get('/fetch', async (req, res) => {
    console.log(req.query.username)
    data = await getShaveAndSaveAmount(req.query.username)
    console.log(data);
    res.json(data);
});

app.get("/instructions", async (req, res) => {
    res.render("instructions");
});

app.get("/:username", async (req, res) => {
    console.log(req.params.username)
    username = req.params.username;

    let protocol = req.protocol;
    console.log(developmentMode)
    if ( protocol == "http" && (!developmentMode)) {
        protocol = "https"
    }
    const host = req.hostname;
    const path = req.originalUrl;
    const port = process.env.PORT || PORT;

    const url = `${protocol}://${host}:${port}` //${path}
    console.log(url)

    res.render("main", {username: username, url: url});
});

/* EXTRAS */
app.get("/reloadDonations", async (req, res) => {
    await scrapeDonations()
    res.render("donations", { donations: donations });
});

app.get("/donations", async (req, res) => {
    res.render("donations", { donations: donations });
});


// Main starting function for the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => { //'192.168.1.89' || 'localhost',
  console.log(`Server listening on port ${PORT}...`);
});

// async function scrapeTotalAmount() {
//     try {
//         const URL = 'https://ca.movember.com/mospace/14089981?fundraiseLP=varB&gclid=Cj0KCQjwqoibBhDUARIsAH2OpWgJD4MaSzkcWAV1l-pOCHncMfDT9A2yTqWhH4Zti8QzT040hXAkLuAaApsoEALw_wcB'
//         const browser = await puppeteer.launch()
//         const page = await browser.newPage()
//         await page.goto(URL)

//         const TOTAL_DONATIONS_SELECTOR = '#mospace-heroarea--fundraising-wrapper > div.mospace-heroarea--fundraising > div.mospace-heroarea--donations-target-amount-wrapper > h1';
        
//         await page.waitForSelector(TOTAL_DONATIONS_SELECTOR);

//         const textContent = await page.$eval(TOTAL_DONATIONS_SELECTOR, el => el.textContent);

//         //const textContent = await (await page.evaluate(() => {return document.querySelector(TOTAL_DONATIONS_SELECTOR).textContent})).jsonValue();
//         //console.log('Total Amount = ' + textContent.jsonValue());

//         await browser.close()
//         initialTotalAmount = textContent
//         return textContent
//     } catch (error) {
//         console.error(error)
//         //res.status(400).send("Error while scraping total doncation data from Movember");
//     }
// }