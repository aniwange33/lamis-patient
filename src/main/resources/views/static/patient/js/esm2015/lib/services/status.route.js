import * as tslib_1 from "tslib";
import { ClientStatusComponent } from '../components/client-status.component';
import { PatientService } from './patient.service';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs/operators';
let StatusResolve = class StatusResolve {
    constructor(service) {
        this.service = service;
    }
    resolve(route, state) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.findClientStatus(id).pipe(filter((response) => response.ok), map((patient) => patient.body));
        }
        return of({});
    }
};
StatusResolve.ctorParameters = () => [
    { type: PatientService }
];
StatusResolve = tslib_1.__decorate([
    Injectable(),
    tslib_1.__metadata("design:paramtypes", [PatientService])
], StatusResolve);
export { StatusResolve };
const ɵ0 = {
    title: 'Clinic Visit',
    breadcrumb: 'CLINIC VISIT'
}, ɵ1 = {
    authorities: ['ROLE_DEC'],
    title: 'Update Client Status',
    breadcrumb: 'UPDATE CLIENT STATUS'
}, ɵ2 = {
    authorities: ['ROLE_DEC'],
    title: 'Client Status Edit',
    breadcrumb: 'CLIENT STATUS EDIT'
};
export const ROUTES = [
    {
        path: '',
        data: ɵ0,
        children: [
            {
                path: 'patient/:patientId/new',
                component: ClientStatusComponent,
                data: ɵ1,
            },
            {
                path: ':id/patient/:patientId/edit',
                component: ClientStatusComponent,
                resolve: {
                    entity: StatusResolve
                },
                data: ɵ2,
            }
        ]
    }
];
export { ɵ0, ɵ1, ɵ2 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzLnJvdXRlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbGFtaXMtcGF0aWVudC0xLjQuMS8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9zdGF0dXMucm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVDQUF1QyxDQUFDO0FBRzVFLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQWEsRUFBRSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3BDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUkzQyxJQUFhLGFBQWEsR0FBMUIsTUFBYSxhQUFhO0lBQ3RCLFlBQW9CLE9BQXVCO1FBQXZCLFlBQU8sR0FBUCxPQUFPLENBQWdCO0lBQzNDLENBQUM7SUFFRCxPQUFPLENBQUMsS0FBNkIsRUFBRSxLQUEwQjtRQUM3RCxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDMUQsSUFBSSxFQUFFLEVBQUU7WUFDSixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUN6QyxNQUFNLENBQUMsQ0FBQyxRQUFxQyxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQzlELEdBQUcsQ0FBQyxDQUFDLE9BQW9DLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FDOUQsQ0FBQztTQUNMO1FBQ0QsT0FBTyxFQUFFLENBQWdCLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7Q0FDSixDQUFBOztZQWJnQyxjQUFjOztBQURsQyxhQUFhO0lBRHpCLFVBQVUsRUFBRTs2Q0FFb0IsY0FBYztHQURsQyxhQUFhLENBY3pCO1NBZFksYUFBYTtXQW1CWjtJQUNGLEtBQUssRUFBRSxjQUFjO0lBQ3JCLFVBQVUsRUFBRSxjQUFjO0NBQzdCLE9BS2E7SUFDRixXQUFXLEVBQUUsQ0FBQyxVQUFVLENBQUM7SUFDekIsS0FBSyxFQUFFLHNCQUFzQjtJQUM3QixVQUFVLEVBQUUsc0JBQXNCO0NBQ3JDLE9BU0s7SUFDRixXQUFXLEVBQUUsQ0FBQyxVQUFVLENBQUM7SUFDekIsS0FBSyxFQUFFLG9CQUFvQjtJQUMzQixVQUFVLEVBQUUsb0JBQW9CO0NBQ25DO0FBNUJqQixNQUFNLENBQUMsTUFBTSxNQUFNLEdBQVc7SUFDMUI7UUFDSSxJQUFJLEVBQUUsRUFBRTtRQUNSLElBQUksSUFHSDtRQUNELFFBQVEsRUFBRTtZQUNOO2dCQUNJLElBQUksRUFBRSx3QkFBd0I7Z0JBQzlCLFNBQVMsRUFBRSxxQkFBcUI7Z0JBQ2hDLElBQUksSUFJSDthQUVKO1lBQ0Q7Z0JBQ0ksSUFBSSxFQUFFLDZCQUE2QjtnQkFDbkMsU0FBUyxFQUFFLHFCQUFxQjtnQkFDaEMsT0FBTyxFQUFFO29CQUNMLE1BQU0sRUFBRSxhQUFhO2lCQUN4QjtnQkFDRCxJQUFJLElBSUg7YUFFSjtTQUNKO0tBQ0o7Q0FDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDbGllbnRTdGF0dXNDb21wb25lbnR9IGZyb20gJy4uL2NvbXBvbmVudHMvY2xpZW50LXN0YXR1cy5jb21wb25lbnQnO1xuaW1wb3J0IHtBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBSZXNvbHZlLCBSb3V0ZXJTdGF0ZVNuYXBzaG90LCBSb3V0ZXN9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQge1N0YXR1c0hpc3Rvcnl9IGZyb20gJy4uL21vZGVsL3BhdGllbnQubW9kZWwnO1xuaW1wb3J0IHtQYXRpZW50U2VydmljZX0gZnJvbSAnLi9wYXRpZW50LnNlcnZpY2UnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBvZn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtmaWx0ZXIsIG1hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtIdHRwUmVzcG9uc2V9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0YXR1c1Jlc29sdmUgaW1wbGVtZW50cyBSZXNvbHZlPFN0YXR1c0hpc3Rvcnk+IHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNlcnZpY2U6IFBhdGllbnRTZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgcmVzb2x2ZShyb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgc3RhdGU6IFJvdXRlclN0YXRlU25hcHNob3QpOiBPYnNlcnZhYmxlPFN0YXR1c0hpc3Rvcnk+IHtcbiAgICAgICAgY29uc3QgaWQgPSByb3V0ZS5wYXJhbXNbJ2lkJ10gPyByb3V0ZS5wYXJhbXNbJ2lkJ10gOiBudWxsO1xuICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNlcnZpY2UuZmluZENsaWVudFN0YXR1cyhpZCkucGlwZShcbiAgICAgICAgICAgICAgICBmaWx0ZXIoKHJlc3BvbnNlOiBIdHRwUmVzcG9uc2U8U3RhdHVzSGlzdG9yeT4pID0+IHJlc3BvbnNlLm9rKSxcbiAgICAgICAgICAgICAgICBtYXAoKHBhdGllbnQ6IEh0dHBSZXNwb25zZTxTdGF0dXNIaXN0b3J5PikgPT4gcGF0aWVudC5ib2R5KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2YoPFN0YXR1c0hpc3Rvcnk+e30pO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IFJPVVRFUzogUm91dGVzID0gW1xuICAgIHtcbiAgICAgICAgcGF0aDogJycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHRpdGxlOiAnQ2xpbmljIFZpc2l0JyxcbiAgICAgICAgICAgIGJyZWFkY3J1bWI6ICdDTElOSUMgVklTSVQnXG4gICAgICAgIH0sXG4gICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcGF0aDogJ3BhdGllbnQvOnBhdGllbnRJZC9uZXcnLFxuICAgICAgICAgICAgICAgIGNvbXBvbmVudDogQ2xpZW50U3RhdHVzQ29tcG9uZW50LFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgYXV0aG9yaXRpZXM6IFsnUk9MRV9ERUMnXSxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdVcGRhdGUgQ2xpZW50IFN0YXR1cycsXG4gICAgICAgICAgICAgICAgICAgIGJyZWFkY3J1bWI6ICdVUERBVEUgQ0xJRU5UIFNUQVRVUydcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8vY2FuQWN0aXZhdGU6IFtVc2VyUm91dGVBY2Nlc3NTZXJ2aWNlXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwYXRoOiAnOmlkL3BhdGllbnQvOnBhdGllbnRJZC9lZGl0JyxcbiAgICAgICAgICAgICAgICBjb21wb25lbnQ6IENsaWVudFN0YXR1c0NvbXBvbmVudCxcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIGVudGl0eTogU3RhdHVzUmVzb2x2ZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBhdXRob3JpdGllczogWydST0xFX0RFQyddLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0NsaWVudCBTdGF0dXMgRWRpdCcsXG4gICAgICAgICAgICAgICAgICAgIGJyZWFkY3J1bWI6ICdDTElFTlQgU1RBVFVTIEVESVQnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvL2NhbkFjdGl2YXRlOiBbVXNlclJvdXRlQWNjZXNzU2VydmljZV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH1cbl07XG4iXX0=