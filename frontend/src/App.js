import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TicTacToe } from './pages'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<TicTacToe/>} />
      </Routes>
    </Router>
  );
}

export default App;
