var competitionJson
var savedIndex = null

async function getCompetition() {
    let queryString = window.location.search

    
    fetch('/getCompetition'+ queryString, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        competitionJson = data
        if(savedIndex != null) {
            personResultTableMaker(savedIndex)
        } else {
            classResultTableMaker()
        }
    })
    .catch((error) => {
        console.log(error)
        showError()
    })
}

function showError() {
    let mainContainer = document.getElementById("main-container")
    mainContainer.innerHTML = '<h1 class="display-4 error" style="text-align: center">Competition file not found / Can\'t convert XML</h1>'
}




function classResultTableMaker() {
    savedIndex = null
    var classResultList
    
    try {
        document.getElementById("competitionName").innerText = competitionJson.ResultList[0].Event[0].Name[0].text[0]
    } catch (error) {
        document.getElementById("competitionName").innerText = "-"
    }
    
    try {
        classResultList = competitionJson.ResultList[0].ClassResult
    } catch (error) {
        console.log("Bad Format")
        let mainContainer = document.getElementById("main-container")
        mainContainer.innerHTML = '<div class="error" style="text-align: center"> <p class="display-4">Bad Format</p> <p>XML uploaded to the server is bad formatted</p> </div>'
        return
    }
    

    let table = document.getElementById("table")
    table.innerHTML = ""

    let tableHead = document.createElement("thead")
    tableHead.innerHTML = '<tr> <th>Class</th> <th>Length</th> <th>Climb</th> <th># Controls</th> </tr>'
    table.append(tableHead)
    
    let tableBody = document.createElement("tbody")
    
    for(el in classResultList) {

        let tableRow = document.createElement("tr")

        let className = document.createElement("th")
        try {
            className.innerHTML = '<a href="" onClick="personResultTableMaker('+ el + '); event.preventDefault()">' + classResultList[el].Class[0].Name[0].text[0] + '</a>'
        } catch (error) {
            className.innerText = "-"
        }

        let classLength = document.createElement("td")
        try {
            classLength.innerText = classResultList[el].Course[0].Length[0].text[0]
        } catch (error) {
            classLength.innerText = "-"
        }
        
        let classClimb = document.createElement("td")
        try {
            classClimb.innerText = classResultList[el].Course[0].Climb[0].text[0]
        } catch (error) {
            classClimb.innerText = "-"
        }
        
        let classControl = document.createElement("td")
        try {
            classControl.innerText = classResultList[el].Course[0].NumberOfControls[0].text[0]
        } catch (error) {
            classControl.innerText = "-"
        }
        

        tableRow.append(className)
        tableRow.append(classLength)
        tableRow.append(classClimb)
        tableRow.append(classControl)


        tableBody.append(tableRow)
    }

    table.append(tableBody)
}

function personResultTableMaker(classResultIndex) {
    savedIndex = classResultIndex
    let personResultList = competitionJson.ResultList[0].ClassResult[classResultIndex].PersonResult

    let table = document.getElementById("table")
    table.innerHTML = ""

    let tableHead = document.createElement("thead")
    tableHead.innerHTML = '<tr> <th>Surname</th> <th>Name</th> <th>Organization</th> <th>Start time</th> <th>Finish time</th> <th>Time difference</th> </tr>'
    table.append(tableHead)
    
    let tableBody = document.createElement("tbody")
    
    for(el in personResultList) {

        let startTime
        let finishTime 

        let tableRow = document.createElement("tr")

        let personSurname = document.createElement("th")
        try {
            personSurname.innerText =  personResultList[el].Person[0].Name[0].Family[0].text[0]
        } catch (error) {
            personSurname.innerText = "-"
        }

        let personName = document.createElement("th")
        try {
            personName.innerText =  personResultList[el].Person[0].Name[0].Given[0].text[0]
        } catch (error) {
            personName.innerText = "-"
        }

        let personOrganization = document.createElement("td")
        try {
            personOrganization.innerText =  personResultList[el].Organisation[0].Name[0].text[0]
        } catch (error) {
            personOrganization.innerText = "-"
        }

        let personStartTime = document.createElement("td")
        try {
            personStartTime.innerText =  personResultList[el].Result[0].StartTime[0].text[0]
            startTime = Date.parse(personResultList[el].Result[0].StartTime[0].text[0])
        } catch (error) {
            personStartTime.innerText = "-"
        }

        let personFinishTime = document.createElement("td")
        try {
            personFinishTime.innerText =  personResultList[el].Result[0].FinishTime[0].text[0]
            finishTime = Date.parse(personResultList[el].Result[0].FinishTime[0].text[0])
        } catch (error) {
            personFinishTime.innerText = "-"
        }

        let personDiffTime = document.createElement("td")
        if(!isNaN(startTime) && !isNaN(finishTime)) {
            let diffTime = finishTime - startTime
            personDiffTime.innerText = convertToTime(diffTime)
        } else {
            personDiffTime.innerText = "-"
        }

        tableRow.append(personSurname)
        tableRow.append(personName)
        tableRow.append(personOrganization)
        tableRow.append(personStartTime)
        tableRow.append(personFinishTime)
        tableRow.append(personDiffTime)


        tableBody.append(tableRow)
    }

    table.append(tableBody)
    document.getElementById("back-button").classList.remove("disabled")

}

