import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import './css/vendereApp.css';

import LandingPage from './routes/LandingPage';
import RedirectToCashier from './routes/RedirectToCashier';
import Cashier from './routes/Cashier';
import Transactions from './routes/Transactions';
import Debts from './routes/Debts';
import Reports from './routes/Reports';
import Profile from './routes/Profile';

const BadRequest = () => {
  return <h1>404 TOD</h1>;
};

export default function App() {
  const [total, settotal] = useState(0);
  const [cartList, setCartList] = useState([]);
  const [search, setSearch] = useState('');

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/vendere-app">
        <Route index element={<RedirectToCashier />} />
        <Route
          path="cashier"
          element={
            <Cashier
              total={total}
              setTotal={settotal}
              cartList={cartList}
              setCartList={setCartList}
              search={search}
              setSearch={setSearch}
            />
          }
        />
        <Route path="transactions" element={<Transactions />} />
        <Route path="debts" element={<Debts />} />
        <Route path="reports" element={<Reports />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<BadRequest />} />
    </Routes>
  );
}
