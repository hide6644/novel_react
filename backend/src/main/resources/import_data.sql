-- Authors Data
INSERT INTO authors (name, birth_date, nationality, version) VALUES ('夏目漱石', '1867-02-09', '日本', 0);
INSERT INTO authors (name, birth_date, nationality, version) VALUES ('太宰治', '1909-06-19', '日本', 0);
INSERT INTO authors (name, birth_date, nationality, version) VALUES ('芥川龍之介', '1892-03-01', '日本', 0);
INSERT INTO authors (name, birth_date, nationality, version) VALUES ('宮沢賢治', '1896-08-27', '日本', 0);
INSERT INTO authors (name, birth_date, nationality, version) VALUES ('三島由紀夫', '1925-01-14', '日本', 0);
INSERT INTO authors (name, birth_date, nationality, version) VALUES ('村上春樹', '1949-01-12', '日本', 0);
INSERT INTO authors (name, birth_date, nationality, version) VALUES ('東野圭吾', '1958-02-04', '日本', 0);
INSERT INTO authors (name, birth_date, nationality, version) VALUES ('宮部みゆき', '1960-12-23', '日本', 0);
INSERT INTO authors (name, birth_date, nationality, version) VALUES ('アガサ・クリスティ', '1890-09-15', 'イギリス', 0);
INSERT INTO authors (name, birth_date, nationality, version) VALUES ('アーネスト・ヘミングウェイ', '1899-07-21', 'アメリカ', 0);

