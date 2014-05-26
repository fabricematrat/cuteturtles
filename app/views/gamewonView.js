'use strict';

YUI.add('GameWonView', function (Y) {
	Y.GameWonView = Y.Base.create('GameWonView', Y.View, [], {
		initializer: function () {
			var self = this;
			this._panel = new Y.Panel({
				headerContent: 'Game Won',
				bodyContent: '<div id="panelContent">Well Done !!!</div>',
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