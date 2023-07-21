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
  // 1. Актуальный адрес в браузере
  const location = useLocation();

  // 2. Предыдущая страница если есть
  const background = location.state && location.state.background;
  const navigate = useNavigate();

  const onModalClose = () => navigate(-1);

  return (
    <div className={styles.app}>
        <nav className={styles.menu}>
          <Link to="/">Main</Link>
          <Link to="/counter">Counter</Link>
          {/* 3. При переходе на страницу сохраняем информацию о текущей странице откуда пришли */}
          <Link to="/modal" state={{ background: location }}>Modal (true)</Link>
          <Link to="/modal">Modal (false)</Link>
          <Link to="/notfound">Not Found</Link>
        </nav>

        <section className={styles.section}>
          {/* 4. В первом блоке маршрутов показываем страницу для актуального адреса, только если нет информации о предыдущей странице */}
          <Routes location={background || location}>
            <Route path="/" element={<MainPage />} />
            <Route path="/counter" element={<CounterPage />} />
            <Route path="/modal" element={<ModalPage />} />
            <Route path="*" element={<p>Page not found</p>} />
          </Routes>
        </section>

        {/* 5. Если передана предыдущая страница, значит хотим открыть модалку. Обрабатываем те маршруты, которые хотим показать в модальном окне. */}
        {background && <Routes>
          {/* 6. Чтобы не заворачивать каждый по отдельности, можно обернуть в общий для всех контейнер модального окна. */}
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
