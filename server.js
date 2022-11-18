const express = require("express");
const path = require("path");
const puppeteer = require('puppeteer')

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

let data = null;
let donations = [];

let saveKeyword = "q";
let shaveKeyword = "k"



async function scrapeDonations() {
    try {
        const URL = 'https://ca.movember.com/mospace/14089981?fundraiseLP=varB&gclid=Cj0KCQjwqoibBhDUARIsAH2OpWgJD4MaSzkcWAV1l-pOCHncMfDT9A2yTqWhH4Zti8QzT040hXAkLuAaApsoEALw_wcB'
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
        //res.status(400).send("Error while scraping donations data from Movember");
    }
}

async function getShaveAndSaveAmount() {
    await scrapeDonations()
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

app.get("/", async (req, res) => {
    res.render("main");
});

app.get("/reloadDonations", async (req, res) => {
    await scrapeDonations()
    res.render("donations", { donations: donations });
});

app.get("/donations", async (req, res) => {
    res.render("donations", { donations: donations });
});

app.get('/fetch', async (req, res) => {
    data = await getShaveAndSaveAmount()
    res.json(data);
});

app.get('/fetchPreloaded', async (req, res) => {
    if (data == null) {
        data = await getShaveAndSaveAmount()
    }
    res.json(data);
});

app.get('/preloaded', async (req, res) => {
    res.render("pre-loaded");
});

app.listen(3000, () => {
    console.log("server started on port 3000");
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