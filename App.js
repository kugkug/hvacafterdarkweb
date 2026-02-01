import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Home from './components/Home';
import { AuthProvider } from './utilities/auth';
const App = () => {
    return (_jsxs(AuthProvider, { children: [_jsx(Navbar, {}), _jsx(Routes, { children: _jsx(Route, { path: '/', element: _jsx(Home, {}) }) })] }));
};
export default App;
