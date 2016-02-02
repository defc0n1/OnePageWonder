console.log ('#OnePageWonder v1.0.0-RC.2 by @iDoMeteor :: Loading Collections');
opwAdminNotificationLog = new Meteor.Collection(opw.prefix + '-admin-notification-log');
opwContacts             = new Meteor.Collection(opw.prefix + '-contacts');
opwRows                 = new Meteor.Collection(opw.prefix + '-rows');
opwLog                  = new Meteor.Collection(opw.prefix + '-log');
opwSingletons           = new Meteor.Collection(opw.prefix + '-singletons');

if (Meteor.isServer) {

    // Publications
    Meteor.publish ('opwAdminNotificationLog', function () {
        if (this.userId) {
            return OPW.getAdminNotificationLog(false);
        } else {
            this.ready();
        }
    });

    Meteor.publish ('opwContacts', function () {
        if (this.userId) {
            return OPW.getContacts(false);
        } else {
            this.ready();
        }
    });

    Meteor.publish ('opwHomeRow', function () {
        return OPW.getHomeRow(false);
    });

    Meteor.publish ('opwRows', function () {
        return OPW.getRows(null, false);
    });

    Meteor.publish ('opwUsers', function () {
        if (this.userId) {
            return Meteor.users.find({});
        } else {
            return Meteor.users.find({}, {fields: {username: 1}});
        }
    });

    Meteor.publish ('opwSingletons', function () {
        return OPW.getSingletons(false);
    });

    // Allow models (always allow all)
    opwAdminNotificationLog.allow({
        insert: function () { return true; },
        remove: function () { return true; },
        update: function () { return true; },
    });
    opwContacts.allow({
        insert: function () { return true; },
        remove: function () { return true; },
        update: function () { return true; },
    });
    opwLog.allow({
        insert: function () { return true; },
        remove: function () { return true; },
        update: function () { return true; },
    });
    opwRows.allow({
        insert: function () { return true; },
        remove: function () { return true; },
        update: function () { return true; },
    });
    opwSingletons.allow({
        insert: function () { return true; },
        remove: function () { return true; },
        update: function () { return true; },
    });


    // Deny models (all that matter)
    opwAdminNotificationLog.deny({
        // Anyone can insert if properly formatted and unique
        insert: function (uid, doc) {
            // TODO: This is not going to work :)
            return (!OPW.isValidMailObject(doc));
        },
        // No one can remove!
        remove: function () {
            return true;
        },
        // No one can update!
        update: function () {
            return true;
        },

    });
    opwContacts.deny({

        // Anyone can insert if properly formatted and unique
        insert: function (userId, doc) {

            var whitelist = [
                'email',
                'label',
                'message',
                'phone',
                'source',
                'stamp',
                'twitter',
            ]

            // Make sure we're only getting what we expect
            if ('object' != typeof(doc)) return true;
            if (0 < _.omit(doc, whitelist).length) {
                console.log('OPW DENIAL Too many keys');
                return true;
            }

            // Label
            if ('string' != typeof(doc.label)) {
                console.log('OPW DENIAL Invalid label');
                return true;
            }

            // Message
            if ('string' != typeof(doc.phone)) {
                console.log('OPW DENIAL Invalid phone');
                return true;
            }

            // Phone
            if ('string' != typeof(doc.message)) {
                console.log('OPW DENIAL Invalid message');
                return true;
            }

            // Source
            if (false == /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(doc.source)) {
                console.log('OPW DENIAL Invalid source');
                return true;
            } else if (opwContacts.find({source: doc.source}).count()) {
                console.log('OPW DENIAL Duplicate source');
                return true;
            }

            // Stamp
            if ('object' != typeof(doc.stamp)) {
                console.log('OPW DENIAL Invalid date');
                return true;
            }

            // Contact
            if (/^.{1,255}\@[\w-.]{1,255}$/.test(doc.email)) {
                if (opwContacts.find({email: doc.email}).count()) {
                    console.log('OPW DENIAL Duplicate email request');
                    return true;
                }
                return false;
            } else if (/^@\w{1,15}$/.test(doc.twitter)) {
                if (opwContacts.find({twitter: doc.twitter}).count()) {
                    console.log('OPW DENIAL Duplicate twitter request');
                    return true;
                }
                return false;
            }

            console.log('OPW DENIAL No valid contact supplied');
            return true;

        },
        // No one can remove!
        remove: function () {
            return true;
        },
        // No one can update!
        update: function () {
            return true;
        },

    });
    opwLog.deny({
        // Anyone can insert if properly formatted and unique
        insert: function (uid, doc) {
            // TODO: Validate & add uid
            return false;
        },
        // No one can remove!
        remove: function () {
            return true;
        },
        // No one can update!
        update: function () {
            return true;
        },

    });
    opwRows.deny({

        // Only if logged in
        insert: function () {
            return (Meteor.userId()) ? false : true; // TODO: Validate here
        },
        // No!
        remove: function () {
            return true;
        },
        // Only if logged in
        update: function () {
            return (Meteor.userId()) ? false : true; // TODO: Validate here
        },

    });

    opwSingletons.deny({

        // Only if logged in
        insert: function () {
            return (Meteor.userId()) ? false : true; // TODO: Validate here
        },
        // No!
        remove: function () {
            return true;
        },
        // Only if logged in
        update: function () {
            return (Meteor.userId()) ? false : true; // TODO: Validate here
        },

    });

}