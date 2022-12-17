// xhr connection
const xhr=new XMLHttpRequest();
// set username
document.querySelector('#username').innerHTML="Hello, "+ localStorage.getItem('username') + "!";
document.querySelector('#dashBoardUsername').innerHTML = localStorage.getItem('username')



/*
    memu control
*/

//change page content and control
const memu_dashboard=document.querySelector('#memu-dashboard');
const memu_createVote=document.querySelector('#memu-createVote');
const memu_viewVote=document.querySelector('#memu-viewVote');
const dashboardBlock=document.querySelector('#dashboard');
const createVoteBlock=document.querySelector('#createVote');
const viewVotesBlock = document.querySelector('#viewVotes');
const  openVoteBlock= document.querySelector('#openVote');

// dashboard
memu_dashboard.addEventListener('click',function(e) {
    dashboardBlock.style.display="block";
    document.querySelector('#dashBoardViewVotes').style.display = 'none';
    openVoteBlock.style.display = 'none';
    createVoteBlock.style.display = "none";
    viewVotesBlock.style.display = "none";
})

// memu-votes
const votesDown=document.querySelector('#memu-downControl');
votesDown.addEventListener('click',function(e) {
    const memuDownList=document.querySelector('#memu-downList');
    if (memuDownList.style.display==='block'){
        memuDownList.style.display="none";
    } else{
        memuDownList.style.display="block";
    }
})

//create
memu_createVote.addEventListener('click',function(e) {
    dashboardBlock.style.display="none";
    openVoteBlock.style.display = 'none';
    createVoteBlock.style.display = "block";
    viewVotesBlock.style.display = "none";

    // set everything default
    document.querySelector('#createVote_defaultImage').style.backgroundImage = "url('../images/bg1.jpg')";
    let createVote_optionLines = document.querySelector('#createVote_optionLines');
    while(createVote_optionLines.children.length>2){
        createVote_optionLines.removeChild(createVote_optionLines.lastChild);
    }
    let createvote=document.querySelector('#createVoteContent').getElementsByTagName('input');
    for(let i = 0; i<createvote.length; i++){
        createvote[i].value = '';
    }
})

var buildVoteCard = function(votecards){
    var votesBox = document.querySelector("#votesCardBox");
    while (votesBox.children.length>1){
        votesBox.removeChild(votesBox.lastChild);
    }
    for(let i = 0; i < votecards.length; i++){
        if (votecards[i]["title"] === "Welcome to vote!"){continue}
        const node = votesBox.children[0].cloneNode(true);
        node.getElementsByTagName("h3")[0].innerHTML = votecards[i]["title"];
        node.getElementsByClassName("vote-participants")[0].innerHTML = votecards[i]["voters"];
        node.getElementsByClassName("voteCardDate")[0].children[0].innerHTML = votecards[i]["date"];
        votesBox.appendChild(node);
    }
    dashboardBlock.style.display="none";
    openVoteBlock.style.display = 'none';
    createVoteBlock.style.display="none";
    viewVotesBlock.style.display = "block";
}

//view
memu_viewVote.addEventListener('click',function(e) {
    let request = {"sponsor":"all"};

    // send request
    xhr.open("POST","https://1yxu04j3pf.execute-api.us-west-2.amazonaws.com/dev/home/view_votes");
    xhr.send(JSON.stringify(request));

    xhr.onerror=function(){
        alert("Send request failed!");
        return;
    }

    // response
    xhr.onreadystatechange=function(){
        if(xhr.readyState === 4){
            if(xhr.status >= 200 && xhr.status < 300){
                var response = JSON.parse(xhr.response);
                if (response.statusCode === 200){
                    buildVoteCard(response.body);
                }else{
                    alert("View votes failed!");
                }
            }else{
                alert("Network Error!");
            }
        }
    }
})

//sign out
const signout=document.querySelector('#signout');
signout.addEventListener('click',function(e) {
    localStorage.clear();
    sessionStorage.clear();
    // history.pushState(null, null, document.URL);
    // window.addEventListener("popstate",function(e) {  
    //     history.pushState(null, null, document.URL);
    // }, false);
    location.replace('../index.html');
})




/*
    create vote page
*/

