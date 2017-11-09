require('dotenv').config()

const fs = require('fs')
const puppeteer = require('puppeteer')
;(async () => {
  const browser = await puppeteer.launch({
    executablePath: './chrome/Chromium.app/Contents/MacOS/Chromium',
    headless: false
  })
  const page = await browser.newPage()

  await page.setViewport({
    width: 1024,
    height: 900
  })

  /**
  * Inject cookies from previously saved cookies file
  * @Param {string} file
  */
  async function injectCookiesFromFile(file) {
    let cb = async function(_cookies) {
      console.log('Injecting cookies from file: %s', JSON.stringify(_cookies))
      await page.setCookie(..._cookies)
    }

    fs.readFile(file, async function(err, data) {
      if (err) throw err

      let cookies = JSON.parse(data)
      await cb(cookies)
    })
  }

  /**
   * Write Cookies object to target JSON file
   * @param {string} targetFile 
   */
  async function saveCookies(targetFile) {
    let cookies = await page.cookies()
    return saveToJSONFile(cookies, targetFile)
  }

  /**
   * Write JSON object to specified target file
   * @param {string} jsonObj 
   * @param {string} targetFile 
   */
  async function saveToJSONFile(jsonObj, targetFile) {
    return new Promise((resolve, reject) => {
      try {
        var data = JSON.stringify(jsonObj)
        console.log("Saving object '%s' to JSON file: %s", data, targetFile)
      } catch (err) {
        console.log('Could not convert object to JSON string ! ' + err)
        reject(err)
      }

      // Try saving the file.
      fs.writeFile(targetFile, data, (err, text) => {
        if (err) reject(err)
        else {
          resolve(targetFile)
        }
      })
    })
  }

  /**
   * Get JSON object from page
   * @param {string} url 
   * @returns 
   */
  async function jsonObj(url) {
    const tmpPage = await browser.newPage()
    await tmpPage.goto(url, { waitUntil: 'networkidle' })
    let html = await tmpPage.$eval('pre', el => el.innerHTML)
    let result = JSON.parse(html)
    tmpPage.close()
    return result
  }

  /**
   * Get JSON object from local file
   * @param {string} file 
   */
  function getDataFromFile(file) {
    return new Promise((resolve, reject) => {
      fs.readFile(file, (err, data) => {
        if (err) reject(err)
        else {
          let jsonObj = JSON.parse(data)
          resolve(jsonObj)
        }
      })
    })
  }

  /**
   * Generate Live Screenshot
   * @param {string} id 
   */
  async function generateLiveScreenshot(id) {
    await page.goto(`https://www.zhihu.com/lives/users/${id}`)
    await page.waitForNavigation({
      timeout: 0,
      waitUntil: 'networkidle'
    })
    await page.screenshot({ path: 'zhihu.png' })
  }

  async function isLogin() {
    await page.goto('https://www.zhihu.com')
    const response = await page.goto('https://www.zhihu.com/settings/profile')
    if (response.url === 'https://www.zhihu.com/?next=%2Fsettings%2Fprofile') {
      return false
    } else if (response.url === 'https://www.zhihu.com/settings/profile') {
      console.log('已登录')
      return true
    }
  }

  // 载入本地保存的 cookie
  await injectCookiesFromFile('./cookies.json')

  const isUserLogin = await isLogin()

  if (isUserLogin) {
    try {
      const livesInfo = await getDataFromFile('./public/lives.json')
      console.log(`已获取本地 Live 信息，数量 ${livesInfo.length}`)
      await browser.close()
    } catch (err) {
      console.log('本地没有 Live 信息')
      await gotoLive()
    }
  } else {
    // 前往登陆页面
    await page.goto('https://www.zhihu.com/#signin')
    await page.click('.qrcode-signin-step1 > div:nth-child(4)')

    // 账号
    await page.type('div.account > input:nth-child(1)', process.env.ACCOUNT)
    // 密码
    await page.type('.verification > input:nth-child(1)', process.env.PASSWORD)
    // 点击登录
    await page.click('div.button-wrapper:nth-child(3) > button:nth-child(1)')

    await page.waitForNavigation({
      timeout: 0
    })

    // 保存 cookie 到本地
    await saveCookies('./cookies.json')

    await gotoLive()
  }

  async function gotoLive() {
    console.log('获取个人信息')
    const self = await jsonObj('https://api.zhihu.com/lives/people/self')

    console.log('获取 Live 信息')
    const lives = await jsonObj(`https://api.zhihu.com/people/${self.id}/lives`)

    console.log('保存已购买 Live')
    await saveToJSONFile(lives.data, './public/lives.json')

    await generateLiveScreenshot(self.id)

    await getLiveMessages(lives.data)
  }

  async function getLiveMessages(lives) {
    lives.map(async live => {
      const liveMsg = await jsonObj(
        `https://api.zhihu.com/lives/${live.id}/messages?chronology=asc&limit=1000`
      )
      await saveToJSONFile(liveMsg.data, `./public/messages/${live.id}.json`)
    })
  }
})()
