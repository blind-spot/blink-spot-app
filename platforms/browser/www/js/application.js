(function() {
  var app, setHeights;

  setHeights = function() {
    var leaflet;
    leaflet = $(".angular-leaflet-map");
    leaflet.css("height", "" + ($(window).height()));
    return leaflet.css("width", "" + ($(window).width()));
  };

  $(window).on("orientationchange resize", setHeights);

  app = angular.module("squeaky-citizens", ["leaflet-directive", "ui.bootstrap"]);

  app.controller("CarLocationMapController", LocateMyCar.Angular.Controllers.CarLocationMapController);

  app.controller("SetCarModalController", function($scope, $modalInstance, state, licensePlate, streamUuid) {
    $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    $scope.state = state;
    $scope.licensePlate = licensePlate;
    $scope.streamUuid = streamUuid;
    $scope.$watch('state', function(newValue, oldValue) {
      if (newValue !== oldValue) {
        return $scope.streamUuid = null;
      }
    });
    $scope.$watch('licensePlate', function(newValue, oldValue) {
      if (newValue !== oldValue) {
        return $scope.streamUuid = null;
      }
    });
    $scope.ok = function() {
      return $modalInstance.close({
        state: $scope.state,
        licensePlate: $scope.licensePlate,
        streamUuid: $scope.streamUuid
      });
    };
    return $scope.cancel = function() {
      return $modalInstance.dismiss('cancel');
    };
  });

  app.controller("ConfirmCarLocationModalController", function($scope, $modalInstance) {
    $scope.setLocation = function() {
      return $modalInstance.close();
    };
    return $scope.cancel = function() {
      return $modalInstance.dismiss('cancel');
    };
  });

}).call(this);
