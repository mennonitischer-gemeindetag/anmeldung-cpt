/* eslint-disable @wordpress/no-unsafe-wp-apis */
import { useBlockProps } from '@wordpress/block-editor';
import { useEntityProp } from '@wordpress/core-data';
import {
	__experimentalNumberControl as NumberControl,
	Placeholder,
	Flex,
} from '@wordpress/components';

export default () => {
	const blockProps = useBlockProps();

	const [ meta, setMeta ] = useEntityProp( 'postType', 'tickets', 'meta' );

	return (
		<div { ...blockProps }>
			<Placeholder label="Ticket Preise">
				<Flex gap={ 4 } justify="start">
					<NumberControl
						label="Erwachsene"
						value={ meta?.price_adult }
						onChange={ ( value ) => {
							setMeta( { ...meta, price_adult: value } );
						} }
						size="__unstable-large"
						spinControls="none"
						style={ { width: '85px' } }
						suffix="€"
						required={ true }
					/>
					<NumberControl
						label="Teenager"
						value={ meta?.price_teen }
						onChange={ ( value ) => {
							setMeta( { ...meta, price_teen: value } );
						} }
						size="__unstable-large"
						spinControls="none"
						style={ { width: '85px' } }
						suffix="€"
						required={ true }
					/>
					<NumberControl
						label="Kinder"
						value={ meta?.price_kid }
						onChange={ ( value ) => {
							setMeta( { ...meta, price_kid: value } );
						} }
						size="__unstable-large"
						spinControls="none"
						style={ { width: '85px' } }
						suffix="€"
						required={ true }
					/>
				</Flex>
			</Placeholder>
		</div>
	);
};
