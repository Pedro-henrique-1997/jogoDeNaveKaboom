import kaboom from "kaboom"

kaboom({
	background:[118, 99, 239]
})

loadSprite("nave1", "/sprites/Spaceship1.png")
loadSprite("heart", "/sprites/coracao.png")
loadSprite("raio", "/sprites/lightening.png")

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

    var naveVelocidade = 500
	var tiroSpeed = 700
	var energiaNave = 1000
	var inimigoVelocidade = 500
	var inimigoEnergia = 100
	var coracaoVelocidade = 600
	var beamSpeed = 400

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
			scale(1),
			health(inimigoEnergia),
		    move(DOWN, inimigoVelocidade),
		    offscreen({destroy: true}),
		    "alien",
		 ])
	}

	loop(1, () => {
		gerarAliens()
	})

	const barraDeEnergia = add([
		rect(width(), 24),
		pos(0,0),
		color(255, 255, 0),
		fixed(),
		{
			max:energiaNave,
			set(hp){
				this.width = width() * hp / this.max
				this.flash = true
			}
		}
	])

	onCollide("laser", "alien", (t, a) => {
		destroy(t)
		a.hurt(35)
	})

	on("death","alien", (et) => {
		destroy(et)
		addKaboom(et.pos)
	})

	nave.onCollide("alien", () => {
		nave.hurt(100)
		shake()
		energiaNave -= 100
		if(energiaNave == 0){
			go("fim")
		}
	})

	nave.onHurt(() => {
		barraDeEnergia.set(nave.hp())
	})

	function gerarCoracoes(){
		const coracao = add([
			sprite("heart"),
			area(),
			pos(rand(0, width()), 0),
			move(DOWN, coracaoVelocidade),
			anchor("center"),
			"coracao",
		])
	}

	loop(4, () => {
		gerarCoracoes()
	})

	nave.onCollide("coracao", (c) => {
		destroy(c)
		nave.heal(60)
		energiaNave += 60
	})

	nave.onHeal(() => {
		barraDeEnergia.set(nave.hp())
	})

	function raioLaser(posicao){
		const raio = add([
			sprite("raio"),
		    area(),
		    pos(posicao),
		    move(UP, beamSpeed),
            anchor("center"),
			offscreen({destroy: true}),
		    "raio",
		])
	}

	onKeyPress("s", () => {
		raioLaser(nave.pos.add(14,0))
	})

	onCollide("alien","raio", (et, raio) => {
		destroy(raio)
		et.hurt(80)
		shake()
	})
})

scene("fim", () => {
	add([
		text("Voce Perdeu"),
		pos(24, 25)
	])
})

go("jogoDeNave")