// set default pic
var imageOptions=document.getElementsByClassName('imageOption');
for(let i=0; i<4;i++){
    imageOptions[i].onclick=function(){
        document.querySelector('#createVote_defaultImage').style.backgroundImage = imageOptions[i].style.backgroundImage;
    }
}

//add vote Options
document.querySelector('#createVote_addOption').addEventListener('click', function(e){
    var optionLines = document.querySelector('#createVote_optionLines');
    if (optionLines.children.length<5){
        var newOption = document.createElement('input');
        newOption.placeholder = 'Please enter an option';
        optionLines.appendChild(newOption);
    }else{
        alert('The number of options must be smaller than 6');
    }
})

//delete vote option
document.querySelector('#createVote_deleteOption').addEventListener('click',function(e){
    var optionLines = document.querySelector('#createVote_optionLines');
    if (optionLines.children.length > 2){
        optionLines.removeChild(optionLines.lastChild);
    }else{
        alert('The number of options, at least 2');
    }
})


var openViewPage = function(msg){
    dashboardBlock.style.display="none";
    openVoteBlock.style.display = 'block';
    createVoteBlock.style.display="none";
    viewVotesBlock.style.display = "none";

    if (msg["pic"] === ''){
        document.querySelector('#voteImage').style.backgroundImage = "url('../images/bg1.jpg')";
    }else{
        document.querySelector('#voteImage').style.backgroundImage = "url('../images/bg"+msg["pic"] +".jpg')";
    }

    var voteDetailLines = document.getElementsByClassName("voteDetailLine");
    voteDetailLines[0].children[1].innerHTML = msg["vote_title"];
    voteDetailLines[1].children[1].innerHTML = msg["sponsor"];
    voteDetailLines[2].children[1].innerHTML = msg["date"];
    voteDetailLines[3].children[1].innerHTML = msg["voters"];

    document.querySelector('#voteResults').style.display = 'none';
    document.querySelector('#attendVote').style.display = 'block';

    // options
    let attendVoteOptions = document.querySelector('#attendVote').children[0];
    while(attendVoteOptions.children.length>2){
        attendVoteOptions.removeChild(attendVoteOptions.lastChild);
    }
    var voteOptions = document.getElementsByClassName("attendVoteOption");
    for (let i=0; i<msg["options"].length; i++){
        if (i<2){
            voteOptions[i].children[1].innerHTML = msg["options"][i];
        } else{
            const newOptionNode = voteOptions[0].cloneNode(true);
            newOptionNode.children[1].innerHTML = msg["options"][i];
            voteOptions[0].parentNode.appendChild(newOptionNode);
        }
    }

    // delete button
    if (localStorage.getItem('username') === msg["sponsor"]){
        document.querySelector('#deleteVote').style.display = 'block';
    }else{
        document.querySelector('#deleteVote').style.display = 'none';
    }
}

//submit to create a new vote
document.querySelector('#createVoteContent').children[2].addEventListener('click',function(e){
    // build request
    const request={"type":"createVote"}
    request["pic"] = document.querySelector('#createVote_defaultImage').style.backgroundImage.charAt(17);
    var date= new Date();
    request["date"] = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
    request["sponsor"] = localStorage.getItem('username');
    var vote_title = document.querySelector('#createVote_title').getElementsByTagName('input')[0].value;
    if (vote_title === ''){
        alert("Title can not be empty!");
        return;
    } else{
        request["vote_title"] = vote_title;
    }
    request["options"] = new Array();

    voteContent = document.querySelector('#createVote_optionLines').getElementsByTagName('input');
    for (var i=0; i<voteContent.length; i++){
        if (voteContent[i].value === ''){
            alert("Options can not be empty!");
            return;
        } else{
            request["options"][i] = voteContent[i].value;
        }
    }

    // send request
    xhr.open('POST', "https://1yxu04j3pf.execute-api.us-west-2.amazonaws.com/dev/home/create_vote");
    xhr.send(JSON.stringify(request));

    xhr.onerror=function(){
        alert("Send request failed!");
        return;
    }

    // receive response
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4){
            if(xhr.status >= 200 && xhr.status < 300){
                if (JSON.parse(xhr.response).body){
                    request["voters"] = 0;
                    openViewPage(request);
                }else{
                    console.log(JSON.parse(xhr.response));
                    alert("Vote name is already in use!");
                }
            } else{
                alert("Network Error!")
            }
        }
    }
})

