import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { Router } from "@angular/router";
import { AuthService } from "../providers/auth.service";

@Component({
	selector: 'cantt-station-parking',
	templateUrl: './cantt-station-parking.component.html',
	styleUrls: ['./cantt-station-parking.component.css']
})
export class CanttStationParkingComponent implements OnInit {


	canttStationParkingForm: FormGroup;
	showCanttStation = true;


	// var of all users
	allUsersSelectedDate;
	allUsersTimeDuration;
	allUsersStartTime;
	allUsersEndTime;
	allUserstimeDateAndSlotArray = [];
	minDate = new Date();

	// var of current user
	date;
	initializeTime;
	reservedHours;
	totalBookingHours;
	TimeDuration;
	slot;
	allSlots;
	month;
	slotNumber;
   currentNode;
   userUid; 

	items: FirebaseListObservable<any>;
	sendUserBookingData: FirebaseListObservable<any>;
	fetchAllUsers: FirebaseObjectObservable<any>;
	fetchBooking: FirebaseListObservable<any>;
	fetchBookingForCancel: FirebaseListObservable<any>;

	currentBookingKey;
	userBookingArray = [];


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
		{ reserved: false, slotNumber: 5 },
		{ reserved: false, slotNumber: 6 },
		{ reserved: false, slotNumber: 7 },
		{ reserved: false, slotNumber: 8 },
		{ reserved: false, slotNumber: 9 },
		{ reserved: false, slotNumber: 10 },
	]


	constructor(private fb: FormBuilder,
		private db: AngularFireDatabase,
		private afAuth: AngularFireAuth,
		private authService: AuthService,
		private router: Router,
	) {

		this.canttStationParkingForm = this.fb.group({
			timeOptions: '',
			reservedHoursOptions: '',
			dateOptions: '',
		});

	}
	ngOnInit() { }


	submit() {
		for (var i = 0; i < this.buttons.length; i++) {
			this.buttons[i].reserved = false;
		}


		// console.log("formmmmm", this.canttStationParkingForm.value);
		this.date = this.canttStationParkingForm.value.dateOptions.toString();
		this.date = this.date.slice(4, 15);
		// console.log("dateeee", this.date);
		this.initializeTime = parseInt(this.canttStationParkingForm.value.timeOptions);
		this.reservedHours = parseInt(this.canttStationParkingForm.value.reservedHoursOptions);
		this.totalBookingHours = this.initializeTime + this.reservedHours;
		// console.log("bookinggggg", this.totalBookingHours);

		this.TimeDuration = this.initializeTime + " to " + this.totalBookingHours;
		// console.log(this.allUserstimeDateAndSlotArray);
		this.fetchAllUsers = this.db.object('/cantt-station', { preserveSnapshot: true });
		this.fetchAllUsers.subscribe(snapshots => {
			snapshots.forEach(element => {
				// console.log("keyyyyyy", element.key);
				element.forEach(snapshot => {
					// console.log("snapshottt", snapshot.key);
					//	console.log("valueeee",snapshot.val());
					if (this.date == snapshot.val().selectedDate) {
						// console.log('if1');
						if (this.initializeTime == snapshot.val().startTime) {
							// console.log('if2');
							//  console.log(snapshot.val());

							this.buttons[(snapshot.val().slot - 1)].reserved = true;
						}
						else if (this.initializeTime != snapshot.val().startTime) {
							// console.log('if2 else');
							if ((snapshot.val().startTime > this.initializeTime && this.totalBookingHours > snapshot.val().startTime) || (this.initializeTime > snapshot.val().startTime && this.initializeTime < snapshot.val().endTime)) {
								// console.log('if3');
								this.buttons[(snapshot.val().slot - 1)].reserved = true;
							}
						}

					}
				});
			});
			this.showCanttStation = false;
			this.allSlots = true;
		})

	}

	
	isTime = false;
	isReservedHours = false;
	isSubmitButton = false;





	

	onDateChange(event: Event) {

		// console.log(event);


		this.isTime = true;
	}
	onTimeChange(event: Event) {
		this.isReservedHours = true;

	}

	onReservedHrsChange(event: Event) {
		this.isSubmitButton = true;
	}


	back() {

		this.allSlots = false;
		this.showCanttStation = true;
	}
	

	obj: {
		date: '',
		slotNum: '',
		timeDuration: '',
	}
 

	slots(slotNumber) {
		
		this.obj = { date: '', slotNum: '', timeDuration: '' };
		this.slotNumber = slotNumber
		// localStorage.setItem('slot', this.slotNumber);
		// console.log(this.canttStationParkingForm.value);
		// console.log(this.slot);
		// console.log(this.times[4].viewValue);
		this.date = this.canttStationParkingForm.value.dateOptions.toString();
		this.date = this.date.slice(4, 15);
		this.initializeTime = parseInt(this.canttStationParkingForm.value.timeOptions);
		this.reservedHours = parseInt(this.canttStationParkingForm.value.reservedHoursOptions);
		this.totalBookingHours = this.initializeTime + this.reservedHours;

		this.TimeDuration = this.initializeTime + ":00 " + " to " + this.totalBookingHours + ":00 ";
		this.currentNode = 'cantt-station';
		this.userUid = this.afAuth.auth.currentUser.uid;

		this.sendUserBookingData = this.db.list('cantt-station' + "/" + this.afAuth.auth.currentUser.uid);
		this.sendUserBookingData.push({
			slotBook: false, place: 'cantt-station', uid: this.afAuth.auth.currentUser.uid, selectedDate: this.date,
			startTime: this.initializeTime, endTime: this.totalBookingHours, timeDuration: this.TimeDuration, slot: slotNumber
		})

		this.showCanttStation = false;

		this.obj.date = this.date;
		this.obj.slotNum = slotNumber;
		this.obj.timeDuration = this.TimeDuration;
		
		this.userBookingArray.push(this.obj);
	

		this.getCurrentBooking(this.date, this.TimeDuration);
		this.allSlots = false;
		this.router.navigate(['/dashboard/app-my-bookings'])

	}

	getCurrentBooking(date, timeDuration) {


		this.fetchBooking = this.db.list('cantt-station/' + this.afAuth.auth.currentUser.uid, { preserveSnapshot: true });
		this.fetchBooking
			.subscribe(snapshots => {
				snapshots.forEach(snapshot => {
					// console.log(snapshot.key);
					if (snapshot.val().selectedDate == date && snapshot.val().timeDuration == timeDuration) {
						// Current booking key
						this.currentBookingKey = snapshot.key
						// console.log(snapshot.key);
						// console.log(snapshot.val())
					}
				});
			});


	}

	signOut() {
		this.authService.signOut();
	}
}