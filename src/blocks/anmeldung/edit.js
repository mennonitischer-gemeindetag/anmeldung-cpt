import { useEffect, useState } from '@wordpress/element';
import { Spinner, PanelBody, SelectControl, CheckboxControl } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { InspectorControls } from '@wordpress/editor';
import { useSelect } from '@wordpress/data';
import { Document } from 'react-pdf';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${ pdfjs.version }/pdf.worker.js`;

import { Status, base64ToArrayBuffer } from '../../widgets/helper';

export default ( props ) => {
	const {
		attributes: {
			vorname,
			nachname,
			geschlecht,
			adresse_ort,
			adresse_plz,
			adresse_straße,
			geb_datum,
			telefon,
			email,
			teilnahmetage,
			mitarbeit,
			kinderprogramm,
			kinderprogramm_bemerkung,
			kinderprogramm_notfall_nummer,
			workshops,
			ausfluege,
			verpflegung,
			status,
			betrag,
			gedrucktes_liederheft,
			gedrucktes_programmheft,
			daten_fuer_mitfahrgelegenheit_teilen,
	  		zahlungsbestaetigung_versand,
	  		rechnung_versand,
		},
		className,
		setAttributes,
	} = props;

	const [ isLoading, setIsLoading ] = useState( true );
	const [ allWorkshops, setWorkshops ] = useState( [] );
	const [ allAusfluege, setAusfluege ] = useState( [] );
	const [ allEssen, setEssen ] = useState( [] );
	const [ allTickets, setTickets ] = useState( [ true ] );
	const [ allKinderprogramm, setKinderprogramm ] = useState( [ true ] );
	const [ invoice, setInvoice ] = useState( null );
	const invoiceId = useSelect( ( select ) =>
		select( 'core/editor' ).getCurrentPostId()
	);

	useEffect( () => {
		Promise.all( [
			apiFetch( { path: 'wp/v2/workshops?per_page=100' } ),
			apiFetch( { path: 'wp/v2/ausfluege?per_page=100' } ),
			apiFetch( { path: 'wp/v2/essen?per_page=100' } ),
			apiFetch( { path: 'wp/v2/tickets?per_page=100' } ),
			apiFetch( { path: '/wp/v2/kinderprogramm?per_page=100' } ),
			apiFetch( { path: `/gemeindetag/v1/invoice/${ invoiceId }` } ),
		] )
			.then(
				( [ workshops, ausfleuege, essen, tickets, kinderprogramm, invoice ] ) => {
					setWorkshops( workshops );
					setAusfluege( ausfleuege );
					setEssen( essen );
					setTickets( tickets );
					setKinderprogramm( kinderprogramm );
					setInvoice( invoice );
					setIsLoading( false );
				}
			)
			.catch( ( error ) => console.error( error ) );
	}, [] );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ 'Status' }>
					<p>Betrag: { betrag } €</p>
					<SelectControl
						label="Status"
						value={ status }
						options={ Object.keys( Status ).reduce( ( acc, status ) => {
							return [ ...acc, { value: Status[ status ], label: Status[ status ] } ];
						}, [] ) }
						onChange={ ( status ) => {
							setAttributes( { status } );
						} }
					/>
					<br />
					<CheckboxControl
						label="Rechnung Versand"
						checked={ !! rechnung_versand }
						onChange={ () => {} }
					/>
					<CheckboxControl
						label="Zahlungsbestätigung Versand"
						checked={ !! zahlungsbestaetigung_versand }
						onChange={ () => {} }
					/>
				</PanelBody>
			</InspectorControls>
			<div className={ className }>
				<div className={ 'personal-info' }>
					<h2>Persönliche Infos:</h2>
					<p>
						{ `${ vorname } ${ nachname }` }
						<br />
						{ `${ adresse_straße }` }
						<br />
						{ `${ adresse_plz } ${ adresse_ort }` }
					</p>
					<p>
						{ !! geschlecht && (
							<>
								{ `Geschlecht: ${ geschlecht }` }
								<br />
							</>
						) }
						{ `Geburtstag: ${ geb_datum }` }
						<br />
						{ !! telefon && (
							<>
								{ `Telefon: ${ telefon }` }
								<br />
							</>
						) }
            Email: <a href={ `mailto:${ email }` }>{ email }</a>
					</p>
				</div>
				{ !! teilnahmetage && !! teilnahmetage.length && (
					<div className={ 'teilnahmetage' }>
						<h2>Teilnahmetage</h2>
						{ isLoading ? (
							<Spinner />
						) : (
							<ul>
								{ allTickets
									.filter( ( ticket ) => teilnahmetage.includes( ticket.id ) )
									.reverse()
									.map( ( ticket ) => (
										<li
											key={ ticket.id }
											dangerouslySetInnerHTML={ {
												__html: `${ ticket.title.rendered }`,
											} }
										/>
									) ) }
							</ul>
						) }
					</div>
				) }
				{ !! mitarbeit && !! mitarbeit.length && (
					<div className={ 'mitarbeit' }>
						<h2>Mitarbeit</h2>
						<ul>
							{ mitarbeit.map( ( tag ) => (
								<li key={ tag.id }>{ tag }</li>
							) ) }
						</ul>
					</div>
				) }
				{ !! workshops && !! workshops.length && (
					<div className={ 'workshops' }>
						<h2>Workshops</h2>
						{ isLoading ? (
							<Spinner />
						) : (
							<ul>
								{ allWorkshops
									.filter( ( workshop ) => workshops.includes( workshop.id ) )
									.reverse()
									.map( ( workshop ) => (
										<li
											key={ workshop.id }
											dangerouslySetInnerHTML={ {
												__html: `${ workshop.meta.character }${ workshop.meta.nr } - ${ workshop.title.rendered }`,
											} }
										/>
									) ) }
							</ul>
						) }
					</div>
				) }
				{ !! ausfluege && !! ausfluege.length && (
					<div className={ 'ausfluege' }>
						<h2>Ausflüge</h2>
						{ isLoading ? (
							<Spinner />
						) : (
							<ul>
								{ allAusfluege
									.filter( ( ausflug ) => ausfluege.includes( ausflug.id ) )
									.reverse()
									.map( ( ausflug ) => (
										<li
											key={ ausflug.id }
											dangerouslySetInnerHTML={ {
												__html: `${ ausflug.meta.character }${ ausflug.meta.nr } - ${ ausflug.title.rendered }`,
											} }
										/>
									) ) }
							</ul>
						) }
					</div>
				) }
				{ !! verpflegung && !! verpflegung.length && (
					<div className={ 'verpflegung' }>
						<h2>Verpflegung</h2>
						{ isLoading ? (
							<Spinner />
						) : (
							<ul>
								{ allEssen
									.filter( ( essem ) => verpflegung.includes( essem.id ) )
									.reverse()
									.map( ( essem ) => (
										<li
											dangerouslySetInnerHTML={ {
												__html: `${ essem.title.rendered }`,
											} }
										/>
									) ) }
							</ul>
						) }
					</div>
				) }

				{ !! kinderprogramm && !! kinderprogramm.length && (
					<div className={ 'kinderprogramm' }>
						<h2>Kinderprogramm</h2>
						{ isLoading ? (
							<Spinner />
						) : (
							<>
								<ul>
									{ allKinderprogramm
										.filter( ( programm ) => kinderprogramm.includes( programm.id ) )
										.reverse()
										.map( ( programm ) => (
											<li
												dangerouslySetInnerHTML={ {
													__html: `${ programm.title.rendered }`,
												} }
											/>
										) ) }
								</ul>
								{ !! kinderprogramm_bemerkung && (
									<>
										<h3>Bemerkung:</h3>
										<p>{ kinderprogramm_bemerkung }</p>
									</>
								) }
								{ !! kinderprogramm_notfall_nummer && (
									<>
										<h3>Notfall Nummer:</h3>
										<p>{ kinderprogramm_notfall_nummer }</p>
									</>
								) }
							</>
						) }
					</div>
				) }
				{ isLoading ? (
					<Spinner />
				) : (
					<>
						<h2>Rechnung</h2>
						<object
							height={ '850px' }
							width={ '100%' }
							style={ { border: '5px solid #7B7B7B' } }
							data={ URL.createObjectURL(
								new Blob( [ base64ToArrayBuffer( invoice ) ], {
									type: 'application/pdf',
								} )
							) }
						>
              Rechnungs PDF
						</object>
					</>
				) }
			</div>
		</>
	);
};
