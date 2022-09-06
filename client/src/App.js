import './App.css';
import Nav from './components/nav/Nav';
import Login from './components/login/Login';

function App() {
  return (
    <>
      <Nav data='login' className='nav'></Nav>
      <Login></Login>
      <div className='chair-pattern'></div>
    </>
  );
}

export default App;
