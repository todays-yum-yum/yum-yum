import clsx from 'clsx';

export default function SelectButton({
  type,
  size = 'full',
  color = 'primary',
  disabled = false,
  onClick,
  children,
}) {
  const sizeMap = {
    xs: 'px-2 h-8 max-[350px]:text-sm',
    sm: 'px-2 h-12 max-[350px]:text-sm',
    md: 'px-5 h-12 max-[350px]:text-sm max-[350px]:px-4',
    lg: 'px-8 h-12 max-[350px]:text-sm',
    xl: 'px-11 h-12 max-[350px]:text-sm',
    '2xl': 'w-[140px] h-12 max-[350px]:text-sm',
    full: 'w-full h-12 max-[350px]:text-sm',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      // h-12 px-5 bg-emerald-500 rounded-lg inline-flex justify-center items-center gap-2 overflow-hidden
      className={clsx('rounded-lg w-full py-4 px-2', {
        'border border-primary bg-primary-light text-primary-dark':
          color === 'primary' && !disabled,
        'border border-secondary bg-secondary-light text-secondary':
          color === 'secondary' && !disabled,
        'border border-gray-300 text-gray-500': color === 'gray',
        'bg-gray-300 text-white cursor-not-allowed': disabled,
      })}
    >
      {children}
    </button>
  );
}
