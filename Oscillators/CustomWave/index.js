class Interface {
	/*
    	@class Interface
    	@purpose Controls the interface
    	@method constructor
    	@method control_gain
   	 	@method control_frequency
	*/
	constructor(){
		this.gain_slider = document.querySelector("#volume_slider");
		this.frequency_meter = document.querySelector("#frequency_meter");
		this.frequency_readout = document.querySelector("#frequency_readout");
	}
	control_gain(audio){
		this.gain_slider.oninput = () => {
			audio.amplitude_node.gain.value = this.gain_slider.value;
		}
	}
	control_frequency(audio){
		this.frequency_meter.oninput = () => {
			audio.source.frequency.value = this.frequency_meter.value;
			this.frequency_readout.innerHTML = this.frequency_meter.value;
		}
	}
}
//-----------------------------------------------------------------------------
class Audio{
	/*
    	@class Audio
    	@purpose handles the audio context and wave contruction
    	@method constructor
    	@method build_fourier_arrays
   	 	@method set_periodic_wave
   	 	@method start_source
   	 	@method connect_source
   	 	@method connect_destination
   	 	@method start_stop
	*/
	constructor(){
		this.connected = false;
		this.audio_context = new AudioContext();
		this.source = new OscillatorNode( this.audio_context, { frequency: 10 });
		this.amplitude_node = new GainNode( this.audio_context, { gain: 0.25 });
		this.max_coefficient = ( this.audio_context.sampleRate / 2*this.source.frequency.value );
	}
	build_fourier_arrays(){
		// Defining the Fourier Coefficient array of a periodic waveform 
		const array_a = new Float32Array( this.audio_context.sampleRate / 2 );
		const array_b = new Float32Array( this.audio_context.sampleRate / 2 );
		for (let i = 1; i < this.max_coefficient; i += 2){
			array_b[i] = 4 / (i * Math.PI);
		}
		return { a: array_a, b: array_b }
	}
	set_periodic_wave(){
		let fourier_arrays = this.build_fourier_arrays();
		this.source.setPeriodicWave( this.audio_context.createPeriodicWave( fourier_arrays.a, fourier_arrays.b ) );
	}
	start_source(){ this.source.start(); }
	connect_source(){ this.source.connect(this.amplitude_node); }
	connect_destination(){ this.amplitude_node.connect(this.audio_context.destination); }
	start_stop(){
		if (!this.connected){
			this.audio_context.resume();
			this.source.connect(this.amplitude_node);
			this.connected = true;
		} else {
			this.connected = false;
			this.source.disconnect(this.amplitude_node);
		}
		console.log(this.audio_context);
	}
}
//-----------------------------------------------------------------------------
const interface = new Interface();
let audio = new Audio();
audio.set_periodic_wave();
audio.start_source();
audio.connect_source();
audio.connect_destination();
audio.start_stop();
interface.control_gain(audio);
interface.control_frequency(audio);