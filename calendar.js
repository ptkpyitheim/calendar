/* * * * * * * * * * * * * * * * * * * *\
 *               Module 4              *
 *      Calendar Helper Functions      *
 *                                     *
 *        by Shane Carr '15 (TA)       *
 *  Washington University in St. Louis *
 *    Department of Computer Science   *
 *               CSE 330S              *
 *                                     *
 *      Last Update: October 2017      *
\* * * * * * * * * * * * * * * * * * * */

/*  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function () {
	"use strict";

	/* Date.prototype.deltaDays(n)
	 * 
	 * Returns a Date object n days in the future.
	 */
	Date.prototype.deltaDays = function (n) {
		// relies on the Date object to automatically wrap between months for us
		return new Date(this.getFullYear(), this.getMonth(), this.getDate() + n);
	};

	/* Date.prototype.getSunday()
	 * 
	 * Returns the Sunday nearest in the past to this date (inclusive)
	 */
	Date.prototype.getSunday = function () {
		return this.deltaDays(-1 * this.getDay());
	};
}());

/** Week
 * 
 * Represents a week.
 * 
 * Functions (Methods):
 *	.nextWeek() returns a Week object sequentially in the future
 *	.prevWeek() returns a Week object sequentially in the past
 *	.contains(date) returns true if this week's sunday is the same
 *		as date's sunday; false otherwise
 *	.getDates() returns an Array containing 7 Date objects, each representing
 *		one of the seven days in this month
 */
function Week(initial_d) {
	"use strict";

	this.sunday = initial_d.getSunday();
		
	
	this.nextWeek = function () {
		return new Week(this.sunday.deltaDays(7));
	};
	
	this.prevWeek = function () {
		return new Week(this.sunday.deltaDays(-7));
	};
	
	this.contains = function (d) {
		return (this.sunday.valueOf() === d.getSunday().valueOf());
	};
	
	this.getDates = function () {
		var dates = [];
		for(var i=0; i<7; i++){
			dates.push(this.sunday.deltaDays(i));
		}
		return dates;
	};
}

/** Month
 * 
 * Represents a month.
 * 
 * Properties:
 *	.year == the year associated with the month
 *	.month == the month number (January = 0)
 * 
 * Functions (Methods):
 *	.nextMonth() returns a Month object sequentially in the future
 *	.prevMonth() returns a Month object sequentially in the past
 *	.getDateObject(d) returns a Date object representing the date
 *		d in the month
 *	.getWeeks() returns an Array containing all weeks spanned by the
 *		month; the weeks are represented as Week objects
 */
function Month(year, month) {
	"use strict";
	
	this.year = year;
	this.month = month;
	
	this.nextMonth = function () {
		return new Month( year + Math.floor((month+1)/12), (month+1) % 12);
	};
	
	this.prevMonth = function () {
		return new Month( year + Math.floor((month-1)/12), (month+11) % 12);
	};
	
	this.getDateObject = function(d) {
		return new Date(this.year, this.month, d);
	};
	
	this.getWeeks = function () {
		var firstDay = this.getDateObject(1);
		var lastDay = this.nextMonth().getDateObject(0);
		
		var weeks = [];
		var currweek = new Week(firstDay);
		weeks.push(currweek);
		while(!currweek.contains(lastDay)){
			currweek = currweek.nextWeek();
			weeks.push(currweek);
		}
		
		return weeks;
	};
}



// My code from now and beyond!!!


$('#jump').toggle(); //Hide the jump information. ***Creative Portion****


let month_in_words = [];
month_in_words['12'] = "Dec";
month_in_words['11'] = "Nov";
month_in_words['10'] = "Oct";
month_in_words['09'] = "Sep";
month_in_words['08'] = "Aug";
month_in_words['07'] = "Jul";
month_in_words['06'] = "Jun";
month_in_words['05'] = "May";
month_in_words['04'] = "Apr";
month_in_words['03'] = "Mar";
month_in_words['02'] = "Feb";
month_in_words['01'] = "Jan";


// Keep the current month in a variable in the global scope
var currYear = 2019;
var currMonth = 2; //March

var currentMonth = new Month(currYear, currMonth); // March 2019


