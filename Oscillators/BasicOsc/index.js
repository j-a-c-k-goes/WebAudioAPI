// Interface Selectors
class Interface {
	constructor(){
		this.button = document.querySelector("#start_audio");
		this.gain_readout = document.querySelector("#volume_label");
		this.gain_meter = document.querySelector("#volume_slider");
		this.frequency_meter = document.querySelector("#frequency_slider");
		this.frequency_readout = document.querySelector("#frequency_readout");
		this.wave_selector = document.querySelector("#type_of_wave");
	}
}
const interface = new Interface();

class Oscillator{
	default_gain = 0.25;
	constructor(){
		this.connected = false;
		this.audio_context = new AudioContext();
		this.tone_node = new OscillatorNode(this.audio_context);
		this.amplitude_node = new GainNode(this.audio_context, { gain: 0.25 });
	}
}
const oscillator = new Oscillator();

// Core Audio Variables
let connected = false;
const audio_context = new AudioContext();
const tone_node = new OscillatorNode(audio_context);
const amplitude_node = new GainNode(audio_context, { gain: 0.25 });

// Setting up the audio graph
tone_node.type = "sine";
tone_node.frequency = 440;
tone_node.start();
tone_node.connect(amplitude_node);
amplitude_node.connect(audio_context.destination);

// Gain Control
interface.gain_meter.oninput = () => {
	interface.gain_readout.innerHTML = interface.gain_meter.value;
	amplitude_node.gain.value = interface.gain_meter.value;
}
// Frequency Control
interface.frequency_meter.oninput = () => { 
	interface.frequency_readout.innerHTML = tone_node.frequency.value;
	tone_node.frequency.value = interfacefrequency_meter.value;
};

// Wave Selector 
interface.wave_selector.onchange = () => {
	tone_node.type = wave_selector.value;
	console.log(wave_selector.value, tone_node.type);
};

function start_stop(){
	if (!connected){
		audio_context.resume();
		tone_node.connect(amplitude_node);
		connected = true;
	} else {
		connected = false;
		tone_node.disconnect(amplitude_node);
	}
	console.log(audio_context);
}