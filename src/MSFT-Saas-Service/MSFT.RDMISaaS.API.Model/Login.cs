﻿#region "Import Namespaces"
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
#endregion "Import Namespaces"

#region "MSFT.RDMISaaS.API.Model"
namespace MSFT.RDMISaaS.API.Model
{
    #region "Class - Login"
    public class Login
    {
       
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Access_Token { get; set; }
        public string Id_Token { get; set; }
        public string Refresh_Token { get; set; }
        public string Code { get; set; }

        public RdMgmtRoleAssignment RoleAssignment { get; set; }
        public string TenantGroupName { get; set; }
    }
    #endregion

}
#endregion