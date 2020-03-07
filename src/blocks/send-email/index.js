import { registerBlockType } from '@wordpress/blocks';

import edit from './edit';
import save from './save';

registerBlockType( 'gemeindetag/send-email', {
    title: "Email",
    category: "common",
    icon: "email",
	edit,
	save,
} );
