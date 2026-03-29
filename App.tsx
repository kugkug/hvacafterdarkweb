import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Home from './components/Home';
import { AuthProvider } from './utilities/auth';
import Memes from './components/Memes';
import Finds from './components/Finds';
import Community from './components/Community';
import { PrivateMessages } from './components/PrivateMessages';
import UserProfile from './components/UserProfile';
import { Footer } from './components/Footer';

const App = () => {
    return (
        <AuthProvider>
            <div className='min-h-screen flex flex-col overflow-x-hidden w-full'>
            <Navbar />
            <div className='flex-1 flex flex-col min-w-0'>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/memes' element={<Memes />} />
                <Route path='/finds' element={<Finds />} />
                <Route path='/community' element={<Community />} />
                <Route path='/messages' element={<PrivateMessages />} />
                <Route path='/profile' element={<UserProfile />} />
            </Routes>
            </div>
            <Footer />
            </div>
        </AuthProvider>
    );
};

export default App;
