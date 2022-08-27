import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TikTakToe } from './pages'

function App() {
  return (
    <Router>
      <div className="container max-w">
        <Routes>
          <Route path='/' element={<TikTakToe/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
