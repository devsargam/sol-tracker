import axios from "axios";
import cron from "node-cron";

const API_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd";

async function fetchSolanaPrice() {
  const response = await axios.get(API_URL);
  if (!response.data) {
    console.log("error fetching price");
    return;
  }

  if (!response.data.solana.usd) {
    console.log("Probably Ratelimited");
    return;
  }

  return response.data.solana.usd;
}

async function sendMessageToDiscord(message: string) {
  const body = {
    content: "Hello <@625651629743407104> \n" + message,
    tts: false,
    color: "white",
  };

  try {
    await axios.post(process.env.DISCORD_WEBHOOK_URL!, body);
  } catch (error) {
    console.log(error);
    console.log("Error sending message to discord");
  }
}

// Runs 20th minute of every hour
cron.schedule("20 * * * *", async () => {
  const price = await fetchSolanaPrice();
  if (!price) {
    return;
  }

  await sendMessageToDiscord(`Current price for Solana is ${price}`);
});
