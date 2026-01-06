export const Button = ({ children, onClick, className }) => (
    <button onClick={onClick} className={`bg-comic-yellow border-2 border-black font-comic hover:translate-y-1 ${className}`}>
        {children}
    </button>
);
