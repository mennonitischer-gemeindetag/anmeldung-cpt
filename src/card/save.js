import { InnerBlocks } from '@wordpress/block-editor';

export default ( props ) => {
	const {
		className,
		attributes: { image },
	} = props;
	return (
		<div className={ className }>
			<img src={ image.url } alt={ image.alt } />
			<div className="card-content">
				<InnerBlocks.Content />
			</div>
		</div>
	);
};
