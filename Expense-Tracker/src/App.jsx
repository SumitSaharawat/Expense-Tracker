import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import AddTransaction from './components/AddTransaction'
import TransactionDetails from './components/TransactionDetails'
import BudgetInitialization from './components/BudgetInitialization';
import Categories from './components/Categories/Categories';
import Goals from './components/Goals/Goal';
import { TransactionProvider } from './components/Context/TransactionContext';
import { BudgetProvider, useBudget } from './components/Context/BudgetContext';
import { AuthProvider, useAuth} from './components/Context/AuthContext';
import ProtectedRoute from './components/protectedRoute';
import Login from './components/login';
import Signup from './components/signup';

function AppContent() {
  const [toggle, setToggle] = useState(true);
  const { user, logout } = useAuth(); // 👈 Pull user info and logout helper from global state
  const { budgetInput } = useBudget();
  
  const toggleTheme = () => setToggle(!toggle);

  return (
    <div className={toggle ? "dark-theme" : "light-theme"}>
      <header className="main-header">
        <h1>Expense-Tracker</h1>
        <nav className="nav-bar">
          {/* Only show application navigation links if a user is securely logged in */}
          {user && (
            <>
              {!budgetInput && (
                <>
                  <Link to="/" className="nav-link">Dashboard</Link>
                  <Link to="/transactions" className="nav-link">Transactions</Link>
                  <Link to="/categories" className="nav-link">Categories</Link>
                  <Link to="/goals" className="nav-link">Goals</Link>
                </>
              )}
              <button onClick={logout} className="logout-btn">Logout</button> 
            </>
          )}
          <button onClick={toggleTheme} className="theme-btn">
            {toggle ? "☀️" : "🌙"}
          </button>
        </nav>
      </header>

      <div className="content-area">
        <Routes>
          {/* PUBLIC AUTH ROUTES: Redirect authenticated users back to Dashboard automatically */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" replace />} />

          {/* PROTECTED ROUTES: Wrapped tightly inside the Route Guard component */}
          <Route path="/" element={
            <ProtectedRoute>
              {budgetInput ? (
                <BudgetInitialization />
              ) : (
                <>
                  <BudgetInitialization />
                  <AddTransaction />
                </>
              )}
            </ProtectedRoute>
          } />

          <Route path="/transactions" element={
            <ProtectedRoute>
              {budgetInput ? <Navigate to="/" replace /> : <TransactionDetails />}
            </ProtectedRoute>
          } />
          
          <Route path="/categories" element={
            <ProtectedRoute>
              {budgetInput ? <Navigate to="/" replace /> : <Categories />}
            </ProtectedRoute>
          } />
          
          <Route path="/goals" element={
            <ProtectedRoute>
              {budgetInput ? <Navigate to="/" replace /> : <Goals />}
            </ProtectedRoute>
          } />

          {/* CATCH-ALL FALLBACK ROUTE */}
          <Route path="*" element={<Navigate to={user ? "/" : "/signup"} replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <BudgetProvider>
          <BrowserRouter>
            <AppContent /> {/* Houses inner structural routing nodes */}
          </BrowserRouter>
        </BudgetProvider>
      </TransactionProvider>
    </AuthProvider>
  )
}

export default App;