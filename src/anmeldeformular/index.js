/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';

import icon from './icon';
import ServerRenderAnmeldung from './ServerRenderAnmeldung';
import metadata from './block.json';

import Anmeldeformular from './Anmeldeformular';

registerBlockType(metadata, {
	icon,
	edit: function BlockEdit() {
		const blockProps = useBlockProps();
		return (
			<div {...blockProps}>
				<Anmeldeformular />
			</div>
		);
	},
	save: (props) => {
		return <ServerRenderAnmeldung className={props.className} />;
	},
});
