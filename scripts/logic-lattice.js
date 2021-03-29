// A script for running a square-lattice logic circuit

// Define globals
var ops = {
	"0": function(){return 0;},
	"R": function(){return this.rightInput;},
	"L": function(){return this.leftInput;},
	"&": function(){return this.leftInput && this.rightInput;},
	"|": function(){return this.leftInput || this.rightInput;},
	"^": function (){return (this.leftInput || this.rightInput) - (this.leftInput && this.rightInput);},
	"1": function(){return 1;},
}

number_gate = false;
animation_static = false;
var canvas;
var ctx;

var animation = null;
var then = 0;
var loopLength = 1;
var loopTime = 0;
var loopFraction = 0.5;

var cellSize = 135;
var cells = {
	n: 0,
	nH: 0,
	nV: 0,
	cells: [],
	origX: 0,
	origY: 0
};


window.addEventListener("load", setup, false);

function setup(){
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	
	initCells();
	updateCells();
	drawCells();
}


function initCells(){
	// Set-up cells object
	cells.nH = Math.floor(canvas.width/cellSize);
	cells.nV = Math.floor(canvas.height/cellSize);
	cells.n = 2 * cells.nH * cells.nV + cells.nV + cells.nH + 1;
	
	cells.origX = (canvas.width - cellSize * cells.nH)/2;
	cells.origY = (canvas.height - cellSize * cells.nV)/2;
	
	// Fill the cells list
	for(var i=0; i<=cells.nV; i++){
		// reg cell
		for(var j=0; j<=cells.nH; j++){
			var number = (2 * cells.nH + 1) * i + j;
			cells.cells.push({
				number: number,
				x: cells.origX + cellSize * j,
				y: cells.origY + cellSize * i,
				leftChild: (j > 0 && i < cells.nV) ? (number + cells.nH) : null,
				rightChild: (j < cells.nH && i < cells.nV) ? (number + cells.nH + 1) : null,
				leftInput: 0,
				rightInput: 0,
				leftOutput: ops["R"],
				rightOutput: ops["L"],
				name: "RL",
			});
		}
		
		// staggered cell
		if (i < cells.nV){
			for(var j=0; j<cells.nH; j++){
				number = (2 * cells.nH + 1) * i + j + cells.nH + 1;
				cells.cells.push({
					number: number,
					x: cells.origX + cellSize * (j + 1/2),
					y: cells.origY + cellSize * (i + 1/2),
					leftChild: (i < cells.nV) ? (number + cells.nH) : null,
					rightChild: (j < cells.nH && i < cells.nV) ? (number + cells.nH + 1) : null,
					leftInput: 0,
					rightInput: 0,
					leftOutput: ops["R"],
					rightOutput: ops["L"],
					name: "RL",
				});
			}
		}
	}
	
	// Add lattice-click function
	canvas.addEventListener('click', function(event){
		var x = (event.layerX - cells.origX)/cellSize;
		var y = (event.layerY - cells.origY)/cellSize;
		var j = Math.round(2*x)/2;
		var i = Math.round(2*y)/2;
		var n = Math.round((2 * cells.nH + 1) * i + j);
		var isIn = (Math.abs(x-j) + Math.abs(y-i) < 1/5)
			&& (Math.round(2*i + 2*j) % 2 == 0);
		//console.log([i, j, n, x, y, isIn, (Math.abs(x-j) + Math.abs(y-i))]);
		if(isIn) updateGateClick(n);
	});
	
	console.log(cells);
}


