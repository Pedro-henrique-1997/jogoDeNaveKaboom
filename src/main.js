import kaboom from "kaboom"

kaboom({
	background:[118, 99, 239]
})

loadSprite("nave1", "/sprites/Spaceship1.png")

let alienigenas = [
	"UFO1",
	"UFO2",
	"Alien1",
	"Alien2",
	"Alien3",
	"Alien4",
]

for(var alien of alienigenas){
	loadSprite(alien, `/sprites/${alien}.png`)
}

scene("jogoDeNave", () => {

    var naveVelocidade = 300
	var tiroSpeed = 700
	var energiaNave = 1000
	var inimigoVelocidade = 500

	var nave = add([
		sprite("nave1"),
		area(),
		pos(700, 500),
		anchor("center"),
		scale(3),
		health(energiaNave),
		"nave1",
	])

	onKeyDown("down", () => {
		nave.move(0, naveVelocidade)
	})

	onKeyDown("up", () => {
		nave.move(0, -naveVelocidade)
	})

	onKeyDown("right", () => {
		nave.move(naveVelocidade, 0)
	})

	onKeyDown("left", () => {
		nave.move(-naveVelocidade, 0)
	})

	function atirar(posicao){
		add([
			rect(40, 60),
			pos(posicao),
			outline(4),
			color(255, 45, 71),
			area(),
			anchor("center"),
			offscreen({destroy: true}),
			move(UP, tiroSpeed),
			"laser",
		])
	}

	onKeyPress("a", () => {
		atirar(nave.pos.add(12,0))
	})

	function gerarAliens(){
		var et = choose(alienigenas)
		 add([
			sprite(et),
		    pos(rand(0, width()), 0),
		    anchor("center"),
		    area(),
			health(100),
		    move(DOWN, inimigoVelocidade),
		    offscreen({destroy: true}),
		    "ET",
		 ])
	}

	loop(1, () => {
		gerarAliens()
	})

	const barraDeEnergia = add([
		rect(width(), 24),
		pos(0,0),
		color(0,0,0),
		fixed(),
		{
			max:energiaNave,
			set(hp){
				this.width = width() * hp / this.max
				this.flash = true
			}
		}
	])
})

go("jogoDeNave")