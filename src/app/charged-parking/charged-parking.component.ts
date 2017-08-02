import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { AuthService } from "../providers/auth.service";
import { Router } from "@angular/router";
@Component({
  selector: 'charged-parking',
  templateUrl: './charged-parking.component.html',
  styleUrls: ['./charged-parking.component.css']
})
export class ChargedParkingComponent implements OnInit {

	chargedParkingForm: FormGroup;
    minDate = new Date();
	items: FirebaseListObservable<any>;
	// var of all users
	allUsersSelectedDate;
	allUsersTimeDuration;
	allUsersStartTime;
	allUsersEndTime;
	allUserstimeDateAndSlotArray = [];

	// var of current user
	date;
	initializeTime;
	reservedHours;
	totalBookingHours;
	TimeDuration;
	slot;

	allSlots;
	month;

	// var of slots Func
	sendUserBookingData: FirebaseListObservable<any>;

	fetchAllUsers: FirebaseObjectObservable<any>;

	times = [
		{ value: '9-am', viewValue: '9:00' },
		{ value: '10-am', viewValue: '10:00' },
		{ value: '11-am', viewValue: '11:00' },
		{ value: '12-am', viewValue: '12:00' },
		{ value: '1-pm', viewValue: '13:00' },
		{ value: '2-pm', viewValue: '14:00' },
		{ value: '3-pm', viewValue: '15:00' },
		{ value: '4-pm', viewValue: '16:00' },
		{ value: '5-pm', viewValue: '17:00' },
		{ value: '6-pm', viewValue: '18:00' },
		{ value: '7-pm', viewValue: '19:00' },
		{ value: '8-pm', viewValue: '20:00' },
		{ value: '9-pm', viewValue: '21:00' }
	];

	reserved_hours = [
		{ value: '1-hour', viewValue: '1 hour' },
		{ value: '2-hours', viewValue: '2 hours' },
		{ value: '3-hours', viewValue: '3 hours' },
		{ value: '4-hours', viewValue: '4 hours' },
		{ value: '5-hours', viewValue: '5 hours' },
		{ value: '6-hours', viewValue: '6 hours' },
		{ value: '7-hours', viewValue: '7 hours' }
	];

	buttons = [
		{ reserved: false, slotNumber: 1 },
		{ reserved: false, slotNumber: 2 },
		{ reserved: false, slotNumber: 3 },
		{ reserved: false, slotNumber: 4 },
		{ reserved: false, slotNumber: 5 }
	]


	constructor(private fb: FormBuilder,
		private db: AngularFireDatabase,
		private afAuth: AngularFireAuth,
		private authService: AuthService,
		private router : Router,
	) {

	}

	ngOnInit() {

		this.chargedParkingForm = this.fb.group({
			timeOptions: '',
			reservedHoursOptions: '',
			dateOptions: '',
			
		});

		this.fetchAllUsers = this.db.object('charged-parking', { preserveSnapshot: true });
		this.fetchAllUsers
			.subscribe(snapshots => {
				snapshots.forEach(snapshot => {
					// all users uid
					console.log(snapshot.key)
					console.log(snapshot.val())

					snapshot.forEach(snapshot => {

						console.log(snapshot.key)
						console.log(snapshot.val())
						this.allUsersSelectedDate = snapshot.val().selectedDate;
						this.allUsersStartTime = snapshot.val().startTime
						this.allUsersEndTime = snapshot.val().endTime
						this.allUsersTimeDuration = snapshot.val().timeDuration;
						this.allUserstimeDateAndSlotArray.push(this.allUsersSelectedDate, this.allUsersTimeDuration, snapshot.val().slot, this.allUsersStartTime, this.allUsersEndTime)


					});
				});
			})

	}


	submit() {
		for (var i = 0; i < this.buttons.length; i++) {
			this.buttons[i].reserved = false;
		}
		console.log(this.chargedParkingForm.value);
		console.log(this.chargedParkingForm.value.dateOptions.getMonth() + 1)
		console.log(this.chargedParkingForm.value.dateOptions.getDate());
		console.log(this.chargedParkingForm.value.dateOptions.getYear());
		this.date = this.chargedParkingForm.value.dateOptions.getMonth() + 1 + "-" + this.chargedParkingForm.value.dateOptions.getDate() + "-" + this.chargedParkingForm.value.dateOptions.getYear();
		console.log(this.date);
		this.initializeTime = parseInt(this.chargedParkingForm.value.timeOptions);
		this.reservedHours = parseInt(this.chargedParkingForm.value.reservedHoursOptions);
		this.totalBookingHours = this.initializeTime + this.reservedHours;

		this.TimeDuration = this.initializeTime + " to " + this.totalBookingHours;
		console.log(this.allUserstimeDateAndSlotArray);

		for (let i = 0; i < this.allUserstimeDateAndSlotArray.length; i++) {
			if (this.allUserstimeDateAndSlotArray[i] == this.date) {
				if ((this.initializeTime >= this.allUserstimeDateAndSlotArray[i + 3] &&
					this.initializeTime < this.allUserstimeDateAndSlotArray[i + 4])
					||
					(this.totalBookingHours <= this.allUserstimeDateAndSlotArray[i + 4] &&
						this.totalBookingHours > this.allUserstimeDateAndSlotArray[i + 3])
				) {

					console.log(this.allUserstimeDateAndSlotArray[i + 2]);
					this.slot = this.allUserstimeDateAndSlotArray[i + 2];
					this.buttons[this.slot - 1].reserved = true;
				}


				else if ((this.initializeTime < this.allUserstimeDateAndSlotArray[i + 3])
					&&
					this.totalBookingHours > this.allUserstimeDateAndSlotArray[i + 4]
				) {
					console.log(this.allUserstimeDateAndSlotArray[i + 2]);
					this.slot = this.allUserstimeDateAndSlotArray[i + 2];
					this.buttons[this.slot - 1].reserved = true;
				}
			}
		}
		this.allSlots = true;


	}

	slots(slotNumber) {
		console.log(this.chargedParkingForm.value);

		// this.date = parseInt(this.demoForm.value.dateOptions);
		this.date = this.chargedParkingForm.value.dateOptions.getMonth() + 1 + "-" + this.chargedParkingForm.value.dateOptions.getDate() + "-" + this.chargedParkingForm.value.dateOptions.getYear();
		this.initializeTime = parseInt(this.chargedParkingForm.value.timeOptions);
		this.reservedHours = parseInt(this.chargedParkingForm.value.reservedHoursOptions);
		this.totalBookingHours = this.initializeTime + this.reservedHours;

		this.TimeDuration = this.initializeTime + " to " + this.totalBookingHours;

		this.sendUserBookingData = this.db.list('charged-parking' + "/" + this.afAuth.auth.currentUser.uid);
		this.sendUserBookingData.push({ uid: this.afAuth.auth.currentUser.uid, selectedDate: this.date, startTime: this.initializeTime, endTime: this.totalBookingHours, timeDuration: this.TimeDuration, slot: slotNumber })

		 this.router.navigate(['/dashboard'])
	}
		signOut(){
this.authService.signOut();
}
}