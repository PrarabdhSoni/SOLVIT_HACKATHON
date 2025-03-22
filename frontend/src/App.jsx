import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './Pages/Auth/SignUp';
import LogIn from './Pages/Auth/LogIn';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="*" element={<Navigate to="/login" />} />
        
      </Routes> 
    </Router>
  );
}

export default App;