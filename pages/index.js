import styles from "../styles/Home.module.css"
import useD3Histogram from "../hooks/useD3Histogram"

export default function Home() {
  const histogramRef = useD3Histogram()

  return (
    <div className={styles.container}>
      <div ref={histogramRef}></div>
    </div>
  )
}
