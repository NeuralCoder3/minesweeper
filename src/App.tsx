import './App.css';
import { Board } from './components/Board';

function App() {
  let difficulty = 0.1;
  let width = 20;
  let height = 15;
  // get difficulty from get params
  const urlParams = new URLSearchParams(window.location.search);
  const difficultyParam = urlParams.get('difficulty');
  if (difficultyParam) {
    difficulty = parseFloat(difficultyParam);
  }
  const widthParam = urlParams.get('width');
  if (widthParam) {
    width = parseInt(widthParam);
  }
  const heightParam = urlParams.get('height');
  if (heightParam) {
    height = parseInt(heightParam);
  }

  return (
    <div className="App">
      <Board width={width} height={height} mine_percentage={difficulty} />
    </div>
  );
}

export default App;
