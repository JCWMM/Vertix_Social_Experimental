// WAIT FOR WINDOW TO LOAD:
var socket;
var devTest = true;
var fetchedBoards = ",";
var clnRankLeaderboard = document.getElementById("clnRankLeaderboard");
var clnRankButton = document.getElementById("clnRankButton");
var newClnLeaderboard = document.getElementById("kdrLeaderboard");
var newClnButton = document.getElementById("newClanButton");
var clnKillsLeaderboard = document.getElementById("clnKillsLeaderboard");
var clnKillsButton = document.getElementById("clnKillsButton");
var clnRankLeaderboard = document.getElementById("clnRankLeaderboard");
var clnMemButton = document.getElementById("clnMemButton");
var clnKdrLeaderboard = document.getElementById("clnKdrLeaderboard");
var clnKdrButton = document.getElementById("clnKdrButton");
var clnLinkedBoard = location.hash.replace('#', '');
window.onload = function () {
	$.get("/getIP", function (data) {
	    if (!socket) {
			var tmpIP = devTest ? 'localhost' : data.ip;
			socket = io.connect('http://' + tmpIP + ':' + data.port, {
				reconnection: false,
				forceNew: true,
				query: 'fetchLeaderboards=' + true
			});
			socket.on('getLeaderboards', function (response, lType, worked) {
				if (worked) {
					var tmpHTML = "";
					var leaderList = response;
					if (lType == "rank") {
			        	for (var i = 0; i < leaderList.length; ++i) {
			        		tmpHTML += "<div onclick='showUserStatPage(\"" + leaderList[i].user_name + "\")' class='leaderboardItemWrapper'>" + (i + 1) + ". <span class='clanDisplay'>" + (leaderList[i].user_clan != '' ? ("[" + leaderList[i].user_clan.toUpperCase() + "] ") : "") + "</span><span class='leaderNameDisplay'>" + leaderList[i].user_name + " RNK " + leaderList[i].user_rank + "</span></div>";
			            }
						rankLeaderboard.innerHTML = tmpHTML;	
					} else if (lType.indexOf("cln") >= 0) { 
						for (var i = 0; i < leaderList.length; ++i) {
			        		tmpHTML += "<div class='leaderboardItemWrapper'>" + (i + 1) + ". <span class='clanDisplay'>[" + leaderList[i].clan_name + "] (" + leaderList[i].clan_members  + " members)</span><span class='leaderNameDisplay'> RNK " + leaderList[i].clan_level + " KDR " + leaderList[i].clan_kd + "</span></div>";
			            }
						if (lType == "clnRank") {
							clnRankLeaderboard.innerHTML = tmpHTML;
						} else if (lType == "clnKdr") {
							clnKdrLeaderboard.innerHTML = tmpHTML;
						}
					} else if (lType == "kills") {
			        	for (var i = 0; i < leaderList.length; ++i) {
			        		tmpHTML += "<div onclick='showUserStatPage(\"" + leaderList[i].user_name + "\")' class='leaderboardItemWrapper'>" + (i + 1) + ". <span class='clanDisplay'>" + (leaderList[i].user_clan != '' ? ("[" + leaderList[i].user_clan.toUpperCase() + "] ") : "") + "</span><span class='leaderNameDisplay'>" + leaderList[i].user_name + " " + leaderList[i].user_kills + " KILLS</span></div>";
			            }
			        	killsLeaderboard.innerHTML = tmpHTML;	
					} else {
						var tmpKD = 0;
						for (var i = 0; i < leaderList.length; ++i) {
							tmpKD = (Math.max(1, leaderList[i].user_kills) / Math.max(1, leaderList[i].user_deaths)).toFixed(2);
			        		tmpHTML += "<div onclick='showUserStatPage(\"" + leaderList[i].user_name + "\")' class='leaderboardItemWrapper'>" + (i + 1) + ". <span class='clanDisplay'>" + (leaderList[i].user_clan != '' ? ("[" + leaderList[i].user_clan.toUpperCase() + "] ") : "") + "</span><span class='leaderNameDisplay'>" + leaderList[i].user_name + " KDR " + tmpKD + " (" + leaderList[i].user_kills + "/" + leaderList[i].user_deaths + ")</span></div>";
			            }
						if (lType == "kdr2") {
							newClnLeaderboard.innerHTML = tmpHTML;
						}
					} 					
				} else {
					document.getElementById(lType + "Leaderboard").innerHTML = "<div class='leaderMessage'><b>" + response + "</b></div>";
				}
			});
			socket.on('connect_failed', function () {
				serverMessage.innerHTML = "Connection Failed. Try again later.";
		    });
			toggleLeaderboardDisplay(linkedBoard == "" ? "rank" : linkedBoard);
		}
	});
}

// CHANGE DISPLAY:
function toggleLeaderboardDisplay(board) {
	// HIDE ALL:
	rankLeaderboard.style.display = "none";
	rankButton.className = "changeLeaderbordButton";
	kdrLeaderboard.style.display = "none";
	kdrButton.className = "changeLeaderbordButton";
	newClnLeaderboard.style.display = "none";
	newClnButton2.className = "changeLeaderbordButton";
	killsLeaderboard.style.display = "none";
	killsButton.className = "changeLeaderbordButton";
	clnRankLeaderboard.style.display = "none";
	clnRankButton.className = "changeLeaderbordButton";
	clnKdrLeaderboard.style.display = "none";
	clnKdrButton.className = "changeLeaderbordButton";
	
	// FETCH DATA:
	if (socket && fetchedBoards.indexOf("," + board + ",") < 0) {
		fetchedBoards += board + ",";
		socket.emit('ftchLead', board);
	}
	
	// SHOW BOARD:
	document.getElementById(board + "Leaderboard").style.display = "block";
	document.getElementById(board + "Button").className += " activeButton";
}

// CLICK ON USER:
function showUserStatPage(userName) {
	window.open('/profile.html?' + userName,'_blank');
}
