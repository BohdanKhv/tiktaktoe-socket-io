import { useState, useEffect } from "react"
import io from "socket.io-client"
import './styles/TikTakToe.css'

const socket = io("http://localhost:5000")

const TikTakToe = () => {
    const [player, setPlayer] = useState();
    const [uId, setUId] = useState('');
    const [room, setRoom] = useState('');
    const [joinedRoom, setJoinedRoom] = useState('');
    const [playersCount, setPlayersCount] = useState(0);
    const [startGame, setStartGame] = useState(false);
    const [cells, setCells] = useState([
        {id: 1, value: ''},
        {id: 2, value: ''},
        {id: 3, value: ''},
        {id: 4, value: ''},
        {id: 5, value: ''},
        {id: 6, value: ''},
        {id: 7, value: ''},
        {id: 8, value: ''},
        {id: 9, value: ''},
    ]);

    const handleClick = async (id) => {
        setCells(cells.map(cell => {
            if (cell.id === id) {
                cell.value = player;
            }
            return cell;
        }));
        socket.emit('cell-clicked', {id, player, room});
        // const currCounter = counter + 1;
        // await socket.emit('click', { uId, player, currCounter, room });
        // setCounter(currCounter);
    }


    const joinRoom = async () => {
        await socket.emit('join_room', room);
        setUId(socket.id)
        setJoinedRoom(room)
    }

    const exitRoom = async () => {
        await socket.emit('exit_room', room)
        setUId('')
        setJoinedRoom('')
    }

    useEffect(() => {
        socket.on('joined_room', (data) => {
            console.log(data)
            setPlayer(data.player);
            setPlayersCount(data.playersCount);
        });
        socket.on('user_joined_room', (data) => {
            setPlayersCount(data.playersCount);
        });

        socket.on('exited_room', (data) => {
            console.log(data)
            setPlayersCount(data.playersCount);
        });

    }, [socket]);

    return (
        <main>
            {joinedRoom ? (
                <div className="game">
                    <div className="flex mt-1 flex-column">
                        <div className="flex justify-between">
                            <h4 className="fs-3">
                                Room: {joinedRoom}
                            </h4>
                            <div className="btn" onClick={exitRoom}>
                                Exit Room
                            </div>
                        </div>
                    </div>
                    <div className="ttt">
                        {cells.map((cell, i) => (
                            <div className={`ttt-cell${cell.value ? cell.value === 'X' ? ' ttt-cell-x' : ' ttt-cell-o' : ''}`}
                                key={i}
                                onClick={() => handleClick(cell.id)}
                                style={{
                                    ['--cell-player']: `var(--color-${player === 'X' ? '5' : '6'})`,
                                }}
                            >
                                {cell.value}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center">
                        <h4 className="fs-3">
                            Players: {playersCount} | Player: {player}
                        </h4>
                    </div>
                </div>
            ) : (
                <div className="lobby">
                    <div className="flex pt-3">
                        <input 
                            type="text" 
                            value={room} 
                            onChange={(e) => setRoom(e.target.value)} 
                            placeholder="Enter room name"
                            className="input-lg"
                        />
                        <div className="btn ms-1" onClick={joinRoom}>
                            Enter
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default TikTakToe