-- Novels Data
-- 夏目漱石 (ID: 1)
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('吾輩は猫である', '名前はまだない猫の視点から描かれる人間社会の風刺。', '1905-01-01', 1, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('坊っちゃん', '数学教師として赴任した「坊っちゃん」が巻き起こす騒動。', '1906-04-01', 1, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('草枕', '智に働けば角が立つ。情に棹させば流される。', '1906-09-01', 1, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('三四郎', '熊本から上京した三四郎の青春と、ミステリアスな美禰子。', '1908-09-01', 1, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('こころ', '「先生」と「私」、そして親友「K」を巡る倫理的葛藤。', '1914-04-20', 1, 0);

-- 太宰治 (ID: 2)
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('人間失格', '恥の多い生涯を送って来ました。自己の半生を綴る手記形式。', '1948-06-15', 2, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('走れメロス', '激怒するメロスは親友を救うために走り続ける。', '1940-05-01', 2, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('斜陽', '没落する貴族の姿を描いた、戦後の退廃的な空気。', '1947-12-15', 2, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('御伽草紙', '昔話を太宰流にアレンジした、ユーモア溢れる一冊。', '1945-10-01', 2, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('富嶽百景', '富士山を背景にした私小説的な風景美。', '1939-02-01', 2, 0);

-- 芥川龍之介 (ID: 3)
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('羅生門', '荒廃した京で生きるためのエゴイズムを鋭く描く。', '1915-11-01', 3, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('鼻', '鼻の長い内供の悩みと、周囲の嘲笑。', '1916-02-01', 3, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('杜子春', '仙人を目指す若者の挫折と母への愛。', '1920-07-01', 3, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('河童', '河童の国を訪れた患者の体験談を通じた社会批判。', '1927-03-01', 3, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('蜘蛛の糸', '地獄に垂らされた一本の蜘蛛の糸と利己心。', '1918-04-16', 3, 0);

-- 宮沢賢治 (ID: 4)
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('銀河鉄道の夜', 'ジョバンニとカムパネルラの幻想的な夜の鉄道の旅。', '1934-01-01', 4, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('注文の多い料理店', '森の中の不思議なレストランで起きた恐怖の出来事。', '1924-12-01', 4, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('風の又三郎', '転校生の三郎がやってきた村で吹く風。', '1934-09-01', 4, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('よだかの星', '醜いよだかが美しく星になるまでの切ない物語。', '1921-01-01', 4, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('セロ弾きのゴーシュ', '下手なセロ奏者のもとを訪れる動物たち。', '1934-11-01', 4, 0);

-- 三島由紀夫 (ID: 5)
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('金閣寺', '美への執着と嫉妬から金閣寺に火を放つまで。', '1956-10-30', 5, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('潮騒', '伊勢湾の小島を舞台にした瑞々しい純愛物語。', '1954-06-10', 5, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('仮面の告白', '自己の内面を赤裸々に告白した三島の出世作。', '1949-07-05', 5, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('春の雪', '禁じられた恋と転生の物語、豊饒の海第一部。', '1969-01-05', 5, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('天人五衰', '美と滅びの結末、豊饒の海第四部。', '1971-02-25', 5, 0);

-- 村上春樹 (ID: 6)
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('ノルウェイの森', '喪失と再生を描いた、センチメンタルな物語。', '1987-09-04', 6, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('海辺のカフカ', '15歳の少年の旅と、不思議な猫探しの老人。', '2002-09-12', 6, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('ねじまき鳥クロニクル', '消えた猫、消えた妻、そして深い井戸。', '1994-04-12', 6, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('世界の終りとハードボイルド・ワンダーランド', '二つの世界が交互に描かれる幻想的な物語。', '1985-06-15', 6, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('1Q84', '二つの月が浮かぶ1984年の物語。', '2009-05-29', 6, 0);

-- 東野圭吾 (ID: 7)
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('容疑者Xの献身', 'ガリレオシリーズ。数学者の純粋な愛と論理。', '2005-08-25', 7, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('白夜行', 'あまりにも残酷な少年少女の愛の物語。', '1999-08-10', 7, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('マスカレード・ホテル', 'ホテルという密室で繰り広げられる人間模様。', '2011-09-09', 7, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('変身', '脳移植を受けた男に訪れる人格の変化。', '1991-01-10', 7, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('秘密', '事故で妻が娘の体に乗り移った奇妙な生活。', '1998-09-10', 7, 0);

-- 宮部みゆき (ID: 8)
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('火車', '他人の人生を乗っ取った女を追うミステリー。', '1992-07-25', 8, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('理由', '高層マンションで起きた殺人事件の背景。', '1998-05-20', 8, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('模倣犯', '史上最大の犯罪を企てた「ピース」の物語。', '2001-03-31', 8, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('ブレイブ・ストーリー', '運命を変えるために異世界へと旅立つ少年。', '2003-03-25', 8, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('ソロモンの偽証', '学校内で起きた生徒の死の真実を追う法廷。', '2012-10-25', 8, 0);

-- アガサ・クリスティ (ID: 9)
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('そして誰もいなくなった', '孤島に招かれた10人が次々と殺されていく傑作。', '1939-11-06', 9, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('アクロイド殺し', 'ポアロ最大の謎を呼ぶ、叙述トリックの極致。', '1926-06-01', 9, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('オリエント急行の殺人', '豪華列車内で起きた密室殺人にポアロが挑む。', '1934-01-01', 9, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('ABC殺人事件', 'アルファベット順に殺人が繰り返される恐怖。', '1936-01-01', 9, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('ナイルに死す', '豪華客船での新婚旅行中に起きた悲劇。', '1937-11-01', 9, 0);

-- アーネスト・ヘミングウェイ (ID: 10)
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('老人と海', '巨大なカジキと格闘する老人の不屈の精神。', '1952-09-01', 10, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('武器よさらば', '第一次世界大戦下のイタリアを舞台にした悲恋。', '1929-09-27', 10, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('誰がために鐘は鳴る', 'スペイン内戦下の愛と死と忠誠。', '1940-10-21', 10, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('日はまた昇る', '迷える世代の若者たちの空虚と情熱。', '1926-10-22', 10, 0);
INSERT INTO novels (title, description, publish_date, author_id, version) VALUES ('移動祝祭日', 'パリ時代を回顧した心温まる手記。', '1964-01-01', 10, 0);