// delete a vote
document.querySelector("#deleteVote").addEventListener("click",function(){
    let button = document.querySelector("#deleteVote").children[0];
    if (button.innerHTML === 'Delete'){
        // first time
        button.innerHTML = "Delete?";
        button.style.color = 'red';
    }else{
        // second time
        request = {"vote_title": document.querySelector("#voteDetails").children[0].children[1].innerHTML};
        request["date"] = document.querySelector("#voteDetails").children[2].children[1].innerHTML;
        request["optionNum"] = document.getElementsByClassName("voteResultLine").length;

        // send request
        xhr.open('POST', "https://1yxu04j3pf.execute-api.us-west-2.amazonaws.com/dev/home/delete_vote");
        xhr.send(JSON.stringify(request));

        xhr.onerror=function(){
            alert("Send request failed!");
            return;
        }

        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4){
                if(xhr.status >= 200 && xhr.status < 300){
                    let response = JSON.parse(xhr.response);
                    if (response.statusCode === "200"){
                        openVoteBlock.style.display = "none";
                    }else{
                        alert("Delete Vote Failed!");
                    }
                }else{
                    alert("Network Error!");
                }
            }
        }
        button.innerHTML = "Delete";
        button.style.color = "white";
    }
})


/* 
    attend a  vote
*/

var viewVoteResults = function(option_results,type){
    // change the voters, if attendVote
    var vote_voters = document.querySelector('#voteDetails').children[3].children[1];
    if (type){
        const old_voters = Number(vote_voters.innerHTML);
        vote_voters.innerHTML = old_voters+1;
    }

    // show results
    document.querySelector('#attendVote').style.display = 'none';
    document.querySelector('#voteResults').style.display = 'block';

    var results = document.querySelector('#voteResults');
    while(results.children.length>2){
        results.removeChild(results.lastChild);
    }
    var attendVoteOption = document.getElementsByClassName('attendVoteOption')
    for (var i=0; i<option_results.length; i++){
        let node;
        if (i<2){
            node = results.children[i];
        }else{
            node = results.children[0].cloneNode(true);
        }
        // set option name
        node.children[0].innerHTML = attendVoteOption[i].children[1].innerHTML;
        // calculate option %
        let num = 0;
        if (Number(vote_voters.innerHTML) > 0){
            num = (option_results[i]/Number(vote_voters.innerHTML)*100).toFixed(2)+"%";
        }
        // give the result to the node
        node.children[1].children[0].style.width = num;
        node.children[1].children[1].innerHTML = num;
        if(i>1){
            results.appendChild(node);
        }
    }
}

// submit your option
document.querySelector('#attendVote').children[1].children[0].addEventListener('click',function(e){
    // submit your answer, and wait server rep
    var vote_details = document.querySelector('#voteDetails');
    var request = {"vote_title":vote_details.children[0].children[1].innerHTML}
    request["date"] = vote_details.children[2].children[1].innerHTML

    var radio_name = document.getElementsByName("vote");
    for(var i = 0; i<radio_name.length; i++){
        if(radio_name[i].checked){
            request["option"] = "option"+(i+1).toString();
            request["optionNum"] = radio_name.length;
        }
    }

    // send request
    xhr.open("POST","https://1yxu04j3pf.execute-api.us-west-2.amazonaws.com/dev/home/join_vote");
    xhr.send(JSON.stringify(request));

    xhr.onerror=function(){
        alert("Send request failed!");
        return;
    }

    // response
    xhr.onreadystatechange=function(){
        if(xhr.readyState === 4){
            if(xhr.status >= 200 && xhr.status < 300){
                var response = JSON.parse(xhr.response);
                if (response.statusCode === 200){
                    viewVoteResults(response.body,true);
                }else if (response.statusCode === 400){
                    alert("Update failed!");
                }
            }else{
                alert("Network Error!");
            }
        }
    }
})


// view result without submitting
document.querySelector('#attendVote').children[1].children[1].addEventListener('click',function(e){
    var vote_details = document.querySelector('#voteDetails');
    var request = {"vote_title":vote_details.children[0].children[1].innerHTML};

    // send request
    xhr.open("POST","https://1yxu04j3pf.execute-api.us-west-2.amazonaws.com/dev/home/view_voteresults");
    xhr.send(JSON.stringify(request));

    xhr.onerror=function(){
        alert("Send request failed!");
        return;
    }

    // response
    xhr.onreadystatechange=function(){
        if(xhr.readyState === 4){
            if(xhr.status >= 200 && xhr.status < 300){
                var response = JSON.parse(xhr.response);
                if (response.statusCode === 200){
                    viewVoteResults(response.body,false);
                }else{
                    alert("View results failed!");
                }
            }else{
                alert("Network Error!");
            }
        }
    }
})



