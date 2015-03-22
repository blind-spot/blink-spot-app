(function() {
  var LocateMyCar, ReportService, app, setHeights;

  if (typeof LocateMyCar === "undefined" || LocateMyCar === null) {
    LocateMyCar = {};
  }

  if (LocateMyCar.Angular == null) {
    LocateMyCar.Angular = {};
  }

  if (LocateMyCar.Angular.Controllers == null) {
    LocateMyCar.Angular.Controllers = {};
  }

  LocateMyCar.Angular.Controllers.CarLocationMapController = (function() {
    function CarLocationMapController($scope, $modal, $log, $http) {
      var CenterOnLastControl, SetCarControl/*, imgURI*/;
//      imgURI = "/img/shoot.png";
      navigator.camera.getPicture(function(imgURI) {

        alert("image file: " + imgURI);

    // imageURI is the URL of the image that we can use for
    // an <img> element or backgroundImage.
        

      }, function(err) {
        alert("Camera failed: " + err);
      }, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
      angular.extend($scope, {
        center: {
          autoDiscover: true
        },
        markers: new Array()
      });
      $scope.controls = {
        custom: []
      };
      SetCarControl = L.control();
      SetCarControl.setPosition('topright');
      SetCarControl.onAdd = function() {
        var className, control;
        className = 'leaflet-control-set-car';
        control = L.DomUtil.create('span', className + ' fa fa-car fa-3x');
        control.setAttribute("ng-click", "openSetCarModal()");
        control.setAttribute("tooltip", "Set Car To Park");
        L.DomEvent.on(control, 'mousedown dblclick', L.DomEvent.stopPropagation).on(control, 'click', L.DomEvent.stop).on(control, 'click', $scope.openSetCarModal, $scope);
        return control;
      };
      $scope.controls.custom.push(SetCarControl);
      CenterOnLastControl = L.control();
      CenterOnLastControl.setPosition('topright');
      CenterOnLastControl.onAdd = function() {
        var className, control;
        className = 'leaflet-control-center-on-last';
        control = L.DomUtil.create('div', className + ' fa fa-location-arrow fa-4x');
        L.DomEvent.on(control, 'mousedown dblclick', L.DomEvent.stopPropagation).on(control, 'click', L.DomEvent.stop).on(control, 'click', $scope.centerOnCurrentLocation, $scope);
        return control;
      };
      $scope.controls.custom.push(CenterOnLastControl);
      $scope.indus = new ReportService($scope, $http, "http://squeakycitizen.azurewebsites.net/api/report");
      $scope.$watch('streamUuid', function(newValue, oldValue) {
        if ((newValue != null ? newValue.length : void 0) > 0) {
          return $scope.indus.getLatestDatapoint(newValue).then(function(response) {
            var data;
            if (response.data === "null") {
              return;
            }
            data = JSON.parse(response.data.data);
            return $scope.markers.push(data.location);
          }, function(failure) {
            if ($scope.streamUuid == null) {
              return $scope.openSetCarModal();
            }
          });
        }
      });
      $scope.state = window.localStorage.getItem("state");
      $scope.licensePlate = window.localStorage.getItem("licensePlate");
      $scope.streamUuid = window.localStorage.getItem("streamUuid");
      $scope.centerOnCurrentLocation = function() {
        if (($scope.streamUuid == null) || $scope.markers.length === 0) {
          return alert("No current location available! Either stream uuid is invalid or there are no previous places logged.");
        }
        return $scope.center = {
          lat: $scope.markers[0].lat,
          lng: $scope.markers[0].lng,
          zoom: 18
        };
      };
      $scope.openSetCarModal = function(size) {
        var logDismissal, modalInstance, selectedItemSet;
        modalInstance = $modal.open({
          templateUrl: 'setCarModal.html',
          controller: 'SetCarModalController',
          size: size,
          resolve: {
            state: function() {
              return $scope.state;
            },
            licensePlate: function() {
              return $scope.licensePlate;
            },
            streamUuid: function() {
              return $scope.streamUuid;
            }
          }
        });
        selectedItemSet = function(options) {
          var ref, ref1, ref2, ref3;
          $scope.state = options.state;
          if (((ref = $scope.state) != null ? ref.length : void 0) === 0 || typeof $scope.state === "undefined") {
            window.localStorage.removeItem("state");
            $scope.state = null;
          } else {
            window.localStorage.setItem("state", $scope.state);
          }
          $scope.licensePlate = options.licensePlate;
          if (((ref1 = $scope.licensePlate) != null ? ref1.length : void 0) === 0 || typeof $scope.licensePlate === "undefined") {
            window.localStorage.removeItem("licensePlate");
            $scope.licensePlate = null;
          } else {
            window.localStorage.setItem("licensePlate", $scope.licensePlate);
          }
          $scope.streamUuid = options.streamUuid;
          if (((ref2 = $scope.streamUuid) != null ? ref2.length : void 0) === 0 || typeof $scope.streamUuid === "undefined") {
            window.localStorage.removeItem("streamUuid");
            $scope.streamUuid = null;
          } else {
            window.localStorage.setItem("streamUuid", $scope.streamUuid);
          }
          if (($scope.streamUuid == null) || ((ref3 = $scope.streamUuid) != null ? ref3.length : void 0) === 0) {
            return $scope.indus.createStream().then(function(data) {
              var ref4;
              $scope.streamUuid = data.data.uuid;
              if (((ref4 = $scope.streamUuid) != null ? ref4.length : void 0) === 0 || typeof $scope.streamUuid === "undefined") {
                window.localStorage.removeItem("streamUuid");
                return $scope.streamUuid = null;
              } else {
                return window.localStorage.setItem("streamUuid", $scope.streamUuid);
              }
            });
          }
        };
        logDismissal = function() {
          return $log.info("Modal dismissed at: " + (new Date()));
        };
        return modalInstance.result.then(selectedItemSet, logDismissal);
      };
      $scope.$on("leafletDirectiveMap.click", function(evt, args) {
        var leafEvent, modalInstance, newCarLocation, removeMarker, setLocation;
        if ($scope.streamUuid == null) {
          $scope.openSetCarModal();
        }
        leafEvent = args.leafletEvent;
        newCarLocation = {
          lat: leafEvent.latlng.lat,
          lng: leafEvent.latlng.lng
        };
        $scope.markers.push(newCarLocation);
        modalInstance = $modal.open({
          templateUrl: 'confirmCarLocation.html',
          controller: 'ConfirmCarLocationModalController',
          size: 'sm',
          resolve: {}
        });
        setLocation = function(options) {
          $scope.markers = [newCarLocation];
          return $scope.indus.insertDatapoint($scope.streamUuid, {
            status: "parked",
            car: {
              license_plate: $scope.licensePlate,
              state: $scope.state
            },
            location: newCarLocation
          });
        };
        removeMarker = function() {
          var index;
          index = $scope.markers.indexOf(newCarLocation);
          return $scope.markers.splice(index, 1);
        };
        return modalInstance.result.then(setLocation, removeMarker);
      });
      setHeights();
    }

    return CarLocationMapController;

  })();

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

  ReportService = (function() {
    function ReportService($scope1, $http1, url) {
      this.$scope = $scope1;
      this.$http = $http1;
      this.url = url != null ? url : "http://localhost:8000/api/report";
    }

    ReportService.prototype.createStream = function() {
      return this.$http.post(this.url + "/data/");
    };

    ReportService.prototype.insertDatapoint = function(stream_uuid, data) {
      var fd;
      fd = new FormData();
      fd.append('data', new Blob([JSON.stringify(data)], {
        type: "application/json"
      }));
      return this.$http.post(this.url + "/data/" + stream_uuid, fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': void 0
        }
      });
    };

    ReportService.prototype.getLatestDatapoint = function(stream_uuid) {
      return this.$http.get(this.url + "/data/" + stream_uuid + "/latest");
    };

    return ReportService;

  })();

}).call(this);
