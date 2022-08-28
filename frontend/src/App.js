import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TikTakToe } from './pages'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<TikTakToe/>} />
      </Routes>
    </Router>
  );
}

export default App;
