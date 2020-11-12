import {OnInit} from '@angular/core';
import {PatientService} from '../services/patient.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '@alfresco/adf-core';
import {AppLoaderService} from '@lamis/web-core';
import {Patient, StatusHistory} from '../model/patient.model';
import * as moment_ from 'moment';
import {Moment} from 'moment';

export declare class ClientStatusComponent implements OnInit {
    private patientService;
    private activatedRoute;
    private router;
    private notification;
    private appLoaderService;
    isSaving: boolean;
    entity: StatusHistory;
    patient: Patient;
    status: string;
    facilities: string[];
    facilityTransferredTo: string;
    statusDates: Moment[];
    today: moment_.Moment;
    statuses: string[];

    constructor(patientService: PatientService, activatedRoute: ActivatedRoute, router: Router, notification: NotificationService, appLoaderService: AppLoaderService);

    createEntity(): StatusHistory;

    ngOnInit(): void;

    change(input: string): void;

    filterDates(date: Moment): boolean;

    previousState(): void;

    save(): void;

    private subscribeToSaveResponse;
    private onSaveSuccess;
    private onSaveError;

    protected onError(errorMessage: string): void;
}
