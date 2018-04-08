var app={
	inicio: function(){
		DIAMETRO_GOKU = 50;

		velocidadX = 0;
		velocidadY = 0;

		alto = document.documentElement.clientHeight;
		ancho = document.documentElement.clientWidth;

		app.vigilaSensores();
		app.iniciaJuego();
	},

	iniciaJuego: function(){

		function preload() {
			game.physics.startSystem(Phaser.Physics.ARCADE);

			game.load.image('land', 'assets/land.png');
			game.load.image('goku', 'assets/goku.png');
		}

		function create() {
			land = game.add.sprite(0, 0, 'land');
			land.scale.setTo(ancho/1200, alto/715);

			goku = game.add.sprite(app.inicioX(), app.inicioY(), 'goku');
			
			game.physics.arcade.enable(goku);

			goku.body.collideWorldBounds = true;
		}

		function update() {
			var factorDificultad = 300;
			goku.body.velocity.y = (velocidadY * factorDificultad);
			goku.body.velocity.x = (velocidadX * -factorDificultad);
		}

		var estados = { preload: preload, create: create, update: update };
		var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser', estados);
	},

	inicioX: function() {
		return app.numeroAleatorioHasta(ancho - DIAMETRO_GOKU);
	},

	inicioY: function() {
		return app.numeroAleatorioHasta(alto - DIAMETRO_GOKU);
	},

	numeroAleatorioHasta: function(limite) {
		return Math.floor(Math.random() * limite);
	},

	vigilaSensores: function() {

		function onError(){
			console.log('onError!');
		}

		function onSuccess(datosAceleration){
			app.detectaAgitacion(datosAceleration);
			app.registraDireccion(datosAceleration);
		}

		navigator.accelerometer.watchAcceleration(onSuccess, onError, { frequency: 10 });
	},

	detectaAgitacion: function(datosAceleration){
		agitacionX = datosAceleration.x > 10;
		agitacionY = datosAceleration.y > 10;

		if (agitacionX || agitacionY){
			setTimeout(app.recomienza, 1000);
		}
	},

	recomienza: function() {
		document.location.reload(true);
	},

	registraDireccion: function(datosAceleration) {
		velocidadX = datosAceleration.x;
		velocidadY = datosAceleration.y;
	}

};

if ('addEventListener' in document) {
	document.addEventListener('deviceready', function() {
	/*document.addEventListener('DOMContentLoaded', function() {*/
		app.inicio();
	}, false);
}