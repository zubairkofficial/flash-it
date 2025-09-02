export enum DATA_TYPE {
  TEXT = 'Text',
  FILE = 'Documents',
}



export enum SUBSCRIPTION_TYPE {
  FREE = "free",
  PRO = "pro",
  TEAM = "team"
}

export enum WORKSPACE_USER_PERMISSION {
  RE = 'read-export', //can read and export //default permission to any team member
  CRUDE = 'create-read-update-delete-export', // can create, update, delete, read, export //default permission to admin
}
