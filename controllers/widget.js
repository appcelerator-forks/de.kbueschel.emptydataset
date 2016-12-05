var LTAG = '[de.kbueschel.emptydataset]';


/**
 * SEF function to organize otherwise inline code
 *
 * @private
 * @param  {Object} args arguments passed to the controller
 * @returns void
 */
(function constructor(args) {
	
	'use strict';
	
	
	// variable declaration
	$._dataSource = null;
	$._delegate = null;
	$._collection = null;
	$.__emptyDataSetView = null;
	
	Object.defineProperties($, {
		
		dataSource: {
			
			set: _setDataSource
		},
		
		delegate: {
			
			set: _setDelegate
		},
		
		collection: {
			
			set: _setCollection
		},
		
		_emptyDataSetView: {
			
			set: _setEmptyDataSetView,
			get: _getEmptyDataSetView
		},
		
		isVisible: {
			
			get: function() {
				
				return $._emptyDataSetView && $._emptyDataSetView.visible;
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
 * @returns void
 */
function cleanup() {
	
	Ti.API.debug(LTAG, 'Cleaning up...');
	
	
	$._collection && $._collection.off(null, _reload);
	
	$.removeListener();
	$.destroy();
	$.off();
	
	$._collection = null;
	$._dataSource = null;
	$._delegate = null;
	
} // END cleanup()


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


function _getEmptyDataSetView() {
	
	if (!$.__emptyDataSetView) {
		
		$.__emptyDataSetView = Widget.createController('emptyDataSetView');
		
		$.__emptyDataSetView.on('buttonClick', handleButtonClick);
		
		$.__emptyDataSetView.visible = false;
	}
	
	return $.__emptyDataSetView;
	
} // END _getEmptyDataSetView()


function _canDisplay() {
	
	return !!$._dataSource;
	
} // END _canDisplay()


function _getItemsCount() {
	
	var items = 0;
	
	if ($._collection) {
		
		if ($._collection instanceof Backbone.Collection) {
			
			items = $._collection.models.length;
		}
		else {
			
			items = _.size(_.omit($._collection.attributes, 'id'));
		}
	}
	
	return items;
	
} // END _getItemsCount()


function _getTitle() {
	
	if ($._dataSource && _.isFunction($._dataSource.titleForEmptyDataSet)) {
		
		return $._dataSource.titleForEmptyDataSet();
	}
	
	return null;
	
} // END _getTitle()


function _getDescription() {
	
	if ($._dataSource && _.isFunction($._dataSource.descriptionForEmptyDataSet)) {
		
		return $._dataSource.descriptionForEmptyDataSet();
	}
	
	return null;
	
} // END _getDescription()


function _getImage() {
	
	if ($._dataSource && _.isFunction($._dataSource.imageForEmptyDataSet)) {
		
		return $._dataSource.imageForEmptyDataSet();
	}
	
	return null;
	
} // END _getImage()


function _getButtonTitle() {
	
	if ($._dataSource && _.isFunction($._dataSource.buttonTitleForEmptyDataSet)) {
		
		return $._dataSource.buttonTitleForEmptyDataSet();
	}
	
	return null;
	
} // END _getButtonTitle()


function _getButtonImage() {
	
	if ($._dataSource && _.isFunction($._dataSource.buttonImageForEmptyDataSet)) {
		
		return $._dataSource.buttonImageForEmptyDataSet();
	}
	
	return null;
	
} // END _getButtonImage()


function _getButtonIcon() {
	
	if ($._dataSource && _.isFunction($._dataSource.buttonIconForEmptyDataSet)) {
		
		return $._dataSource.buttonIconForEmptyDataSet();
	}
	
	return null;
	
} // END _getButtonIcon()


function _getBackgroundColor() {
	
	if ($._dataSource && _.isFunction($._dataSource.backgroundColorForEmptyDataSet)) {
		
		return $._dataSource.backgroundColorForEmptyDataSet() || 'transparent';
	}
	
	return 'transparent';
	
} // END _getBackgroundColor()


function _getShowLoading() {
	
	if ($._delegate && _.isFunction($._delegate.emptyDataSetShouldShowLoading)) {
		
		return !!$._delegate.emptyDataSetShouldShowLoading();
	}
	
	return false;
}


function _shouldFadeIn() {
	
	if ($._delegate && _.isFunction($._delegate.emptyDataSetShouldFadeIn)) {
		
		return !!$._delegate.emptyDataSetShouldFadeIn();
	}
	
	return true;
	
} // END _shouldFadeIn()


function _shouldDisplay() {
	
	if ($._delegate && _.isFunction($._delegate.emptyDataSetShouldDisplay)) {
		
		return !!$._delegate.emptyDataSetShouldDisplay();
	}
	
	return true;
	
} // END _shouldDisplay()


function _setDataSource(dataSource) {
	
	if (!dataSource || !_canDisplay()) {
		
		_invalidate();
	}
	
	$._dataSource = dataSource;
	
} // END _setDataSource()


function _setDelegate(delegate) {
	
	delegate || _invalidate();
	
	$._delegate = delegate;
	
} // END _setDelegate()


function _setCollection(collection) {
	
	if (collection && (collection instanceof Backbone.Model || collection instanceof Backbone.Collection)) {
		
		$._collection = collection;
		
		$._collection.on('sync destroy change add remove reset error', _reload);
	}
	else {
		
		$._collection && $._collection.off(null, _reload);
		
		$._collection = collection;
	}
	
} // END _setCollection()


function _setEmptyDataSetView(view) {
	
	$.__emptyDataSetView && $.__emptyDataSetView.off();
	
	$.__emptyDataSetView = view;
	
} // END _setEmptyDataSetView()


function _reload() {
	
	if (!_canDisplay()) {
		
		Ti.API.error(LTAG, 'Can\'t display!!');
		
		return;
	}
	
	if (_shouldDisplay() && !_getItemsCount()) {
		
		var title = _getTitle(),
			description = _getDescription(),
			buttonImage = _getButtonImage(),
			buttonIcon = _getButtonIcon(),
			buttonTitle = _getButtonTitle(),
			image = _getImage();
		
		
		$._emptyDataSetView.parent || $._emptyDataSetView.setParent($.parent);
		
		$._emptyDataSetView.title = title;
		$._emptyDataSetView.description = description;
		$._emptyDataSetView.image = image;
		$._emptyDataSetView.buttonImage = buttonImage;
		
		buttonIcon && ($._emptyDataSetView.buttonIcon = buttonIcon);
		buttonTitle && ($._emptyDataSetView.buttonTitle = buttonTitle);
		
		$._emptyDataSetView.backgroundColor = _getBackgroundColor();
		$._emptyDataSetView.fadeInOnDisplay = _shouldFadeIn();
		$._emptyDataSetView.showLoading = _getShowLoading();
		
		$._emptyDataSetView.visible = true;
	}
	else if ($.isVisible) {
		
		_invalidate();
	}
	
} // END _reload()


function _invalidate() {
	
	Ti.API.debug(LTAG, 'Invalidating...');

	
	require('alloy/animation').fadeOut($._emptyDataSetView.getView(), Alloy.CFG.animationDurationShort, function() {
		
		$._emptyDataSetView.parent && $._emptyDataSetView.parent.remove($._emptyDataSetView.getView());
		
		if ($._emptyDataSetView) {
			
			$._emptyDataSetView.off();
			
			$._emptyDataSetView.getView().removeAllChildren();
			
			$._emptyDataSetView.cleanup();
			
			$._emptyDataSetView = null;
		}
	});
	
} // END _invalidate()


// PUBLIC INTERFACE
exports.reload = _reload;
