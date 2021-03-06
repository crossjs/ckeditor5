/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module image/image/converters
 */

import { first } from 'ckeditor5/src/utils';

/**
 * Returns a function that converts the image view representation:
 *
 *		<figure class="image"><img src="..." alt="..."></img></figure>
 *
 * to the model representation:
 *
 *		<imageBlock src="..." alt="..."></imageBlock>
 *
 * The entire content of the `<figure>` element except the first `<img>` is being converted as children
 * of the `<imageBlock>` model element.
 *
 * @param {module:image/imageutils~ImageUtils} imageUtils
 * @returns {Function}
 */
export function viewFigureToModel( imageUtils ) {
	return dispatcher => {
		dispatcher.on( 'element:figure', converter );
	};

	function converter( evt, data, conversionApi ) {
		// Do not convert if this is not an "image figure".
		if ( !conversionApi.consumable.test( data.viewItem, { name: true, classes: 'image' } ) ) {
			return;
		}

		// Find an image element inside the figure element.
		const viewImage = imageUtils.getViewImageFromWidget( data.viewItem );

		// Do not convert if image element is absent, is missing src attribute or was already converted.
		if ( !viewImage || !viewImage.hasAttribute( 'src' ) || !conversionApi.consumable.test( viewImage, { name: true } ) ) {
			return;
		}

		// Convert view image to model image.
		const conversionResult = conversionApi.convertItem( viewImage, data.modelCursor );

		// Get image element from conversion result.
		const modelImage = first( conversionResult.modelRange.getItems() );

		// When image wasn't successfully converted then finish conversion.
		if ( !modelImage ) {
			return;
		}

		// Convert rest of the figure element's children as an image children.
		conversionApi.convertChildren( data.viewItem, modelImage );

		conversionApi.updateConversionResult( modelImage, data );
	}
}

/**
 * Converter used to convert the `srcset` model image attribute to the `srcset`, `sizes` and `width` attributes in the view.
 *
 * @param {module:image/imageutils~ImageUtils} imageUtils
 * @param {'imageBlock'|'imageInline'} imageType The type of the image.
 * @returns {Function}
 */
export function srcsetAttributeConverter( imageUtils, imageType ) {
	return dispatcher => {
		dispatcher.on( `attribute:srcset:${ imageType }`, converter );
	};

	function converter( evt, data, conversionApi ) {
		if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
			return;
		}

		const writer = conversionApi.writer;
		const element = conversionApi.mapper.toViewElement( data.item );
		const img = imageUtils.getViewImageFromWidget( element );

		if ( data.attributeNewValue === null ) {
			const srcset = data.attributeOldValue;

			if ( srcset.data ) {
				writer.removeAttribute( 'srcset', img );
				writer.removeAttribute( 'sizes', img );

				if ( srcset.width ) {
					writer.removeAttribute( 'width', img );
				}
			}
		} else {
			const srcset = data.attributeNewValue;

			if ( srcset.data ) {
				writer.setAttribute( 'srcset', srcset.data, img );
				// Always outputting `100vw`. See https://github.com/ckeditor/ckeditor5-image/issues/2.
				writer.setAttribute( 'sizes', '100vw', img );

				if ( srcset.width ) {
					writer.setAttribute( 'width', srcset.width, img );
				}
			}
		}
	}
}

/**
 * Converter used to convert a given image attribute from the model to the view.
 *
 * @param {module:image/imageutils~ImageUtils} imageUtils
 * @param {'imageBlock'|'imageInline'} imageType The type of the image.
 * @param {String} attributeKey The name of the attribute to convert.
 * @returns {Function}
 */
export function modelToViewAttributeConverter( imageUtils, imageType, attributeKey ) {
	return dispatcher => {
		dispatcher.on( `attribute:${ attributeKey }:${ imageType }`, converter );
	};

	function converter( evt, data, conversionApi ) {
		if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
			return;
		}

		const viewWriter = conversionApi.writer;
		const element = conversionApi.mapper.toViewElement( data.item );
		const img = imageUtils.getViewImageFromWidget( element );

		viewWriter.setAttribute( data.attributeKey, data.attributeNewValue || '', img );
	}
}
