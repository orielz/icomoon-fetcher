const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs-extra');
const unzip = require('unzip');
const os = require('os');
const chokidar = require('chokidar');
const emoji = require('node-emoji')

const {idle, getMostRecentFileName, catchAsyncErrors, log} = require('./utils')
const { URLS, SELECTORS } = require('./consts');
const {ICOMOON_USER, ICOMOON_PASS, FONT_NAME, ICONS_FILE_PATH, ICONS_FONTS_DIR, OVERWRITE_FONTS_PATH} = process.env;
const DOWNLOADS_DIR = path.join(os.homedir(), 'Downloads');
const EXTRACTED_FONTS_DIR = path.join(DOWNLOADS_DIR, FONT_NAME);
const EXTRACTED_ICONS_FILE = path.join(EXTRACTED_FONTS_DIR, 'style.css');

(async () => {
  
  await fs.ensureDir(DOWNLOADS_DIR);
  
  const browser = await puppeteer.launch({haedless: false});
  const page = await browser.newPage();

  await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: DOWNLOADS_DIR});

  await catchAsyncErrors(() => page.goto(URLS.login))
  const submitButton = await catchAsyncErrors(() => page.waitForSelector(SELECTORS.submitButton, {visible: true}));
  
  const emailField = await page.$(SELECTORS.emailInput);
  const passField = await page.$(SELECTORS.passwordInput);
  
  emailField.click();
  emailField.type(ICOMOON_USER);
  await idle(500);
  passField.type(ICOMOON_PASS);
  await idle(500);
  
  submitButton.click();
  
  await page.waitForFunction(() => window.location.href === 'https://icomoon.io/#profile');

  log(`Logged in to icomoon`);

  await catchAsyncErrors(() => page.goto(URLS.select));
  
  (await catchAsyncErrors(() => page.waitForSelector(SELECTORS.selectFont, {visible: true}))).click();
  
  catchAsyncErrors(() => page.goto(URLS.selectFont, {timeout: 0}));

  const numOfFilesBeforeDownload = await catchAsyncErrors(() => fs.readdir(DOWNLOADS_DIR).length, `Unable to access ${DOWNLOADS_DIR}`);
  
  (await catchAsyncErrors(() => page.waitForSelector(SELECTORS.downloadFont, {visible: true}))).click();
  
  log(`Downloading fonts...`);

  await new Promise((resolve, reject) => {
    const watcher = fs.watch(DOWNLOADS_DIR, { encoding: 'buffer' }, (e, filename) => { 
      if (filename) { 
        watcher.close(); 
        resolve(); 
      } 
    });
  });
  
  log(`Fonts downloaded`);

  const mostRecentFileName = getMostRecentFileName(DOWNLOADS_DIR);
  const mostRecentFilePath = path.join(DOWNLOADS_DIR, mostRecentFileName);

  fs.createReadStream(mostRecentFilePath)
    .pipe(unzip.Extract({ path: EXTRACTED_FONTS_DIR }));

  log(`Fonts extracted to ${EXTRACTED_FONTS_DIR}`);

  let content = await fs.readFile(EXTRACTED_ICONS_FILE, 'utf8');
  
  if (OVERWRITE_FONTS_PATH) {
    content = content.replace(/fonts/g, OVERWRITE_FONTS_PATH);
  }

  await fs.writeFile(ICONS_FILE_PATH, content);

  await fs.copy(path.join(EXTRACTED_FONTS_DIR, 'fonts'), ICONS_FONTS_DIR)

  log(`Fonts copied to ${ICONS_FONTS_DIR}`);

  await browser.close();

  log(`${emoji.get('thumbsup')}`);
  
  process.exit(0);

})();