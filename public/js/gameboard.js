define([], function() {
	var initialize = function() {
			HTMLCanvasElement.prototype.toBoard = function(config) {
				var self = this;
				var board = Object.create(Board);
				config.el = self;
				config.offsetTop = this.offsetTop;
				config.offsetLeft = this.offsetLeft;
				board.init(config);
				board.render();
				self.onCellClick = self.onCellClick ||
				function(callback) {
					board.onCellClick(callback);
				};
				self.drawPiece = self.drawPiece ||
				function(cell, piece) {
					board.drawPiece(cell, piece);
				};
				self.getIdByCell = self.getIdByCell ||
				function(cell) {
					return board.getIdByCell(cell);
				}
				self.drawPieceByCoordinates = function(x, y, piece) {
					for(i = 0; i < board.cells.length; i++) {
						var cell = board.cells[i];
						if(cell.column === x && cell.row === y) {
							board.drawPiece(cell, piece);
						}
					}
				}
			}
		};

	function Cell(column, row) {
		this.column = column;
		this.row = row;
	}

	Cell.prototype.equals = function(cell) {
		if(cell && this.column === cell.column && this.row === cell.row) return true;
		return false;
	};

	Array.prototype.horizontal = function(x) {
		var newCol = [];
		for(var i = 0; i < this.length; i++) {
			var cell = this[i];
			if(cell.row === x) newCol.push(cell);
		}
		return newCol;
	};

	Array.prototype.vertical = function(y) {
		var newCol = [];
		for(var i = 0; i < this.length; i++) {
			var cell = this[i];
			if(cell.column === y) newCol.push(cell);
		}
		return newCol;
	};

	// TODO: This of a better way to do this
	Array.prototype.diagonal = function(x, y) {
		var newCol = [];
		// for (var i = 0; i < this.length; i++) {
		// var cell = this[i];
		// if (cell.row === x && cell.column === y)
		// newCol.push(cell);
		// }
		return newCol;
	};

	var Board = {
		init: function(config) {
			var self = this;
			var browserDimension = getBrowserDimension();
			self.el = config.el;
			self.rows = config.rows;
			self.width = config.width === 'auto' ? browserDimension[0] : config.width;
			self.height = config.height === 'auto' ? browserDimension[1] : config.height;
			self.columns = config.columns;
			self.cellColor = config.cellColor;
			self.cellWidth = config.cellWidth;
			self.cellHeight = config.cellHeight;
			self.context = self.el.getContext('2d');
			self.showGridLines = config.showGridLines;
			self.gridLineColor = config.gridLineColor;
			self.backgroundColor = config.backgroundColor;
			self.alternateCellColor = config.alternateCellColor;
			self.useAlgebraicNotation = config.useAlgebraicNotation;
			self.pieces = config.pieces;
			self.nonZeroBasedIndex = config.nonZeroBasedIndex;
			self.offsetX = config.offsetLeft;
			self.offsetY = config.offsetTop;
		},

		render: function() {
			var self = this;
			self.setAvailableCells();
			self.setCanvasDimension();
			self.drawBoard();
			self.createCells();
			if(self.backgroundColor) self.setBackgroundColor();
			if(self.cellColor) self.setCellColors(self.cellColor, self.alternateCellColor);
			self.writeCellIds();
			if(self.pieces) self.drawPieces();
			self.bindEvents();
		},

		bindEvents: function() {
			var self = this;
			self.addListener('click', function(e) {
				var cell = self.getCellByMouseEvent(e);
				self.cellClickHistory = self.cellClickHistory || [];
				self.cellClickHistory.push(cell);
				console.log(self.cellClickHistory);
			});
		},

		setAvailableCells: function() {
			var self = this;
			self.columnLength = Math.floor(self.width / self.cellWidth);
			self.rowLength = Math.floor(self.height / self.cellHeight);
			if(self.columns) {
				self.columnLength = self.columns;
			}
			if(self.rows) {
				self.rowLength = self.rows;
			}
		},

		setCanvasDimension: function() {
			var self = this;
			self.width = self.cellWidth * self.columnLength;
			self.height = self.cellHeight * self.rowLength;
			self.width = self.showGridLines ? self.width + 1 : self.width;
			self.height = self.showGridLines ? self.height + 1 : self.height;
			self.el.width = self.width;
			self.el.height = self.height;
		},

		drawBoard: function() {
			var self = this;
			for(var x = 0; x < self.width; x += self.cellWidth) {
				self.context.moveTo(0.5 + x, 0);
				self.context.lineTo(0.5 + x, self.height);
			}
			for(var y = 0; y < self.height; y += self.cellHeight) {
				self.context.moveTo(0, 0.5 + y);
				self.context.lineTo(self.width, 0.5 + y);
			}
			if(self.showGridLines) {
				self.context.storkeStyle = self.gridLineColor || '#000';
				self.context.stroke();
			}
		},

		createCells: function() {
			var self = this;
			self.cells = [];
			self.cellIds = [];
			var alphabetArray;
			if(self.useAlgebraicNotation) {
				var alphabet = 'abcdefghijklmnopqrstuvwxyz';
				if(self.columnLength > 26) {
					// TODO: Fix when columnLength is greater than 26
				}
				alphabetArray = alphabet.split('').slice(0, self.columnLength);
			}
			var index = 0;
			for(var i = 0; i < self.columnLength; i++) {
				for(var j = 0; j < self.rowLength; j++) {
					index = (i * self.rowLength) + j;
					if(self.useAlgebraicNotation) index = alphabetArray[i] + (self.rowLength - j);
					else if(self.nonZeroBasedIndex) index += 1;
					self.cells.push(new Cell(i, j));
					self.cellIds.push(index);
				}
			}
		},

		setBackgroundColor: function(color) {
			var self = this;
			self.el.style.backgroundColor = color || self.backgroundColor;
		},

		setCellColors: function(primaryColor, alternateColor) {
			var self = this;
			alternateColor = alternateColor || self.backgroundColor || 'transparent';
			var even = self.rowLength % 2 == 0;
			var coords, x, y;
			for(var i = 0; i < self.cells.length; i++) {
				coords = self.getCellCoordinates(self.cells[i]);
				x = coords[0];
				y = coords[1];
				if(even && ((parseInt(i / self.rowLength) + i) % 2 == 0) || (!even && i % 2 == 0)) {
					self.context.fillStyle = primaryColor;
				} else {
					self.context.fillStyle = alternateColor;
				}
				self.context.fillRect(x, y, self.cellWidth, self.cellHeight);
			}
		},

		drawPieces: function() {
			var self = this;
			var id;
			self.cellPieces = [];
			for(var i = 0; i < self.pieces.length; i++) {
				id = self.pieces[i].id || i;
				self.drawPiece(self.getCellById(id), self.pieces[i].image);
			}
		},

		drawPiece: function(cell, piece) {
			var self = this;
			var image = new Image();
			image.src = piece;
			var coordinates = self.getCellCoordinates(cell);
			if(!self.cellPieces) self.cellPieces = [];
			self.cellPieces.push(self.getIdByCell(cell));
			image.onload = function() {
				var x = coordinates[0] + ((self.cellWidth - image.width) / 2);
				var y = coordinates[1] + ((self.cellHeight - image.height) / 2);
				self.context.drawImage(image, x, y);
			}
		},

		hasPieceOnId: function(id) {
			var self = this;
			if(id) {
				if(self.cellPieces.indexOf(id) > -1) return true;
			}
			return false;
		},

		hasPieceOnCell: function(cell) {
			var self = this;
			if(cell && self.cellPieces) {
				var id = self.getIdByCell(cell);
				return self.hasPieceOnId(id);
			}
			return false;
		},

		getCellCoordinates: function(cell) {
			var self = this;
			if(cell) {
				var x = cell.column * self.cellWidth;
				var y = cell.row * self.cellHeight;
				return [x, y];
			}
		},

		getCellByCoordinates: function(x, y) {
			var self = this;
			x = Math.min(x, self.width * self.cellWidth);
			y = Math.min(y, self.height * self.cellHeight);
			var column = Math.floor(x / self.cellWidth);
			var row = Math.floor(y / self.cellHeight);
			return new Cell(column, row);
		},

		getCellByMouseEvent: function(e) {
			var self = this;
			var coords = self.getCursorPosition(e);
			return self.getCellByCoordinates(coords[0], coords[1]);
		},

		getCellById: function(id) {
			var self = this;
			if(self.useAlgebraicNotation) return self.cells[self.cellIds.indexOf(id)];
			return self.cells[id];
		},

		getIdByCell: function(cell) {
			var self = this;
			if(cell) {
				for(var i = 0; i < self.cells.length; i++) {
					if(cell.equals(self.cells[i])) return self.cellIds[i];
				}
			}
		},

		writeCellIds: function() {
			var self = this;
			for(var i = 0; i < self.cells.length; i++) {
				self.writeOnCell(self.cells[i], self.cellIds[i]);
			}
		},

		writeOnCell: function(cell, text) {
			var self = this;
			var coordinates = self.getCellCoordinates(cell);
			var x = coordinates[0];
			var y = coordinates[1];
			self.context.fillStyle = 'black';
			self.context.font = '8pt tahoma';
			self.context.textAlign = 'left';
			self.context.textBaseline = 'top';
			self.context.fillText(text, x, y);
		},

		// events
		addListener: function(eventType, delegate) {
			var self = this;
			self.el.addEventListener(eventType, delegate, false);
		},

		removeListener: function(eventType, delegate) {
			var self = this;
			self.el.removeEventListener(eventType, delegate, false);
		},

		getCursorPosition: function(e) {
			var x, y;
			if(e.pageX || e.pageY) {
				console.log(this.offsetX);
				x = e.pageX - this.offsetX;
				y = e.pageY - this.offsetY;
			} else {
				x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
				y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
			}
			return [x, y];
		},

		setEventArgs: function(e) {
			var self = this;
			var cell = self.getCellByMouseEvent(e);
			var numberOfPieces = self.cellPieces ? self.cellPieces.length : 0;
			var board = {
				cells: self.cells,
				numberOfPieces: numberOfPieces
			};
			var eventArg = {
				board: board,
				cell: cell,
				id: self.getIdByCell(cell),
				isEmpty: !self.hasPieceOnCell(cell)
			};
			return eventArg;
		},

		onCellClick: function(callback) {
			var self = this;
			var clickEventFunction = function(e) {
					var eventArg = self.setEventArgs(e);
					var args = setArguments(eventArg, arguments);
					callback.apply(self, args);
				};
			self.addListener('click', clickEventFunction);
		}
	};

	function setArguments(eventArg, givenArgs) {
		var args = [];
		args.push(eventArg);
		for(var i = givenArgs.length; i > 0; i--) {
			args.push(givenArgs[i]);
		}
		return args;
	}

	function getBrowserDimension() {
		var x, y = 0;
		if(window.innerWidth || window.innerHeight) {
			x = window.innerWidth;
			y = window.innerHeight;
		} else if(document.documentElement && document.documentElement.clientWidth || document.documentElement.clientHeight) {
			x = document.documentElement.clientWidth;
			y = document.documentElement.clientHeight;
		} else if(document.body) {
			x = document.body.clientWidth;
			y = document.body.clientHeight;
		}
		return [x, y];
	}

	return{
		initialize: initialize
	}
});