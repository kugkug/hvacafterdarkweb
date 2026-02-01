import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ADMIN_EMAIL } from '../constants';
export const Footer = () => {
    return (_jsxs("div", { className: 'py-24 border-t border-white/5 text-center space-y-6', children: [_jsx("p", { className: 'text-slate-800 text-[10px] font-space font-bold uppercase tracking-[0.7em]', children: "HVAC AFTER DARK // EST. 2024" }), _jsxs("p", { className: 'text-slate-600 text-sm font-light italic', children: ["Support & Admin:", ' ', _jsx("span", { className: 'text-cyan-700 font-bold underline cursor-pointer hover:text-cyan-400 transition-colors', children: ADMIN_EMAIL })] })] }));
};
export default Footer;
