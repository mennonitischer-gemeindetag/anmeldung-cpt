import { useEffect, useState } from '@wordpress/element';
import { PanelBody, SelectControl, CheckboxControl, Button, IconButton, ToolbarButton, Toolbar } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { InspectorControls, BlockControls } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import ShowAnmeldung from './components/showAnmeldung';
import EditAnmeldung from './components/editAnmeldung';

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
	const [ invoice, setInvoice ] = useState( null );
	
	const invoiceId = useSelect( select => select( 'core/editor' ).getCurrentPostId() );
	const isSaving = useSelect( select => select( 'core/editor' ).isSavingPost() );

	const query = { per_page: -1 };
	
	const allAusfluege = useSelect( ( select ) => select( 'core' ).getEntityRecords( 'postType', 'ausfluege', query ) );
	const allWorkshops = useSelect( ( select ) => select( 'core' ).getEntityRecords( 'postType', 'workshops', query ) );
	const allEssen = useSelect( ( select ) => select( 'core' ).getEntityRecords( 'postType', 'essen', query ) );
	const allTickets = useSelect( ( select ) => select( 'core' ).getEntityRecords( 'postType', 'tickets', query ) );
	const allKinderprogramm = useSelect( ( select ) => select( 'core' ).getEntityRecords( 'postType', 'kinderprogramm', query ) );

	useEffect( () => {
		apiFetch( { path: `/gemeindetag/v1/invoice/${ invoiceId }` } )
			.then( invoice => {
				setInvoice( invoice );
				setIsLoading( false );
			})
			.catch( error => console.error( error ) );
	}, [invoiceId] );

	useEffect( () => {
		if (isSaving) {
			setAttributes( { isEditing: false } );
		}
	}, [isSaving] )

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
					<ToolbarButton 
						icon={ 'edit' }
						onClick={ toggleEditMode }
						isActive={ isEditing }
					/>
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
						isBusy={ isSendingInvoiceEmail } 
						onClick={ handleSendInvoice }
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
						isBusy={ isSendingPaymentEmail } 
						onClick={ handleSendPaymentConfirmation }
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
