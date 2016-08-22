angular
  .module('app')
  .controller('SubmissionCreateController',
      ['$q', '$scope', '$anchorScroll', '$state', '$stateParams', 'Submission', 'Tag',
       'AuthService', 'Submissiontag', 'Authorship', 'User', 'Conference', 'FileUpload',
      function($q, $scope, $anchorScroll, $state, $stateParams, Submission, Tag,
        AuthService, Submissiontag, Authorship, User, Conference, FileUpload) {

    var submissionId = parseInt($stateParams.submissionId, 10),
      conferenceId = $stateParams.conferenceId,
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
      oldTagIds = [],
      oldAuthorIds = [],
      loadSubmission = function (submissionId) {
        asyncReq.start();

        return $q.all([
          Submission.findById({
            id: submissionId,
            filter: {include: ['authors', 'tags', 'documents']
          }}).$promise,
          Authorship.find({ filter: {
            fields: ['authorId', 'orderNum'],
            where: { submissionId: submissionId }
          }}).$promise
        ])
        // Ensure that authors are in correct order. Loopback cannot handle it natively
        .then(function(r) {
          var submission = r[0],
            authorOrder = _.chain(r[1])
              .indexBy('authorId')
              .mapObject(function (v) { return v.orderNum; })
              .value();

          submission.authors = _(submission.authors).sortBy(function (author) {
            return authorOrder[author.id];
          });

          return submission;
        })
        .finally(asyncReq.end);
      },
      linkTagsToSubmission = function (submissionId) {
        return _($scope.submission.tags).map(function (tag) {
          asyncReq.start();
          return Submissiontag.create({
            tagId: tag.id,
            submissionId: submissionId
          }).$promise.finally(asyncReq.end);
        });
      },
      linkAuthorsToSubmission = function (submissionId) {
        return _.chain($scope.submission.authors)
          .filter(function (author) { return !!author && author.id > 0; })
          .map(function (author, idx) {
            asyncReq.start();
            return Authorship.create({
              authorId: author.id,
              submissionId: submissionId,
              orderNum: idx + 1,
            }).$promise.finally(asyncReq.end);
          })
          .value();
      },
      linkFileToSubmission = function (submissionId) {
        if ($scope.submission.file && $scope.submission.file.name) {
          asyncReq.start();

          return FileUpload.create(_.extend(
            { submissionId: submissionId },
            $scope.submission.file
          )).$promise.finally(asyncReq.end);
        } else {
          return $q.resolve();
        }
      },
      showFormErrors = function (formController) {
        // Show errors if the form was left untouched
        formController.title.$setDirty();
        formController.abstract.$setDirty();
        return $anchorScroll();
      },
      dropzone = new Dropzone('#submission-file', {
        paramName: 'file',
        url: '/api/containers/submissions/upload',
        acceptedFiles: 'application/pdf,.pdf',
        autoProcessQueue: true,
        addRemoveLinks: true,
        maxFiles: 1,
        init: function () {
          this.on('sending', function (dz, xhr, formData) {
            xhr.setRequestHeader('X-Access-Token', AuthService.getAccessTokenId());
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

    $scope.edit = !!$stateParams.submissionId;
    $scope.tagSuggestions = [];
    $scope.simpleMdeOptions = {
      hideIcons: ["guide", "fullscreen", "side-by-side"],
      spellChecker: false
    };

    if ($scope.edit) {
      loadSubmission(submissionId).then(function (submission) {
        oldTagIds = _(submission.tags).map(function (t) { return t.id; });
        oldAuthorIds = _(submission.authors).map(function (a) { return a.id; });

        if (submission.documents.length >= 1) {
          $scope.oldFile = submission.documents[0];
          delete submission.documents;
        }

        $scope.submission = submission;
        $scope.filterValidAuthors();
      });
    } else {
      $scope.submission = { authors: [], tags: [], file: {} };
    }

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
        .finally(asyncReq.end);
      }
    };

    $scope.addAuthorField = function (author) {
      $scope.submission.authors.push(author);
    };

    $scope.removeAuthorField = function () {
      $scope.submission.authors.pop();
    };

    $scope.hasFormError = function (formController, validIfPristine) {
      validIfPristine = validIfPristine || false;

      return formController.$submitted &&
        ((!validIfPristine && formController.$pristine) || !formController.$valid);
    };

    $scope.hasInputError = function (input) {
      return input.$dirty && _(input.$error).keys().length > 0;
    };

    $scope.createSubmission = function (formController) {
      if ($scope.hasFormError(formController)) {
        return showFormErrors(formController);
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
        var submissiontags = linkTagsToSubmission(submission.id),
          authorships = linkAuthorsToSubmission(submission.id),
          file = linkFileToSubmission(submission.id);

        // On success: Redirect user to submission overview
        $q.all(submissiontags.concat(authorships).concat([file])).then(function () {
          AuthService.setFlash('Submission was created successfully!');
          $state.go('app.protected.conference.submission.list', {
            conferenceId: conferenceId
          }, {reload: true});
        }, function (err) {
          // TODO: rollback (some of the above relations could not be created)
          // e.g. via local deleteSubmission(id) function
        });
      })
      .finally(asyncReq.end);
    };

    $scope.updateSubmission = function (formController) {
      if ($scope.hasFormError(formController, true)) {
        return showFormErrors(formController);
      }

      // Check what tags and authors have changed
      var newTagIds = _($scope.submission.tags).map(function (t) { return t.id })
        newAuthorIds = _.chain($scope.submission.authors)
          .filter(function (a) { return !!a && a.id >= 0; })
          .map(function (a) { return a.id; }).value(),
        createTagIds = _(newTagIds).difference(oldTagIds),
        createAuthorIds = _(newAuthorIds).difference(oldAuthorIds),
        deleteTagIds = _(oldTagIds).difference(newTagIds),
        deleteAuthorIds = _(oldAuthorIds).difference(newAuthorIds),
        pendingPromises = [];

      // Update submission
      if (formController.$dirty) {
        asyncReq.start();
        pendingPromises.push(Submission.patchAttributes({
          id: submissionId,
          // conferenceId: conferenceId,
          title: $scope.submission.title,
          abstract: $scope.submission.abstract
        }).$promise.finally(asyncReq.end));
      }

      // Selective deletion of relational records is buggy/impossible.
      // Strategy: When changed, delete all relational records and re-populate them afterwards
      if (deleteTagIds.length >= 1 || createTagIds.length >= 1) {
        asyncReq.start();
        Submission.tags.destroyAll({ id: submissionId }).$promise.finally(asyncReq.end);
        pendingPromises = pendingPromises.concat(linkTagsToSubmission(submissionId));
      }

      if (deleteAuthorIds.length >= 1 || createAuthorIds.length >= 1) {
        asyncReq.start();
        Submission.authors.destroyAll({ id: submissionId }).$promise.finally(asyncReq.end);
        pendingPromises = pendingPromises.concat(linkAuthorsToSubmission(submissionId))
      }

      if ($scope.submission.file) {
        asyncReq.start();
        Submission.documents.destroyAll({ id: submissionId }).$promise.finally(asyncReq.end);
        pendingPromises.push(linkFileToSubmission(submissionId));
      }

      $q.all(pendingPromises).then(function() {
        AuthService.setFlash('Submission was updated successfully!');
        $state.go('app.protected.conference.submission.list', {
          conferenceId: conferenceId
        }, {reload: true});
      }, function (err) {
        // TODO: rollback (some of the above relations could not be created)
        // e.g. via local deleteSubmission(id) function
      });
    };

    $scope.filterValidAuthors = function() {
      $scope.submission.authors = _.uniq($scope.submission.authors.filter(function (a) {
        return !!a;
      }).concat([undefined]));

      if($scope.allAuthors) {
        $scope.authors = $scope.allAuthors.filter(function (a) {
          return $scope.submission.authors.indexOf(a) === -1;
        });
      }
    };

    Conference.findById({
      id: conferenceId,
      filter: {include: ['authors']
    }})
    .$promise
    .then(function (conference) {
      // Auto suggestion lookup table
      $scope.allAuthors = _(conference.authors).map(function (author) {
        return _(author).pick('id', 'firstname', 'lastname', 'fullName', 'email');
      });

      if ($scope.edit) return;

      // Prefill current user as author
      AuthService.getUserId().then(function (userId) {
        $scope.authors = $scope.allAuthors.filter(function(a) { return a.id != userId });
        var author = _($scope.allAuthors).findWhere({id: userId});
        $scope.addAuthorField(author);
        $scope.filterValidAuthors();
      });
    });
  }]);
