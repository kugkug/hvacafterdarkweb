import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { NeonButton } from './NeonButton';
import { Input } from './Input';
import { ADMIN_EMAIL } from '../constants';
import { SimpleButton } from './SimpleButton';
import usePost from '../custom_hooks/usePost';
const Registration = ({ onClose, onCancel }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setConfirmPassword] = useState('');
    const { postData, loading, error, response } = usePost('/user/create');
    const [isEmpty, setIsEmpty] = useState({
        name: false,
        email: false,
        password: false,
        password_confirmation: false
    });
    const handleRegistration = async (e) => {
        e.preventDefault();
        setIsEmpty({
            name: !name,
            email: !email,
            password: !password,
            password_confirmation: !password_confirmation
        });
        if (isEmpty.name ||
            isEmpty.email ||
            isEmpty.password ||
            isEmpty.password_confirmation) {
            return;
        }
        const registrationData = {
            name,
            email,
            password,
            password_confirmation
        };
        await postData(registrationData);
    };
    return (_jsx("div", { className: 'fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/98 backdrop-blur-3xl animate-in fade-in duration-500', children: _jsxs("div", { className: 'glass-panel w-full max-w-md p-12 rounded-[3rem] border-white/5 relative shadow-2xl overflow-hidden', children: [_jsx(SimpleButton, { onClose: onClose, className: 'absolute top-8 right-8 text-slate-700 hover:text-white transition-colors' }), _jsxs("form", { className: 'space-y-6', children: [_jsx(Input, { id: 'name', label: 'Name', type: 'text', isRequired: true, value: name, onChange: (e) => setName(e.target.value), isEmpty: isEmpty.name }), _jsx(Input, { id: 'email', label: 'Email Credential', type: 'text', isRequired: true, value: email, onChange: (e) => setEmail(e.target.value), isEmpty: isEmpty.email }), _jsx(Input, { id: 'password', label: 'Password', type: 'password', isRequired: true, value: password, onChange: (e) => setPassword(e.target.value), isEmpty: isEmpty.password }), _jsx(Input, { id: 'password_confirmation', label: 'Confirm Password', type: 'password', isRequired: true, value: password_confirmation, onChange: (e) => setConfirmPassword(e.target.value), isEmpty: isEmpty.password_confirmation }), _jsx(NeonButton, { isLoading: loading, loadingText: 'In Progress...', onClick: handleRegistration, type: 'submit', className: 'w-full py-5 text-sm mt-4', children: "SIGN UP" }), _jsx(NeonButton, { onClick: () => onCancel(), className: 'w-full py-5 text-sm mt-4', children: "BACK TO LOG IN" }), error && (_jsx("p", { className: 'transition-all duration-100 text-[14px] text-red-600', children: error }))] }), _jsx("div", { className: 'text-center mt-10', children: _jsxs("p", { className: 'text-[10px] text-slate-800 font-space font-bold uppercase tracking-[0.2em]', children: ["Contact Admin:", ' ', _jsx("span", { className: 'text-cyan-900', children: ADMIN_EMAIL })] }) })] }) }));
};
export default Registration;
