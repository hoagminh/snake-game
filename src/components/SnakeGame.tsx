'use client'
import * as Phaser from 'phaser'
import { useEffect, useRef } from 'react'

export const SnakeGame = () => {
  const gameRef = useRef<HTMLDivElement | null>(null)
  const gameInstance = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (!gameRef.current || gameInstance.current) return

    const TILE_SIZE = 20
    const WIDTH = 30
    const HEIGHT = 20

    class SnakeScene extends Phaser.Scene {
      constructor() {
        super({ key: 'SnakeScene' })
      }

      snake: Phaser.Geom.Point[] = []
      food!: Phaser.Geom.Point
      direction: string = 'RIGHT'
      timer!: Phaser.Time.TimerEvent
      score: number = 0
      graphics!: Phaser.GameObjects.Graphics
      scoreText!: Phaser.GameObjects.Text

      create() {
        this.cameras.main.setBackgroundColor('#222')
        this.graphics = this.add.graphics()
        this.scoreText = this.add.text(10, 5, `Score: ${this.score}`, {
          fontSize: '16px',
          color: '#ffffff',
        })

        this.snake = [
          new Phaser.Geom.Point(8, 10),
          new Phaser.Geom.Point(7, 10),
        ]

        this.placeFood()

        this.input?.keyboard?.on('keydown', (event: KeyboardEvent) => {
          const key = event.key
          if (key === 'ArrowUp' && this.direction !== 'DOWN')
            this.direction = 'UP'
          else if (key === 'ArrowDown' && this.direction !== 'UP')
            this.direction = 'DOWN'
          else if (key === 'ArrowLeft' && this.direction !== 'RIGHT')
            this.direction = 'LEFT'
          else if (key === 'ArrowRight' && this.direction !== 'LEFT')
            this.direction = 'RIGHT'
        })

        this.timer = this.time.addEvent({
          delay: 150,
          loop: true,
          callback: this.move,
          callbackScope: this,
        })
      }

      placeFood() {
        const x = Phaser.Math.Between(0, WIDTH - 1)
        const y = Phaser.Math.Between(0, HEIGHT - 1)
        this.food = new Phaser.Geom.Point(x, y)
      }

      move() {
        const head = Phaser.Geom.Point.Clone(this.snake[0])

        if (this.direction === 'RIGHT') head.x++
        else if (this.direction === 'LEFT') head.x--
        else if (this.direction === 'UP') head.y--
        else if (this.direction === 'DOWN') head.y++

        if (
          head.x < 0 ||
          head.x >= WIDTH ||
          head.y < 0 ||
          head.y >= HEIGHT ||
          this.snake.some((s) => s.x === head.x && s.y === head.y)
        ) {
          this.scene.restart()
          this.snake = [
            new Phaser.Geom.Point(8, 10),
            new Phaser.Geom.Point(7, 10),
            new Phaser.Geom.Point(6, 10),
          ]
          this.direction = 'RIGHT'
          this.score = 0
          return
        }

        this.snake.unshift(head)

        if (head.x === this.food.x && head.y === this.food.y) {
          this.placeFood()
          this.score += 10
        } else {
          this.snake.pop()
        }

        this.draw()
      }

      draw() {
        this.graphics.clear()

        this.graphics.fillStyle(0x00ff00)
        this.snake.forEach((p) =>
          this.graphics.fillRect(
            p.x * TILE_SIZE,
            p.y * TILE_SIZE,
            TILE_SIZE - 1,
            TILE_SIZE - 1,
          ),
        )

        this.graphics.fillStyle(0xff0000)
        this.graphics.fillRect(
          this.food.x * TILE_SIZE,
          this.food.y * TILE_SIZE,
          TILE_SIZE - 1,
          TILE_SIZE - 1,
        )

        this.scoreText.setText(`Score: ${this.score}`)
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: WIDTH * TILE_SIZE,
      height: HEIGHT * TILE_SIZE,
      parent: gameRef.current,
      scene: SnakeScene,
    }

    gameInstance.current = new Phaser.Game(config)

    return () => {
      gameInstance.current?.destroy(true)
      gameInstance.current = null
    }
  }, [gameRef])

  return <div ref={gameRef} style={{ width: '100%', height: '100%' }} />
}
