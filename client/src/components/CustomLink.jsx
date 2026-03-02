import React from 'react';
import { useLocation } from '../hooks/useLocation';

const CustomLink = ({ to, children, className, style }) => {
    const [path, navigate] = useLocation();
    const handleClick = (e) => {
        e.preventDefault();
        navigate(to);
    };

    const isActive = path === to || (to !== '/' && to !== '/men' && to !== '/women' && path.startsWith(to));

    return (
        <a
            href={to}
            onClick={handleClick}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold text-[0.85rem] tracking-wide transition-all duration-300 ${isActive
                ? 'bg-indigo-500/20 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)] border border-indigo-400/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent'
                } ${className || ''}`}
            style={style}
        >
            {children}
        </a>
    );
};

export default CustomLink;
