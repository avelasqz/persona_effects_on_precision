var utterances = ["$284","$292","$300","$308","$316","$788"];

var states = ['284','292','300','308','316','788'];


var uCost = function(u) {
	return u=='$284' ? -0.2231435513142097 :
	u=='$292' ? -0.2231435513142097 :
	u=='$300' ? -0.6931471805599453 :
	u=='$308' ? -0.35667494393873245 : 
	u=='$316' ? -0.2231435513142097 :
	u=='$788' ? -0.10536051565782628 : 0
};

var phis = [0.4,0.2];

var alpha = 4;

var literalSemantics = {
  "state": ['284','292','300','308','316','788'],
  "$284": [.999,.001,.001,.001,.001,.001],
  "$292": [.001,.999,.001,.001,.001,.001],
  "$300": [.44,.59,.99,.59,.44,.01],
  "$308": [.001,.001,.001,.999,.001,.001],
  "$316": [.001,.001,.001,.001,.999,.001],
  "$788": [.001,.001,.001,.001,.001,.999]
};


var meaning = function(words, state) {
	return flip(literalSemantics[words]
		[_.indexOf(states, state)]);
};








var listener0 = cache(function(utterance) {
  Infer({model: function(){
    var state = uniformDraw(states);
    var m = meaning(utterance, state);
    condition(m);
    return state;
  }})
}, 10000);









var speaker1 = cache(function(state, phi) {
  Infer({model: function(){

    var utterance = uniformDraw(utterances);
    var L0 = listener0(utterance);

    var utilities = {
      inf: L0.score(state), // log P(s | u)
      cost: uCost(utterance)
    }
    var speakerUtility = phi * utilities.inf -
        (1-phi) * utilities.cost;

    factor(alpha * speakerUtility)

    return utterance;
  }})
}, 10000);







var listener1 = cache(function(utterance) {
  Infer({model: function(){

	var phi = uniformDraw(phis);
  // var phi = 0.4 //for Nerdy phi
  // var phi = 0.2 //for Chill phi
	var state = uniformDraw(states);

	var S1 = speaker1(state, phi);

	observe(S1, utterance)

	return {
      state: state,
      phi: phi
    }
  // return state //alternative return for running with set phi value
}

  })
}, 10000);