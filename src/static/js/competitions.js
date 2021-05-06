const tableBody = document.getElementById("table-body")
const newCompetitionForm = document.getElementById("new-competition-form")



// function populateTable(competitionsList) {
//     console.log(competitionsList)

//     for(var el = 0; el < competitionsList.length; el++) {
//         var tr = document.createElement("tr")
//         tr.innerHTML = '<th scope="row">' + competitionsList[el].competitionId + '</th> <td>' + competitionsList[el].name +'</td> <td>' + competitionsList[el].path + '</td> <td>' + competitionsList[el].time + '</td>'
//         tableBody.append(tr)
//     }

// }

async function getCompetitionsList() {

   // tableBody.innerHTML = ""

    fetch('/competitionsList', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(dataString => {    
        // $('#table').bootstrapTable({data: dataString})
        // $('#table').bootstrapTable('load', dataString)
        console.log(dataString)
        makeTable(dataString)
    })

}

function makeTable(competitionsList) {

    tableBody.innerHTML = ""
    

    for(el in competitionsList) {
        let tableRow = document.createElement("tr")

        let competitionId = document.createElement("th")
        let competitionIdLink = document.createElement("a")
        try {
            if(competitionsList[el].competitionId == null) throw error

            competitionIdLink.innerText = competitionsList[el].competitionId
            competitionIdLink.setAttribute("href", "/competition?id="+ competitionsList[el].competitionId)

            competitionId.append(competitionIdLink)
        } catch (error) {
            competitionId.innerText = "-"
        }

        let competitionName = document.createElement("td")
        try {
            if(competitionsList[el].name == null) throw error

            competitionName.innerText = competitionsList[el].name
        } catch (error) {
            competitionName.innerText = "-"
        }

        let competitionPath = document.createElement("td")
        let competitionPathLink = document.createElement("a")
        try {
            if(competitionsList[el].file == null) throw error

            competitionPathLink.innerText = competitionsList[el].file
            competitionPathLink.setAttribute("href", '/getFile?file='+ competitionsList[el].file)
            competitionPathLink.setAttribute("target", "_blank")

            competitionPath.append(competitionPathLink)
        } catch (error) {
            competitionPath.innerText = "-"
        }

        let competitionTime = document.createElement("td")
        try {
            if(competitionsList[el].time == null) throw error

            competitionTime.innerText = competitionsList[el].time
        } catch (error) {
            competitionTime.innerText = "-"
        }

        tableRow.append(competitionId)
        tableRow.append(competitionName)
        tableRow.append(competitionPath)
        tableRow.append(competitionTime)


        //tr.innerHTML = '<th scope="row">' + competitionsList[el].competitionId + '</th> <td>' + competitionsList[el].name +'</td> <td>' + competitionsList[el].path + '</td> <td>' + competitionsList[el].time + '</td>'
        tableBody.append(tableRow)
    }
}


function createLink(value) {
    if(value == null) {
        return "-"
    } else {
        return '<a href="/getFile?file='+value+'" value="' + value + '" target="_blank">'+ value+'</a>';
    }
}

newCompetitionForm.addEventListener('submit', function(e) {
    
    e.preventDefault()

    let data = {
        name: document.getElementById('competition-name').value
    }

    fetch('/newCompetition', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if(response.ok) {
            var alert = document.createElement('div');
            alert.classList.add('alert', 'alert-success', 'alert-dismissable', 'fade', 'show');
            alert.innerHTML = 'Succesfully added <button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> ';
            document.getElementsByTagName('body')[0].prepend(alert);
            alert.classList.add('show')

            $('#newCompetitionModal').modal('hide')
            getCompetitionsList()
        } else {
            var alert = document.createElement('div');
            alert.classList.add('alert', 'alert-danger', 'alert-dismissable', 'fade', 'show');
            alert.innerHTML = 'Error! <button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> ';
            document.getElementsByTagName('body')[0].prepend(alert);
            alert.classList.add('show')
        }
    })
})