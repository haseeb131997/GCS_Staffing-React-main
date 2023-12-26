import GetCall from './GetCall';
import ImageUploadCall from './ImageUploadCall';
import LocationApiCall from './LocationApiCall';
import PaymentApi from './PaymentApi';
import PostCall from './PostCall';

export default {
  // Hospital Api

  hospitalLogin: (data, pass, fail) => {
    PostCall.Post('hlogin', data, pass, fail);
  },

  hospitalSignup: (data, pass, fail) => {
    PostCall.Post('hsignup', data, pass, fail);
  },

  getHProfile: (pass, fail) => {
    GetCall.Get('proffile', pass, fail);
  },

  getDiscipline: (pass, fail) => {
    GetCall.Get('discipline', pass, fail);
  },

  getExperence: (pass, fail) => {
    GetCall.Get('experence', pass, fail);
  },

  createJob: (data, pass, fail) => {
    PostCall.Post('createJobs', data, pass, fail);
  },

  getMyJobs: (pass, fail) => {
    GetCall.Get('jobs', pass, fail);
  },

  hJobDetail: (data, pass, fail) => {
    PostCall.Post('jobsDetail', data, pass, fail);
  },

  applicantsList: (data, pass, fail) => {
    PostCall.Post('viewApplicant', data, pass, fail);
  },

  getUnAssignResson: (pass, fail) => {
    GetCall.Get('unassign_applicant_dropdown', pass, fail);
  },

  unAssign: (data, pass, fail) => {
    PostCall.Post('unassign_applicant', data, pass, fail);
  },

  applicantsDetail: (data, pass, fail) => {
    PostCall.Post('applicantdetail', data, pass, fail);
  },

  troplyList: (data, pass, fail) => {
    PostCall.Post('trophy', data, pass, fail);
  },

  assignTrophy: (data, pass, fail) => {
    PostCall.Post('assignTrophy', data, pass, fail);
  },
  HpProfilePicUpdate: (data, pass, fail) => {
    PostCall.Post('hupdateProfileImage', data, pass, fail);
  },

  // Team Player Api

  signupData: (pass, fail) => {
    GetCall.Get('teamFieldType', pass, fail);
  },

  tpLogin: (data, pass, fail) => {
    PostCall.Post('ulogin', data, pass, fail);
  },

  tpSignup: (data, pass, fail) => {
    PostCall.Post('usignup', data, pass, fail);
  },

  getTPProfile: (pass, fail) => {
    GetCall.Get('profile', pass, fail);
  },

  getAllJobs: (pass, fail) => {
    GetCall.Get('joblisting', pass, fail);
  },

  applyJob: (data, pass, fail) => {
    PostCall.Post('applyjob', data, pass, fail);
  },

  myjob: (pass, fail) => {
    GetCall.Get('myjob', pass, fail);
  },

  removeJob: (data, pass, fail) => {
    PostCall.Post('removeJob', data, pass, fail);
  },
  updateProfile: (data, pass, fail) => {
    PostCall.Post('updateProfile', data, pass, fail);
  },
  updateProfilePic: (data, pass, fail) => {
    PostCall.Post('updateProfileImage', data, pass, fail);
  },
};
