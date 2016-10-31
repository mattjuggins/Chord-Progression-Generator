/**
* @Author: Matthew Juggins <matthewjuggins>
* @Date:   04-10-16
* @Email:  jugginsmatthew@gmail.com
* @Last modified by:   matthewjuggins
* @Last modified time: 26-10-16
*/



/* NOT WORKING IN SAFARI CURRENTLY.*/
/*
 * Chord progression Generator.js
 * Matthew Juggins
 * Modified: 	30/08/16 : Refactoring,
 * 				31/08/16 : Fixed variation "O"
 *				13/09/16 : Darker theme to match other pens on showcase
 *
 */

var polySynth = new Tone.PolySynth(4, Tone.FMSynth, {
	"harmonicity": 0.5,
	"modulationIndex": 1.2,
	"oscillator": {
		"type": "fmsawtooth",
		"modulationType": "sine",
		"modulationIndex": 20,
		"harmonicity": 5
	},
	"envelope": {
		"attack": 0.2,
		"decay": 0.3,
		"sustain": 0.1,
		"release": 1.2
	},
	"modulation": {
		"volume": 0,
		"type": "triangle"
	},
	"modulationEnvelope": {
		"attack": 0.35,
		"decay": 0.1,
		"sustain": 1,
		"release": 0.01
	}
}).toMaster();
var colors = [
	["#FF4351", "#FFA2A9", "#FF6E79", "#FF1627", "#FF0013"],
	["#55DBE1", "#F4FDFD", "#98E9ED", "#1ED4DC", "#00C8D2"],
	["#FC890F", "#FFE6CC", "#FAAE5E", "#CB6800", "#9E5100"],
	["#7B72E9", "#FAFAFE", "#B4AFF3", "#4D41E4", "#1B0BE7"],
	["#FFD426", "#FFF7D8", "#FFE26D", "#DDB100", "#AD8B00"],
	["#ED4695", "#FCE8F1", "#F286B9", "#ED0673", "#D60065"],
	["#45E845", "#E8FBE8", "#85EE85", "#06E706", "#00CC00"],
	["#FD6531", "#FFE5DD", "#FF9975", "#E23A00", "#B22D00"],
	["#1B9CF7", "#ACD3EF", "#58B1F0", "#0193FA", "#005A99"],
	["#FEAE1B", "#FFEFD2", "#FFC966", "#D48A00", "#A66C00"],
	["#DB49DB", "#FAECFA", "#E789E7", "#D811D8", "#B600B6"],
	["#A4DE37", "#E7F2D3", "#C7EF7B", "#82C700", "#69A000"]
]; // iOS7 colors to match keys in the circle of 5ths.
var chordProgression;
var fancyCount = 0;
var chordProgressions = function() {
	/*********************
	 * Priveledged methods
	 **********************/
	// Adds array elements
	this.getSum = function(total, num) {
		return total + num;
	};

	// Return random value between two integers, 'min' and 'max'
	this.getRandomInRange = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	/*******************
	 * Public properties
	 ********************/
	this.notesArray = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
	this.modulateAmount = [];
	this.key = [];
	this.tonality = [];
	this.currentSequence = [];
	this.currentNumerals = [];
	this.currentIntervals = [];
	this.currentNames = [];
	this.currentNotes = [];
	this.currentText = [];
	this.variations = [];
	this.currentInfo = [];
	this.info = [
		// I, II, III, IV, V, VI, Vii, VII, ♭II, ♭III, ♭VI
		// Major key ♭II has dominant 7th for tritone
		{
			mode: "Major",
			triadPrefix: ["", "m", "m", "", "", "m", "&#176;", "", "m", "m", "m"],
			seventhPrefix: ["M7", "m7", "m7", "M7", "7", "m7", "&#8709;7", "7", "7", "m7", "m7"],
			numerals: ["I", "ii", "iii", "IV", "V", "vi", "vii", "VII", "&#9837;ii", "&#9837;iii", "&#9837;vi"],
			intervals: [
				[0, 4, 7],
				[2, 5, 9],
				[4, 7, 11],
				[5, 9, 12],
				[7, 11, 14],
				[9, 12, 16],
				[11, 14, 17],
				[11, 15, 17],
				[1, 5, 8],
				[3, 6, 10],
				[8, 11, 15]
			],
			sevenths: [11, 12, 14, 16, 17, 19, 21, 21, 11, 13, 18]
		}, {
			mode: "Natural Minor",
			triadPrefix: ["m", "&#176;", "", "m", "m", "", "&#176;", "", "&#176;", "", ""],
			seventhPrefix: ["m7", "&#8709;7", "M7", "m7", "m7", "M7", "&#8709;7", "7", "&#8709;7", "M7", "M7"],
			numerals: ["i", "ii", "III", "iv", "v", "VI", "vii", "VII", "&#9837;ii", "&#9837;III", "&#9837;VI"],
			intervals: [
				[0, 3, 7],
				[2, 5, 8],
				[3, 7, 10],
				[5, 8, 12],
				[7, 10, 14],
				[8, 12, 15],
				[10, 13, 17],
				[10, 14, 17],
				[1, 4, 7],
				[2, 6, 9],
				[7, 11, 14]
			],
			sevenths: [10, 12, 14, 15, 17, 19, 20, 20, 11, 13, 18]
		}, {
			mode: "Harmonic Minor",
			triadPrefix: ["m", "&#176;", "+", "m", "", "", "&#176;", "", "&#176;", "+", ""],
			seventhPrefix: ["mM7", "&#8709;7", "+M7", "m7", "7", "M7", "&#8709;7", "7", "&#8709;7", "+M7", "M7"],
			numerals: ["i", "ii", "III", "iv", "V", "VI", "vii", "VII", "&#9837;ii", "&#9837;III", "&#9837;VI"],
			intervals: [
				[0, 3, 7],
				[2, 5, 8],
				[3, 7, 11],
				[5, 8, 12],
				[7, 11, 14],
				[8, 12, 15],
				[11, 14, 17],
				[11, 15, 18],
				[1, 4, 7],
				[2, 6, 10],
				[7, 11, 14]
			],
			sevenths: [11, 12, 14, 15, 17, 19, 20, 21, 11, 13, 18]
		}, {
			mode: "Melodic Minor",
			triadPrefix: ["m", "m", "+", "", "", "&#176;", "&#176;", "", "m", "+", "&#176;"],
			seventhPrefix: ["mM7", "m7", "+M7", "7", "7", "&#8709;7", "&#8709;7", "7", "m7", "+M7", "&#8709;7"],
			numerals: ["i", "ii", "III", "IV", "V", "vi", "vii", "VII", "&#9837;ii", "&#9837;III", "&#9837;vi"],
			intervals: [
				[0, 3, 7],
				[2, 5, 9],
				[3, 7, 11],
				[5, 9, 12],
				[7, 11, 14],
				[9, 12, 15],
				[11, 14, 17],
				[11, 15, 18],
				[1, 4, 8],
				[2, 6, 10],
				[8, 11, 14]
			],
			sevenths: [11, 12, 14, 15, 17, 19, 21, 21, 11, 13, 18]
		}
	]
	this.setTonality();
	this.setKey();
	this.setProgression();
	this.setVariations();
	this.setPrintText();
};

