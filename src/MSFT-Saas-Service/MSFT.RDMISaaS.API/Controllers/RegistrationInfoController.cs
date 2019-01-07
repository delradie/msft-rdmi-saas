﻿#region "Import Namespaces"
using MSFT.RDMISaaS.API.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MSFT.RDMISaaS.API.BLL;
using System.Web.Http.Cors;
#endregion "Import Namespaces"

#region "MSFT.RDMISaaS.API.Controllers"
namespace MSFT.RDMISaaS.API.Controllers
{

    [EnableCors(origins: "*", headers: "*", methods: "*")]

    #region "RegistrationInfoController"
    public class RegistrationInfoController : ApiController
    {
        #region "class level declaration"
        RegistrationInfoBL registrationInfobl = new RegistrationInfoBL();
        RegistrationInfoResult infoResult = new RegistrationInfoResult();
        Common.Common common = new Common.Common();
        Common.Configurations configurations = new Common.Configurations();
        string deploymentUrl = "";
        string invalidToken = Constants.invalidToken.ToString().ToLower();
        string invalidCode = Constants.invalidCode.ToString().ToLower();
        #endregion

        #region "Functions/Methods"
        /// <summary>
        /// Description - Exports a Rds RegistrationInfo associated with  Tenant and HostPool specified in the Rds context.
        /// </summary>
        /// <param name="tenantName">Name of Tenant</param>
        /// <param name="hostPoolName">Name of Hostpool</param>
        /// <param name="refresh_token">Reffesh token to get access token</param>
        /// <returns></returns>
        public RdMgmtRegistrationInfo GetRegistrationInfo(string tenantGroupName,string tenantName, string hostPoolName, string refresh_token)
        {
            //get deployment url
            deploymentUrl = configurations.rdBrokerUrl;
            RdMgmtRegistrationInfo registrationInfo = new RdMgmtRegistrationInfo();
            try
            {
                if (!string.IsNullOrEmpty(refresh_token))
                {
                    string accessToken = "";
                    //get token value
                    accessToken = common.GetTokenValue(refresh_token);
                    if (!string.IsNullOrEmpty(accessToken) && accessToken.ToString().ToLower() != invalidToken && accessToken.ToString().ToLower() != invalidCode)
                    {
                        registrationInfo = registrationInfobl.GetRegistrationInfo(tenantGroupName,deploymentUrl, accessToken, tenantName, hostPoolName);
                    }
                    else
                    {
                        registrationInfo.code = Constants.invalidToken;
                    }
                }
            }
            catch 
            {
                return null;
            }
            return registrationInfo;
        }

        /// <summary>
        /// Description : Creates a new Rds RegistrationInfo within a Tenant and HostPools specified in the Rds context
        /// </summary>
        /// <param name="rdMgmtRegistrationInfo"> refistration info class</param>
        /// <returns></returns>
        public IHttpActionResult Post([FromBody] RdMgmtRegistrationInfo rdMgmtRegistrationInfo)
        {
            //get deployment url
            deploymentUrl = configurations.rdBrokerUrl;
            try
            {
                if (rdMgmtRegistrationInfo != null)
                {
                    if (!string.IsNullOrEmpty(rdMgmtRegistrationInfo.refresh_token))
                    {
                        string token = "";
                        //get token value
                        token = common.GetTokenValue(rdMgmtRegistrationInfo.refresh_token);
                        if (!string.IsNullOrEmpty(token) && token.ToString().ToLower() != invalidToken && token.ToString().ToLower() != invalidCode)
                        {
                            infoResult = registrationInfobl.CreateRegistrationInfo(deploymentUrl, token, rdMgmtRegistrationInfo);
                        }
                        else
                        {
                            infoResult.isSuccess = false;
                            infoResult.message = Constants.invalidToken;
                        }
                    }
                }
                else
                {
                    infoResult.isSuccess = false;
                    infoResult.message = Constants.invalidDataMessage;
                }
            }
            catch (Exception ex)
            {
                infoResult.isSuccess = false;
                infoResult.message ="Registration key has not been generated."+ex.Message.ToString()+" Please try again later.";
            }
            return Ok(infoResult);
        }

        /// <summary>
        /// Description : Removes a Rds RegistrationInfo associated with the Tenant and HostPool specified in the Rds context
        /// </summary>
        /// <param name="tenantName">Name of Tenant</param>
        /// <param name="hostPoolName">Name of Hostpool</param>
        /// <param name="refresh_token">Refresh token to get access token</param>
        /// <returns></returns>
        public IHttpActionResult Delete([FromUri] string tenantGroupName,string tenantName, string hostPoolName, string refresh_token)
        {
            //get deployment url
            deploymentUrl = configurations.rdBrokerUrl;
            try
            {
                if (!string.IsNullOrEmpty(refresh_token))
                {
                    string token = "";
                    //get token value
                    token = common.GetTokenValue(refresh_token);
                    if (!string.IsNullOrEmpty(token) && token.ToString().ToLower() != invalidToken && token.ToString().ToLower() != invalidCode)
                    {
                        infoResult = registrationInfobl.DeleteRegistrationInfo(tenantGroupName,deploymentUrl, token, tenantName, hostPoolName);
                    }
                    else
                    {
                        infoResult.isSuccess = false;
                        infoResult.message = Constants.invalidToken;
                    }
                }
            }
            catch (Exception ex)
            {
                infoResult.isSuccess = false;
                infoResult.message = "Registration key has not been deleted."+ex.Message.ToString()+" Please try again later.";
            }
            return Ok(infoResult);
        }
        #endregion
    }
    #endregion

}
#endregion