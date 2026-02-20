import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Home from './components/Home';
import { AuthProvider } from './utilities/auth';
import Memes from './components/Memes';
import Finds from './components/Finds';
import Community from './components/Community';
import { PrivateMessages } from './components/PrivateMessages';
import { Footer } from './components/Footer';

const App = () => {
    return (
        <AuthProvider>
            <Navbar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/memes' element={<Memes />} />
                <Route path='/finds' element={<Finds />} />
                <Route path='/community' element={<Community />} />
                <Route path='/messages' element={<PrivateMessages />} />
            </Routes>
            <Footer />
        </AuthProvider>
    );
};

export default App;
