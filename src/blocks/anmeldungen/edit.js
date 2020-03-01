import { Spinner, ToggleControl } from "@wordpress/components";
import { useState, useEffect } from "@wordpress/element";
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch'

export default props => {
	const {
		className,
	} = props;

	const currentId = useSelect( select => select( 'core/editor' ).getCurrentPostId() );
	const postType = useSelect( select => select('core/editor').getCurrentPostType() ) 

	const [anmeldungen, setAnmeldungen] = useState( [] );
	const [ isShowingAll, setIsShowingAll ] = useState( false );
		
	useEffect( () => {
		apiFetch( { path: `wp/v2/anmeldung?per_page=999` } ).then( anmeldungen => {
		
			const filtered = anmeldungen.filter( anmeldung => {

				const { meta } = anmeldung;

				if ( !meta[ postType ] || !Array.isArray( meta[ postType ] )) {
					return false;
				}

				if ( "storniert" === anmeldung.meta.status ) {
					return false;
				}

				return meta[ postType ].includes( currentId );

			} )
			setAnmeldungen( filtered )
		
		} );
	}, [] );

	return (
		<div className={ className }>
			<h2>Anmeldungen: { anmeldungen.length ? anmeldungen.length : '' }</h2>
			<ToggleControl 
				checked={isShowingAll}
				label="Alle anzeigen"
				help={ isShowingAll ? 'Ziegt alle Anmeldungen.' : 'Zeigt bezahlte Anmeldungen.' }
				onChange={ () => { setIsShowingAll( !isShowingAll )} }
			/>
			{ anmeldungen.length ? (
			<table className={ 'wp-list-table widefat striped tickets' }>
				<thead>
					<tr>
						<th className={ 'column-title' }>Name</th>
						<th className={ 'column-title' }>Geb. Datum</th>
						<th className={ 'column-title' }>Status</th>
					</tr>
				</thead>
				<tbody id="the-list">
				{ anmeldungen
					.filter( anmeldung => {
						if ( isShowingAll ) {
							return true;
						}
						return "bezahlt" === anmeldung.meta.status;
					})
					.map( anmeldung => { 
					const { meta: { vorname, nachname, geb_datum, status }, id } = anmeldung;
					return (
					<tr>
						<td><a href={ `http://gemeindetag.test/wp-admin/post.php?post=${id}&action=edit` } target="_blank">{ `${ vorname } ${ nachname }` }</a></td>
						<td>{ geb_datum }</td>
						<td>{ status }</td>
					</tr>
					) 
				} ) }
				</tbody>
			</table>
			) : <Spinner /> }
		</div>
	);
};
