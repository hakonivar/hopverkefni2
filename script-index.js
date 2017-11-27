function getVideoLinkByID(data, id) {
  const idString = id.toString();
  return `video.html?id=${idString}`;
}

function getVideoPosterByID(data, id) {
  const { videos } = data;
  for (let i = 0; i < videos.length; i += 1) {
    if (id === videos[i].id) {
      return videos[i].poster;
    }
  }
  return 'No Poster found';
}

function pad(d) {
  if (d < 10) {
    return `0${d.toString()}`;
  }
  return d.toString();
}

function getVideoDurationByID(data, id) {
  const { videos } = data;
  let seconds;
  for (let i = 0; i < videos.length; i += 1) {
    if (id === videos[i].id) {
      seconds = videos[i].duration;
    }
  }

  if (seconds === undefined) {
    return 'duration not found';
  }

  const hours = Math.floor(seconds / 3600);
  const min = Math.floor((seconds - (hours * 3600)) / 60);
  const sec = seconds - (hours * 3600) - (min * 60);

  if (hours > 0) {
    if (hours === 1 && min === 0) {
      return `60:${pad(sec)}`;
    }
    return `${pad(hours)}:${pad(min)}:${pad(sec)}`;
  }
  if (min > 0) {
    return `${pad(min)}:${pad(sec)}`;
  }
  return `00:${pad(sec)}`;
}

function getVideoNameByID(data, id) {
  const { videos } = data;
  for (let i = 0; i < videos.length; i += 1) {
    if (id === videos[i].id) {
      return videos[i].title;
    }
  }
  return 'No Name found';
}

function getVideoCreatedByID(data, id) {
  const { videos } = data;
  let result;
  for (let i = 0; i < videos.length; i += 1) {
    if (id === videos[i].id) {
      result = videos[i].created;
      break;
    }
  }

  const curDate = new Date();
  const curMilSec = curDate.getTime();

  const milSec = curMilSec - result;
  const sec = milSec / 1000;
  let min = sec / 60;
  let klst = min / 60;
  let days = klst / 24;
  let weeks = days / 7;
  let months = weeks / 4;
  let years = months / 24;

  years = Math.floor(years);
  if (years > 0) {
    if (years === 1) {
      return 'Fyrir 1 ári síðan';
    }
    return `Fyrir ${years} árum síðan`;
  }

  if (months >= 2.5) {
    months = Math.floor(months);
    return `Fyrir ${months} mánuðum síðan`;
  }

  weeks = Math.floor(weeks);
  if (weeks > 0) {
    if (weeks === 1) {
      return 'Fyrir 1 viku síðan';
    }
    return `Fyrir ${weeks} vikum síðan`;
  }

  days = Math.floor(days);
  if (days > 0) {
    if (days === 1) {
      return 'Fyrir 1 degi síðan';
    }
    return `Fyrir ${days} dögum síðan`;
  }

  klst = Math.floor(klst);
  if (klst > 0) {
    if (klst === 1) {
      return 'Fyrir 1 klukkustund síðan';
    }
    return `Fyrir ${klst} klukkustundum síðan`;
  }

  min = Math.floor(min);
  if (min === 1) {
    return `Fyrir ${min} mínútu síðan`;
  }
  return `Fyrir ${min} mínútum síðan`;
}

function empty(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function showError(s) {
  const result = document.getElementsByClassName('result')[0];
  empty(result);

  const error = document.createElement('div');
  error.classList.add('fault');
  const h2 = document.createElement('h2');
  h2.classList.add('fault2');

  h2.appendChild(document.createTextNode(s));
  error.appendChild(h2);
  result.appendChild(error);
}

function createIndexSite(data) {
  const result = document.getElementsByClassName('result')[0];
  empty(result);

  for (let i = 0; i < data.categories.length; i += 1) {
    const c = data.categories[i];

    const categorie = document.createElement('div');
    categorie.classList.add('classes');

    const heading = document.createElement('div');
    heading.classList.add('classes__heading');
    const h2 = document.createElement('h2');
    h2.classList.add('classes__heading__text');

    const categorieString = document.createTextNode(c.title);
    h2.appendChild(categorieString);
    heading.appendChild(h2);

    const videos = document.createElement('div');
    videos.classList.add('classes__videos');
    categorie.appendChild(heading);
    categorie.appendChild(videos);

    for (let t = 0; t < c.videos.length; t += 1) {
      const video = document.createElement('div');
      video.classList.add('video');
      videos.appendChild(video);

      const a = document.createElement('a');
      a.classList.add('videoimg');
      a.setAttribute('href', getVideoLinkByID(data, c.videos[t]));
      video.appendChild(a);

      const img = document.createElement('img');
      img.classList.add('videoimg2');
      img.setAttribute('src', getVideoPosterByID(data, c.videos[t]));
      a.appendChild(img);

      const p = document.createElement('p');
      p.classList.add('videoimgtime');
      const pString = document.createTextNode(getVideoDurationByID(data, c.videos[t]));
      p.appendChild(pString);
      a.appendChild(p);

      const videoText = document.createElement('div');
      videoText.classList.add('videoText');
      video.appendChild(videoText);

      const h3 = document.createElement('h3');
      h3.classList.add('videoTexth3');
      const h3String = document.createTextNode(getVideoNameByID(data, c.videos[t]));
      h3.appendChild(h3String);
      videoText.appendChild(h3);

      const h4 = document.createElement('h4');
      h4.classList.add('videoTexth4');
      const h4String = document.createTextNode(getVideoCreatedByID(data, c.videos[t]));
      h4.appendChild(h4String);
      videoText.appendChild(h4);
    }
    result.appendChild(categorie);
    const hr = document.createElement('hr');
    result.appendChild(hr);
  }
}


function startIndex() {
  const url = 'videos.json';
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.onload = () => {
    if (request.status >= 200 && request.status < 400) {
      const data = JSON.parse(request.response);
      createIndexSite(data);
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
  startIndex();
});
