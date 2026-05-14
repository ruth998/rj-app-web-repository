const titleInput = document.getElementById("title");
const artistInput = document.getElementById("artist");
const genreInput = document.getElementById("genre");
const durationInput = document.getElementById("duration");

const addBtn = document.getElementById("addBtn");

const playlistContainer = document.getElementById("playlist");

const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const filterSelect = document.getElementById("filter");

const totalSongs = document.getElementById("totalSongs");
const totalDuration = document.getElementById("totalDuration");

let playlist = JSON.parse(localStorage.getItem("playlist")) || [];

renderPlaylist();

addBtn.addEventListener("click", addSong);

searchInput.addEventListener("input", renderPlaylist);

sortSelect.addEventListener("change", renderPlaylist);

filterSelect.addEventListener("change", renderPlaylist);

document.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addSong();
  }
});

function addSong() {
  const title = titleInput.value.trim();
  const artist = artistInput.value.trim();
  const genre = genreInput.value.trim();
  const duration = durationInput.value.trim();

  if (!title || !artist || !genre || !duration) {
    alert("Please fill all fields");
    return;
  }

  const duplicate = playlist.find(
    song =>
      song.title.toLowerCase() === title.toLowerCase() &&
      song.artist.toLowerCase() === artist.toLowerCase()
  );

  if (duplicate) {
    alert("Song already exists");
    return;
  }

  const song = {
    id: Date.now(),
    title,
    artist,
    genre,
    duration: Number(duration)
  };

  playlist.push(song);

  savePlaylist();

  clearInputs();

  renderPlaylist();
}

function renderPlaylist() {
  let filteredPlaylist = [...playlist];

  const searchValue = searchInput.value.toLowerCase();

  filteredPlaylist = filteredPlaylist.filter(song =>
    song.title.toLowerCase().includes(searchValue) ||
    song.artist.toLowerCase().includes(searchValue)
  );

  const filterValue = filterSelect.value;

  if (filterValue !== "all") {
    filteredPlaylist = filteredPlaylist.filter(
      song => song.genre === filterValue
    );
  }

  const sortValue = sortSelect.value;

  if (sortValue === "title") {
    filteredPlaylist.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }

  if (sortValue === "artist") {
    filteredPlaylist.sort((a, b) =>
      a.artist.localeCompare(b.artist)
    );
  }

  if (sortValue === "duration") {
    filteredPlaylist.sort((a, b) =>
      a.duration - b.duration
    );
  }

  playlistContainer.innerHTML = "";

  if (filteredPlaylist.length === 0) {
    playlistContainer.innerHTML =
      `<p class="empty">No songs found</p>`;
  }

  filteredPlaylist.forEach(song => {
    const songCard = document.createElement("div");

    songCard.classList.add("song-card");

    songCard.innerHTML = `
      <div class="song-info">
        <h2>${song.title}</h2>
        <p>Artist: ${song.artist}</p>
        <p>Genre: ${song.genre}</p>
        <p>${song.duration} min</p>
      </div>

      <button class="delete-btn" onclick="deleteSong(${song.id})">
        Delete
      </button>
    `;

    playlistContainer.appendChild(songCard);
  });

  updateStats();
}

function deleteSong(id) {
  playlist = playlist.filter(song => song.id !== id);

  savePlaylist();

  renderPlaylist();
}

function updateStats() {
  totalSongs.textContent = playlist.length;

  const duration = playlist.reduce(
    (total, song) => total + song.duration,
    0
  );

  totalDuration.textContent = duration;
}

function clearInputs() {
  titleInput.value = "";
  artistInput.value = "";
  genreInput.value = "";
  durationInput.value = "";
}

function savePlaylist() {
  localStorage.setItem("playlist", JSON.stringify(playlist));
}