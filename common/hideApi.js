module.exports = function hideApi(model, showApi) {
  var methodNames = ['__count__', '__create__', '__delete__', '__destroyById__',
    '__findById__', '__get__', '__updateById__'];

  methodNames = methodNames.filter(function(x) {
    return showApi.indexOf(x) === -1;
  });

  model.sharedClass.methods().forEach(function(method) {
    if (showApi.indexOf(method.name) === -1) {
      model.disableRemoteMethod(method.name, method.isStatic);
    }
  });

  Object.keys(model.definition.settings.relations).forEach(function(relation) {
    methodNames.forEach(function (method) {
      model.disableRemoteMethod(method + relation, false);
    });
  });
};
