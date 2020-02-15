import {
Spinner
} from "@wordpress/components";
import { useState, useEffect } from "@wordpress/element";
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch'


export default props => {
const {
	className,
} = props;

const currentId = useSelect( select =>
	select( 'core/editor' ).getCurrentPostId() );
const postType = useSelect( select => select('core/editor').getCurrentPostType() ) 

const [anmeldungen, setAnmeldungen] = useState( [] );
	
useEffect( () => {
	apiFetch( { path: `wp/v2/anmeldung?per_page=999` } ).then( anmeldungen => {
	
		const filtered = anmeldungen.filter( anmeldung => {

			const { meta } = anmeldung;

			if ( !meta[ postType ] || !Array.isArray( meta[ postType ] )) {
				return false;
			}

			return meta[ postType ].includes( currentId );

		} )
		setAnmeldungen( filtered )
	
	} );
}, [] );

return (
	<div className="anmeldungen">
		<h2>Anmeldungen: { anmeldungen.length ? anmeldungen.length : '' }</h2>
		{ anmeldungen.length ? (
		<table className={ 'wp-list-table widefat striped tickets' }>
			<thead>
				<tr>
					<th className={ 'column-title' }>Name</th>
					<th className={ 'column-title' }>Geb. Datum</th>
				</tr>
			</thead>
			<tbody id="the-list">
			{ anmeldungen
				.map( anmeldung => { 
				const { meta: { vorname, nachname, geb_datum }, id } = anmeldung;
				return (
				<tr>
					<td><a href={ `http://gemeindetag.test/wp-admin/post.php?post=${id}&action=edit` } target="_blank">{ `${ vorname } ${ nachname }` }</a></td>
					<td>{ geb_datum }</td>
				</tr>
				) 
			} ) }
			</tbody>
		</table>
		) : <Spinner /> }
	</div>
);
};
