import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	LinksFunction,
} from 'remix';
import type { MetaFunction } from 'remix';
import styles from './styles/tailwind.css';
import MainNavigation from './components/mainNavigation';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export const meta: MetaFunction = () => {
	return { title: 'New Remix App' };
};

export default function App() {
	return (
		<html lang='en'>
			<head>
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width,initial-scale=1' />
				<title>mememap</title>
				<Meta />
				<Links />
			</head>
			<body className='bg-stone-200 text-stone-900 m-3'>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
				<MainNavigation />
			</body>
		</html>
	);
}