/*
 view signal vote
*/
document.querySelector('#votesCardBox').addEventListener('click', function(){
    var voteCardsList = document.getElementsByClassName('voteCard');
    for(let i = 0; i < voteCardsList.length; i++){
        voteCardsList[i].onclick = function(){
            let request = {"vote_title": voteCardsList[i].getElementsByTagName("h3")[0].innerHTML};
            // send request
            xhr.open("POST","https://1yxu04j3pf.execute-api.us-west-2.amazonaws.com/dev/home/votecard");
            xhr.send(JSON.stringify(request));

            xhr.onerror=function(){
                alert("Send request failed!");
                return;
            }

            // response
            xhr.onreadystatechange=function(){
                if(xhr.readyState === 4){
                    if(xhr.status >= 200 && xhr.status < 300){
                        var response = JSON.parse(xhr.response);
                        if (response.statusCode === 200){
                            openViewPage(response.body);
                        }else{
                            alert("Open voteCard failed!");
                        }
                    }else{
                        alert("Network Error!");
                    }
                }
            }
        }
    }
})


/* 
    dashboard control
*/

// view button to see all the votes that user created
var buildVoteTable = function(votecard){
    document.querySelector('#dashBoardViewVotes').style.display = 'block';
    let dashboardViewTable = document.querySelector('#dashBoardViewTable').children[0];

    // set default first
    while(dashboardViewTable.children.length>2){
        dashboardViewTable.removeChild(dashboardViewTable.lastChild);
    }
    
    // add newline
    for(let i=0;i<votecard.length;i++){
        if (votecard[i]["title"] === "Welcome to vote!"){continue;}
        let newline = dashboardViewTable.children[1].cloneNode(true);
        newline.children[0].innerHTML = votecard[i]["title"];
        newline.children[1].innerHTML = votecard[i]["date"];
        newline.children[2].innerHTML = votecard[i]["voters"];
        dashboardViewTable.appendChild(newline);
    }
}

document.querySelector('#dashBoardButton').addEventListener('click',function(e){
    // apply user msg
    let request = {"sponsor":localStorage.getItem('username')};

    // send request
    xhr.open("POST","https://1yxu04j3pf.execute-api.us-west-2.amazonaws.com/dev/home/view_votes");
    xhr.send(JSON.stringify(request));

    xhr.onerror=function(){
        alert("Send request failed!");
        return;
    }

    // response
    xhr.onreadystatechange=function(){
        if(xhr.readyState === 4){
            if(xhr.status >= 200 && xhr.status < 300){
                var response = JSON.parse(xhr.response);
                if (response.statusCode === 200){
                    buildVoteTable(response.body);
                }else{
                    alert("View votes failed!");
                }
            }else{
                alert("Network Error!");
            }
        }
    }
})

// open a vote to see the details  
document.getElementById("dashBoardViewTable").addEventListener("click",function(){
    let dashBoardSelect = document.getElementsByClassName('dashBoardViewSelected')
    for (let i = 0; i < dashBoardSelect.length; i++){
        dashBoardSelect[i].onclick = function(){
            let request = {"vote_title": dashBoardSelect[i].children[0].innerHTML};
            // send request
            xhr.open("POST","https://1yxu04j3pf.execute-api.us-west-2.amazonaws.com/dev/home/votecard");
            xhr.send(JSON.stringify(request));
    
            xhr.onerror=function(){
                alert("Send request failed!");
                return;
            }
    
            // response
            xhr.onreadystatechange=function(){
                if(xhr.readyState === 4){                    
                    if(xhr.status >= 200 && xhr.status < 300){
                        var response = JSON.parse(xhr.response);
                        if (response.statusCode === 200){
                            openViewPage(response.body);
                        }else{
                            alert("Open voteCard failed!");
                        }
                    }else{
                        alert("Network Error!");
                    }
                }
            }
        }
    }

})
