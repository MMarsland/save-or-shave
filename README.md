# Save-Or-Shave

A demo project for my Movember 2022 fundraising campaign.

The idea is that the website will scrape data from the Movember donations page and allow people to donate to vote to Save or Shave my moustache using keyworkds in their donation message.

The website will graphically display the running results of the donation campaign and direct people to the Movember page to make direct donations.

## TODO

- Refactor async puppeteer functions to parse data into sided data with amounts (Use "pseudo" parsing on arbitrary keyword for now (~ "keep" vs "b"))

- Visulaiztion of Data, (Sideways thermo with Date?) (Calendar with fill?) (Start with bar with date, Build with SVGs? Sketch? Fill Background, css     positioning of text, etc...)

- Parsing of data from set to side amounts
- Username / URL passing to work for any Movember user
- Decision on donation text Keywording
- Implement Production level loading page behaviour with proper urls

### Resources Used
https://www.scrapingbee.com/blog/web-scraping-javascript/ - Options / Puppeteer
https://codepen.io/JustSaas/pen/xYwLag - Cup loading image
https://levelup.gitconnected.com/render-dynamic-content-in-nodejs-using-templates-a58cae681148 - Express
https://stackoverflow.com/questions/244183/how-to-display-a-loading-screen-while-site-content-loads - Loading Page Via XMLHTTPRequest