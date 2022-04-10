import { Link } from 'remix';
import { MdArrowBackIos } from 'react-icons/md';

interface Props {
	className?: string;
	title: string;
	backButtonLink?: string;
}

export default function Header({ title, backButtonLink }: Props) {
	return (
		<div
			className={`flex items-center text-xl mx-2 ${
				backButtonLink ? `justify-between` : `justify-center`
			}`}>
			{backButtonLink ? (
				<Link to={backButtonLink}>
					<MdArrowBackIos />
				</Link>
			) : null}
			<h2>{title}</h2>
			<div className='w-4'></div>
		</div>
	);
}
