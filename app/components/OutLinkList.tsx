import { useState } from 'react';
import { Link } from 'remix';

import { MdOutlineMoreVert } from 'react-icons/md';
import { MdNavigateNext } from 'react-icons/md';
import { MdNavigateBefore } from 'react-icons/md';

import type { Link as LinkPost } from '@prisma/client';

interface Props {
	outLinks: LinkPost[];
	summonLinkDetailsModal: (link: LinkPost) => void;
}

export default function OutLinkList({
	outLinks,
	summonLinkDetailsModal,
}: Props) {
	const [currentSlide, setCurrentSlide] = useState(1);

	const linksPerSlide = 4;
	const numberOfOutLinks = outLinks.length;
	const numberOfSlides = Math.ceil(numberOfOutLinks / linksPerSlide);
	const indexOfLastLinkOnSlide = currentSlide * linksPerSlide;
	const indexOfFirstLinkOnSlide = indexOfLastLinkOnSlide - linksPerSlide;
	const linksOnCurrentSlide = outLinks.slice(
		indexOfFirstLinkOnSlide,
		indexOfLastLinkOnSlide
	);

	if (currentSlide > numberOfSlides || currentSlide < 1) {
		setCurrentSlide(1);
	}

	return (
		<div>
			{numberOfSlides != 1 ? (
				<div className='flex justify-between text-xl'>
					<button
						onClick={() => {
							setCurrentSlide(currentSlide - 1);
						}}
						disabled={currentSlide <= 1}>
						<MdNavigateBefore />
					</button>
					<span className='text-sm text-stone-500'>{`${currentSlide}/${numberOfSlides}`}</span>
					<button
						onClick={() => {
							setCurrentSlide(currentSlide + 1);
						}}
						disabled={currentSlide >= numberOfSlides}>
						<MdNavigateNext />
					</button>
				</div>
			) : null}
			<ul>
				{linksOnCurrentSlide.map((link) => (
					<li key={link.id}>
						<div className='rounded-xl bg-stone-300 mt-2 w-full flex items-center'>
							<Link to={`/nodes/${link.targetNodeId}`} className='p-3 w-full'>
								<span>{link.name}</span>
							</Link>
							<button
								className='flex items-center space-x-3 pr-3'
								onClick={() => {
									summonLinkDetailsModal(link);
								}}>
								<hr className='border-l h-8 border-stone-400' />
								<MdOutlineMoreVert className='text-xl' />
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
