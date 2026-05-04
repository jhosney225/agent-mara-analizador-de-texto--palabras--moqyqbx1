
```javascript
import Anthropic from "@anthropic-ai/sdk";
import * as readline from "readline";

const client = new Anthropic();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function analyzeText(text) {
  console.log("\n📊 Analizando texto...\n");

  const prompt = `Analiza el siguiente texto y proporciona un análisis completo con las siguientes estadísticas:

1. Número total de palabras
2. Número total de caracteres (con y sin espacios)
3. Número total de oraciones
4. Número total de párrafos
5. Palabra más frecuente
6. Longitud promedio de palabras
7. Longitud promedio de oraciones
8. Las 5 palabras más comunes
9. Índice de legibilidad (escala 1-10)
10. Análisis de sentimiento (positivo/negativo/neutral)

Texto a analizar:
"${text}"

Por favor, proporciona un análisis estructurado y detallado.`;

  try {
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const analysis = message.content[0];
    if (analysis.type === "text") {
      console.log("📈 ANÁLISIS DEL TEXTO:\n");
      console.log(analysis.text);
      console.log("\n" + "=".repeat(60) + "\n");
    }
  } catch (error) {
    console.error("Error al analizar el texto:", error);
  }
}

async function interactiveChat(text) {
  console.log("\n💬 Modo de conversación interactiva\n");
  console.log("Puedes hacer preguntas sobre el texto analizado.");
  console.log('Escribe "salir" para volver al menú principal.\n');

  const conversationHistory = [];

  const systemMessage = `Eres un asistente experto en análisis de textos. 
El usuario ha proporcionado el siguiente texto para analizar:

"${text}"

Responde preguntas detalladas sobre este texto, proporcionando análisis profundos sobre palabras, frases, estructura, 
sentimiento, estilo y cualquier otra métrica lingüística que sea relevante.`;

  while (true) {
    const userInput = await question("\n✏️  Tu pregunta: ");

    if (userInput.toLowerCase() === "salir") {
      console.log("Volviendo al menú principal...\n");
      break;
    }

    if (!userInput.trim()) {
      console.log("Por favor, ingresa una pregunta válida.");
      continue;
    }

    conversationHistory.push({
      role: "user",
      content: userInput,
    });

    try {
      const message = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system: systemMessage,
        messages: conversationHistory,
      });

      const assistantResponse = message.content[0];
      if (assistantResponse.type === "text") {
        console.log("\n🤖 Respuesta:");
        console.log(assistantResponse.text);

        conversationHistory.push({
          role: "assistant",
          content: assistantResponse.text,
        });
      }
    } catch (error) {
      console.error("Error al procesar la pregunta:", error);
    }
  }
}

async function suggestWritingImprovements(text) {
  console.log("\n✨ Generando sugerencias de mejora...\n");

  const prompt = `Analiza el siguiente texto y proporciona sugerencias específicas para mejorar:

1. Claridad y concisión
2. Estructura y organización
3. Vocabulario y terminología
4. Fluidez y cohesión
5. Errores gramaticales o de puntuación (si los hay)
6. Sugerencias de reescritura para párrafos específicos

Texto:
"${text}"

Proporciona sugerencias prácticas y ejemplos de cómo mejorar el texto.`;

  try {
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const suggestions = message.content[0];
    if (suggestions.type === "text") {
      console.log("💡 SUGERENCIAS DE MEJORA:\n");
      console.log(suggestions.text);
      console.log("\n" + "=".repeat(60) + "\n");
    }
  } catch (error) {
    console.error("Error al generar sugerencias:", error);
  }
}

async function main() {
  console.log("╔════════════════════════════════════════════════════════╗");
  console.log("║         ANALIZADOR AVANZADO DE TEXTOS v1.0             ║");
  console.log("║     Powered by Claude AI - Análisis Inteligente        ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  let continueAnalyzing = true;

  while (continueAnalyzing) {
    console.log("📝 MENÚ PRINCIPAL\n");
    console.log("1. Introducir nuevo texto");
    console