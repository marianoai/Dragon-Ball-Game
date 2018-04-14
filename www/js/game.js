var app={
	inicio: function(){
		DIAMETRO_GOKU = 50;

		velocidadX = 0;
		velocidadY = 0;
		init = 1;

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
			game.load.spritesheet('dragon_balls', 'assets/dragon_balls.png', 50, 50);
			game.load.image('shenron', 'assets/shenron.png');
		}

		function create() {
			land = game.add.sprite(0, 0, 'land');
			land.scale.setTo(ancho/1200, alto/715);

			shenron = game.add.sprite((ancho-325)/2, 50, 'shenron');
			shenron.alpha = 0;

			bar_level = game.add.graphics();
			bar_level.beginFill('#000000', 0.5);
			bar_level.drawRect(ancho-25*7-5-50, 5, 25*7+50, 30);

			lvlText = game.add.text(5, 2, "LVL:", { fontSize: '20px', fill: '#f27d0c', boundsAlignH: 'left', boundsAlignV: 'middle' });
			lvlText.setShadow(3, 3, 'rgba(0,0,0,1)', 2);
			lvlText.setTextBounds(ancho-25*7-5-50, 5, 25*7+50, 30);

			level = [];
			for (i = 0; i < 7; i++) {
				level[i] = game.add.sprite(ancho-25*(7-i)-5, 10, 'dragon_balls');
				level[i].frame = i;
				level[i].scale.setTo(0.4, 0.4);
				level[i].alpha = 0;
			}

			bar_finishText = game.add.graphics();
			bar_finishText.beginFill('#000000', 0.3);
			bar_finishText.drawRect(0, alto-150, ancho, 100);
			bar_finishText.visible = false;

			finishText = game.add.text(0, 0, "YOU WIN!!!", { font: 'bold 40px Arial', fill: '#f27d0c', boundsAlignH: 'center', boundsAlignV: 'middle' });
			finishText.setShadow(4, 4, 'rgba(0,0,0,0.5)', 2);
			finishText.setTextBounds(0, alto-150, ancho, 100);
			finishText.visible = false;

			dragonball = game.add.sprite(app.inicioX(), app.inicioY(), 'dragon_balls');

			goku = game.add.sprite(app.inicioX(), app.inicioY(), 'goku');
			
			game.physics.arcade.enable(goku);
			game.physics.arcade.enable(dragonball);

			goku.body.collideWorldBounds = true;
		}

		function update() {
			var factorDificultad = 300;
			goku.body.velocity.y = (velocidadY * factorDificultad);
			goku.body.velocity.x = (velocidadX * -factorDificultad);

			game.physics.arcade.overlap(goku, dragonball, app.incrementaPuntuacion, null, this);
		}

		var estados = { preload: preload, create: create, update: update };
		var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser', estados);
	},

	incrementaPuntuacion: function() {
		if (init === 0) {
			return;
		}

		if ((Math.abs(goku.body.x - dragonball.body.x) < 15) && (Math.abs(goku.body.y - dragonball.body.y) < 15)) {

			var lvl = dragonball.frame + 1
			level[dragonball.frame].alpha = 0.8;
			dragonball.frame = lvl;

			if (lvl === 7) {
				for (i = 1; i <= 1000; i++) {
					setTimeout(function(i) {shenron.alpha = i/1000;}, i*(3000/1000), i);
				}
				dragonball.kill();
				init = 0;
				bar_finishText.visible = true;
				finishText.visible = true;
			}
			else {
				dragonball.body.x = app.inicioX();
				dragonball.body.y = app.inicioY();
			}
		}
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