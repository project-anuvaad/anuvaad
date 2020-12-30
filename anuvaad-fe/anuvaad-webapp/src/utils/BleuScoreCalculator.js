var maxN = 4;
var reserved_words = ['watch', 'constructor'];
var reflenMethod = "closest";

// A utility function to find undefined items
function isUndefined(item) {
    return typeof(item) == "undefined";
}

// A utility function to pause execution
function pause(milliseconds) {
	var dt = new Date();
	while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
}


// A utility function to create zero-filled arrays or hashes of a pre-stipulated length
function zeroArray(length, type) {
    var arr = new type();
    for (var i = 0; i < length; i++) {
        arr[i] = 0;
    }
    return arr;
}

// Utility functions that compute the max and min over an array
Array.max = function (arr) { return Math.max.apply(Math, arr); };
Array.min = function (arr) { return Math.min.apply(Math, arr); };

// A function to tokenize a sentence (from mteval)
function tokenize(sentence, preserve_case) {

    // language independent part
    var skippedRegex = new RegExp("<skipped>", "g");
    sentence = sentence.replace(skippedRegex, "");
    sentence = sentence.replace(/-\n/g, "");
    sentence = sentence.replace(/\n/g, " ");
    sentence = sentence.replace(/&quot;/g, "\"");
    sentence = sentence.replace(/&amp;/g, "&");
    sentence = sentence.replace(/&lt;/g, "<");
    sentence = sentence.replace(/&gt;/g, ">");

    // language dependent part
    sentence = ' ' + sentence + ' ';
    if (!preserve_case)
        sentence = sentence.toLowerCase();
    sentence = sentence.replace(/([\{\~\[\]\"\`\?\&\(\)\+\:\;\$\@\/\}])/g, ' $1 ');
    sentence = sentence.replace(/([^0-9])([\.,])/g, '$1 $2 ');
    sentence = sentence.replace(/([\.,])([^0-9])/g,' $1 $2');
    sentence = sentence.replace(/([0-9])(\-)/g, '$1 $2 ');
    sentence = sentence.replace(/\s+/g, ' ');
    sentence = sentence.replace(/^\s+/, '');
    sentence = sentence.replace(/\s+$/, '');

    return sentence;
}

//A general bleu computing function given the following arguments:
//1. The representative reference length (reflength),
//2. The number of n-grams that match between hypothesis and references for each n (ngramMatches),
//3. How many hypothesis n-grams there are for each n (numTstNgrams)
//4. Whether or not to compute smoothed BLEU scores (smoothed)
//5. How big an 'n' to use (order)
function generalComputeBLEU(reflength, ngramMatches, numTstNgrams, smoothed, order) {
    // compute the brevity penalty
    var brevity = Math.exp(Math.min(0, 1 - reflength/numTstNgrams[1]));

    // compute the non-exponentiated individual ngram scores
    var scores =[undefined];
    var smoothlevel = 1;
    for (var i=1; i <= order; i++) {
        if (numTstNgrams[i] === 0) {
            scores.push(0);
        }
        else if (ngramMatches[i] === 0) {
            scores.push(smoothed ? Math.log(1 / (Math.pow(2,smoothlevel) * numTstNgrams[i])): -Infinity);
            smoothlevel += 1;
        }
        else {
            scores.push(Math.log(ngramMatches[i] / numTstNgrams[i]));
        }
    }

    // compute the cumulative ngram precisions
    var prec = [undefined];
    var sum = 0.0;
    for (i=1; i <= order; i++) {
        sum = scores.slice(1, i+1).reduce(function (x,y) { return x+y; });
        prec.push(Math.exp(sum/i));
    }

    // compute the exponentiated individual ngram scores
    var individual = scores.map(Math.exp);

    // compute the exponentiated cumulative ngram BLEU scores:
    // multiply the cumulative precisions by the brevity penalty
    var cumulative = prec.map(function(x) { return x * brevity; });

    // The final BLEU score
    var finalBleu = cumulative[4];
    return [brevity, scores, prec, individual, cumulative, finalBleu];
}

// A bleu container object
function scoreContainer() {
    this.documentScores = {};
    this.segmentScores = [];
    this.bleuObjects = {};
}

// An object that encapsulates all information needed to compute the BLEU score
function bleuScoreObject(order, smoothed) {
    // Initialize reference length and other stuff
    this.order = order;
    this.smoothed = smoothed;
    this.reflength = 0;

    this.numTstNgrams = [undefined].concat(zeroArray(order, Array));

    // Initialize the array that holds the number of matching ngrams
    this.ngramMatches = [undefined].concat(zeroArray(order, Array));

    // To update my stats from another bleuObject, use the update method
    this.update = function(otherBleuObject) {
        for (var n=0; n <= this.order; n++) {
            this.ngramMatches[n] += otherBleuObject.ngramMatches[n];
            this.numTstNgrams[n] += otherBleuObject.numTstNgrams[n];
        }
        this.reflength += otherBleuObject.reflength;
    };

    // A function that computes all the BLEU components and returns the final BLEU-4 score
    this.computeBLEU = function() {
        // call the general BLEU function and get everything we need
        var bleuResults = generalComputeBLEU(this.reflength, this.ngramMatches, this.numTstNgrams, this.smoothed, this.order);

        this.brevity = bleuResults[0];
        this.ngramScores = bleuResults[1];
        this.precisions = bleuResults[2];
        this.individualNgramScores = bleuResults[3];
        this.cumulativeNgramScores = bleuResults[4];
        this.bleuScore = bleuResults[5];

        return this.bleuScore;
    };
}
// Utility function that modifies words that are in the above reserved word list
function makeSafe(ngram) {
    var ans = ngram;
    if (reserved_words.indexOf(ngram) !== -1) {
        ans = '#' + ngram + '#';
    }
	return ans
}

// A function that computes ngram counts from a given sentence
function Words2Ngrams(words) {
    var ngram_counts = {};
    for (let i=1; i<=4; i++) {
        for(let j=0; j<=(words.length-i); j++) {
            var ngram = makeSafe(words.slice(j, j+i).join(" "));
            if (ngram in ngram_counts) {
                ngram_counts[ngram]++;
            }
            else {
				if (ngram == "watch") {
                    alert(ngram);
                }
                ngram_counts[ngram] = 1;
            }
        }
    }
    return ngram_counts;
}

function scoreSegment( tstSegment, refSegments, docBleuObj) {
    //var numTstNgrams = [undefined].concat(zeroArray(maxN, Array));
    var numRefNgrams = [undefined].concat(zeroArray(maxN, Array));
    var clippedRefNgrams = {};
    var reflengths = [];
    var segBleuObj = new bleuScoreObject(docBleuObj.order, docBleuObj.smoothed);
    // Split the test segment into words
    var tstWords = tstSegment.split(/\s+/);

    // Get number of unigrams, bigrams etc. in the test segment
    for (var i=1; i<=4; i++) {
        segBleuObj.numTstNgrams[i] = i <= tstWords.length ? tstWords.length - i + 1: 0;
    }

    // Get ngrams and their counts in the test segment
    var tstNgrams = Words2Ngrams(tstWords);

    // Go over each reference segment and compute relevant information


        var refSegment = refSegments;

        // Get number of words in the reference
        var refWords = refSegment.split(/\s+/);

        // Get the ngrams and their counts
        var refNgrams = Words2Ngrams(refWords);

        // Clip final count for each n-gram to maximum # of occurrences in any of the references
        for (var ngram in refNgrams) {
            clippedRefNgrams[ngram] = isUndefined(clippedRefNgrams[ngram]) ? refNgrams[ngram] : Math.max(clippedRefNgrams[ngram], refNgrams[ngram]);
        }

        // Update total number of unigrams, bigrams etc.
        for (var k=1; k <= maxN; k++) {
            numRefNgrams[k] += k <= refWords.length ? refWords.length - k + 1: 0;
        }

        // Store the reference length
        reflengths.push(refWords.length);

    // Compute the representative reference length whether "shortest" or "closest"
	if (reflengths.length == 1) {
		segBleuObj.reflength = reflengths[0];
	}
    else if  (reflenMethod == "shortest") {
        segBleuObj.reflength = Array.min(reflengths);
    }
    else {
        var tstlength = tstWords.length;
        var diffs = reflengths.map(function(x) { return Math.abs(x-tstlength); });
        segBleuObj.reflength = reflengths[diffs.indexOf(Array.min(diffs))];
    }

    // Get the number of matching ngrams
    for (ngram in tstNgrams) {
        let order = ngram.split(" ").length;
        if (!(ngram in clippedRefNgrams)) continue;
        let count_this_ngram = Math.min(tstNgrams[ngram], clippedRefNgrams[ngram]);
        segBleuObj.ngramMatches[order] += count_this_ngram;
    }

    // Compute the bleu score for this segment and save it
    return segBleuObj.computeBLEU();

}


export const scoreSystem=(tstSet, refSets) =>
{
    // Score the test set against all refsets by  creating a bleuScoreObject for the test set
    var sysBleuObj = new bleuScoreObject(maxN, true);
   
    var docBleuObj = new bleuScoreObject(sysBleuObj.order, sysBleuObj.smoothed);
    // go over each segment from the test document and all corresponding ref segments
       let res = scoreSegment( tstSet, refSets, docBleuObj);
        
    return res;
}
