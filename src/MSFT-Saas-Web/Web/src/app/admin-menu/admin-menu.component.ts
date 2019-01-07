import { Component } from '@angular/core';
import * as $ from 'jquery';
import { BreadcrumComponent } from '../breadcrum/breadcrum.component';
import { Router } from '@angular/router';
import { AppService } from '../shared/app.service';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css']
})

export class AdminMenuComponent {
  public selectedDeployment: any;
  public selectedTenant: any;
  public selectedHostPool: any;
  public selectedAllTenants: boolean = true;
  public loadMore: boolean = false;
  public hostpool: any;
  public tenantName: any;
  public tenantList: any=[];
  public displayTenantList: any=[];
  public hostPoolList: any = [];
  public selectedHostpoolName: any;
  public initialIndex: any = 0;
  public tenantLength: any = 10;
  public storeLength: any = 0;
  public tenantListLength: any;

  constructor(private router: Router, private appService: AppService) {
    if (this.tenantListLength == 1) {
      this.loadMore = false;
    }
    else {
      this.loadMore = true;
    }
  }

  public ngOnInit() {
    this.GetAllTenantsList();
  }

  /*
   * This function is used to redirect to Tenants component and empty the hostpool and tenants list in side menu
   * ----------
   * Parameters
   * data - Accepts Tenant List
   * ----------
   */
  public RedirectToTenants(data: any) {
    this.hostPoolList = [];
    this.tenantList = data;
    this.selectedTenant = null;
    this.selectedHostPool = null;
    this.router.navigate(['/admin/Tenants']);
  }

  /**
   * This method is used to get the tenant List for side menu nav
   **/
  public GetAllTenantsList() {
    let tenantGroupName = sessionStorage.getItem("TenantGroupName");
    let refreshToken = sessionStorage.getItem("Refresh_Token");
    let getTenantsUrl = this.appService.ApiUrl + '/api/Tenant/GetAllTenants?tenantGroupName=' + tenantGroupName + '&refresh_token=' + refreshToken;
    this.appService.GetTenants(getTenantsUrl).subscribe(response => {
      let responseObject = JSON.parse(response['_body']);
      this.GetAllTenants(responseObject);
      if (responseObject.length > 0) {
        if (responseObject[0]) {
          if (responseObject[0].code == "Invalid Token") {
            sessionStorage.clear();
            this.router.navigate(['/invalidtokenmessage']);
          }
        }
      }
    });
  }
 
  /**
   * This function is used  to Load all the tenants list
   * ---------
   * Parameters
   * data - Accepts Tenant List from get All TenantList Method
   * ---------
   */
  public GetAllTenants(data: any) {
    this.tenantList = [];
    this.hostPoolList = [];
    if (data == undefined || data == null) {
      this.router.navigate(['/admin/Tenants']);
    }
    else {
      this.displayTenantList = [];
      this.initialIndex = 0;
      this.tenantLength = 10;
      this.storeLength = 0;
      this.tenantList = data;
      this.tenantListLength = data.length;
      this.FilterData();
      this.hostPoolList = [];
      this.selectedTenant = null;
      this.selectedAllTenants = true;
      let path = window.location.pathname;
      let hostpoolName = sessionStorage.getItem("selectedhostpoolname");
      let tenantName = sessionStorage.getItem("TenantName");
      if (decodeURIComponent(path) == `/admin/hostpoolDashboard/${hostpoolName}`) {
        let hostpoolList = JSON.parse(sessionStorage.getItem("hostpoolList"));
        this.GetHostpools(hostpoolList, tenantName);
      }
    }
  }

  public FilterData() {
    this.loadMore = true;
    if (this.storeLength <= this.tenantListLength) {
      var index = this.initialIndex;
      this.storeLength = this.tenantLength + this.initialIndex;
      for (index; index < this.storeLength; index++) {
        if (index < this.tenantListLength) {
          this.displayTenantList.push(this.tenantList[index]);
        }
        else {
          this.loadMore = false;
          continue;
        }
      }
      this.initialIndex = index;
    }
  }

  /*
   * This function is used  to  Hightlight the Selected Tenant
   * ----------
   * Parameters
   * index - Accepts Teant Index value
   * tenantName - Accepts Tenant Name
   * ----------
   */
  public SetSelectedTenant(index: any, tenantName: any) {
    if (index == null && tenantName == '') {
      this.router.navigate(['/admin/Tenants']);
    }
    else {
      this.selectedTenant = index;
      this.selectedHostPool = null;
      this.selectedAllTenants = false;
      sessionStorage.setItem("TenantName", tenantName);
      sessionStorage.setItem("TenantNameIndex", index);
    }
  }

  /*
   * This function is used  to  get the list of hostpools
   * ----------
   * Parameters
   * hostpoolData - Accepts Hostpool List
   * tenantName -  Accepts Tenant Name
   * ----------
   */
  public GetHostpools(hostpoolData: any, tenantName: any) {
    sessionStorage.setItem("hostpoolList", JSON.stringify(hostpoolData));
    this.hostPoolList = [];
    this.hostPoolList = hostpoolData;
    let data = [{
      name: tenantName,
      type: 'Tenant',
      path: 'tenantDashboard',
    }];
    BreadcrumComponent.GetCurrentPage(data);
    let tenantIndex = +sessionStorage.getItem("TenantNameIndex");
    let hostpoolIndex = +sessionStorage.getItem("hostpoolNameIndex");
    let hostpoolName = sessionStorage.getItem("selectedhostpoolname");
    this.SetSelectedTenant(tenantIndex, tenantName);
    this.SetSelectedhostPool(hostpoolIndex, tenantName, hostpoolName);
  }

  /*
   * This function is used to trigger  On select of Hostpool
   * ----------
   * Parameters
   * index - Accepts Hostpool List
   * tenantName -  Accepts Tenant Name
   * hostpoolName - Accepts Hostpool Name
   * ----------
   */
  public SetSelectedhostPool(index: any, tenantName: any, hostpoolName: any) {
    this.selectedHostPool = index;
    this.selectedHostpoolName = hostpoolName;
    sessionStorage.setItem('selectedhostpoolname', this.selectedHostpoolName);
    sessionStorage.setItem("hostpoolNameIndex", index);
    let data = [{
      name: hostpoolName,
      type: 'Hostpool',
      path: 'hostpoolDashboard',
      TenantName: tenantName,
    }];
    BreadcrumComponent.GetCurrentPage(data);
    this.selectedAllTenants = false;
  }
}