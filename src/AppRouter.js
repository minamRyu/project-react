import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from './Menu';
import App from './menu/App';
import State from './menu/State';
import Effect from './useEffect1';
import ProductMain from './menu/ProductMain';
import Review from './menu/Review';
import Ref from './menu/Ref';
import SignIn2 from './menu/SignIn2';
import SignInSide from './menu/SignInSide'
import ContextEx from './menu/ContextEx'
import Main from './menu/Main';

function AppRouter() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Menu />} />
            
            <Route path="/app" element={<App />} />
            <Route path="/state" element={<State />} />
            <Route path="/effect" element={<Effect />} />
            <Route path="/product" element={<ProductMain />} />
            <Route path="/review" element={<Review />} />
            <Route path="/ref" element={<Ref />} />
            <Route path="/signIn2" element={<SignIn2 />} />
            <Route path="/signInSide" element={<SignInSide />} />
            <Route path="/contextEx" element={<ContextEx />} />
            <Route path="/main" element={<Main />} />
        </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;