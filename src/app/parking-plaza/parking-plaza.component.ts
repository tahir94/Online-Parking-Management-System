import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { AuthService } from "../providers/auth.service";

@Component({
	selector: 'parking-plaza',
	templateUrl: './parking-plaza.component.html',
	styleUrls: ['./parking-plaza.component.css']
})
export class ParkingPlazaComponent implements OnInit {

	demoForm: FormGroup;
	selectedDate;
	timeOption;
	reservedHours;
	totalBookingHours;
	inBetweenTime;
	endTime;
	isSlot1 = true;
	arr = [];
	selectedDateArray = [];
	timeDuration;
	userUid;
	allUsersTimeAndDate;
	currentUserKey;
	isDisabled = false;
	currentUserSelectedDate;
	currentUserTimeDuration;
	currentUserOfParkingPlaza: FirebaseObjectObservable<any>;
	fetchDataOfParkingPlaza: FirebaseListObservable<any>

	items: FirebaseListObservable<any>;


	dates = [
		{ value: "270717", viewValue: '27-07-17' },
		{ value: '280717', viewValue: '28/07/17' },
		{ value: '290717', viewValue: '29/07/17' },
		{ value: '300717', viewValue: '30/07/17' }
	];

	times = [
		{ value: '1-pm', viewValue: '1 pm' },
		{ value: '2-pm', viewValue: '2 pm' },
		{ value: '3-pm', viewValue: '3 pm' },
		{ value: '4-pm', viewValue: '4 pm' },
		{ value: '5-pm', viewValue: '5 pm' },
		{ value: '6-pm', viewValue: '6 pm' },
		{ value: '7-pm', viewValue: '7 pm' }
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


	constructor(private fb: FormBuilder,
		private db: AngularFireDatabase,
		private afAuth: AngularFireAuth,
		private authService: AuthService
	) {
		console.log('demo run!! ');
	}

	ngOnInit() {


		this.items = this.db.list('/users/' + this.afAuth.auth.currentUser.uid, { preserveSnapshot: true });
		this.items
			.subscribe(snapshots => {
				snapshots.forEach(snapshot => {
					console.log(snapshot.key)
					console.log(snapshot.val());


					//  debugger;
					//   if (snapshot.val().selectedDate == '270717' && snapshot.val().startTime == 1 && snapshot.val().endTime == 4 && snapshot.val().inBetweenTime == '2,3,4 hours' && snapshot.val().slot == 1) {
					// console.log(snapshot.val());
					//   console.log('asdasd');
					// this.isSlot1 = false;



					//   }
				});
			})

		this.demoForm = this.fb.group({
			timeOptions: '',
			reservedHoursOptions: '',
			dateOptions: ''
		});





		/////////////////////////

		//fetch all users
		this.fetchDataOfParkingPlaza = this.db.list('parking-plaza', { preserveSnapshot: true });
		this.fetchDataOfParkingPlaza
			.subscribe(snapshots => {
				snapshots.forEach(snapshot => {
					// user uid
					console.log(snapshot.key)
					this.userUid = snapshot.key;
					console.log(snapshot.val())

					snapshot.forEach(snapshot => {
						console.log(snapshot.key)
						console.log(snapshot.val());
						this.selectedDate = snapshot.val().selectedDate;
						this.timeDuration = snapshot.val().timeDuration;
						console.log(this.selectedDate);
						this.selectedDateArray.push(this.selectedDate,this.timeDuration);
						console.log(this.selectedDateArray);
						
						

					});

				});
			});

		//   fetch current user
		this.currentUserKey = localStorage.getItem('firebaseToken');
		console.log(this.currentUserKey);


		this.currentUserOfParkingPlaza = this.db.object('parking-plaza' + "/" + this.currentUserKey, { preserveSnapshot: true });
		this.currentUserOfParkingPlaza
			.subscribe(snapshots => {
				snapshots.forEach(snapshot => {
					console.log(snapshot.key);
				    this.currentUserSelectedDate = snapshot.val().selectedDate;
					this.currentUserTimeDuration = snapshot.val().timeDuration;
					console.log(this.selectedDate);
					console.log(this.selectedDateArray);
					this.selectedDateArray.forEach((data)=>{
                      console.log(data);
					 this.allUsersTimeAndDate = data;
					  console.log(this.currentUserSelectedDate);
				
					for(let i =0; i < this.selectedDateArray.length; i++){
						if(this.selectedDateArray[i] == this.currentUserSelectedDate){
							console.log('on right way  1!');
						  if(this.selectedDateArray[i + 1] == this.currentUserTimeDuration){
						  if(snapshot.val().slotBook == false){
							  console.log('demo');
							  
                            this.isDisabled = true;
						  }
						 
						   
						  }	
						}
					}  
					//  if(this.allUsersTimeAndDate == this.currentUserSelectedDate && this.allUsersTimeAndDate == this.currentUserTimeDuration){
					// 	 console.log(snapshot.val().slot)
					//  } 
					})
					
				});
			})

			
			



	}

	slots(slotNumber, t) {
		console.log(slotNumber);
		console.log(t)


		this.selectedDate = parseInt(this.demoForm.value.dateOptions)
		console.log(this.selectedDate);

		this.timeOption = parseInt(this.demoForm.value.timeOptions);
		this.reservedHours = parseInt(this.demoForm.value.reservedHoursOptions);


		this.totalBookingHours = this.timeOption + this.reservedHours;

		this.arr = [];
		for (let i = this.timeOption; i < this.totalBookingHours; i++) {
			this.inBetweenTime = i + 1;
			// console.log(this.inBetweenTime);

			this.arr.push(this.inBetweenTime)

			console.log(this.arr);

		}
		this.endTime = this.arr[this.arr.length - 1]
		console.log(this.endTime)
		this.items = this.db.list('parking-plaza' + "/" + this.afAuth.auth.currentUser.uid);
		this.items.push({
			startTime: this.timeOption, reservedHours: this.reservedHours + ' hours',
			inBetweenTime: this.arr + ' hours', slot: slotNumber,
			selectedDate: this.selectedDate, slotBook: false,
			endTime: this.endTime, timeDuration: this.timeOption + ' to ' + this.endTime
		})

	}
	submit() {
		this.ngOnInit()
	}


	signOut() {
		this.authService.signOut();
	}

}
