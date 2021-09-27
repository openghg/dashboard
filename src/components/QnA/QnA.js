import PropTypes from "prop-types";
import React from "react";

import styles from "./QnA.module.css";

class QnA extends React.Component {
  render() {
    const questionNumber = this.props.number;
    const questionText = this.props.question;

    let answerText = this.props.answer;
    const split = this.props.split;

    if (answerText && split === true) {
      const splitText = answerText.split("\n").map((i) => {
        return <p>{i}</p>;
      });

      answerText = splitText;
    }

    let question = (
      <div className={styles.itemContainer}>
        <div className={styles.questionContainer}>
          <div className={styles.questionNumber}>{String(questionNumber).toUpperCase()}</div>
          <div className={styles.questionText}>{questionText}</div>
        </div>
        <div className={styles.answer}>{answerText}</div>
      </div>
    );

    return question;
  }
}

QnA.propTypes = {
  answer: PropTypes.string.isRequired,
  number: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
};

export default QnA;
