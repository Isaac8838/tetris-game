import { useState } from "react";
import { useSelector } from "react-redux";

const CreateRoom = ({ sendMessage }) => {
    const [room_name, setRoom_name] = useState("");
    const [error, setError] = useState("");
    const { username } = useSelector((state) => state.user);

    const handleCreateRoom = () => {
        if (room_name === "") setError("Room name cannot be empty");
        else {
            sendMessage(
                JSON.stringify({
                    player: username,
                    room_name: room_name,
                }),
            );
        }
    };

    return (
        <div className="relative h-96">
            <div className="absolute left-1/2 top-1/2 flex w-96 -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl border-8 border-custom-blue_border bg-custom-blue_border p-2 shadow-lg">
                <h3 className="mb-4 text-center text-2xl text-white">
                    Input Room Name
                </h3>
                <div className="mb-3">
                    <div className="rounded-2xl shadow-md">
                        <input
                            type="text"
                            className="w-full rounded-xl bg-custom-blue_bg px-4 py-2 text-lg text-white"
                            placeholder="Click Input Room Name..."
                            value={room_name}
                            onChange={(e) => setRoom_name(e.target.value)}
                        />
                    </div>
                    {error && (
                        <p className="flex justify-end text-lg text-red-500 drop-shadow-[0px_0px_1px_rgba(0,0,0,1)]">
                            {error}
                        </p>
                    )}
                </div>
                <div className="flex justify-end gap-4">
                    <button className="inline rounded-xl bg-red-700 px-4 py-1 text-white hover:shadow-lg">
                        Back
                    </button>
                    <button
                        className="inline rounded-xl bg-green-500 px-4 py-1 text-white hover:shadow-lg"
                        onClick={handleCreateRoom}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateRoom;