function displayHeader() {
	let display = getSpecificDayOfWeek(1,2).toString().split(" ");
	$('#currMonth').text(display[1]);
	$('#currYear').text(display[3]);

	//Using the global variable from login_signup.js
	var user_from_local =localStorage.getItem('theuser');


	//If guest user login, show login button and hide create event section
	if (user_from_local === null){
		console.log("!!!!!! Guest user login...")
		$('#sessions').text("Login"); 
		$("#sessionForm").attr("action", "login.html");

		$("#event").hide();

	}
	//If a user logs in, show logout button and show create create event section.
	else {
		$('#username').text(user_from_local);

		console.log("!!!!! " + user_from_local + "in session");
		$('#sessions').text("Logout");
		$("#sessionForm").attr("action", "logout.php");
		//Create event section to show create event functionality

		$("#event").show();
	}

}

// Get previous month
$("#prev_month_btn").on("click", function(event){
	currentMonth = currentMonth.prevMonth(); 
	updateCalendar(); // Re-render calendar
	fetchEvents();

	console.log("The new month is "+currentMonth.month+" "+currentMonth.year);
});

// Get next month
$("#next_month_btn").on("click", function(event){
	currentMonth = currentMonth.nextMonth(); 
	updateCalendar(); // Re-render calendar
	fetchEvents();

	console.log("The new month is "+currentMonth.month+" "+currentMonth.year);
});


//My helper function
function getSpecificDayOfWeek(weekNum, dayNum) {
	return currentMonth.getWeeks()[weekNum].getDates()[dayNum];
}



//Updating Calendar
function updateCalendar(){

	//Empty current Calendar to render new calendar
	$('#calendar-content').empty();
	$('#username').empty();

	displayHeader(); //For displaying month, year, username, login, logout, "create event" buttons on top of the calendar
	
	var weeks = currentMonth.getWeeks();

	//Display each day for each week.
	for(var w in weeks){
		var newEl = document.createElement("div");
		newEl.setAttribute("class","week");

		var days = weeks[w].getDates();
		// days contains normal JavaScript Date objects.
				
		for(var d in days){

			let arrayOfDays = getSpecificDayOfWeek(w,d).toString().split(" ");

			var newDiv = document.createElement("div");
			newDiv.setAttribute("class", "days");

			newDiv.appendChild(document.createTextNode(arrayOfDays[0] + " " + arrayOfDays[1] + " " + arrayOfDays[2]));

			newEl.appendChild(newDiv);
			
		}

		document.getElementById('calendar-content').append(newEl);
	}


}


