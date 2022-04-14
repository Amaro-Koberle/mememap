import dayjs from 'dayjs';
interface Props {
	createdAt: Date;
}

export default function PostDate({ createdAt }: Props) {
	const postDate = dayjs(createdAt).format('h:m A • MMM D, YYYY');
	return <span>{postDate}</span>;
}
