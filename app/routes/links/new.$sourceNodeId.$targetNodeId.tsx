import type { ActionFunction, LoaderFunction } from 'remix';
import {
	useActionData,
	useLoaderData,
	json,
	Form,
	Link,
	redirect,
} from 'remix';

import { MdOutlineEast } from 'react-icons/md';
import { MdArrowBackIos } from 'react-icons/md';

import type { Node } from '@prisma/client';
import { db } from '~/utils/db.server';

function validateNodeName(name: string) {
	if (name.length < 3) {
		return `That name is too short`;
	}
}

type ActionData = {
	formError?: string;
	fieldErrors?: {
		name: string | undefined;
	};
	fields?: {
		name: string;
		sourceNodeId: string;
		targetNodeId: string;
	};
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const name = form.get('name');
	const sourceNodeId = form.get('sourceNodeId');
	const targetNodeId = form.get('targetNodeId');
	if (
		typeof name !== 'string' ||
		typeof sourceNodeId !== 'string' ||
		typeof targetNodeId !== 'string'
	) {
		return badRequest({
			formError: `Form not submitted correctly.`,
		});
	}
	const fieldErrors = {
		name: validateNodeName(name),
	};

	const fields = { sourceNodeId, targetNodeId, name };
	if (Object.values(fieldErrors).some(Boolean)) {
		return badRequest({ fieldErrors, fields });
	}

	await db.link.create({ data: fields });
	return redirect(`/nodes/${sourceNodeId}`);
};

type LoaderData = {
	sourceNode: Node | null;
	targetNode: Node | null;
	nodeListItems: Array<{ id: string; name: string }>;
};

export const loader: LoaderFunction = async ({ params }) => {
	const sourceNode = await db.node.findUnique({
		where: { id: params.sourceNodeId },
	});
	const targetNode = await db.node.findUnique({
		where: { id: params.targetNodeId },
	});
	const nodeListItems = await db.node.findMany({
		take: 5,
		select: { id: true, name: true },
		orderBy: { createdAt: 'desc' },
	});
	const data: LoaderData = { sourceNode, targetNode, nodeListItems };
	return json(data);
};

export default function NewLinkRoute() {
	const actionData = useActionData<ActionData>();
	const data = useLoaderData<LoaderData>();

	return (
		<div>
			{!data.targetNode && data.sourceNode ? (
				<div>
					<p className='text-center text-sm text-stone-600'>{`Select a target for a link leaving from '${data.sourceNode.name}'.`}</p>
					<ul>
						{data.nodeListItems.map((node) => (
							<li key={node.id}>
								<Link to={`/links/new/${data.sourceNode.id}/${node.id}`}>
									<p className='my-3'>{node.name}</p>
									<hr className='border-b border-stone-300' />
								</Link>
							</li>
						))}
					</ul>
				</div>
			) : data.targetNode && !data.sourceNode ? (
				<div>
					<p className='text-center text-sm text-stone-600'>{`Select a source for a link pointing to '${data.targetNode.name}'.`}</p>
					<ul>
						{data.nodeListItems.map((node) => (
							<li key={node.id}>
								<Link to={`/links/new/${node.id}/${data.targetNode.id}`}>
									<p className='my-3'>{node.name}</p>
									<hr className='border-b border-stone-300' />
								</Link>
							</li>
						))}
					</ul>
				</div>
			) : (
				<div>
					<header className='flex items-center justify-between text-xl mx-2'>
						<Link to='/nodes/' className=''>
							<MdArrowBackIos />
						</Link>
						<h2>Create link</h2>
						<div className='w-4'></div>
					</header>
					<Form className='mt-4' method='post'>
						<div>
							<label className='rounded-xl border border-stone-900 flex flex-col p-2'>
								<span className='text-sm text-stone-600'>Link name</span>
								<input
									type='text'
									className='bg-stone-200'
									name='name'
									defaultValue={actionData?.fields?.name}
									aria-invalid={
										Boolean(actionData?.fieldErrors?.name) || undefined
									}
									aria-errormessage={
										actionData?.fieldErrors?.name ? 'name-error' : undefined
									}
								/>
							</label>
							{actionData?.fieldErrors?.name ? (
								<p role='alert' id='name-error'>
									{actionData.fieldErrors.name}
								</p>
							) : null}
						</div>
						<div>
							<input
								name='sourceNodeId'
								value={data.sourceNode?.id}
								type='hidden'
							/>
							<input
								name='targetNodeId'
								value={data.targetNode?.id}
								type='hidden'
							/>
						</div>
						<div>
							{actionData?.formError ? (
								<p role='alert'>{actionData.formError}</p>
							) : null}
							<button
								type='submit'
								className='rounded-xl bg-stone-800 text-stone-200 py-2 px-4 gap-4 items-center flex flex-nowrap w-full my-2'>
								<MdOutlineEast className='text-2xl' />
								<div className='flex flex-col text-left'>
									<p>Create link</p>
									<p className='text-sm text-stone-400'>
										{`Link from ${data.sourceNode.name} to ${data.targetNode.name}`}
									</p>
								</div>
							</button>
						</div>
					</Form>
				</div>
			)}
		</div>
	);
}