/* Public Methods */
chordProgressions.prototype = {

	setTonality: function() {
		// Sets the tonality for the chord progressions generated
		var tonalities = ["Major", "Natural Minor", "Harmonic Minor", "Natural Minor"],
			tonalityWeights = [3, 1, 1, 1],
			weightingSum = tonalityWeights.reduce(this.getSum),
			target = this.getRandomInRange(1, weightingSum),
			j = 0;

		while (target > 0) {
			target -= tonalityWeights[j];
			j++;
		}

		this.tonality = tonalities[j - 1];
		this.currentInfo = this.info.find(x => x.mode === this.tonality);
	},

	setKey: function() {
		// Sets the key for the chord progressions generated and shifts the master array of notes by the correct amount
		this.modulateAmount = this.getRandomInRange(0, 11);
		this.notesArray.rotate(this.modulateAmount);
		this.key = this.notesArray[0];
	},

	getChordNotes: function(chordIndexes) {
		var chord = [],
			interval = 0,
			octave = "";

		for (var i = 0; i < chordIndexes.length; i++) {
			interval = chordIndexes[i];

			if (interval < 0 - this.modulateAmount) {
				octave = "2";
			} else if (interval < 12 - this.modulateAmount) {
				octave = "3";
			} else if (interval < 24 - this.modulateAmount) {
				octave = "4";
			} else if (interval < 36 - this.modulateAmount) {
				octave = "5";
			} else {
				octave = "6";
			}

			while (interval < 0 || interval > 11) {
				if (Math.sign(interval) == 1) {
					interval -= 12;
				} else {
					interval += 12;
				}
			}
			chord[i] = this.notesArray[interval].concat(octave);
		}
		return chord;
	},

	findChordSequenceIndexes: function(val) {
		var indexes = [];
		for (var i = 0; i < this.currentSequence.length; i++) {
			if (this.currentSequence[i] === val) {
				indexes.push(i);
			}
		}
		return indexes;
	},

	alterChord: function(indexes, intervals, numerals, triadName, seventhName, inversionName, noteToChange, sequenceChange) {
		var notes, tempIntervals, inversionIndex,
			newNumerals = this.currentNumerals,
			newNames = this.currentNames,
			newIntervals = this.currentIntervals,
			newNotes = this.currentNotes,
			newSequence = this.currentSequence;

		for (var i = 0; i < indexes.length; i++) {
			if (noteToChange == "chord") {
				tempIntervals = intervals[i];
			} else {
				tempIntervals = newIntervals[indexes[i]];
				tempIntervals[noteToChange[i]] = tempIntervals[0] + intervals[i];
			}

			notes = this.getChordNotes(tempIntervals);
			newIntervals[indexes[i]] = tempIntervals;
			newNotes[indexes[i]] = notes;

			if (numerals[i] !== "retain") {
				newNumerals[indexes[i]] = numerals[i];
			}

			if (sequenceChange[i] !== "retain") {
				newSequence[indexes[i]] = sequenceChange[i];
				newNames[indexes[i]].note = this.notesArray[intervals[0][0]];
			}

			if (triadName[i] !== "retain") {
				newNames[indexes[i]].triadPrefix = triadName[i];
			}

			if (seventhName[i] !== "retain") {
				newNames[indexes[i]].seventhPrefix = seventhName[i];
			}

			if (inversionName[i] !== "retain") {
				switch (inversionName[i]) {
					case "third":
						inversionIndex = 1;
						break;

					case "fifth":
						inversionIndex = 2;
						break;

					case "flatFifth":
						inversionIndex = 2;
						break;

					case "seventh":
						inversionIndex = 3;
						break;

					case "":
						inversionIndex = -1;
				}

				if (inversionIndex !== -1) {
					var fullNote = newNotes[indexes[i]][inversionIndex];
					var currentNote = fullNote.substr(0, fullNote.length - 1);
					newNames[indexes[i]].inversionPrefix = "/".concat(currentNote);
				} else {
					newNames[indexes[i]].inversionPrefix = "";
				}
			}
		}

		this.currentNumerals = newNumerals;
		this.currentNames = newNames;
		this.currentIntervals = newIntervals;
		this.currentNotes = newNotes;
		this.currentSequence = newSequence;
	},

	addChord: function(newChordIndexes, splicePoint) {
		var tempIntervals, inversionIndex,
			newNumerals = this.currentNumerals,
			newNames = this.currentNames,
			newIntervals = this.currentIntervals,
			newNotes = this.currentNotes,
			newSequence = this.currentSequence;

		for (var i = 0; i < newChordIndexes.length; i++) {
			newSequence.splice(splicePoint[i], 0, newChordIndexes[i]);
			newNumerals.splice(splicePoint[i], 0, this.currentInfo.numerals[newChordIndexes[i]]);
			newIntervals.splice(splicePoint[i], 0, this.currentInfo.intervals[newChordIndexes[i]]);
			var notes = this.getChordNotes(newIntervals[splicePoint[i]]);
			newNotes.splice(splicePoint[i], 0, notes);
			newNames.splice(splicePoint[i], 0, {
				note: this.notesArray[newIntervals[splicePoint[i]][0]],
				triadPrefix: this.currentInfo.triadPrefix[newChordIndexes[i]],
				seventhPrefix: this.currentInfo.seventhPrefix[newChordIndexes[i]],
				inversionPrefix: ""
			});
		}
		this.currentNumerals = newNumerals;
		this.currentNames = newNames;
		this.currentIntervals = newIntervals;
		this.currentNotes = newNotes;
		this.currentSequence = newSequence;
	},

	setProgression: function() {
		// Sets the initial chord progression as triads. Also sets which variations can be made to make the progression fancier.
		var fixedProgression = [7, 2, 5],
			chordCount = 1,
			predominants = [1, 3], // II and IV scale degrees
			dominants = [4, 6], // V and VII scale degrees
			nextChord = this.getRandomInRange(1, 6); // Does not select VII in minor sequences
		this.currentSequence = [0]; // Add I chord to sequence
		this.currentSequence.push(nextChord);

		if (predominants.indexOf(nextChord) !== -1) {
			// Second chord in sequence is predominant
			if (predominants.indexOf(nextChord) == 0) {
				// II
				this.currentSequence.push(dominants[Math.round(Math.random())], 0);
			} else {
				// IV
				if (Math.random() < .5 && this.tonality !== "Major") {
					Array.prototype.push.apply(this.currentSequence, fixedProgression);
					this.currentSequence.push(predominants[Math.round(Math.random())], dominants[Math.round(Math.random())], 0);
				} else {
					this.currentSequence.push(dominants[Math.round(Math.random())], 0);
				}
			}
		} else if (dominants.indexOf(nextChord) !== -1) {
			// Second chord in sequence is a dominant
			if (dominants.indexOf(nextChord) == 1 && Math.random() < .5 && this.tonality == "Major") {
				// vii major
				this.currentSequence.push(fixedProgression[1], fixedProgression[2], predominants[Math.round(Math.random())], dominants[Math.round(Math.random())], 0);
			} else {
				// V or vii, repeat two chord seqeunce
				Array.prototype.push.apply(this.currentSequence, this.currentSequence);
			}
		} else {
			// Second chord is neither dominant or predominant
			if (fixedProgression.indexOf(nextChord) == 1) {
				// III
				this.currentSequence.push(fixedProgression[2], predominants[Math.round(Math.random())], dominants[Math.round(Math.random())], 0);
			} else {
				// VI
				this.currentSequence.push(predominants[Math.round(Math.random())], dominants[Math.round(Math.random())], 0);
			}
		};

		for (var i = 0; i < this.currentSequence.length; i++) {
			this.currentNumerals[i] = this.currentInfo.numerals[this.currentSequence[i]];
			this.currentIntervals[i] = this.currentInfo.intervals[this.currentSequence[i]];
			this.currentNames[i] = {
				note: this.notesArray[this.currentIntervals[i][0]],
				triadPrefix: this.currentInfo.triadPrefix[this.currentSequence[i]],
				seventhPrefix: "",
				inversionPrefix: ""
			};
			this.currentNotes[i] = this.getChordNotes(this.currentIntervals[i]);
		}
	},

	setVariations: function() {
		// Analyses sequence at determines the possible variations that can be made to the chord progression
		var secondVariation = "A",
			thirdVariation = ["B", "C", "D"],
			fourthVariation = [];

		if (this.tonality !== "Major") {
			// Minor
			fourthVariation.push("P");
			if (this.currentSequence.indexOf(1) !== -1) {
				// Contains II chord
				thirdVariation.push("E");
				if (this.currentSequence[this.currentSequence.indexOf(1) + 1] == 4) {
					fourthVariation.push("K");
				}
			}

			if (this.currentSequence.indexOf(3) !== -1) {
				// Contains IV chord, retain for future use
			}

			if (this.currentSequence.indexOf(4) !== -1) {
				// Contains V chord
				thirdVariation.push("F");
				if (this.currentSequence.indexOf(4) == 1) {
					fourthVariation.push("L");
				}
			}

		} else {
			// Major
			fourthVariation.push("I");
			if (this.currentSequence.indexOf(1) !== -1) {
				// Contains II chord
				thirdVariation.push("E");
				if (this.currentSequence[this.currentSequence.indexOf(1) + 1] == 4) {
					fourthVariation.push("J");
				}

			}

			if (this.currentSequence.indexOf(3) !== -1) {
				// Contains IV chord
				thirdVariation.push("G");
			}

			if (this.currentSequence.indexOf(4) !== -1) {
				// Contains V chord
				thirdVariation.push("F");
				fourthVariation.push("H", "O");
				if (this.currentSequence.indexOf(4) == 1) {
					fourthVariation.push("L");
				}
			}
		}
		if (this.currentSequence.indexOf(5) !== -1) {
			// Contains VI chord
			if (this.currentSequence.indexOf(5) == 1) {
				// Contains I - VI progression
				fourthVariation.push("M");
			}

			if (this.currentSequence[this.currentSequence.indexOf(5) + 1] == 1) {
				// Contains VI - II progression
				fourthVariation.push("N");
			}
		}

		this.variations = [secondVariation, thirdVariation[this.getRandomInRange(0, thirdVariation.length - 1)], fourthVariation[this.getRandomInRange(0, fourthVariation.length - 1)]];
	},

	decorateProgression: function(number) {
		var alter, add, indexes, intervals, numerals, triadName, seventhName, inversionName, newInterval, noteToChange, sequenceChange, newChordIndexes, newSequenceLength, splicePoint;

		console.log(this.variations[number]);
		switch (this.variations[number]) {
			case "A":
				// Variation A: 80% change to add suitable 7th to note.
				for (var i = 0; i < this.currentSequence.length; i++) {
					if (Math.random() < .8) {
						this.currentIntervals[i] = this.currentIntervals[i].concat(this.currentInfo.sevenths[this.currentSequence[i]]);
						this.currentNames[i].seventhPrefix = this.currentInfo.seventhPrefix[this.currentSequence[i]];
						this.currentNotes[i] = this.getChordNotes(this.currentIntervals[i]);
					}
				}

				break;
			case "B":
				// Variation B: Move the 5th to the bass in  I chords
				alter = 1;
				add = 0;
				indexes = this.findChordSequenceIndexes(0);
				intervals = new Array(indexes.length).fill(-5);
				numerals = new Array(indexes.length).fill("retain");
				triadName = new Array(indexes.length).fill("retain");
				seventhName = new Array(indexes.length).fill("retain");
				inversionName = new Array(indexes.length).fill("fifth");
				noteToChange = new Array(indexes.length).fill(2);
				sequenceChange = new Array(indexes.length).fill("retain");
				break;

			case "C":
				// Variation C: Make I chords 6 chords
				alter = 1;
				add = 0;
				indexes = this.findChordSequenceIndexes(0);
				intervals = new Array(indexes.length).fill(9);
				numerals = new Array(indexes.length).fill("retain");
				triadName = new Array(indexes.length).fill("retain");
				seventhName = new Array(indexes.length).fill("6");
				inversionName = new Array(indexes.length).fill("retain");
				noteToChange = new Array(indexes.length).fill(3);
				sequenceChange = new Array(indexes.length).fill("retain");
				break;

			case "D":
				// Variation D: Make I chords add9 chords
				alter = 1;
				add = 0;
				indexes = this.findChordSequenceIndexes(0);
				intervals = new Array(indexes.length).fill(14);
				numerals = new Array(indexes.length).fill("retain");
				triadName = new Array(indexes.length).fill("retain");
				seventhName = new Array(indexes.length).fill("add9");
				inversionName = new Array(indexes.length).fill("retain");
				noteToChange = new Array(indexes.length).fill(3);
				sequenceChange = new Array(indexes.length).fill("retain");

				break;

			case "E":
				// Variation E: Make II chords add9 chords
				alter = 1;
				add = 0;
				indexes = this.findChordSequenceIndexes(1);
				intervals = new Array(indexes.length).fill(14);
				numerals = new Array(indexes.length).fill("retain");
				triadName = new Array(indexes.length).fill("retain");
				seventhName = new Array(indexes.length).fill("add9");
				inversionName = new Array(indexes.length).fill("retain");
				noteToChange = new Array(indexes.length).fill(3);
				sequenceChange = new Array(indexes.length).fill("retain");
				break;

			case "F":
				// Variation F: Make V chord add9 chords
				alter = 1;
				add = 0;
				indexes = this.findChordSequenceIndexes(4);
				intervals = new Array(indexes.length).fill(14);
				numerals = new Array(indexes.length).fill("retain");
				triadName = new Array(indexes.length).fill("retain");
				seventhName = new Array(indexes.length).fill("add9");
				inversionName = new Array(indexes.length).fill("retain");
				noteToChange = new Array(indexes.length).fill(3);
				sequenceChange = new Array(indexes.length).fill("retain");
				break;

			case "G":
				// Variation G: Change I and IV chords to dominat 7 chords (major)
				alter = 1;
				add = 0;
				indexes = this.findChordSequenceIndexes(0);
				Array.prototype.push.apply(indexes, this.findChordSequenceIndexes(3));
				intervals = new Array(indexes.length).fill(10);
				numerals = new Array(indexes.length).fill("retain");
				triadName = new Array(indexes.length).fill("retain");
				seventhName = new Array(indexes.length).fill("7");
				inversionName = new Array(indexes.length).fill("retain");
				noteToChange = new Array(indexes.length).fill(3);
				sequenceChange = new Array(indexes.length).fill("retain");
				break;

			case "H":
				// Variation H: Tritone substitution
				alter = 1;
				add = 0;
				indexes = this.findChordSequenceIndexes(4);
				intervals = new Array(indexes.length).fill([2, 5, 8, 11]);
				numerals = new Array(indexes.length).fill("&#9837;II");
				triadName = new Array(indexes.length).fill("");
				seventhName = new Array(indexes.length).fill("&#9837;7");
				inversionName = new Array(indexes.length).fill("");
				noteToChange = new Array(indexes.length).fill("chord");
				sequenceChange = new Array(indexes.length).fill(8);
				break;

			case "I":
				// Variation I: Replace opening I chord with III, special cases between different tonalities.
				alter = 1;
				add = 0;
				indexes = this.findChordSequenceIndexes(0);
				indexes = [0];
				var tempIntervals = this.currentInfo.intervals[2];
				var tempSeventh = this.currentInfo.seventhPrefix[2];
				intervals = new Array(indexes.length).fill(tempIntervals);
				numerals = new Array(indexes.length).fill("iii");
				triadName = new Array(indexes.length).fill("");
				seventhName = new Array(indexes.length).fill(tempSeventh);
				inversionName = new Array(indexes.length).fill("");
				noteToChange = new Array(indexes.length).fill("chord");
				sequenceChange = new Array(indexes.length).fill(2);
				break;

			case "J":
				// Variation J: Moving bass line (major)
				alter = 1;
				add = 1;
				indexes = this.findChordSequenceIndexes(1);
				newChordIndexes = [1]; // II
				newSequenceLength = 4;
				splicePoint = [indexes[0] + 1];
				for (var i = 1; i < newSequenceLength; i++) {
					indexes.push(indexes[0] + i);
				}
				intervals = [-5, -6, "retain", -5]; // relative to root note of chord
				numerals = new Array(indexes.length).fill("retain");
				triadName = new Array(indexes.length).fill("retain");
				seventhName = new Array(indexes.length).fill("retain");
				inversionName = ["fifth", "flatFifth", "retain", "fifth"];
				noteToChange = [2, 2, "retain", 2];
				sequenceChange = new Array(indexes.length).fill("retain");
				break;

			case "K":
				// Variation K: Moving bass line (minor)
				alter = 1;
				add = 0;
				indexes = this.findChordSequenceIndexes(1);
				intervals = [-5, "retain", -5];
				numerals = new Array(indexes.length).fill("retain");
				triadName = new Array(indexes.length).fill("retain");
				seventhName = new Array(indexes.length).fill("retain");
				inversionName = ["fifth", "retain", "fifth"];
				noteToChange = [2, "retain", 2];
				sequenceChange = new Array(indexes.length).fill("retain");
				break;

			case "L":
				// Variation L: Chromatic passing chord (major/natural minor)
				alter = 0;
				add = 1;
				newChordIndexes = [2, 9, 1]; // III, ♭III, II
				splicePoint = [1, 2, 3];
				break;

			case "M":
				// Variation M: Half step approach between I and VI
				alter = 0;
				add = 1;
				newChordIndexes = [10]; // ♭VI
				splicePoint = [1];
				break;

			case "N":
				// Variation N: Half step approach between VI and II
				alter = 0;
				add = 1;
				newChordIndexes = [8]; // ♭II
				splicePoint = [1];
				break;

			case "O":
				// Variation O: Suspension
				alter = 1;
				add = 1;
				var temp = this.findChordSequenceIndexes(0);
				indexes = [temp[temp.length - 1]];
				newChordIndexes = [0]; // I
				newSequenceLength = 1;
				splicePoint = [indexes[0]];
				intervals = new Array(indexes.length).fill(5);
				numerals = new Array(indexes.length).fill("retain");
				triadName = new Array(indexes.length).fill("");
				seventhName = new Array(indexes.length).fill("7sus4");
				inversionName = new Array(indexes.length).fill("");
				noteToChange = new Array(indexes.length).fill(1);
				sequenceChange = new Array(indexes.length).fill("retain");
				break;

			case "P":
				// Variation P: I chord movement (minor)
				alter = 1;
				add = 1;
				indexes = [1];
				newChordIndexes = [0, 0]; // I
				newSequenceLength = 2;
				splicePoint = [1, 2];
				for (var i = 1; i < newSequenceLength; i++) {
					indexes.push(indexes[0] + i);
				}
				console.log(splicePoint);
				intervals = [8, 9]; // relative to root note of chord
				numerals = new Array(indexes.length).fill("retain");
				triadName = ["+", "retain"];
				seventhName = ["+M7", "6"];
				inversionName = new Array(indexes.length).fill("retain");
				noteToChange = [2, 3];
				sequenceChange = new Array(indexes.length).fill("retain");
		}

		if (add) {
			this.addChord(newChordIndexes, splicePoint);
		};
		if (alter) {
			this.alterChord(indexes, intervals, numerals, triadName, seventhName, inversionName, noteToChange, sequenceChange);
		};

		this.setPrintText();
	},

	setPrintText: function() {
		// Concatentes chord names and numerals to be printed
		for (var i = 0; i < this.currentSequence.length; i++) {
			var text = this.currentNames[i].note;
			if (this.currentNames[i].seventhPrefix !== "") {
				text += this.currentNames[i].seventhPrefix;
			} else {
				text += this.currentNames[i].triadPrefix;
			}
			text += this.currentNames[i].inversionPrefix;
			text += "<br />&#9900;<br />";
			text += this.currentNumerals[i];
			this.currentText[i] = text;
		}
	}
}

