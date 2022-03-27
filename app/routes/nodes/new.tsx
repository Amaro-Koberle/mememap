import type { ActionFunction } from 'remix';
import { useActionData, Form, Link, redirect, json } from 'remix';

import { MdArrowBackIos } from 'react-icons/md';

import { db } from '~/utils/db.server';

function validateNodeContent(content: string) {
	if (content.length < 10) {
		return `That content is too short`;
	}
}

function validateNodeName(name: string) {
	if (name.length < 3) {
		return `That name is too short`;
	}
}

type ActionData = {
	formError?: string;
	fieldErrors?: {
		name: string | undefined;
		content: string | undefined;
	};
	fields?: {
		name: string;
		content: string;
	};
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const name = form.get('name');
	const content = form.get('content');
	if (typeof name !== 'string' || typeof content !== 'string') {
		return badRequest({
			formError: `Form not submitted correctly.`,
		});
	}

	const fieldErrors = {
		name: validateNodeName(name),
		content: validateNodeContent(content),
	};

	const fields = { name, content };
	if (Object.values(fieldErrors).some(Boolean)) {
		return badRequest({ fieldErrors, fields });
	}

	const node = await db.node.create({ data: fields });
	return redirect(`/nodes/${node.id}`);
};

export default function NewNodeRoute() {
	const actionData = useActionData<ActionData>();
	return (
		<div>
			<header className='flex items-center justify-between text-xl mx-2'>
				<Link to='/nodes/' className=''>
					<MdArrowBackIos />
				</Link>
				<h2>Edit node</h2>
				<div className='w-4'></div>
			</header>
			<Form method='post' className='mt-4'>
				<div>
					<label className='rounded-t-xl border border-stone-900 flex flex-col p-2'>
						<span className='text-sm text-stone-600'>Node name</span>
						<input
							className='bg-stone-200'
							type='text'
							name='name'
							defaultValue={actionData?.fields?.name}
							aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
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
					<label className='rounded-b-xl border-x border-b border-stone-900 flex flex-col p-2'>
						<span className='text-sm text-stone-600'>Content</span>
						<textarea
							className='bg-stone-200 h-40'
							name='content'
							defaultValue={actionData?.fields?.content}
							aria-invalid={
								Boolean(actionData?.fieldErrors?.content) || undefined
							}
							aria-errormessage={
								actionData?.fieldErrors?.content ? 'content-error' : undefined
							}
						/>
					</label>
					{actionData?.fieldErrors?.content ? (
						<p role='alert' id='content-error'>
							{actionData.fieldErrors.content}
						</p>
					) : null}
				</div>
				<div>
					{actionData?.formError ? (
						<p role='alert'>{actionData.formError}</p>
					) : null}
					<button
						className='uppercase font-bold text-lg absolute top-3 right-4'
						type='submit'>
						Post
					</button>
				</div>
			</Form>
		</div>
	);
}
