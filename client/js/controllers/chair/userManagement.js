angular
  .module('app')
  .controller('ChairUserManagementController',
      ['$q', '$scope', '$stateParams', 'AuthService', 'User', 'Conference',
      function($q, $scope, $stateParams, AuthService, User, Conference) {
    var userList = [],
      getUsers = function () {
        AuthService.getUserId().then(function(userId) {
          Conference.findById({
            id: $stateParams.conferenceId,
            filter: { include: [
              { relation: 'attendees', scope : { fields: ['id', 'lastname', 'firstname'] }},
              { relation: 'chairs', scope: { fields: ['id'] } },
              { relation: 'authors', scope: { fields: ['id'] } },
              { relation: 'reviewer', scope: { fields: ['id'] } },
            ]}
          }).$promise.then(function (conference) {
            conference.chairs = _(conference.chairs).pluck('id');
            conference.authors = _(conference.authors).pluck('id');
            conference.reviewer = _(conference.reviewer).pluck('id');

            userList = conference.attendees.map(function (user) {
              user.isChair = conference.chairs.indexOf(user.id) !== -1;
              user.isAuthor = conference.authors.indexOf(user.id) !== -1;
              user.isReviewer = conference.reviewer.indexOf(user.id) !== -1;
              user.isMe = (user.id === userId);

              return user;
            });
            $scope.applyFilter();
          }).catch(console.error);
        });
      },
      toggleRole = function (role, denySelfRevocation) {
        var hasRoleProp = 'is' + role.charAt(0).toUpperCase() + role.substr(1).toLowerCase();
        denySelfRevocation = denySelfRevocation || false;

        return function (user) {
          if (denySelfRevocation && user.isMe) {
            user[hasRoleProp] = !user[hasRoleProp]
            return;
          }

          var linkFn = user[hasRoleProp] ? User[role].link : User[role].unlink;
          linkFn({ id: user.id, fk: $stateParams.conferenceId }, {}).$promise.then(getUsers);
        };
      };

    $scope.filteredUserList = [];
    $scope.filter = {};
    $scope.toggleAuthor = toggleRole('author');
    $scope.toggleReviewer = toggleRole('reviewer');
    $scope.toggleChair = toggleRole('chair', true);

    $scope.applyFilter = function() {
      $scope.filteredUserList = userList
        .filter(function(u) { return $scope.filter.isAuthor ? u.isAuthor : true; })
        .filter(function(u) { return $scope.filter.isReviewer ? u.isReviewer : true; })
        .filter(function(u) { return $scope.filter.isChair ? u.isChair : true; });
    };

    getUsers();
  }]);
