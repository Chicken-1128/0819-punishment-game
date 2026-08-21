# 罰ゲームガチャ

## 今回の目標

まずは以下の機能まで完成させる。

1. 罰ゲーム名入力
2. レベル入力
3. 追加ボタン
4. 罰ゲーム一覧表示
5. 削除
6. ガチャを引く
7. 結果表示

ここまでを基本部分とする。

時間が余った場合は、

1. 空白・未入力時の処理
2. `games.length === 0`の処理
3. 抽選モード（重複あり・なし）
4. 編集機能

の順番で追加する。

---

# ① useState

```jsx
const [name, setName] = useState("");
const [level, setLevel] = useState("");
const [games, setGames] = useState([]);
const [result, setResult] = useState(null);
```

### 説明

* `name` → 入力された罰ゲーム名
* `level` → 選択されたレベル
* `games` → 追加した罰ゲームを保存する配列
* `result` → ガチャで選ばれた罰ゲーム

---

# ② 名前入力

```jsx
<input
  type="text"
  placeholder="罰ゲーム名を入力"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

### 説明ポイント

`onChange`で入力された内容を取得して、

```jsx
setName(e.target.value)
```

で`name`を更新する。

---

# ③ レベル入力

```jsx
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
```

名前入力とほぼ同じ。

`select`で選択された値を`level`に保存する。

---

# ④ 追加

```jsx
const handleClick = () => {
  const newGame = {
    id: Date.now(),
    name: name,
    level: level
  };

  setGames([...games, newGame]);

  setName("");
  setLevel("");
};
```

ボタン

```jsx
<button onClick={handleClick}>
  追加
</button>
```

### 説明ポイント

入力された情報を、

```jsx
const newGame = {
  id: Date.now(),
  name: name,
  level: level
};
```

で1つのオブジェクトにする。

`id`はそれぞれの罰ゲームを区別するための番号。

```jsx
Date.now()
```

で現在時刻を数字として取得し、簡単なIDとして使用する。

その後、

```jsx
setGames([...games, newGame]);
```

で現在の`games`に新しい罰ゲームを追加。

### スプレッド構文

```jsx
[...games, newGame]
```

現在の`games`の中身を展開して、最後に`newGame`を追加している。

---

# ⑤ 一覧表示

```jsx
<ul>
  {games.map((game) => (
    <li key={game.id}>
      {game.name}
      レベル：{game.level}
    </li>
  ))}
</ul>
```

### 説明ポイント

`games`は配列なので、`map()`を使って1個ずつ表示する。

```jsx
games.map((game) => (
```

`game`には、

```jsx
{
  id: 123456,
  name: "モノマネ",
  level: "3"
}
```

のような1個分のデータが入る。

そのため、

```jsx
game.name
game.level
```

で表示できる。

---

# ⑥ 削除

ボタン

```jsx
<button onClick={() => handleDelete(game.id)}>
  削除
</button>
```

処理

```jsx
const handleDelete = (id) => {
  const newGames = games.filter((game) => game.id !== id);

  setGames(newGames);
};
```

### 説明ポイント

削除したい罰ゲームの`id`を`handleDelete`に渡す。

```jsx
game.id !== id
```

削除したいIDと違うものだけ残す。

つまり`filter()`で対象の罰ゲームを取り除いている。

---

# ⑦ ガチャ

```jsx
const handleGacha = () => {
  const randomIndex = Math.floor(
    Math.random() * games.length
  );

  setResult(games[randomIndex]);
};
```

ボタン

```jsx
<button onClick={handleGacha}>
  ガチャを引く
</button>
```

### 説明ポイント

```jsx
Math.random()
```

0以上1未満のランダムな数字を作る。

↓

```jsx
Math.random() * games.length
```

配列の長さに合わせたランダムな数字にする。

↓

```jsx
Math.floor()
```

小数点以下を切り捨てる。

例えば罰ゲームが5個なら、

```text
0
1
2
3
4
```

のどれかになる。

↓

```jsx
games[randomIndex]
```

でランダムに1個取得。

↓

```jsx
setResult(games[randomIndex]);
```

結果を`result`に保存。

---

# ⑧ 結果表示

```jsx
{result && (
  <div className="result">
    <h2>抽選結果</h2>

    <p>
      レベル：{result.level}
    </p>

    <p>
      {result.name}
    </p>
  </div>
)}
```

### 説明ポイント

```jsx
result && (...)
```

`result`に値が入っているときだけ表示する。

最初は、

```jsx
result = null
```

なので表示されない。

ガチャを引くと、

```jsx
setResult(games[randomIndex]);
```

によって`result`に罰ゲームが入る。

すると結果が表示される。

「条件付きレンダリング」と軽く説明。

---

# ここまでで基本完成

最低限、

```text
入力
↓
追加
↓
一覧表示
↓
削除
↓
ガチャ
↓
結果表示
```

までできればOK。

ここから時間を見て追加機能に進む。

---

# 余ったら① 入力チェック

`handleClick`の最初に追加。

```jsx
if (!name.trim() || !level) {
  alert("罰ゲーム名とレベルを入力してください");
  return;
}
```

### 説明ポイント

何も入力されていない場合に追加させない。

`trim()`は文字列の前後の空白を取り除く。

スペースだけ入力された場合も防げる。

---

# 余ったら② gamesが0個の場合

`handleGacha`の最初に追加。

```jsx
if (games.length === 0) {
  alert("罰ゲームを追加してください");
  return;
}
```

罰ゲームがない状態で抽選するのを防ぐ。

---

# 余ったら③ 抽選モード

追加するstate

```jsx
const [noRepeat, setNoRepeat] = useState(false);
```

罰ゲームにも追加。

```jsx
const newGame = {
  id: Date.now(),
  name: name,
  level: level,
  used: false
};
```

抽選対象を作る。

```jsx
const targetGames = noRepeat
  ? games.filter((game) => !game.used)
  : games;
```

### 説明

`noRepeat === false`

→ 全部から抽選

`noRepeat === true`

→ `used === false`のものだけ抽選

抽選されたものを、

```jsx
if (noRepeat) {
  setGames(
    games.map((game) =>
      game.id === selectedGame.id
        ? { ...game, used: true }
        : game
    )
  );
}
```

で`used: true`にする。

---

# さらに余ったら④ 編集

編集は最後。

```jsx
const [editId, setEditId] = useState(null);
```

編集ボタンを押したら対象を探す。

```jsx
const handleChange = (id) => {
  const editGame = games.find((game) => game.id === id);

  setName(editGame.name);
  setLevel(editGame.level);
  setEditId(id);
};
```

その後`map()`を使って対象のデータを書き換える。

### 編集の流れ

```text
編集ボタン
↓
find()で対象を探す
↓
入力フォームに戻す
↓
内容を書き換える
↓
保存
↓
map()で対象だけ変更
```

ここは時間が十分に余った場合のみでOK。

---

# 教える順番

```text
useState
↓
名前入力
↓
レベル入力
↓
追加
↓
mapで一覧表示
↓
filterで削除
↓
Math.randomで抽選
↓
結果表示

--------- 基本完成 ---------

↓ 時間があれば

入力チェック
↓
games.length === 0
↓
重複あり・なし
↓
編集
```

基本部分を完成させることを優先する。

編集や抽選モードまで到達しなくても問題なし。
