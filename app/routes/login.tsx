import { Form, Link, useActionData, json, redirect } from 'remix';
import type { ActionFunction } from 'remix';
import { MdOutlineForwardToInbox } from 'react-icons/md';
import { MdArrowBackIos } from 'react-icons/md';
import Button from '~/components/Button';
import postmark from 'postmark';
import Input from '~/components/Input';

function validateEmail(email: string) {
	if (email.length < 3) {
		return `That email is too short`;
	}
}

type ActionData = {
	formError?: string;
	fieldErrors?: {
		email: string | undefined;
	};
	fields?: {
		email: string;
	};
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const email = form.get('email');
	if (typeof email !== 'string') {
		return badRequest({
			formError: `Form not submitted correctly.`,
		});
	}

	const fieldErrors = {
		email: validateEmail(email),
	};

	const fields = { email };
	if (Object.values(fieldErrors).some(Boolean)) {
		return badRequest({ fieldErrors, fields });
	}

	const testEmailMessage = {
		From: 'amaro@amarokoberle.com',
		To: 'amaro@amarokoberle.com',
		Subject: 'Hello from Postmark',
		HtmlBody: '<strong>Hello</strong> dear Postmark user.',
		TextBody: 'Hello from Postmark!',
		MessageStream: 'outbound',
	};

	if (process.env.POSTMARK_API_KEY) {
		// TODO: Send email, this currently does not work
		const emailClient = new postmark.ServerClient(process.env.POSTMARK_API_KEY);
		emailClient.sendEmail(testEmailMessage).then((response) => {
			console.log(response.To);
			console.log(response.SubmittedAt);
			console.log(response.Message);
			console.log(response.MessageID);
			console.log(response.ErrorCode);
		});
		console.log('signup');
	}

	return redirect(`/`);
};

export default function LoginRoute() {
	const actionData = useActionData<ActionData>();
	return (
		<div>
			<header className='flex items-center justify-between text-xl mx-2'>
				<Link to='/nodes/'>
					<MdArrowBackIos />
				</Link>
				<h2>Login or create account</h2>
				<div className='w-4'></div>
			</header>
			<Form className='mt-4' method='post'>
				<Input
					label='Email'
					name='email'
					type='email'
					actionDataField={actionData?.fields?.email}
					actionDataFieldError={actionData?.fieldErrors?.email}
				/>
				<div>
					{actionData?.formError ? (
						<p role='alert'>{actionData.formError}</p>
					) : null}
				</div>
				<Button
					className='mt-2 w-full'
					buttonName='Send link to log in'
					buttonDescription="Or to create an account if you don't have one"
					type='submit'
					icon={<MdOutlineForwardToInbox />}
					buttonType='emphasized'
				/>
			</Form>
		</div>
	);
}
