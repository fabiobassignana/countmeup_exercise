// Main NodeJs server side script for adding votes and show poll
// Fabio Bassignana 14/05/2017




// Load the http module to create an http server.
var http = require('http');
var url = require('url');
var sqlite3 = require('sqlite3').verbose();  
var db = new sqlite3.Database('db_bbc.sqlite');  
var resp;

// this function prints a string with poll result
function showpoll()
{
	db.all("SELECT candidate, COUNT(*) AS votes FROM bbcpoll GROUP BY candidate ORDER BY votes desc", 
	  function(err, rows) 
	  {  
		  // I take the results in asc order and I will send to the frontend via json string
		  var message = JSON.stringify(rows);
		  print_output(201, message);
	  }
	 );
}

// this function is used to print output results
function print_output(code, message){
	console.log(code);
	resp.writeHead(code, {"Content-Type": "text/plain"});
	if (message)
	{
		resp.write(message);
		console.log(message);
	}
	resp.end();
}

// main function for adding votes
function addvote(voter, candidate) {
// count user votes
var stmt_uservotes = db.prepare("SELECT COUNT(*)as cnt FROM bbcpoll WHERE voter = ?");
stmt_uservotes.all(voter, 
	function (err, rows) 
	{
		if(err){
			print_output(502, err);
		}else{
			var cnt = rows[0].cnt;
			stmt_uservotes.finalize();  
			if(cnt<3)
			{
				// user can vote 
				db.serialize(function() 
				{  
				  var stmt = db.run(
					"INSERT INTO bbcpoll VALUES (null,$voter,$candidate)", 
					{$voter: voter, $candidate: candidate},
					  function(err) 
					  {
						  if(err) print_output(503, err);
					  }
				  );
				});  
				
				//if ok status 201
				print_output(201, "Thank you for voting");
			}
			else
			{
				// status 403 user has voted more than 3 times
				print_output(403, "user has voted more than 3 times");
			}
		}
	}
	);
}





// Configure our HTTP server
var server = http.createServer(function (request, response) {
	resp=response;
  var req = url.parse(request.url, true);
  var action = req.query.action;
  
  // check url request. This page accept values "add" for adding votes and "showpoll" for viewing results. 
  // Example: http://127.0.0.1:8000/?action=add&voter=96&candidate=b
  if (action == "add")
  {  
	addvote(req.query.voter, req.query.candidate);
  }
  else if (action == "showpoll")
  {
	  // print poll result
	  showpoll();
	  //print_output(201, "poll");
  }
  else
  {
	  print_output(504, "missing parameter");
  }
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");