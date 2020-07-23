const puppeteer = require('puppeteer');
const accountSid = '';
const authToken = '';
const client = require('twilio')(accountSid, authToken);

const checkCar = async () => {
  const browser = await puppeteer.launch({executablePath: 'chromium-browser', headless: false})  // necessary for running on Raspberry Pi
  // const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const targetLocation = 'https://www.enterprise.com/en/car-rental/locations/us/ma/downtown-boston-government-center-10af.html'
  // const targetLocation = 'https://www.enterprise.com/en/car-rental/locations/us/ma/boston-roxbury-10l9.html'
  await page.goto(targetLocation)
  await page.waitFor(1000 * 10)

  await page.setViewport({width: 1920, height: 944})

  
  await page.waitForSelector('.date-time-form #time-picker-5')
  await page.click('.date-time-form #time-picker-5')
  await page.select('.date-time-form #time-picker-5', '8:00 AM')

  await page.waitForSelector('.date-time-selector > .cf > #dropoffCalendarFocusable > div > .icon')
  await page.click('.date-time-selector > .cf > #dropoffCalendarFocusable > div > .icon')
  await page.waitForSelector('.days > tr > td > .day > .pickup')
  await page.click('.days > tr > td > .day > .pickup')

  await page.waitForSelector('.date-time-form #time-picker-6')
  await page.click('.date-time-form #time-picker-6')
  await page.select('.date-time-form #time-picker-6', '11:30 PM')
  
  await page.waitForSelector('#book #continueButton')
  await page.click('#book #continueButton')
  await page.waitFor(1000 * 10)
  await browser.close()
  if (page.url() === 'https://www.enterprise.com/en/reserve.html') {
    return true
  } else {
    return false
  }
}


let loop = setInterval(() => {
  checkCar().then((r) => {
      let t = new Date().toLocaleString()
      if (r) {
          sms = `DETECTED CAR ON ${t}! (Could be false alarm.)`
          console.log(sms)
          client.messages.create({
              body: sms,
              from: '+1',
              to: '+1'
          }).then(message => console.log(message.sid));
          clearInterval(loop)
      } else {
          console.log(`No cars at Government Center as of ${t}. Checking again in five minutes.`)
      }
  })
}, 1000 * 60 * 5)
