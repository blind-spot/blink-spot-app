class MapOverlayDialogController
  constructor: ($scope, $modal, $log, $http, leafletData) ->
    @showIncidentTypeChoices()

  showIncidentTypeChoices: () ->
    console.log("Showing Incident Types")
