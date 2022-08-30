import { useState, useEffect } from "react"
import io from "socket.io-client"
import './styles/TicTacToe.css'

// const socket = io("http://localhost:5000")
const socket = io("https://tictactoe-s.herokuapp.com/")

const TicTacToe = () => {
    const [player, setPlayer] = useState();
    const [room, setRoom] = useState('');
    const [joinedRoom, setJoinedRoom] = useState('');
    const [playersCount, setPlayersCount] = useState(0);
    const [turn, setTurn] = useState('');
    const [winner, setWinner] = useState('');
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

    const handleEndGame = () => {
        let winner = '';
        // Check if there is a winner
        if(cells[0].value === cells[1].value && cells[1].value === cells[2].value && cells[0].value !== '') {
            winner = cells[0].value;
        } else if(cells[3].value === cells[4].value && cells[4].value === cells[5].value && cells[3].value !== '') {
            winner = cells[3].value;
        } else if(cells[6].value === cells[7].value && cells[7].value === cells[8].value && cells[6].value !== '') {
            winner = cells[6].value;
        } else if(cells[0].value === cells[3].value && cells[3].value === cells[6].value && cells[0].value !== '') {
            winner = cells[0].value;
        } else if(cells[1].value === cells[4].value && cells[4].value === cells[7].value && cells[1].value !== '') {
            winner = cells[1].value;
        } else if(cells[2].value === cells[5].value && cells[5].value === cells[8].value && cells[2].value !== '') {
            winner = cells[2].value;
        } else if(cells[0].value === cells[4].value && cells[4].value === cells[8].value && cells[0].value !== '') {
            winner = cells[0].value;
        } else if(cells[2].value === cells[4].value && cells[4].value === cells[6].value && cells[2].value !== '') {
            winner = cells[2].value;
        } else if(cells.filter(cell => cell.value === '').length === 0) {
            winner = 'Draw';
        }
        return winner;
    }

    const handleMove = async (id) => {
        if(winner === '') {
            if (turn === player && cells[id - 1].value === '') {
                setCells(cells.map(cell => {
                    if (cell.id === id) {
                        cell.value = player;
                    }
                    return cell;
                }));
                const winner = handleEndGame();
                socket.emit('make_move', {id, player, room, winner});
            }
        }
    }

    const reset = () => {
        setJoinedRoom('');
        setCells([
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
        setWinner('');
        setPlayersCount(0);
        setPlayer('');
        setTurn('');
    }

    const joinRoom = async () => {
        await socket.emit('join_room', room);
        setJoinedRoom(room);
    }

    const exitRoom = async () => {
        await socket.emit('exit_room', room);
        reset();
    }

    const playAgain = async () => {
        await socket.emit('play_again', {room, turn: winner === 'Draw' ? turn : winner});
    }

    useEffect(() => {
        socket.on('joined_room', (data) => {
            setPlayer(data.player);
            setPlayersCount(data.playersCount);
            setTurn(data.turn === "O" ? 'O' : data.turn === "X" ? 'X' : 'Waiting for another player'); 
        });
        socket.on('user_joined_room', (data) => {
            setTurn(data.turn === "O" ? 'O' : data.turn === "X" ? 'X' : 'Waiting for another player'); 
            setPlayersCount(data.playersCount);
        });

        socket.on('exited_room', (data) => {
            setPlayersCount(data.playersCount);
            if(data.playersCount === 1) {
                setTurn('Waiting for another player');
                setPlayer('X');
                setCells([
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
            }
        });

        socket.on('move_made', (data) => {
            setCells(cells => cells.map(cell => {
                if (cell.id === data.id) {
                    cell.value = data.player;
                }
                return cell;
            }));
            setWinner(data.winner);
            setTurn(data.turn === "O" ? 'O' : data.turn === "X" ? 'X' : 'Waiting for another player'); 
        });

        socket.on('play_again', (data) => {
            setCells([
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
            setWinner('');
            setTurn(data.turn || 'Waiting for another player');
        });
    }, [socket]);

    return (
        <main>
            {joinedRoom ? (
                <div className="game container max-w">
                    <div className="flex gap-1 flex-column">
                        <div className="flex justify-between">
                            <h4 className="">
                                Room # {joinedRoom} | In room: {playersCount}
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
                                onClick={() => {if(turn === player) handleMove(cell.id)}}
                                data-cell={cell.id}
                                style={{
                                    ['--cell-player']: `var(--color-${player === 'X' ? '5' : '6'})`,
                                }}
                            >
                                {cell.value}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center flex-column align-center">
                        <h4 className="fs-2">
                            {winner ? `Winner: ${winner}` : `Turn: ${turn}`}
                        </h4>
                        {winner && (
                            <div className="mt-1 btn"
                                onClick={playAgain}
                            >
                                Play Again
                            </div>
                        )}
                        {turn !== 'Waiting for another player' && (
                            <h4 className="mt-1">
                                You are: {player}
                            </h4>
                        )}
                    </div>
                </div>
            ) : (
                <div className="lobby">
                    <div className="flex gap-1">
                        <input 
                            type="text" 
                            value={room} 
                            onChange={(e) => setRoom(e.target.value)} 
                            placeholder="Enter room name"
                            className="input-lg w-100 flex-grow-1"
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

export default TicTacToe