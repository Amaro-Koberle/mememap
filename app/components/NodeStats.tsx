import dayjs from 'dayjs';
import type { Node, Link as NodeLink } from '@prisma/client';

interface Props {
	node: Node;
	inLinks: NodeLink[];
	outLinks: NodeLink[];
}

export default function NodeStats({ node, inLinks, outLinks }: Props) {
	const postDate = dayjs(node.createdAt).format('h:m A • MMM D, YYYY');
	return (
		<div className='text-stone-500 text-sm flex justify-between mt-2'>
			<span>{postDate}</span>
			<span>{`In ${inLinks.length} • Out ${outLinks.length}`}</span>
		</div>
	);
}
