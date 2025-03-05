import kaboom from "kaboom"

kaboom({
	background:[118, 99, 239]
})

loadSprite("nave1", "/sprites/Spaceship1.png")

scene("jogoDeNave", () => {

    var naveVelocidade = 300
	var tiroSpeed = 400

	var nave = add([
		sprite("nave1"),
		area(),
		pos(700, 500),
		anchor("center"),
		scale(4),
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
		atirar(nave.pos.add(16,0))
		atirar(nave.pos.sub(16,0))
	})
})

go("jogoDeNave")