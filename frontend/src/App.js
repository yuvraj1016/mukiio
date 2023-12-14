import { Routes, Route } from 'react-router-dom';
import Home from './Components/Homepage/Home';
import User from './Components/UserPage/User';
import Imageupload from './Components/Homepage/Imageupload';

function App() {
  return (
    <div className='main-container-routes'>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/user' element={<User/>}/>
        <Route path='/image' element={<Imageupload />} />
      </Routes>
    </div>
  );
}

export default App;
