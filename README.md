** USER INSTRUCTIONS **
Fabio Bassignana BBC Count me up exercise Assignment
14/05/2017

Languages: Javascript, NodeJs, SQLite

Files Attachment:
- serverside.js // this is the server side file that performs every function
- db_bbc.sqlite // the database file in sqlite

the frontend page is not included.

You can create the table with this sql statement
// Create the SQLITE table
CREATE TABLE "bbcpoll" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE , "voter" INTEGER, "candidate" CHAR)


Table 
I decided to create only one table to speed-up the creation. In a real scenario, the userid is correlated to the userid in the user data table.

I used char type for insert only text in the candidate name, but is possible to create a database table with the possible choices.

Performance speedup:
The table has candidate as Index for better perfomances and speedup the poll query when votes are milions.

Frontend Page Work:
The frontend is a page with radio buttons with name candidate, in this case 4.
Clicking the VOTE button the page sent via javascript the request:
http://127.0.0.1:8000/?action=add&voter=96&candidate=b
http://127.0.0.1:8000/?action=showpoll

the parameter "action" accept two actions: add, showpoll
using add is necessary to give voter and candidate that we are voting. 

I'm passing voter via url, but is possible edit the script for taking the voter id via cookies or database.

The function/action showpoll at the moment shows only the candidates that are already voted at list 1 time.
The frontend page, via javascript has to compare data received via json and the radio button list and assign 0 votes to the candidates that are not present in the string reiceived from server.

Security:
I decide to use the add function server side for security reasons.
the nodeJs code uses in some query also the .prepare function for avoid sql injection.
# countmeup_exercise
poll generating and voting system 
