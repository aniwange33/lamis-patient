import {OnInit} from '@angular/core';
import {OVC, Patient} from '../model/patient.model';
import {PatientService} from '../services/patient.service';
import {NotificationService} from '@alfresco/adf-core';
import {ActivatedRoute} from '@angular/router';
import * as moment_ from 'moment';
import {DurationInputArg2, Moment} from 'moment';
import {AppLoaderService} from '@lamis/web-core';
import {TdDialogService} from '@covalent/core';
import {NgForm} from '@angular/forms';

export declare class PatientEditComponent implements OnInit {
    private patientService;
    protected notification: NotificationService;
    private loaderService;
    private _dialogService;
    protected activatedRoute: ActivatedRoute;
    patientForm: NgForm;
    template: string;
    entity: Patient;
    ovc: OVC;
    patient: Patient;
    isSaving: boolean;
    error: boolean;
    today: moment_.Moment;
    minDob: moment_.Moment;
    ovcMin: Moment;
    minDateRegistration: Moment;
    maxDateBirth: Moment;
    maxDateConfirmed: moment_.Moment;
    minDateConfirmed: moment_.Moment;
    age: number;
    ageUnit: DurationInputArg2;
    state: any;
    states: any[];
    lgas: any[];
    ovcApplicable: boolean;
    householdUniqueNo: string;
    referredTo: string;
    dateReferredTo: Moment;
    referredFrom: string;
    dateReferredFrom: Moment;
    prep: boolean;
    prepId: string;
    indicationForPrep: string;
    onDemandIndication: string;

    constructor(patientService: PatientService, notification: NotificationService, loaderService: AppLoaderService, _dialogService: TdDialogService, activatedRoute: ActivatedRoute);

    createEntity(): Patient;

    ngOnInit(): void;

    entityCompare(e1: any, e2: any): boolean;

    estimateDob(): void;

    stateChange(id: any): void;

    statusChanged(): void;

    previousState(): void;

    dateBirthChanged(date: Moment): void;

    dateRegistrationChanged(date: Moment): void;

    save(): void;

    private subscribeToSaveResponse;
    private onSaveSuccess;
    private onSaveError;

    protected onError(errorMessage: string): void;

    isOVCAge(): boolean;
}
