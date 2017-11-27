
let videoPlayButton;
let controlBackButton;
let controlPlayButton;
let controlPauseButton;
let controlMuteButton;
let controlUnMuteButton;
let controlFullscreenButton;
let controlNextButton;

let video;


function hide(button) {
  button.classList.remove('buttonVideo');
  button.classList.add('buttonvideo__hidden');
}

function show(button) {
  button.classList.remove('buttonVideo__hidden');
  button.classList.add('buttonVideo');
}

function showVideoPlayButton() {
  videoPlayButton.classList.remove('buttonVideoPlay__hidden');
  videoPlayButton.classList.add('buttonVideoPlay');
}

function hideVideoPlayButton() {
  videoPlayButton.classList.remove('buttonVideoPlay');
  videoPlayButton.classList.add('buttonVideoPlay__hidden');
}

function playVideo() {
  video.play();
  video.style.filter = 'brightness(1)';
  hideVideoPlayButton();
  hide(controlPlayButton);
  show(controlPauseButton);
}

function pauseVideo() {
  video.pause();
  video.style.filter = 'brightness(0.7)';
  hide(controlPauseButton);
  show(controlPlayButton);
  showVideoPlayButton();
}

function muteVideo() {
  video.muted = true;
  hide(controlMuteButton);
  show(controlUnMuteButton);
}

function unmuteVideo() {
  video.muted = false;
  hide(controlUnMuteButton);
  show(controlMuteButton);
}

function nextVideo() {
  if (!video.paused) {
    video.currentTime += 3;
  }
}

function backVideo() {
  if (!video.paused) {
    if (video.currentTime > 3) {
      video.currentTime -= 3;
    } else {
      video.currentTime = 0;
    }
  }
}

function fullScreenVideo() {
  video.webkitRequestFullscreen();
}

function endedVideo() {
  hide(controlPauseButton);
  show(controlPlayButton);
  showVideoPlayButton();
}

function getIdFromQueryString(string) {
  const idString = string.substring(4);
  const idNum = parseInt(idString, 10);
  return idNum;
}

function getObjectFromId(data, id) {
  for (let i = 0; i < data.videos.length; i += 1) {
    if (id === data.videos[i].id) {
      return data.videos[i];
    }
  }
  return undefined;
}

function empty(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function showError(s) {
  const player = document.getElementsByClassName('player')[0];
  empty(player);

  const error = document.createElement('div');
  error.classList.add('fault');
  const h2 = document.createElement('h2');
  h2.classList.add('fault2');

  h2.appendChild(document.createTextNode(s));
  error.appendChild(h2);
  player.appendChild(error);
}

function createPlayerSite(data, id) {
  const player = document.getElementsByClassName('player')[0];
  const obj = getObjectFromId(data, id);
  empty(player);

  if (obj !== undefined) { 
    const playerHeading = document.createElement('div');
    playerHeading.classList.add('player__heading');
    player.appendChild(playerHeading);


    const h2 = document.createElement('h2');
    h2.classList.add('player__heading__text');
    h2.appendChild(document.createTextNode(obj.title));
    playerHeading.appendChild(h2);

    const playerVideo = document.createElement('div');
    playerVideo.classList.add('player__video');
    player.appendChild(playerVideo);

    // global video
    video = document.createElement('video');
    video.classList.add('myVideo');
    video.setAttribute('src', obj.video);
    video.setAttribute('poster', obj.poster);
    video.addEventListener('ended', endedVideo);
    playerVideo.appendChild(video);

    videoPlayButton = document.createElement('img');
    videoPlayButton.setAttribute('src', 'img/play.svg');
    showVideoPlayButton();
    videoPlayButton.addEventListener('click', playVideo);
    playerVideo.appendChild(videoPlayButton);

    const playerButtons = document.createElement('div');
    playerButtons.classList.add('player__buttons');
    player.appendChild(playerButtons);

    controlBackButton = document.createElement('img');
    controlBackButton.setAttribute('src', 'img/back.svg');
    show(controlBackButton);
    controlBackButton.addEventListener('click', backVideo);
    playerButtons.appendChild(controlBackButton);

    controlPlayButton = document.createElement('img');
    controlPlayButton.setAttribute('src', 'img/play.svg');
    show(controlPlayButton);
    controlPlayButton.addEventListener('click', playVideo);
    playerButtons.appendChild(controlPlayButton);

    controlPauseButton = document.createElement('img');
    controlPauseButton.setAttribute('src', 'img/pause.svg');
    hide(controlPauseButton);
    controlPauseButton.addEventListener('click', pauseVideo);
    playerButtons.appendChild(controlPauseButton);

    controlMuteButton = document.createElement('img');
    controlMuteButton.setAttribute('src', 'img/unmute.svg');
    show(controlMuteButton);
    controlMuteButton.addEventListener('click', muteVideo);
    playerButtons.appendChild(controlMuteButton);

    controlUnMuteButton = document.createElement('img');
    controlUnMuteButton.setAttribute('src', 'img/mute.svg');
    hide(controlUnMuteButton);
    controlUnMuteButton.addEventListener('click', unmuteVideo);
    playerButtons.appendChild(controlUnMuteButton);

    controlFullscreenButton = document.createElement('img');
    controlFullscreenButton.setAttribute('src', 'img/fullscreen.svg');
    show(controlFullscreenButton);
    controlFullscreenButton.addEventListener('click', fullScreenVideo);
    playerButtons.appendChild(controlFullscreenButton);

    controlNextButton = document.createElement('img');
    controlNextButton.setAttribute('src', 'img/next.svg');
    show(controlNextButton);
    controlNextButton.addEventListener('click', nextVideo);
    playerButtons.appendChild(controlNextButton);
  } else {
    showError('Videó er ekki til');
  }
}

function startPlayer(id) {
  const url = 'videos.json';
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.onload = () => {
    if (request.status >= 200 && request.status < 400) {
      const data = JSON.parse(request.response);
      createPlayerSite(data, id);
    } else {
      showError('Villa');
    }
  };

  request.onerror = () => {
    showError('Villa');
  };

  request.send();
}

document.addEventListener('DOMContentLoaded', () => {
  const id = getIdFromQueryString(window.location.search);
  startPlayer(id);
});
