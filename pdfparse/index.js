const fs = require("fs");
const pdf = require("pdf-parse");
const extractimg = require("./pdftron");
const extractimgScrip = require("./extractimg");

const rimraf = require("rimraf");
const { PNG } = require("pngjs");
const pako = require("pako");
const { PDFDocumentFactory, PDFName, PDFRawStream } = require("pdf-lib");
const { Console } = require("console");

const pdfAObjt = (numeroE) =>
  new Promise(async (resolve, reject) => {
    const nombPdf = [];
    const arrData = [];
    try {
      for (let i = 0; i < numeroE; i++) {
        const name = `/tmp/${i}.pdf`;
        // const name = `/tmp/2.pdf`
        nombPdf.push(name);
      }

      console.log(nombPdf);

      let contador = 0;

      const contadorFun = () => {
        if (contador < numeroE) {
          resolveAfter(nombPdf[contador]);
        } else {
          console.log("Tarea terminada totalmente");
          resolve(arrData);
        }
      };

      async function resolveAfter(url) {
        let dataObj = { raza: [], tamano: [], img: [] };
        let dataOk = {
          raza: {
            nombre1: String,
            nombre2: String,
          },
        };
        let errores = [];

        const pushImg = (data) =>
          new Promise(async (resolve, reject) => {
            await dataObj.img.push(data);
            resolve("Push imagenes");
          });

        const extimg = () => {
          // extractimgScrip(contador)
          //   .then(d => {
          //     pushImg(d)
          //       .then((e) => {
          //         console.log(dataObj.img)
          if (contador <= 41) {
            dataObj.grupo = 1;
          } else if (contador <= 93) {
            dataObj.grupo = 2;
          } else if (contador <= 127) {
            dataObj.grupo = 3;
          } else if (contador <= 167) {
            dataObj.grupo = 5;
          } else if (contador <= 236) {
            dataObj.grupo = 6;
          } else if (contador <= 270) {
            dataObj.grupo = 7;
          } else if (contador <= 292) {
            dataObj.grupo = 8;
          } else if (contador <= 318) {
            dataObj.grupo = 9;
          } else {
            dataObj.grupo = 10;
          }

          arrData.push(dataObj);
          console.log("Objeto creado. Pdfs procesados: " + (contador + 1));
          contador++;
          contadorFun()
            //     })
            // })
            .catch((e) => console.error(e));
        };

        // const extimgD = () => {
        //   extractimgD(contador)
        //     .then(d => {
        //       dataObj.images.push(d)
        //       console.log(d)
        //       extimg()
        //     })
        //     .catch(e => console.error(e))
        // }

        let dataBuffer = fs.readFileSync(url);

        await pdf(dataBuffer).then(function (data) {
          const nombre = () => {
            let dat = data.text.replace("FCI-St.", "*+*+");
            dat = dat.split("Estándar-FCI");
            dat = dat[1].split("*+*+");
            let name = dat[0].split(/\n \n{1,}/);
            const dat2 = [];
            name.forEach((element, i) => {
              if (i > 0) {
                element = element.replace(/^ /, "").replace(/ $/, "");
                const splitespacio = element.split("\n");
                splitespacio.forEach((element) => {
                  if (element.length > 2) {
                    dat2.push(element);
                  }
                });
              }
            });
            if (dat2.length > 1) {
              (dataOk.nombre1 = dat2[0]), (dataOk.nombre2 = dat2[1]);
            } else {
              dataOk.nombre1 = dat2[0];
            }
            return dat[1];
          };

          const filtro1 = () => {
            let dataParse1 = nombre();
            dataParse1 = dataParse1.replace(/ {1,}/g, " ");
            dataParse1 = dataParse1.split(/\n \n{1,}/);
            const dat2 = [];
            dataParse1.forEach((e) => {
              if (!/fci|FCI/g.test(e)) {
                dat2.push(e);
              }
            });
            const filtroOk = dat2.join(`
`);
            return filtroOk;
          };

          const indexParse = (a, b) => {

            const dataParse1 = filtro1();
            const indexA = dataParse1.indexOf(a);
            let indexB = dataParse1.indexOf(b);
            if (a === 'FALTAS'){
              indexB = dataParse1.length
            }
            if (indexA === -1 || indexB === -1) {
              return null;
            }
            let dataStrParse = "";
            for (let index = indexA; index < indexB; index++) {
              dataStrParse += dataParse1[index];
            }
            // console.log(dataParse1);
            return dataStrParse;
          };

          const claves = [
            "ORIGEN",
            "FECHA",
            "UTILIZACIÓN",
            "APARIENCIA GENERAL",
            "COMPORTAMIENTO / TEMPERAMENTO",
            "CABEZA",
            "REGIÓN CRANEAL",
            "REGIÓN FACIAL",
            "OJOS",
            "OREJAS",
            "CUELLO",
            "CUERPO",
            "COLA",
            "EXTREMIDADES",
            "MIEMBROS ANTERIORES",
            "MIEMBROS POSTERIORES",
            "MOVIMIENTO",
            "MANTO",
            "TAMAÑO",
            "FALTAS",
            // "FALTAS GRAVES",
            // "FALTAS DESCALIFICANTES",
          ];
        
          const parse = () => {
            claves.forEach((e, i) => {
              let arrREt = [];
              // if (i  < claves.length) {
              let data = indexParse(e, claves[i + 1]);
              if (data === null) {
                errores.push({ pdf: `${contador}.dpf`, clave: e });
                return console.log(
                  "Error: No aparece la clave en el documento"
                );
              } else {
                data = data.split(`${e}:`);
                data.forEach((element) => {
                  if (element.length > 0) {
                    arrREt.push(element);
                  }
                });
              }
              let key = e.replace(/ /g, "");
              if (key === "UTILIZACIÓN") {
                key = "UTILIZACION";
              } else if (key === "COMPORTAMIENTO/TEMPERAMENTO") {
                key = "COMPORTAMIENTO";
              } else if (key === "REGIÓNCRANEAL") {
                key = "REGIONCRANEAL";
              } else if (key === "REGIÓNFACIAL") {
                key = "REGIONFACIAL";
              } else if (key === "TAMAÑOYPESO") {
                key = "TAMANOYPESO";
              }

              if (key != "EXTREMIDADES") {
                dataOk[key] = arrREt;
              }
              // }
            });
            console.log(errores);
            return dataOk;
          };
  parse()
          // const arrParse = data.text.split(/\n \n{1,}/)
          // arrParse.forEach((element, i) => {
          //   element = element.replace(/\n/g, ' ')
          //   if (!(/fci|FCI/g).test(arrParse[i])) {
          //     if (!((/^TRADUCCI|^Traducci/)).test(element)) {
          //       arrText.push(element)
          //     }
          //   }
          // });

          // let arrText2 = [];
          // arrText.forEach((element, i) => {
          //   if (!(/^FEDERATION/).test(arrText[i])) {
          //     arrText2.push(element)
          //   }
          // });
          // let arrText3 = [];

          // arrText2.forEach((element, i) => {
          //   if ((/^[0-9]/).test(element)) {
          //     element = element.replace(/^[0-9]/, '')
          //   }
          //   element = element.replace(/ {1,}/g, ' ')
          //   element = element.replace(/^ |^  /, '')
          //   arrText3.push(element)
          //   // if (!(/^[0-9]/).test(element)) {
          //   //     element = element.replace(/ {1,}$/, '')
          //   //     arrText3.push(element)
          //   // }
          // });

          // let arrText4 = []
          // arrText3.forEach((e => {
          //   if (!(/^[0-9]/).test(e) && e.length > 2) {
          //     arrText4.push(e)
          //   }
          // }))

          // if ((/[()]/).test(arrText4[0])) {
          //   let arr1 = arrText4[0].replace(')', '')
          //   let arr = arr1.split('(')
          //   let arrOk = []
          //   arr.forEach(element => {
          //     let e = element.replace(/( )$/, '').replace(/^( )/, '')
          //     arrOk.push(e)
          //   });
          //   dataObj.raza = arrOk
          // } else {
          //   let arr = arrText4[0].replace(/( )$/, '').replace(/^( )/, '')
          //   dataObj.raza = arr
          // }
          // const regxTamano = (/^TAMA|^Tama/)
          // const regx = [
          //   (/^ORIGEN|^Origen/),
          //   (/^FECHA|^Fecha/),
          //   (/^UTILIZACI|^Utilizaci/),
          //   (/^BREVE|^Breve/),
          //   (/^APARIENCIA|^Apariencia/),
          //   (/^COMPORTAMIENTO|^Comportamiento/),
          //   (/^CABEZA|^Cabeza/),
          //   (/^REGION CRANEAL|^Region craneal/),
          //   (/^REGION FACIAL|^Region facial/),
          //   (/^OJOS|^Ojos/),
          //   (/^OREJAS|^Orejas/),
          //   (/^CUELLO|^Cuello/),
          //   (/^CUERPO|^Cuerpo/),
          //   (/^MIEMBROS ANTERIORES|^Miembros anteriores/),
          //   (/^MIEMBROS POSTERIORES|^Miembros posteriores/),
          //   (/^MOVIMIENTO|^Movimiento/),
          //   (/^PIEL|^Piel/),
          //   (/^PELO|^Pelo/),
          //   (/^COLOR|^Color/),
          //   (/^FALTAS|^Faltas/),
          //   (/^FALTAS GRAVES|^Faltas graves/),
          //   (/^FALTAS DESCALIFICANTES|^Faltas descalificantes/),
          // ]
          // const nom = [
          //   'origen',
          //   'fecha',
          //   'utilizado',
          //   'historia',
          //   'apariencia',
          //   'comportamiento',
          //   'cabeza',
          //   'craneal',
          //   'facial',
          //   'ojos',
          //   'orejas',
          //   'cuello',
          //   'cuerpo',
          //   'eanteriores',
          //   'eposteriores',
          //   'movimiento',
          //   'piel',
          //   'pelo',
          //   'color',
          //   'faltas',
          //   'graves',
          //   'descalificantes',
          // ]
          // arrText4.forEach((element, i) => {
          //   element = element.replace(/(.)$/, '')
          //   regx.forEach((eRg, ind) => {
          //     // Tamaño y Peso
          //     if (ind === 0 && (regxTamano).test(element)) {
          //       let ele = element.split('ltura a la cruz')
          //       if (ele.length > 1) {
          //         ele = ele[1].replace(/^: /, '')
          //       } else {
          //         ele = ele[0].replace(/^: /, '')
          //         if (ele.length === 2) {
          //           ele = ele[1]
          //         }
          //       }
          //       dataObj.tamano.push(ele)
          //     } else {
          //       if (ind === 0 && (/^Altura a la/).test(element)) {
          //         dataObj.tamano.push(element)
          //       }
          //       if (ind === 0 && (/^Peso/).test(element)) {
          //         dataObj.tamano.push(element)
          //       }
          //       if ((eRg).test(element)) {
          //         if ((/: /g).test(element)) {
          //           let arr = element.split(/: /)
          //           if (arr.length <= 2) {
          //             dataObj[nom[ind]] = arr[1]
          //           } else {
          //             let nvArr = []
          //             arr.forEach((e, i) => {
          //               if (!(eRg).test(e)) {
          //                 nvArr.push(e)
          //               }
          //             })
          //             dataObj[nom[ind]] = nvArr
          //           }
          //         } else {
          //           dataObj[nom[ind]] = element // optimizar
          //         }
          //       }
          //     }
          //   });
          // });
        });
        extimg();
      }

      contadorFun();
    } catch (err) {
      console.log("Could not resolve the browser instance => ", err);
    }
  });

// //Prueba
// pdfAObjt(10)
//     .then(d => {
//         // d.forEach(element => {
//         //     console.log(element.raza)
//         // });
//         console.log(d)
//     })

module.exports = (num) => pdfAObjt(num);
