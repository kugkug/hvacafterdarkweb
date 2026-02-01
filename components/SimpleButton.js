import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
export const SimpleButton = ({ onClose, className }) => {
    return (_jsx(_Fragment, { children: _jsx("button", { onClick: onClose, className: className, children: "\u2715" }) }));
};
