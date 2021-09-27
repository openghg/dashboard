import PropTypes from "prop-types";
import React from "react";

import styles from "./QnA.module.css";

class QnA extends React.Component {
  render() {
    const questionNumber = this.props.number;
    const questionText = this.props.question;
    const answerText = this.props.answer;

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
