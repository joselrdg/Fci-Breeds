#!/usr/bin/env node
const path = require('path');
var fs = require('fs');
// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra');
// puppeteer.use(require('puppeteer-extra-plugin-repl')())

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());


const scrapePdf = (browserInstance, arrayUrlS) => new Promise(async (resolve, reject) => {
    // async function scrapeAll(browserInstance) {
    let browser;
    try {
        async function resolveAfter(urlS, numero) {
            const url = 'http://www.fci.be/'
            browser = await browserInstance;
            // process.exit(31);
            // use tor
            //const browser = await puppeteer.launch({args:['--proxy-server=socks5://127.0.0.1:9050']});
            console.log('Descargando pdf de: ' + urlS)
            const page = await browser.newPage();

            // https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#pagegotourl-options
            const waittill = { timeout:  300000, waitUntil: ['networkidle2'] }
            await page.goto(url, waittill);

            console.log('Convert a UTF-8 String to an ArrayBuffer')
            await page.exposeFunction("writeABString", async (strbuf, targetFile) => {

                const str2ab = function _str2ab(str) { // Convert a UTF-8 String to an ArrayBuffer

                    let buf = new ArrayBuffer(str.length); // 1 byte for each char
                    let bufView = new Uint8Array(buf);

                    for (let i = 0, strLen = str.length; i < strLen; i++) {
                        bufView[i] = str.charCodeAt(i);
                    }
                    return buf;
                }

                return new Promise((resolve, reject) => {

                    // Convert the ArrayBuffer string back to an ArrayBufffer, which in turn is converted to a Buffer
                    let buf = Buffer.from(str2ab(strbuf));

                    // Try saving the file.        
                    fs.writeFile(targetFile, buf, (err, text) => {
                        if (err) reject(err);
                        else resolve(targetFile);
                    });
                });
            });



            console.log('Convert an ArrayBuffer to an UTF-8 String...')
            await page.evaluate((urlS, numero) => {
                function arrayBufferToString(buffer) { // Convert an ArrayBuffer to an UTF-8 String
                    let bufView = new Uint8Array(buffer);
                    let length = bufView.length;
                    let result = '';
                    let addition = Math.pow(2, 8) - 1;

                    for (let i = 0; i < length; i += addition) {
                        if (i + addition > length) {
                            addition = length - i;
                        }
                        result += String.fromCharCode.apply(null, bufView.subarray(i, i + addition));
                    }
                    return result;
                }

                let geturl = urlS;
                // const filename = geturl.split('/').pop().replace(/\?.*$/, '');


                return fetch(geturl, {
                    credentials: 'same-origin', // usefull when we are logged into a website and want to send cookies
                    responseType: 'arraybuffer', // get response as an ArrayBuffer
                })
                    .then(response => response.arrayBuffer())
                    .then((arrayBuffer) => {
                        let bufstring = arrayBufferToString(arrayBuffer);
                        return window.writeABString(bufstring, `/tmp/${numero}.pdf`);
                    })
                    .catch((error) => {
                        console.log('Request failed: ', error);
                    });
            }, urlS, numero
            );
        }
        // await page.repl()
        // await browser.repl()
        let numName = 0
        let fin = 0
        for (arr in arrayUrlS) {
            for (urls in arrayUrlS[arr]) {
                await resolveAfter(arrayUrlS[arr][urls], numName)
                numName++
                console.log(`Tarea completada. Pdfs descargados: ${numName}`)
            }
            fin++
            if (fin >= arrayUrlS.length) {
                resolve(numName)
            }
        }
    }
    catch (err) {
        console.log("Could not resolve the browser instance => ", err);
    }
})

module.exports = (browserInstance, urlS) => scrapePdf(browserInstance, urlS)