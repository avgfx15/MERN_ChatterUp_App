import './App.css';
import { Route } from 'react-router-dom'
import HomePage from './pages/homePage.js';
import ChatPage from './pages/chatPage.js';



function App() {
  return (
    <div className="App">
      <Route path='/' component={HomePage} exact />
      <Route path='/chats' component={ChatPage} exact />

    </div>
  );
}

export default App;