function buttonBack() {
    classResultTableMaker(competitionJson)
    document.getElementById("back-button").classList.add("disabled")
}

function convertToTime(ms) {
    
    var seconds = ms / 1000
    
    var hours = parseInt( seconds / 3600 ) 
    seconds = seconds % 3600 
    
    var minutes = parseInt( seconds / 60 )

    seconds = seconds % 60

    return(("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" +seconds).slice(-2))
}


// function classResultsTableMaker(competitionJson) {
//     let competitionName = competitionJson.ResultList.Event.Name.text
//     document.getElementById("competitionName").innerText = competitionName

//     classResults = competitionJson.ResultList.ClassResult

//     $('#table').bootstrapTable({ data: classResults })

// }

function createLink(value) {
    if(value == null) {
        return "-"
    } else {
        return '<a href="" onClick="personsResultsTableMaker(this); event.preventDefault()">'+ value+'</a>';
    }
}

// function personsResultsTableMaker(value) {

//     let tableContainer = document.getElementById("tableContainer")
//     tableContainer.innerHTML = ""

//     let table = document.createElement("table")
//     table.id = "table"
//     table.setAttribute("data-sortable", "true")
//     table.setAttribute("data-search","true")

//     let classResultIndex = value.parentElement.parentElement.getAttribute('data-index')
//     let personsResults = classResults[classResultIndex].PersonResult
//     console.log(personsResults)

//     table.innerHTML = '<thead> <tr> <th data-field="Person.Name.Family.text" data-sortable="true">Surname</th> <th data-field="Person.Name.Given.text" data-sortable="true">Nome</th> <th data-field="Organization.Name.text">Organization</th> <th data-field="Result.StartTime.text">Start Time</th> <th data-field="Result.FinishTime.text">Finish Time</th> </tr> </thead>'
    
//     tableContainer.append(table)

//     $('#table').bootstrapTable({ data: personsResults })

// }


// function classTableMaker(classResults) {
    
//     let table = document.getElementById("table")
//     table.innerHTML = ""
//     let tableHead = document.createElement("thead")
//     tableHead.innerHTML = '<tr> <th scope="col">Class</th> <th scope="col">Length</th> </tr>'
//     table.append(tableHead)
    
//     let tableBody = document.createElement("tbody")
      
//     for(el in classResults) {

//         let tableRow = document.createElement("tr")

//         let className = document.createElement("th")
//         className.innerText = undefinedCheck(classResults[el].Class[0].Name[0])

//         let classLength = document.createElement("th")
//         className.innerText = 
        
//         tryc(classResults[el].Course[0].Lenght[0] ?? "undefined")

//         tableRow.append(className)
//         tableRow.append(classLength)

//         tableBody.append(tableRow)
//     }
//     table.append(tableBody)
// }

// function personTableMaker(personResults) {

//     let table = document.getElementById("table")
//     table.innerHTML = ""
//     let tableHead = document.createElement("thead")
//     tableHead.innerHTML = '<tr> <th scope="col">Class</th> </tr>'
//     table.append(tableHead)
    
//     let tableBody = document.createElement("tbody")
      
//     for(el in classResults) {

//         let tableRow = document.createElement("tr")

//         let className = document.createElement("th")
//         className.innerText = classResults[el].Class[0].Name[0]

//         tableRow.append(className)

//         tableBody.append(tableRow)
//     }
//     table.append(tableBody)
// }

function undefinedCheck(inputVar) {
    if(typeof inputVar === "undefined") {
        return "--"
    } else {
        return inputVar
    }
    
}




function flattenJson(data) {
    var result = {};
    function recurse (cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
             for(var i=0, l=cur.length; i<l; i++)
                 recurse(cur[i], prop + "[" + i + "]");
            if (l == 0)
                result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop+"."+p : p);
            }
            if (isEmpty && prop)
                result[prop] = {};
        }
    }
    recurse(data, "");
    return result;
}
