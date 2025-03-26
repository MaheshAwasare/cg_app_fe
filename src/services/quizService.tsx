export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
  }
  
  // Function to get random quiz questions using AI
  export async function getQuizQuestions(): Promise<QuizQuestion[]> {
    // In a real app, this would call an API to get questions
    // For now, returning hardcoded questions
    return [
      {
        question: "Which ancient civilization built the Great Pyramid of Giza?",
        options: ["Mayans", "Egyptians", "Romans", "Greeks"],
        correctAnswer: 1
      },
      {
        question: "Who was the first woman to win a Nobel Prize?",
        options: ["Mother Teresa", "Marie Curie", "Jane Addams", "Pearl Buck"],
        correctAnswer: 1
      },
      {
        question: "Which mountain range separates Europe from Asia?",
        options: ["Alps", "Himalayas", "Andes", "Urals"],
        correctAnswer: 3
      },
      {
        question: "What event marked the start of World War I?",
        options: [
          "The assassination of Archduke Franz Ferdinand",
          "The invasion of Poland",
          "The bombing of Pearl Harbor",
          "The Russian Revolution"
        ],
        correctAnswer: 0
      }
    ];
  }