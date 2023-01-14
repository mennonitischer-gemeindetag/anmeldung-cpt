import { registerBlockType } from '@wordpress/blocks';

import metadata from './block.json';
import { BlockEdit } from './edit.tsx';
import { ServerRenderAnmeldung } from './save.tsx';

import './style.css';

registerBlockType( metadata, {
	edit: BlockEdit,
	save: ServerRenderAnmeldung,
} );
