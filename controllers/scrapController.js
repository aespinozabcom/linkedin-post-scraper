const { By, Key, Builder } = require("selenium-webdriver");
require("chromedriver");

const extraerPostLinkedin = async (req, res) => {
  const { link } = req.body;

  let descripcion = null;
  let contReacciones = 0;
  let contComentarios = 0;
  let contCompartidos = 0;

  try {
    const driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions({
        addArguments: [
          "start-maximized",
          "disable-infobars",
          "--disable-extensions",
          "--disable-gpu",
          "--headless",
          "--enable-features=NetworkService",
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--remote-debugging-port=9222",
        ],
      })
      .build();

    await driver.get("https://www.linkedin.com/");

    await driver
      .findElement(By.id("session_key"))
      .sendKeys(process.env.EMAIL_LK, Key.NULL);
    await driver
      .findElement(By.id("session_password"))
      .sendKeys(process.env.PASSWORD_LK, Key.RETURN);

    await driver.get(link);

    const titulos = await driver.findElements(By.css("span[dir='ltr']"));

    const titulosFinal = [];

    for await (const tl of titulos) {
      const texto = await tl.getText();

      titulosFinal.push(texto);
    }

    descripcion = titulosFinal[2];

    const reacciones = await driver.findElement(
      By.xpath(
        "/html/body/div[5]/div[3]/div/div/div[2]/div/div/main/div/section/div/div/div[5]/ul/li[1]/button/span"
      )
    );

    const numReacciones = await reacciones.getText();

    contReacciones = !isNaN(numReacciones) ? Number(numReacciones) : 0;

    const comentarios = await driver.findElements(
      By.xpath(
        "/html/body/div[5]/div[3]/div/div/div[2]/div/div/main/div/section/div/div/div[5]/ul/li[2]/button/span"
      )
    );

    const comentariosFinal = await comentarios[0].getText();

    contComentarios = Number(comentariosFinal.split(" ")[0]);

    const compartidos = await driver.findElement(
      By.xpath(
        "/html/body/div[5]/div[3]/div/div/div[2]/div/div/main/div/section/div/div/div[5]/ul/li[3]/button/span"
      )
    );

    const compartidosFinal = await compartidos.getText();

    contCompartidos = Number(compartidosFinal.split(" ")[0]);

    await driver.close();
  } catch (error) {
    console.error(error);
  }

  res
    .status(200)
    .json({ descripcion, contReacciones, contComentarios, contCompartidos });
};

module.exports = {
  extraerPostLinkedin,
};
