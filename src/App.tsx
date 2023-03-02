import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ListTasks from './Pages/ListTasks';
import AddTasks from './Pages/AddTasks';



function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<ListTasks/>}/>
        <Route path="/addtask" element={ <AddTasks/>} />
      </Routes>
    </Router>

  );
}

export default App;
