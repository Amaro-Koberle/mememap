import type { ActionFunction } from 'remix';
import { useActionData, Form, Link, redirect, json } from 'remix';
import Input from '~/components/Input';

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
				<Input
					label='Node name'
					name='name'
					type='text'
					position='top'
					actionDataField={actionData?.fields?.name}
					actionDataFieldError={actionData?.fieldErrors?.name}
				/>
				<Input
					inputType='textarea'
					label='Content'
					name='content'
					type='text'
					position='bottom'
					actionDataField={actionData?.fields?.content}
					actionDataFieldError={actionData?.fieldErrors?.content}
				/>
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
