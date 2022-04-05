import * as fs from 'fs'
const exportBbox = async () => {
    return new Promise(resolve => {
        fs.readFile('eservices.minfin.fgov.be1.har', 'utf8', (err, data) => {
            if (err) {
                console.error(err)
                return
            }
            try {
                // console.log('Stringifying ...')
                // data = JSON.stringify(data)
                console.log('Parsing ...')
                data = JSON.parse(data)
                // console.log('Data length: ', data.length)
                console.log('Extracting bbox ...')
                const listOfBbox = []
                for (const key in data) {
                    for (const logKey in data[key]) {
                        for (const detail in data[key][logKey]) {
                            const request = data[key][logKey][detail].request
                            if (request && request.url) {
                                if (request.url.indexOf('CL:Cadastral_Divisions') > 1) {
                                    // listOfBbox.push(request.url.split('bbox=')[1].split('&')[0])
                                    listOfBbox.push(request.queryString.filter(value => value.name === 'bbox')[0].value)
                                }
                            }
                        }
                    }
                }
                console.log('Number of bbox found :', listOfBbox.length)
                console.log('Appending bbox to file')
                fs.appendFile('files/bbox_list', JSON.stringify(listOfBbox), function (err) {
                    if (err) return console.log(err.message)
                    console.log('Done.');
                });
                // console.log(listOfBbox[0])
            } catch (e) {
                console.log(e.message)
            }
        })
    })
}

exportBbox()