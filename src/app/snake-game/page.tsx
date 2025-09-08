import dynamic from 'next/dynamic'

const SnakeGameComponent = dynamic(() =>
  import('@/components/SnakeGame').then((mod) => mod.SnakeGame),
)

export default function SnakeGamePage() {
  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h1>Snake Game</h1>
      <SnakeGameComponent />
    </div>
  )
}
