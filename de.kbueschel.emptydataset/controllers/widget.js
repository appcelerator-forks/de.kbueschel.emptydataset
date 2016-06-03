var LTAG = '[EmptyDataSet]';


/**
 * SEF function to organize otherwise inline constructor code
 *
 * @param  {Object} args arguments passed to the controller
 * @returns void
 */
(function constructor(args) {

	'use strict';


	_applyProperties(args);

	$.cleanup = cleanup;

// execute constructor with optional arguments passed to controller
})($.args);


/**
 * Cleans up the controller and view
 *
 * @public
 * @returns void
 */
function cleanup() {

	$.removeListener();
	$.destroy();
	$.off();

} // END cleanup()


/**
 * Apply properties wrapper to views
 *
 * @private
 * @param {Dictionary} properties
 * @returns void
 */
function _applyProperties(properties) {

	if (properties) {

		$.emptyDataSet.applyProperties(_.omit(properties, 'id', '__parentSymbol', '__itemTemplate', '$model', 'icon', 'message'));

		$.icon.applyProperties(properties.icon || {});

		$.message.applyProperties(properties.message || {});
	}

} // END _applyProperties()


// PUBLIC INTERFACE
exports.applyProperties = _applyProperties;

exports.show = function() {

	$.emptyDataSet.show();

}; // END show()

exports.hide = function() {

	$.emptyDataSet.hide();

}; // END hide()
