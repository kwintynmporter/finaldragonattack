$('img').click(function(){
    video = '<iframe src="'+ $(this).attr('data-video') +'"></iframe>';
    $(this).replaceWith(video);
}); 
var id ; 
function allowDrop(ev) 
{
    ev.preventDefault(); 
}
function dragstart(ev) 
{
    id=ev.targert.id; 
}

function drop(ev)
{
    ev.targer.append(document.getElementById(id));
}

var youtubeURLArray = [];
var linkArray = [];
var nameOfSong = 0;
var currentContactIndex = 0; 
var myArray = []; 

function initApplication() {
    console.log('Mustang v3 Lite - Starting!'); 
    document.getElementById("nameID").value = "";   
}
function initVidRequest() {
    console.log("initVidRequest()");
    loadInFull();
}

function viewCurrentContact() {
    currentContact = linkArray[currentContactIndex];
    console.log(currentContact);
    document.getElementById("nameID").value = currentContact.preferredName;   
    document.getElementById("statusID").innerHTML = "Viewing contact " + (currentContactIndex+1) + " of " + linkArray.length;
}
function previous() {
    if (currentContactIndex > -2) {
        currentContactIndex--;
    }
    currentContact = linkArray[currentContactIndex];
    viewCurrentContact();
}

function next() {
    if (currentContactIndex < (linkArray.length-1)) {
        currentContactIndex++;
    }
    currentContact = linkArray[currentContactIndex];
    viewCurrentContact();
}

function loadInFull() {
    var indexRequest = new XMLHttpRequest();
    indexRequest.open('GET', 'https://yt-linkage.azurewebsites.net/youtube-index.json');
    indexRequest.onload = function() {
        console.log("Index JSON:" + indexRequest.responseText);
        document.getElementById("indexID").innerHTML = indexRequest.responseText;
        contactIndex = JSON.parse(indexRequest.responseText);
        for (i=0; i<contactIndex.length; i++) {
            youtubeURLArray.push(contactIndex[i].youtubeURL );
        }
        console.log("youtubeURLArray: " + JSON.stringify(youtubeURLArray));
        getVideos();
    }
    indexRequest.send();
}

function getVideos() {
    linkArray.length = 0;
    nameOfSong = 0;

    if (youtubeURLArray.length > nameOfSong) {
        loadNextSong(youtubeURLArray[nameOfSong]);
    }
}

function loadNextSong(URL) {
    console.log("URL: " + URL);
    contactRequest = new XMLHttpRequest();
    contactRequest.open('GET', URL);
    contactRequest.onload = function() {
        var contact = JSON.parse(contactRequest.responseText);
        linkArray.push(contact);

        document.getElementById("linksID").innerHTML = JSON.stringify(linkArray);
        document.getElementById("statusID").innerHTML = "Loading " + contact.songName;

        nameOfSong++;
        if (youtubeURLArray.length > nameOfSong) {
            loadNextSong(youtubeURLArray[nameOfSong]);
        }
        else {
            document.getElementById("statusID").innerHTML = "Contacts Loaded (" + youtubeURLArray.length + ")";
            viewCurrentContact()
        }
    }
    contactRequest.send();
}

