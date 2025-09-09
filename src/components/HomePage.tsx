interface HomePageProps {
  rooms: EscapeRoom[];
  user: any;
  onViewRoom: (room: EscapeRoom) => void;
  onEditRoom: (room: EscapeRoom) => void;
  onDeleteRoom: (roomId: number) => void;
}

export default function HomePage({
  rooms,
  user,
  onViewRoom,
  onEditRoom,
  onDeleteRoom,
}: HomePageProps) {
  return (
    <div>
      {rooms.map((room) => (
        <div key={room.id}>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onViewRoom(room)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center justify-center space-x-1"
            >
              <Eye className="h-3 w-3" />
              <span>View</span>
            </button>
            {user && room.creator_id === user.id && (
              <>
                <button
                  onClick={() => onEditRoom(room)}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center justify-center space-x-1"
                >
                  <Edit className="h-3 w-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => onDeleteRoom(room.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center justify-center space-x-1"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}