import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { SignupComponent } from "./signup/signup.component";
import { LoginComponent } from "./login/login.component";
import { AuthGuardGuard } from "./providers/auth-guard.guard";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ParkingPlazaComponent } from './parking-plaza/parking-plaza.component';
import { ChargedParkingComponent } from './charged-parking/charged-parking.component';
import { CanttStationParkingComponent } from './cantt-station-parking/cantt-station-parking.component';
import { RootDashboardComponent } from './root-dashboard/root-dashboard.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';
import { AdminComponent } from './admin/admin.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { RootAdminComponent } from './root-admin/root-admin.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { AdminFeedbackComponent } from './admin-feedback/admin-feedback.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';

const routing: Routes = [
	{ path: '', component: LoginComponent, canActivate: [AuthGuardGuard] },
	{ path: 'app-login', component: LoginComponent },
	{ path: 'app-signup', component: SignupComponent },

	{
		path: 'dashboard', component: RootDashboardComponent, canActivate: [AuthGuardGuard],
		children: [
			{ path: '', component: DashboardComponent },
			{ path: 'parking-plaza', component: ParkingPlazaComponent },
			{ path: 'charged-parking', component: ChargedParkingComponent },
			{ path: 'cantt-station-parking', component: CanttStationParkingComponent },
			{ path: 'app-my-bookings', component: MyBookingsComponent },
			{ path: 'app-feedback', component: FeedbackComponent },
			{ path: 'app-update-profile', component: UpdateProfileComponent }
		]

	},
	{
		path: 'admin', component: RootAdminComponent, canActivate: [AuthGuardGuard], 
		children: [
			{ path: '', component: AdminComponent },
			{ path: 'app-all-users', component: AllUsersComponent },
			{ path: 'app-admin-feedback', component: AdminFeedbackComponent }
		]
	}
]
export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routing)
export default AppRoutes;