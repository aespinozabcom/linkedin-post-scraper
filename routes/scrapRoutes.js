const { Router } = require("express");
const { check } = require("express-validator");
const { extraerPostLinkedin } = require("../controllers/scrapController");
const { validarCampos } = require("../helpers/validar-campos");

const router = new Router();

router.post(
  "/",
  [
    check("link", "La descripcion es obligatoria").not().isEmpty(),
    check("link", "La descripcion debe ser un string").isString(),
    check("link")
      .custom((lk) => lk.includes("https://www.linkedin.com/posts"))
      .withMessage("El link debe ser de un post de linkedin"),
    validarCampos,
  ],
  extraerPostLinkedin
);

module.exports = router;
