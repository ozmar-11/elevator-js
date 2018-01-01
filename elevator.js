{
    init: function(elevators, floors) {
        var elevator = elevators[0];

        var moveIfStopped = function(elevator, floor) {
            if (elevator.destinationDirection() === "stopped")
                elevator.goToFloor(floor);
        }

        var addAndUpdateDestinationQueue = function(elevator, destination) {
            elevator.destinationQueue.push(destination);
            elevator.checkDestinationQueue();
            if (elevator.destinationQueue.indexOf(destination) < 0) {
                moveIfStopped(elevator, elevator.destinationQueue.shift());
            } else {
                elevator.goToFloor(destination, true);
                elevator.destinationQueue.splice(elevator.destinationQueue.indexOf(destination), 1);
            }
            elevator.checkDestinationQueue();
        }        

        var getClosestAndFreeElevator = function(floorNum) {
            var i = 0;
            var minorDifference = 100, elevatorWithMinorDifference = elevators[0];
            while(i < elevators.length) {         
                if (elevators[i].loadFactor() != 1 && Math.abs(elevators[i].currentFloor() - floorNum) < minorDifference) {
                    minorDifference = Math.abs(elevators[i].currentFloor() - floorNum);
                    elevatorWithMinorDifference = elevators[i];                    
                }
                i++;
            }
            return elevatorWithMinorDifference;
        }

        floors.forEach(function(floor) {
            floor.on("up_button_pressed", function() {
                elevator = getClosestAndFreeElevator(this.floorNum());
                addAndUpdateDestinationQueue(elevator, this.floorNum());
            });

            floor.on("down_button_pressed", function() {
                elevator = getClosestAndFreeElevator(this.floorNum());
                addAndUpdateDestinationQueue(elevator, this.floorNum());
            })
        });        

        elevators.forEach(function(elevator) {
            elevator.on("floor_button_pressed", function(floorNum) {
                if (elevator.destinationQueue.indexOf(floorNum) < 0) {
                    elevator.destinationQueue.push(floorNum);
                    elevator.checkDestinationQueue();
                } else {
                    elevator.goToFloor(floorNum, true);
                }
            });

            elevator.on("idle", function() {
                elevator.stop();
            });
        });        
    },

    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}