import React from "react";

import faqs from "../../data/FAQs.json";
import styles from "./FAQ.module.css";

class FAQ extends React.Component {
  render() {
    let questions = [];
    for (const [key, value] of Object.entries(faqs)) {
      const questionText = value["question"];
      const answerText = value["answer"];

      let question = (
        <div key={key} className={styles.itemContainer}>
          <div className={styles.questionContainer}>
            <div className={styles.questionNumber}>{String(key).toUpperCase()}</div>
            <div className={styles.questionText}>{questionText}</div>
          </div>
          <div className={styles.answer}>{answerText}</div>
        </div>
      );

      questions.push(question);
    }

    return <div className={styles.content}>{questions}</div>;
  }
}

export default FAQ;
