import { ServerClient } from 'postmark';

interface Email {
	From: string;
	To: string;
	Subject: string;
	HtmlBody: string;
	TextBody: string;
	MessageStream: string;
}

export function sendEmail(email: Email) {
	if (process.env.POSTMARK_API_KEY) {
		// TODO: Send email, this currently does not work
		const emailClient = new ServerClient(process.env.POSTMARK_API_KEY);
		emailClient.sendEmail(email).then((response) => {
			console.log(response.To);
			console.log(response.SubmittedAt);
			console.log(response.Message);
			console.log(response.MessageID);
			console.log(response.ErrorCode);
		});
	}
}
