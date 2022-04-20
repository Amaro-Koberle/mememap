import { LoaderFunction } from 'remix';
import { Link, useLoaderData, json } from 'remix';
import { Tab } from '@headlessui/react';
import { MdOutlineEast } from 'react-icons/md';
import { MdOutlineEdit } from 'react-icons/md';
import { db } from '~/utils/db.server';
import type { User } from '@prisma/client';
import Button from '~/components/Button';
import ProfilePicture from '~/components/ProfilePicture';
import Header from '~/components/Header';
import TabButton from '~/components/TabButton';
import NodeList from '~/components/NodeList';

type LoaderData = {
	user: User;
	nodeListItems: Array<{
		id: string;
		name: string;
		createdAt: Date;
		author: { username: string };
		_count: { inLinks: number; outLinks: number };
	}>;
};

export const loader: LoaderFunction = async ({ params }) => {
	const user = await db.user.findUnique({
		where: { id: params.userId },
	});
	if (!user) throw new Error('User not found.');
	const nodeListItems = await db.node.findMany({
		where: { author: { id: user.id } },
		take: 50,
		select: {
			id: true,
			name: true,
			createdAt: true,
			author: { select: { username: true } },
			_count: { select: { inLinks: true, outLinks: true } },
		},
		orderBy: { createdAt: 'desc' },
	});
	if (!nodeListItems) throw new Error('Nodes not found.');
	const data: LoaderData = { user, nodeListItems };
	return json(data);
};

export default function UserRoute() {
	const data = useLoaderData<LoaderData>();
	return (
		<div className='h-full relative'>
			<Header title={data.user.name} backButtonLink='/nodes' />
			<div className='h-full mt-2'>
				<div className='flex gap-4 items-center m-4'>
					<div className='flex flex-col items-center'>
						<ProfilePicture size='lg' />
						<span>{`@${data.user.username}`}</span>
					</div>
					<div className='flex flex-nowrap gap-1 h-10 items-center'>
						<Button icon={<MdOutlineEast />} thin={true} buttonName='Link' />
						<Link to='edit'>
							<Button icon={<MdOutlineEdit />} />
						</Link>
					</div>
				</div>
				<div className='w-full mt-4'>
					<Tab.Group>
						<Tab.List className='flex justify-evenly'>
							<Tab>
								<TabButton tabName='bio' />
							</Tab>
							<Tab>
								<TabButton tabName='nodes' />
							</Tab>
						</Tab.List>
						<hr className='border-b border-stone-300 mb-4' />
						<Tab.Panels>
							<Tab.Panel>
								<p>{data.user.bio}</p>
							</Tab.Panel>
							<Tab.Panel>
								<NodeList nodeListItems={data.nodeListItems} />
							</Tab.Panel>
						</Tab.Panels>
					</Tab.Group>
				</div>
			</div>
		</div>
	);
}
