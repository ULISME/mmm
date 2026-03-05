const express = require("express");

const app = express();
app.use(express.json());

const AUTH =
"MDE5YzIzZGMtZDVkMS03NGY1LWEwZTktZjM3ZmYwMTYxMWQzOmIwMWMxOTBhLWI3NmUtNDczYy1hZDYwLTY1NGIwNDA1NGY3NQ==";

app.post("/analyze", async (req, res) => {

  const prompt = req.body.prompt;

  try {

    const oauth = await fetch("https://ngw.devices.sberbank.ru/api/v2/oauth", {
      method: "POST",
      headers: {
        Authorization: "Basic " + AUTH,
        "Content-Type": "application/x-www-form-urlencoded",
        RqUID: crypto.randomUUID()
      },
      body: "scope=GIGACHAT_API_PERS"
    });

    const oauthData = await oauth.json();

    const ai = await fetch("https://gigachat.devices.sberbank.ru/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + oauthData.access_token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "GigaChat",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await ai.json();

    const text =
      data?.choices?.[0]?.message?.content || "Не удалось получить анализ";

    res.json({ text });

  } catch (e) {

    res.json({ text: "Ошибка анализа" });

  }

});

app.listen(3000);
