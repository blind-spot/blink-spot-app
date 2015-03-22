class ReportCommandController
  constructor: ($scope, $modal, $log, $http, leafletData) ->
    angular.extend $scope, {
      center: {
        autoDiscover: true
      },
      markers: new Array(),
      header_text: "Squeaky Citizens"
    }

    $scope.controls = {
      custom: []
    }

    $scope.$on 'leafletDirectiveMap.move', (event, args) ->
      #Get the Leaflet map from the triggered event.
      map = args.leafletEvent.target
      center = map.getCenter()

      #Update the marker.
      $scope.markers =
        marker:
          lat: center.lat
          lng: center.lng
          label:
            message: "Report?"
            options:
              className: "btn-report"
              clickable: true
              noHide: true

    $scope.$on 'leafletDirectiveMap.layeradd', (event, args) ->
      if args.leafletEvent.layer?.showLabel?
        args.leafletEvent.layer.showLabel()

    $scope.$on 'leafletDirectiveLabel.click', (event, args) ->
      totalHeight = $(window).height() - $(".header").height() 
      if $("#main-map").hasClass "in-dialog"
        $("#main-map").removeClass "in-dialog"
        $("#main-map").css "height", "#{totalHeight}px"
      else
        overlayHeight = $(".report-type-choice-container").outerHeight()
        $("#main-map").addClass "in-dialog"
        $("#map-overlay-dialog").css "height", "#{overlayHeight}px"
        $("#main-map").css "height", "#{totalHeight - overlayHeight}px"

      invalidateSize = () ->
        args.leafletEvent.target._map.invalidateSize()

      intervalId = window.setInterval invalidateSize, 50

      clearInterval = () ->
        window.clearInterval(intervalId)
        intervalId = null

      window.setTimeout clearInterval, 1500

    setHeights()

