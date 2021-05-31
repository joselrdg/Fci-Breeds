const fs = require("fs");
const pdf = require("pdf-parse");
const extractimg = require("./pdftron");
const extractimgScrip = require("./extractimg");

const rimraf = require("rimraf");
const { PNG } = require("pngjs");
const pako = require("pako");
const { PDFDocumentFactory, PDFName, PDFRawStream } = require("pdf-lib");
const { Console } = require("console");

const pdfAObjt = (numeroE, idioma) =>
  new Promise(async (resolve, reject) => {
    const nombPdf = [];
    const arrData = [];
    const errores = [];
    try {
      for (let i = 0; i < numeroE; i++) {
        const name = `/tmp/breeds/${idioma}/${i}.pdf`;
        // const name = `/tmp/2.pdf`
        nombPdf.push(name);
      }


      let contador = 0;

      const contadorFun = () => {
        if (contador < numeroE) {
          resolveAfter(nombPdf[contador]);
        } else {
          console.log(`${contador} Pdfs procesados. Tarea completada`);
          resolve([arrData, errores]);
        }
      };

      async function resolveAfter(url) {
        let dataObj = { raza: [], tamano: [], img: [] };
        let dataOk = { language: idioma };

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
          if (contador <= 41) {
            dataOk.grupo = 1;
          } else if (contador <= 93) {
            dataOk.grupo = 2;
          } else if (contador <= 127) {
            dataOk.grupo = 3;
          } else if (contador <= 167) {
            dataOk.grupo = 5;
          } else if (contador <= 236) {
            dataOk.grupo = 6;
          } else if (contador <= 270) {
            dataOk.grupo = 7;
          } else if (contador <= 292) {
            dataOk.grupo = 8;
          } else if (contador <= 318) {
            dataOk.grupo = 9;
          } else {
            dataOk.grupo = 10;
          }

          arrData.push(dataOk);
          console.log("Objeto creado. Pdf: " + (contador + 1));
          contador++;
          contadorFun();
          //     })
          // })
          // .catch((e) => console.error(e));
        };

        // const extimgD = () => {
        //   extractimgD(contador)
        //     .then(d => {
        //       dataObj.images.push(d)
        //       extimg()
        //     })
        //     .catch(e => console.error(e))
        // }

        let dataBuffer = fs.readFileSync(url);

        await pdf(dataBuffer).then(function (data) {
          const nombre = () => {
            let dat = data.text.replace(/ N°| n° | Nº | Nr/, "*+*+");
            // if (contador === 47) {
            //   dat = dat.replace("FCI-St", "*.*.");
            //   dat = dat.replace("*+*+", "FCI-St");
            //   dat = dat.split("*.*.");
            // } else if (contador === 190) {
            //   dat = dat
            //     .replace("Estándar-FCI", "*+*+")
            //     .replace("Estándar FCI", "-.-.-");
            //   dat = dat.split("*+*+");
            //   dat = dat[1].split("-.-.-");
            // } else if (contador >= 300 && contador <= 302) {
            //   dat = dat.split("*+*+");
            // } else {
            dat = dat.split("*+*+");
            // }
            dat = dat[1].replace("FCI", "*+*+");
            dat = dat.split("*+*+");
            let name = dat[0].split("\n");
            const dat2 = [];
            name.forEach((element, i) => {
              if (i > 0) {
                element = element.replace(/ {2,}/g, "");
                element = element.replace(/^ /, "").replace(/ $/, "");
                const splitespacio = element.split("\n");
                splitespacio.forEach((element) => {
                  if (element.length > 2 && element[0] != "©") {
                    dat2.push(element);
                  }
                });
              }
            });

            if (dat2.length > 1) {
              (dataOk.NOMBRE1 = dat2[0]), (dataOk.NOMBRE2 = dat2[1]);
            } else {
              dataOk.NOMBRE1 = dat2[0];
            }
            dat = dat[1].replace(/ {1,}/g, " ");
            return dat;
          };
          let claves = [];
          if (idioma === "es") {
            claves = [
              "ORIGEN",
              "FECHA",
              "UTILIZACIÓN",
              "BREVE RESUMEN HISTÓRICO",
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
          } else if (idioma === "en") {
            claves = [
              "ORIGIN",
              "DATE",
              "UTILIZATION",
              "BRIEF HISTORICAL SUMMARY",
              "GENERAL APPEARANCE",
              "IMPORTANT PROPORTIONS",
              "IMORTANT PROPORTIONS",
              "BEHAVIOUR / TEMPERAMENT",
              "BEHAVIOUR/TEMPERAMENT",
              "HEAD",
              "CRANIAL REGION",
              "FACIAL REGION",
              "EYES",
              "EARS",
              "NECK",
              "BODY",
              "TAIL",
              "LIMBS",
              "FOREQUARTERS",
              "HINDQUARTERS",
              "GAIT / MOVEMENT",
              "GAIT/MOVEMENT",
              "COAT",
              "Colour",
              "SIZE",
              "FAULTS",
              // "FALTAS GRAVES",
              // "FALTAS DESCALIFICANTES",
            ];
          } else if (idioma === "de") {
            claves = [
              "URSPRUNG",
              "DATUM",
              // "UTILIZATION",
              "KURZER GESCHICHTLICHER ABRISS",
              "ALLGEMEINES ERSCHEINUNGSBILD",
              "WICHTIGE PROPORTIONEN",
              "VERHALTEN / CHARAKTER",
              "VERHALTEN/CHARAKTER",
              "KOPF",
              "OBERKOPF",
              "GESICHTSSCHÄDEL",
              "AUGEN",
              "OHREN",
              "HALS",
              "KÖRPER",
              "RUTE",
              "GLIEDMASSEN",
              "VORDERGLIEDMASSEN",
              "HINTERGLIEDMASSEN",
              "GANGWERK",
              "HAUT",
              "HAARKLEID",
              "GEWICHT",
              "FEHLER",
              // "FALTAS GRAVES",
              // "FALTAS DESCALIFICANTES",
            ];
          } else if (idioma === "fr") {
            claves = [
              "ORIGINE",
              "DATE",
              "UTILISATION",
              "BREF APERCU HISTORIQUE",
              "ASPECT GENERAL",
              // "Aspect général",
              "PROPORTIONS IMPORTANTES",
              // "Proportions importantes",
              "COMPORTEMENT / CARACTERE",
              "COMPORTEMENT/CARACTERE",
              // "Comportement / caractère",
              // "Comportement/caractère",
              "TETE",
              // "Tête",
              "REGION CRANIENNE",
              "REGION FACIALE",
              "YEUX",
              "OREILLES",
              "COU",
              "CORPS",
              "QUEUE",
              "MEMBRES",
              "MEMBRES ANTERIEURS",
              // "Membres antérieurs",
              "MEMBRES POSTERIEURS",
              // "Membres postérieurs",
              "ALLURES",
              "PEAU",
              "ROBE",
              "TAILLE ET POIDS",
              "TAILLE / POIDS",
              "TAILLE/POIDS",
              "DEFAUTS",
              "Défauts",
              // "FALTAS GRAVES",
              // "FALTAS DESCALIFICANTES",
            ];
          }

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

          const indexParse = (a, b, iClaves) => {
            const dataParse1 = filtro1();
            let indexA = dataParse1.indexOf(a);
            let indexB = dataParse1.indexOf(b);
            let toUpA = a;

            if (
              a === "FALTAS" ||
              a === "FAULTS" ||
              a === "FEHLER" ||
              a === "DEFAUTS" ||
              a === "Défauts"
            ) {
              indexB = dataParse1.length;
            } else if (indexA === -1) {
              toUpA = "";
              let minus = a.toLowerCase();
              toUpA = a[0].toUpperCase();
              for (let index = 1; index < minus.length; index++) {
                toUpA += minus[index];
              }
              indexA = dataParse1.indexOf(toUpA);
            } else if (indexB === -1) {
              let minus = b.toLowerCase();
              let toUp = b[0].toUpperCase();
              for (let index = 1; index < minus.length; index++) {
                toUp += minus[index];
              }
              indexB = dataParse1.indexOf(toUp);
              if (indexB === -1) {
                // console.log(
                //   "--------------------------While----------------------------"
                // );
                let conta = iClaves + 1;
                while (conta <= claves.length) {
                  indexB = dataParse1.indexOf(claves[conta]);

                  // console.log(indexB);
                  // console.log(claves[conta]);
                  if (indexB === -1) {
                    conta++;
                  } else {
                    conta = claves.length + 2;
                  }
                }
              }
            }
            if (indexA === -1 || indexB === -1) {
              return null;
            }
            let dataStrParse = "";
            for (let index = indexA; index < indexB; index++) {
              dataStrParse += dataParse1[index];
            }
            return [dataStrParse, toUpA];
          };

          const parse = () => {
            claves.forEach((e, i) => {
              let arrREt = [];
              // if (i  < claves.length) {
              let data = indexParse(e, claves[i + 1], i);
              if (data === null) {
                errores.push({ lang: idioma, pdf: `${contador}.dpf`, clave: e });
                // return console.log(
                //   "Error: No aparece la clave en el documento"
                // );
              } else {
                data = data[0].split(`${data[1]}`);
                data.forEach((element) => {
                  if (element.length > 0) {
                    element = element.replace(/\n/g, " ");
                    element = element.replace(/^: /, "");
                    element = element.replace(/^ Y PESO:/, "");
                    element = element.replace(/ {1,}/g, " ");
                    element = element.replace(/^ /, "");
                    element = element.replace(/ $/, "");

                    arrREt.push(element);
                  }
                });
              }
              let key = e.replace(/ /g, "");
              if (key === "UTILIZACIÓN") {
                key = "UTILIZACION";
              } else if (key.match("BREVE")) {
                key = "BREVERESUMENHISTORICO";
              } else if (key === "COMPORTAMIENTO/TEMPERAMENTO") {
                key = "COMPORTAMIENTO";
              } else if (key === "REGIÓNCRANEAL") {
                key = "REGIONCRANEAL";
              } else if (key === "REGIÓNFACIAL") {
                key = "REGIONFACIAL";
              } else if (key === "TAMAÑO") {
                key = "TAMANOYPESO";
              } else if (key === "BEHAVIOUR/TEMPERAMENT") {
                key = "BEHAVIOURTEMPERAMENT";
              } else if (key === "GAIT/MOVEMENT") {
                key = "GAITMOVEMENT";
              } else if (key === "COMPORTEMENT/CARACTERE") {
                key = "COMPORTEMENTCARACTERE";
              } else if (key === "TAILLEETPOIDS") {
                key = "TAILLEPOIDS";
              } else if (key === "TAILLE ET POIDS") {
                key = "TAILLEPOIDS";
              } else if (key === "TAILLE / POIDS") {
                key = "TAILLEPOIDS";
              } else if (key === "TAILLE/POIDS") {
                key = "TAILLEPOIDS";
              } else if (key === "Défauts") {
                key = "DEFAUTS";
              } else if (key === "GESICHTSSCHÄDEL") {
                key = "GESICHTSSCHADEL";
              }

              if (arrREt[0] ) {
                  arrREt[0].length > 2 
                  ? dataOk[key] = arrREt[0]
                  : null;
              }
              // }
            });
            // console.log(errores);
            return dataOk;
          };
          parse();
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

module.exports = (num, lang) => pdfAObjt(num, lang);
