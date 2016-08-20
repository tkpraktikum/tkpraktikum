angular
  .module('app')
  .controller('SubmissionCreateController',
      ['$q', '$scope', '$anchorScroll', '$state', '$stateParams', 'Submission', 'Tag',
       'AuthService', 'Submissiontag', 'Authorship', 'User', 'Conference',
      function($q, $scope, $anchorScroll, $state, $stateParams, Submission, Tag,
        AuthService, Submissiontag, Authorship, User, Conference) {

    var conferenceId = $stateParams.conferenceId,
      asyncReq = (function () {
        var pendingRequests = 0;

        return {
          start: function () {
            if (pendingRequests === 0) $scope.pendingRequest = true;
            ++pendingRequests;
          },
          end: function () {
            --pendingRequests;
            if (pendingRequests === 0) $scope.pendingRequest = false;
          }
        };
      })(),
      dropzone = new Dropzone('#submission-file', {
        paramName: 'file',
        url: '/api/containers/submissions/upload',
        acceptedFiles: 'application/pdf,.pdf',
        autoProcessQueue: true,
        addRemoveLinks: true,
        maxFiles: 1,
        init: function () {
          this.on('sending', function () {
            asyncReq.start();
            $scope.$apply();
          });
          this.on('complete', function () {
            asyncReq.end();
            $scope.$apply();
          });
          this.on('success', function (file, response) {
            var result = response.result.files.file[0];
            $scope.submission.file = result;
            $scope.$apply();
          });
        }
      });

    $scope.submission = { authors: [], tags: [] };
    $scope.tagSuggestions = [];

    $scope.populateAutoCompleteTags = function ($select) {
      $scope.tagSuggestions = [];

      return Tag.find({filter: {
        where: {
          name: { like: '%' + $select.search.toLowerCase() + '%' }
        },
        limit: 4
      }})
      .$promise
      .then(function (tags) {
        var foundTag = false;
        $scope.tagSuggestions = $scope.tagSuggestions.concat(tags.map(function (ressource) {
          foundTag = foundTag || ressource.name.toLowerCase() === $select.search.toLowerCase();
          return ressource.toJSON();
        }));

        if ($select.search.length >= 2 && !foundTag) {
          $scope.tagSuggestions.unshift($scope.transformTag($select.search));
        }
      });
    };

    $scope.transformTag = function (tag) {
      return {id: -1, name: tag};
    };

    $scope.createTag = function ($item) {
      if ($item.id < 0) {
        asyncReq.start();

        Tag.create({}, { name: $item.name.toLowerCase() })
        .$promise
        .then(function (tag) {
          var item = _.findWhere($scope.submission.tags, {name: $item.name.toLowerCase() });

          if (item !== undefined) {
            item.id = tag.id;
          }
        })
        .finally(function () { asyncReq.end(); });
      }
    };

    $scope.addAuthorField = function (author) {
      $scope.submission.authors.push(author);
    };

    $scope.removeAuthorField = function () {
      $scope.submission.authors.pop();
    };

    $scope.hasFormError = function (formController) {
      return formController.$submitted &&
        (formController.$pristine || !formController.$valid);
    };

    $scope.hasInputError = function (input) {
      return input.$dirty && _(input.$error).keys().length > 0;
    };

    $scope.createSubmission = function ($event, formController) {
      var form = $event.currentTarget;

      if ($scope.hasFormError(formController)) {
        // Show errors if the form were left untouched
        formController.title.$setDirty();
        formController.abstract.$setDirty();
        return $anchorScroll();
      }

      // Create submission
      asyncReq.start();
      Submission.create({}, {
        conferenceId: conferenceId,
        title: $scope.submission.title,
        abstract: $scope.submission.abstract
      })
      .$promise
      .then(function (submission) {
        // Link tags to submission
        var submissiontags = _($scope.submission.tags).map(function (tag) {
            asyncReq.start();
            return Submissiontag.create({
              tagId: tag.id,
              submissionId: submission.id
            }).$promise.finally(function () { asyncReq.end(); });
          }),
          // Link authors to submission
          authorships = _($scope.submission.authors).map(function (author) {
            if (author.id <= 0) return;

            asyncReq.start();
            return Authorship.create({
              authorId: author.id,
              submissionId: submission.id
            }).$promise.finally(function () { asyncReq.end(); });
          });

        // TODO: Link file to submission

        // On success: Redirect user to submission overview
        $q.all(submissiontags.concat(authorships)).then(function () {
          AuthService.setFlash('Submission was created successfully!');
          $state.go('app.protected.conference.submission.list', {
            conferenceId: conferenceId
          }, {reload: true});
        });
      })
      .finally(function () { asyncReq.end(); });
    };

    $scope.filterValidAuthors = function() {
      $scope.submission.authors = _.uniq($scope.submission.authors.filter(function(a) { return !!a; }).concat([undefined]));
      $scope.authors = $scope.allAuthors.filter(function(a) { return $scope.submission.authors.indexOf(a) === -1;});
    };

    Conference.findById({
      id: conferenceId,
      filter: {include: ['authors']
    }})
    .$promise
    .then(function (conference) {
      // Auto suggestion lookup table
      $scope.allAuthors = _(conference.authors).map(function (author) {
        var a = _.chain(author)
          .pick('id', 'firstname', 'lastname', 'email')
          .defaults({ firstname: 'Unknown', lastname: '' })
          .value();
        a.fullName = a.firstname + ' ' + a.lastname;
        return a;
      });

      // Prefill current user as author
      AuthService.getUserId().then(function (userId) {
        $scope.authors = $scope.allAuthors.filter(function(a) { return a.id != userId});
        var author = _($scope.allAuthors).findWhere({id: userId});
        $scope.addAuthorField(author);
        $scope.addAuthorField();
      });
    });
  }]);
