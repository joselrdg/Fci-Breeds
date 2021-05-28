//---------------------------------------------------------------------------------------
// Copyright (c) 2001-2020 by PDFTron Systems Inc. All Rights Reserved.
// Consult legal.txt regarding legal and license information.
//---------------------------------------------------------------------------------------

const { PDFNet } = require('@pdftron/pdfnet-node');

let extractimg = (pdf) => new Promise(async (resolve, reject) => {

let nameImgs = []
    let image_counter = 0;
    const output_path = './pdfparse/images/';

    const imageExtract = async (reader) => {
      let element;
      while ((element = await reader.next()) !== null) {
        switch (await element.getType()) {
          case PDFNet.Element.Type.e_image:
          case PDFNet.Element.Type.e_inline_image:
            console.log('--> Image: ' + ++image_counter);
            console.log(' Width: ' + await element.getImageWidth());
            console.log(' Height: ' + await element.getImageHeight());
            console.log(' BPC: ' + await element.getBitsPerComponent());

            const ctm = await element.getCTM();
            let x2 = 1, y2 = 1;
            await ctm.mult(x2, y2);
            console.log(' Coords: x1=' + ctm.m_h.toFixed(3) + ', y1=' + ctm.m_v.toFixed(3) + ', x2=' + x2 + ', y2=' + y2);

            if (await element.getType() == PDFNet.Element.Type.e_image) {
              const image = await PDFNet.Image.createFromObj(await element.getXObject());
              image.export(output_path + pdf + '.' + image_counter);
              nameImgs.push(pdf + '.' + image_counter)
            }
            break;
          case PDFNet.Element.Type.e_form: // Process form XObjects
            reader.formBegin();
            await imageExtract(reader);
            reader.end();
            break;
        }
      }
    }

    const main = async () => {

      // Extract images by traversing the display list for 
      // every page. With this approach it is possible to obtain 
      // image positioning information and DPI.
      try {
        const doc = await PDFNet.PDFDoc.createFromFilePath('/tmp/1.pdf');
        doc.initSecurityHandler();

        const reader = await PDFNet.ElementReader.create();
        const itr = await doc.getPageIterator(1);
        // Read every page
        for (itr; await itr.hasNext(); await itr.next()) {
          const page = await itr.current();
          reader.beginOnPage(page);
          await imageExtract(reader);
          reader.end();
        }
      } catch (err) {
        console.log(err);
      }

      // Extract images by scanning the low-level document.
      try {
        const doc = await PDFNet.PDFDoc.createFromFilePath('/tmp/1.pdf');
        doc.initSecurityHandler();
        image_counter = 0;

        const cos_doc = await doc.getSDFDoc();
        const num_objs = await cos_doc.xRefSize();
        for (var i = 0; i < num_objs; i++) {
          const obj = await cos_doc.getObj(i);
          if (obj && !(await obj.isFree()) && await obj.isStream()) {
            // Process only images
            var itr = await obj.find("Type");
            if (!(await itr.hasNext()) || await (await itr.value()).getName() !== "XObject")
              continue;

            itr = await obj.find("Subtype");
            if (!(await itr.hasNext()) || await (await itr.value()).getName() !== "Image")
              continue;
            const image = await PDFNet.Image.createFromObj(obj);
            console.log('--> Image: ' + ++image_counter);
            console.log(' Width: ' + await image.getImageWidth());
            console.log(' Height: ' + await image.getImageHeight());
            console.log(' BPC: ' + await image.getBitsPerComponent());

            image.export(output_path + `${pdf}.` + image_counter);
            nameImgs.push(pdf + '.' + image_counter)
          }
        }
      } catch (err) {
        console.log(err);
      }
      const data = {names: nameImgs}
      resolve(data)
      console.log('Test Complete!');
    }
    // add your own license key as the second parameter, e.g. PDFNet.runWithCleanup(main, 'YOUR_LICENSE_KEY')
    PDFNet.runWithCleanup(main, 0).then(function () { PDFNet.shutdown(); });
  })

module.exports = (pdf) => extractimg(pdf)


// eslint-disable-next-line spaced-comment
//# sourceURL=ImageExtractTest.js