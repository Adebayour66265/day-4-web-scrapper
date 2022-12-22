const fs = require('fs');
const puppeteer = require('puppeteer');

const data = {
    list: []
}

async function main(skill) {
    // lauches chromium

    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage();

    // https://ng.indeed.com/jobs?q=${front+end+developer}&l=Lagos
    await page.goto(`https://ng.indeed.com/jobs?q=${skill}&l=Lagos`, {
        timeout: 0,
        waitUntil: 'networkidle0'
    });

    const pdf = page.pdf({
        path: '',
        format: "A4"
    });

    const screenshot = page.screenshot({
        path: '',
        fullPage: true
    })

    const jobData = await page.evaluete(async (data) => {
        const items = document.querySelectorAll('td.resultContent')
        items.forEach((item, index) => {
            console.log(`scraping data of product: ${index}`);
            const title = item.querySelector('h2.jobTitle>a')?.innerText;
            const link = item.querySelector('h2.jobTitle>a')?.href;
            const salary = item.querySelector('div.metadata.salary-snippet-container > div')?.href;
            const companyName = item.querySelector('span.companyName')?.innerText;

            if (salary === null) {
                salary = "not defined"
            }

            data.list.push({
                title,
                salary,
                companyName: companyName,
                link: link
            })
        });
        return data
    }, data);

    console.log(`sucessfully collected ${jobData.list.length} products`);

    let response = await jobData;

    let json = JSON.stringify(jobData, null, 2);
    fs.writeFile('job.json', json, 'utf-8', () => {
        console.log('written in job.json');
    })
    browser.close();
    return response;
}

module.exports = main;