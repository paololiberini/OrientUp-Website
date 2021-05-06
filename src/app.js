console.log('Node online')

const express = require('express');
const bodyParser = require('body-parser');
const sqlitedb = require('better-sqlite3');
const dbName = 'sqlite3Db/competitionDb.sqlite3'
const fs = require('fs');
const app = express();
const converter = require('xml-js');


app.use(express.text({ type: '*/*'}));
app.use(express.static('static'));

app.set("env", "production")

/* SQL queries and support functions */

const sqlQueryUploadCompetition = "UPDATE competitions SET file = @file, time = @time WHERE competitionId = @competitionId"
const sqlQueryGetCompetition = "SELECT * FROM competitions WHERE competitionId = ?"
const sqlQueryGetCompetitionsList = "SELECT * FROM competitions ORDER BY competitionId DESC"
const sqlQueryVerifyFileExistance = "SELECT file FROM competitions WHERE file == ?"
const sqlQueryCreateCompetition = "INSERT INTO competitions (name) VALUES (@name)"

function getDate() {
    let timeStamp = Date.now()

    let dateObject = new Date(timeStamp)

    let date = ("0" + dateObject.getDate()).slice(-2)
    let month = ("0" + (dateObject.getMonth() + 1)).slice(-2)
    let year = dateObject.getFullYear()
    let hours = dateObject.getHours()
    let minutes = dateObject.getMinutes()
    let seconds = dateObject.getSeconds()
    
    let fullDate = "" + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
    return fullDate
}

const db = new sqlitedb(dbName, sqlitedb.OPEN_READWRITE, {verbose: console.log} );


/* HTTP listeners */

const PATH = './xmlFiles/'

app.get('/', (req, res) => {
    res.status(200).sendFile(__dirname + "/static/index.html")
})


app.post('/appAPI/sendXml', (req, res) => {
    let competitionCode = req.header('competition-code')
    let xmlBody = req.body
    let filePath = `${PATH}${competitionCode}.xml`
    let uploadTime = getDate()

    let getStmt = db.prepare(sqlQueryGetCompetition)
    let getR = getStmt.get(competitionCode)
    
    
    if(getR != null) {
        
        fs.writeFile(filePath, xmlBody, function(err, data) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("SendXML :: "+ uploadTime + ' - Competition id: ' + competitionCode +' - File written: ' + filePath);
            }
        })
              
        let upStmt = db.prepare(sqlQueryUploadCompetition)
        let upR = upStmt.run({
            file: competitionCode + ".xml",
            time: uploadTime,
            competitionId: competitionCode
        })
        console.log(upR)

        if(getR.time == null) {
            res.status(201).send('File uploaded')
        } else {
            res.status(200).send('File updated')
        }

        
    } else {
        console.log('SendXML :: Competition code not found')
        res.status(409).send('Error: competition code not found')
    }
})


app.post('/newCompetition', (req, res) => {

    console.log(req.body)

    let stmt = db.prepare(sqlQueryCreateCompetition)
    let r = stmt.run(JSON.parse(req.body))

    console.log("NewCompetition :: Created")
    res.status(200).send("OK")

})


app.get("/getFile", (req, res) => {
    let fileName = req.query.file
    
    console.log("GetFile :: Filename" + fileName)

    let stmt = db.prepare(sqlQueryVerifyFileExistance)
    let r = stmt.get(fileName)

    console.log(r)

    if(r != null) {
        res.contentType('application/xml')
        res.sendFile(__dirname + `/xmlFiles/${r.file}`)
    } else {
        res.status(404).send("File not found")
    }

    
})


app.get("/competitionsList", (req, res) => {
    let stmt = db.prepare(sqlQueryGetCompetitionsList)
    let r = stmt.all()

    console.log("CompetitionList :: Competition list returned")

    res.json(r)
})


app.get("/competition", (req, res) => {
    res.status(200).sendFile(__dirname + "/static/competition.html")
})


app.get("/getCompetition", (req, res) => {
    
    let competitionId = req.query.id
    console.log("GetCompetition :: Id: " + competitionId)

    let stmt = db.prepare(sqlQueryGetCompetition)
    let r = stmt.get(competitionId)
    console.log(r)

    if(r != null && r.file != null) {
        fs.readFile(__dirname + `/xmlFiles/${r.file}`, 'utf8', (err, data) => {
            if(err) {
                console.log(err)
            }
            let jsonData
            try {
                jsonData = JSON.parse(converter.xml2json(data, {compact: true, alwaysArray: true, textKey: 'text'}))
                console.log(jsonData)
            } catch (error) {
                console.log("GetCompetition :: Error: xml-js can't convert file")
                res.status(404).send("Error: XML is bad formatted")
            }
            
            
            res.json((jsonData))
        })
    } else {
        res.status(404).send("Error: Not found")
    }
    
})


app.get("*", (req, res) => {
    res.status(404).sendFile(__dirname + "/static/404.html")
})


app.listen(3000, () => console.log("Listening on port 3000"));