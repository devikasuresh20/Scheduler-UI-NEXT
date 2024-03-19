import {
  Component,
  OnInit,
  OnDestroy,
  DoCheck,
  ViewChild,
} from '@angular/core';
import { SchedulerService } from '../shared/services/scheduler.service';
import { ConfirmationService } from '../../core/services/confirmation.service';

import { BeneficiaryDetailsService } from '../../core/services/beneficiary-details.service';
import { CameraService } from '../../core/services/camera.service';
import { SetLanguageComponent } from '../../core/components/set-language.component';
import { HttpServiceService } from '../../core/services/http-service.service';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-appointment-view',
  templateUrl: './appointment-view.component.html',
  styleUrls: ['./appointment-view.component.css'],
})
export class AppointmentViewComponent implements OnInit, OnDestroy, DoCheck {
  languageComponent!: SetLanguageComponent;
  selectedSpecialization: any;
  selectedSpecialist: any;
  viewDate: any;

  specializationMaster: any;
  specialistList: any;

  beneficiaryList = [];
  filteredBeneficiaryList: any[] = [];

  pagedList = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  rowsPerPage = 5;
  activePage = 1;
  rotate = true;

  blankTable = [];
  filterTerm: string | null = null;
  currentLanguageSet: any;
  displayedColumns: string[] = [
    'sNo',
    'beneficiaryID',
    'beneficiaryName',
    'age',
    'visitCategory',
    'visitDate',
    'tCDate',
    'image',
    'actions',
  ];

  constructor(
    private schedulerService: SchedulerService,
    private cameraService: CameraService,
    public httpServiceService: HttpServiceService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit() {
    this.blankTable.length = 5;
    this.getSpecializationMaster();
    const userInfo = {
      userID: localStorage.getItem('supervisor-specialistID'),
    };
    this.selectedSpecialist = userInfo;
    this.fetchLanguageResponse();
    this.viewDate = new Date();
    this.getAllAppointment();
  }

  ngOnDestroy() {
    localStorage.removeItem('supervisor-specialistID');
  }

  getSpecializationMaster() {
    this.schedulerService.getSpecializationMaster().subscribe((res: any) => {
      if (res.statusCode === 200 && res.data) {
        this.specializationMaster = res.data;
      }
    });
  }

  getSpecialist() {
    this.selectedSpecialist = undefined;
    const providerServiceMapID = localStorage.getItem(
      'tm-providerServiceMapID',
    );
    const userID = localStorage.getItem('tm-userID');
    const specializationID = this.selectedSpecialization.specializationID;

    this.schedulerService
      .getSpecialist({ specializationID, providerServiceMapID, userID })
      .subscribe({
        next: (res: any) => {
          if (res.statusCode === 200 && res.data) {
            this.specialistList = res.data;
          } else {
            this.specialistList = [];
          }
        },
        error: (error: any) => {
          this.specialistList = [];
        },
      });
  }

  getAllAppointment() {
    const providerServiceMapID = localStorage.getItem(
      'tm-providerServiceMapID',
    );
    const userID = localStorage.getItem('tm-userID');
    const specializationID = null;
    const specialistID = this.selectedSpecialist.userID;
    let appointmentDate = new Date(this.viewDate);

    appointmentDate.setHours(23);
    appointmentDate.setMinutes(59);
    appointmentDate.setSeconds(59);
    appointmentDate.setMilliseconds(0);

    appointmentDate = new Date(
      appointmentDate.valueOf() -
        1 * appointmentDate.getTimezoneOffset() * 60 * 1000,
    );

    this.schedulerService
      .getAllAppointments({
        specializationID,
        specialistID,
        appointmentDate,
        providerServiceMapID,
        userID,
      })
      .subscribe({
        next: (res: any) => {
          if (res && res.statusCode === 200 && res.data) {
            this.filterTerm = null;
            const benlist = this.loadDataToBenList(res.data);
            this.beneficiaryList = benlist;
            this.filteredBeneficiaryList = benlist;
            this.pageChanged({
              page: this.activePage,
              itemsPerPage: this.rowsPerPage,
            });
          } else {
            this.confirmationService.alert(res.errorMessage, 'error');
          }
        },
        error: (error: any) => {
          this.confirmationService.alert(error, 'error');
        },
      });
  }

  filterBeneficiaryList(searchTerm: string | null) {
    if (!searchTerm) {
      this.filteredBeneficiaryList = this.beneficiaryList;
    } else {
      this.filteredBeneficiaryList = [];
      this.beneficiaryList.forEach((item) => {
        for (const key in item) {
          if (
            key === 'beneficiaryID' ||
            key === 'benName' ||
            key === 'genderName' ||
            key === 'age' ||
            key === 'benVisitDate' ||
            key === 'VisitCategory' ||
            key === 'benVisitNo'
          ) {
            const value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredBeneficiaryList.push(item);
              break;
            }
          }
        }
      });
    }
    this.activePage = 1;
    this.pageChanged({ page: 1, itemsPerPage: this.rowsPerPage });
  }

