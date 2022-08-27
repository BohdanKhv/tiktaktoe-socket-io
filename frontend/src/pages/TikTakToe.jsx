import { useState, useEffect } from "react"
import io from "socket.io-client"

const socket = io("http://localhost:5000")

const TikTakToe = () => {
    const [counter, setCounter] = useState(0)
    const [player, setPlayer] = useState('X');
    const [uId, setUId] = useState('');
    const [room, setRoom] = useState('');
    const [joinedRoom, setJoinedRoom] = useState('');

    const handleClick = async (e) => {
        const currCounter = counter + 1;
        await socket.emit('click', { uId, player, currCounter, room });
        setCounter(currCounter);
    }

    const join = async () => {
        await socket.emit('join', room)
        setUId(socket.id)
        setJoinedRoom(room)
    }

    useEffect(() => {
        socket.on('receive_click', (data) => {
            setCounter(data.currCounter)
        })
    }, [socket]);

    return (
        <main>
            <div className="flex pt-3">
                <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} />
                <div className="btn ms-1" onClick={join}>
                    Join
                </div>
            </div>
            <div className="flex mt-1 flex-column">
                <p>
                    Current room: {joinedRoom}
                </p>
                <div className="flex">
                    <div className="btn" onClick={handleClick}>
                        {counter} Clicked
                    </div>
                </div>
            </div>
        </main>
    )
}

export default TikTakToe