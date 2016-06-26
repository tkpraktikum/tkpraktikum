angular
  .module('app')
  .controller('SubmissionCreateController',
      ['$q', '$scope', '$state', 'Submission', 'Tag', 'AuthService', 'LoopBackAuth',
      function($q, $scope, $state, Submission, Tag, AuthService, LoopBackAuth) {

    $scope.dropzone = new Dropzone('#submission-file', {
      paramName: 'submission-file',
      url: '/api/containers/submissions/upload',
      acceptedFiles: 'application/pdf,.pdf',
      autoProcessQueue: false,
      params: { testVar: "WHAT THE FUCK" },
      init: function () {
        this.on('addedfile', function (file) {
          if (this.files.length > 1) {
            this.removeFile(this.files[0]);
          }
        });
      }
    });

    $scope.submission = { authors: [], tags: [] };
    $scope.tags = [];

    $scope.addAuthor = function (author) {
      author = author || '';
      $scope.submission.authors.push(author);
    };

    $scope.removeAuthor = function () {
      $scope.submission.authors.pop();
    };

    $scope.createSubmission = function () {
      // return Submission.create({}, $scope.submission);

      var /*tagPromise = Tag
          .find({filter: {where: {name: {inq: $scope.submission.tags}}}})
          .$promise,*/
        deferredUpload = $q.defer(),
        uploadPromise = deferredUpload.promise,
        onComplete = function (file, response) {
          deferredUpload.resolve(response);
          $scope.dropzone.off('success', onComplete);
        };

      if ($scope.dropzone.getQueuedFiles().length > 0) {
        $scope.dropzone.on('success', onComplete);
        $scope.dropzone.processQueue();
      } else {
        deferredUpload.reject();
      }

      $q.all([uploadPromise/*, tagPromise*/]).then(function (results) {
        // console.log(results[0].result.files['submission-file'][0].name);
        // console.log(results[1]);
        Submission.create({}, $scope.submission);
      }, function (error) {
        console.log("promiseERR", error);
      });
    };

    AuthService.getUser().then(function (user) {
      $scope.addAuthor(user.username + ' <' + user.email + '>');
    });

    /*Tag.find().$promise.then(function (tags) {
      $scope.tags = $scope.tags.concat(tags.map(function (ressource) {
        return ressource.name;
      }));
    });*/
  }]);
