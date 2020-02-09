import { useEffect, useState } from '@wordpress/element';
import { PanelBody, SelectControl, CheckboxControl, Button, IconButton, ToolbarButton, Toolbar } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { InspectorControls, BlockControls } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import ShowAnmeldung from './components/showAnmeldung';
import EditAnmeldung from './components/editAnmelding';

import { Status } from '../../widgets/helper';

export default ( props ) => {
	const {
		attributes: {
			status,
			betrag,
	  		zahlungsbestaetigung_versand,
			rechnung_versand,
			isEditing
		},
		className,
		setAttributes,
	} = props;

	const [ isLoading, setIsLoading ] = useState( true );
	const [ isSendingInvoiceEmail, setIsSendingInvoiceEmail ] = useState( false );
	const [ isSendingPaymentEmail, setIsSendingPaymentEmail ] = useState( false );
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

	const handleSendInvoice = () => {
		setIsSendingInvoiceEmail(true);
		apiFetch( { 
			path: `gemeindetag/v1/send-invoice/${invoiceId}`, 
			method: 'POST', 
		} ).then( response => {
			setIsSendingInvoiceEmail(false);
			console.log( response );
		} )
	}

	const handleSendPaymentConfirmation = () => {
		setIsSendingPaymentEmail(true);
		apiFetch( { 
			path: `gemeindetag/v1/send-payment-confirmation/${invoiceId}`, 
			method: 'POST', 
		} ).then( response => {
			setIsSendingPaymentEmail(false);
			console.log( response );
		} )
	}

	const toggleEditMode = () => setAttributes( { isEditing: !isEditing } );

	return (
		<>
			<BlockControls>
				<Toolbar>
					<ToolbarButton icon={ 'edit' } onClick={ toggleEditMode } isActive={isEditing} />
				</Toolbar>
			</BlockControls>
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
				</PanelBody>
				<PanelBody title={ 'Emails' }>
					<CheckboxControl
						label="Rechnung Versand"
						checked={ !! rechnung_versand }
						onChange={ () => {} }
						/>
					<p><Button 
						isPrimary
						isBusy={isSendingInvoiceEmail} 
						onClick={handleSendInvoice}
						>
						{ rechnung_versand ? 'Rechnung erneut versenden' : 'Rechnung versenden' }
					</Button></p>

					<CheckboxControl
						label="Zahlungsbestätigung Versand"
						checked={ !! zahlungsbestaetigung_versand }
						onChange={ () => {} }
						/>
					<p><Button 
						isPrimary
						isBusy={isSendingPaymentEmail} 
						onClick={handleSendPaymentConfirmation}
						>
						{ 
						zahlungsbestaetigung_versand ? 
						'Zahlungsbestätigung erneut versenden':
						'Zahlungsbestätigung versenden' 
					}
					</Button></p>
				</PanelBody>
			</InspectorControls>
			<div className={ className } >
				{ isEditing ? 
					<EditAnmeldung 
						{ ...props } 
						allAusfluege={ allAusfluege } 
						allEssen={ allEssen } 
						allKinderprogramm={ allKinderprogramm } 
						allTickets={ allTickets } 
						allWorkshops={ allWorkshops }
						isLoading={ isLoading }
						invoice={ invoice }
					/>
				:
					<ShowAnmeldung 
						{ ...props } 
						allAusfluege={ allAusfluege } 
						allEssen={ allEssen } 
						allKinderprogramm={ allKinderprogramm } 
						allTickets={ allTickets } 
						allWorkshops={ allWorkshops }
						isLoading={ isLoading }
						invoice={ invoice }
					/>
				}
			</div>
		</>
	);
};
