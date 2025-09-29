const songs = [
  { title: "Song 1", artist: "Artist 1", src: "song1.mp3", cover: "cover1.jpg" },
  { title: "Song 2", artist: "Artist 2", src: "song2.mp3", cover: "cover2.jpg" },
  { title: "Song 3", artist: "Artist 3", src: "song3.mp3", cover: "cover3.jpg" }
];

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volume");
const volumeIcon = document.getElementById("volume-icon");
const playlist = document.getElementById("playlist");
const coverContainer = document.querySelector(".cover-container");
const themeToggle = document.getElementById("theme-toggle");
const fileUpload = document.getElementById("file-upload");

let songIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

function loadSong(song) {
  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.src = song.cover;
  audio.src = song.src;
}
loadSong(songs[songIndex]);

function playSong() {
  audio.play();
  isPlaying = true;
  playBtn.textContent = "⏸";
  coverContainer.classList.add("playing");
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = "▶";
  coverContainer.classList.remove("playing");
}

playBtn.addEventListener("click", () => isPlaying ? pauseSong() : playSong());
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

function nextSong() {
  if (isShuffle) {
    songIndex = Math.floor(Math.random() * songs.length);
  } else {
    songIndex = (songIndex + 1) % songs.length;
  }
  loadSong(songs[songIndex]);
  playSong();
  highlightPlaylist();
}

function prevSong() {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
  highlightPlaylist();
}

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.style.background = isShuffle ? "orange" : "";
});

repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.style.background = isRepeat ? "orange" : "";
});

audio.addEventListener("ended", () => {
  if (isRepeat) playSong();
  else nextSong();
});

audio.addEventListener("timeupdate", updateProgress);
function updateProgress(e) {
  if (audio.duration) {
    const { duration, currentTime } = e.srcElement;
    const percent = (currentTime / duration) * 100;
    progress.style.width = percent + "%";
    currentTimeEl.textContent = formatTime(currentTime);
    durationEl.textContent = formatTime(duration);
  }
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
});

volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
  if (audio.volume == 0) volumeIcon.textContent = "🔇";
  else if (audio.volume < 0.5) volumeIcon.textContent = "🔉";
  else volumeIcon.textContent = "🔊";
});

songs.forEach((song, index) => {
  const li = document.createElement("li");
  li.textContent = `${song.title} - ${song.artist}`;
  li.addEventListener("click", () => {
    songIndex = index;
    loadSong(songs[songIndex]);
    playSong();
    highlightPlaylist();
  });
  playlist.appendChild(li);
});

function highlightPlaylist() {
  const items = playlist.querySelectorAll("li");
  items.forEach((li, i) => li.classList.toggle("active", i === songIndex));
}
highlightPlaylist();

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeToggle.textContent = document.body.classList.contains("light") ? "☀" : "🌙";
});

fileUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    const newSong = { title: file.name, artist: "User Upload", src: url, cover: "cover1.jpg" };
    songs.push(newSong);
    const li = document.createElement("li");
    li.textContent = newSong.title;
    li.addEventListener("click", () => {
      songIndex = songs.length - 1;
      loadSong(newSong);
      playSong();
      highlightPlaylist();
    });
    playlist.appendChild(li);
  }
});
