module.exports = function(Conference) {
  Conference.validatesUniquenessOf('name');
};
