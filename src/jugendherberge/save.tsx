import { useBlockProps } from '@wordpress/block-editor';

export const ServerRenderAnmeldung = () => (
	<div { ...useBlockProps.save() }>
		<noscript>
			Um den vollen Funktionsumfang dieser Webseite zu erfahren, benötigen
			Sie JavaScript. Hier finden Sie die{ ' ' }
			<a href="https://www.enable-javascript.com/de/">
				Anleitung wie Sie JavaScript in Ihrem Browser einschalten
			</a>
			.
		</noscript>
	</div>
);
