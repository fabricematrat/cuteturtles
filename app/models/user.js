'use strict';

YUI.add('userModel', function (Y) {
	Y.User = Y.Base.create('userModel', Y.Model, {
	}, {
		ATTRS: {
			name: {}
		}
	});
}, { requires: ['model']});