function fetchEvents() {

	const currentUser = localStorage.getItem('theuser');

	if(currentUser === null) {
		console.log("You are not logged in. You cannot fetch events");
		return;
	}

    // Make a URL-encoded string for passing POST data:
	const data = { 'username': currentUser };

    events = fetch("fetchEvents.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(
            function name(data) {
                if(data.success === true) {
			   	
					let events = data.events;

					let week = document.getElementsByClassName("week");

					//For each event in the database, check if they match with the dates on calendar
					for(let e = 0; e < events.length; e++) {
						let date_and_time = events[e].datetime.split(" ");
						let time = date_and_time[1];
						let eventcolor = events[e].color;

						let date_fetched = date_and_time[0].split("-");
					
						let currentYear = currentMonth.year.toString();

						//for each week
						for(let w=0; w < week.length; w++) {
							let days = week[w].childNodes;

							//for each day
							for(let d=0; d < days.length; d++) {
								let dateinfo = days[d].childNodes[0].nodeValue.split(" ");


								//if months and day and year matches for that event, render it on the calendar
								if(dateinfo[1] === month_in_words[date_fetched[1]] && dateinfo[2] === date_fetched[2] && currentYear === date_fetched[0]) {

									let event_tag = document.createElement("p");
									event_tag.setAttribute("class", "oneEvent");
									if(eventcolor !== "") {
										event_tag.style.backgroundColor = eventcolor;
									}

					
									event_tag.addEventListener("click",function(event) {
										let toSetId = days[d].childNodes[0].nodeValue.replace(/ /g, "_");

										console.log("Dialog clicked" + "  " + toSetId);

										addDialogFunc(toSetId, events[e].title, time.substr(0,time.length - 3));

										//Source: https://jqueryui.com/dialog/
										let idToPass = '#' + toSetId;
										$(idToPass).dialog();

										$(".edit").one("click", function(event) {
											console.log("Edit button clicked");
											let date_time_to_edit = date_and_time[0] + " " + time;

											let getThisDialog = document.getElementById(toSetId);
											
											//manipulate DOM to allow user edits
											let titleLabel = document.createElement("p");
											titleLabel.innerHTML = "New title: ";

											let newhr = document.createElement("hr");

											let titleInput = document.createElement("input");
											titleInput.setAttribute("id", "new-title-input");
											titleInput.setAttribute("type", "text");
											titleInput.setAttribute("value", events[e].title);

											let dateLabel = document.createElement("p");
											dateLabel.innerHTML = "New date: ";

											let dateInput = document.createElement("input");
											dateInput.setAttribute("id", "new-date-input");
											dateInput.setAttribute("type", "date");
											dateInput.setAttribute("value", date_and_time[0]);

											let timeLabel = document.createElement("p");
											timeLabel.innerHTML = "New time: ";

											let timeInput = document.createElement("input");
											timeInput.setAttribute("id", "new-time-input");
											timeInput.setAttribute("type", "time");
											timeInput.setAttribute("value", time);


											//Setting CSRF tokens
											let token = document.createElement("input");
											token.setAttribute("type", "hidden");
											token.setAttribute("name", "token");
											token.setAttribute("value", "<?php echo $_SESSION['token'];?>");


											let confirmEditBtn = document.createElement("button");
											confirmEditBtn.setAttribute("class", "confirm-edit");
											confirmEditBtn.innerHTML = "Confirm Edit";

											getThisDialog.appendChild(newhr);
											getThisDialog.appendChild(titleLabel);
											getThisDialog.appendChild(titleInput);
											getThisDialog.appendChild(dateLabel);
											getThisDialog.appendChild(dateInput);
											
											getThisDialog.appendChild(timeLabel);
											getThisDialog.appendChild(timeInput);
											getThisDialog.appendChild(token);
						
											getThisDialog.appendChild(confirmEditBtn);

											//get the user values to update the database
											$(".confirm-edit").on("click", function (event) {
												let userinput_title = $("#new-title-input").val();
												let userinput_date = $("#new-date-input").val();
												let userinput_time = $("#new-time-input").val();
												let userinput_datetime = userinput_date + " " + userinput_time;
												
												

												editEvent(events[e].title, date_time_to_edit, userinput_title, userinput_datetime);

												//Remove this dialog that was created.
												$(idToPass).remove();

												fetchEvents(); //Fetch events after adding events
												updateCalendar();

												
											});
											
										});


										$(".delete").one("click", function(event) {
											console.log("Delete button clicked");
											let date_time_to_delete = date_and_time[0] + " " + time;
											
											//Call deleteEvent function to execute AJAX
											deleteEvent(events[e].title, date_time_to_delete);
											//Remove this dialog that was created.
											$(idToPass).remove();

											fetchEvents(); //Fetch events after deleting events
											updateCalendar(); 
										});


									},false);

									event_tag.appendChild(document.createTextNode(time.substr(0,time.length - 3) + " " + events[e].title));

									days[d].appendChild(event_tag);

								}
							}

						}
					}	
                }
                else {
                    alert(data.message);
				}
			}
		)
		.catch(error => console.error('Error:',error));



}


function editEvent (ptitle, pdatetime, pnewtitle, pnewdatetime) {
	const username = localStorage.getItem('theuser');

	if(username === null) {
		alert("You are not logged in. You cannot modify events");
		return;
	}

	const title = ptitle;
	const datetime = pdatetime;
	const new_title = pnewtitle;
	const new_datetime = pnewdatetime;

	console.log("title: " + title + " datetime: " + datetime);

	const data = {'username': username, 'title': title, 'datetime': datetime, 'new_title': new_title, 'new_datetime': new_datetime};

	fetch("edit_event.php", {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {'content-type': 'application/json'}
	})
	.then(response => response.json())
	.then(
		function name(data) {
			if(data.success === true) {						
				alert(data.message);
				console.log(data.message + " " + data.id);
			}
			else {
				alert("Event cannot be edited. " + data.message);
			}
		}

	);

}


function deleteEvent (ptitle, pdatetime) {
	const username = localStorage.getItem('theuser');

	if(username === null) {
		alert("You are not logged in. You cannot delete events");
		return;
	}

	const title = ptitle;
	const datetime = pdatetime;

	const data = {'username': username, 'title': title, 'datetime': datetime};

	fetch("delete_event.php", {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {'content-type': 'application/json'}
	})
	.then(response => response.json())
	.then(
		function name(data) {
			if(data.success === true) {
				alert(data.message);
				console.log(data.message);
			}
			else {
				alert("Event cannot be deleted.");
			}
		}

	);


	
}




