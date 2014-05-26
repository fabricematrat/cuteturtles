'use strict';

YUI.add('RegistrationView', function (Y) {
	Y.RegistrationView = Y.Base.create('RegistrationView', Y.View, [], {
		initializer: function () {
			var self = this;
			this._panel = new Y.Panel({
				headerContent: 'What\'s your name ?',
				bodyContent: '<div id="panelContent"><div><form><fieldset><p><label for="name">Name</label><br/><input type="text" name="name" id="name" placeholder=""></p></fieldset></form></div></div>',
				width: 250,
				zIndex: 5,
				close: false,
				centered: true,
				modal: true,
				visible: true,
				buttons: [
					{
						value: 'Go !',
						section: Y.WidgetStdMod.FOOTER,
						action: function (e) {
							e.preventDefault();
							self.get('gameRepository').publish('newUser', Y.one('#name').get('value'));
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