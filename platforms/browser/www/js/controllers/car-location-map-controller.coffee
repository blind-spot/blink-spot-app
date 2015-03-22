if not LocateMyCar?
  LocateMyCar = {}

if not LocateMyCar.Angular?
  LocateMyCar.Angular = {}

if not LocateMyCar.Angular.Controllers?
  LocateMyCar.Angular.Controllers = {}

class LocateMyCar.Angular.Controllers.CarLocationMapController
  constructor: ($scope, $modal, $log, $http) ->
    angular.extend $scope, {
      center: {
        autoDiscover: true
      },
      markers: new Array()
    }

    $scope.controls = {
      custom: []
    }

    #Set Car Control
    SetCarControl = L.control()
    SetCarControl.setPosition('topright')
    SetCarControl.onAdd = () ->
      className = 'leaflet-control-set-car'
      control = L.DomUtil.create('span', className + ' fa fa-car fa-3x')
      control.setAttribute("ng-click","openSetCarModal()")
      control.setAttribute("tooltip", "Set Car To Park")
      L.DomEvent.on(control, 'mousedown dblclick', L.DomEvent.stopPropagation)
        .on(control, 'click', L.DomEvent.stop)
        .on(control, 'click', $scope.openSetCarModal, $scope)
      return control

    $scope.controls.custom.push(SetCarControl)

    #Center On Last Location Control
    CenterOnLastControl = L.control()
    CenterOnLastControl.setPosition('topright')
    CenterOnLastControl.onAdd = () ->
      className = 'leaflet-control-center-on-last'
      control = L.DomUtil.create('div', className + ' fa fa-location-arrow fa-4x')
      L.DomEvent.on(control, 'mousedown dblclick', L.DomEvent.stopPropagation)
        .on(control, 'click', L.DomEvent.stop)
        .on(control, 'click', $scope.centerOnCurrentLocation, $scope)
      return control

    $scope.controls.custom.push(CenterOnLastControl)

    $scope.indus = new IndusService($scope, $http, "http://indus-service.herokuapp.com/v1")

    $scope.$watch 'streamUuid', (newValue, oldValue) ->
      if newValue?.length > 0
        $scope.indus.getLatestDatapoint(newValue).then (response) ->
          return if response.data == "null"
          data = JSON.parse(response.data.data)
          $scope.markers.push data.location
        , (failure) ->
          if not $scope.streamUuid?
            $scope.openSetCarModal()

    $scope.state = window.localStorage.getItem("state")
    $scope.licensePlate = window.localStorage.getItem("licensePlate")
    $scope.streamUuid = window.localStorage.getItem("streamUuid")

    $scope.centerOnCurrentLocation = () ->
      if not $scope.streamUuid? or $scope.markers.length == 0
        return alert("No current location available! Either stream uuid is invalid or there are no previous places logged.")

      $scope.center =
        lat: $scope.markers[0].lat
        lng: $scope.markers[0].lng
        zoom: 18

    $scope.openSetCarModal = (size) ->
      modalInstance = $modal.open {
        templateUrl: 'setCarModal.html'
        controller: 'SetCarModalController'
        size: size
        resolve:
          state: () ->
            return $scope.state
          licensePlate: () ->
            return $scope.licensePlate
          streamUuid: () ->
            return $scope.streamUuid
      }

      selectedItemSet = (options) ->
        $scope.state = options.state
        if $scope.state?.length == 0 or typeof($scope.state) == "undefined"
          window.localStorage.removeItem("state")
          $scope.state = null
        else
          window.localStorage.setItem("state", $scope.state)

        $scope.licensePlate = options.licensePlate
        if $scope.licensePlate?.length == 0 or typeof($scope.licensePlate) == "undefined"
          window.localStorage.removeItem("licensePlate")
          $scope.licensePlate = null
        else
          window.localStorage.setItem("licensePlate", $scope.licensePlate)

        $scope.streamUuid = options.streamUuid
        if $scope.streamUuid?.length == 0 or typeof($scope.streamUuid) == "undefined"
          window.localStorage.removeItem("streamUuid")
          $scope.streamUuid = null
        else
          window.localStorage.setItem("streamUuid", $scope.streamUuid)

        if not $scope.streamUuid? or $scope.streamUuid?.length == 0
          $scope.indus.createStream().then (data) ->
            $scope.streamUuid = data.data.uuid
            if $scope.streamUuid?.length == 0 or typeof($scope.streamUuid) == "undefined"
              window.localStorage.removeItem("streamUuid")
              $scope.streamUuid = null
            else
              window.localStorage.setItem("streamUuid", $scope.streamUuid)

      logDismissal = () ->
        $log.info("Modal dismissed at: #{new Date()}")

      modalInstance.result.then selectedItemSet, logDismissal

    $scope.$on "leafletDirectiveMap.click", (evt, args) ->
      if not $scope.streamUuid?
        $scope.openSetCarModal()

      leafEvent = args.leafletEvent

      newCarLocation =
        lat: leafEvent.latlng.lat
        lng: leafEvent.latlng.lng

      $scope.markers.push newCarLocation

      modalInstance = $modal.open {
        templateUrl: 'confirmCarLocation.html'
        controller: 'ConfirmCarLocationModalController'
        size: 'sm'
        resolve: {}
      }

      setLocation = (options) ->
        $scope.markers = [newCarLocation]
        $scope.indus.insertDatapoint $scope.streamUuid,
          status: "parked"
          car:
            license_plate: $scope.licensePlate
            state: $scope.state
          location: newCarLocation

      removeMarker = () ->
        index = $scope.markers.indexOf(newCarLocation)
        $scope.markers.splice(index,1)

      modalInstance.result.then setLocation, removeMarker

    setHeights()
