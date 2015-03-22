
setHeights = () ->
  leaflet = $(".angular-leaflet-map")
  leaflet.css("height","#{$(window).height()}")
  leaflet.css("width","#{$(window).width()}")

$(window).on "orientationchange resize", setHeights

app = angular.module("squeaky-citizens", ["leaflet-directive", "ui.bootstrap"])

app.controller "CarLocationMapController", LocateMyCar.Angular.Controllers.CarLocationMapController

app.controller "SetCarModalController", ($scope, $modalInstance, state, licensePlate, streamUuid) ->
  $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
  $scope.state = state
  $scope.licensePlate = licensePlate
  $scope.streamUuid = streamUuid

  $scope.$watch 'state', (newValue, oldValue) ->
    if newValue != oldValue
      $scope.streamUuid = null

  $scope.$watch 'licensePlate', (newValue, oldValue) ->
    if newValue != oldValue
      $scope.streamUuid = null

  $scope.ok = () ->
    $modalInstance.close
      state: $scope.state
      licensePlate: $scope.licensePlate
      streamUuid: $scope.streamUuid

  $scope.cancel = () ->
    $modalInstance.dismiss('cancel')

app.controller "ConfirmCarLocationModalController", ($scope, $modalInstance) ->

  $scope.setLocation = () ->
    $modalInstance.close()

  $scope.cancel = () ->
    $modalInstance.dismiss('cancel')
