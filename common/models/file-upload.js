var CONTAINERS_URL = '/api/containers/';

module.exports = function(FileUpload) {
  // From docs:
  // Since the before save hook is triggered before validators are called, you
  // can use it to ensure that empty or missing values are filled with default
  //values.
  FileUpload.observe('before save', function (ctx, next) {
    if (ctx.instance) {
      ctx.instance.url = CONTAINERS_URL + ctx.instance.container + '/download/' + ctx.instance.name;
    } else {
      ctx.data.url = CONTAINERS_URL + ctx.data.container + '/download/' + ctx.data.name;
    }
    next();
  });
};
