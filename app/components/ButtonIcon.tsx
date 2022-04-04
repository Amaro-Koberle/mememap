interface Props {
	icon?: React.ReactNode;
}

export default function ButtonIcon({ icon }: Props) {
	return <div className='text-xl'>{icon}</div>;
}
