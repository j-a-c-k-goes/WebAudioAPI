// Element Selection
const button = document.querySelector("#start_audio");
const gain_slider = document.querySelector("#gain_slider");
const gain_level = document.querySelector("#gain_readout");
const wave_frequency_slider = document.querySelector("#wave_frequency_slider");
const wave_readout = document.querySelector("#wave_readout");

// Audio Context
let connected = false; 
const context = new AudioContext();
const tone_node = new OscillatorNode(context);
let oscillator_node = context.createOscillator();
oscillator_node.frequency = 440;
oscillator_node.detune = 2;
const computed_oscillator_frequency = (oscillator_node.frequency.value * (2**oscillator_node.detune.value/2));
console.log("Computed Oscillator Frequency:", computed_oscillator_frequency);
const volume_node = new GainNode(context, { gain: 0.25} );
// tone_node.start();
oscillator_node.start();
volume_node.connect(context.destination);

// start or stop the audio
function start_stop(){
	if (!connected){
		context.resume();
		// tone_node.connect(volume_node);
		oscillator_node.type = choose_wave();
		oscillator_node.connect(volume_node);
		connected = true;
	} else {
		connected = false;
		// tone_node.disconnect(volume_node);
		oscillator_node.disconnect(volume_node);
	}
	console.log(context);
}

// Choose the wave
function choose_wave(){
	const wave = { 
	    sine: "sine", 
		square: "square", 
		triangle: "triangle", 
		saw: "saw",
	}
	const wave_button = document.querySelectorAll(".choose_wave");
	wave_button.forEach((wave_btn) =>{
		wave_btn.addEventListener("click", ()=>{
			switch (wave_btn.id) {
				case "sine":
					oscillator_node.type = "sine";
					break;
				case "square":
					oscillator_node.type = "square";
					break;
				case "sawtooth":
					oscillator_node.type = "sawtooth";
					break;
				case "triangle":
					oscillator_node.type = "triangle";
					break;
				default:
					console.warn("No wave exists for that type/id.");
			}
		}); 
	});
	return oscillator_node.type;
}


// Operate the wave frequency slider
wave_frequency_slider.oninput = () =>{
	oscillator_node.frequency.value = wave_frequency_slider.value;
	wave_readout.innerHTML = oscillator_node.frequency.value;
};

// Operate the gain slider
gain_slider.oninput = () => {
	gain_readout.innerHTML = gain_slider.value;
	volume_node.gain.value = gain_slider.value;
};
