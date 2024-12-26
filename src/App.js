import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Students from './components/Students';
import Books from './components/Books';
import Vendors from './components/Vendors';
import Transactions from './components/Transactions';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import AddBook from './components/AddBook';
import AddStudent from "./components/AddStudent"; 
import StudentProfile from "./components/StudentProfile"; 
import AddVendor from "./components/AddVendor";
import AddTransaction from "./components/AddTransaction ";

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register setUser={setUser} />} />
        <Route path="/" element={user ? <Layout setUser={setUser} user={user} /> : <Navigate to="/login" />}>
          <Route path="students" element={<Students />} />
          <Route path="books" element={<Books />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="transactions" element={<Transactions />} />
        </Route>
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/add-student" element={<AddStudent />} /> 
        <Route path="/students/:id" element={<StudentProfile />} /> 
        <Route path="/add-transaction" element={<AddTransaction />} />
        <Route path="/add-vendor" element={<AddVendor />} />
      </Routes>
    </Router>
  );
};

export default App;
