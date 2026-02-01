import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import NeonButton from './NeonButton';
import { ADMIN_EMAIL } from '../constants';
import { SimpleButton } from './SimpleButton';
import { useAuth } from '../utilities/auth';
import { Input } from './Input';
import usePost from '../custom_hooks/usePost';
import { useNavigate } from 'react-router-dom';
const Sigin = ({ onClose, onClick }) => {
    const { postData, loading, error, response } = usePost('/user/login');
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isEmpty, setIsEmpty] = useState({
        email: false,
        password: false
    });
    const auth = useAuth();
    const handleLogin = async (e) => {
        e.preventDefault();
        // setIsEmpty({
        //     email: !email,
        //     password: !password
        // });
        if (isEmpty.email || isEmpty.password) {
            return;
        }
        const postResponse = await postData({
            email,
            password
        });
        if (postResponse?.status) {
            console.log(postResponse);
            auth.login(email, postResponse.token);
            onClose();
            // navigate('/');
        }
    };
    return (_jsx("div", { className: 'fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/98 backdrop-blur-3xl animate-in fade-in duration-500', children: _jsxs("div", { className: 'glass-panel w-full max-w-md p-12 rounded-[3rem] border-white/5 relative shadow-2xl overflow-hidden', children: [_jsx(SimpleButton, { onClose: onClose, className: 'absolute top-8 right-8 text-slate-700 hover:text-white transition-colors' }), _jsxs("div", { className: 'text-center mb-10', children: [_jsx("h2", { className: 'text-2xl font-syne font-bold text-cyan-400 tracking-tighter uppercase', children: "login" }), _jsx("p", { className: 'text-slate-700 text-[10px] font-space font-bold mt-2.5 uppercase tracking-[0.5em]', children: "Terminal Entry Protocol" })] }), _jsxs("form", { className: 'space-y-6', children: [_jsx(Input, { id: 'email', label: 'Email', type: 'email', value: email, onChange: (e) => setEmail(e.target.value), isRequired: true, isEmpty: isEmpty.email }), _jsx(Input, { id: 'password', label: 'Password', type: 'password', isRequired: true, value: password, onChange: (e) => setPassword(e.target.value), isEmpty: isEmpty.password }), _jsx(NeonButton, { isLoading: loading, type: 'submit', className: 'w-full py-5 text-sm mt-4', loadingText: 'Validating Credentials...', onClick: handleLogin, children: "PUNCH CLOCK" }), error && (_jsx("p", { className: 'transition-all duration-100 text-[14px] text-red-600', children: error })), _jsx(NeonButton, { onClick: () => {
                                onClose();
                                onClick?.();
                            }, className: 'w-full py-5 text-sm mt-4', children: "REGISTER" })] }), _jsx("div", { className: 'text-center mt-10', children: _jsxs("p", { className: 'text-[10px] text-slate-800 font-space font-bold uppercase tracking-[0.2em]', children: ["Contact Admin:", ' ', _jsx("span", { className: 'text-cyan-900', children: ADMIN_EMAIL })] }) })] }) }));
};
export default Sigin;
