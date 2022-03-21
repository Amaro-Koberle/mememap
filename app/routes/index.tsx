import { redirect } from 'remix';

export const loader = () => {
	return redirect('/nodes');
};

export default function IndexRoute() {
	return (
		<>
			<p>Index Route</p>
		</>
	);
}
