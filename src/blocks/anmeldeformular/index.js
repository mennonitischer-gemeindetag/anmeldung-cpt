/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

import icon from './icon';
import ServerRenderAnmeldung from './ServerRenderAnmeldung';

import Anmeldeformular from './Anmeldeformular';
import ErrorBoundary from './components/ErrorBoundary';

registerBlockType( 'gemeindetag/anmeldeformular', {
	title: 'Anmeldeformular',
	icon,
	description: 'Anmeldung',
	category: 'common',
	supports: {
		align: [ 'wide', 'full' ],
		multiple: false,
	},

	edit: ( props ) => {
		const { className } = props;
		return (
			<div className={ className }>
				<Anmeldeformular />
			</div>
		);
	}, // end edit

	save: ( props ) => {
		return <ServerRenderAnmeldung className={ props.className } />;
	},
} );
