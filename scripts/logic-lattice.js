// A script for running a square-lattice logic circuit

// Define globals
var canvas;
var ctx;

var cellSize = 180;
var cells = {
	n: 0,
	nH: 0,
	nV: 0,
	cells: [],
	origX: 0,
	origY: 0
};

window.addEventListener("load", setUp, false);

function setUp(){
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
				leftInput: 1,
				rightInput: 1,
				leftOutput: function (){return this.leftInput && this.rightInput;},
				rightOutput: function (){return (this.leftInput || this.rightInput) - (this.leftInput && this.rightInput);},
				name: "&^",
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
					leftInput: 1,
					rightInput: 1,
					leftOutput: function (){return this.leftInput;},
					rightOutput: function (){return this.rightInput;},
					name: "LR",
				});
			}
		}
	}
	console.log(cells);
}


function drawCells(){
	// Text Font settings
	ctx.font = Math.floor(cellSize/8).toString() + 'px courier new';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	
	for (const cell of cells.cells){
		// Draw sticks
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
		
		// Draw circle
		//ctx.beginPath();
		//ctx.arc(cell.x, cell.y, cellSize/8, 0, Math.PI * 2, true);
		//ctx.closePath();
		//ctx.fillStyle = 'white';
		//ctx.fill();
		//ctx.strokeStyle = 'black';
		//ctx.stroke();
		
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
		ctx.fillText(cell.name, cell.x, cell.y);
	}
}

function updateCells(){
	for(var i = 0; i < cells.cells.length; i++){
		var cell = cells.cells[i];
		if(cell.leftChild)
			cells.cells[cell.leftChild].rightInput = cell.leftOutput();
		if(cell.rightChild)
			cells.cells[cell.rightChild].leftInput = cell.rightOutput();
	}
}