function drawCells(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// Text Font settings
	ctx.font = Math.floor(cellSize/8).toString() + 'px courier new';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	
	for (const cell of cells.cells){
		// Draw sticks
		if(!animation_static){
			ctx.lineWidth = 5;
			if(cell.leftChild){
				ctx.beginPath();
				ctx.moveTo(cell.x, cell.y);
				ctx.lineTo(cell.x - cellSize/2, cell.y + cellSize/2);
				ctx.strokeStyle = cell.leftOutput() ? 'red' : 'blue';
				ctx.stroke();
			}
			if(cell.rightChild){
				ctx.beginPath();
				ctx.moveTo(cell.x, cell.y);
				ctx.lineTo(cell.x + cellSize/2, cell.y + cellSize/2);
				ctx.strokeStyle = cell.rightOutput() ? 'red' : 'blue';
				ctx.stroke();
			}
		}
		else{
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'black';
			if(cell.leftChild){
				ctx.beginPath();
				ctx.moveTo(cell.x, cell.y -cellSize/16);
				ctx.lineTo(cell.x - cellSize/2, cell.y + cellSize/2 -cellSize/16);
				ctx.moveTo(cell.x  +cellSize/16, cell.y);
				ctx.lineTo(cell.x - cellSize/2  +cellSize/16, cell.y + cellSize/2);
				ctx.stroke();
			}
			if(cell.rightChild){
				ctx.beginPath();
				ctx.moveTo(cell.x, cell.y +cellSize/16);
				ctx.lineTo(cell.x + cellSize/2, cell.y + cellSize/2 +cellSize/16);
				ctx.moveTo(cell.x  +cellSize/16, cell.y);
				ctx.lineTo(cell.x + cellSize/2  +cellSize/16, cell.y + cellSize/2);
				ctx.stroke();
			}
		}

		// Draw rect
		ctx.lineWidth = 1;
		ctx.save();
		ctx.translate(cell.x, cell.y);
		ctx.rotate(Math.PI/4);
		ctx.fillStyle = 'white';
		ctx.fillRect(-cellSize/8, -cellSize/8, cellSize/4, cellSize/4);
		ctx.strokeStyle = 'black';
		ctx.strokeRect(-cellSize/8, -cellSize/8, cellSize/4, cellSize/4);
		ctx.restore();
		
		// Draw circle text
		ctx.fillStyle = 'black';
		if (!number_gate) ctx.fillText(cell.name, cell.x, cell.y);
		else ctx.fillText(cell.number.toString(), cell.x, cell.y);
		
		
		// Draw marble
		if(animation_static){
			ctx.fillStyle = 'black';
			var loopDistance = cellSize/2*(1-loopFraction);
			if (cell.leftInput){
				ctx.beginPath();
				ctx.arc(cell.x - loopDistance, cell.y - loopDistance, cellSize/16, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.fill();
			}
			if (cell.rightInput){
				ctx.beginPath();
				ctx.arc(cell.x + loopDistance, cell.y - loopDistance, cellSize/16, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.fill();
			}
		}
	}
}

function updateCells(){
	for(var i = 0; i < cells.cells.length; i++){
		var cell = animation_static ? cells.cells[cells.cells.length-1-i] : cells.cells[i];
		if(cell.leftChild)
			cells.cells[cell.leftChild].rightInput = cell.leftOutput();
		if(cell.rightChild)
			cells.cells[cell.rightChild].leftInput = cell.rightOutput();
	}
}

function updateGateClick(cellNumber){
	var newGate = document.querySelector('#gate').value;
	updateGate(cellNumber, newGate);
	if(!animation_static){
		updateCells();
		drawCells();
	}
}

function updateGate(cellNumber, newGate){
	cells.cells[cellNumber].name = newGate;
	cells.cells[cellNumber].leftOutput = ops[newGate[0]];
	cells.cells[cellNumber].rightOutput = ops[newGate[1]];
}

function buildAdder(){
	for(var i=0; i<=cells.nV; i++){
		// reg cell
		for(var j=0; j<=cells.nH; j++){
			var number = (2 * cells.nH + 1) * i + j;
			if(i == 0 || i == cells.nV) updateGate(number, "00");
			else if (j == 0) updateGate(number, "0R");
			else if (j == cells.nH) updateGate(number, "L0");
			else if (j <= cells.nH - i) updateGate(number, "&^");
			else updateGate(number, "LR");
		}
		// staggered cell
		if (i < cells.nV){
			for(var j=0; j<cells.nH; j++){
				var number = (2 * cells.nH + 1) * i + j + cells.nH + 1;
				if (j < cells.nH - i) updateGate(number, "&^");
				else updateGate(number, "LR");
			}
		}
	}
}


function drawFrame(time) {
	// Setup time delta
	time *= 0.001;
	var dt = time - then;
	if (dt > 0.1) dt = 0.1;  // clamp down timestep to avoid strange effects
	then = time;
	
	loopTime += dt;
	if (loopTime > loopLength){
		updateCells();
		loopTime = 0;
	}
	loopFraction = (loopTime % loopLength)/parseFloat(loopLength);
	
	drawCells();
	
	animation = requestAnimationFrame(drawFrame);
}

function stop(){
	if (animation != null) cancelAnimationFrame(animation);
}

