(function() {
  'use strict';

  function InputController() {
    var secondary = {
        A: [1, 2, 3],
        B: [3, 4, 5]
      },
      vm = this;

    vm.primary = ['A', 'B'];
    vm.selectedPrimary = vm.primary[0];

    vm.onPrimaryChange = function() {
      vm.secondary = secondary[vm.selectedPrimary];
    };
  }

  angular.module('inputs', [])
    .controller('InputCtrl', InputController);

}());