# OrientUp Website

Web app Node.js per l'archiviazione e la visualizzazione dei risultati delle competizioni di Orienteering. 

## Software Stack

 - Node.js
   - Express.js
   - BetterSQLite3
   - xml-js
 - Bootstrap + JS


## DB

 Struttura del DB SQLite:

	CREATE TABLE "competitions" (
		"competitionId"	INTEGER NOT NULL UNIQUE,
		"name"	TEXT,
		"file"	TEXT UNIQUE,
		"time"	TEXT,
		PRIMARY KEY("competitionId" AUTOINCREMENT)
	)

## Website API

 - Invio del file XML  
	Indirizzo:

		/appAPI/sendXml

	Tipo di richiesta:

		POST

	Header:

		competition-code: competidionId
		connection: close
		Content-Type: text/xml; charset=utf-8

	Body: XML Text

 - Lista di tutte le competizioni presenti nel DB  
    Indirizzo:

		/competitionsList

	Tipo di richiesta:

		GET

	Return type:

		Application/Json

 - Dettagli di una competizione. Usa la libreria xml-js per convertire il file XML in un file JSON utilizzabile client side.  
	Indirizzo:

		/getCompetition?id=competitionId

	Tipo di richiesta:

		GET

	Return type:

		Application/Json


## To do
 - Migrazione verso un DB separato (MariaDB, PostgreSQL)
 - Implementazione di un sistema di Login
   - Implementazione schermata per visualizzare le proprie competizioni con possibilità di eliminazione