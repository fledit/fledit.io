'use strict';

angular.module('fledit').config(function (RestangularProvider) {
  RestangularProvider.setBaseUrl('/api');
});
