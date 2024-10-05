export default function SecondaryButton({ type = 'button', className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            type={type}
            className={
                `btnSecondary px-4 py-2 bg-white border border-gray-900 rounded-md font-semibold text-xs text-gray-700 uppercase   ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
