console.log('#OnePageWonder v1.0.0-RC.2 by @iDoMeteor :: Exporting globals');
Meteor.settings = Meteor.settings || {};
Meteor.settings.public = Meteor.settings.public || {};
// Hook up GA for iDM GA package
Meteor.settings.public.google = OPW.getConfig('google');
// TODO: Haven't decided on where to hook this yet, currently @ end of client/main.js
// Hook into Astronomer global, added just for me! :D
// Meteor.settings.public.AstronomerConfig    = OPW.getConfig('astronomer');