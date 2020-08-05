const puppeteer = require('puppeteer');
const accountSid = '';
const authToken = '';
const client = require('twilio')(accountSid, authToken);

const checkPrice = async (uniqloItem) => {
  // const browser = await puppeteer.launch({executablePath: 'chromium-browser'})
  const browser = await puppeteer.launch()
  const page = await browser.newPage();
  await page.goto(uniqloItem);
  let price = await page.evaluate(async () => document.getElementsByClassName('price-sales pdp-space-price sale-price-only')[0].innerHTML);
  await browser.close();
  return parseFloat(price)
};

const shorts = 'https://www.uniqlo.com/us/en/men-dry-ex-ultra-stretch-active-shorts-422975.html'

const app = async () => {
    console.log('Starting app')
    const price_0 = await checkPrice(shorts)
    console.log(`Intial price: $${price_0}`)

    let interval = setInterval(async () => {
        let price_1 = await checkPrice(shorts)

        let t = new Date().toLocaleString()
        if (price_0 > price_1) {
            let sms = `Price reduced to $${price_1}. Visit ${shorts}`
            client.messages.create({
                body: sms,
                from: '+1',
                to: '+1'
            }).then(message => console.log(message.sid))
            console.log(`${sms} (${t})`)
            console.log('Ending app')
            clearInterval(interval)
        } else {
            console.log(`No new price ($${price_1}) detected as of ${t}`)
        }
    }, 5 * 60 * 1000)
}

app()
