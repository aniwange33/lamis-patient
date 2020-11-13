import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@alfresco/adf-core';
import { AppLoaderService } from '@lamis/web-core';
import * as moment_ from 'moment';
const moment = moment_;
let ClientStatusComponent = class ClientStatusComponent {
    constructor(patientService, activatedRoute, router, notification, appLoaderService) {
        this.patientService = patientService;
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.notification = notification;
        this.appLoaderService = appLoaderService;
        this.facilities = [];
        this.statusDates = [];
        this.today = moment();
        this.statuses = ['TRACED_UNABLE_TO_LOCATE', 'TRACED_AGREED_TO_RETURN_TO_CARE', 'DID_NOT_ATTEMPT_TO_TRACE'];
    }
    createEntity() {
        return {};
    }
    ngOnInit() {
        this.isSaving = false;
        this.patientService.getActiveFacility().subscribe(fac => {
            this.patientService.getAllFacility().subscribe(res => {
                this.facilities = res.map(f => f.name).filter(f => f != fac.name);
            });
        });
        this.activatedRoute.data.subscribe(({ entity }) => {
            this.entity = !!entity && entity.body ? entity.body : entity;
            if (this.entity === undefined) {
                this.entity = this.createEntity();
            }
            const patientId = this.activatedRoute.snapshot.paramMap.get('patientId');
            this.patientService.findByUuid(patientId).subscribe((res) => {
                this.entity.patient = res.body;
                this.patient = res.body;
                this.entity.facility = res.body.facility;
                this.patientService.getStatusDatesByPatient(res.body.id).subscribe((res) => {
                    this.statusDates = res;
                });
            });
            if (this.entity.id) {
                this.patientService.getStatusName(this.entity.id).subscribe(res => this.status = res);
                if (this.entity && this.entity.extra) {
                    this.facilityTransferredTo = this.entity.extra.facilityTransferredTo;
                }
            }
        });
    }
    change(input) {
        if (input) {
            this.facilities = this.facilities.filter(f => f.toLowerCase().includes(input.toLowerCase()));
        }
    }
    filterDates(date) {
        let exists = false;
        this.statusDates.forEach(d => {
            if (date.diff(d, 'days') === 0) {
                exists = true;
            }
        });
        return (this.entity.id && date.diff(this.entity.dateStatus, 'days') === 0) || !exists;
    }
    previousState() {
        window.history.back();
    }
    save() {
        this.appLoaderService.open('Saving Client status update...');
        this.isSaving = true;
        if (!this.entity.extra) {
            this.entity.extra = {};
        }
        this.entity.extra.facilityTransferredTo = this.facilityTransferredTo;
        if (this.statuses.includes(this.entity.status)) {
            this.entity.outcome = this.entity.status;
            this.entity.status = null;
        }
        if (this.entity.id !== undefined) {
            this.subscribeToSaveResponse(this.patientService.updateClientStatus(this.entity));
        }
        else {
            this.subscribeToSaveResponse(this.patientService.saveClientStatus(this.entity));
        }
    }
    subscribeToSaveResponse(result) {
        result.subscribe((res) => this.onSaveSuccess(res.body), (res) => {
            this.appLoaderService.close();
            this.onSaveError();
            this.onError(res.message);
        });
    }
    onSaveSuccess(result) {
        this.appLoaderService.close();
        this.isSaving = false;
        this.notification.showInfo('Client status update successfully saved');
        this.previousState();
    }
    onSaveError() {
        this.isSaving = false;
        this.notification.showError('Error saving status update');
    }
    onError(errorMessage) {
        this.isSaving = false;
        this.notification.showError(errorMessage);
    }
};
ClientStatusComponent.ctorParameters = () => [
    { type: PatientService },
    { type: ActivatedRoute },
    { type: Router },
    { type: NotificationService },
    { type: AppLoaderService }
];
ClientStatusComponent = tslib_1.__decorate([
    Component({
        selector: 'client-status',
        template: "<script src=\"patient-details.component.ts\"></script>\n<div class=\"lamis-edit-form\">\n    <div class=\"lamis-edit-form-container\">\n        <form name=\"form\" role=\"form\" novalidate (ngSubmit)=\"save()\" #statusForm=\"ngForm\">\n            <mat-card class=\"default\">\n                <mat-card-content *ngIf=\"patient\">\n                    <div>\n                        <mat-form-field class=\"full-width\" *ngIf=\"entity\">\n                            <input matInput [matDatepicker]=\"picker\"\n                                   placeholder=\"{{entity.id ? 'Date of Status' : 'Date of New Status'}}\"\n                                   [(ngModel)]=\"entity.dateStatus\"\n                                   [matDatepickerFilter]=\"filterDates.bind(this)\"\n                                   #visit=\"ngModel\"\n                                   [max]=\"today\"\n                                   [min]=\"patient.dateRegistration\"\n                                   name=\"visit\"\n                                   required>\n                            <mat-datepicker-toggle\n                                    matSuffix\n                                    [for]=\"picker\">\n                            </mat-datepicker-toggle>\n                            <mat-datepicker #picker></mat-datepicker>\n                            <mat-error\n                                    *ngIf=\"visit.errors && (visit.dirty || visit.touched) && (visit.errors.required)\">\n                                Date of new status is required\n                            </mat-error>\n                            <mat-error\n                                    *ngIf=\"visit.errors && (visit.dirty || visit.touched) && (visit.errors.min)\">\n                                Date of new status cannot be before {{entity.patient.dateRegistration}}\n                            </mat-error>\n                            <mat-error\n                                    *ngIf=\"visit.errors && (visit.dirty || visit.touched) && (visit.errors.max)\">\n                                Date of new status cannot be in the future\n                            </mat-error>\n                        </mat-form-field>\n                    </div>\n                    <div>\n                        <mat-form-field class=\"full-width\">\n                            <mat-select [(ngModel)]=\"entity.status\"\n                                        placeholder=\"{{entity.id ? 'Status' : 'New Status'}}\"\n                                        #outcome=\"ngModel\" required name=\"outcome\">\n                                <mat-option></mat-option>\n                                <mat-option [value]=\"'ART_TRANSFER_OUT'\">ART Transfer Out</mat-option>\n                                <mat-option [value]=\"'PRE_ART_TRANSFER_OUT'\">Pre-ART Transfer Out</mat-option>\n                                <mat-option [value]=\"'STOPPED_TREATMENT'\">Stopped Treatment</mat-option>\n                                <mat-option [value]=\"'KNOWN_DEATH'\">Died (Confirmed)</mat-option>\n                                <mat-option [value]=\"'PREVIOUSLY_UNDOCUMENTED_TRANSFER_CONFIRMED'\">Previously\n                                    Undocumented Patient Transfer (Confirmed)\n                                </mat-option>\n                                <mat-option [value]=\"'TRACED_UNABLE_TO_LOCATE'\">Traced Patient (Unable to locate)\n                                </mat-option>\n                                <mat-option [value]=\"'TRACED_AGREED_TO_RETURN_TO_CARE'\">Traced Patient and agreed to\n                                    return to care\n                                </mat-option>\n                                <mat-option [value]=\"'DID_NOT_ATTEMPT_TO_TRACE'\">Did Not Attempt to Trace Patient\n                                </mat-option>\n                            </mat-select>\n                            <mat-error\n                                    *ngIf=\"outcome.errors && (outcome.dirty || outcome.touched) && (outcome.errors.required)\">\n                                New Status is required\n                            </mat-error>\n                        </mat-form-field>\n                    </div>\n                    <div class=\"row\" *ngIf=\"entity.outcome && entity.outcome.indexOf('TRACE') !== -1\">\n                        <div class=\"col-md-6\">\n                            <mat-form-field class=\"full-width\">\n                                <input matInput [matDatepicker]=\"picker1\"\n                                       placeholder=\"Date of Tracked\"\n                                       [(ngModel)]=\"entity.dateTracked\"\n                                       #tracked=\"ngModel\"\n                                       [min]=\"entity.patient.dateRegistration\"\n                                       [max]=\"entity.dateStatus\"\n                                       name=\"tracked\"\n                                       required>\n                                <mat-datepicker-toggle\n                                        matSuffix\n                                        [for]=\"picker1\">\n                                </mat-datepicker-toggle>\n                                <mat-datepicker #picker1></mat-datepicker>\n                                <mat-error\n                                        *ngIf=\"tracked.errors && (tracked.dirty || tracked.touched) && (tracked.errors.required)\">\n                                    Date tracked is required\n                                </mat-error>\n                            </mat-form-field>\n                        </div>\n                        <div class=\"col-md-6\" *ngIf=\"entity.outcome === 'TRACED_AGREED_TO_RETURN_TO_CARE'\">\n                            <mat-form-field class=\"full-width\">\n                                <input matInput [matDatepicker]=\"picker2\"\n                                       placeholder=\"Date Agreed to Return\"\n                                       [(ngModel)]=\"entity.agreedDate\"\n                                       #agreed=\"ngModel\"\n                                       [min]=\"entity.dateStatus\"\n                                       name=\"agreed\"\n                                       required>\n                                <mat-datepicker-toggle\n                                        matSuffix\n                                        [for]=\"picker2\">\n                                </mat-datepicker-toggle>\n                                <mat-datepicker #picker2></mat-datepicker>\n                                <mat-error\n                                        *ngIf=\"agreed.errors && (agreed.dirty || agreed.touched) && (agreed.errors.required)\">\n                                    Date of agreed to return is required\n                                </mat-error>\n                            </mat-form-field>\n                        </div>\n                    </div>\n                    <div *ngIf=\"entity.status === 'ART_TRANSFER_OUT'\">\n                        <mat-form-field class=\"full-width\">\n                            <input matInput type=\"text\" placeholder=\"Facility Transferred To\"\n                                   required name=\"fac\" #fac=\"ngModel\"\n                                   [(ngModel)]=\"facilityTransferredTo\"\n                                   (input)=\"change($event.target.value)\"\n                                   [matAutocomplete]=\"auto\">\n                            <mat-autocomplete #auto=\"matAutocomplete\">\n                                <mat-option *ngFor=\"let facility of facilities\"\n                                            [value]=\"facility\">{{facility}}</mat-option>\n                            </mat-autocomplete>\n                            <mat-error\n                                    *ngIf=\"fac.errors && (fac.dirty || fac.touched) && (fac.errors.required)\">\n                                Facility transferred to is required\n                            </mat-error>\n                        </mat-form-field>\n                    </div>\n                    <div *ngIf=\"entity.status === 'KNOWN_DEATH'\">\n                        <mat-form-field class=\"full-width\">\n                            <mat-select [(ngModel)]=\"entity.causeOfDeath\"\n                                        placeholder=\"Cause of Death\"\n                                        #death=\"ngModel\" required name=\"death\">\n                                <mat-option></mat-option>\n                                <mat-option [value]=\"'HIV disease resulting in TB'\">HIV disease resulting in TB\n                                </mat-option>\n                                <mat-option [value]=\"'HIV disease resulting in cancer'\">HIV disease resulting in\n                                    cancer\n                                </mat-option>\n                                <mat-option [value]=\"'HIV disease resulting in other infectious and parasitic disease'\">\n                                    HIV disease resulting in other infectious and parasitic disease\n                                </mat-option>\n                                <mat-option\n                                        [value]=\"'Other HIV disease resulting in other disease or conditions leading to death'\">\n                                    Other HIV disease resulting in other disease or conditions leading to death\n                                </mat-option>\n                                <mat-option [value]=\"'Other natural causes'\">Other natural causes</mat-option>\n                                <mat-option [value]=\"'Non-natural causes'\">Non-natural causes</mat-option>\n                                <mat-option [value]=\"'Unknown cause'\">Unknown cause</mat-option>\n                            </mat-select>\n                            <mat-error\n                                    *ngIf=\"death.errors && (death.dirty || death.touched) && (death.errors.required)\">\n                                Cause of death is required\n                            </mat-error>\n                        </mat-form-field>\n                    </div>\n                    <div *ngIf=\"entity.status === 'STOPPED_TREATMENT'\">\n                        <mat-form-field class=\"full-width\">\n                            <mat-select [(ngModel)]=\"entity.reasonForInterruption\"\n                                        placeholder=\"Reason for Interruption\"\n                                        #interrupt=\"ngModel\" required name=\"interrupt\">\n                                <mat-option></mat-option>\n                                <mat-option [value]=\"'Toxicity/side effect'\">Toxicity /side effect</mat-option>\n                                <mat-option [value]=\"'Pregnancy'\">Pregnancy</mat-option>\n                                <mat-option [value]=\"'Treatment failure'\">Treatment failure</mat-option>\n                                <mat-option [value]=\"'Poor adherence'\">Poor adherence</mat-option>\n                                <mat-option [value]=\"'Illness, hospitalization'\">Illness, hospitalization</mat-option>\n                                <mat-option [value]=\"'Drug out of stock'\">Drug out of stock</mat-option>\n                                <mat-option [value]=\"'Patient lacks finances'\">Patient lacks finances</mat-option>\n                                <mat-option [value]=\"'Other patient decision'\">Other patient decision</mat-option>\n                                <mat-option [value]=\"'Planned Rx interruption'\">Planned Rx interruption</mat-option>\n                                <mat-option [value]=\"'Other'\">Other</mat-option>\n                            </mat-select>\n                            <mat-error\n                                    *ngIf=\"interrupt.errors && (interrupt.dirty || interrupt.touched) && (interrupt.errors.required)\">\n                                Reason for interruption is required\n                            </mat-error>\n                        </mat-form-field>\n                    </div>\n                    <mat-divider></mat-divider>\n                </mat-card-content>\n                <mat-card-actions class=\"lamis-edit-form-actions\">\n                    <button mat-raised-button type=\"button\" (click)=\"previousState()\">Back</button>\n                    <button mat-raised-button color='primary'\n                            [disabled]=\"statusForm.invalid\"\n                            type=\"submit\">\n                        {{entity.id !== undefined ? 'Update' : 'Save'}}\n                    </button>\n                </mat-card-actions>\n            </mat-card>\n        </form>\n    </div>\n</div>\n"
    }),
    tslib_1.__metadata("design:paramtypes", [PatientService, ActivatedRoute, Router,
        NotificationService, AppLoaderService])
], ClientStatusComponent);
export { ClientStatusComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LXN0YXR1cy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9sYW1pcy1wYXRpZW50LTEuNC4xLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvY2xpZW50LXN0YXR1cy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQVMsTUFBTSxlQUFlLENBQUM7QUFDaEQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQzNELE9BQU8sRUFBQyxjQUFjLEVBQUUsTUFBTSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDdkQsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDdkQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFakQsT0FBTyxLQUFLLE9BQU8sTUFBTSxRQUFRLENBQUM7QUFLbEMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDO0FBTXZCLElBQWEscUJBQXFCLEdBQWxDLE1BQWEscUJBQXFCO0lBVzlCLFlBQW9CLGNBQThCLEVBQVUsY0FBOEIsRUFBVSxNQUFjLEVBQzlGLFlBQWlDLEVBQVUsZ0JBQWtDO1FBRDdFLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDOUYsaUJBQVksR0FBWixZQUFZLENBQXFCO1FBQVUscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQVBqRyxlQUFVLEdBQWEsRUFBRSxDQUFDO1FBRTFCLGdCQUFXLEdBQWEsRUFBRSxDQUFDO1FBQzNCLFVBQUssR0FBRyxNQUFNLEVBQUUsQ0FBQztRQUNqQixhQUFRLEdBQUcsQ0FBQyx5QkFBeUIsRUFBRSxpQ0FBaUMsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO0lBSXRHLENBQUM7SUFFRCxZQUFZO1FBQ1IsT0FBc0IsRUFBRSxDQUFDO0lBQzdCLENBQUM7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SUFDOUMsQ0FBQztDQUNKLENBQUE7O1lBMUd1QyxjQUFjO1lBQTBCLGNBQWM7WUFBa0IsTUFBTTtZQUNoRixtQkFBbUI7WUFBNEIsZ0JBQWdCOztBQVp4RixxQkFBcUI7SUFKakMsU0FBUyxDQUFDO1FBQ1AsUUFBUSxFQUFFLGVBQWU7UUFDekIsc2xaQUE2QztLQUNoRCxDQUFDOzZDQVlzQyxjQUFjLEVBQTBCLGNBQWMsRUFBa0IsTUFBTTtRQUNoRixtQkFBbUIsRUFBNEIsZ0JBQWdCO0dBWnhGLHFCQUFxQixDQXFIakM7U0FySFkscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIE9uSW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1BhdGllbnRTZXJ2aWNlfSBmcm9tICcuLi9zZXJ2aWNlcy9wYXRpZW50LnNlcnZpY2UnO1xuaW1wb3J0IHtBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHtOb3RpZmljYXRpb25TZXJ2aWNlfSBmcm9tICdAYWxmcmVzY28vYWRmLWNvcmUnO1xuaW1wb3J0IHtBcHBMb2FkZXJTZXJ2aWNlfSBmcm9tICdAbGFtaXMvd2ViLWNvcmUnO1xuaW1wb3J0IHtQYXRpZW50LCBTdGF0dXNIaXN0b3J5fSBmcm9tICcuLi9tb2RlbC9wYXRpZW50Lm1vZGVsJztcbmltcG9ydCAqIGFzIG1vbWVudF8gZnJvbSAnbW9tZW50JztcbmltcG9ydCB7TW9tZW50fSBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHtIdHRwRXJyb3JSZXNwb25zZSwgSHR0cFJlc3BvbnNlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuXG5jb25zdCBtb21lbnQgPSBtb21lbnRfO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2NsaWVudC1zdGF0dXMnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9jbGllbnQtc3RhdHVzLmNvbXBvbmVudC5odG1sJ1xufSlcbmV4cG9ydCBjbGFzcyBDbGllbnRTdGF0dXNDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIGlzU2F2aW5nOiBib29sZWFuO1xuICAgIGVudGl0eTogU3RhdHVzSGlzdG9yeTtcbiAgICBwYXRpZW50OiBQYXRpZW50O1xuICAgIHN0YXR1czogc3RyaW5nO1xuICAgIGZhY2lsaXRpZXM6IHN0cmluZ1tdID0gW107XG4gICAgZmFjaWxpdHlUcmFuc2ZlcnJlZFRvOiBzdHJpbmc7XG4gICAgc3RhdHVzRGF0ZXM6IE1vbWVudFtdID0gW107XG4gICAgdG9kYXkgPSBtb21lbnQoKTtcbiAgICBzdGF0dXNlcyA9IFsnVFJBQ0VEX1VOQUJMRV9UT19MT0NBVEUnLCAnVFJBQ0VEX0FHUkVFRF9UT19SRVRVUk5fVE9fQ0FSRScsICdESURfTk9UX0FUVEVNUFRfVE9fVFJBQ0UnXTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGF0aWVudFNlcnZpY2U6IFBhdGllbnRTZXJ2aWNlLCBwcml2YXRlIGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSwgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICAgICAgICAgICAgICBwcml2YXRlIG5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uU2VydmljZSwgcHJpdmF0ZSBhcHBMb2FkZXJTZXJ2aWNlOiBBcHBMb2FkZXJTZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgY3JlYXRlRW50aXR5KCk6IFN0YXR1c0hpc3Rvcnkge1xuICAgICAgICByZXR1cm4gPFN0YXR1c0hpc3Rvcnk+e307XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaXNTYXZpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5wYXRpZW50U2VydmljZS5nZXRBY3RpdmVGYWNpbGl0eSgpLnN1YnNjcmliZShmYWMgPT4ge1xuICAgICAgICAgICAgdGhpcy5wYXRpZW50U2VydmljZS5nZXRBbGxGYWNpbGl0eSgpLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZmFjaWxpdGllcyA9IHJlcy5tYXAoZiA9PiBmLm5hbWUpLmZpbHRlcihmID0+IGYgIT0gZmFjLm5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmFjdGl2YXRlZFJvdXRlLmRhdGEuc3Vic2NyaWJlKCh7ZW50aXR5fSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbnRpdHkgPSAhIWVudGl0eSAmJiBlbnRpdHkuYm9keSA/IGVudGl0eS5ib2R5IDogZW50aXR5O1xuICAgICAgICAgICAgaWYgKHRoaXMuZW50aXR5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVudGl0eSA9IHRoaXMuY3JlYXRlRW50aXR5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwYXRpZW50SWQgPSB0aGlzLmFjdGl2YXRlZFJvdXRlLnNuYXBzaG90LnBhcmFtTWFwLmdldCgncGF0aWVudElkJyk7XG4gICAgICAgICAgICB0aGlzLnBhdGllbnRTZXJ2aWNlLmZpbmRCeVV1aWQocGF0aWVudElkKS5zdWJzY3JpYmUoKHJlcykgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZW50aXR5LnBhdGllbnQgPSByZXMuYm9keTtcbiAgICAgICAgICAgICAgICB0aGlzLnBhdGllbnQgPSByZXMuYm9keTtcbiAgICAgICAgICAgICAgICB0aGlzLmVudGl0eS5mYWNpbGl0eSA9IHJlcy5ib2R5LmZhY2lsaXR5O1xuICAgICAgICAgICAgICAgIHRoaXMucGF0aWVudFNlcnZpY2UuZ2V0U3RhdHVzRGF0ZXNCeVBhdGllbnQocmVzLmJvZHkuaWQpLnN1YnNjcmliZSgocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzRGF0ZXMgPSByZXM7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuZW50aXR5LmlkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXRpZW50U2VydmljZS5nZXRTdGF0dXNOYW1lKHRoaXMuZW50aXR5LmlkKS5zdWJzY3JpYmUocmVzID0+IHRoaXMuc3RhdHVzID0gcmVzKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVudGl0eSAmJiB0aGlzLmVudGl0eS5leHRyYSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZhY2lsaXR5VHJhbnNmZXJyZWRUbyA9IHRoaXMuZW50aXR5LmV4dHJhLmZhY2lsaXR5VHJhbnNmZXJyZWRUbztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNoYW5nZShpbnB1dDogc3RyaW5nKSB7XG4gICAgICAgIGlmIChpbnB1dCkge1xuICAgICAgICAgICAgdGhpcy5mYWNpbGl0aWVzID0gdGhpcy5mYWNpbGl0aWVzLmZpbHRlcihmID0+IGYudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhpbnB1dC50b0xvd2VyQ2FzZSgpKSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbHRlckRhdGVzKGRhdGU6IE1vbWVudCk6IGJvb2xlYW4ge1xuICAgICAgICBsZXQgZXhpc3RzID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5zdGF0dXNEYXRlcy5mb3JFYWNoKGQgPT4ge1xuICAgICAgICAgICAgaWYgKGRhdGUuZGlmZihkLCAnZGF5cycpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZXhpc3RzID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiAodGhpcy5lbnRpdHkuaWQgJiYgZGF0ZS5kaWZmKHRoaXMuZW50aXR5LmRhdGVTdGF0dXMsICdkYXlzJykgPT09IDApIHx8ICFleGlzdHM7XG4gICAgfVxuXG4gICAgcHJldmlvdXNTdGF0ZSgpIHtcbiAgICAgICAgd2luZG93Lmhpc3RvcnkuYmFjaygpO1xuICAgIH1cblxuICAgIHNhdmUoKSB7XG4gICAgICAgIHRoaXMuYXBwTG9hZGVyU2VydmljZS5vcGVuKCdTYXZpbmcgQ2xpZW50IHN0YXR1cyB1cGRhdGUuLi4nKTtcbiAgICAgICAgdGhpcy5pc1NhdmluZyA9IHRydWU7XG4gICAgICAgIGlmICghdGhpcy5lbnRpdHkuZXh0cmEpIHtcbiAgICAgICAgICAgIHRoaXMuZW50aXR5LmV4dHJhID0ge31cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVudGl0eS5leHRyYS5mYWNpbGl0eVRyYW5zZmVycmVkVG8gPSB0aGlzLmZhY2lsaXR5VHJhbnNmZXJyZWRUbztcblxuICAgICAgICBpZiAodGhpcy5zdGF0dXNlcy5pbmNsdWRlcyh0aGlzLmVudGl0eS5zdGF0dXMpKSB7XG4gICAgICAgICAgICB0aGlzLmVudGl0eS5vdXRjb21lID0gdGhpcy5lbnRpdHkuc3RhdHVzO1xuICAgICAgICAgICAgdGhpcy5lbnRpdHkuc3RhdHVzID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5lbnRpdHkuaWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVUb1NhdmVSZXNwb25zZSh0aGlzLnBhdGllbnRTZXJ2aWNlLnVwZGF0ZUNsaWVudFN0YXR1cyh0aGlzLmVudGl0eSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmVUb1NhdmVSZXNwb25zZSh0aGlzLnBhdGllbnRTZXJ2aWNlLnNhdmVDbGllbnRTdGF0dXModGhpcy5lbnRpdHkpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc3Vic2NyaWJlVG9TYXZlUmVzcG9uc2UocmVzdWx0OiBPYnNlcnZhYmxlPEh0dHBSZXNwb25zZTxhbnk+Pikge1xuICAgICAgICByZXN1bHQuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKHJlczogSHR0cFJlc3BvbnNlPGFueT4pID0+IHRoaXMub25TYXZlU3VjY2VzcyhyZXMuYm9keSksXG4gICAgICAgICAgICAocmVzOiBIdHRwRXJyb3JSZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwTG9hZGVyU2VydmljZS5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMub25TYXZlRXJyb3IoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uRXJyb3IocmVzLm1lc3NhZ2UpXG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uU2F2ZVN1Y2Nlc3MocmVzdWx0OiBhbnkpIHtcbiAgICAgICAgdGhpcy5hcHBMb2FkZXJTZXJ2aWNlLmNsb3NlKCk7XG4gICAgICAgIHRoaXMuaXNTYXZpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb24uc2hvd0luZm8oJ0NsaWVudCBzdGF0dXMgdXBkYXRlIHN1Y2Nlc3NmdWxseSBzYXZlZCcpO1xuICAgICAgICB0aGlzLnByZXZpb3VzU3RhdGUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uU2F2ZUVycm9yKCkge1xuICAgICAgICB0aGlzLmlzU2F2aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9uLnNob3dFcnJvcignRXJyb3Igc2F2aW5nIHN0YXR1cyB1cGRhdGUnKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb25FcnJvcihlcnJvck1lc3NhZ2U6IHN0cmluZykge1xuICAgICAgICB0aGlzLmlzU2F2aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9uLnNob3dFcnJvcihlcnJvck1lc3NhZ2UpO1xuICAgIH1cbn1cbiJdfQ==