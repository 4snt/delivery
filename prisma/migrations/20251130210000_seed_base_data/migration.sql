-- Seed base flavors and additionals (idempotent for deploy-time consistency)
INSERT INTO "Adicional" ("id", "nome") VALUES
  (1, 'Granulado'),
  (2, 'Calda de Chocolate'),
  (3, 'Calda de Morango'),
  (4, 'Paçoca'),
  (5, 'Leite Condensado'),
  (6, 'Castanha'),
  (7, 'Leite em Pó'),
  (8, 'Granola'),
  (9, 'Banana'),
  (10, 'Morango')
ON CONFLICT ("id") DO UPDATE SET "nome" = EXCLUDED."nome";

INSERT INTO "Sabor" ("id", "nome", "imagem") VALUES
  (1, 'Sorvete de Ninho', '/Gemini_Generated_Image_j8uirpj8uirpj8ui.png'),
  (2, 'Açai', '/Gemini_Generated_Image_jzlh94jzlh94jzlh.png'),
  (3, 'Yogo Morango', '/Gemini_Generated_Image_hj6gqzhj6gqzhj6g.png')
ON CONFLICT ("id") DO UPDATE SET "nome" = EXCLUDED."nome", "imagem" = EXCLUDED."imagem";
