import { PanelBody } from '@wordpress/components';
import { InspectorControls } from '@wordpress/editor';
import {
	InnerBlocks,
	MediaPlaceholder,
	PanelColorSettings,
} from '@wordpress/block-editor';

export default function BlockEdit( props ) {
	const {
		attributes: { image, color },
		className,
		setAttributes,
	} = props;

	return (
		<>
			<InspectorControls>
				<PanelBody title={ 'Status' }></PanelBody>
				<PanelColorSettings
					title={ 'Color Settings' }
					colorSettings={ [
						{
							value: color,
							onChange: ( value ) => {
								if ( value === undefined ) {
									setAttributes( { pointColor: '#000000' } );
								} else {
									setAttributes( { color: value } );
								}
							},
							label: 'Background Color',
						},
					] }
				/>
			</InspectorControls>
			<div className={ className }>
				{ image ? (
					<img src={ image.url } alt={ image.alt } />
				) : (
					<MediaPlaceholder
						onSelect={ ( value ) => {
							setAttributes( { image: value } );
						} }
						allowedTypes={ [ 'image' ] }
						multiple={ false }
					/>
				) }

				<div className="card-content">
					<InnerBlocks />
				</div>
			</div>
		</>
	);
}
