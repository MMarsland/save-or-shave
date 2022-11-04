const express = require("express");
const axios = require("axios");
const path = require("path");
const bodyParser = require("body-parser");
const puppeteer = require('puppeteer')

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

let initialTotalAmount = ""
let donations = []
let print_donation = []


async function scrapeTotalAmount() {
    try {
        const URL = 'https://ca.movember.com/mospace/14089981?fundraiseLP=varB&gclid=Cj0KCQjwqoibBhDUARIsAH2OpWgJD4MaSzkcWAV1l-pOCHncMfDT9A2yTqWhH4Zti8QzT040hXAkLuAaApsoEALw_wcB'
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(URL)

        const TOTAL_DONATIONS_SELECTOR = '#mospace-heroarea--fundraising-wrapper > div.mospace-heroarea--fundraising > div.mospace-heroarea--donations-target-amount-wrapper > h1';
        
        await page.waitForSelector(TOTAL_DONATIONS_SELECTOR);

        const textContent = await page.$eval(TOTAL_DONATIONS_SELECTOR, el => el.textContent);

        //const textContent = await (await page.evaluate(() => {return document.querySelector(TOTAL_DONATIONS_SELECTOR).textContent})).jsonValue();
        //console.log('Total Amount = ' + textContent.jsonValue());

        await browser.close()
        initialTotalAmount = textContent
        return textContent
    } catch (error) {
        console.error(error)
        //res.status(400).send("Error while scraping total doncation data from Movember");
    }
}

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

app.get("/", async (req, res) => {
    res.render("main", {
        totalAmount: initialTotalAmount
    });
});

/** 
app.get("/donations", async (req, res) => {
    await scrapeTotalAmount()
    await scrapeDonations()
    res.render("donations", { donations: donations });
});*/

app.get('/donations', async (req, res) => {
    await scrapeTotalAmount()
    await scrapeDonations()
    res.json({ donations: donations })
})

app.get("/cup", async (req, res) => {
    res.render("cup");
});

app.get("/loading", async (req, res) => {
    res.render("loading");
});

app.listen(3000, () => {
    console.log("server started on port 3000");
});

