module.exports = function (UserIdentity) {

  /*
   * Keep user credentials in sync after saving a user-identity
   * It checks if a UserCredentialModel with the same provider and external ID exists for that user
   * It assumes that the providername of userIdentity has suffix `-login`and of userCredentials has suffix `-link`
   *
   * @param Loopback context object
   * @param next middleware function
   * */
  UserIdentity.observe('after save', function checkUserCredentials(ctx, next){
    var data = JSON.parse(JSON.stringify(ctx.instance));

    data.provider = data.provider.replace('-login', '-link');
    delete data.id; // has to be auto-increment

    var UserCredential = UserIdentity.app.models.UserCredential;
    var filter = {where: { userId: data.userId, provider: data.provider, externalId: data.externalId }};
    UserCredential.findOrCreate(filter, data, next);
  });
};