/*******************
 * Element callbacks
 ********************/
$('#refresh').on('click', function() {
	loadNewProgression("new", 0);
	fancyCount = 0;
	$(".fancyText").text("MAKE IT FANCIER");
	$("#fancy").removeClass("disabledButton");
	$("#fancy").addClass("button");
});

$('#play').on('click', function() {
	Tone.Transport.start();
});

$('#fancy').on('click', function() {
	if (fancyCount == 0) {
		loadNewProgression("improve", fancyCount);
		$(".fancyText").text("EVEN FANCIER");
		fancyCount++;
	} else if (fancyCount == 1) {
		loadNewProgression("improve", fancyCount);
		$(".fancyText").text("FANCIEST");
		fancyCount++;
	} else if (fancyCount == 2) {
		// Disable button
		$("#fancy").removeClass("button");
		$("#fancy").addClass("disabledButton");
		$(".fancyText").text("MAXIMUM FANCINESS");
		loadNewProgression("improve", fancyCount);
		$('#fancy').redraw();
		loadNewProgression("improve", fancyCount);
	} else {
		// Disabled state
		console.error("To many stages of chord progression decoration")
	}
});

$(document).on('mousedown', ".chordBlock", function() {
	var chordNumber = $(this).css("order");
	polySynth.triggerAttack(chordProgression.currentNotes[chordNumber]);
});

