'use strict';

YUI.add('GameLostView', function (Y) {
	Y.GameLostView = Y.Base.create('GameLostView', Y.View, [], {
		initializer: function () {
			var self = this;
			this._panel = new Y.Panel({
				headerContent: 'Game Lost',
				bodyContent: '<div id="panelContent">Don\'t Worry ! You can try again !</div>',
				width: 250,
				zIndex: 5,
				close: false,
				centered: true,
				modal: true,
				visible: true,
				buttons: [
					{
						value: 'Play Again!',
						section: Y.WidgetStdMod.FOOTER,
						action: function (e) {
							e.preventDefault();
							self._panel.destroy();
							self.destroy({remove: true});
						}
					}
				],
				hideOn: []
			});

		},
		render: function () {
			this._panel.get('boundingBox').transition({
				duration: 0.5,
				top: '80px'
			});
			this._panel.render();
			return this;
		}
	});
}, '0.0.1', { requires: ['view', 'node', 'panel']});