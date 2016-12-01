var LTAG = '[de.kbueschel.emptydataset]',
	BUTTON_ICON_MIN_WIDTH = 36,
	BUTTON_PADDING = 40;

	
/**
 * SEF to organize otherwise inline code
 *
 * @private
 * @param  {Object} args arguments passed to the controller
 * @returns void
 */
(function constructor(args) {
	
	'use strict';
	
	
	// call super constructor
	$.super && $.super.constructor(args);
	
	$._isIconButton = false;
	
	Object.defineProperties($, {
		
		visible: {
			
			get: _getVisible,
			set: _setVisible
		},
		
		title: {
			
			set: function(title) {
				
				if (title === $.title) return;
				
				$.titleLabel.applyProperties({
					
					text: null
				});
				
				if (_.isObject(title)) {
					
					$.titleLabel.applyProperties(title);
				}
				else {
					
					$.titleLabel.setHtml(title);
				}
				
				$.titleLabel.getView()[title ? 'show' : 'hide']();
			},
			
			get: function() {
				
				return $.titleLabel.getHtml() || $.titleLabel.getView().getText();
			}
		},
		
		description: {
			
			set: function(description) {
				
				if (description === $.description) return;
				
				$.descriptionLabel.applyProperties({
					
					text: null
				});
				
				if (_.isObject(description)) {
					
					$.descriptionLabel.applyProperties(description);
				}
				else {
					
					$.descriptionLabel.setHtml(description);
				}
				
				$.descriptionLabel.getView()[description ? 'show' : 'hide']();
			},
			
			get: function() {
				
				return $.descriptionLabel.getHtml() || $.descriptionLabel.getView().getText();
			}
		},
		
		icon: {
			
			set: function(icon) {
				
				if (icon === $.icon) return;
				
				$.iconLabel.setText(icon);
				icon && $.imageView.hide() && $.iconLabel.show();
			},
			
			get: function() {
				
				return $.iconLabel.getText();
			}
		},
		
		image: {
			
			set: function(image) {
				
				if (image === $.image) return;
				
				$.imageView.setImage(image);
				image && $.iconLabel.hide() && $.imageView.show();
			},
			
			get: function() {
				
				return $.imageView.getImage();
			}
		},
		
		buttonImage: {
			
			set: function(image) {
				
				Ti.API.debug(LTAG, 'Update button image to [', image, ']');
				

				$._isIconButton = false;
				$.removeClass($.button, 'emptyDataSet__button--iconButton');
				$.button.setImage(image);
				
				if (image) {

					$.button.setWidth($.button.toImage().width + BUTTON_PADDING);
					$.buttonContainer.show();
				}
				else {
					
					$.buttonContainer.hide();
				}
			}
		},
		
		buttonIcon: {
			
			set: function(icon) {
				
				Ti.API.debug(LTAG, 'Update button icon to [', icon, ']');
				
				
				$._isIconButton = !!icon;
				
				icon && $.addClass($.button, 'emptyDataSet__button--iconButton');
				icon || $.removeClass($.button, 'emptyDataSet__button--iconButton');
				
				if (_.isObject(icon)) {
					
					$.button.applyProperties(icon);
				}
				else {
					
					$.button.setTitle(icon);
				}
				
				if (icon) {
					
					$.button.setWidth(Math.max($.button.toImage().width, BUTTON_ICON_MIN_WIDTH));
					
					$.buttonContainer.show();
				}
				else {
					
					$.buttonContainer.hide();
				}
			}
		},
		
		buttonTitle: {
			
			set: function(title) {
				
				Ti.API.debug(LTAG, 'Update button title to [', title, ']');
				
				
				$.removeClass($.button, 'emptyDataSet__button--iconButton');
				$._isIconButton = false;
				
				if (_.isObject(title)) {
					
					$.button.applyProperties(title);
				}
				else {
					
					$.button.setTitle(title);
				}
				
				if (title) {
					
					$.button.setWidth($.button.toImage().width + BUTTON_PADDING);
					
					$.buttonContainer.show();
				}
				else {
					
					$.buttonContainer.hide();
				}
			}
		},
		
		backgroundColor: {
			
			set: function(color) {
				
				$.emptyDataSetView.setBackgroundColor(color);
			}
		},
		
		showLoading: {
			
			set: function(shouldShow) {
				
				if (shouldShow) {
					
					$.button.hide();
					$.loading.show();
				}
				else {

					$.loading.hide();
					$.button.show();
				}
			}
		}
	});
	
	
	// PUBLIC INTERFACE
	$.cleanup = cleanup;

})($.args);


/**
 * Cleans up the controller and view
 *
 * @public
 * @method cleanup
 * @returns void
 */
function cleanup() {
	
	'use strict';
	
	
	Ti.API.debug(LTAG, 'Cleaning up...');
	
	
	// call super cleanup
	$.super && $.super.cleanup();
	
	$.removeListener();
	$.destroy();
	$.off();
	
} // END cleanup()


function _getVisible() {
	
	return $.emptyDataSetView.getVisible() && $.emptyDataSetView.opacity > 0;
	
} // END _getVisible()


function _setVisible(visible) {
	
	visible = _.isUndefined(visible) || !!visible;
	
	$.emptyDataSetView.setVisible(visible);
	
	if (visible) {
		
		var _afterFadeIn = function() {
			
			$.emptyDataSetView.setOpacity(1.0);
		};
		
		$.fadeInOnDisplay && _.defer(function() {
			
			require('alloy/animation').fadeIn($.emptyDataSetView, 250, _afterFadeIn);
		});
		
		$.fadeInOnDisplay || _afterFadeIn();
	}
	
} // END _setVisible()


/**
 * Handles button click
 *
 * @private
 * @param {Object} event
 * @returns void
 */
var handleButtonClick = _.debounce(function _handleButtonClick(event) {
	
	$.trigger('buttonClick', event);
	
}, 750, true); // END handleButtonClick()
