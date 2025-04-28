import kaboom from "kaboom"

kaboom({
	background:[118, 99, 239]
})

loadSprite("nave1", "/sprites/Spaceship1.png")
loadSprite("nave2", "/sprites/Spaceship2.png")
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

	//Variaveis contaveis de energia e velocidade

    var naveVelocidade = 500
	var tiroSpeed = 700
	var energiaNave = 1000
	var inimigoVelocidade = 500
	var inimigoEnergia = 100
	var coracaoVelocidade = 600
	var iconeTransformSpeed = 600
	var beamSpeed = 400

	//Criação da nave modelo 1 e seus componentes e ações

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

	//Evento do mecanismo de mudança de forma

	function gerarIconeTransform1(){
		const base1 = add([
			rect(48, 48),
			pos(rand(48, width() - 48), 0),
			anchor("center"),
			move(DOWN, iconeTransformSpeed),
			color(0, 179, 0),
			outline(4, rgb(0, 0, 0)),
			area(),
			"fusao1",
		])

		base1.add([
			text("1", {size: 28}),
			anchor("center"),
			pos(0,0),
			color(0,0,0),
		])
	}


//Transformação: modelo 2
	function gerarIconeTransform2() {
		const base2 = add([
			rect(48, 48),               // tamanho maior
			pos(rand(48, width() - 48), 0), // evita sair da tela
			anchor("center"),
			move(DOWN, iconeTransformSpeed),
			color(255, 215, 0),         // amarelo dourado
			outline(4, rgb(0, 0, 0)),   // contorno preto
			area(),
			"fusao2",
		])
	
		base2.add([
			text("2", { size: 28 }),    // tamanho da fonte proporcional
			anchor("center"),
			pos(0, 0),
			color(0, 0, 0),             // texto preto
		])
	}
	
	
	loop(4, () => {
		gerarIconeTransform2()
	})

	//Mudança de sprite para o outro

	onCollide("fusao2", "nave1", (f, n) => {
		destroy(f)
		n.use(sprite("nave2"))
		n.unuse("nave1")
		n.use("nave2")
	})

	loop(4, () => {
		gerarIconeTransform1()
	})

	onCollide("fusao1", "nave2", (f1, n2) => {
		destroy(f1)
		n2.use(sprite("nave1"))
		n2.unuse("nave2")
		n2.use("nave1")
	})

	onKeyPress("a", () => {
		atirar(nave.pos.add(12,0))
	})
	

	//Gerador de aliens (inimigos)

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

//Criação da barra de energia

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

	//Colisões em geral e eventos

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

	//Gerar corações para cura e sua execução de cura

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

	//Especial da nave modelo 1

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
		if(nave.is("nave1")){
			raioLaser(nave.pos.add(14,0))
		}else if(nave.is("nave2")){
			burp()
		}
	})

	onCollide("alien","raio", (et, raio) => {
		destroy(raio)
		et.hurt(80)
		shake()
	})

})

//Cena de Game Over

scene("fim", () => {
	add([
		text("Voce Perdeu"),
		pos(24, 25)
	])
})

// Chamar a cena do jogo

go("jogoDeNave")