  loadDataToBenList(data: any) {
    data.forEach((element: any) => {
      element.genderName = element.genderName || 'Not Available';
      element.age = element.age || 'Not Available';
      element.statusMessage = element.statusMessage || 'Not Available';
      element.VisitCategory = element.VisitCategory || 'Not Available';
      element.benVisitNo = element.benVisitNo || 'Not Available';
      element.districtName = element.districtName || 'Not Available';
      element.villageName = element.villageName || 'Not Available';
      element.arrival = false;
      element.preferredPhoneNum = element.preferredPhoneNum || 'Not Available';
      element.visitDate =
        moment(element.visitDate).format('DD-MM-YYYY') || 'Not Available';
      element.benVisitDate =
        moment(element.benVisitDate).format('DD-MM-YYYY HH:mm A ') ||
        'Not Available';
      element.tCRequestDate =
        moment(element.tCRequestDate).format('DD-MM-YYYY HH:mm A ') ||
        'Not Available';
    });
    return data;
  }

  pageChanged(event: any): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedList.data = this.filteredBeneficiaryList.slice(
      startItem,
      endItem,
    );
    this.pagedList.paginator = this.paginator;
  }

  patientImageView(benregID: any) {
    this.beneficiaryDetailsService
      .getBeneficiaryImage(benregID)
      .subscribe((data: any) => {
        if (data.data && data.data.benImage)
          this.cameraService.viewImage(data.benImage);
        else
          this.confirmationService.alert(this.currentLanguageSet.imagenotfound);
      });
  }

  cancelTCRequest(beneficiary: any) {
    this.confirmationService
      .confirm(
        'info',
        this.currentLanguageSet.cancelTCrequest,
        this.currentLanguageSet.yes,
        this.currentLanguageSet.no,
      )
      .subscribe((res) => {
        if (res) {
          this.schedulerService
            .cancelBeneficiaryTCRequest({
              benflowID: beneficiary.benFlowID,
              benRegID: beneficiary.beneficiaryRegID,
              visitCode: beneficiary.visitCode,
              userID: beneficiary.tCSpecialistUserID,
              modifiedBy: localStorage.getItem('tm-userName'),
            })
            .subscribe({
              next: (res: any) => {
                if (res && res.statusCode && res.data) {
                  this.confirmationService.alert(res.data.response, 'success');
                  this.getAllAppointment();
                } else {
                  this.confirmationService.alert(res.errorMessage, 'error');
                }
              },
              error: (error: any) => {
                this.confirmationService.alert(error, 'error');
              },
            });
        }
      });
  }

  //AN40085822 27/9/2021 Integrating Multilingual Functionality --Start--
  ngDoCheck() {
    this.fetchLanguageResponse();
  }

  fetchLanguageResponse() {
    this.languageComponent = new SetLanguageComponent(this.httpServiceService);
    this.languageComponent.setLanguage();
    this.currentLanguageSet = this.languageComponent.currentLanguageObject;
  }
  //--End--
}
