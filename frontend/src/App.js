import { BrowserRouter as Router } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar';
import InventoryList from './components/GetInventoryItems';

export default function App() {
  return (
    <Router>
      <Navbar />
      <div>
        <InventoryList />
      </div>
    </Router>
  )
}