//Add an event
$("#addEventBtn").on("click", function(){

	const username = localStorage.getItem('theuser');

	if(username === null) {
		alert("You are not logged in. You cannot add events");
		return;
	}

	const title = $('#title').val();
	const datetime = $('#date').val();
	datetime.replace("T", " ") + ":00"; //replaced to match datetime format in the server

	const color = $('#colortag').val();

	if(title === "" || datetime === "") {
		alert("Please add both a TITLE and a DATE AND TIME");
		return;
	}

	const data = {'username': username, 'title': title, 'datetime': datetime, 'color': color};

	fetch("add_event.php", {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {'content-type': 'application/json'}
	})
	.then(response => response.json())
	.then(
		function name(data) {
			if(data.success === true) {
				alert(data.message);
				console.log(data.message);
				//Empty the fields after adding.
				document.getElementById('title').value = "";
				document.getElementById('date').value = "";
				document.getElementById('colortag').value = "";

				fetchEvents();
				updateCalendar();

			}
			else {
				alert("Event cannot be added.");
			}
		}

	);

	
});





$(document).ready(updateCalendar()); //Render calendar as the page loads
$(document).ready(fetchEvents()); //Fetch Calendar as the page loads


//To be used in fetchEvents() method to add dialog information
function addDialogFunc(pdate, ptitle, ptime) {

	let dialog = document.createElement("div");
	dialog.setAttribute("id", pdate);
	dialog.setAttribute("title", pdate);

	let title_in_dialog = document.createElement("p");
	title_in_dialog.setAttribute("id", "title_in_dialog");
	title_in_dialog.innerHTML = "Title: " + ptitle;

	let time_in_dialog = document.createElement("p");
	time_in_dialog.setAttribute("id", "time_in_dialog");
	time_in_dialog.innerHTML = "Time: " + ptime;

	let hr = document.createElement("hr");

	let editBtn = document.createElement("button");
	editBtn.setAttribute("class", "edit");
	editBtn.innerHTML = "Edit";

	let deleteBtn = document.createElement("button");
	deleteBtn.setAttribute("class", "delete");
	deleteBtn.innerHTML = "Delete";

	dialog.appendChild(title_in_dialog);
	dialog.appendChild(time_in_dialog);
	dialog.appendChild(hr);
	dialog.appendChild(editBtn);
	dialog.appendChild(deleteBtn);

	document.getElementById("calendar-content").appendChild(dialog);

	document.getElementById(pdate).style.display = "none";

}

//****Creative portion ***** Jump to a month
$('#jumpBtn').on("click", function(event) {
	$('#jump').toggle();
	$('#go').on("click", function(event) {
		console.log("Go! button clicked");
		let jumpdate = $("#jump_date").val();

		if(jumpdate === "") {
			alert("You need to choose a date!");
			return;
		}

		let jumpdatesplit = jumpdate.split("-");
		currYear = parseInt(jumpdatesplit[0]);
		currMonth = parseInt(jumpdatesplit[1]) - 1;

		currentMonth = new Month(currYear, currMonth);

		fetchEvents();
		updateCalendar();
		
	});
});


//****CREATIVE PORTION SEARCH EVENTS *****
$('.findEventBtn').on("click", function(event) {

	const username = localStorage.getItem('theuser');

	if(username === null) {
		alert("You are not logged in. You cannot add events");
		return;
	}

	const eventName = $('#event_search_name').val();

	if(eventName === "") {
		alert("Please add an event name to search.");
		return;
	}

	const data = {'username': username, 'eventName': eventName};

	fetch("find_event.php", {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {'content-type': 'application/json'}
	})
	.then(response => response.json())
	.then(
		function name(data) {
			if(data.success === true) {
			
				console.log(data.matchedEvents);

				if(data.matchedEvents.length === 0) {
					alert("No matched events found!");
					$('#event_search_name').val('');
					return;
				}
				
				$('#find_results').remove();

				let list = document.createElement('div');
				list.setAttribute("id", "find_results");
				for (let i=0; i < data.matchedEvents.length; i++) {
					let tag = document.createElement("p");
					tag.innerHTML = data.matchedEvents[i].title + " " + data.matchedEvents[i].datetime; 
					list.appendChild(tag);
				}				
				document.getElementById('event').appendChild(list);

				let closeBtn = document.createElement("button");
				closeBtn.setAttribute("id", "closeBtn");
				closeBtn.innerHTML = "Close";

				document.getElementById('event').appendChild(closeBtn);

				$('#closeBtn').on("click", function(event) {
					$('#find_results').remove();
					$(this).remove();
					$('#event_search_name').val("");
				});

			}
			else {
				alert("Event cannot be added.");
			}
		}

	);


});

