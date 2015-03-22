class MapOverlayDialogController
  constructor: ($scope, $log, $http, leafletData) ->
    angular.extend $scope, {
      dial911: @dial911.bind(this)
      isDefined: (foo) -> foo?
      showNextScreen: @showNextScreen.bind(this)
      startReport: @startReport.bind(this)
    }

    @$scope = $scope
    console.log "Scope: #{@$scope}"

    @showMapOverlayDialog()
    @showIncidentTypeChoices($scope)

  showMapOverlayDialog: () ->
    $("#map-overlay-dialog").show()
    $(".header").show()

  showIncidentTypeChoices: ($scope) ->
    $scope.title = null
    $scope.choices = [
      {
        color: "red",
        label: "Incident",
        type:"incident"
      },
      {
        color: "orange",
        label: "Problem",
        type:"problem"
      },
      {
        color: "green",
        label: "Solution",
        type:"solution"
      },
      {
        color: "purple",
        label: "Goodness",
        type:"goodness"
      },
    ]

  show911Dialog: ($scope) ->
    $scope.header = "OUCH!"

    $scope.choices = [
      {
        color: "red",
        label: "CALL 911",
        text: "Seriously hurt or property damage?",
        type: "dial911"
      },
      {
        color: "red",
        label: "Report minor incident",
        text: "If you are OK...",
        type: "report"
      }
    ]

  showNextScreen: (type, color) ->
    console.log "Type: #{type} Color: #{color}"
    if type == "incident"
      @show911Dialog(@$scope)
    else if type == "dial911"
      @dial911(@$scope)
    else if type == "report"
      @startReport(@$scope)
    else
      console.log "Not yet!"

  dial911: () ->
    onError = () ->
      alert "Unable to dial 911! Please leave the app and use your dialer directly!"
    window.plugins.CallNumber.callNumber(null, onError, "1234567890")

  startReport: () ->
    console.log "Start Report"
