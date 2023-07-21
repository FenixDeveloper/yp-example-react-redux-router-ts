import React, { ReactElement } from 'react';
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  Outlet
} from "react-router-dom";

import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import styles from './App.module.css';

function CounterPage() {
  return <Counter />;
}

function MainPage() {
  return <p>Main page</p>
}

function ModalPage() {
  const location = useLocation();
  
  return <p>Modal page: background = {location.state?.background ? JSON.stringify(location.state?.background) : 'none'}</p>
}

function Modal({ children, onClose }: { children: ReactElement, onClose: () => void }) {
  return <div className={styles.modal}>
    <div className={styles.content}>
      {children}
      <button onClick={onClose} className={styles.close}>×</button>
    </div>
  </div>
}

function App() {
  const location = useLocation();
  const background = location.state && location.state.background;
  const navigate = useNavigate();

  const onModalClose = () => navigate(-1);

  return (
    <div className={styles.app}>
        <nav className={styles.menu}>
          <Link to="/">Main</Link>
          <Link to="/counter">Counter</Link>
          <Link to="/modal" state={{ background: location }}>Modal (true)</Link>
          <Link to="/modal">Modal (false)</Link>
          <Link to="/notfound">Not Found</Link>
        </nav>

        <section className={styles.section}>
          <Routes location={background || location}>
            <Route path="/" element={<MainPage />} />
            <Route path="/counter" element={<CounterPage />} />
            <Route path="/modal" element={<ModalPage />} />
            <Route path="*" element={<p>Page not found</p>} />
          </Routes>
        </section>

        {background && <Routes>
          <Route element={<Modal onClose={onModalClose}>
            <Outlet />
          </Modal>}>
            <Route path="/modal" element={<ModalPage />} />
          </Route>  
        </Routes>}
    </div>
  );
}

export default App;
