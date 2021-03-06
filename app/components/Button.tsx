import ButtonIcon from './ButtonIcon';

interface Props extends React.ComponentPropsWithoutRef<'button'> {
	buttonStyle?: 'emphasized' | 'danger';
	thin?: boolean;
	buttonName?: string;
	buttonDescription?: string;
	icon?: React.ReactNode;
}

export default function Button({
	buttonStyle,
	thin,
	buttonName,
	icon,
	buttonDescription,
	className,
	type,
	value,
	name,
	onClick,
}: Props) {
	return (
		<button
			onClick={onClick ? (e) => onClick(e) : undefined}
			name={name}
			type={type}
			value={value}
			className={`rounded-xl ${
				buttonStyle === 'emphasized'
					? 'bg-stone-800 text-stone-200'
					: buttonStyle === 'danger'
					? 'text-red-700 bg-red-200'
					: 'bg-stone-300'
			}  ${className}`}>
			{!buttonName ? (
				<div className='w-10 h-10 flex justify-center items-center'>
					<ButtonIcon icon={icon} />
				</div>
			) : !icon ? (
				<p className='px-4 py-3'>{buttonName}</p>
			) : !buttonDescription ? (
				<div
					className={`${
						thin ? 'h-10 px-3' : 'px-4 py-3'
					} gap-2 items-center justify-center flex flex-nowrap`}>
					<ButtonIcon icon={icon} />
					<p>{buttonName}</p>
				</div>
			) : (
				<div className='px-4 py-2 gap-3 items-center flex flex-nowrap'>
					<ButtonIcon icon={icon} />
					<div>
						<p className='text-left'>{buttonName}</p>
						<p
							className={`text-sm ${
								buttonStyle === 'emphasized'
									? 'text-stone-400'
									: buttonStyle === 'danger'
									? 'text-red-700 text-opacity-75'
									: 'text-stone-500'
							}`}>
							{buttonDescription}
						</p>
					</div>
				</div>
			)}
		</button>
	);
}
