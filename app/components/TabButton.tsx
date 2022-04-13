interface Props {
	tabName: string;
}

export default function TabButton({ tabName }: Props) {
	return (
		<div>
			<span className={`uppercase font-bold`}>{tabName}</span>
		</div>
	);
}
