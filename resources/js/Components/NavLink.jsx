import { Link } from '@inertiajs/react';

export default function NavLink({ colorLetra, active, className = '', children, ...props }) {
    
    return (
        <Link
            {...props}
            style={{ fontSize: '1.2em', color: colorLetra }}
            className={
                'inline-flex items-center px-1 pt-1 border-b-2 font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-indigo-400 focus:border-indigo-700 '
                    : 'border-transparent hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300 ') +
                className
            }
        >
            {children}
        </Link>
    );
}
