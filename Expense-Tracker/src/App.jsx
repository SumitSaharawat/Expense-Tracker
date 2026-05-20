import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AddTransaction from './components/AddTransaction'
import TransactionDetails from './components/TransactionDetails'
import BudgetInitialization from './components/BudgetInitialization';
import Categories from './components/Categories/Categories';
import Goals from './components/Goals/Goal';
import { TransactionProvider } from './components/Context/TransactionContext';

function App() {
  const [toggle, setToggle] = useState(true);
  const toggleTheme = () => setToggle(!toggle);
  return (
    <TransactionProvider>
      <BrowserRouter>
        <div className={toggle ? "dark-theme" : "light-theme"}>
          <header className="main-header">
            <h1>Expense-Tracker</h1>
            <nav className="nav-bar">
              <Link to="/" className="nav-link">Dashboard</Link>
              <Link to="/transactions" className="nav-link">Transactions</Link>
              <Link to="/categories" className="nav-link">Categories</Link>
              <Link to="/goals" className="nav-link">Goals</Link>
              <button onClick={toggleTheme} className="theme-btn">
                {toggle ? "☀️" : "🌙"}
              </button>
            </nav>
          </header>

          <div className="content-area">
            <Routes>
              {/* HOME PAGE: Summary and Adding functionality */}
              <Route path="/" element={
                <>
                  <BudgetInitialization/>
                  <AddTransaction />
                </>
              } />

              {/* TRANSACTION PAGE: Filtering and List mapping */}
              <Route path="/transactions" element={
                <>
                  <TransactionDetails/>
                </>
              } />

              <Route path="/categories" element={
                <>
                  <Categories/>
                </>
              } />

              <Route path="/goals" element={
                <>
                  <Goals />
                </>
              } />

            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </TransactionProvider>
  )
}

export default App;