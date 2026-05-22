import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 AI Server orchestrating on running link: http://localhost:${PORT}`,
  );
});
