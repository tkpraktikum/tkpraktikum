angular.module('app').directive("checkPassword", function checkPassword() {
  return {
    require: "ngModel",
    scope: {
      otherValue: "=checkPassword"
    },
    link: function (scope, element, attributes, ngModel) {

      ngModel.$validators.checkPassword = function (value) {
        return value == scope.otherValue;
      };

      scope.$watch("otherValue", function () {
        ngModel.$validate();
      });
    }
  };
});
