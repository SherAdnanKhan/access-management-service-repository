const ErrorResponse = require("../util/errorResponse");
const { applications } = require("../util/helper");
const { getLocations } = require("../mysql/queries/bpoQuery");
const { getActivateStatus, updateActivateStatus, createActivateUser } = require('../mysql/queries/activateQuery');
const { getAnnouncementStatus, updateAnnouncementStatus, createAnnouncementUser } = require("../mysql/queries/announcementQuery");
const { getAvayaLogoutStatus, updateAvayaLogoutStatus, createAvayaLogoutUser } = require("../mysql/queries/avayalogoutQuery");
const { getHelpDeskStatus, updateHelpDeskStatus, createHelpDeskUser } = require("../mysql/queries/helpdeskQuery");
const { getSdotpStatus, updateSdotpStatus, createSdotpUser } = require("../mysql/queries/sdotpQuery");
const { getWifiGuestStatus, updateWifiGuestStatus, createWifiGuestUser } = require("../mysql/queries/wifiguestQuery");

// All Business logic will be here
class ApplicationService {

    async getApplications() {
        try {
            return applications;
        } catch (err) {
            throw new ErrorResponse('Applications not found', 404);
        }
    }

    async getLocations() {
        try {
            return getLocations();
        } catch (err) {
            throw new ErrorResponse('Locations not found', 404);
        }
    }

    async applicationRoles(id) {

        try {
            let roles = [];
            const applicationRoles = applications.filter((app) => (
                app.name === id
            ));
            console.log('1111');
            console.log(applicationRoles);
            if (applicationRoles && applicationRoles[0].roles) {
                roles = applicationRoles[0].roles;
            }
            return roles;

        } catch (err) {
            throw new ErrorResponse(err, 404);
        }
    }

    async getStatus(id, application) {
        try {
            // Get status by application and role
            let applicationStatus = null;
            let result = null;

            if (application === 'activate') {
                result = await getActivateStatus(id);

                if (!result || result.length < 1) {
                    throw (`User Not Found!`);
                }
                applicationStatus = result[0].active ? true : false;
            }
            else if (application === 'announcement') {
                result = await getAnnouncementStatus(id);
                if (!result || result.length < 1) {
                    throw (`User Not Found!`);
                }
                applicationStatus = result[0].active ? true : false;
            }
            else if (application === 'avayalogout') {
                result = await getAvayaLogoutStatus(id);
                if (!result || result.length < 1) {
                    throw (`User Not Found!`);
                }
                applicationStatus = result[0].active ? true : false;
            }
            else if (application === 'helpdesk') {
                result = await getHelpDeskStatus(id);
                if (!result || result.length < 1) {
                    throw (`User Not Found!`);
                }
                applicationStatus = result[0].Status ? true : false;
            }
            else if (application === 'sdotp') {
                result = await getSdotpStatus(id);
                if (!result || result.length < 1) {
                    throw (`User Not Found!`);
                }
                applicationStatus = result[0].active ? true : false;
            }
            else if (application === 'wifiguest') {
                result = await getWifiGuestStatus(id);
                if (!result || result.length < 1) {
                    throw (`User Not Found!`);
                }
                applicationStatus = result[0].active ? true : false;
            }
            else {
                throw (`Application not found`);
            }
            return applicationStatus;

        } catch (err) {
            throw new ErrorResponse(err, 404);
        }
    };


    async createUser(user, application, permission) {
        // Update status by application and role
        let userStatus = null;

        if (application === 'activate') {
            userStatus = await createActivateUser(true, user, permission);
        }
        else if (application === 'announcement') {
            userStatus = await createAnnouncementUser(true, user, permission);
        }
        else if (application === 'avayalogout') {
            userStatus = await createAvayaLogoutUser(true, user, permission);
        }
        else if (application === 'helpdesk') {
            userStatus = await createHelpDeskUser(true, user, permission);
        }
        else if (application === 'sdotp') {
            userStatus = await createSdotpUser(true, user, permission);
        }
        else if (application === 'wifiguest') {
            userStatus = await createWifiGuestUser(true, user, permission);
        }
        else {
            throw new ErrorResponse(`Application not found`, 404);
        }
        return userStatus;
    };

    
    async updateStatus(status, id, application){
        // Update status by application
        let applicationStatus = null;

        if (application === 'activate') {
            applicationStatus = await updateActivateStatus(status, id);
        }
        else if (application === 'announcement') {
            applicationStatus = await updateAnnouncementStatus(status, id);
        }
        else if (application === 'avayalogout') {
            applicationStatus = await updateAvayaLogoutStatus(status, id);
        }
        else if (application === 'helpdesk') {
            applicationStatus = await updateHelpDeskStatus(status, id);
        }
        else if (application === 'sdotp') {
            applicationStatus = await updateSdotpStatus(status, id);
        }
        else if (application === 'wifiguest') {
            applicationStatus = await updateWifiGuestStatus(status, id);
        }
        else {
            throw new ErrorResponse(`Application not found`, 404);
        }
        return applicationStatus;
    };

}

module.exports = ApplicationService;