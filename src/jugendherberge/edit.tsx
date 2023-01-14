import { useBlockProps } from '@wordpress/block-editor';

import { Anmeldeformular } from './Anmeldeformular';

export function BlockEdit() {
	const blockProps = useBlockProps();
	return (
		<div { ...blockProps }>
			<Anmeldeformular />
		</div>
	);
}
