Accounts.onCreateUser(function (options, user) {
  // We still want the default hook's 'profile' behavior.
  if (options.profile)
    user.profile = options.profile;

  // Extra fields we want to save to the user before creation.

  return user;
});

// Google login.
ServiceConfiguration.configurations.update(
  {"service": "google"},
  {
    $set: {
      "clientId": "196559834343-3ssveu3j1oqqd3lav6ugej6p419uqpal.apps.googleusercontent.com",
      "secret": "2f0CfklUfFrfvMVdQT2EuVDV"
    }
  },
  {upsert: true}
);