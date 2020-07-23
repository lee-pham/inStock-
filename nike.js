const puppeteer = require('puppeteer');
const accountSid = '';
const authToken = '';
const client = require('twilio')(accountSid, authToken);


const checkStock = async () => {
  const browser = await puppeteer.launch({executablePath: 'chromium-browser'});
  const page = await browser.newPage();
  await page.goto('https://www.nike.com/t/blazer-low-leather-mens-shoe-4KCkNr/CI6377-108');
  let inStock = await page.evaluate(async () => !document.getElementById('skuAndSize__24950399').disabled);
  await browser.close();
  return inStock
};

let loop = setInterval(() => {
    checkStock().then((r) => {
        let t = new Date().toLocaleString()
        if (r) {
            sms = `DETECTED STOCK ON ${t}!`
            console.log(sms)
            client.messages.create({
                body: sms,
                from: '+1',
                to: '+1'
            }).then(message => console.log(message.sid));
            clearInterval(loop)
        } else {
            console.log(`Not in stock as of ${t}. Checking again in five minutes.`)
        }
    })
}, 1000 * 60 * 5)
