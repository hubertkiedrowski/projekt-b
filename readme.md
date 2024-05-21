Beispielaufruf des Benchmarktestes:
  deno run -A src/main.ts -c src/config/testRunConfig.json -p "progress/topics/c6906727-fbd8-419a-809e-4a24de352d0d/trainings/26408628-a743-4f28-9d36-e4f7b4bcf636/questionnaires/4ec93c9d-53ac-4769-9ec0-d1c7220ed0c7/questions" -d content/basisschulungen/dokumentation.json

  flags:
    -d path to dokumentation.json
    -p path to training ,look example
    -c path to config.ts

Unittests:
  deno test -A 

readme auf vordermann bringen z.b.
 https://github.com/hubertkiedrowski/TypeStream/blob/main/README.md


zu testen:
  getTraininginfoSpecificTopic

