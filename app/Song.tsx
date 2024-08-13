interface SongProps {
    song: {
      id: number;
      title: string;
      artist: string;
      duration: string;
    };
  }
  
  const Song = ({ song }: SongProps) => {
    return (
      <div className="flex justify-between items-center p-2 border-b border-gray-700">
        <div>
          <h2 className="text-lg font-semibold">{song.title}</h2>
          <p className="text-sm text-gray-400">{song.artist}</p>
        </div>
        <div className="text-sm text-gray-400">{song.duration}</div>
    </div>
    );
  };
  
  export default Song;
  