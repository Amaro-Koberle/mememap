import { ServerClient } from 'postmark';
import type { SendEmailFunction } from 'remix-auth-email-link';
import type { User } from '@prisma/client';

interface Email {
	From: string;
	To: string;
	Subject: string;
	HtmlBody: string;
	TextBody: string;
	MessageStream: string;
}

const apiKey = process.env.POSTMARK_API_KEY;
if (!apiKey) throw new Error('Missing POSTMARK_API_KEY env variable.');
const emailClient = new ServerClient(apiKey);

export const sendEmail: SendEmailFunction<User> = async (options) => {
	const message: Email = {
		From: 'amaro@amarokoberle.com',
		To: options.emailAddress,
		Subject: `Here's your login link`,
		HtmlBody: `<html><body><p>Hi ${options.user?.name || 'there'},<br />
		<br /><a href=${options.magicLink}>Click here to login</a></p></body></html>`,
		TextBody: 'something whatever',
		MessageStream: 'outbound',
	};
	await emailClient.sendEmail(message).then((response) => {
		console.log(response.To);
		console.log(response.SubmittedAt);
		console.log(response.Message);
		console.log(response.MessageID);
		console.log(response.ErrorCode);
	});
};
