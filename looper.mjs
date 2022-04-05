import fetch from 'node-fetch';
import * as fs from 'fs'
const looper = async (bbox) => {
  const url = `https://eservices.minfin.fgov.be/arcgis/services/R2C/PlanParcellaire/MapServer/WFSServer?request=GetFeature&service=WFS&typeName=CL:Cadastral_parcels&bbox=${bbox}&srsname=epsg:3812&version=1.1.0`
  try {
    console.log('Getting ' + bbox + ' content')
    const fetcher = await fetch(url)
    const res = await fetcher.text()
    console.log('Writing content to file')
    fs.appendFile('files/' + bbox + '.xml', res, function (err) {
      if (err) return console.log(err.message)
      console.log('Done.');
    });
  } catch (e) {
    console.log(e.message)
  }
}

const getAllBbox = async () => {
  return new Promise(resolve => {
    fs.readFile('bbox_list', 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      resolve(data.trim().split('\r\n'))
    })
  })
}

const xml2json = (xml) => {
  try {
    var obj = {};
    if (xml.children.length > 0) {
      for (var i = 0; i < xml.children.length; i++) {
        var item = xml.children.item(i);
        var nodeName = item.nodeName;

        if (typeof (obj[nodeName]) == "undefined") {
          obj[nodeName] = xml2json(item);
        } else {
          if (typeof (obj[nodeName].push) == "undefined") {
            var old = obj[nodeName];

            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xml2json(item));
        }
      }
    } else {
      obj = xml.textContent;
    }
    return obj;
  } catch (e) {
    console.log(e.message);
  }
}

// const data = await getAllBbox()
// data.forEach(element => {
//     looper(element)
// });