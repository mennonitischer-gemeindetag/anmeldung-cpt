import { registerBlockType } from '@wordpress/blocks';

import edit from './edit.js';
import save from './save';
import metadata from './block.json';

registerBlockType( metadata, {
	edit,
	save,
} );
