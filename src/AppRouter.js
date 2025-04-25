import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from './Menu';
import App from './App';
import State from './State';
import Effect from './useEffect1';
import ProductMain from './ProductMain';

function AppRouter() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Menu />} />
            
            <Route path="/app" element={<App />} />
            <Route path="/state" element={<State />} />
            <Route path="/effect" element={<Effect />} />
            <Route path="/product" element={<ProductMain />} />
        </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;