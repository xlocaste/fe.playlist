import Song from "./Song";

const Playlist = () => {
  const songs = [
    { id: 1, title: "Song One", artist: "Artist One", duration: "3:45" },
    { id: 2, title: "Song Two", artist: "Artist Two", duration: "4:20" },
    { id: 3, title: "Song Three", artist: "Artist Three", duration: "5:10" },
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      {songs.map((song) => (
        <Song key={song.id} song={song} />
      ))}
    </div>
  );
};

export default Playlist;
