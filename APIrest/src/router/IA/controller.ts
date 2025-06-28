import { Request, Response } from 'express';
import { deepseek } from '../../server';

export const duvida = async (req: Request, res: Response) => {
  const { question, conversation_history } = req.body;
  console.log(req.body)
  if (!question) {
    res.status(400).json({ error: 'A pergunta é obrigatória.' });
  }

  let messagesForAI: any[] = [
    {
      role: "system",
      content: `Você é um assistente de ensino prestativo e experiente, focado em explicar conceitos de programação de forma clara e concisa. Responda as dúvidas do usuário.

        Sua resposta DEVE ser estritamente um objeto JSON. Você não deve incluir nenhum texto adicional antes ou depois do objeto JSON.
        O formato JSON DEVE ser:
        {
          "type": "conversation" | "quiz",
          "content": "Sua resposta conversacional aqui." | {
            "question": "A pergunta do quiz aqui.",
            "options": ["Opção 1", "Opção 2", "Opção 3", "Opção 4", "Opção 5"],
            "correct_answer": "A opção correta aqui."
          }
        }

        Se "type" for "quiz", o campo "content" DEVE ser um objeto contendo a pergunta, as opções e a resposta correta.
        Sugira um quiz APENAS se a pergunta do usuário for sobre um conceito específico que pode ser testado (ex: "O que é polimorfismo?", "Explique sobre loops em JavaScript?"). Se a conversa for mais aberta, casual, ou já incluiu um quiz recente, ou se você acabou de dar uma explicação completa, mantenha a conversa com "type": "conversation".`
    },
  ];

  if (conversation_history && Array.isArray(conversation_history)) {
    messagesForAI = messagesForAI.concat(conversation_history.map((item: any) => ({
      role: item.role,
      content: item.content
    })));
  }

  messagesForAI.push({ role: "user", content: question });

  try {
    const completion = await deepseek.chat.completions.create({
      model: "mistralai/mistral-7b-instruct",
      messages: messagesForAI,
      max_tokens: 1000,
      temperature: 0.7,
      response_format: { type: "json_object" }, 
    });

    const aiResponseContent = completion.choices[0].message.content;

    let parsedResponse: { type: string; content: any } = { type: '', content: null };

    const jsonMatch = aiResponseContent?.match(/\{[\s\S]*\}/); 
    if (jsonMatch && jsonMatch[0]) {
      try {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('Erro ao parsear o JSON extraído da IA:', parseError);
        console.error('Conteúdo RAW da IA:', aiResponseContent);
        res.status(500).json({
          error: 'A IA retornou um JSON inválido após a extração.',
          rawResponse: aiResponseContent,
          message: "Desculpe, não consegui processar isso agora. Poderia reformular sua pergunta?"
        });
      }
    } else {
      console.error('Nenhum objeto JSON válido encontrado na resposta da IA.');
      console.error('Conteúdo RAW da IA:', aiResponseContent);
      res.status(500).json({
        error: 'A IA não retornou um objeto JSON válido.',
        rawResponse: aiResponseContent,
        message: "Desculpe, não consegui entender a resposta da IA. Poderia reformular sua pergunta?"
      });
    }
    if (!parsedResponse) {
        console.error("parsedResponse is null after parsing attempt, but no error was returned previously.");
        res.status(500).json({
            error: "Erro interno: Falha inesperada ao processar a resposta da IA.",
            rawResponse: aiResponseContent,
            message: "Houve um problema inesperado."
        });
    }

    if (parsedResponse.type === "quiz") {
      const quizData = parsedResponse.content;

      if (
        typeof quizData === 'object' &&
        quizData !== null &&
        'question' in quizData &&
        Array.isArray(quizData.options) &&
        quizData.options.length >= 2 &&
        quizData.options.length <= 5 &&
        'correct_answer' in quizData &&
        quizData.options.includes(quizData.correct_answer)
      ) {
        res.status(200).json({
          type: "quiz",
          question: quizData.question,
          options: quizData.options,
          correct_answer: quizData.correct_answer
        });
      } else {
        console.error('Formato de quiz inválido ou incompleto recebido da IA:', quizData);
        res.status(500).json({
          error: 'A IA retornou um quiz em um formato inesperado ou incompleto.',
          rawResponse: aiResponseContent,
          message: "Desculpe, não consegui gerar o quiz com o formato correto agora. Poderia tentar novamente?"
        });
      }

    } else if (parsedResponse.type === "conversation") {
      res.status(200).json({
        type: "conversation",
        message: parsedResponse.content
      });
    } else {
      console.error('Tipo de resposta da IA desconhecido:', parsedResponse.type);
      res.status(500).json({
        error: 'A IA retornou um tipo de resposta desconhecido.',
        rawResponse: aiResponseContent,
        message: "Desculpe, não consegui processar sua solicitação agora. Poderia reformular?"
      });
    }

  } catch (err: any) {

    console.error('Erro ao interagir com a DeepSeek AI:', err);
    if (err.response) {
      console.error('Dados do erro da API DeepSeek:', err.response.data);
    }
    res.status(500).json({ error: 'Não foi possível obter uma resposta da IA no momento. Por favor, tente novamente mais tarde.' });
  }
};