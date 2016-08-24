var logger = require('winston');
var commonNames = require('./commonNames.json');

module.exports = function(app, ds, callback) {
app.models.affiliation.find({fields: ['id']}, function (err, affiliations) {

  var affiliationIds = affiliations.map(function (a) { return a.id; }),
    randomAffiliationId = function() {
      return Math.floor(Math.random() * (affiliationIds.length));
    },
    conferences = [],
    author = {
      firstname: 'Anton',
      lastname: 'Autor',
      username: 'author',
      password: 'tk',
      email: 'author1@chair.de',
      emailVerified: true,
      affiliationId: randomAffiliationId()
    },
    chairs = [
      {
        firstname: 'Charlie',
        lastname: 'Chair',
        username: 'chair',
        password: 'chair',
        email: 'chairman1@chair.de',
        emailVerified: true,
        affiliationId: randomAffiliationId()
      },
      {
        firstname: 'Max',
        lastname: 'Example',
        username: 'chairman2',
        password: 'tk',
        email: 'chairman2@chair.de',
        emailVerified: true,
        affiliationId: randomAffiliationId()
      }
    ],
    attendees = new Array(100);

  for(var i=0; i < 100; i++) {
    var firstName = commonNames.firstNames[Math.floor(Math.random() * commonNames.firstNames.length)],
        lastName = commonNames.lastNames[Math.floor(Math.random() * commonNames.lastNames.length)];
    lastName = lastName.slice(0,1) + lastName.slice(1).toLowerCase();
    attendees[i] = {
      username: firstName + lastName,
      firstname: firstName,
      lastname: lastName,
      email: firstName + '.' + lastName + '@gmail.com',
      password: 'geheim',
      emailVerified: true,
      affiliationId: randomAffiliationId()
    }
  }

  app.models.conference.find({}, function (err, results) {
    results.map(function (conference, idx) {
      if (idx < chairs.length) {
        chairs[idx].defaultConferenceId = conference.id;
      }
      author.defaultConferenceId = author.defaultConferenceId || conference.id;
    });

    conferences = results;
  });

  app.models.user.create(author, function (err, model) {
    if (err) return callback(err);
    author.id = model.id;
    model.updateAttribute('defaultConferenceId', author.defaultConferenceId);
    logger.info('Author created');
  });

  app.models.user.create(chairs, function(err, users) {
    if(err) return callback(err);

    users.map(function(u, idx) {
      u.updateAttribute('defaultConferenceId', chairs[idx].defaultConferenceId);

      app.models.attendance.create({
        conferenceId: conferences[idx].id,
        attendeeId: u.id
      }, function (err, model) {
        if (!err) logger.info('Assigned attendee to conference:', u.username, conferences[idx].name);
      });

      app.models.attendance.create({
        conferenceId: conferences[idx].id,
        attendeeId: author.id
      }, function (err, model) {
        if (!err) logger.info('Assigned attendee to that conference:', author.username);
      });

      app.models.chairman.create({
        conferenceId: conferences[idx].id,
        chairId: u.id
      }, function (err, model) {
        if (!err) logger.info('Assigned chairman to that conference:', u.username);
      });

      app.models.author.create({
        conferenceId: conferences[idx].id,
        authorId: author.id
      }, function (err, model) {
        if (!err) logger.info('Assiged author to that conference:', author.username);
      });
    });

    logger.info('Created chairmans');
    callback(err);
  });

  app.models.user.create(attendees, function(err, users) {
    if(err) return callback(err);
    users.map(function(u) {
      var idx = 0;
      app.models.attendance.create({
        conferenceId: conferences[idx].id,
        attendeeId: u.id
      }, function (err, model) {
        if (!err) logger.info('Assigned attendee to conference:', u.username, conferences[idx].name);
      });
    });
  });

});
};
