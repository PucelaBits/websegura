const test = require("ava");

const { getAllFiles, pathToObject } = require("../crawler/sites-parser");

test("verify twitter handlers are well-formed", (t) => {
  const files = getAllFiles();
  for (const file of files) {
    const json = pathToObject(file);
    for (const web of json.webs) {
      let twitter = web.twitter && web.twitter.trim();
      if (twitter !== undefined) {
        if (twitter === "") {
          t.fail(
            `No puede haber un Twitter que sea una cadena vacía. Si no conoces la cuenta de la entidad, elimina la propiedad 'twitter' en lugar de asignarle una cadena vacía. Ha ocurrido en la web ${JSON.stringify(
              web
            )} del archivo ${file}.`
          );
        }

        if (twitter.includes("@")) {
          t.fail(
            `No incluyas el símbolo '@' en el nombre de usuario de twitter. Ha ocurrido en la web ${JSON.stringify(
              web
            )} del archivo ${file}.`
          );
        }
      }
    }
  }
});
