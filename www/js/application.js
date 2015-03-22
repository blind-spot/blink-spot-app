(function() {
  var MapOverlayDialogController, ReportCommandController, ReportService, app, setHeights, toggleHeaderButtons;

  MapOverlayDialogController = (function() {
    function MapOverlayDialogController($scope, $log, $http, leafletData) {
      angular.extend($scope, {
        dial911: this.dial911.bind(this),
        isDefined: function(foo) {
          return foo != null;
        },
        showNextScreen: this.showNextScreen.bind(this),
        startReport: this.startReport.bind(this)
      });
      this.$scope = $scope;
      console.log("Scope: " + this.$scope);
      this.showMapOverlayDialog();
      this.showIncidentTypeChoices($scope);
    }

    MapOverlayDialogController.prototype.showMapOverlayDialog = function() {
      $("#map-overlay-dialog").show();
      return $(".header").show();
    };

    MapOverlayDialogController.prototype.showIncidentTypeChoices = function($scope) {
      $scope.title = null;
      return $scope.choices = [
        {
          color: "red",
          label: "Incident",
          type: "incident"
        }, {
          color: "orange",
          label: "Problem",
          type: "problem"
        }, {
          color: "green",
          label: "Solution",
          type: "solution"
        }, {
          color: "purple",
          label: "Goodness",
          type: "goodness"
        }
      ];
    };

    MapOverlayDialogController.prototype.show911Dialog = function($scope) {
      $scope.header = "OUCH!";
      return $scope.choices = [
        {
          color: "red",
          label: "CALL 911",
          text: "Seriously hurt or property damage?",
          type: "dial911"
        }, {
          color: "red",
          label: "Report minor incident",
          text: "If you are OK...",
          type: "report"
        }
      ];
    };

    MapOverlayDialogController.prototype.showNextScreen = function(type, color) {
      console.log("Type: " + type + " Color: " + color);
      if (type === "incident") {
        return this.show911Dialog(this.$scope);
      } else if (type === "dial911") {
        return this.dial911(this.$scope);
      } else if (type === "report") {
        return this.startReport(this.$scope);
      } else {
        return console.log("Not yet!");
      }
    };

    MapOverlayDialogController.prototype.dial911 = function() {
      var onError;
      onError = function() {
        return alert("Unable to dial 911! Please leave the app and use your dialer directly!");
      };
      return window.plugins.CallNumber.callNumber(null, onError, "1234567890");
    };

    MapOverlayDialogController.prototype.startReport = function() {
      return console.log("Start Report");
    };

    return MapOverlayDialogController;

  })();

  ReportCommandController = (function() {
    function ReportCommandController($scope, $modal, $log, $http, leafletData) {
      angular.extend($scope, {
        center: {
          autoDiscover: true
        },
        markers: new Array(),
        header_text: "Squeaky Citizens",
        backHome: (function(_this) {
          return function() {
            var totalHeight;
            toggleHeaderButtons();
            totalHeight = $(window).height() - $(".header").outerHeight();
            $("#main-map").removeClass("in-dialog");
            $("#main-map").css("height", totalHeight + "px");
            return _this.transitionHeights();
          };
        })(this)
      });
      $scope.controls = {
        custom: []
      };
      $scope.$on('leafletDirectiveMap.move', (function(_this) {
        return function(event, args) {
          var center, map;
          map = args.leafletEvent.target;
          center = map.getCenter();
          _this.map = map;
          return $scope.markers = {
            marker: {
              lat: center.lat,
              lng: center.lng,
              label: {
                message: "Report?",
                options: {
                  className: "btn-report",
                  clickable: true,
                  noHide: true
                }
              }
            }
          };
        };
      })(this));
      $scope.$on('leafletDirectiveMap.layeradd', function(event, args) {
        var ref;
        if (((ref = args.leafletEvent.layer) != null ? ref.showLabel : void 0) != null) {
          return args.leafletEvent.layer.showLabel();
        }
      });
      $scope.$on('leafletDirectiveLabel.click', (function(_this) {
        return function(event, args) {
          var overlayHeight, totalHeight;
          totalHeight = $(window).height() - $(".header").outerHeight();
          totalHeight = totalHeight - 30;
          overlayHeight = $(".report-type-choice-container").outerHeight();
          $("#main-map").addClass("in-dialog");
          $("#map-overlay-dialog").css("height", overlayHeight + "px");
          $("#main-map").css("height", (totalHeight - overlayHeight) + "px");
          toggleHeaderButtons();
          _this.map = args.leafletEvent.target._map;
          console.log("Map: " + _this.map);
          return _this.transitionHeights();
        };
      })(this));
      setHeights();
    }

    ReportCommandController.prototype.transitionHeights = function() {
      var clearInterval, intervalId, invalidateSize;
      invalidateSize = (function(_this) {
        return function() {
          return _this.map.invalidateSize();
        };
      })(this);
      intervalId = window.setInterval(invalidateSize, 50);
      clearInterval = function() {
        window.clearInterval(intervalId);
        return intervalId = null;
      };
      return window.setTimeout(clearInterval, 1500);
    };

    return ReportCommandController;

  })();

  setHeights = function() {
    var availableHeight, leaflet;
    availableHeight = $(window).height() - $(".header").height();
    leaflet = $(".angular-leaflet-map");
    leaflet.css("height", "" + availableHeight);
    return leaflet.css("width", "" + ($(window).width()));
  };

  toggleHeaderButtons = function() {
    $(".btn-settings").toggle();
    return $(".btn-back").toggle();
  };

  $(window).on("orientationchange resize", setHeights);

  app = angular.module("squeaky-citizens", ["leaflet-directive", "mgcrea.ngStrap"]);

  app.controller("ReportCommandController", ReportCommandController);

  app.controller("MapOverlayDialogController", MapOverlayDialogController);

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