$(document).on('mouseup mouseleave', ".chordBlock", function() {
	var chordNumber = $(this).css("order");
	polySynth.triggerRelease(chordProgression.currentNotes[chordNumber]);
});

// Generate a new progression or make a current progression fancier
function loadNewProgression(newProgression, improvement) {
	var colorSet, notes, time, time2, blockId;

	if (newProgression == "new") {
		chordProgression = new chordProgressions();
	} else {
		chordProgression.decorateProgression(improvement);
	};

	// Set colors
	if (chordProgression.tonality !== "major") {
		colorSet = colors[chordProgression.modulateAmount];
	} else {
		var tempIndex = chordProgression.modulateAmount - 3;
		if (tempIndex < 0) {
			tempIndex += 12;
		}
		colorSet = colors[tempIndex];
	};

	var childCount = $(".progression div").length;
	for (var i = 0; i < chordProgression.currentSequence.length; i++) {
		blockId = "block".concat(i.toString());

		if (i < childCount) {
			updateChordBlock(blockId, colorSet, i);
		} else {
			//Create new div and append hidden
			var $div = $("<div>", {
				id: blockId,
				"class": "chordBlock"
			}).hide();
			$(".progression").append($div);
			// Update CSS
			updateChordBlock(blockId, colorSet, i);
			// Fade In
			$("#" + blockId).fadeIn(500);
		}
	}

	if (chordProgression.currentSequence.length < childCount) {
		for (var i = chordProgression.currentSequence.length; i < childCount; i++) {
			blockId = "block".concat(i.toString());
			$("#" + blockId).fadeOut(300, function() {
				$("#" + blockId).remove();
			});
		}
	}

	// Set css and text properties
	$(".keyTonality").text("Key: ".concat(chordProgression.key, "\tTonality: ", chordProgression.tonality));

	$(".button").css({
		"background": colorSet[4]
	});

	$(".disabledButton").css({
		"background": colorSet[4]
	});
}

// Update an individual block containing a chord
function updateChordBlock(blockId, colorSet, order) {
	var color,
		interval = chordProgression.currentSequence[order];
	// Retained incase of colour scheme changes
	if (interval == 0) {
		color = 0; // Root
	} else if (interval == 4 || interval == 6) {
		color = 0; // Dominant
	} else {
		color = 0; // Other notes
	}

	// Update CSS and text
	$("#" + blockId).css({
		"order": order,
		"-webkit-order": order,
		"border-right": "1px solid #292929",
		"background": colorSet[color],
		"color": "#FFF",
		"z-index": 1,
		"flex-grow": 1,
		"-webkit-flex-grow": 1
	});
	$("#" + blockId).html(chordProgression.currentText[order]);
}

// Additional array function
Array.prototype.rotate = function(n) {
	this.unshift.apply(this, this.splice(n, this.length))
	return this;
}

/*******************
 * On load function
 ********************/
$(window).bind("load", function() {
	loadNewProgression("new", 0);
	fancyCount = 0;
	$(".fancyText").text("MAKE IT FANCIER");
});
