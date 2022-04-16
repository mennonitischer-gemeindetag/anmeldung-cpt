/* eslint-disable camelcase */
import { Spinner, ToggleControl } from '@wordpress/components';
import { useBlockProps } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

export default function BlockEdit() {
	const blockProps = useBlockProps();

	const currentId = useSelect( ( select ) =>
		select( 'core/editor' ).getCurrentPostId()
	);
	const postType = useSelect( ( select ) =>
		select( 'core/editor' ).getCurrentPostType()
	);
	const site = useSelect( ( select ) => select( 'core' ).getSite() );

	const anmeldungen = useSelect( ( select ) =>
		select( 'core' ).getEntityRecords( 'postType', 'anmeldung', {
			per_page: -1,
		} )
	);

	const [ isShowingAll, setIsShowingAll ] = useState( false );

	const filtered =
		Array.isArray( anmeldungen ) &&
		anmeldungen.filter( ( anmeldung ) => {
			const { meta } = anmeldung;

			if ( ! meta[ postType ] || ! Array.isArray( meta[ postType ] ) ) {
				return false;
			}

			if ( 'storniert' === anmeldung.meta.status ) {
				return false;
			}

			return meta[ postType ].includes( currentId );
		} );

	return (
		<>
			<div { ...blockProps }>
				<h2>Anmeldungen: { filtered.length ? filtered.length : '' }</h2>
				<ToggleControl
					checked={ isShowingAll }
					label="Alle anzeigen"
					help={
						isShowingAll
							? 'Ziegt alle Anmeldungen.'
							: 'Zeigt bezahlte Anmeldungen.'
					}
					onChange={ () => {
						setIsShowingAll( ! isShowingAll );
					} }
				/>
				{ filtered.length ? (
					<table
						className={ 'wp-list-table widefat striped tickets' }
					>
						<thead>
							<tr>
								<th className={ 'column-title' }>Name</th>
								<th className={ 'column-title' }>Geb. Datum</th>
								<th className={ 'column-title' }>Status</th>
								{ 'kinderprogramm' === postType ? (
									<th className={ 'column-title' }>
										Notfall Nummer:
									</th>
								) : null }
								{ 'kinderprogramm' === postType ? (
									<th className={ 'column-title' }>
										Bemerkung:
									</th>
								) : null }
							</tr>
						</thead>
						<tbody id="the-list">
							{ filtered
								.filter( ( anmeldung ) => {
									if ( isShowingAll ) {
										return true;
									}
									return 'bezahlt' === anmeldung.meta.status;
								} )
								.map( ( anmeldung ) => {
									const {
										meta: {
											vorname,
											nachname,
											geb_datum,
											status,
											kinderprogramm_bemerkung,
											kinderprogramm_notfall_nummer,
										},
										id,
									} = anmeldung;
									return (
										<tr key={ anmeldung.id }>
											<td>
												<a
													href={ `${
														site && site.url
													}/wp-admin/post.php?post=${ id }&action=edit` }
													target="_blank"
													rel="noreferrer"
												>{ `${ vorname } ${ nachname }` }</a>
											</td>
											<td>{ geb_datum }</td>
											<td>{ status }</td>
											{ 'kinderprogramm' === postType ? (
												<td>
													{
														kinderprogramm_notfall_nummer
													}
												</td>
											) : null }
											{ 'kinderprogramm' === postType ? (
												<td>
													{ kinderprogramm_bemerkung }
												</td>
											) : null }
										</tr>
									);
								} ) }
						</tbody>
					</table>
				) : (
					<Spinner />
				) }
			</div>
		</>
	);
}
