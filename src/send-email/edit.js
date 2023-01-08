import { useSelect, dispatch } from '@wordpress/data';
import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { RichText, useBlockProps } from '@wordpress/block-editor';

export default () => {
	const blockProps = useBlockProps();

	const [ content, setContent ] = useState( '' );
	const [ subject, setSubject ] = useState( '' );
	const [ isSending, setIsSending ] = useState( false );
	const currentId = useSelect( ( select ) =>
		select( 'core/editor' ).getCurrentPostId()
	);

	const handleSendEmail = () => {
		setIsSending( true );

		apiFetch( {
			path: `gemeindetag/v1/send-mail/${ currentId }?subject=${ subject }`,
			method: 'POST',
			body: content,
		} ).then( () => {
			setIsSending( false );
			setContent( '' );
			setSubject( '' );
			dispatch( 'core/notices' ).createNotice(
				'success',
				'Die Email wurde Versand!',
				{
					isDismissible: true,
					type: 'snackbar',
				}
			);
		} );
	};

	return (
		<div { ...blockProps }>
			<div className="email-wrapper">
				<RichText
					tagName="h2"
					value={ subject }
					onChange={ ( newValue ) => setSubject( newValue ) }
					placeholder="Email Betreff"
					keepPlaceholderOnFocus={ true }
				/>
				<p>Hallo [[Vorname]],</p>
				<RichText
					tagName="p"
					value={ content }
					onChange={ ( newValue ) => setContent( newValue ) }
					placeholder="Email Nachricht"
					keepPlaceholderOnFocus={ true }
				/>
			</div>
			<Button
				isPrimary={ ! isSending }
				isBusy={ isSending }
				onClick={ handleSendEmail }
			>
				Email Versenden
			</Button>
			<p className="components-form-token-field__help">
				* Der Vorname wird automatisch ausgefüllt.
			</p>
		</div>
	);
};
