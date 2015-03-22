class ReportService
  constructor: (@$scope, @$http, @url = "http://localhost:8000/api/report") ->

  createStream: () ->
    return @$http.post "#{@url}/data/"

  insertDatapoint: (stream_uuid, data) ->
    fd = new FormData()
    fd.append('data', new Blob([JSON.stringify(data)],{type: "application/json"}))

    return @$http.post "#{@url}/data/#{stream_uuid}", fd,
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}

  getLatestDatapoint: (stream_uuid) ->
    return @$http.get "#{@url}/data/#{stream_uuid}/latest"
