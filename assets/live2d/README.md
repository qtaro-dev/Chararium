# Live2D Assets

- Live2D モデルは `.model3.json` を入口に読み込む想定です。
- `.moc3` 単体ではなく `.model3.json` を基準に扱います。
- Live2D Cubism SDK for Web との連携は後続タスクで実装します。
- モデル同梱時は、モデルと SDK のライセンス確認を必須とします。
- Chararium のモデル管理画面では `.model3.json` ファイルを検出対象にします。
- 配置例: `assets/live2d/sample/sample.model3.json`
- 検出したモデルは一覧・選択・情報表示まで対応し、実描画は後続タスクで追加します。
