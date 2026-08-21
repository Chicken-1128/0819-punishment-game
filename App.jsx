import { useState } from 'react'
import './App.css'

function App() {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [games, setGames] = useState([]);
  const [noRepeat, setNoRepeat] = useState(false);
  const [result, setResult] = useState(null);
  const [editId, setEditId] = useState(null);

  const handleClick = () => {
    if (!name.trim() || !level) return;

    if (editId !== null) {
      const newGames = games.map((game) =>
        game.id === editId
          ? { ...game, name: name.trim(), level: level }
          : game
      );

      setGames(newGames);
      setEditId(null);
      setName("");
      setLevel("");
      return;
    }

    const newGame = {
      id: Date.now(),
      name: name.trim(),
      level: level,
      used: false
    }

    setGames(prevGame => [...prevGame, newGame]);

    setName("");
    setLevel("");
  }

  const handleChange = (id) => {
    const editGame = games.find((game) => game.id === id);

    setName(editGame.name);
    setLevel(editGame.level);
    setEditId(id);
  }

  const handleDelete = (id) => {
    const newGames = games.filter((game) => game.id !== id);

    setGames(newGames);
  }

  const handleGacha = () => {
    const targetGames = noRepeat
      ? games.filter((game) => !game.used)
      : games;

    if (targetGames.length === 0) {
      alert("すべての罰ゲームを引き終わりました");
      return;
    }

    const randomIndex = Math.floor(
      Math.random() * targetGames.length
    );

    const selectedGame = targetGames[randomIndex];

    setResult(selectedGame);

    if (noRepeat) {
      setGames(
        games.map((game) =>
          game.id === selectedGame.id
            ? { ...game, used: true }
            : game
        )
      );
    }
  }

  return (
    <>
      <div className="app">
        <h1>🎰 罰ゲームガチャ</h1>

        <div className='form-area'>
          <input
            type="text"
            placeholder="罰ゲーム名を入力"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="">レベルを選択</option>
            <option value="1">レベル1</option>
            <option value="2">レベル2</option>
            <option value="3">レベル3</option>
            <option value="4">レベル4</option>
            <option value="5">レベル5</option>
          </select>

          <button
            className="add-button"
            onClick={handleClick}
          >
            {editId !== null ? "保存" : "追加"}
          </button>
        </div>

        <div className='list-of-penalties'>
          <h2>罰ゲーム一覧</h2>

          {games.length === 0 ? (
            <p className="empty-message">
              罰ゲームがまだ登録されていません
            </p>
          ) : (
            <ul>
              {games.map((game) => (
                <li key={game.id}>
                  <div className="game-info">
                    <span className="game-name">
                      {game.name}
                    </span>

                    <span className="game-level">
                      {"★".repeat(Number(game.level))}
                    </span>
                  </div>

                  <div className="game-buttons">
                    <button
                      className="edit-button"
                      onClick={() => handleChange(game.id)}
                    >
                      編集
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => handleDelete(game.id)}
                    >
                      削除
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className='isRepeat'>
            <p>抽選モード</p>

            <button
              className={noRepeat ? "repeat-button active" : "repeat-button"}
              onClick={() => setNoRepeat(!noRepeat)}
            >
              {noRepeat ? "重複なし" : "重複あり"}
            </button>
          </div>

          <button
            className="gacha-button"
            onClick={handleGacha}
          >
            🎲 ガチャを引く
          </button>

          {result && (
            <div className="result">
              <h2>抽選結果</h2>

              <p className="result-level">
                {"★".repeat(Number(result.level))}
              </p>

              <p className="result-name">
                {result.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App