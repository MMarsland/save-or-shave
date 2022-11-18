# Save-Or-Shave

A demo project for my Movember 2022 fundraising campaign. (May not be completed until 2023, or perhaps will be slightly improved each year)

The idea is that the website will scrape data from the Movember donations page and allow people to donate to vote to Save or Shave my moustache using keywords in their donation message.

The website will graphically display the running results of the donation campaign and direct people to the Movember page to make direct donations.

## Usage
- Follow Tutorials listed below to install the required NodeJS packages (Node, npm, express, puppeteer, etc...)
- Use "npm start" to start the server (in dev mode with nodemon to auto-reload)
- go to "localhost:3000" to view the hosted package
- Will eventually be using Heroku to host the webpage (Or google hosting is possible too (I think))

## TODO

- Username / URL passing to work for any Movember user
- Add Username label

- Update Loading Page (Moustashe logo filling instead of cup)

- Add phone version with vertical thermo?

- Decision on donation text Keywording (SHAVE, vs SAVE)



### Resources Used
https://www.scrapingbee.com/blog/web-scraping-javascript/ - Options / Puppeteer
https://codepen.io/JustSaas/pen/xYwLag - Cup loading image
https://levelup.gitconnected.com/render-dynamic-content-in-nodejs-using-templates-a58cae681148 - Express
https://stackoverflow.com/questions/244183/how-to-display-a-loading-screen-while-site-content-loads - Loading Page Via XMLHTTPRequest
https://stackoverflow.com/questions/69604544/how-to-send-data-from-server-to-client-in-express - requesting / sending just JSON data to page