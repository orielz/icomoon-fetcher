const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs-extra');
const unzip = require('unzip');
const os = require('os');
const chokidar = require('chokidar');

const {idle, getMostRecentFileName} = require('./utils')
const { URLS, SELECTORS } = require('./consts');
const {ICOMOON_USER, ICOMOON_PASS, FONT_NAME, ICONS_FILE_PATH, ICONS_FONTS_DIR, OVERWRITE_FONTS_PATH} = process.env;
const DOWNLOADS_DIR = path.join(os.homedir(), 'Downloads');
const EXTRACTED_FONTS_DIR = path.join(DOWNLOADS_DIR, FONT_NAME);
const EXTRACTED_ICONS_FILE = path.join(EXTRACTED_FONTS_DIR, 'style.css');

(async () => {
  
  fs.ensureDirSync(DOWNLOADS_DIR);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: DOWNLOADS_DIR});

  await page.goto(URLS.login);

  const submitButton = await page.waitForSelector(SELECTORS.submitButton, {visible: true});
  
  const emailField = await page.$(SELECTORS.emailInput);
  const passField = await page.$(SELECTORS.passwordInput);
  
  emailField.click();
  emailField.type(ICOMOON_USER);
  await idle(500);
  passField.type(ICOMOON_PASS);
  await idle(500);
  
  submitButton.click();
  
  await page.waitForFunction(() => window.location.href === 'https://icomoon.io/#profile');

  await page.goto(URLS.select);
  
  (await page.waitForSelector(SELECTORS.selectFont, {visible: true})).click();
  
  page.goto(URLS.selectFont, {timeout: 0});

  const numOfFilesBeforeDownload = fs.readdirSync(DOWNLOADS_DIR).length;
  
  (await page.waitForSelector(SELECTORS.downloadFont, {visible: true})).click();

  await new Promise((resolve, reject) => {
    const watcher = fs.watch(DOWNLOADS_DIR, { encoding: 'buffer' }, (eventType, filename) => {
      if (filename) {
        watcher.close();
        resolve();
      }
    });
  })

  const mostRecentFileName = getMostRecentFileName(DOWNLOADS_DIR);
  const mostRecentFilePath = path.join(DOWNLOADS_DIR, mostRecentFileName);

  fs.createReadStream(mostRecentFilePath)
    .pipe(unzip.Extract({ path: EXTRACTED_FONTS_DIR }));
  
  fs.readFile(EXTRACTED_ICONS_FILE, 'utf8', (err,data) => {
    
    if (err) {
      return console.log('Error reading file', err);
    }

    if (OVERWRITE_FONTS_PATH) {
      var result = data.replace(/fonts/g, OVERWRITE_FONTS_PATH);
    }

    fs.writeFile(ICONS_FILE_PATH, result, 'utf8', (err) => {
       if (err) return console.log('Error writing file', err);
    });

  });

  fs.copySync(path.join(EXTRACTED_FONTS_DIR, 'fonts'), ICONS_FONTS_DIR)

  await browser.close();

  console.log(`Fonts extracted to ${ICONS_FONTS_DIR}`);

  return;
  
})();
